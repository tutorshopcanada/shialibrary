// Layer 3 of the search: "related by meaning". Pure module: no DOM, no storage, no network of its own.
//
// It MEASURES how close a query is to each catalog record and never writes text. A small open-source
// "static" embedding model (minishlab/potion-base-4M, MIT licence; see data/l3/NOTICE.txt) turns any text
// into a 128-number vector: lower-case it, cut it into word pieces, average the pieces' vectors, scale to
// unit length. Record vectors are computed at build time with this same code (scripts/build_vectors.mjs),
// so a query is compared with the records on the visitor's own device. Nothing typed leaves the device.
//
// Files (self-hosted under data/l3/): model.json, vocab.txt (the full vocabulary, so word-piece cutting is
// identical to the reference tokenizer), tokens.q4 + tokens.scale + tokens.keep (vectors for the kept word
// pieces only: 4-bit, float16 scale per row, and a bitmap saying which pieces have a row; a piece without a
// row contributes nothing), records.i8 + records.scale + records.json (the catalog's vectors).

const WS = /[\s   -   　]/u;
const CONTROL = /[\p{Cc}\p{Cf}\p{Cs}\p{Co}\p{Cn}]/u;
const PUNCT = /[\p{P}]/u;
const MARK = /\p{Mn}/gu;
const CJK = /[㐀-䶿一-鿿豈-﫿\u{20000}-\u{2a6df}\u{2a700}-\u{2b73f}\u{2b740}-\u{2b81f}\u{2b820}-\u{2ceaf}\u{2f800}-\u{2fa1f}]/u;
const ASCII_PUNCT = (c) => {
  const n = c.codePointAt(0);
  return (n >= 33 && n <= 47) || (n >= 58 && n <= 64) || (n >= 91 && n <= 96) || (n >= 123 && n <= 126);
};

/** BERT-style basic tokenization (what the model's own tokenizer does before word pieces). */
export function basicTokens(text) {
  let out = '';
  for (const ch of String(text)) {
    if (ch === '\0' || ch === '�') continue;
    if (ch === '\t' || ch === '\n' || ch === '\r' || WS.test(ch)) { out += ' '; continue; }
    if (CONTROL.test(ch)) continue;
    out += CJK.test(ch) ? ` ${ch} ` : ch;
  }
  out = out.normalize('NFD').replace(MARK, '').toLowerCase();
  const words = [];
  let cur = '';
  const flush = () => { if (cur) { words.push(cur); cur = ''; } };
  for (const ch of out) {
    if (ch === ' ') flush();
    else if (ASCII_PUNCT(ch) || PUNCT.test(ch)) { flush(); words.push(ch); }
    else cur += ch;
  }
  flush();
  return words;
}

/** Word pieces for one word (greedy longest match). Returns null when the word is unknown. */
function wordPieces(word, vocab, maxChars = 100) {
  const chars = [...word];
  if (chars.length > maxChars) return null;
  const ids = [];
  let start = 0;
  while (start < chars.length) {
    let end = chars.length, found = -1;
    while (start < end) {
      let piece = chars.slice(start, end).join('');
      if (start > 0) piece = '##' + piece;
      const id = vocab.get(piece);
      if (id !== undefined) { found = id; break; }
      end--;
    }
    if (found === -1) return null;
    ids.push(found);
    start = end;
  }
  return ids;
}

function half(h) {
  const e = (h >> 10) & 31, m = h & 1023, sgn = h & 0x8000 ? -1 : 1;
  if (e === 0) return sgn * m * 2 ** -24;
  if (e === 31) return m ? NaN : sgn * Infinity;
  return sgn * (1 + m / 1024) * 2 ** (e - 15);
}

export function createSemantic({ meta, vocabText, tokenVecs, tokenScales, tokenKeep, recordVecs, recordScales, recordIds }) {
  const dim = meta.dim;
  const vocab = new Map();
  vocabText.split('\n').forEach((t, i) => { if (t !== '' || i < meta.vocab_size) vocab.set(t, i); });
  const i8 = (buf) => (buf instanceof Int8Array ? buf : new Int8Array(buf));
  const f32 = (buf) => (buf instanceof Float32Array ? buf : new Float32Array(buf));
  const u8 = (buf) => (buf instanceof Uint8Array ? buf : new Uint8Array(buf));
  const TV = u8(tokenVecs), KEEP = u8(tokenKeep);
  const u16 = new Uint16Array(u8(tokenScales).slice().buffer);
  const TS = Float32Array.from(u16, half);
  const half_dim = dim >> 1;
  // rowOf[pieceId] = row in TV, or -1 when the piece was pruned (no vector)
  const rowOf = new Int32Array(meta.vocab_size).fill(-1);
  for (let id = 0, row = 0; id < meta.vocab_size; id++) if (KEEP[id >> 3] & (1 << (id & 7))) rowOf[id] = row++;
  const RV = recordVecs ? i8(recordVecs) : null, RS = recordScales ? f32(recordScales) : null;

  /** Token ids for a text; unknown words are dropped (as the model does). */
  function tokenIds(text) {
    const ids = [];
    for (const w of basicTokens(text)) {
      const p = wordPieces(w, vocab);
      if (p) for (const id of p) ids.push(id);
    }
    return ids;
  }

  /** Vector for a text (unit length unless some of its pieces were pruned, then slightly shorter), or null when no word is known. */
  function embed(text) {
    const ids = tokenIds(text);
    if (!ids.length) return null;
    const v = new Float32Array(dim);
    let used = 0, dropped = 0;
    for (const id of ids) {
      const row = rowOf[id];
      if (row < 0) { dropped++; continue; }
      used++;
      const s = TS[row], o = row * half_dim;
      for (let j = 0; j < half_dim; j++) {
        const b = TV[o + j];
        v[2 * j] += ((b & 15) - 8) * s;
        v[2 * j + 1] += ((b >> 4) - 8) * s;
      }
    }
    if (!used) return null;
    let n = dropped * (meta.pruned_noise || 0); // a pruned (rare) piece still dilutes the average, as its own vector would have

    for (let k = 0; k < dim; k++) n += v[k] * v[k];
    n = Math.sqrt(n) || 1;
    for (let k = 0; k < dim; k++) v[k] /= n;
    return v;
  }

  /** Quantise a batch of unit vectors for storage (used by the build script). */
  function quantise(vectors) {
    const n = vectors.length, q = new Int8Array(n * dim), s = new Float32Array(n);
    vectors.forEach((v, i) => {
      let m = 0;
      if (v) for (let k = 0; k < dim; k++) m = Math.max(m, Math.abs(v[k]));
      const sc = m > 0 ? m / 127 : 1;
      s[i] = sc;
      if (v) for (let k = 0; k < dim; k++) q[i * dim + k] = Math.max(-127, Math.min(127, Math.round(v[k] / sc)));
    });
    return { q, s };
  }

  /** The records closest in meaning to the query, best first: [{ id, score }]. */
  function rank(query, limit = 60) {
    if (!RV) return [];
    const qv = embed(query);
    if (!qv) return [];
    const n = recordIds.length, scores = new Float32Array(n);
    for (let r = 0; r < n; r++) {
      const o = r * dim;
      let d = 0;
      for (let k = 0; k < dim; k++) d += qv[k] * RV[o + k];
      scores[r] = d * RS[r];
    }
    const order = Array.from(scores.keys()).sort((a, b) => scores[b] - scores[a]).slice(0, limit);
    return order.map((r) => ({ id: recordIds[r], score: scores[r] }));
  }

  return { dim, meta, tokenIds, embed, quantise, rank, recordCount: recordIds ? recordIds.length : 0 };
}

/**
 * Load the model and the record vectors. `read(url, kind)` returns text (kind 'text'), JSON ('json') or an
 * ArrayBuffer ('buffer'); it defaults to fetch so the page can call loadSemantic('data/l3/').
 * `onProgress(fraction)` is optional.
 */
export async function loadSemantic(base, read, onProgress) {
  const get = read || (async (url, kind) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
    return kind === 'json' ? res.json() : kind === 'text' ? res.text() : res.arrayBuffer();
  });
  const names = ['model.json', 'vocab.txt', 'tokens.scale', 'tokens.keep', 'records.json', 'records.scale', 'tokens.q4', 'records.i8'];
  const kinds = { 'model.json': 'json', 'vocab.txt': 'text', 'records.json': 'json' };
  const got = {};
  let done = 0;
  for (const n of names) {
    got[n] = await get(base + n, kinds[n] || 'buffer');
    done++;
    if (onProgress) onProgress(done / names.length);
  }
  return createSemantic({
    meta: got['model.json'], vocabText: got['vocab.txt'], tokenVecs: got['tokens.q4'], tokenScales: got['tokens.scale'], tokenKeep: got['tokens.keep'],
    recordVecs: got['records.i8'], recordScales: got['records.scale'], recordIds: got['records.json'].ids,
  });
}

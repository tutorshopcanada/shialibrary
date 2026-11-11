// Type-ahead suggestions. Pure module: no DOM, no network, no storage.
// Everything is matched against the already-loaded index.json by plain rules.
// Nothing is generated: every suggestion is an existing question, topic name,
// scholar name or work/section title from the catalog.

import { normalize } from './search.js';

const KIND_RANK = { question: 0, topic: 1, scholar: 2, title: 3 };
const DEFAULT_CAPS = { question: 4, topic: 3, scholar: 2, title: 3 };
const LEVEL_RANK = { beginner: 0, intermediate: 1, advanced: 2 };
const NON_LATIN = /[^\u0000-ɏḀ-ỿ]/;

/**
 * @param {object} index  parsed site/data/index.json
 * @param {object} [options]  { caps: {question, topic, scholar, title}, minChars }
 */
export function createSuggester(index, options = {}) {
  const caps = { ...DEFAULT_CAPS, ...(options.caps || {}) };
  const minChars = options.minChars || 2;
  const entries = []; // one per item; each holds its matchable variants

  const variant = (text, isMain) => {
    const norm = normalize(text);
    return norm ? { text, norm, padded: ' ' + norm, words: norm.split(' '), isMain } : null;
  };
  const add = (kind, key, display, target, texts, level = 0) => {
    const variants = texts.map((t, i) => variant(t, i === 0)).filter(Boolean);
    if (variants.length) entries.push({ kind, key, display, target, variants, level });
  };

  for (const q of index.questions || []) {
    if (!q.question) continue;
    add('question', q.id, q.question, { query: q.question }, [q.question, ...(q.alt_phrasings || [])]);
  }
  for (const h of index.headings || []) {
    if (!h.label) continue;
    add('topic', h.id, h.label, { topic: h.id }, [h.label, ...(h.alt_terms || [])]);
  }
  for (const s of index.scholars || []) {
    if (!s.name) continue;
    add('scholar', s.id, s.name, { query: s.name }, [s.name, ...(s.alt_names || [])]);
  }
  // Titles: works and sections only (never single Q&A items); near-identical titles collapse
  // into one, keeping the most beginner-friendly.
  const byTitle = new Map();
  for (const r of index.records || []) {
    if (!r.title || (r.granularity !== 'work' && r.granularity !== 'section')) continue;
    const key = normalize(r.title).replace(/^(the|a|an) /, '');
    const lvl = LEVEL_RANK[r.level] ?? 1;
    const prev = byTitle.get(key);
    if (!prev || lvl < prev.level) byTitle.set(key, { r, level: lvl });
  }
  for (const [key, { r, level }] of byTitle) {
    add('title', key, r.title, { query: r.title, id: r.id }, [r.title], level);
  }

  /** 0 = whole-text prefix, 1 = prefix of some word, 2 = every typed word is a word prefix; -1 = none. */
  function score(v, typed, tokens) {
    if (v.norm.startsWith(typed)) return 0;
    if (v.padded.includes(' ' + typed)) return 1;
    if (tokens.length > 1 && tokens.every((t) => v.words.some((w) => w.startsWith(t)))) return 2;
    return -1;
  }

  function suggest(typedRaw, limit = 8) {
    const typed = normalize(typedRaw);
    if (!typed) return [];
    if (typed.length < (NON_LATIN.test(typed) ? 1 : minChars)) return [];
    const tokens = typed.split(' ');
    const hits = [];
    for (const e of entries) {
      let best = -1, via = null;
      for (const v of e.variants) {
        let s = score(v, typed, tokens);
        // A match through an alternate phrasing is a little weaker than one on the main text.
        if (s !== -1 && !v.isMain) s += 0.5;
        if (s !== -1 && (best === -1 || s < best || (s === best && v.isMain && !via.isMain))) { best = s; via = v; }
      }
      if (best === -1) continue;
      // A bare "(alt)" is shown only when the match came through an alternate term and not the main text.
      let text = e.display;
      if (!via.isMain && (e.kind === 'topic' || e.kind === 'scholar') && via.norm !== normalize(e.display)) {
        text = `${e.display} (${via.text})`;
      }
      hits.push({ e, score: best, text });
    }
    hits.sort((a, b) =>
      a.score - b.score ||
      KIND_RANK[a.e.kind] - KIND_RANK[b.e.kind] ||
      a.e.level - b.e.level ||
      a.text.length - b.text.length ||
      (a.text < b.text ? -1 : a.text > b.text ? 1 : 0));
    const used = { question: 0, topic: 0, scholar: 0, title: 0 };
    const out = [];
    for (const h of hits) {
      if (used[h.e.kind] >= caps[h.e.kind]) continue;
      used[h.e.kind]++;
      out.push({ text: h.text, kind: h.e.kind, target: h.e.target, ranges: highlightRanges(h.text, tokens) });
      if (out.length >= limit) break;
    }
    return out;
  }

  /** Empty-focus suggestions: the first few starter questions, in catalog order. */
  function starters(limit = 5) {
    return (index.questions || []).filter((q) => q.question).slice(0, limit).map((q) => ({
      text: q.question, kind: 'question', target: { query: q.question }, ranges: [],
    }));
  }

  return { suggest, starters };
}

/**
 * Character ranges [start, end) in `text` to show in bold: the start of each word that a typed
 * word is a prefix of. Works on the original text so diacritics and punctuation survive.
 */
export function highlightRanges(text, tokens) {
  const ranges = [];
  const re = /[\p{L}\p{N}'‘’ʻʼʿʾ`´\p{M}]+/gu;
  const used = new Set();
  let m;
  while ((m = re.exec(text))) {
    const word = m[0];
    const nw = normalize(word);
    if (!nw) continue;
    const ti = tokens.findIndex((t, i) => !used.has(i) && nw.startsWith(t));
    if (ti === -1) continue;
    used.add(ti);
    let need = tokens[ti].length, end = 0;
    for (const ch of word) {
      end += ch.length;
      need -= normalize(ch).length;
      if (need <= 0) break;
    }
    // Include trailing combining marks of the last matched letter.
    while (end < word.length && /\p{M}/u.test(word[end])) end++;
    ranges.push([m.index, m.index + end]);
  }
  return ranges;
}

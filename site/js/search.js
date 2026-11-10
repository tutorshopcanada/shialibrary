// Search logic for the catalog. Pure module: no DOM, no network, no storage.
// The page (app.js) and the eval runner (scripts/eval_search.mjs) both import
// this same file, so what is tested is what visitors get.
//
// It only RETRIEVES and RANKS human-written catalog records. Nothing here
// writes text. Layers (CLAUDE.md section 11):
//   1. curated starter questions and topic headings
//   2. keyword search (BM25-style, hand-built synonyms from the vocabulary)
//   4. graceful fallback
// (Layer 3, vector search, is Phase 2 and deliberately absent.)

// ---------------------------------------------------------------------------
// Defaults. config/search.yaml (copied into index.json) overrides these.
// ---------------------------------------------------------------------------
export const DEFAULT_CONFIG = {
  layer1: { question_min_similarity: 0.8, heading_max_questions: 4 },
  layer2: {
    field_weights: {
      title: 3.0, sample_questions: 2.0, headings: 1.5, scholars: 1.5,
      description: 1.0, ancestor_headings: 0.6, context: 0.5, other: 0.3,
    },
    bm25: { k1: 1.2, b: 0.75 },
    prefix: { enabled: true, min_length: 3, weight: 0.4, max_expansions: 40 },
    concept_weight: 2.5,
    phrase_boost: 1.6,
    min_score: 1.0,
    min_term_coverage: 0.5,
    min_results: 1,
    min_result_coverage: 0.34,
    max_results: 150,
  },
  exact: {
    stopwords: ['a', 'an', 'the', 'of', 'in', 'on', 'at', 'to', 'for', 'from', 'by', 'with',
      'about', 'and', 'or', 'is', 'are', 'was', 'were', 'be', 'been', 'am', 'do', 'does',
      'did', 'can', 'could', 'should', 'would', 'will', 'may', 'i', 'we', 'you', 'they',
      'he', 'she', 'it', 'my', 'our', 'your', 'their', 'me', 'us', 'what', 'why', 'how',
      'who', 'whom', 'when', 'where', 'which', 'that', 'this', 'these', 'those', 'there',
      'if', 'as', 'so', 'not', 'no', 'any', 'some', 'have', 'has', 'had', 'get', 'one'],
    generic_terms: ['shia', 'shias', "shi'a", 'shiite', 'shiites', 'shii', 'shiism', 'islam',
      'islamic', 'muslim', 'muslims', 'twelver', 'twelvers'],
  },
  ranking: {
    default_order: 'beginner',
    exact_group_order: 'strict',
    level_boost: { beginner: 1.5, intermediate: 1.2, advanced: 1.0 },
    deeper_boost: { beginner: 1.0, intermediate: 1.2, advanced: 1.5 },
  },
  tags: {
    order: ['fiqh', 'hadith', 'book', 'article', 'course', 'lecture', 'other'],
    labels: { fiqh: 'Fiqh', hadith: 'Hadith', book: 'Book', article: 'Article',
      course: 'Course', lecture: 'Lecture', other: 'Other' },
  },
  levels: {
    order: ['beginner', 'intermediate', 'advanced'],
    labels: { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' },
  },
  grouping: { min_items: 3 },
};

const FIELDS = ['title', 'sample_questions', 'headings', 'scholars', 'description',
  'ancestor_headings', 'context', 'other'];
const GRANULARITY_RANK = { work: 0, section: 1, item: 2 };
const MAX_KEY_TERMS = 24;

function mergeConfig(base, over) {
  if (!over || typeof over !== 'object' || Array.isArray(over)) return over === undefined ? base : over;
  const out = { ...base };
  for (const k of Object.keys(over)) {
    const b = base ? base[k] : undefined;
    out[k] = (b && typeof b === 'object' && !Array.isArray(b)) ? mergeConfig(b, over[k]) : over[k];
  }
  return out;
}

// ---------------------------------------------------------------------------
// Text normalization (plain rules)
// ---------------------------------------------------------------------------

/** Lowercase, strip diacritics and punctuation. "Qur'ān" -> "quran", "Ḥusayn" -> "husayn". */
export function normalize(input) {
  return String(input == null ? '' : input)
    .normalize('NFKD')
    .replace(/\p{M}+/gu, '')            // combining marks: Latin diacritics, Arabic vowel signs
    .replace(/ـ/g, '')             // Arabic tatweel
    .replace(/[یى]/g, 'ي') // Persian/Urdu yeh, alef maksura -> Arabic yeh
    .replace(/ک/g, 'ك')       // Persian kaf -> Arabic kaf
    .toLowerCase()
    .replace(/['‘’ʻʼʿʾ`´]/g, '') // apostrophes, ayn/hamza marks
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

/** Very light English stemmer: plurals and -ing. Applied to index and query alike. */
export function stem(tok) {
  if (tok.length < 4 || !/^[a-z]+$/.test(tok)) return tok;
  let t = tok;
  if (t.endsWith('ies') && t.length > 4) t = t.slice(0, -3) + 'y';
  else if (/(ss|x|z|ch|sh)es$/.test(t)) t = t.slice(0, -2);
  else if (t.endsWith('s') && !/(ss|us|is)$/.test(t)) t = t.slice(0, -1);
  if (t.endsWith('ing') && t.length >= 6) t = t.slice(0, -3);
  return t;
}

/** Normalized, stemmed tokens (stopwords kept). */
export function tokenize(input) {
  const n = normalize(input);
  return n ? n.split(' ').map(stem) : [];
}

/** Two words count as the same when equal, or one is the other plus 1-2 letters (pray / prayer). */
function near(a, b) {
  if (a === b) return true;
  const [s, l] = a.length <= b.length ? [a, b] : [b, a];
  return s.length >= 4 && l.length - s.length <= 2 && l.startsWith(s);
}

function pad(tokens) { return ' ' + tokens.join(' ') + ' '; }

// ---------------------------------------------------------------------------
// Engine
// ---------------------------------------------------------------------------

/**
 * Build the in-memory search engine from the parsed index.json.
 * @param {object} index  contents of site/data/index.json
 */
export function createEngine(index) {
  const config = mergeConfig(DEFAULT_CONFIG, index.config || {});
  const stopSet = new Set(config.exact.stopwords.map((w) => stem(normalize(w))));
  const genericSet = new Set(config.exact.generic_terms.map((w) => stem(normalize(w))));

  const records = index.records || [];
  const headings = index.headings || [];
  const scholars = index.scholars || [];
  const sources = index.sources || [];
  const questions = index.questions || [];
  const paths = index.paths || [];

  const recordById = new Map(records.map((r) => [r.id, r]));
  const headingById = new Map(headings.map((h) => [h.id, h]));
  const scholarById = new Map(scholars.map((s) => [s.id, s]));
  const sourceById = new Map(sources.map((s) => [s.id, s]));
  const pathById = new Map(paths.map((p) => [p.id, p]));

  // ---- Concept table: every heading term / scholar name -> what it means ----
  const concepts = new Map(); // "stemmed phrase" -> { headings:Set, scholars:Set }
  const headingPhrases = new Map(); // heading id -> [" padded phrase ", ...]
  let maxPhraseLen = 1;
  function addConcept(text, kind, id) {
    const toks = tokenize(text);
    if (!toks.length || toks.length > 8) return null;
    const key = toks.join(' ');
    let c = concepts.get(key);
    if (!c) { c = { headings: new Set(), scholars: new Set() }; concepts.set(key, c); }
    c[kind].add(id);
    if (toks.length > maxPhraseLen) maxPhraseLen = toks.length;
    return key;
  }
  function labelVariants(label) {
    // "Prayer (Salah)" -> "Prayer (Salah)", "Prayer", "Salah"
    const out = [label];
    const m = /^([^()]+)\(([^()]+)\)\s*$/.exec(label);
    if (m) out.push(m[1], m[2]);
    return out;
  }
  for (const h of headings) {
    const keys = new Set();
    for (const term of [...labelVariants(h.label), ...(h.alt_terms || [])]) {
      const key = addConcept(term, 'headings', h.id);
      if (key) keys.add(' ' + key + ' ');
    }
    headingPhrases.set(h.id, [...keys]);
  }
  for (const s of scholars) {
    for (const name of [s.name, ...(s.alt_names || [])]) addConcept(name, 'scholars', s.id);
  }

  // ---- Per-record search documents ----
  const headingText = (ids) => ids.map((id) => {
    const h = headingById.get(id);
    return h ? [h.label, ...(h.alt_terms || [])].join(' . ') : '';
  }).join(' . ');
  const scholarText = (ids) => ids.map((id) => {
    const s = scholarById.get(id);
    return s ? [s.name, ...(s.alt_names || [])].join(' . ') : '';
  }).join(' . ');

  const docs = records.map((r) => {
    const people = [...new Set([...(r.authors || []), ...(r.instructors || []), ...(r.marja ? [r.marja] : [])])];
    const ctx = r.context || {};
    const src = sourceById.get(r.source);
    const fieldText = {
      title: r.title || '',
      sample_questions: (r.sample_questions || []).join(' . '),
      headings: headingText(r.headings || []),
      scholars: scholarText(people),
      description: r.description || '',
      ancestor_headings: headingText(r.inherited_headings || []),
      context: [ctx.section && ctx.section.title, ctx.work && ctx.work.title].filter(Boolean).join(' . '),
      other: [r.source, src && src.name, r.location, r.title_original, r.provider,
        config.tags.labels[r.content_tag], r.type].filter(Boolean).join(' . '),
    };
    // "tq": title + sample questions, the fields the exact-match rule looks at.
    const tqParts = [r.title || '', ...(r.sample_questions || [])].map(tokenize);
    const tqTokens = new Set();
    for (const part of tqParts) for (const t of part) tqTokens.add(t);
    return {
      record: r,
      people: new Set(people),
      ownHeadings: new Set(r.headings || []),
      allHeadings: new Set([...(r.headings || []), ...(r.inherited_headings || [])]),
      ancestors: new Set(r.ancestors || []),
      fieldText,
      tq: tqParts.map(pad).join('|'),
      tqTokens: [...tqTokens],
      desc: pad(tokenize(r.description || '')),
    };
  });

  // ---- Inverted index (BM25 over fields) ----
  const postings = new Map(); // term -> [docIdx, fieldIdx, tf, ...] flat array
  const fieldLen = FIELDS.map(() => new Float32Array(docs.length));
  const avgLen = FIELDS.map(() => 0);
  const docFreq = new Map();
  docs.forEach((doc, d) => {
    const seen = new Set();
    FIELDS.forEach((f, fi) => {
      const toks = tokenize(doc.fieldText[f]).filter((t) => !stopSet.has(t));
      fieldLen[fi][d] = toks.length;
      avgLen[fi] += toks.length;
      const tf = new Map();
      for (const t of toks) tf.set(t, (tf.get(t) || 0) + 1);
      for (const [t, n] of tf) {
        let p = postings.get(t);
        if (!p) { p = []; postings.set(t, p); }
        p.push(d, fi, n);
        seen.add(t);
      }
    });
    for (const t of seen) docFreq.set(t, (docFreq.get(t) || 0) + 1);
    delete doc.fieldText;
  });
  for (let i = 0; i < FIELDS.length; i++) avgLen[i] = docs.length ? avgLen[i] / docs.length || 1 : 1;
  const terms = [...postings.keys()].sort();
  const N = docs.length;
  const idf = (t) => {
    const df = docFreq.get(t) || 0;
    return Math.log(1 + (N - df + 0.5) / (df + 0.5));
  };
  const weights = FIELDS.map((f) => Number(config.layer2.field_weights[f]) || 0);

  function prefixTerms(prefix, max) {
    let lo = 0, hi = terms.length;
    while (lo < hi) { const mid = (lo + hi) >> 1; if (terms[mid] < prefix) lo = mid + 1; else hi = mid; }
    const out = [];
    for (let i = lo; i < terms.length && out.length < max && terms[i].startsWith(prefix); i++) {
      if (terms[i] !== prefix) out.push(terms[i]);
    }
    return out;
  }

  // ---- Query analysis ----
  function analyze(rawQuery) {
    const raw = String(rawQuery || '').slice(0, 300);
    const quoted = [];
    raw.replace(/"([^"]+)"/g, (_, p) => { const t = tokenize(p); if (t.length) quoted.push(pad(t)); return ''; });
    const tokens = tokenize(raw);
    const isStop = tokens.map((t) => stopSet.has(t));
    const allStop = isStop.every(Boolean);

    // Greedy longest-match of heading terms and scholar names in the query.
    const spans = [];
    const inSpan = tokens.map(() => -1);
    for (let i = 0; i < tokens.length;) {
      let matched = 0;
      for (let len = Math.min(maxPhraseLen, tokens.length - i); len >= 1; len--) {
        const slice = tokens.slice(i, i + len);
        const c = concepts.get(slice.join(' '));
        if (!c) continue;
        if (!allStop && slice.every((t) => stopSet.has(t))) continue;
        for (let j = i; j < i + len; j++) inSpan[j] = spans.length;
        spans.push({ start: i, len, headings: [...c.headings], scholars: [...c.scholars] });
        matched = len;
        break;
      }
      i += matched || 1;
    }

    // Key terms: what ranking and the exact-match rule work with.
    const keyTerms = [];
    const keyIndex = new Map();
    tokens.forEach((t, i) => {
      if (isStop[i] && !allStop) return;
      if (!keyIndex.has(t) && keyTerms.length < MAX_KEY_TERMS) { keyIndex.set(t, keyTerms.length); keyTerms.push(t); }
    });
    const isGeneric = keyTerms.map((t) => genericSet.has(t));
    const hasSpecific = isGeneric.some((g) => !g);

    // Units for the exact-match rule: each concept span, and each remaining key term.
    let units = [];
    spans.forEach((sp) => {
      const toks = tokens.slice(sp.start, sp.start + sp.len).filter((t) => keyIndex.has(t));
      units.push({ tokens: [...new Set(toks)], headings: sp.headings, scholars: sp.scholars });
    });
    tokens.forEach((t, i) => {
      if (inSpan[i] === -1 && keyIndex.has(t) && !units.some((u) => !u.headings && u.tokens[0] === t)) {
        units.push({ tokens: [t], headings: null, scholars: null });
      }
    });
    units.forEach((u) => { u.generic = u.tokens.every((t) => genericSet.has(t)); });
    if (units.some((u) => !u.generic)) units = units.filter((u) => !u.generic);

    return {
      raw, tokens, quoted, spans, keyTerms, keyIndex, isGeneric, hasSpecific, units,
      phrase: tokens.length >= 2 ? pad(tokens) : null,
    };
  }

  /** Key-word set used to compare a query with a curated question. */
  function keySet(tokens) {
    const noStop = tokens.filter((t) => !stopSet.has(t));
    const specific = noStop.filter((t) => !genericSet.has(t));
    return [...new Set(specific.length ? specific : noStop.length ? noStop : tokens)];
  }
  function similarity(a, b) {
    if (!a.length || !b.length) return 0;
    const used = new Set();
    let hit = 0;
    for (const x of a) {
      const j = b.findIndex((y, k) => !used.has(k) && near(x, y));
      if (j !== -1) { used.add(j); hit++; }
    }
    return (2 * hit) / (a.length + b.length);
  }
  const questionKeys = questions.map((q) => [q.question, ...(q.alt_phrasings || [])].map((p) => {
    const toks = tokenize(p);
    return { full: toks.join(' '), keys: keySet(toks) };
  }));

  // ---- Layer 1 ----
  function layer1(qa) {
    if (!qa.tokens.length) return null;
    const full = qa.tokens.join(' ');
    const qKeys = keySet(qa.tokens);
    let best = null, bestScore = 0;
    questions.forEach((q, i) => {
      for (const cand of questionKeys[i]) {
        const s = cand.full === full ? 1.01 : similarity(qKeys, cand.keys);
        if (s > bestScore) { bestScore = s; best = q; }
      }
    });
    const out = { question: null, heading: null, path: null, questions: [] };
    if (best && bestScore >= config.layer1.question_min_similarity) {
      out.question = best;
      out.path = best.path ? pathById.get(best.path) || null : null;
    }
    // Topic heading: the whole query is one label / alternate term of a heading.
    const covering = qa.spans.find((sp) => sp.headings.length &&
      qa.tokens.every((t, i) => stopSet.has(t) || (i >= sp.start && i < sp.start + sp.len)));
    if (covering) {
      const h = headingById.get(covering.headings[0]);
      if (h) {
        out.heading = h;
        const family = new Set([h.id, ...headings.filter((x) => (x.ancestors || []).includes(h.id)).map((x) => x.id)]);
        const direct = questions.filter((q) => (q.headings || []).includes(h.id));
        const below = questions.filter((q) => !direct.includes(q) && (q.headings || []).some((id) => family.has(id)));
        out.questions = [...direct, ...below]
          .filter((q) => q !== out.question)
          .slice(0, config.layer1.heading_max_questions);
        if (!out.question && !out.path) {
          const withPath = direct.find((q) => q.path && pathById.has(q.path));
          if (withPath) out.path = pathById.get(withPath.path);
        }
      }
    }
    return (out.question || out.heading) ? out : null;
  }

  // ---- Layer 2 scoring ----
  function keywordScores(qa) {
    const { k1, b } = config.layer2.bm25;
    const px = config.layer2.prefix;
    const score = new Float64Array(N);
    const mask = new Int32Array(N);
    const addPostings = (term, bit, factor) => {
      const p = postings.get(term);
      if (!p) return;
      const w = idf(term) * factor;
      for (let i = 0; i < p.length; i += 3) {
        const d = p[i], fi = p[i + 1], tf = p[i + 2];
        const norm = tf * (k1 + 1) / (tf + k1 * (1 - b + b * fieldLen[fi][d] / avgLen[fi]));
        score[d] += w * weights[fi] * norm;
        mask[d] |= bit;
      }
    };
    qa.keyTerms.forEach((t, i) => {
      const bit = 1 << i;
      addPostings(t, bit, 1);
      if (px.enabled && t.length >= px.min_length) {
        for (const longer of prefixTerms(t, px.max_expansions)) addPostings(longer, bit, px.weight);
      }
    });
    // Concepts: a heading or scholar named by any of its alternate terms.
    for (const sp of qa.spans) {
      let bits = 0, n = 0;
      for (let j = sp.start; j < sp.start + sp.len; j++) {
        const k = qa.keyIndex.get(qa.tokens[j]);
        if (k !== undefined && !(bits & (1 << k))) { bits |= 1 << k; n++; }
      }
      const bonus = config.layer2.concept_weight * Math.max(1, n);
      for (let d = 0; d < N; d++) {
        const doc = docs[d];
        let f = 0;
        for (const h of sp.headings) {
          if (doc.ownHeadings.has(h)) { f = 1; break; }
          if (doc.allHeadings.has(h)) f = Math.max(f, 0.5);
        }
        if (f < 1 && sp.scholars.some((s) => doc.people.has(s))) f = 1;
        if (f) { score[d] += bonus * f; mask[d] |= bits; }
      }
    }
    return { score, mask };
  }

  function coverage(qa, mask) {
    let hit = 0, total = 0;
    for (let i = 0; i < qa.keyTerms.length; i++) {
      if (qa.hasSpecific && qa.isGeneric[i]) continue;
      total++;
      if (mask & (1 << i)) hit++;
    }
    return total ? hit / total : 0;
  }

  // ---- Exact-match rule (plain rules, no model) ----
  function unitSatisfied(unit, doc) {
    if (unit.tokens.length && unit.tokens.every((t) => doc.tqTokens.some((x) => near(t, x)))) return true;
    if (unit.scholars && unit.scholars.some((s) => doc.people.has(s))) return true;
    if (unit.headings) {
      for (const h of unit.headings) {
        const phrases = headingPhrases.get(h) || [];
        if (phrases.some((p) => doc.tq.includes(p))) return true;
      }
    }
    return false;
  }
  function isExact(qa, doc) {
    if (qa.phrase && (doc.tq.includes(qa.phrase) || doc.desc.includes(qa.phrase))) return true;
    if (qa.quoted.length) return true; // quoted phrases are required, so any survivor matched one
    return qa.units.length > 0 && qa.units.every((u) => unitSatisfied(u, doc));
  }

  // ---- Filters, ordering, grouping ----
  function passesFilters(doc, f, skipTag) {
    const r = doc.record;
    if (!skipTag && f.tag && r.content_tag !== f.tag) return false;
    if (f.level && r.level !== f.level) return false;
    if (f.source && r.source !== f.source) return false;
    if (f.scholar && !doc.people.has(f.scholar)) return false;
    if (f.topic && !doc.allHeadings.has(f.topic)) return false;
    if (f.section && !(doc.ancestors.has(f.section) || r.id === f.section)) return false;
    return true;
  }
  function levelRank(level, order) {
    const i = config.levels.order.indexOf(level);
    const rank = i === -1 ? config.levels.order.length : i;
    return order === 'deeper' ? -rank : rank;
  }
  function cluster(hits, skipParent) {
    const min = Math.max(2, Number(config.grouping.min_items) || 3);
    const byParent = new Map();
    for (const h of hits) {
      const r = h.record;
      if (h.pinned || r.granularity !== 'item' || !r.parent || r.parent === skipParent) continue;
      if (!byParent.has(r.parent)) byParent.set(r.parent, []);
      byParent.get(r.parent).push(h);
    }
    const out = [], done = new Set();
    for (const h of hits) {
      const p = h.record.parent;
      const group = !h.pinned && h.record.granularity === 'item' && p !== skipParent ? byParent.get(p) : null;
      if (group && group.length >= min) {
        if (done.has(p)) continue;
        done.add(p);
        out.push({ kind: 'cluster', parent: recordById.get(p) || h.record.context.section, items: group });
      } else {
        out.push({ kind: 'record', ...h });
      }
    }
    return out;
  }

  /**
   * Run a search.
   * @param {string} query
   * @param {object} [options] { tag, level, source, scholar, topic, section, order: 'beginner'|'deeper' }
   */
  function search(query, options = {}) {
    const f = {
      tag: options.tag || '', level: options.level || '', source: options.source || '',
      scholar: options.scholar || '', topic: options.topic || '', section: options.section || '',
    };
    const order = options.order === 'deeper' || options.order === 'beginner'
      ? options.order : config.ranking.default_order;
    const hasFilter = Object.values(f).some(Boolean);
    const qa = analyze(query);
    const result = {
      query: qa.raw.trim(), mode: 'search', layer: 4, order, filters: f, curated: null,
      exact: [], related: [], fallback: false,
      counts: { exact: 0, related: 0, total: 0, unfiltered: 0, tags: {} },
    };
    for (const t of config.tags.order) result.counts.tags[t] = 0;

    // Browse mode: no query, only filters (topic tile, "More in this section", ...).
    if (!qa.tokens.length) {
      result.mode = hasFilter || options.browse ? 'browse' : 'empty';
      if (result.mode === 'empty') return result;
      let hits = [];
      docs.forEach((doc) => {
        if (!passesFilters(doc, f, true)) return;
        result.counts.tags[doc.record.content_tag] = (result.counts.tags[doc.record.content_tag] || 0) + 1;
        result.counts.unfiltered++;
        if (!f.tag || doc.record.content_tag === f.tag) hits.push({ record: doc.record, score: 0 });
      });
      hits.sort((a, b) =>
        levelRank(a.record.level, order) - levelRank(b.record.level, order) ||
        (GRANULARITY_RANK[a.record.granularity] ?? 0) - (GRANULARITY_RANK[b.record.granularity] ?? 0) ||
        String(a.record.title).localeCompare(String(b.record.title), 'en', { numeric: true }));
      result.layer = 0;
      result.counts.total = result.counts.exact = hits.length;
      result.exact = cluster(hits, f.section);
      return result;
    }

    const curated = layer1(qa);
    const { score, mask } = keywordScores(qa);
    const L2 = config.layer2;

    let hits = [];
    for (let d = 0; d < N; d++) {
      if (score[d] <= 0) continue;
      const doc = docs[d];
      if (qa.quoted.length && !qa.quoted.every((p) => doc.tq.includes(p) || doc.desc.includes(p))) continue;
      const cov = coverage(qa, mask[d]);
      if (cov < L2.min_result_coverage) continue;
      let s = score[d];
      if (qa.phrase && (doc.tq.includes(qa.phrase) || doc.desc.includes(qa.phrase))) s *= L2.phrase_boost;
      hits.push({ doc, record: doc.record, score: s, coverage: cov, exact: isExact(qa, doc) });
    }
    hits.sort((a, b) => b.score - a.score);
    const top = hits[0];
    const confident = hits.length >= L2.min_results && !!top &&
      top.score >= L2.min_score && top.coverage >= L2.min_term_coverage;
    hits = hits.slice(0, L2.max_results);

    // Curated top records always count as exact matches and lead the list.
    const pinned = [];
    if (curated && curated.question) {
      for (const id of curated.question.top_records || []) {
        const idx = docs.findIndex((x) => x.record.id === id);
        if (idx === -1) continue;
        const existing = hits.find((h) => h.record.id === id);
        if (existing) hits.splice(hits.indexOf(existing), 1);
        pinned.push({ doc: docs[idx], record: docs[idx].record, score: existing ? existing.score : 0,
          coverage: 1, exact: true, pinned: true });
      }
    }

    result.curated = curated;
    result.layer = curated ? 1 : confident ? 2 : 4;
    result.fallback = result.layer === 4;

    const all = [...pinned, ...hits];
    result.counts.unfiltered = all.length;
    const kept = [];
    for (const h of all) {
      if (!passesFilters(h.doc, f, true)) continue;
      const tag = h.record.content_tag;
      result.counts.tags[tag] = (result.counts.tags[tag] || 0) + 1;
      if (!f.tag || tag === f.tag) kept.push(h);
    }

    const boost = order === 'deeper' ? config.ranking.deeper_boost : config.ranking.level_boost;
    const boosted = (h) => h.score * (Number(boost[h.record.level]) || 1);
    const strict = config.ranking.exact_group_order === 'strict';
    const strip = ({ doc, ...rest }) => rest;

    const exact = kept.filter((h) => h.exact && !result.fallback).map(strip);
    const related = kept.filter((h) => !(h.exact && !result.fallback)).map(strip);
    exact.sort((a, b) =>
      (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) ||
      (a.pinned && b.pinned ? 0 :
        strict ? (levelRank(a.record.level, order) - levelRank(b.record.level, order)) || (b.score - a.score)
          : boosted(b) - boosted(a)));
    related.sort((a, b) => boosted(b) - boosted(a));

    result.exact = cluster(exact, f.section);
    result.related = cluster(related, f.section);
    result.counts.exact = exact.length;
    result.counts.related = related.length;
    result.counts.total = exact.length + related.length;
    return result;
  }

  /** Flatten grouped entries back to a plain list of records (used by the eval runner). */
  function flatten(entries) {
    const out = [];
    for (const e of entries) {
      if (e.kind === 'cluster') for (const it of e.items) out.push(it.record);
      else out.push(e.record);
    }
    return out;
  }

  return {
    config, records, headings, scholars, sources, questions, paths,
    recordById, headingById, scholarById, sourceById, pathById,
    search, flatten, analyze,
    buildDate: index.build_date || '',
    vocabularyDraft: !!index.vocabulary_draft,
  };
}

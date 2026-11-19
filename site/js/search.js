// Search logic for the catalog. Pure module: no DOM, no network, no storage.
// The page (app.js) and the eval runner (scripts/eval_search.mjs) both import
// this same file, so what is tested is what visitors get.
//
// It only RETRIEVES and RANKS human-written catalog records. Nothing here
// writes text. Layers (CLAUDE.md section 11):
//   1. curated starter questions and topic headings
//   2. keyword search: BM25 over weighted fields, with hand-built tables (no model) for
//      topic headings (vocabulary + arabic-terms), synonyms and entities, context rules
//      ("stone" + "pray" = turbah) and spelling correction; topic bonuses scaled by how
//      specific the topic is; near-duplicate pages grouped
//   3. related by meaning: fused in by addSemantic() from site/js/semantic.js
//   4. graceful fallback
// Measured with scripts/eval_metrics.mjs (proposals/search-v2.md).

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
    concept_full_weight_max_records: 50,
    phrase_boost: 1.6,
    title_match_boost: 2.0,
    min_score: 1.0,
    min_term_coverage: 0.5,
    min_results: 1,
    min_result_coverage: 0.34,
    min_relative_score: 0.15,
    max_results: 150,
    max_related: 40,
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
    heading_substitution_max_records: 120,
  },
  ranking: {
    default_order: 'beginner',
    exact_group_order: 'strict',
    level_boost: { beginner: 1.5, intermediate: 1.2, advanced: 1.0 },
    deeper_boost: { beginner: 1.0, intermediate: 1.2, advanced: 1.5 },
    granularity_boost: { work: 2.0, section: 1.8, item: 1.0 },
  },
  tags: {
    order: ['fiqh', 'hadith', 'book', 'article', 'course', 'lecture', 'other'],
    labels: { fiqh: 'Fiqh', hadith: 'Hadith', book: 'Book', article: 'Article',
      course: 'Course', lecture: 'Lecture', other: 'Other' },
  },
  // Result tabs, in display order. A record's category comes from its format (`type`), then its content tag.
  categories: {
    order: ['qa', 'article', 'book', 'hadith', 'more'],
    labels: { qa: 'Q&A', article: 'Articles', book: 'Books', hadith: 'Hadith', more: 'Courses and more' },
    by_type: { qa: 'qa', article: 'article', book: 'book', 'hadith-collection': 'hadith' },
    by_tag: { hadith: 'hadith' },
    fallback: 'more',
    overview_per_category: 3,
  },
  levels: {
    order: ['beginner', 'intermediate', 'advanced'],
    labels: { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' },
  },
  grouping: { min_items: 3, collapse_duplicates: true },
  // Layer 3: "related by meaning" (site/js/semantic.js). It is consulted only when keyword search is weak.
  layer3: {
    enabled: true,
    max_exact: 2,          // weak = fewer than this many exact keyword matches
    min_similarity: 0.46,  // cosine similarity the best record must reach, else nothing is shown
    relative_floor: 0.82,  // other records must reach this fraction of the best similarity
    boost_strength: 0.2,   // how much the beginner-first and book-first boosts count for in meaning ranking (0 = not at all)
    max_related: 30,       // size of the fused "Related results" list
    fusion_k: 20,          // reciprocal-rank-fusion constant (higher = flatter blend of the two rankings)
    candidates: 80,        // how many nearest records the semantic layer hands over before filtering
  },
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
const PLAIN_ASCII = /^[\x00-\x7f]*$/;
export function normalize(input) {
  const str = String(input == null ? '' : input);
  // Fast path for plain ASCII (most of the catalog): no marks or Arabic/Persian letters to fold.
  if (PLAIN_ASCII.test(str)) {
    return str.toLowerCase().replace(/['`]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  }
  return str
    .normalize('NFKD')
    .replace(/\p{M}+/gu, '')            // combining marks: Latin diacritics, Arabic vowel signs
    .replace(/ـ/g, '')             // Arabic tatweel
    .replace(/[یى]/g, 'ي') // Persian/Urdu yeh, alef maksura -> Arabic yeh
    .replace(/[أإآٱ]/g, 'ا')  // alef with hamza / madda / wasla -> bare alef (إمامة = امامة)
    .replace(/ؤ/g, 'و').replace(/ئ/g, 'ي') // hamza on waw / yeh
    .replace(/[ةھہۀ]/g, 'ه') // ta marbuta and heh forms -> heh (صلاة = صلاه)
    .replace(/ک/g, 'ك')       // Persian kaf -> Arabic kaf
    .toLowerCase()
    .replace(/['‘’ʻʼʿʾ`´]/g, '') // apostrophes, ayn/hamza marks
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

/** Very light English stemmer: plurals and -ing. Applied to index and query alike. */
const STEMS = new Map();
export function stem(tok) {
  let r = STEMS.get(tok);
  if (r === undefined) { r = stemRaw(tok); if (STEMS.size < 50000) STEMS.set(tok, r); }
  return r;
}
function stemRaw(tok) {
  // Arabic: drop the attached article "al-" (الأنبياء = أنبياء), keeping at least three letters.
  if (tok.length >= 5 && tok.startsWith('ال') && /^[\u0621-\u064a]+$/.test(tok)) return tok.slice(2);
  if (tok.length < 4 || !/^[a-z]+$/.test(tok)) return tok;
  let t = tok;
  if (t.endsWith('ies') && t.length > 4) t = t.slice(0, -3) + 'y';
  else if (/(ss|x|z|ch|sh)es$/.test(t)) t = t.slice(0, -2);
  else if (t.endsWith('s') && !/(ss|us|is)$/.test(t)) t = t.slice(0, -1);
  if (t.endsWith('ing') && t.length >= 6) t = t.slice(0, -3);
  return t;
}

/** Normalized, stemmed tokens (stopwords kept). */
const WORD_TOKENS = new Map(); // raw whitespace-delimited word -> its stemmed tokens
export function tokenize(input) {
  const out = [];
  for (const w of String(input == null ? '' : input).split(/\s+/)) {
    if (!w) continue;
    let t = WORD_TOKENS.get(w);
    if (!t) {
      const n = normalize(w);
      t = n ? n.split(' ').map(stem) : [];
      if (WORD_TOKENS.size < 200000) WORD_TOKENS.set(w, t);
    }
    for (let i = 0; i < t.length; i++) out.push(t[i]);
  }
  return out;
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

  const records = []; // filled by addRecords(); grows when the rest of the catalog arrives
  const headings = index.headings || [];
  const scholars = index.scholars || [];
  const sources = index.sources || [];
  const questions = index.questions || [];
  const paths = index.paths || [];

  const recordById = new Map();
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
    const names = labelVariants(h.label);
    for (const term of [...names, ...(h.alt_terms || [])]) {
      const key = addConcept(term, 'headings', h.id);
      // Only the heading's own names ("Prayer", "Salah") may stand in for a query word in the exact-match rule.
      // Its other alternate terms are related topics ("chess" under music and entertainment), not equivalents;
      // true equivalents are listed in data/synonyms.yaml.
      if (key && names.includes(term)) keys.add(' ' + key + ' ');
    }
    headingPhrases.set(h.id, [...keys]);
  }
  for (const s of scholars) {
    for (const name of [s.name, ...(s.alt_names || [])]) {
      addConcept(name, 'scholars', s.id);
      // "al-Kulayni" is also found by typing "kulayni" (leading Arabic article dropped).
      const bare = normalize(name).replace(/^(al|as|el|ash|at) (?=\S)/, '');
      if (bare !== normalize(name) && bare.length >= 4) addConcept(bare, 'scholars', s.id);
    }
  }

  // ---- Synonyms and entities (data/synonyms.yaml, data/entities.yaml) ----
  // A group of interchangeable terms becomes one extra index token ("~mutah") on every field that contains any
  // of its terms, and a query naming any of them searches that token. Plain table lookup, no model.
  const synByFirst = new Map(); // first word -> [{ toks, gid, notBefore }], longest first
  const synWords = new Set();   // every word used in a synonym term (never "corrected" as a typo)
  const synData = index.synonyms || {};
  for (const g of synData.groups || []) {
    const notBefore = new Set((g.not_before || []).flatMap((w) => tokenize(w)));
    for (const term of g.terms || []) {
      const toks = tokenize(term);
      if (!toks.length || toks.length > 8) continue;
      if (!synByFirst.has(toks[0])) synByFirst.set(toks[0], []);
      const list = synByFirst.get(toks[0]);
      if (!list.some((e) => e.toks.join(' ') === toks.join(' '))) list.push({ toks, gid: '~' + g.id, notBefore });
      for (const t of toks) synWords.add(t);
    }
  }
  for (const list of synByFirst.values()) list.sort((a, b) => b.toks.length - a.toks.length);
  // Context rules (queries only): "stone" means the turbah when the query is about praying.
  const synContexts = new Map(); // word -> [{ with:Set, gid }]
  for (const c of synData.contexts || []) {
    const w = tokenize(c.word)[0];
    if (!w) continue;
    if (!synContexts.has(w)) synContexts.set(w, []);
    synContexts.get(w).push({ with: new Set((c.with || []).flatMap((x) => tokenize(x))), gid: '~' + c.means });
  }
  /** Greedy longest matches of synonym terms in a token list: [{ start, len, gid }]. */
  // The word after a match, looking past an Arabic article ("imam ali al-ridha": the word after "al").
  const ARTICLES = new Set(['al', 'el', 'ul', 'as', 'ash', 'ar', 'an', 'at', 'ad', 'az', 'ad']);
  const blockedAfter = (set, toks, j) => j < toks.length &&
    (set.has(toks[j]) || (ARTICLES.has(toks[j]) && j + 1 < toks.length && set.has(toks[j + 1])));
  function synSpans(toks, withContexts) {
    const out = [];
    for (let i = 0; i < toks.length;) {
      let m = 0;
      for (const e of synByFirst.get(toks[i]) || []) {
        const len = e.toks.length;
        if (i + len > toks.length) continue;
        let ok = true;
        for (let j = 1; j < len && ok; j++) ok = toks[i + j] === e.toks[j];
        if (!ok) continue;
        if (e.notBefore.size && blockedAfter(e.notBefore, toks, i + len)) continue;
        out.push({ start: i, len, gid: e.gid });
        m = len;
        break;
      }
      if (!m && withContexts && synContexts.has(toks[i])) {
        const rule = synContexts.get(toks[i]).find((r) => toks.some((t, j) => j !== i && r.with.has(t)));
        if (rule) { out.push({ start: i, len: 1, gid: rule.gid }); m = 1; }
      }
      i += m || 1;
    }
    return out;
  }
  const withSynonyms = (toks) => { const sp = synSpans(toks, false); return sp.length ? [...toks, ...sp.map((x) => x.gid)] : toks; };

  // ---- Per-record search documents ----
  const headingText = (ids) => ids.map((id) => {
    const h = headingById.get(id);
    return h ? [h.label, ...(h.alt_terms || [])].join(' . ') : '';
  }).join(' . ');
  const scholarText = (ids) => ids.map((id) => {
    const s = scholarById.get(id);
    return s ? [s.name, ...(s.alt_names || [])].join(' . ') : '';
  }).join(' . ');

  // One search document per record. The parts used only by the exact-match and title rules (tq, desc, ...)
  // are worked out the first time a query touches the record, not for all 8,000+ records at start-up.
  const MAIN_TITLE = (r) => String(r.title || '').split(/[:»|]/)[0].replace(/\([^)]*\)/g, ' ');
  class Doc {
    constructor(r) {
      const people = [...new Set([...(r.authors || []), ...(r.instructors || []), ...(r.marja ? [r.marja] : [])])];
      this.record = r;
      this.people = new Set(people);
      this.ownHeadings = new Set(r.headings || []);
      this.allHeadings = new Set([...(r.headings || []), ...(r.inherited_headings || [])]);
      this.ancestors = new Set(r.ancestors || []);
      this._tq = null;
    }
    fieldText() {
      const r = this.record, ctx = r.context || {}, src = sourceById.get(r.source);
      return {
        title: r.title || '',
        sample_questions: (r.sample_questions || []).join(' . '),
        headings: headingText(r.headings || []),
        scholars: scholarText([...this.people]),
        description: r.description || '',
        ancestor_headings: headingText(r.inherited_headings || []),
        context: [ctx.section && ctx.section.title, ctx.work && ctx.work.title].filter(Boolean).join(' . '),
        other: [r.source, src && src.name, r.location, r.title_original, r.provider,
          config.tags.labels[r.content_tag], r.type].filter(Boolean).join(' . '),
      };
    }
    lazy() {
      if (this._tq) return;
      const r = this.record;
      // "tq": title + sample questions, the fields the exact-match rule looks at.
      const tqParts = [r.title || '', ...(r.sample_questions || [])].map(tokenize);
      const tqTokens = new Set();
      for (const part of tqParts) for (const t of withSynonyms(part)) tqTokens.add(t);
      this._tq = tqParts.map(pad).join('|');
      this._tqTokens = [...tqTokens];
      this._desc = pad(tokenize(r.description || ''));
      // Main title words (before a colon, without "(Vol. 1)" or one- and two-letter words such as "al").
      this._titleKeys = [...new Set(tokenize(MAIN_TITLE(r)).filter((t) => !stopSet.has(t) && t.length > 2 && !/^[0-9]+$/.test(t)))];
      // Near-duplicate key: same source and the same title words, ignoring numbers, years and common words.
      const dt = [...new Set(tokenize(r.title || '').filter((t) => !stopSet.has(t) && !/^[0-9]+$/.test(t)))].sort();
      this._dupKey = dt.length >= 3 ? r.source + '|' + dt.join(' ') : null;
    }
    get tq() { this.lazy(); return this._tq; }
    get tqTokens() { this.lazy(); return this._tqTokens; }
    get desc() { this.lazy(); return this._desc; }
    get titleKeys() { this.lazy(); return this._titleKeys; }
    get dupKey() { this.lazy(); return this._dupKey; }
  }
  const docs = [];

  // ---- Inverted index (BM25 over fields) ----
  const postings = new Map(); // term -> [docIdx, fieldIdx, tf, ...] flat array
  const fieldLen = FIELDS.map(() => []);
  const lenSum = FIELDS.map(() => 0);
  const avgLen = FIELDS.map(() => 1);
  const docFreq = new Map();
  // Many records share the same heading, scholar, context and source text: tokenize each distinct string once.
  const tokCache = new Map();
  const indexTokens = (text) => {
    let r = tokCache.get(text);
    if (!r) {
      const all = tokenize(text);
      const toks = all.filter((t) => !stopSet.has(t));
      for (const sp of synSpans(all, false)) toks.push(sp.gid);
      const tf = new Map();
      for (const t of toks) tf.set(t, (tf.get(t) || 0) + 1);
      r = { len: toks.length, entries: [...tf] };
      if (tokCache.size < 60000) tokCache.set(text, r);
    }
    return r;
  };
  const weights = FIELDS.map((f) => Number(config.layer2.field_weights[f]) || 0);
  // Records per heading (own and inherited) and per person, so a topic or scholar bonus touches only its records.
  const headingOwnDocs = new Map(), headingAllDocs = new Map(), personDocs = new Map();
  const pushTo = (m, k, d) => { let a = m.get(k); if (!a) { a = []; m.set(k, a); } a.push(d); };
  const docIdx = new Map();

  // Totals that depend on the whole catalog; recomputed after each addRecords() call.
  let N = 0, terms = [], specRef = 1, conceptBuf = new Float32Array(0);
  const idf = (t) => {
    const df = docFreq.get(t) || 0;
    return Math.log(1 + (N - df + 0.5) / (df + 0.5));
  };
  // How specific a heading (or scholar) is: 1 for one covering at most `concept_full_weight_max_records`
  // records, falling with the log of its size. "Temporary marriage" should count for more than "Marriage and family".
  const specificity = (count) => Math.min(1, Math.log(1 + N / Math.max(1, count)) / specRef);
  const headingCount = (h) => (headingOwnDocs.get(h) || []).length;
  const subMax = Number(config.exact.heading_substitution_max_records) || Infinity;

  /**
   * Add records to the engine (start-up, and again when the rest of the catalog arrives). Records already present
   * are skipped. The page can call this with small chunks between paints so it never freezes.
   */
  function addRecords(list) {
    for (const r of list || []) {
      if (!r || recordById.has(r.id)) continue;
      const d = docs.length;
      const doc = new Doc(r);
      records.push(r);
      recordById.set(r.id, r);
      docs.push(doc);
      docIdx.set(r.id, d);
      const ft = doc.fieldText();
      const seen = new Set();
      for (let fi = 0; fi < FIELDS.length; fi++) {
        const { len, entries } = indexTokens(ft[FIELDS[fi]]);
        fieldLen[fi][d] = len;
        lenSum[fi] += len;
        for (let e = 0; e < entries.length; e++) {
          const t = entries[e][0];
          let p = postings.get(t);
          if (!p) { p = []; postings.set(t, p); }
          p.push(d, fi, entries[e][1]);
          seen.add(t);
        }
      }
      for (const t of seen) docFreq.set(t, (docFreq.get(t) || 0) + 1);
      for (const h of doc.ownHeadings) pushTo(headingOwnDocs, h, d);
      for (const h of doc.allHeadings) pushTo(headingAllDocs, h, d);
      for (const p of doc.people) pushTo(personDocs, p, d);
    }
    N = docs.length;
    for (let i = 0; i < FIELDS.length; i++) avgLen[i] = N ? lenSum[i] / N || 1 : 1;
    terms = [...postings.keys()].sort();
    specRef = Math.log(1 + N / Math.max(1, Number(config.layer2.concept_full_weight_max_records) || 50));
    if (conceptBuf.length < N) conceptBuf = new Float32Array(N);
    deletes = null; dict = null; termCache.clear(); // the spelling table is rebuilt from the new word list when needed
    return N;
  }

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
  // Spelling help (SymSpell-style, plain rules, no model). A query word the catalog has never seen ("prohets",
  // "infalibility") is replaced by the closest known word: at most 1 edit for words of 5-7 letters, 2 edits for
  // longer words (a missing, extra, wrong or swapped letter each count as one edit). Ties go to the word found on
  // the most pages. The lookup table (every known word with one letter removed) is built only when first needed.
  const termCache = new Map();
  let deletes = null, dict = null;
  function buildDeletes() {
    dict = new Set();
    for (const w of terms) if (/^[a-z]+$/.test(w)) dict.add(w);
    for (const w of synWords) if (/^[a-z]+$/.test(w)) dict.add(w);
    for (const k of concepts.keys()) if (/^[a-z]+$/.test(k)) dict.add(k);
    deletes = new Map();
    for (const w of dict) {
      if (w.length < 4) continue;
      for (let i = 0; i < w.length; i++) {
        const d = w.slice(0, i) + w.slice(i + 1);
        let a = deletes.get(d);
        if (!a) { a = []; deletes.set(d, a); }
        if (a[a.length - 1] !== w) a.push(w);
      }
    }
  }
  function editDistance(a, b, max) { // optimal string alignment (Damerau-Levenshtein with adjacent swaps)
    if (Math.abs(a.length - b.length) > max) return max + 1;
    let p2 = null, p = Array.from({ length: b.length + 1 }, (_, j) => j);
    for (let i = 1; i <= a.length; i++) {
      const c = [i];
      let low = i;
      for (let j = 1; j <= b.length; j++) {
        let v = Math.min(p[j] + 1, c[j - 1] + 1, p[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
        if (p2 && i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, p2[j - 2] + 1);
        c.push(v);
        if (v < low) low = v;
      }
      if (low > max) return max + 1;
      p2 = p; p = c;
    }
    return p[b.length];
  }
  function correctTerm(t) {
    if (t.length < 5 || !/^[a-z]+$/.test(t) || postings.has(t) || concepts.has(t) || stopSet.has(t) || synWords.has(t)) return t;
    if (termCache.has(t)) return termCache.get(t);
    if (!deletes) buildDeletes();
    const max = t.length >= 8 ? 2 : 1;
    const cands = new Set();
    const look = (k) => { if (dict.has(k)) cands.add(k); for (const w of deletes.get(k) || []) cands.add(w); };
    look(t);
    for (let i = 0; i < t.length; i++) look(t.slice(0, i) + t.slice(i + 1));
    let best = t, bestD = max + 1, bestDf = -1;
    for (const c of cands) {
      const d = editDistance(t, c, max);
      if (d > max) continue;
      const df = docFreq.get(c) || 0;
      if (d < bestD || (d === bestD && df > bestDf)) { best = c; bestD = d; bestDf = df; }
    }
    if (termCache.size < 5000) termCache.set(t, best);
    return best;
  }

  function analyze(rawQuery) {
    const raw = String(rawQuery || '').slice(0, 300);
    const quoted = [];
    raw.replace(/"([^"]+)"/g, (_, p) => { const t = tokenize(p); if (t.length) quoted.push(pad(t)); return ''; });
    const corrections = [];
    const tokens = tokenize(raw).map((t) => {
      const c = correctTerm(t);
      if (c !== t) corrections.push({ from: t, to: c });
      return c;
    });
    const isStop = tokens.map((t) => stopSet.has(t));
    const allStop = isStop.every(Boolean);
    // Synonym and entity groups named in the query (with context rules such as "stone" + "pray" = turbah).
    const syn = synSpans(tokens, true);
    const synOf = tokens.map(() => null);
    for (const sp of syn) for (let j = sp.start; j < sp.start + sp.len; j++) synOf[j] = sp.gid;

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
    // A word inside a synonym group is searched as the group's token, so "temporary marriage" finds pages that
    // say "mutah" and is not split into "temporary" + "marriage". tokenKey[i]: the key term standing for token i.
    const tokenKey = tokens.map(() => undefined);
    tokens.forEach((t, i) => {
      if (isStop[i] && !allStop && !synOf[i]) return;
      const k = synOf[i] || t;
      if (!keyIndex.has(k) && keyTerms.length < MAX_KEY_TERMS) { keyIndex.set(k, keyTerms.length); keyTerms.push(k); }
      tokenKey[i] = keyIndex.get(k);
    });
    const isGeneric = keyTerms.map((t) => genericSet.has(t));
    const hasSpecific = isGeneric.some((g) => !g);

    // Units for the exact-match rule: each concept span, and each remaining key term.
    let units = [];
    const covered = new Set();
    spans.forEach((sp) => {
      const keys = [];
      for (let j = sp.start; j < sp.start + sp.len; j++) if (tokenKey[j] !== undefined) keys.push(tokenKey[j]);
      keys.forEach((k) => covered.add(k));
      units.push({ tokens: [...new Set(keys)].map((k) => keyTerms[k]), headings: sp.headings, scholars: sp.scholars });
    });
    keyTerms.forEach((k, i) => { if (!covered.has(i)) units.push({ tokens: [k], headings: null, scholars: null }); });
    // A heading's other terms may stand in for the query's words only when the heading is specific, or when the
    // whole query is the topic ("prayer"). Otherwise "temporary marriage" would make every marriage page exact.
    const topicQuery = spans.some((sp) => sp.headings.length &&
      tokens.every((t, i) => stopSet.has(t) || (i >= sp.start && i < sp.start + sp.len)));
    units.forEach((u) => {
      u.generic = u.tokens.every((t) => genericSet.has(t));
      if (u.headings) u.headings = u.headings.filter((h) => topicQuery || headingCount(h) <= subMax);
    });
    if (units.some((u) => !u.generic)) units = units.filter((u) => !u.generic);

    return {
      longWords: tokens.filter((t) => t.length > 2 && !stopSet.has(t)),
      raw, corrections, tokens, tokenKey, quoted, spans, keyTerms, keyIndex, isGeneric, hasSpecific, units,
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

  // Book-over-question boost. A source can override it (ranking.granularity_boost_by_source), e.g. thaqalayn
  // chapters are narrow pages, so they must not get the boost that sistani.org chapter pages get.
  function granBoost(r) {
    const by = (config.ranking.granularity_boost_by_source || {})[r.source] || {};
    if (r.granularity === 'work' && by.work_types && by.work_types[r.type] !== undefined) return Number(by.work_types[r.type]) || 1;
    return Number(by[r.granularity] ?? (config.ranking.granularity_boost || {})[r.granularity]) || 1;
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
      if (px.enabled && t.length >= px.min_length && t[0] !== '~') {
        for (const longer of prefixTerms(t, px.max_expansions)) addPostings(longer, bit, px.weight);
      }
    });
    // Concepts: a heading or scholar named by any of its alternate terms. The bonus is scaled by how
    // specific the heading or scholar is, so a broad topic cannot flood the results.
    for (const sp of qa.spans) {
      let bits = 0, n = 0;
      for (let j = sp.start; j < sp.start + sp.len; j++) {
        const k = qa.tokenKey[j];
        if (k !== undefined && !(bits & (1 << k))) { bits |= 1 << k; n++; }
      }
      const bonus = config.layer2.concept_weight * Math.max(1, n);
      const touched = [];
      const give = (d, f) => { if (f > conceptBuf[d]) { if (!conceptBuf[d]) touched.push(d); conceptBuf[d] = f; } };
      for (const h of sp.headings) {
        const all = headingAllDocs.get(h) || [];
        const sp1 = specificity(all.length);
        for (const d of headingOwnDocs.get(h) || []) give(d, sp1);
        for (const d of all) give(d, 0.5 * sp1);
      }
      for (const p of sp.scholars) {
        const ds = personDocs.get(p) || [];
        const sp1 = specificity(ds.length);
        for (const d of ds) give(d, sp1);
      }
      for (const d of touched) { score[d] += bonus * conceptBuf[d]; mask[d] |= bits; conceptBuf[d] = 0; }
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

  // ---- Result categories (the tabs on the results page) ----
  const CATS = config.categories || DEFAULT_CONFIG.categories;
  function catOf(r) {
    return (CATS.by_type || {})[r.type] || (CATS.by_tag || {})[r.content_tag] || CATS.fallback || 'more';
  }
  const newCatCounts = () => Object.fromEntries((CATS.order || []).map((c) => [c, 0]));

  // ---- Filters, ordering, grouping ----
  function passesFilters(doc, f, skipTag) {
    const r = doc.record;
    if (!skipTag && f.tag && r.content_tag !== f.tag) return false;
    if (!skipTag && f.cat && catOf(r) !== f.cat) return false;
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
    // 1. Near-duplicates join the best-ranked page with the same key.
    const leaders = [], byKey = new Map();
    for (const h of hits) {
      const key = h.pinned || !config.grouping.collapse_duplicates ? null : docs[docIdx.get(h.record.id)].dupKey;
      const lead = key ? byKey.get(key) : null;
      if (lead) { lead.dups.push(h); continue; }
      const l = { ...h, dups: [] };
      if (key) byKey.set(key, l);
      leaders.push(l);
    }
    const withDups = (l) => { const { dups, ...h } = l; return [h, ...dups]; };
    // 2. Several questions from one section are grouped under it.
    const byParent = new Map();
    for (const h of leaders) {
      const r = h.record;
      if (h.pinned || r.granularity !== 'item' || !r.parent || r.parent === skipParent) continue;
      if (!byParent.has(r.parent)) byParent.set(r.parent, []);
      byParent.get(r.parent).push(h);
    }
    const out = [], done = new Set();
    for (const h of leaders) {
      const p = h.record.parent;
      const group = !h.pinned && h.record.granularity === 'item' && p !== skipParent ? byParent.get(p) : null;
      if (group && group.length >= min) {
        if (done.has(p)) continue;
        done.add(p);
        out.push({ kind: 'cluster', parent: recordById.get(p) || h.record.context.section, items: group.flatMap(withDups) });
      } else if (h.dups.length) {
        out.push({ kind: 'cluster', similar: true, parent: null, items: withDups(h) });
      } else {
        const { dups, ...rest } = h;
        out.push({ kind: 'record', ...rest });
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
      cat: options.cat || '',
    };
    const order = options.order === 'deeper' || options.order === 'beginner'
      ? options.order : config.ranking.default_order;
    const hasFilter = Object.values(f).some(Boolean);
    const qa = analyze(query);
    const result = {
      query: qa.raw.trim(), mode: 'search', layer: 4, order, filters: f, curated: null,
      exact: [], related: [], fallback: false, emptyTopic: null,
      corrected: qa.corrections.length ? qa.corrections.map((c) => c.to).join(' ') : '',
      counts: { exact: 0, related: 0, total: 0, unfiltered: 0, tags: {}, cats: newCatCounts() },
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
        const cat = catOf(doc.record);
        result.counts.cats[cat] = (result.counts.cats[cat] || 0) + 1;
        result.counts.unfiltered++;
        if ((!f.tag || doc.record.content_tag === f.tag) && (!f.cat || cat === f.cat)) hits.push({ record: doc.record, score: 0 });
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
      s *= granBoost(doc.record);
      // Known-item search: every word of the page's title is in the query ("man la yahduruhu al-faqih").
      // Both ways: the query also has to be mostly the title, so a one-word title such as "Marriage" is not
      // boosted for "temporary marriage".
      if (doc.titleKeys.length && doc.titleKeys.every((t) => qa.tokens.some((x) => near(t, x))) &&
          qa.longWords.filter((x) => doc.titleKeys.some((t) => near(t, x))).length >= qa.longWords.length * 2 / 3) {
        s *= L2.title_match_boost;
      }
      hits.push({ doc, record: doc.record, score: s, coverage: cov, exact: isExact(qa, doc) });
    }
    hits.sort((a, b) => b.score - a.score);
    const top = hits[0];
    // Drop the long tail of results that only share a common word with the query.
    if (top) {
      const floor = top.score * (Number(L2.min_relative_score) || 0);
      hits = hits.filter((h) => h.exact || h.score >= floor);
    }
    // Confident when one of the best few results scores well AND covers enough of the query. (Judging only the
    // single top score let one page that repeats a common word hide better-covering pages beneath it.)
    const confident = hits.length >= L2.min_results && !!top &&
      hits.slice(0, 10).some((h) => h.score >= L2.min_score && h.coverage >= L2.min_term_coverage);
    hits = hits.slice(0, L2.max_results);

    // Curated top records always count as exact matches and lead the list.
    const pinned = [];
    if (curated && curated.question) {
      for (const id of curated.question.top_records || []) {
        const idx = docIdx.has(id) ? docIdx.get(id) : -1;
        if (idx === -1) continue;
        const existing = hits.find((h) => h.record.id === id);
        if (existing) hits.splice(hits.indexOf(existing), 1);
        pinned.push({ doc: docs[idx], record: docs[idx].record, score: existing ? existing.score : 0,
          coverage: 1, exact: true, pinned: true });
      }
    }

    // Layer 1 counts only when it has something to show: a path, curated
    // records, or (for a topic heading) starter questions or matching records.
    const curatedUseful = !!curated && (
      pinned.length > 0 || !!curated.path ||
      (!!curated.heading && (curated.questions.length > 0 || confident)));
    result.layer = curatedUseful ? 1 : confident ? 2 : 4;
    result.fallback = result.layer === 4;
    result.curated = curatedUseful ? curated : null;
    if (result.fallback) {
      // Nothing confident: show no results at all rather than loose ones.
      // If the query named a topic we know but have nothing cataloged for, say so.
      result.emptyTopic = curated && curated.heading ? curated.heading : null;
      return result;
    }

    const all = [...pinned, ...hits];
    result.counts.unfiltered = all.length;
    const kept = [];
    for (const h of all) {
      if (!passesFilters(h.doc, f, true)) continue;
      const tag = h.record.content_tag;
      result.counts.tags[tag] = (result.counts.tags[tag] || 0) + 1;
      const cat = catOf(h.record);
      result.counts.cats[cat] = (result.counts.cats[cat] || 0) + 1;
      if ((!f.tag || tag === f.tag) && (!f.cat || cat === f.cat)) kept.push(h);
    }

    const boost = order === 'deeper' ? config.ranking.deeper_boost : config.ranking.level_boost;
    const boosted = (h) => h.score * (Number(boost[h.record.level]) || 1);
    const strict = config.ranking.exact_group_order === 'strict';
    const strip = ({ doc, ...rest }) => rest;
    // Scores within 5% of each other count as a tie; the shorter (more general) title wins,
    // so "Fasting" comes before "Fasting - Long Days".
    const nearTie = (a, b, val = (h) => h.score) => {
      const sa = val(a), sb = val(b), hi = Math.max(sa, sb) || 1;
      if (Math.abs(sa - sb) / hi > 0.05) return sb - sa;
      return String(a.record.title).length - String(b.record.title).length || (sb - sa);
    };

    const exact = kept.filter((h) => h.exact).map(strip);
    const related = kept.filter((h) => !h.exact).map(strip);
    exact.sort((a, b) =>
      (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) ||
      (a.pinned && b.pinned ? 0 :
        strict ? (levelRank(a.record.level, order) - levelRank(b.record.level, order)) || nearTie(a, b)
          : nearTie(a, b, boosted)));
    related.sort((a, b) => boosted(b) - boosted(a));
    // Related results are capped: past a few dozen they share little with the query.
    const relCap = Number(L2.max_related) || Infinity;
    if (related.length > relCap) related.length = relCap;

    result.exact = cluster(exact, f.section);
    result.related = cluster(related, f.section);
    result.relatedHits = related; // ungrouped, in order: Layer 3 fuses its results with these
    result.counts.exact = exact.length;
    result.counts.related = related.length;
    result.counts.total = exact.length + related.length;
    return result;
  }

  const docIndex = docIdx;

  /** True when keyword search is weak enough that Layer 3 (meaning) should be consulted. */
  function needsSemantic(result) {
    const L3 = config.layer3;
    if (!L3 || !L3.enabled || result.mode !== 'search') return false;
    return result.fallback || result.counts.exact < L3.max_exact;
  }

  /**
   * Fold Layer 3 into a search result. `ranked` is [{ id, score }] best first (cosine similarity from
   * semantic.js). The "Related results" group becomes keyword-related and meaning-related records fused by
   * reciprocal rank (a record found both ways rises); records found only by meaning carry
   * `viaMeaning: true` so the page can label them. Exact matches are untouched; filters still apply.
   * Returns a copy: `related` and `counts.related` replaced, plus `meaningIds` and `meaningOnly`.
   */
  function addSemantic(result, ranked) {
    const L3 = config.layer3;
    const out = { ...result, meaningIds: [], meaningOnly: false };
    if (!L3 || !L3.enabled || !ranked || !ranked.length) return out;
    const best = ranked[0].score;
    if (best < L3.min_similarity) return out;
    const f = result.filters;
    const boost = result.order === 'deeper' ? config.ranking.deeper_boost : config.ranking.level_boost;
    const floor = Math.max(L3.min_similarity, best * L3.relative_floor);
    // Level and book-over-question boosts count for less here than in keyword ranking: similarity is already a fine signal.
    const strength = Number(L3.boost_strength) >= 0 ? Number(L3.boost_strength) : 0.2;
    const exactIds = new Set(flatten(result.exact).map((r) => r.id));
    const keyword = result.relatedHits || [];
    const kwRank = new Map(keyword.map((h, i) => [h.record.id, i + 1]));

    const sem = [];
    out.counts = { ...result.counts, tags: { ...result.counts.tags }, cats: { ...result.counts.cats } };
    for (const { id, score } of ranked.slice(0, L3.candidates)) {
      if (score < floor) break;
      if (exactIds.has(id)) continue;
      const doc = docs[docIndex.get(id)];
      if (!doc || !passesFilters(doc, f, true)) continue;
      const tag = doc.record.content_tag;
      const cat = catOf(doc.record);
      if (!kwRank.has(id)) { out.counts.tags[tag] = (out.counts.tags[tag] || 0) + 1; out.counts.cats[cat] = (out.counts.cats[cat] || 0) + 1; }
      if (f.tag && tag !== f.tag) continue;
      if (f.cat && cat !== f.cat) continue;
      sem.push({ record: doc.record, similarity: score, exact: false, coverage: 0, viaMeaning: true,
        score: score * (1 + strength * ((Number(boost[doc.record.level]) || 1) * (granBoost(doc.record)) - 1)) });
    }
    sem.sort((a, b) => b.score - a.score);
    const semRank = new Map(sem.map((h, i) => [h.record.id, i + 1]));

    const K = Number(L3.fusion_k) || 20;
    const byId = new Map();
    for (const h of keyword) byId.set(h.record.id, { ...h });
    for (const h of sem) {
      const cur = byId.get(h.record.id);
      if (cur) { cur.viaMeaning = true; cur.similarity = h.similarity; } else byId.set(h.record.id, { ...h });
    }
    const fused = [...byId.values()].map((h) => {
      const k = kwRank.get(h.record.id), s = semRank.get(h.record.id);
      return { ...h, fused: (k ? 1 / (K + k) : 0) + (s ? 1 / (K + s) : 0), viaKeywords: !!k };
    }).sort((a, b) => b.fused - a.fused);
    const kept = fused.slice(0, L3.max_related || 30);
    out.related = cluster(kept, f.section);
    out.counts.related = kept.length;
    out.counts.total = out.counts.exact + kept.length;
    out.meaningIds = kept.filter((h) => h.viaMeaning && !h.viaKeywords).map((h) => h.record.id);
    out.meaningOnly = !!result.fallback && kept.length > 0;
    if (out.meaningOnly) { out.layer = 3; out.fallback = false; out.emptyTopic = null; }
    return out;
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

  addRecords(index.records || []);

  return {
    config, records, headings, scholars, sources, questions, paths, addRecords,
    recordById, headingById, scholarById, sourceById, pathById,
    search, flatten, analyze, needsSemantic, addSemantic, catOf,
    buildDate: index.build_date || '',
    vocabularyDraft: !!index.vocabulary_draft,
  };
}

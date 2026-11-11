#!/usr/bin/env node
// Search evaluation runner (no AI, no network, no dependencies).
//
// Runs every query in data/search-eval.yaml through the SAME search module the
// page uses (site/js/search.js) and reports pass/fail per query.
//
//   python3 scripts/build_index.py     # first: builds index.json + search-eval.json
//   node scripts/eval_search.mjs       # then: run the queries
//
// Options:
//   --data <dir>   folder holding index.json and search-eval.json (default: site/data)
//   --top <n>      an expected record must be within the first n results (default: 10)
//   --verbose      also print the top results for passing queries
//
// A query passes when at least one record in expect_any is found
//   expect_group: exact   -> in the first n "Exact matches"
//   expect_group: related -> in the first n "Related results"
//   expect_group: semantic -> among the records found only by meaning (Layer 3), within the first n related
//   expect_group: any     -> in the first n results overall (exact, related, then by meaning)
// An entry with expect_none: true passes when the page would show the honest
// "We couldn't find a close match" fallback and no results at all.
// Exit code: 0 all passed (or nothing to run), 1 failures, 2 cannot run.

import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createEngine } from '../site/js/search.js';
import { loadSemantic } from '../site/js/semantic.js';

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(name);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
};
import { loadFullIndex } from './lib_index.mjs';
const dataDir = resolve(opt('--data', join(here, '..', 'site', 'data')));
const topN = Math.max(1, parseInt(opt('--top', '10'), 10) || 10);
const verbose = args.includes('--verbose');

const indexPath = join(dataDir, 'index.json');
const evalPath = join(dataDir, 'search-eval.json');
if (!existsSync(indexPath)) {
  console.error(`Cannot find ${indexPath}. Run: python3 scripts/build_index.py`);
  process.exit(2);
}
const engine = createEngine(loadFullIndex(dataDir));

// Layer 3 ("related by meaning"): loaded from site/data/l3 exactly as the page would, so every query here is
// judged the way a visitor would see it. Skipped (with a note) when the vectors are missing.
let semantic = null;
const l3Dir = join(dataDir, 'l3') + '/';
if (existsSync(join(l3Dir, 'records.json'))) {
  const read = async (url, kind) => {
    const b = readFileSync(url);
    return kind === 'json' ? JSON.parse(b) : kind === 'text' ? b.toString('utf8') : b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
  };
  semantic = await loadSemantic(l3Dir, read);
} else {
  console.log('Note: no Layer 3 vectors found; evaluating keyword layers only.');
}

let queries = [];
if (existsSync(evalPath)) {
  try {
    queries = JSON.parse(readFileSync(evalPath, 'utf8')).queries || [];
  } catch (err) {
    console.error(`Cannot read ${evalPath}: ${err.message}`);
    process.exit(2);
  }
}
if (!queries.length) {
  console.log('No evaluation queries yet (data/search-eval.yaml is missing or empty). Nothing to run.');
  process.exit(0);
}

let failed = 0;
for (const q of queries) {
  let res = engine.search(q.query);
  if (semantic && engine.needsSemantic(res)) {
    res = engine.addSemantic(res, semantic.rank(q.query, engine.config.layer3.candidates));
  }
  const exact = engine.flatten(res.exact).map((r) => r.id);
  const related = engine.flatten(res.related).map((r) => r.id);
  const meaning = res.meaningIds || [];
  const group = q.expect_group || 'any';
  const pool = (group === 'exact' ? exact : group === 'related' ? related : group === 'semantic' ? meaning : [...exact, ...related]).slice(0, topN);
  const expected = q.expect_any || [];
  const found = expected.filter((id) => pool.includes(id));
  const ok = q.expect_none
    ? (res.fallback && exact.length === 0 && related.length === 0)
    : expected.length === 0 ? true : found.length > 0;
  if (!ok) failed++;

  const summary = `layer ${res.layer}, ${exact.length} exact, ${related.length} related${meaning.length ? ` (${meaning.length} by meaning)` : ''}`;
  console.log(`${ok ? 'PASS' : 'FAIL'}  "${q.query}"  (${summary}${res.fallback ? ', fallback shown' : ''})`);
  if (!ok && q.expect_none) {
    console.log('      expected the "no close match" fallback with no results shown');
  } else if (!ok) {
    const where = (id) => exact.includes(id) ? `exact #${exact.indexOf(id) + 1}`
      : related.includes(id) ? `related #${related.indexOf(id) + 1}` : 'not returned';
    console.log(`      expected one of [${expected.join(', ')}] in ${group === 'any' ? 'the' : group} top ${topN}`);
    for (const id of expected) console.log(`        ${id}: ${where(id)}`);
  }
  if (!ok || verbose) {
    if (q.note) console.log(`      note: ${q.note}`);
    console.log(`      exact:   ${exact.slice(0, 5).join(', ') || '(none)'}`);
    console.log(`      related: ${related.slice(0, 5).join(', ') || '(none)'}`);
    if (meaning.length) console.log(`      meaning: ${meaning.slice(0, 5).join(', ')}`);
  }
}

console.log(`\n${queries.length - failed} of ${queries.length} queries passed.`);
process.exit(failed ? 1 : 0);

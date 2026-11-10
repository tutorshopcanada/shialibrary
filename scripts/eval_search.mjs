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
//   expect_group: any     -> in the first n results overall (exact first, then related)
// Exit code: 0 all passed (or nothing to run), 1 failures, 2 cannot run.

import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createEngine } from '../site/js/search.js';

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(name);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
};
const dataDir = resolve(opt('--data', join(here, '..', 'site', 'data')));
const topN = Math.max(1, parseInt(opt('--top', '10'), 10) || 10);
const verbose = args.includes('--verbose');

const indexPath = join(dataDir, 'index.json');
const evalPath = join(dataDir, 'search-eval.json');
if (!existsSync(indexPath)) {
  console.error(`Cannot find ${indexPath}. Run: python3 scripts/build_index.py`);
  process.exit(2);
}
const engine = createEngine(JSON.parse(readFileSync(indexPath, 'utf8')));

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
  const res = engine.search(q.query);
  const exact = engine.flatten(res.exact).map((r) => r.id);
  const related = engine.flatten(res.related).map((r) => r.id);
  const group = q.expect_group || 'any';
  const pool = (group === 'exact' ? exact : group === 'related' ? related : [...exact, ...related]).slice(0, topN);
  const expected = q.expect_any || [];
  const found = expected.filter((id) => pool.includes(id));
  const ok = expected.length === 0 ? true : found.length > 0;
  if (!ok) failed++;

  const summary = `layer ${res.layer}, ${exact.length} exact, ${related.length} related`;
  console.log(`${ok ? 'PASS' : 'FAIL'}  "${q.query}"  (${summary}${res.fallback ? ', fallback shown' : ''})`);
  if (!ok) {
    const where = (id) => exact.includes(id) ? `exact #${exact.indexOf(id) + 1}`
      : related.includes(id) ? `related #${related.indexOf(id) + 1}` : 'not returned';
    console.log(`      expected one of [${expected.join(', ')}] in ${group === 'any' ? 'the' : group} top ${topN}`);
    for (const id of expected) console.log(`        ${id}: ${where(id)}`);
  }
  if (!ok || verbose) {
    if (q.note) console.log(`      note: ${q.note}`);
    console.log(`      exact:   ${exact.slice(0, 5).join(', ') || '(none)'}`);
    console.log(`      related: ${related.slice(0, 5).join(', ') || '(none)'}`);
  }
}

console.log(`\n${queries.length - failed} of ${queries.length} queries passed.`);
process.exit(failed ? 1 : 0);

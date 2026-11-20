#!/usr/bin/env node
// Re-tune the search's ranking settings against the measurements (no AI, no network).
//
// The search's ranking is a handful of plain numbers in config/search.yaml (field weights, boosts, thresholds).
// They were first set by hand; as the catalog grows the best values move. This script searches them one at a
// time (coordinate search): for each setting it tries the candidate values below, keeps a value only if the
// combined score (scripts/lib_metrics.mjs objective: graded nDCG, evaluation MRR and hold-out MRR) improves by
// at least --min-gain, no evaluation query that passed starts failing, and neither the graded nDCG nor the
// evaluation MRR drops by more than --tolerance. Two rounds by default.
//
// Why the guard: the hold-out test hides the target page's own sample questions, so on its own it rewards
// weakening the sample-question field for every page, which hurts real searches (every real page has its
// questions). The sample-question weight is therefore not tuned here, and the graded and evaluation scores
// must not get worse.
//
// Run it after a big cataloging batch, not on every build:
//   python3 scripts/build_index.py && node scripts/tune_search.mjs            # report only
//   node scripts/tune_search.mjs --write                                      # also update config/search.yaml
// then rebuild the index, run node scripts/eval_search.mjs and commit the change with the printed numbers.
// Options: --rounds N (2), --min-gain X (0.002), --tolerance X (0.003), --only path1,path2 (tune just these)
//
// The result is still a set of human-readable numbers in config/search.yaml, reviewed in git. Nothing learned
// runs in the browser and nothing generates text.

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadContext, evaluate, objective } from './lib_metrics.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(n); return i !== -1 && args[i + 1] ? args[i + 1] : d; };
const rounds = Number(opt('--rounds', 2));
const minGain = Number(opt('--min-gain', 0.002));
const only = opt('--only', '') ? opt('--only', '').split(',') : null;
const tolerance = Number(opt('--tolerance', 0.003));

// The settings tuned, with the values tried. Keep candidate lists short and sensible: every value costs a full
// measurement (a few seconds).
const SPACE = {
  'layer2.field_weights.title': [2, 2.5, 3, 4],
  'layer2.field_weights.description': [0.6, 1, 1.4],
  'layer2.field_weights.headings': [1, 1.5, 2],
  'layer2.concept_weight': [2, 2.5, 3.5, 5],
  'layer2.concept_full_weight_max_records': [20, 50, 100, 200],
  'layer2.phrase_boost': [1.2, 1.6, 2],
  'layer2.title_match_boost': [1.5, 2, 3],
  'layer2.prefix.weight': [0.2, 0.4, 0.6],
  'ranking.granularity_boost.work': [1, 1.2, 1.4, 1.7, 2],
  'ranking.granularity_boost.section': [1, 1.08, 1.16, 1.3],
  'ranking.level_boost.beginner': [1, 1.1, 1.25, 1.4],
  'ranking.level_boost.intermediate': [1, 1.05, 1.1, 1.2],
  'exact.heading_substitution_max_records': [60, 120, 250],
  'layer3.max_exact': [1, 2, 3, 5],
  'layer3.min_word_coverage': [0, 0.5, 0.67, 0.8],
};

const get = (o, path) => path.split('.').reduce((x, k) => (x ? x[k] : undefined), o);
const fmt = (x) => (typeof x === 'number' ? +x.toFixed(4) : x);
const line = (M) => `objective ${fmt(objective(M))}  judged.ndcg10 ${fmt(M.judged?.ndcg10)}  eval.mrr ${fmt(M.eval?.mrr)}  holdout.mrr ${fmt(M.holdout?.mrr)}  eval passed ${M.eval?.passed}/${M.eval?.total}`;

const ctx = await loadContext(root);
const base = evaluate(ctx).metrics;
console.log('start   ', line(base));
const basePassed = base.eval ? base.eval.passed : 0;

const chosen = {};
let best = base, bestScore = objective(base);
const keys = Object.keys(SPACE).filter((k) => !only || only.includes(k));
for (let r = 1; r <= rounds; r++) {
  let changed = false;
  for (const key of keys) {
    const current = key in chosen ? chosen[key] : get(ctx.index.config, key);
    for (const v of SPACE[key]) {
      if (v === current) continue;
      const M = evaluate(ctx, { ...chosen, [key]: v }).metrics;
      const s = objective(M);
      const ok = (!M.eval || M.eval.passed >= basePassed) &&
        (!M.judged || M.judged.ndcg10 >= best.judged.ndcg10 - tolerance) &&
        (!M.eval || M.eval.mrr >= best.eval.mrr - tolerance);
      if (ok && s >= bestScore + minGain) {
        chosen[key] = v; best = M; bestScore = s; changed = true;
        console.log(`round ${r} ${key} ${fmt(current)} -> ${v}   ${line(M)}`);
      }
    }
  }
  if (!changed) break;
}

console.log('\nend     ', line(best));
const changes = Object.entries(chosen).filter(([k, v]) => v !== get(ctx.index.config, k));
if (!changes.length) { console.log('No setting changed: the current values are already the best of those tried.'); process.exit(0); }
console.log('\nProposed changes to config/search.yaml:');
for (const [k, v] of changes) console.log(`  ${k}: ${fmt(get(ctx.index.config, k))} -> ${v}`);

if (args.includes('--write')) {
  // Line-based update that keeps the comments: walk the YAML by indentation and replace the value in place.
  const path = join(root, 'config', 'search.yaml');
  const lines = readFileSync(path, 'utf8').split('\n');
  for (const [key, v] of changes) {
    const want = key.split('.');
    const stack = [];
    let done = false;
    for (let i = 0; i < lines.length && !done; i++) {
      const m = /^(\s*)([A-Za-z0-9_.-]+):(\s*)([^#\n]*?)(\s*#.*)?$/.exec(lines[i]);
      if (!m) continue;
      const depth = m[1].length / 2;
      stack.length = depth;
      stack[depth] = m[2];
      if (stack.length === want.length && stack.every((k, j) => k === want[j]) && m[4].trim() !== '') {
        lines[i] = `${m[1]}${m[2]}:${m[3] || ' '}${v}${m[5] || ''}`;
        done = true;
      }
    }
    if (!done) { console.error(`Could not find ${key} in config/search.yaml; add it there first.`); process.exit(1); }
  }
  writeFileSync(path, lines.join('\n'));
  console.log('\nconfig/search.yaml updated. Next: python3 scripts/build_index.py && node scripts/eval_search.mjs');
}

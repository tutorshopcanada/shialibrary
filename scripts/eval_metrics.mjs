#!/usr/bin/env node
// Search quality metrics (no AI, no network). Search proposal phase A (proposals/search-v2.md section 5).
// The measuring itself lives in scripts/lib_metrics.mjs (shared with scripts/tune_search.mjs).
//
//   python3 scripts/build_index.py && node scripts/eval_metrics.mjs
// Options:
//   --min name=value   fail (exit 1) when a metric is below value, e.g. --min judged.ndcg10=0.6
//   --max name=value   fail when a metric is above value, e.g. --max judged.junk3=0.5
//   --set path=value   try a setting without editing config/search.yaml, e.g. --set ranking.level_boost.beginner=1.2
//   --json             print the metrics as JSON only
//   --show             print the top 5 results for every judged query
//   --skip-holdout     faster run

import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadContext, evaluate, objective } from './lib_metrics.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const pairs = (n) => args.flatMap((a, i) => (a === n && args[i + 1] ? [args[i + 1].split('=')] : []));

const overrides = {};
for (const [path, raw] of pairs('--set')) { try { overrides[path] = JSON.parse(raw); } catch { overrides[path] = raw; } }

const ctx = await loadContext(root);
const { metrics: M, problems, shows } = evaluate(ctx, overrides, { holdout: !flag('--skip-holdout'), show: flag('--show') });
const { evalFailed, ...report } = M;
report.score = { objective: objective(M) };

const get = (name) => name.split('.').reduce((o, k) => (o ? o[k] : undefined), report);
const round = (o) => JSON.parse(JSON.stringify(o, (k, v) => (typeof v === 'number' && !Number.isInteger(v) ? +v.toFixed(3) : v)));
if (flag('--json')) console.log(JSON.stringify(round(report)));
else {
  for (const [group, vals] of Object.entries(round(report))) console.log(group.padEnd(8), Object.entries(vals).map(([k, v]) => `${k} ${v}`).join('  '));
  for (const s of shows) console.log(s);
}
for (const [name, v] of pairs('--min')) if (!(get(name) >= Number(v))) problems.push(`${name} = ${get(name)} is below the minimum ${v}`);
for (const [name, v] of pairs('--max')) if (!(get(name) <= Number(v))) problems.push(`${name} = ${get(name)} is above the maximum ${v}`);
for (const p of problems) console.error('FAIL ' + p);
process.exit(problems.length ? 1 : 0);

#!/usr/bin/env node
// Search quality metrics (no AI, no network). Search proposal phase A (proposals/search-v2.md section 5).
//
// Runs queries through the SAME modules the page uses (site/js/search.js, and site/js/semantic.js when the
// page would consult it) and reports:
//   judged   data/search-judgments.yaml (graded 0-3): nDCG@10 (condensed: unjudged records are skipped),
//            P@5 (share of the first 5 judged results graded good or ideal), hit@1 (first result good or
//            ideal), junk@3 (results graded wrong among the first 3, per query), zero (no results)
//   eval     data/search-eval.yaml: MRR, hit@1, hit@3 of the first expected record
//   holdout  600 random records: their sample questions are removed from the index, then each record's
//            first sample question is searched. MRR, hit@1, hit@10. Keyword layers only, because the
//            meaning vectors were built with the sample questions included.
//   speed    engine start-up and query time on this machine
//
//   python3 scripts/build_index.py && node scripts/eval_metrics.mjs
// Options:
//   --min name=value   fail (exit 1) when a metric is below value, e.g. --min judged.ndcg10=0.6
//   --max name=value   fail when a metric is above value, e.g. --max judged.junk3=0.5
//   --json             print the metrics as JSON only
//   --show             print the top 5 results for every judged query
//   --skip-holdout     faster run

import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createEngine } from '../site/js/search.js';
import { loadSemantic } from '../site/js/semantic.js';
import { loadFullIndex } from './lib_index.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const dataDir = join(root, 'site', 'data');
const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const pairs = (n) => args.flatMap((a, i) => (a === n && args[i + 1] ? [args[i + 1].split('=')] : []));

const yaml = (p) => JSON.parse(execFileSync('python3', ['-c',
  'import json,sys,yaml; print(json.dumps(yaml.safe_load(open(sys.argv[1], encoding="utf-8"))))', p], { encoding: 'utf8' }));

const t0 = performance.now();
const index = loadFullIndex(dataDir);
const engine = createEngine(index);
const startMs = performance.now() - t0;

let semantic = null;
if (existsSync(join(dataDir, 'l3', 'records.json'))) {
  const read = async (url, kind) => {
    const b = readFileSync(url);
    return kind === 'json' ? JSON.parse(b) : kind === 'text' ? b.toString('utf8') : b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
  };
  semantic = await loadSemantic(join(dataDir, 'l3') + '/', read);
}

const times = [];
function run(eng, q, useSemantic = true) {
  const t = performance.now();
  let r = eng.search(q);
  if (useSemantic && semantic && eng.needsSemantic(r)) r = eng.addSemantic(r, semantic.rank(q, eng.config.layer3.candidates));
  times.push(performance.now() - t);
  const ids = [];
  for (const g of ['exact', 'related']) {
    for (const e of r[g] || []) {
      if (e.kind === 'cluster') for (const it of e.items) ids.push(it.record.id);
      else ids.push(e.record.id);
    }
  }
  return ids;
}

const M = {};
const problems = [];

// ---- Judged queries ----
const judgedPath = join(root, 'data', 'search-judgments.yaml');
const shows = [];
if (existsSync(judgedPath)) {
  const doc = yaml(judgedPath);
  const GR = { ideal: 3, good: 2, partial: 1, wrong: 0 };
  let ndcg = 0, p5 = 0, hit1 = 0, junk3 = 0, zero = 0, n = 0;
  for (const q of doc.queries || []) {
    const grade = new Map();
    for (const [k, g] of Object.entries(GR)) for (const id of q[k] || []) {
      if (!engine.recordById.has(id)) problems.push(`judgments: "${q.query}" lists unknown record ${id}`);
      grade.set(id, g);
    }
    const ids = run(engine, q.query);
    n++;
    if (!ids.length) zero++;
    const judged = ids.filter((id) => grade.has(id));
    const gain = (g) => 2 ** g - 1;
    let dcg = 0;
    judged.slice(0, 10).forEach((id, i) => { dcg += gain(grade.get(id)) / Math.log2(i + 2); });
    let idcg = 0;
    [...grade.values()].sort((a, b) => b - a).slice(0, 10).forEach((g, i) => { idcg += gain(g) / Math.log2(i + 2); });
    ndcg += idcg ? dcg / idcg : 0;
    const top5 = judged.slice(0, 5);
    p5 += top5.length ? top5.filter((id) => grade.get(id) >= 2).length / 5 : 0;
    if (ids.length && (grade.get(ids[0]) ?? -1) >= 2) hit1++;
    junk3 += ids.slice(0, 3).filter((id) => grade.get(id) === 0).length;
    if (flag('--show')) shows.push(`\n## ${q.query}\n` + ids.slice(0, 5).map((id) => `  ${grade.has(id) ? grade.get(id) : '?'} ${id} | ${String(engine.recordById.get(id).title).slice(0, 70)}`).join('\n'));
  }
  M.judged = { queries: n, ndcg10: ndcg / n, p5: p5 / n, hit1: hit1 / n, junk3: junk3 / n, zero: zero / n };
}

// ---- Expected-record evaluation set ----
const evalPath = join(dataDir, 'search-eval.json');
if (existsSync(evalPath)) {
  const ev = JSON.parse(readFileSync(evalPath, 'utf8'));
  const items = (ev.queries || ev).filter((q) => Array.isArray(q.expect_any) && q.expect_any.length);
  let mrr = 0, h1 = 0, h3 = 0;
  for (const q of items) {
    const ids = run(engine, q.query);
    const want = new Set(q.expect_any);
    const k = ids.findIndex((id) => want.has(id));
    if (k >= 0) { mrr += 1 / (k + 1); if (k === 0) h1++; if (k < 3) h3++; }
  }
  M.eval = { queries: items.length, mrr: mrr / items.length, hit1: h1 / items.length, hit3: h3 / items.length };
}

// ---- Hold-out: unseen beginner phrasings ----
if (!flag('--skip-holdout')) {
  const idx = loadFullIndex(dataDir);
  let seed = 7;
  const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
  const pool = idx.records.filter((r) => (r.sample_questions || []).length >= 3);
  const pick = new Set();
  while (pick.size < Math.min(600, pool.length)) pick.add(pool[Math.floor(rnd() * pool.length)].id);
  const held = [];
  for (const r of idx.records) if (pick.has(r.id)) { held.push([r.id, r.sample_questions[0]]); r.sample_questions = []; }
  const eng = createEngine(idx);
  let mrr = 0, h1 = 0, h10 = 0, zero = 0;
  for (const [id, q] of held) {
    const ids = run(eng, q, false);
    if (!ids.length) zero++;
    const k = ids.indexOf(id);
    if (k >= 0) { mrr += 1 / (k + 1); if (k === 0) h1++; if (k < 10) h10++; }
  }
  const n = held.length;
  M.holdout = { queries: n, mrr: mrr / n, hit1: h1 / n, hit10: h10 / n, zero: zero / n };
}

times.sort((a, b) => a - b);
M.speed = { start_ms: startMs, query_p50_ms: times[times.length >> 1] || 0, query_p95_ms: times[Math.floor(times.length * 0.95)] || 0 };

// ---- Report and gates ----
const get = (name) => name.split('.').reduce((o, k) => (o ? o[k] : undefined), M);
const round = (o) => JSON.parse(JSON.stringify(o, (k, v) => (typeof v === 'number' && !Number.isInteger(v) ? +v.toFixed(3) : v)));
if (flag('--json')) console.log(JSON.stringify(round(M)));
else {
  for (const [group, vals] of Object.entries(round(M))) console.log(group.padEnd(8), Object.entries(vals).map(([k, v]) => `${k} ${v}`).join('  '));
  for (const s of shows) console.log(s);
}
for (const [name, v] of pairs('--min')) if (!(get(name) >= Number(v))) problems.push(`${name} = ${get(name)} is below the minimum ${v}`);
for (const [name, v] of pairs('--max')) if (!(get(name) <= Number(v))) problems.push(`${name} = ${get(name)} is above the maximum ${v}`);
for (const p of problems) console.error('FAIL ' + p);
process.exit(problems.length ? 1 : 0);

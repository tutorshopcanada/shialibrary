// Shared search-quality measurement (no AI, no network). Used by scripts/eval_metrics.mjs (report + CI gates)
// and scripts/tune_search.mjs (re-tuning the ranking settings). Everything is loaded once; evaluate() can then
// be called many times with different setting overrides.
//
// Metrics (proposals/search-v2.md section 5):
//   judged   data/search-judgments.yaml (graded 0-3): nDCG@10 (condensed: unjudged records are skipped), P@5,
//            hit@1 (first result good or ideal), junk@3 (results graded wrong among the first 3, per query), zero
//   eval     data/search-eval.yaml: MRR, hit@1, hit@3 of the first expected record, and the pass/fail count
//            under the same rules as scripts/eval_search.mjs
//   holdout  600 random records: their sample questions are removed from the index, then each record's first
//            sample question is searched. Keyword layers only (the meaning vectors include sample questions).
//   speed    engine start-up and query time on this machine

import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { createEngine } from '../site/js/search.js';
import { loadSemantic } from '../site/js/semantic.js';
import { loadFullIndex } from './lib_index.mjs';

const yaml = (p) => JSON.parse(execFileSync('python3', ['-c',
  'import json,sys,yaml; print(json.dumps(yaml.safe_load(open(sys.argv[1], encoding="utf-8"))))', p], { encoding: 'utf8' }));

/** Load the catalog, judgments, evaluation queries, hold-out set and meaning model once. */
export async function loadContext(root) {
  const dataDir = join(root, 'site', 'data');
  const index = loadFullIndex(dataDir);
  let semantic = null;
  if (existsSync(join(dataDir, 'l3', 'records.json'))) {
    const read = async (url, kind) => {
      const b = readFileSync(url);
      return kind === 'json' ? JSON.parse(b) : kind === 'text' ? b.toString('utf8') : b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
    };
    semantic = await loadSemantic(join(dataDir, 'l3') + '/', read);
  }
  const judgedPath = join(root, 'data', 'search-judgments.yaml');
  const judgments = existsSync(judgedPath) ? (yaml(judgedPath).queries || []) : [];
  const evalPath = join(dataDir, 'search-eval.json');
  const evalQueries = existsSync(evalPath) ? (JSON.parse(readFileSync(evalPath, 'utf8')).queries || []) : [];

  // Hold-out copy of the catalog: 600 fixed random records lose their sample questions.
  let seed = 7;
  const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
  const pool = index.records.filter((r) => (r.sample_questions || []).length >= 3);
  const pick = new Set();
  while (pick.size < Math.min(600, pool.length)) pick.add(pool[Math.floor(rnd() * pool.length)].id);
  const held = [];
  const holdoutRecords = index.records.map((r) => {
    if (!pick.has(r.id)) return r;
    held.push([r.id, r.sample_questions[0]]);
    return { ...r, sample_questions: [] };
  });
  return { root, dataDir, index, semantic, judgments, evalQueries, holdoutRecords, held };
}

/** Deep copy of the index config with dotted-path overrides applied, e.g. {'layer2.concept_weight': 3}. */
export function withOverrides(config, overrides = {}) {
  const out = JSON.parse(JSON.stringify(config || {}));
  for (const [path, v] of Object.entries(overrides)) {
    const keys = path.split('.');
    let o = out;
    for (const k of keys.slice(0, -1)) o = o[k] = o[k] && typeof o[k] === 'object' ? o[k] : {};
    o[keys[keys.length - 1]] = v;
  }
  return out;
}

/**
 * Measure the search with the given setting overrides.
 * options: { holdout: true, show: false } (show collects the top 5 of every judged query)
 */
export function evaluate(ctx, overrides = {}, options = {}) {
  const config = withOverrides(ctx.index.config, overrides);
  const t0 = performance.now();
  const engine = createEngine({ ...ctx.index, config });
  const startMs = performance.now() - t0;
  const times = [];
  const problems = [];
  const shows = [];

  const run = (eng, q, useSemantic = true) => {
    const t = performance.now();
    let r = eng.search(q);
    if (useSemantic && ctx.semantic && eng.needsSemantic(r)) r = eng.addSemantic(r, ctx.semantic.rank(q, eng.config.layer3.candidates));
    times.push(performance.now() - t);
    return r;
  };
  const ids = (r) => {
    const out = [];
    for (const g of ['exact', 'related']) for (const e of r[g] || []) {
      if (e.kind === 'cluster') for (const it of e.items) out.push(it.record.id); else out.push(e.record.id);
    }
    return out;
  };

  const M = {};
  // ---- Judged queries ----
  if (ctx.judgments.length) {
    const GR = { ideal: 3, good: 2, partial: 1, wrong: 0 };
    let ndcg = 0, p5 = 0, hit1 = 0, junk3 = 0, zero = 0;
    for (const q of ctx.judgments) {
      const grade = new Map();
      for (const [k, g] of Object.entries(GR)) for (const id of q[k] || []) {
        if (!engine.recordById.has(id)) problems.push(`judgments: "${q.query}" lists unknown record ${id}`);
        grade.set(id, g);
      }
      const list = ids(run(engine, q.query));
      if (!list.length) zero++;
      const judged = list.filter((id) => grade.has(id));
      const gain = (g) => 2 ** g - 1;
      let dcg = 0, idcg = 0;
      judged.slice(0, 10).forEach((id, i) => { dcg += gain(grade.get(id)) / Math.log2(i + 2); });
      [...grade.values()].sort((a, b) => b - a).slice(0, 10).forEach((g, i) => { idcg += gain(g) / Math.log2(i + 2); });
      ndcg += idcg ? dcg / idcg : 0;
      const top5 = judged.slice(0, 5);
      p5 += top5.length ? top5.filter((id) => grade.get(id) >= 2).length / 5 : 0;
      if (list.length && (grade.get(list[0]) ?? -1) >= 2) hit1++;
      junk3 += list.slice(0, 3).filter((id) => grade.get(id) === 0).length;
      if (options.show) shows.push(`\n## ${q.query}\n` + list.slice(0, 5).map((id) => `  ${grade.has(id) ? grade.get(id) : '?'} ${id} | ${String(engine.recordById.get(id).title).slice(0, 70)}`).join('\n'));
    }
    const n = ctx.judgments.length;
    M.judged = { queries: n, ndcg10: ndcg / n, p5: p5 / n, hit1: hit1 / n, junk3: junk3 / n, zero: zero / n };
  }

  // ---- Evaluation set: ranking of the expected record, and pass/fail as in eval_search.mjs ----
  if (ctx.evalQueries.length) {
    let mrr = 0, h1 = 0, h3 = 0, ranked = 0, passed = 0;
    const failed = [];
    for (const q of ctx.evalQueries) {
      const res = run(engine, q.query);
      const exact = engine.flatten(res.exact).map((r) => r.id);
      const related = engine.flatten(res.related).map((r) => r.id);
      const meaning = res.meaningIds || [];
      const group = q.expect_group || 'any';
      const pool = (group === 'exact' ? exact : group === 'related' ? related : group === 'semantic' ? meaning : [...exact, ...related]).slice(0, q.top || 10);
      const expected = q.expect_any || [];
      const ok = q.expect_none ? (res.fallback && !exact.length && !related.length)
        : !expected.length || expected.some((id) => pool.includes(id));
      if (ok) passed++; else failed.push(q.query);
      if (expected.length) {
        ranked++;
        const all = [...exact, ...related];
        const k = all.findIndex((id) => expected.includes(id));
        if (k >= 0) { mrr += 1 / (k + 1); if (k === 0) h1++; if (k < 3) h3++; }
      }
    }
    M.eval = { queries: ranked, mrr: mrr / ranked, hit1: h1 / ranked, hit3: h3 / ranked, passed, total: ctx.evalQueries.length };
    M.evalFailed = failed;
  }

  // ---- Hold-out: unseen beginner phrasings ----
  if (options.holdout !== false && ctx.held.length) {
    const eng = createEngine({ ...ctx.index, records: ctx.holdoutRecords, config });
    let mrr = 0, h1 = 0, h10 = 0, zero = 0;
    for (const [id, q] of ctx.held) {
      const list = ids(run(eng, q, false));
      if (!list.length) zero++;
      const k = list.indexOf(id);
      if (k >= 0) { mrr += 1 / (k + 1); if (k === 0) h1++; if (k < 10) h10++; }
    }
    const n = ctx.held.length;
    M.holdout = { queries: n, mrr: mrr / n, hit1: h1 / n, hit10: h10 / n, zero: zero / n };
  }

  times.sort((a, b) => a - b);
  M.speed = { start_ms: startMs, query_p50_ms: times[times.length >> 1] || 0, query_p95_ms: times[Math.floor(times.length * 0.95)] || 0 };
  return { metrics: M, problems, shows };
}

/** One number to compare settings by: graded quality, expected-record ranking and unseen phrasings. */
export function objective(M) {
  return 0.35 * (M.judged ? M.judged.ndcg10 : 0) + 0.25 * (M.eval ? M.eval.mrr : 0) + 0.4 * (M.holdout ? M.holdout.mrr : 0);
}

#!/usr/bin/env node
// Type-ahead suggestion evaluation (no AI, no network). Uses the same module as the page.
//   node scripts/eval_suggest.mjs [--verbose]
// Each case: what a person types, and text fragments (case-insensitive) of which at least one
// must appear in the top 5 suggestions. Exit code 1 on any failure.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createSuggester } from '../site/js/suggest.js';

const here = dirname(fileURLToPath(import.meta.url));
const index = JSON.parse(readFileSync(join(here, '..', 'site', 'data', 'index.json'), 'utf8'));
const verbose = process.argv.includes('--verbose');
const s = createSuggester(index);

const cases = [
  ['how do shi', ['how do shias pray']],
  ['how to pr', ['pray']],
  ['khu', ['khums']],
  ['what is khu', ['khums']],
  ['sist', ['sistani']],
  ['ayatollah sis', ['sistani']],
  ['khame', ['khamenei']],
  ['namaz', ['prayer (salah) (namaz)']],
  ['pray', ['prayer']],
  ['hussa', ['husayn', 'hussain', 'hussein']],
  ['hussai', ['husayn', 'hussain', 'hussein']],
  ['ashu', ['ashura', 'ashoora']],
  ['mahd', ['mahdi']],
  ['nahj', ['nahj al-balagha', 'nahj al-balaghah', 'nahjul']],
  ['fast', ['fasting']],
  ['wudu', ['wudu', 'wuzu', 'ablution']],
  ['al kaf', ['al-kafi']],
  ['tawh', ['tawhid']],
  ['who is', ['who is']],
  ['who are the tw', ['twelve']],
  ['karb', ['karbala']],
  ['muharr', ['muharram']],
  ['hadi', ['hadith']],
  ['imamat', ['imamate', 'imamah']],
  ['zakat', ['zakat', 'khums']],
  ['hajj', ['hajj']],
  ['Qur\'ā', ['quran']],
  ['ghay', ['ghaybah', 'occultation', 'ghayba']],
  ['why do shia cr', ['cry', 'mourn']],
  ['صلا', ['prayer']],
  ['نما', ['prayer']],
  ['ziyar', ['ziyarat', 'ziyara']],
];

let failed = 0;
const t0 = performance.now();
for (const [typed, expect] of cases) {
  const top = s.suggest(typed, 8).slice(0, 5);
  const hay = top.map((x) => x.text.toLowerCase());
  const ok = expect.some((e) => hay.some((h) => h.includes(e.toLowerCase())));
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  "${typed}"`);
  if (!ok || verbose) {
    console.log(`      expected one of: ${expect.join(' | ')}`);
    for (const x of top) console.log(`      [${x.kind}] ${x.text}`);
    if (!top.length) console.log('      (no suggestions)');
  }
}

// Behaviour rules
const rules = [
  ['empty input gives nothing', () => s.suggest('').length === 0 && s.suggest('   ').length === 0],
  ['one Latin character gives nothing', () => s.suggest('k').length === 0],
  ['one Arabic character is enough', () => s.suggest('ص').length > 0],
  ['never more than the limit', () => s.suggest('al', 8).length <= 8],
  ['no single Q&A items among titles', () => {
    const items = new Set(index.records.filter((r) => r.granularity === 'item').map((r) => r.title));
    const workTitles = new Set(index.records.filter((r) => r.granularity !== 'item').map((r) => r.title));
    return ['a', 'wh', 'ho', 'is', 'th', 'pra'].every((q) => s.suggest(q, 8).filter((x) => x.kind === 'title')
      .every((x) => !items.has(x.text) || workTitles.has(x.text)));
  }],
  ['starters returns up to 5 questions', () => { const r = s.starters(5); return r.length > 0 && r.length <= 5 && r.every((x) => x.kind === 'question'); }],
  ['topic suggestions target a heading id', () => s.suggest('prayer').some((x) => x.kind === 'topic' && x.target.topic)],
];
for (const [name, fn] of rules) {
  const ok = fn();
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  rule: ${name}`);
}

const keys = ['a', 'al', 'how do', 'khu', 'sh', 'pra', 'imam', 'the'];
const t1 = performance.now();
let n = 0;
for (let i = 0; i < 20; i++) for (const k of keys) { s.suggest(k); n++; }
const per = (performance.now() - t1) / n;
console.log(`\nSpeed: ${per.toFixed(2)} ms per keystroke (${n} runs). Build: ${(t1 - t0).toFixed(0)} ms incl. cases.`);
console.log(`${cases.length + rules.length - failed} of ${cases.length + rules.length} checks passed.`);
process.exit(failed ? 1 : 0);

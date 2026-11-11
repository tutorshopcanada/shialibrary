// Checks that the browser tokenizer (site/js/semantic.js) gives exactly the same word-piece ids as the
// reference tokenizer for the model, on the cases saved by scripts/export_static_model.py.
// Run: node scripts/test_semantic.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createSemantic } from '../site/js/semantic.js';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const L3 = path.join(root, 'site/data/l3');
const buf = (n) => { const b = fs.readFileSync(path.join(L3, n)); return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength); };
const sem = createSemantic({
  meta: JSON.parse(fs.readFileSync(path.join(L3, 'model.json'), 'utf8')),
  vocabText: fs.readFileSync(path.join(L3, 'vocab.txt'), 'utf8'),
  tokenVecs: buf('tokens.i8'), tokenScales: buf('tokens.scale'),
});
const cases = JSON.parse(fs.readFileSync(path.join(root, 'scripts/fixtures/tokenizer_cases.json'), 'utf8'));
let bad = 0;
for (const c of cases) {
  const got = sem.tokenIds(c.text);
  const ok = JSON.stringify(got) === JSON.stringify(c.ids);
  if (!ok) { bad++; console.log('FAIL', JSON.stringify(c.text.slice(0, 50)), '\n  want', c.ids.slice(0, 20), '\n  got ', got.slice(0, 20)); }
}
console.log(`${cases.length - bad} of ${cases.length} tokenizer cases match`);
process.exit(bad ? 1 : 0);

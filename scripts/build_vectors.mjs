// Builds the record vectors for search Layer 3 ("related by meaning") into site/data/l3/.
// No AI is used at search time: this only measures similarity. Run after scripts/build_index.py:
//   python3 scripts/build_index.py && node scripts/build_vectors.mjs
// `--check` verifies the stored vectors are current (used by CI) and exits 1 when they are stale.
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { createSemantic } from '../site/js/semantic.js';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const L3 = path.join(root, 'site/data/l3');
const check = process.argv.includes('--check');
const buf = (n) => { const b = fs.readFileSync(path.join(L3, n)); return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength); };

const index = JSON.parse(fs.readFileSync(path.join(root, 'site/data/index.json'), 'utf8'));
const label = new Map((index.headings || []).map((h) => [h.id, h.label]));
const text = (r) => {
  const ctx = r.context || {};
  const section = r.granularity === 'item' && ctx.section ? ctx.section.title : '';
  return [r.title, section, ' ' + String(r.description || '').replace(/\s+/g, ' '),
    ' ' + (r.sample_questions || []).join(' '), ' ' + (r.headings || []).map((h) => label.get(h) || h).join(', ')]
    .filter((x) => x !== '').join('. ').replace(/\.\s+\./g, '.');
};
const texts = index.records.map(text);
const hash = crypto.createHash('sha256').update(index.records.map((r, i) => r.id + '\t' + texts[i]).join('\n')).digest('hex');

const storedPath = path.join(L3, 'records.json');

// The word pieces the catalog uses must all have a vector in the (pruned) model files; see
// scripts/export_static_model.py. Returns the missing piece ids, and lists the used ones for that script.
const tokenizer = createSemantic({
  meta: JSON.parse(fs.readFileSync(path.join(L3, 'model.json'), 'utf8')),
  vocabText: fs.readFileSync(path.join(L3, 'vocab.txt'), 'utf8'),
  tokenVecs: buf('tokens.q4'), tokenScales: buf('tokens.scale'), tokenKeep: buf('tokens.keep'),
});
const keepBits = new Uint8Array(buf('tokens.keep'));
const used = [...new Set(texts.flatMap((t) => tokenizer.tokenIds(t)))].sort((a, b) => a - b);
const missing = used.filter((id) => !(keepBits[id >> 3] & (1 << (id & 7))));
const usedPath = path.join(root, 'scripts/fixtures/l3_used_pieces.json');
const missingMsg = `${missing.length} word pieces used by the catalog have no vector. Run: python3 scripts/export_static_model.py && node scripts/build_vectors.mjs`;
if (check) {
  if (missing.length) { console.error(missingMsg); process.exit(1); }
}
if (check) {
  const stored = fs.existsSync(storedPath) ? JSON.parse(fs.readFileSync(storedPath, 'utf8')) : null;
  if (!stored || stored.text_hash !== hash) {
    console.error('Layer 3 vectors are out of date. Run: python3 scripts/build_index.py && node scripts/build_vectors.mjs');
    process.exit(1);
  }
  console.log(`Layer 3 vectors are current (${stored.ids.length} records).`);
  process.exit(0);
}

fs.writeFileSync(usedPath, JSON.stringify(used) + '\n');
if (missing.length) { console.error(missingMsg); process.exit(1); }
const sem = tokenizer;
let empty = 0;
const vectors = texts.map((t) => { const v = sem.embed(t); if (!v) empty++; return v; });
const { q, s } = sem.quantise(vectors);
fs.writeFileSync(path.join(L3, 'records.i8'), Buffer.from(q.buffer));
fs.writeFileSync(path.join(L3, 'records.scale'), Buffer.from(s.buffer));
fs.writeFileSync(storedPath, JSON.stringify({ ids: index.records.map((r) => r.id), text_hash: hash, dim: sem.dim }));
console.log(`Wrote vectors for ${vectors.length} records (${(q.length / 1e3).toFixed(0)} KB)${empty ? `; ${empty} had no known words` : ''}.`);

#!/usr/bin/env node
// Hold-out ranking test (no AI, no network): hides the sample questions of 600 random records, searches
// with each record's first sample question, and reports MRR / hit@1 / hit@10. Run after build_index.py.
//   node scripts/eval_holdout.mjs
import { createEngine } from '../site/js/search.js';
import { loadFullIndex } from './lib_index.mjs';
const idx = loadFullIndex(new URL('../site/data', import.meta.url).pathname);
let seed=7; const rnd=()=>(seed=(seed*1103515245+12345)%2147483648)/2147483648;
const recs = idx.records.filter(r=>(r.sample_questions||[]).length>=3);
const pick = new Set(); while(pick.size<600) pick.add(recs[Math.floor(rnd()*recs.length)].id);
const held = [];
for (const r of idx.records) if (pick.has(r.id)) { held.push([r.id, r.sample_questions[0], r.parent]); r.sample_questions=[]; }
const e = createEngine(idx);
const flat = (r)=>{const o=[];for(const g of ['exact','related'])for(const x of r[g]||[]){if(x.kind==='cluster')for(const i of x.items)o.push(i.record);else o.push(x.record)}return o};
let mrr=0,h1=0,h10=0,zero=0,fam10=0;
for (const [id,q,parent] of held){ const o=flat(e.search(q)); if(!o.length) zero++;
  const k=o.findIndex(x=>x.id===id); if(k>=0){mrr+=1/(k+1); if(k===0)h1++; if(k<10)h10++;}
  const f=o.slice(0,10).findIndex(x=>x.id===id||(parent&&(x.id===parent||x.parent===parent))||x.parent===id); if(f>=0) fam10++;
}
const n=held.length; console.log({n, MRR:+(mrr/n).toFixed(3), hit1:+(h1/n).toFixed(3), hit10:+(h10/n).toFixed(3), hit10_incl_same_section:+(fam10/n).toFixed(3), zeroResults:+(zero/n).toFixed(3)});

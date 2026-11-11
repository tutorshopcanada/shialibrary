#!/usr/bin/env python3
"""Build a reviewer's worklist of every record flagged `needs_review`. No AI, no network.

Writes review/index.html: one self-contained page (no external files) that groups the
flagged records by the reason in their review_note, with search, filters, a link to the
source page and the record's file name. It is deliberately NOT written into site/, so it
is not published with the search page; open it locally or share the file with reviewers.

Usage:  python3 scripts/build_review.py [--root PATH]
"""
import argparse
import datetime
import glob
import html
import json
import os
import re

import yaml

# category id -> (label, regex over the lower-cased review_note). A record can be in several.
CATEGORIES = [
    ("level", "Level not stated or inferred", r"level|audience|beginner|intermediate|advanced"),
    ("sunni", "Shia and Sunni views differ", r"sunni|imamate|succession|ghadir|caliph|fadak|saqifa|mu.?awiy|yazid"),
    ("history", "Contested history", r"contested|disputed|history|historical|occultation|mahdi|siffin|jamal|hasan"),
    ("faith", "Other faiths or non-Muslims", r"non-muslim|other faith|christian|jewish|jew|hindu|sikh|buddh|people of the book|dhimmi|polytheis|kafir|disbeliev|kosher"),
    ("sexual", "Sexual or intimate matters", r"sexual|intercourse|masturbat|janab|menstru|pornograph|adulter|pre-marital|premarital|fornicat|intimacy|ejaculat|kissing|looking"),
    ("marriage", "Marriage, family or gender", r"marriage|divorce|women|gender|mut.?ah|temporary marriage|family|custody"),
    ("ruling", "Might be a rulings work", r"fiqh|ruling|legal|law\b|jurist|ijtihad|worship|recommended acts"),
    ("polemic", "Possible polemic", r"polemic|rebut|argues against|response to|critics"),
    ("author", "Author or scholar to confirm", r"author|compiler|translator|scholar|mufid|same person|attributed"),
    ("heading", "Subject heading fit", r"heading|topic fit|no heading"),
    ("duplicate", "Duplicate or near-duplicate", r"duplicate|repeats|twice|same text|near-identical|cross-noted"),
    ("thin", "Thin or uncertain description", r"outline only|thin|truncated|opening text only|first 100|not read|uncertain|unclear|no description|exact subject"),
    ("sensitive", "Sensitive topic", r"sensitive|mourning|azadari|matam|depiction|penalt|prostitut|black magic|abortion|cloning"),
]


def categorise(note):
    n = (note or "").lower()
    cats = [cid for cid, _, rx in CATEGORIES if re.search(rx, n)]
    return cats or ["other"]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", default=os.path.join(os.path.dirname(__file__), ".."))
    root = os.path.abspath(ap.parse_args().root)

    scholars = {s["id"]: s["name"] for s in (yaml.safe_load(open(os.path.join(root, "data/scholars.yaml"), encoding="utf-8")) or {}).get("scholars", [])}
    recs = []
    total = 0
    for path in sorted(glob.glob(os.path.join(root, "data/records/**/*.yaml"), recursive=True)):
        r = yaml.safe_load(open(path, encoding="utf-8"))
        total += 1
        if not r.get("needs_review"):
            continue
        recs.append({
            "id": r["id"], "title": r["title"], "source": r["source"], "level": r["level"],
            "tag": r["content_tag"], "gran": r["granularity"], "url": r["url"],
            "authors": [scholars.get(a, a) for a in (r.get("authors") or [])],
            "marja": r.get("marja") or "", "note": (r.get("review_note") or "").strip(),
            "desc": " ".join(str(r.get("description") or "").split()),
            "file": os.path.relpath(path, root), "cats": categorise(r.get("review_note")),
        })
    labels = {c: l for c, l, _ in CATEGORIES}
    labels["other"] = "Other"
    counts = {c: sum(1 for x in recs if c in x["cats"]) for c in labels}
    data = {"records": recs, "labels": labels, "counts": counts, "total": total,
            "built": datetime.date.today().isoformat()}

    out = os.path.join(root, "review")
    os.makedirs(out, exist_ok=True)
    with open(os.path.join(out, "index.html"), "w", encoding="utf-8") as f:
        f.write(PAGE.replace("/*DATA*/", json.dumps(data, ensure_ascii=False).replace("</", "<\\/")))
    print(f"review/index.html: {len(recs)} flagged of {total} records; "
          + ", ".join(f"{labels[c]} {n}" for c, n in counts.items() if n))


PAGE = """<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Review worklist · flagged catalog records</title>
<style>
:root{--bg:#f6f4ee;--fg:#1d2321;--mut:#5b6561;--card:#fff;--line:#d9d4c7;--acc:#0b5a52;--chip:#e6efec;--warn:#fdf1cf}
@media(prefers-color-scheme:dark){:root{--bg:#161a19;--fg:#e8ece9;--mut:#a3afa9;--card:#1f2523;--line:#35403c;--acc:#6cc3b6;--chip:#27332f;--warn:#3a3213}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.5 system-ui,sans-serif}
main{max-width:60rem;margin:0 auto;padding:1rem}
h1{font-size:1.4rem;margin:.5rem 0}.mut{color:var(--mut);font-size:.9rem}
.bar{position:sticky;top:0;background:var(--bg);padding:.6rem 0;border-bottom:1px solid var(--line);z-index:2}
input[type=search],select{font:inherit;padding:.45rem .6rem;border:1px solid var(--line);border-radius:6px;background:var(--card);color:var(--fg)}
input[type=search]{width:100%;margin-bottom:.5rem}
.chips{display:flex;flex-wrap:wrap;gap:.35rem;margin:.4rem 0}
button.chip{font:inherit;font-size:.85rem;padding:.2rem .6rem;border:1px solid var(--line);border-radius:999px;background:var(--chip);color:var(--fg);cursor:pointer}
button.chip[aria-pressed=true]{background:var(--acc);color:var(--bg);border-color:var(--acc)}
.row{display:flex;gap:.5rem;flex-wrap:wrap;align-items:center}
article{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:.8rem;margin:.6rem 0}
article h2{font-size:1rem;margin:0 0 .25rem}.meta{font-size:.82rem;color:var(--mut)}
.note{background:var(--warn);border-radius:6px;padding:.4rem .6rem;margin:.4rem 0;font-size:.92rem}
.tags span{display:inline-block;font-size:.75rem;background:var(--chip);border-radius:999px;padding:.05rem .5rem;margin:.1rem .2rem 0 0}
a{color:var(--acc)}code{font-size:.8rem;word-break:break-all}
details summary{cursor:pointer;color:var(--mut);font-size:.85rem}
</style></head><body><main>
<h1>Review worklist</h1>
<p class="mut" id="intro"></p>
<div class="bar">
 <input type="search" id="q" placeholder="Search title, note, author or id" aria-label="Search">
 <div class="chips" id="chips" role="group" aria-label="Reason"></div>
 <div class="row">
  <label>Source <select id="src"><option value="">All</option></select></label>
  <label>Level <select id="lvl"><option value="">All</option><option>beginner</option><option>intermediate</option><option>advanced</option></select></label>
  <label>Type <select id="gran"><option value="">All</option><option>work</option><option>section</option><option>item</option></select></label>
  <span class="mut" id="count" aria-live="polite"></span>
 </div>
</div>
<div id="list"></div>
</main>
<script>
const D=/*DATA*/;
const $=s=>document.querySelector(s);
const el=(t,a,...k)=>{const e=document.createElement(t);for(const[n,v]of Object.entries(a||{})){if(n==='text')e.textContent=v;else e.setAttribute(n,v)}for(const c of k.flat())if(c!=null)e.append(c);return e};
$('#intro').textContent=`${D.records.length} of ${D.total} records are flagged for a person to check. Built ${D.built}. Each flag says why; the source page link lets you read the original. Nothing here changes the catalog: send corrections to whoever maintains it.`;
const active=new Set();
for(const [c,l] of Object.entries(D.labels)){ if(!D.counts[c])continue;
  const b=el('button',{class:'chip',type:'button','aria-pressed':'false',text:`${l} (${D.counts[c]})`});
  b.onclick=()=>{active.has(c)?active.delete(c):active.add(c);b.setAttribute('aria-pressed',active.has(c));draw()};
  $('#chips').append(b)}
for(const s of [...new Set(D.records.map(r=>r.source))].sort())$('#src').append(el('option',{text:s}));
function draw(){
 const q=$('#q').value.trim().toLowerCase(),src=$('#src').value,lv=$('#lvl').value,gr=$('#gran').value;
 const out=D.records.filter(r=>(!src||r.source===src)&&(!lv||r.level===lv)&&(!gr||r.gran===gr)
  &&(!active.size||r.cats.some(c=>active.has(c)))
  &&(!q||[r.id,r.title,r.note,r.authors.join(' ')].join(' ').toLowerCase().includes(q)));
 $('#count').textContent=`${out.length} shown`;
 const L=$('#list');L.replaceChildren();
 for(const r of out.slice(0,200)){
  L.append(el('article',null,
   el('h2',{text:r.title}),
   el('div',{class:'meta',text:`${r.source} · ${r.gran} · ${r.tag} · ${r.level}${r.authors.length?' · '+r.authors.join(', '):''}${r.marja?' · rulings of '+r.marja:''}`}),
   el('div',{class:'note',text:r.note||'(no note)'}),
   el('details',null,el('summary',{text:'What the record says'}),el('p',{text:r.desc})),
   el('div',{class:'tags'},r.cats.map(c=>el('span',{text:D.labels[c]}))),
   el('p',{class:'meta'},el('a',{href:r.url,target:'_blank',rel:'noopener noreferrer',text:'Open the source page ↗'}),' · ',el('code',{text:r.file}))));
 }
 if(out.length>200)L.append(el('p',{class:'mut',text:`Showing the first 200 of ${out.length}. Narrow the filters to see the rest.`}));
}
for(const id of ['#q','#src','#lvl','#gran'])$(id).addEventListener('input',draw);
draw();
</script></body></html>
"""

if __name__ == "__main__":
    main()

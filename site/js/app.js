// ShiaLib page behaviour. All search decisions live in search.js; this file only draws.
//
// Routing, so every state has a real link:
//   ?q=…&tag=…&level=…&source=…&scholar=…&topic=…&section=…&order=…   searches and browsing (shareable)
//   ?path=…                                                           one learning path
//   #beginners #questions #topics #paths #sources #guide #feedback #about   pages
//   #start-<slide>                                                    the "What is Islam?" tour
//   #e-<name>                                                         a name or book from the tour
//
// Catalog text is always escaped with esc() before it is put in a template, and links only ever
// become clickable when they are http(s) (safeUrl). Nothing the visitor types is stored.

import { createEngine, normalize as textNorm } from './search.js';
import { SITE, START, reportConfigured, reportHref, feedbackHref, externalSearchHref } from './config.js';
import { TOUR, TOUR_DRAFT } from './tour.js';

const $ = (s, r = document) => r.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"'`]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '`': '&#96;' }[c]));
const safeUrl = (u) => (typeof u === 'string' && /^https?:\/\//i.test(u) ? u : '');
const pl = (n, one, many) => `${n.toLocaleString()} ${n === 1 ? one : (many || one + 's')}`;
const BASE = location.pathname;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

const view = $('#view'), input = $('#q');
let engine = null, RECS = [], N = new Map(), E = {}, SL = [], TOURX = [];
let route = { t: 'home' }, lastSlide = null, firstLoad = true, lastHref = '';
const ui = { fbkind: '', limit: 20, openG: {}, lm: {}, tl: {}, pathTheme: '', qtheme: '', qfilter: '' };

// ---------------------------------------------------------------------------
// URL state
// ---------------------------------------------------------------------------
const PARAMS = ['q', 'tag', 'level', 'source', 'scholar', 'topic', 'section', 'order', 'path'];
const FILTERS = ['tag', 'level', 'source', 'scholar', 'topic', 'section'];
const blank = () => Object.fromEntries(PARAMS.map((k) => [k, '']));
function readState() {
  const sp = new URLSearchParams(location.search), s = {};
  for (const k of PARAMS) s[k] = (sp.get(k) || '').trim();
  return s;
}
function qsFor(st) {
  const sp = new URLSearchParams();
  for (const k of PARAMS) if (st[k]) sp.set(k, st[k]);
  const s = sp.toString();
  return s ? `?${s}` : '';
}
const searchHref = (st) => BASE + qsFor(st);
const pageHref = (k) => `${BASE}#${k}`;
const qHref = (q) => searchHref({ ...blank(), q });
const topicHref = (id) => searchHref({ ...blank(), topic: id });

function nav(url) {
  if (url === location.pathname + location.search + location.hash) return render();
  history.pushState(null, '', url);
  ui.limit = 20;
  render({ push: true });
}
document.addEventListener('click', (e) => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = e.target.closest('a[href]');
  if (!a || a.target || a.hasAttribute('download')) return;
  let u; try { u = new URL(a.href, location.href); } catch { return; }
  if (u.origin !== location.origin || u.pathname !== BASE) return;
  e.preventDefault();
  if (a.dataset.fbkind) ui.fbkind = a.dataset.fbkind;
  nav(u.pathname + u.search + u.hash);
});
addEventListener('popstate', () => render());
addEventListener('hashchange', () => { if (location.href !== lastHref) render(); });

function parseRoute() {
  const st = readState(), h = location.hash.replace(/^#/, '');
  if (st.path) return { t: 'path', st };
  if (FILTERS.some((k) => st[k]) || st.q) {
    const only = st.topic && !st.q && FILTERS.every((k) => k === 'topic' || !st[k]);
    if (only) return { t: 'topic', k: st.topic, st };
    return { t: 'results', st };
  }
  if (h.startsWith('start-')) { const k = h.slice(6); if (SL.some((s) => s[0] === k)) return { t: 'slide', k }; }
  if (h.startsWith('e-') && E[h]) return { t: 'entity', k: h };
  if (h === 'start') return { t: 'page', k: 'beginners' };
  if (PG[h]) return { t: 'page', k: h };
  return { t: 'home' };
}

// ---------------------------------------------------------------------------
// Catalog helpers
// ---------------------------------------------------------------------------
const tagLabel = (t) => engine.config.tags.labels[t] || t;
const levelOrder = () => engine.config.levels.order;
const levelLabel = (l) => engine.config.levels.labels[l] || l;
const LV = (l) => Math.max(0, levelOrder().indexOf(l)) + 1;
const scholarName = (id) => (engine.scholarById.get(id) || {}).name || id;
const sourceName = (id) => (engine.sourceById.get(id) || {}).name || id;
const sourceShort = (id) => sourceName(id).replace(/\s*\(.*\)/, '');
const headingLabel = (id) => (engine.headingById.get(id) || {}).label || id;
const TOPN = (id) => headingLabel(id).replace(/\s*\(.*\)/, '');
// `ancestors` runs nearest-first, so the top-level topic is the LAST item.
const topOf = (id) => { const h = engine.headingById.get(id); return (h && h.ancestors && h.ancestors[h.ancestors.length - 1]) || id; };
const slug = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const rec = (id) => engine.recordById.get(id);
const topHeadings = () => engine.headings.filter((h) => !h.parent);

function normalize(r) {
  return { id: r.id, raw: r, tag: r.content_tag, lv: r.level, g: r.granularity, p: r.parent || '',
    all: [...new Set([...(r.headings || []), ...(r.inherited_headings || [])])] };
}
function lvCounts(id) { const c = levelOrder().map(() => 0); for (const n of RECS) if (n.all.includes(id)) c[LV(n.lv) - 1]++; return c; }
function bestStart(id) {
  return RECS.filter((n) => n.all.includes(id)).sort((a, b) => (LV(a.lv) - LV(b.lv)) ||
    (a.g === 'work' ? 0 : 1) - (b.g === 'work' ? 0 : 1) || String(a.raw.title).localeCompare(b.raw.title))[0];
}
function levelDots(level) {
  const n = LV(level);
  return `<span class="lvl"><s aria-hidden="true">${levelOrder().map((_, i) => `<b class="${i < n ? 'on' : ''}"></b>`).join('')}</s>${esc(levelLabel(level))}</span>`;
}
function extLink(url, cls, label, aria) {
  const u = safeUrl(url);
  return u ? `<a class="${cls}" href="${esc(u)}" target="_blank" rel="noopener noreferrer"${aria ? ` aria-label="${esc(aria)}"` : ''}>${label}</a>` : `<span class="${cls}">${label}</span>`;
}

// ---------------------------------------------------------------------------
// Result card
// ---------------------------------------------------------------------------
function cardHtml(r, { compact = false, lean = false, tick = false, hideContextFor = '', more = null } = {}) {
  const src = sourceName(r.source);
  const authors = (r.authors || []).map(scholarName);
  const by = authors.length ? `By ${esc(authors.join(', '))} · ` : '';
  const loc = r.location ? ` · ${esc(r.location)}` : '';
  const par = !compact && r.context && r.context.section ? '' : '';
  const marja = r.marja ? ` · Rulings of <span dir="auto">${esc(scholarName(r.marja))}</span>` : '';
  let facts = '';
  if (r.type === 'course') {
    const rows = [['Offered by', r.provider], ['Taught by', (r.instructors || []).map(scholarName).join(', ')], ['Format', r.delivery],
      ['Length', r.duration], ['Starts', r.start_date], ['Cost', r.cost]].filter(([, v]) => v);
    if (rows.length) facts = `<dl class="facts">${rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd dir="auto">${esc(v)}</dd></div>`).join('')}</dl>`;
  }
  const title = `<h3><a href="${esc(safeUrl(r.url))}" target="_blank" rel="noopener noreferrer" dir="auto">${esc(r.title)}<span class="sr"> (opens in a new tab)</span></a></h3>`;
  const orig = r.title_original ? `<p class="meta" dir="auto">${esc(r.title_original)}</p>` : '';
  let actions = '', context = '', report = '';
  if (!compact) {
    const srcS = sourceShort(r.source);
    actions = extLink(r.url, 'open', `Open on ${esc(srcS)} <span aria-hidden="true">↗</span>`, `Open “${r.title}” on ${srcS} (opens in a new tab)`);
    if (r.type === 'course' && safeUrl(r.enrollment_url) && r.enrollment_url !== r.url) actions += `<span class="minor">${extLink(r.enrollment_url, '', 'Sign-up page ↗')}</span>`;
    const c = r.context || {}, parts = [c.section, c.work].filter(Boolean);
    if (parts.length) {
      context = `<span class="ctx"><span class="cl2">In context: </span>${parts.map((p) => extLink(p.url, '', esc(p.title))).join(' · ')}`;
      const sid = (c.section || c.work).id;
      if (sid !== hideContextFor) context += ` · <a href="${esc(searchHref({ ...blank(), section: sid }))}">${c.section ? 'More in this section' : 'More in this book'}</a>`;
      context += '</span>';
    } else if (r.descendant_count && r.id !== hideContextFor) {
      context = `<span class="ctx"><a href="${esc(searchHref({ ...blank(), section: r.id }))}">Browse the ${pl(r.descendant_count, 'entry', 'entries')} inside</a></span>`;
    }
    const rh = reportHref(r);
    report = `<span class="report"><a href="${esc(rh || pageHref('about'))}"${rh ? ' rel="noopener noreferrer"' : ''}>Report a problem</a></span>`;
  }
  if (lean) { context = ''; report = ''; }
  if (tick) actions += `<label class="stick"><input class="tick" type="checkbox" data-read="${esc(r.id)}" ${read[r.id] ? 'checked' : ''}> Mark as read</label>`;
  const det = clusterDetails(more);
  return `<li class="card"><div class="badges"><span class="tag" style="--c:var(--t-${esc(r.content_tag)})">${esc(tagLabel(r.content_tag))}</span>${levelDots(r.level)}</div>
  ${title}${orig}<p class="meta">${by}<span dir="auto">${esc(src)}</span>${loc}${marja}</p>
  ${r.description ? `<p class="d" dir="auto">${esc(r.description)}</p>` : ''}${facts}
  ${actions}${context || report ? `<p class="cfoot">${context}${report}</p>` : ''}${det}</li>`;
}
function clusterDetails(more) {
  if (!more || !more.items.length) return '';
  return `<details class="cl"><summary>${more.items.length} more in “${esc((more.title || '').toString())}”</summary><ul class="cl-list">${more.items.slice(0, 40).map((m) => `<li>${extLink(m.url, '', esc(m.title))}</li>`).join('')}${more.items.length > 40 ? `<li class="mute">and ${more.items.length - 40} more. Narrow your search to see them.</li>` : ''}</ul></details>`;
}
function entryHtml(e, opts) {
  if (e.kind === 'cluster') {
    const p = e.parent || {};
    return cardHtml(e.items[0].record, { ...opts, more: { items: e.items.slice(1).map((i) => i.record), title: p.title || 'the same section' } });
  }
  return cardHtml(e.record, opts);
}
const entryLevel = (e) => (e.kind === 'cluster' ? e.items[0].record : e.record).level;
const entryCount = (list) => list.reduce((n, e) => n + (e.kind === 'cluster' ? e.items.length : 1), 0);

// ---------------------------------------------------------------------------
// Pieces shared by several pages
// ---------------------------------------------------------------------------
const draftBar = (what = 'This page') => `<p class="draftbar"><span class="pill">Draft</span> ${esc(what)} was drafted from the catalog and has not been reviewed yet.</p>`;
const nextBar = (k) => {
  const n = NEXT[k]; if (!n) return '';
  return `<nav class="nextbar" aria-label="Next step"><p>${esc(n[0])}</p><a class="btn solid big" href="${esc(n[2] === 'home' ? BASE : pageHref(n[2]))}">${esc(n[1])} <span aria-hidden="true">→</span></a></nav>`;
};
const NEXT = {
  beginners: ['Have a specific question?', 'Browse common questions', 'questions'],
  questions: ['Prefer to browse by subject?', 'Browse by topic', 'topics'],
  topics: ['Want a guided reading order?', 'Follow a learning path', 'paths'],
  topic: ['Want a guided reading order?', 'Follow a learning path', 'paths'],
  paths: ['Curious where these pages come from?', 'See our sources', 'sources'],
  path: ['Want more reading orders?', 'More learning paths', 'paths'],
  question: ['Have a different question?', 'Browse common questions', 'questions'],
  sources: ['Not sure what a level or tag means?', 'How to read the results', 'guide'],
  guide: ['Ready to begin?', 'Start here', 'beginners'],
  about: ['Ready to begin?', 'Start here', 'beginners'],
  feedback: ['Done here?', 'Back to the start', 'home'],
};

let read = {};
try { read = JSON.parse(localStorage.getItem('shialib-read') || '{}') || {}; } catch { read = {}; }
const saveRead = () => { try { localStorage.setItem('shialib-read', JSON.stringify(read)); } catch { /* private window: fine */ } };
const tickBox = (r) => `<span class="tickwrap"><input class="tick" type="checkbox" data-read="${esc(r.id)}" ${read[r.id] ? 'checked' : ''} aria-label="Mark as read: ${esc(r.title)}"></span>`;

function startData() {
  const ok = (ids) => ids.map((id) => { const r = rec(id); if (!r) console.warn('Start-here list names a record that is not in the catalog:', id); return r; }).filter(Boolean);
  const shelf = ok(START.shelf);
  const stages = START.stages.map((s) => ({ ...s, shelfStage: s.ids === 'shelf', recs: s.ids === 'shelf' ? shelf : ok(s.ids) })).filter((s) => s.recs.length);
  return { shelf, stages, all: [...new Set(stages.flatMap((s) => s.recs.map((r) => r.id)))] };
}

function tourCard() {
  return `<div class="tour"><h3>What is Islam?</h3><p>A seven-step tour, from the divine mission to today. Select any name or book to open its page.</p>
   <ol>${SL.map(([, l]) => `<li>${esc(l)}</li>`).join('')}</ol><a class="btn white big" href="${esc(pageHref('start-' + SL[0][0]))}">Begin <span aria-hidden="true">→</span></a></div>`;
}
function shelfHtml(sd) {
  const n = sd.shelf.filter((r) => read[r.id]).length;
  return `<div class="shelf"><div class="shelf-h"><b>Day one shelf</b><span id="shelfc">${n} of ${sd.shelf.length} read</span></div>${sd.shelf.map((r) =>
    `<div class="si"><div>${tickBox(r)}</div><div class="${read[r.id] ? 'done' : ''}">${extLink(r.url, 'tt', `${esc(r.title)} <span aria-hidden="true">↗</span>`)}<small>${(r.sample_questions || [])[0] ? `After this you can answer: “${esc(r.sample_questions[0])}”` : ''}</small></div></div>`).join('')}</div>`;
}
function planHtml(sd) {
  const done = sd.all.filter((id) => read[id]).length, pct = sd.all.length ? Math.round(done / sd.all.length * 100) : 0;
  return `<div class="frame plan"><div class="plan-h"><div><h2>Your plan for the rest</h2></div><div class="prog"><span id="planc">${done} of ${sd.all.length} read</span><div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}" aria-label="Plan progress"><i id="planbar" style="width:${pct}%"></i></div></div></div>
  <ol class="stages">${sd.stages.map((s, i) => {
    const lv = [...new Set(s.recs.map((r) => LV(r.level)))].sort();
    return `<li class="stg"><div><div class="no">Stage ${i + 1} of ${sd.stages.length}</div><h3>${esc(s.title)}</h3><div class="meta">${esc(s.note)}<br>${pl(s.recs.length, 'page')} · ${lv.map((l) => esc(levelLabel(levelOrder()[l - 1]))).join(', ')}</div></div>
    ${s.shelfStage ? `<p class="mute" style="margin:0">These are the ${s.recs.length} pages from step 2, the day-one shelf. Tick them there.</p>`
      : `<ul>${s.recs.map((r) => `<li class="${read[r.id] ? 'done' : ''}">${tickBox(r)}${extLink(r.url, '', esc(r.title))}${levelDots(r.level)}</li>`).join('')}</ul>`}</li>`;
  }).join('')}</ol></div>`;
}

function qGroups() {
  const g = {};
  engine.questions.forEach((q) => { (g[topOf((q.headings || [])[0] || 'new-to-shia-islam')] ||= []).push(q); });
  const tops = topHeadings().filter((h) => g[h.id]).sort((x, y) => g[y.id].length - g[x.id].length);
  return { g, tops };
}
function qMeta(q) {
  const n = (q.top_records || []).filter((id) => rec(id)).length;
  return [n ? pl(n, 'page') : '', q.path && engine.pathById.get(q.path) ? 'reading path' : ''].filter(Boolean).join(' · ');
}
const qRow = (q, theme) => `<li><a class="qrow" href="${esc(qHref(q.question))}"><span class="qt" dir="auto">${esc(q.question)}</span><span class="qm">${esc([theme, qMeta(q)].filter(Boolean).join(' · '))}</span></a></li>`;
function qListHtml() {
  const { g, tops } = qGroups(), f = textNorm(ui.qfilter).split(' ').filter(Boolean);
  if (f.length) {
    const hits = engine.questions.filter((q) => { const hay = textNorm([q.question, ...(q.alt_phrasings || [])].join(' ')); return f.every((w) => hay.includes(w)); });
    return hits.length
      ? `<p class="qcount" role="status">${pl(hits.length, 'question')} match “${esc(ui.qfilter.trim())}”.</p><ul class="qrows">${hits.map((q) => qRow(q, TOPN(topOf((q.headings || [])[0] || 'new-to-shia-islam')))).join('')}</ul>`
      : `<div class="callout" role="status"><h3 class="h">No question like that yet</h3><p class="mute" style="margin:0">Try fewer words, or ask it in your own words with the button below.</p></div>`;
  }
  const cur = ui.qtheme === 'all' ? '' : (g[ui.qtheme] ? ui.qtheme : (tops.find((h) => h.id === 'new-to-shia-islam') || tops[0]).id);
  const list = cur ? g[cur] : engine.questions;
  return `<p class="qcount">${pl(list.length, 'question')}${cur ? ` on ${esc(TOPN(cur))}` : ''}.</p><ul class="qrows">${list.map((q) => qRow(q, cur ? '' : TOPN(topOf((q.headings || [])[0] || 'new-to-shia-islam')))).join('')}</ul>`;
}
function questionsHtml() {
  const { g, tops } = qGroups();
  const cur = ui.qtheme === 'all' ? 'all' : (g[ui.qtheme] ? ui.qtheme : (tops.find((h) => h.id === 'new-to-shia-islam') || tops[0]).id);
  const first = (g['new-to-shia-islam'] || []).slice(0, 6);
  const feat = [...first, ...engine.questions.filter((q) => !first.includes(q))].slice(0, 6);
  const ask = SITE.externalSearch && SITE.externalSearch.askUrl;
  return `<section class="blk" id="questions"><h2>Common questions</h2><p class="sub">Questions newcomers ask.</p>
  <div class="tsec"><h2>Start with these</h2><p class="sub">The questions newcomers ask first.</p><ul class="qfeats">${feat.map((q) => `<li><a class="qfeat" href="${esc(qHref(q.question))}"><span class="qq" dir="auto">${esc(q.question)}</span><span class="qm">${esc(qMeta(q))}</span></a></li>`).join('')}</ul></div>
  <div class="tsec"><h2>All ${engine.questions.length} questions</h2><p class="sub">Filter by a word, or pick a theme.</p>
  <div class="qtools"><div class="qfind"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg><label class="sr" for="qfilter">Filter the questions</label><input id="qfilter" type="search" autocomplete="off" placeholder="Filter the questions" value="${esc(ui.qfilter)}" maxlength="80"></div>
  <div class="chips" role="group" aria-label="Theme"><button class="chip" data-qt="all" aria-pressed="${cur === 'all'}">All <i>${engine.questions.length}</i></button>${tops.map((h) => `<button class="chip" data-qt="${esc(h.id)}" aria-pressed="${h.id === cur}">${esc(TOPN(h.id))} <i>${g[h.id].length}</i></button>`).join('')}</div></div>
  <div id="qlist">${qListHtml()}</div></div>
  <div class="qask"><div><h3>Can’t find your question?</h3><p>Ask it in your own words in the search box. If the catalog has nothing close, you can also try ${esc((SITE.externalSearch || {}).name || 'the source site')}’s own questions.</p></div>
  <div class="qask-b"><button class="btn solid big" type="button" data-askq>Ask your own question</button>${ask ? `<a class="btn line" href="${esc(ask)}" target="_blank" rel="noopener noreferrer">Browse ${esc(SITE.externalSearch.name)} questions ↗</a>` : ''}</div></div></section>`;
}

function topicStats(id) {
  let works = 0, pages = 0;
  for (const n of RECS) if (n.all.includes(id)) { if (n.g === 'work') works++; else pages++; }
  return { works, pages };
}
const statsText = (id) => { const s = topicStats(id); return [s.works ? `${s.works.toLocaleString()} ${s.works === 1 ? 'book or article' : 'books and articles'}` : '', s.pages ? `${s.pages.toLocaleString()} Q&A and ruling pages` : ''].filter(Boolean).join(' · '); };
function topicTile(h) {
  const c = lvCounts(h.id), b = bestStart(h.id), kids = (h.children || []).map(TOPN);
  const s = topicStats(h.id), labels = levelOrder().map((l) => levelLabel(l).toLowerCase());
  return `<article class="tile"><h3><a href="${esc(topicHref(h.id))}">${esc(TOPN(h.id))}</a></h3>
  ${kids.length ? `<p class="about" dir="auto">${esc(kids.slice(0, 4).join(', '))}${kids.length > 4 ? ', and more' : ''}</p>` : ''}
  <div class="tstats">${s.works ? `<span><b>${s.works.toLocaleString()}</b> ${s.works === 1 ? 'book or article' : 'books and articles'}</span>` : ''}${s.pages ? `<span><b>${s.pages.toLocaleString()}</b> Q&amp;A and ruling pages</span>` : ''}</div>
  <div class="lv ladder"><div class="bars" aria-hidden="true">${c.map((n, i) => n ? `<i class="b${i + 1}" style="flex:${n}"></i>` : '').join('')}</div><div class="leg">${c.map((n, i) => `<span class="l${i + 1}">${n.toLocaleString()} ${labels[i]}</span>`).join('')}</div></div>
  ${b ? `<p class="tstart"><small>Start with</small>${extLink(b.raw.url, '', `${esc(b.raw.title)} <span aria-hidden="true">↗</span>`)}</p>` : ''}
  <div class="tfoot">Explore this topic <span aria-hidden="true">→</span></div></article>`;
}
function topicsHtml() {
  const tops = topHeadings().filter((h) => RECS.some((r) => r.all.includes(h.id)));
  return `<section class="blk" id="topics"><h2>Browse by topic</h2><p class="sub">${tops.length} subjects. Open one to see three places to start and everything on it, easiest first.</p>
  <div class="tiles">${tops.map(topicTile).join('')}</div></section>`;
}

function pathInfo(p) {
  const rs = p.steps.map((s) => rec(s.record)).filter(Boolean), lv = rs.map((r) => LV(r.level));
  const h0 = rs[0] && (rs[0].headings || [])[0];
  return { rs, lv, first: lv[0] || 1, last: lv[lv.length - 1] || 1, theme: h0 ? topOf(h0) : '' };
}
const levelRange = (i) => (i.first === i.last ? levelLabel(levelOrder()[i.first - 1]) : `${levelLabel(levelOrder()[i.first - 1])} to ${levelLabel(levelOrder()[i.last - 1])}`);
function pcardHtml(p) {
  const i = pathInfo(p);
  return `<a class="pcard" href="${esc(searchHref({ ...blank(), path: p.id }))}"><span class="pt">${esc(i.theme ? TOPN(i.theme) : 'Learning path')}</span><h3 dir="auto">${esc(p.title)}</h3>${p.intro ? `<p dir="auto">${esc(p.intro)}</p>` : ''}
  <div class="pf"><span class="sdots" aria-hidden="true">${i.lv.map((l) => `<i class="d${Math.min(3, l)}"></i>`).join('')}</span><span>${pl(p.steps.length, 'step')} · ${esc(levelRange(i))}</span></div></a>`;
}
function pathsHtml() {
  const infos = engine.paths.map((p) => ({ p, i: pathInfo(p) }));
  const themes = [...new Set(infos.map((x) => x.i.theme).filter(Boolean))].sort((a, b) => topHeadings().findIndex((h) => h.id === a) - topHeadings().findIndex((h) => h.id === b));
  const cur = themes.includes(ui.pathTheme) ? ui.pathTheme : '';
  const list = infos.filter((x) => !cur || x.i.theme === cur);
  return `<section class="blk" id="paths"><h2>Learning paths</h2><p class="sub">Short reading orders on one subject, easiest first. Each dot is a step; darker dots are more detailed.</p>
  <div class="chips pfilter" role="group" aria-label="Filter by theme"><button class="chip" data-pt="" aria-pressed="${!cur}">All <i>${infos.length}</i></button>${themes.map((th) => `<button class="chip" data-pt="${esc(th)}" aria-pressed="${th === cur}">${esc(TOPN(th))} <i>${infos.filter((x) => x.i.theme === th).length}</i></button>`).join('')}</div>
  <div class="pgrid">${list.map((x) => pcardHtml(x.p)).join('')}</div></section>`;
}
function pathHtml(p) {
  const i = pathInfo(p), ids = i.rs.map((r) => r.id), done = ids.filter((id) => read[id]).length, pct = ids.length ? Math.round(done / ids.length * 100) : 0;
  const same = engine.paths.filter((x) => x.id !== p.id && pathInfo(x).theme === i.theme), others = engine.paths.filter((x) => x.id !== p.id && !same.includes(x));
  const related = [...same, ...others].slice(0, 3);
  return `${p.draft ? draftBar('This path') : ''}<div class="pmeta"><span><b>${pl(p.steps.length, 'step')}</b></span><span>${esc(levelRange(i))}</span><span class="prog"><span id="pathc">${done} of ${ids.length} read</span><div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}" aria-label="Path progress"><i id="pathbar" style="width:${pct}%"></i></div></span></div>
  <ol class="stepper">${p.steps.map((s, k) => { const r = rec(s.record); return r ? `<li class="${read[r.id] ? 'done' : ''}"><span class="sn2" aria-hidden="true">${k + 1}</span><div>${s.why ? `<p class="why" dir="auto"><span class="sr">Step ${k + 1}: </span>${esc(s.why)}</p>` : `<p class="sr">Step ${k + 1}</p>`}<ul class="cards">${cardHtml(r, { lean: true, tick: true })}</ul></div></li>` : ''; }).join('')}</ol>
  ${related.length ? `<section class="related"><h2>More learning paths</h2><div class="pgrid">${related.map(pcardHtml).join('')}</div></section>` : ''}`;
}

const WHAT = { 'al-islam.org': 'Shia books and articles from a long-running digital library. We start with introductory material.', 'thaqalayn.net': 'Hadith collections, the primary narrations.',
  'sistani.org': 'The rulings and the questions and answers of Sayyid Ali al-Sistani, linked to the exact page.', 'khamenei.ir': 'Rulings of Sayyid Ali Khamenei, once this source is ready.', youtube: 'Lectures from approved channels, once the channel list is confirmed.' };
const LISTS = { 'al-islam.org': 'One page for each book or article.', 'thaqalayn.net': 'One page for each hadith book or volume.', 'sistani.org': 'The book, each of its pages, and each question and answer.' };
const STATE_TEXT = { active: 'In the catalog', backlog: 'Approved, not added yet', blocked: 'Approved, waiting for access' };
const srcName = (s) => (s.id === 'youtube' ? 'YouTube lectures' : s.name.replace(/\s*\(.*\)/, ''));
function sourceStats(id) {
  const tags = {}, lv = levelOrder().map(() => 0); let n = 0;
  for (const r of engine.records) if (r.source === id) { n++; tags[r.content_tag] = (tags[r.content_tag] || 0) + 1; lv[LV(r.level) - 1]++; }
  return { n, tags, lv };
}
function sourcePanel(s) {
  const st = sourceStats(s.id), url = safeUrl(s.base_url), labels = levelOrder().map((l) => levelLabel(l).toLowerCase());
  return `<article class="sp"><div class="sp-main"><div class="sp-top"><h3 dir="auto">${esc(srcName(s))}</h3><span class="state ok">${esc(STATE_TEXT.active)}</span></div>
   <p class="sp-d">${esc(WHAT[s.id] || '')}</p><p class="sp-c"><b>What we list:</b> ${esc(LISTS[s.id] || s.catalog_level || '')}</p>
   <div class="sp-acts"><a class="btn solid" href="${esc(searchHref({ ...blank(), source: s.id }))}">Browse all ${st.n.toLocaleString()} pages</a>${url ? `<a class="btn line" href="${esc(url)}" target="_blank" rel="noopener noreferrer">Visit ${esc(s.id)} <span aria-hidden="true">↗</span></a>` : ''}</div></div>
   <div class="sp-side"><div class="tstats"><span><b>${st.n.toLocaleString()}</b> ${st.n === 1 ? 'page' : 'pages'}</span></div>
   <div class="lv ladder"><div class="bars" aria-hidden="true">${st.lv.map((n, i) => n ? `<i class="b${i + 1}" style="flex:${n}"></i>` : '').join('')}</div><div class="leg">${st.lv.map((n, i) => `<span class="l${i + 1}">${n.toLocaleString()} ${labels[i]}</span>`).join('')}</div></div>
   <p class="sp-tags">${Object.entries(st.tags).sort((a, b) => b[1] - a[1]).map(([tg, n]) => `<span class="tag" style="--c:var(--t-${esc(tg)})">${esc(tagLabel(tg))} ${n.toLocaleString()}</span>`).join('')}</p></div></article>`;
}
function sourcesHtml() {
  const active = engine.sources.filter((s) => s.status === 'active'), soon = engine.sources.filter((s) => s.status !== 'active');
  const total = engine.records.length;
  return `<section class="blk" id="sources"><h2>Where our resources come from</h2><p class="sub">Every result comes from one of these approved websites.</p>
  <p class="ssum"><span><b>${active.length}</b> approved websites in the catalog</span><span><b>${total.toLocaleString()}</b> pages</span><span>English only</span></p>
  <div class="sps">${active.map(sourcePanel).join('')}</div>
  ${soon.length ? `<div class="tsec"><h2>On the way</h2><p class="sub">Approved, but not in the catalog yet.</p><ul class="soon-list">${soon.map((s) => `<li><div><b dir="auto">${esc(srcName(s))}</b><span>${esc(WHAT[s.id] || s.catalog_level || '')}</span></div><span class="state">${esc(STATE_TEXT[s.status] || 'Coming later')}</span></li>`).join('')}</ul></div>` : ''}
  <div class="scope"><div><h3>What we include</h3><p>Twelver Shia resources in English, from approved websites only. Fiqh rulings come from two scholars: Sayyid Ali al-Sistani and Sayyid Ali Khamenei. Everything else is not limited by author.</p></div>
  <div class="scope-b"><a class="btn line" href="${esc(pageHref('about'))}">Read the full scope</a><a class="btn line" href="${esc(pageHref('feedback'))}" data-fbkind="source">Suggest a source</a></div></div></section>`;
}
function sourceRowsHtml() {
  const counts = new Map(); for (const r of engine.records) counts.set(r.source, (counts.get(r.source) || 0) + 1);
  return `<ul class="soon-list" style="margin:1rem 0 1.4rem">${engine.sources.map((s) => {
    const n = counts.get(s.id) || 0, url = safeUrl(s.base_url);
    return `<li><div><b dir="auto">${url ? `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(srcName(s))}</a>` : esc(srcName(s))}</b><span>${esc(LISTS[s.id] || s.catalog_level || '')}${n ? ` ${n.toLocaleString()} ${n === 1 ? 'entry' : 'entries'} so far.` : ''}</span></div><span class="state${s.status === 'active' ? ' ok' : ''}">${esc(STATE_TEXT[s.status] || s.status)}</span></li>`;
  }).join('')}</ul>`;
}

function guideHtml() {
  const tags = engine.config.tags;
  return `<section class="blk" id="howto"><h2>How to read the results</h2><p class="sub">Every result carries a level and a tag, so you know what you are opening before you click.</p>
  <div class="frame"><div class="how">
   <div class="hc"><h3>Levels</h3><dl>${levelOrder().map((l, i) => `<dt>${levelDots(l)}</dt><dd>${['Written for someone new. No background needed.', 'Assumes the basics.', 'Detailed rulings, specialist work and primary sources.'][i] || ''}</dd>`).join('')}</dl></div>
   <div class="hc"><h3>Tags</h3><dl><dt><span class="tag" style="--c:var(--t-fiqh)">${esc(tags.labels.fiqh)}</span></dt><dd>Rulings and Q&amp;A from Sayyid Sistani or Sayyid Khamenei.</dd><dt><span class="tag" style="--c:var(--t-hadith)">${esc(tags.labels.hadith)}</span></dt><dd>Collections of narrations.</dd><dt><span class="tag" style="--c:var(--t-book)">${esc(tags.labels.book)}</span> <span class="tag" style="--c:var(--t-article)">${esc(tags.labels.article)}</span></dt><dd>Introductions, studies and talks.</dd></dl></div>
   <div class="hc"><h3>Sources</h3><p>${esc(SITE.name)} describes pages and links to them. Every result opens the original on its own website, and the site that publishes it is always named.</p></div>
  </div></div></section>`;
}

const ico = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const ICON = { link: ico('<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'), list: ico('<path d="M5 6h14M5 12h14M5 18h9"/>'), lock: ico('<rect x="5" y="11" width="14" height="9" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>') };
function aboutHtml() {
  const rep = reportConfigured()
    ? `<a class="btn solid" href="${esc(reportHref(null))}" rel="noopener noreferrer">${SITE.report.kind === 'github' ? 'Report a problem (opens GitHub)' : 'Report a problem by email'}</a>`
    : `<a class="btn solid" href="${esc(pageHref('feedback'))}">Tell us about it</a>`;
  const scope = safeUrl(SITE.scopeUrl) ? `<a href="${esc(SITE.scopeUrl)}" rel="noopener noreferrer">Read the full scope and inclusion criteria</a>` : 'The full scope and inclusion criteria are published in the project repository, in the file <code>docs/scope.md</code>';
  const facts = [['School', 'Twelver (Ithna ‘Ashari) Shia resources only, for now.'], ['Language', 'English only, for now. Searching with Arabic, Persian or Urdu terms and common spellings still works: they match the same topics.'],
    ['Websites', 'Approved websites only. Nothing appears here unless it comes from a site on the list below.'], ['Fiqh', 'Rulings and practical law are limited to two scholars for now: Sayyid Ali al-Sistani and Sayyid Ali Khamenei. Results show whose rulings a page follows.'],
    ['Everything else', 'History, beliefs, ethics, hadith, Quran and similar topics are not limited by author, as long as they come from an approved website.'], ['Levels', 'Beginner material comes first. Each result is marked Beginner, Intermediate or Advanced.']];
  const steps = [['Common questions first', 'It checks a list of questions and topics prepared in advance. If your search matches one, the pages chosen for it are shown first.'],
    ['Then a word search', 'An ordinary search over titles, descriptions, the questions each page helps answer, topic names (including other spellings) and scholar names.'],
    ['Exact, then related', 'Exact matches have your words, or another name for the same topic, in the title or in the questions a page helps answer. Everything else is Related. If nothing is exact, the page says so.'],
    ['No guessing', 'If nothing matches well, the page says “We couldn’t find a close match” and offers topics and questions instead.'],
    ['Simple first', 'Simpler material is listed first by default. You can switch to “Show deeper material first” at any time.']];
  return `<nav class="jump" aria-label="On this page">${[['not-host', 'What we do'], ['scope', 'What is included'], ['sources-list', 'Websites'], ['how', 'How results are chosen'], ['privacy', 'Privacy'], ['report', 'Report a link']].map(([id, l]) => `<button class="chip" type="button" data-jump="${id}">${l}</button>`).join('')}</nav>
  <section class="tsec" id="not-host"><h2>A catalog, not a library</h2><p class="sub">${esc(SITE.name)} is a free catalog of Shia resources. Type a topic or a question, and it points you to where that content can be found on a short list of approved websites. It is made for people who are new and do not know where to look.</p>
   <div class="pilgrid"><div class="pil">${ICON.link}<h3>We point, we do not host</h3><p>Every result is a short catalog entry with a link to the website where the original is published. We are not the author or publisher of any of it, and the source is named on every result.</p></div>
   <div class="pil">${ICON.list}<h3>Descriptions, not answers</h3><p>The short descriptions are our own plain-English summaries of what a page is about. For rulings, the description only says what the question is about. Read the ruling on the source page.</p></div>
   <div class="pil">${ICON.lock}<h3>No rulings, no positions</h3><p>This site does not give religious rulings or take positions. It describes, labels and links.</p></div></div></section>
  <section class="tsec" id="scope"><h2>What is included</h2><p class="sub">${scope}.</p><dl class="factl">${facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl></section>
  <section class="tsec" id="sources-list"><h2>Websites this catalog points to</h2><p class="sub">Every result comes from one of these.</p>${sourceRowsHtml()}<p style="margin:0"><a class="btn line" href="${esc(pageHref('sources'))}">See what each website contributes</a></p></section>
  <section class="tsec" id="how"><h2>How results are chosen</h2><p class="sub">Plain matching rules. <strong>No AI writes answers here:</strong> the search only finds and orders catalog entries, and never writes answers, summaries or rulings.</p>
   <ol class="hsteps">${steps.map(([h, p]) => `<li><h3>${esc(h)}</h3><p>${esc(p)}</p></li>`).join('')}</ol>
   <p class="note">Catalog entries were prepared with the help of an AI assistant from the source pages, then checked by automatic rules. Items marked <span class="pill">Draft</span> have not yet been reviewed by a person.</p></section>
  <section class="tsec" id="privacy"><h2>Privacy</h2><div class="priv"><ul class="ticks"><li>The search runs entirely in your browser. What you type is not sent to us or to anyone else, and it is not stored.</li><li>No cookies, no tracking and no accounts.</li><li>If you tick pages as read, those ticks are saved only in your own browser and never leave it.</li><li>When you follow a link, you leave this site and the other website’s own policies apply. This includes the “Search Al-Islam.org” link under results: only if you click it, your search words are sent to Al-Islam.org as part of that link.</li></ul></div></section>
  <section class="tsec" id="report"><div class="qask"><div><h3>Report a wrong or broken link</h3><p>If a link is broken, goes to the wrong page, or a description is wrong, please tell us. It helps to include the title of the result and what is wrong.</p></div><div class="qask-b">${rep}</div></div></section>`;
}

const FB = {
  waitlist: { t: 'Join the waitlist', d: 'Hear when new sources and features arrive.', go: 'Join the waitlist', need: false, ph: 'Anything you would like us to know? (optional)' },
  source: { t: 'Suggest a website', d: 'A Shia website that belongs in the catalog.', go: 'Send suggestion', need: true, ph: 'The website address, and what it offers.' },
  feedback: { t: 'Suggest a topic or send feedback', d: 'Something missing, confusing or wrong.', go: 'Send feedback', need: true, ph: 'What would help?' },
  link: { t: 'Report a broken link', d: 'A link that fails or opens the wrong page.', go: 'Send report', need: true, ph: 'The title of the result and what is wrong.' },
};
function feedbackHtml() {
  const ok = reportConfigured(), via = SITE.report.kind === 'github' ? 'GitHub issue form' : 'email app';
  const k0 = ui.fbkind && FB[ui.fbkind] ? ui.fbkind : 'waitlist';
  return `<section class="blk" id="feedback"><div class="fbx"><div class="fbx-l"><h2>Tell us what you need</h2><p class="sub">Every note is read by the person who runs the catalog.</p>
   <ol class="fbx-how"><li><b>Choose what this is about</b></li><li><b>Write a short note</b></li><li><b>Your ${via} opens</b> with the message ready. Nothing is sent until you send it.</li></ol>
   <p class="note" style="margin:0">No account is needed, and nothing you type here is stored by this site.</p></div>
  <div class="fbx-r" id="fbr">${ok ? `<form id="fbf" novalidate>
   <fieldset class="fld"><legend>What is this about?</legend><div class="kindc">${Object.entries(FB).map(([k, v]) => `<label><input type="radio" name="kind" value="${k}"${k === k0 ? ' checked' : ''}><span><b>${esc(v.t)}</b><small>${esc(v.d)}</small></span></label>`).join('')}</div></fieldset>
   <div class="fld" id="fb-msgw"><label for="fb-msg">Your message <span class="mute" id="fb-opt">${FB[k0].need ? '' : '(optional)'}</span></label><textarea id="fb-msg" placeholder="${esc(FB[k0].ph)}" aria-describedby="fb-eh fb-merr"></textarea><span class="hint" id="fb-eh">This opens your ${via} with the message ready. Nothing is sent until you send it.</span><span class="err" id="fb-merr" role="alert" hidden>Add a short message so we know what to look at.</span></div>
   <button class="btn solid big" type="submit" id="fb-go">${esc(FB[k0].go)}</button></form>`
   : '<div class="okbox"><b>Feedback is not set up yet.</b><p>The site owner needs to choose an email address or a GitHub repository in <code>site/js/config.js</code>. Until then there is nowhere to send messages.</p></div>'}</div></div></section>`;
}

function startHtml() {
  const sd = startData();
  return `<section class="blk"><div class="stp"><h2><span class="sn">1</span>Begin with “What is Islam?”</h2><p>The big picture, one idea at a time.</p></div><div class="frame">${tourCard()}</div></section>
  <section class="blk"><div class="stp"><h2><span class="sn">2</span>Read the day-one shelf</h2><p>${sd.shelf.length} short introductions in a good order. Tick each one as you finish it.</p></div><div class="frame">${shelfHtml(sd)}</div></section>
  <section class="blk"><div class="stp"><h2><span class="sn">3</span>Follow the plan</h2><p>A staged route from the basics to the source texts.</p></div>${planHtml(sd)}</section>`;
}

function homeHtml() {
  const tops = topHeadings().filter((h) => RECS.some((r) => r.all.includes(h.id))).length;
  return `<section class="blk"><h2>Where to begin</h2><p class="sub">Three ways in, depending on how much you already know.</p>
  <div class="frame"><div class="doors">${tourCard()}
   <button class="door" data-focus type="button"><small>Ask</small><h3>Ask a question</h3><p>Type it the way you would say it. We match it to pages chosen for that question.</p><span class="go">Start typing →</span></button>
   <a class="door" href="${esc(pageHref('topics'))}"><small>Browse</small><h3>Browse by topic</h3><p>${tops} subjects, each laid out from beginner to advanced.</p><span class="go">Open topics →</span></a>
  </div></div></section>
  <section class="blk"><h2>Explore</h2><p class="sub">More ways into the catalog.</p>
  <div class="exg">
   <a class="xt" href="${esc(pageHref('beginners'))}"><b>Start here</b><span>The tour, the day-one shelf and a plan for the rest.</span><em>3 steps</em></a>
   <a class="xt" href="${esc(pageHref('questions'))}"><b>Common questions</b><span>Questions newcomers ask, grouped by theme.</span><em>${pl(engine.questions.length, 'question')}</em></a>
   <a class="xt" href="${esc(pageHref('paths'))}"><b>Learning paths</b><span>Short reading orders on one subject.</span><em>${pl(engine.paths.length, 'path')}</em></a>
   <a class="xt" href="${esc(pageHref('sources'))}"><b>Our sources</b><span>The approved websites every result comes from.</span><em>${pl(engine.sources.filter((s) => s.status === 'active').length, 'active source')}</em></a>
  </div></section>
  <section class="blk"><div class="cta"><div><h3>Help shape ${esc(SITE.name)}</h3><p>Join the waitlist, suggest a topic, or report a broken link.</p></div><a class="btn white big" href="${esc(pageHref('feedback'))}">Send feedback</a></div></section>`;
}

const PG = {
  beginners: { kind: 'Step by step', title: 'Start here', lede: 'Never studied this before? Follow these three steps, in order.', draft: true, next: true, body: startHtml, noHide: true },
  questions: { kind: 'Questions', title: 'Common questions', lede: 'Questions newcomers ask, grouped by theme. Select one to see the pages chosen for it.', draft: true, next: true, body: questionsHtml },
  topics: { kind: 'Topics', title: 'Topics', lede: 'Each subject has its own reading list, from beginner to advanced.', draft: true, next: true, body: topicsHtml },
  paths: { kind: 'Learning paths', title: 'Learning paths', lede: 'Short reading orders on one subject. Pick a theme, then a path.', draft: true, next: true, body: pathsHtml },
  sources: { kind: 'Sources', title: 'Where our resources come from', lede: 'Every result comes from one of these approved websites. Nothing else appears.', next: true, body: sourcesHtml },
  guide: { kind: 'Guide', title: 'How to read the results', lede: 'What the levels and tags mean, so you know what you are opening.', next: true, body: guideHtml },
  about: { kind: 'About', title: 'About and scope', lede: 'What this catalog is, what it includes, and how results are chosen.', next: true, body: aboutHtml, noHide: true },
  feedback: { kind: 'Feedback', title: 'Help shape ShiaLib', lede: 'Join the waitlist, suggest a topic, or report a broken link.', next: true, body: feedbackHtml },
};

function pageStage(m) {
  return `<div class="rs page">${m.back ? `<div class="sl-top"><a class="back" href="${esc(m.back[0])}">← ${esc(m.back[1])}</a><span></span></div>` : ''}<div class="sl-body"><span class="kind">${esc(m.kind)}</span><h1 dir="auto">${esc(m.title)}</h1>${m.lede ? `<p class="lede" dir="auto">${esc(m.lede)}</p>` : ''}</div></div>`;
}

// ---------------------------------------------------------------------------
// Search results, topic pages, section browsing, paths
// ---------------------------------------------------------------------------
function curatedHtml(result) {
  const c = result.curated; if (!c) return '';
  let out = '<div class="frame curated"><div class="gh">';
  if (c.question) out += `<h2 class="ch" dir="auto">${esc(c.question.question)}${c.question.draft ? ' <span class="pill">Draft</span>' : ''}</h2>${c.path ? '' : '<p>The pages chosen for this question are listed first below.</p>'}`;
  else if (c.heading) out += `<h2 class="ch" dir="auto">${esc(c.heading.label)}${engine.vocabularyDraft ? ' <span class="pill">Draft</span>' : ''}</h2><p><a href="${esc(topicHref(c.heading.id))}">Browse everything on this topic</a></p>`;
  out += '</div>';
  if (c.path) out += `<div class="callout"><h3 class="h" dir="auto">Start here: ${esc(c.path.title)}${c.path.draft ? ' <span class="pill">Draft</span>' : ''}</h3>${c.path.intro ? `<p class="mute" dir="auto">${esc(c.path.intro)}</p>` : ''}${stepsHtml(c.path, true)}</div>`;
  if (c.questions && c.questions.length) out += `<div class="gh"><p>${c.question ? 'Related questions' : 'Common questions on this topic'}</p></div><ul class="qlist">${c.questions.map((q) => `<li><a href="${esc(qHref(q.question))}"><span dir="auto">${esc(q.question)}</span>${q.draft ? '<span class="pill">Draft</span>' : ''}</a></li>`).join('')}</ul>`;
  return out + '</div>';
}
function stepsHtml(path, compact) {
  return `<ol class="hsteps">${path.steps.map((s) => { const r = rec(s.record); return r ? `<li><div>${s.why ? `<p class="why" dir="auto">${esc(s.why)}</p>` : ''}<ul class="cards">${cardHtml(r, { compact })}</ul></div></li>` : ''; }).join('')}</ol>`;
}
function externalHtml(q) {
  const href = externalSearchHref(q); if (!href) return '';
  const name = SITE.externalSearch.name;
  return `<div class="callout extsearch" style="margin-top:2rem"><h2 class="ch" style="font-size:1.125rem;margin:0 0 .4rem">Have a question we don’t answer?</h2><p>We catalog books and articles, not individual questions and answers. ${esc(name)} has its own question-and-answer section and search, which may have your question.</p>
  <p><a class="btn line" href="${esc(href)}" target="_blank" rel="noopener noreferrer">Search ${esc(name)} for “${esc(String(q).trim())}” ↗</a>${SITE.externalSearch.askUrl ? ` <a href="${esc(SITE.externalSearch.askUrl)}" target="_blank" rel="noopener noreferrer">Or browse its questions ↗</a>` : ''}</p>
  <small>This opens ${esc(name)} in a new tab and sends your search words to that site. We are not affiliated with it and do not control its results.</small></div>`;
}
function fallbackHtml(result) {
  return `<div class="callout"><h2 class="ch" style="font-size:1.125rem;margin:0 0 .4rem">We couldn’t find a close match</h2>
  <p>${result.emptyTopic ? `We have a topic called <strong dir="auto">${esc(result.emptyTopic.label)}</strong>, but nothing has been cataloged for it yet.` : `Nothing in the catalog matches <strong dir="auto">“${esc(result.query)}”</strong> closely enough to show. We would rather show nothing than a loose guess.`}</p>
  <p class="mute" style="margin:0">Try a shorter search, a different spelling, or start from a topic or question below.</p></div>`;
}
function controlsHtml(st, result) {
  const total = Object.values(result.counts.tags).reduce((a, b) => a + b, 0);
  const seg = `<div class="seg" role="group" aria-label="Which results come first"><button data-order="beginner" aria-pressed="${result.order === 'beginner'}">I’m new: simpler first</button><button data-order="deeper" aria-pressed="${result.order === 'deeper'}">Show deeper material first</button></div>`;
  const chip = (tag, label, n) => `<button class="chip" data-tag="${esc(tag)}" aria-pressed="${(st.tag || '') === tag}"${n === 0 && st.tag !== tag ? ' disabled' : ''}>${esc(label)} <i>${n}</i></button>`;
  const chips = `<div class="chips" role="group" aria-label="Filter by type of content">${chip('', 'All', total)}${engine.config.tags.order.filter((t) => (result.counts.tags[t] || 0) || st.tag === t).map((t) => chip(t, tagLabel(t), result.counts.tags[t] || 0)).join('')}</div>`;
  const sel = (key, label, opts) => `<div class="fld"><label for="f-${key}">${label}</label><select id="f-${key}" data-filter="${key}">${opts.map(([v, t]) => `<option value="${esc(v)}"${v === (st[key] || '') ? ' selected' : ''}>${esc(t)}</option>`).join('')}</select></div>`;
  const f = facets(), active = ['level', 'source', 'scholar', 'topic'].filter((k) => st[k]).length;
  const panel = `<details class="filters"${active ? ' open' : ''}><summary>${active ? `More filters (${active} on)` : 'More filters'}</summary><div class="filter-grid">
    ${sel('level', 'Level', [['', 'Any level'], ...levelOrder().map((l) => [l, levelLabel(l)])])}${sel('topic', 'Subject', [['', 'Any subject'], ...f.topics])}
    ${sel('source', 'Source', [['', 'Any source'], ...f.sources])}${sel('scholar', 'Scholar or author', [['', 'Anyone'], ...f.scholars])}</div></details>`;
  const af = [];
  if (st.topic) af.push(['topic', `Subject: ${headingLabel(st.topic)}`]);
  if (st.section) af.push(['section', `Inside: ${(rec(st.section) || {}).title || st.section}`]);
  if (st.level) af.push(['level', `Level: ${levelLabel(st.level)}`]);
  if (st.source) af.push(['source', `Source: ${sourceName(st.source)}`]);
  if (st.scholar) af.push(['scholar', `By: ${scholarName(st.scholar)}`]);
  if (st.tag) af.push(['tag', `Type: ${tagLabel(st.tag)}`]);
  const pills = af.length ? `<ul class="apills" aria-label="Filters in use">${af.map(([k, l]) => `<li><button class="apill" data-clear="${k}" aria-label="Remove filter: ${esc(l)}"><span dir="auto">${esc(l)}</span> ×</button></li>`).join('')}</ul>` : '';
  return `<div class="ctl">${seg}${chips}</div>${panel}${pills}`;
}
let facetCache = null;
function facets() {
  if (facetCache) return facetCache;
  const sources = new Set(), people = new Set(), counts = new Map();
  for (const r of engine.records) {
    sources.add(r.source);
    for (const id of [...(r.authors || []), ...(r.instructors || []), r.marja]) if (id) people.add(id);
    for (const h of new Set([...(r.headings || []), ...(r.inherited_headings || [])])) counts.set(h, (counts.get(h) || 0) + 1);
  }
  const ordered = [], walk = (h) => { if (counts.get(h.id)) ordered.push(h); (h.children || []).forEach((c) => engine.headingById.get(c) && walk(engine.headingById.get(c))); };
  topHeadings().forEach(walk);
  return (facetCache = {
    sources: engine.sources.filter((s) => sources.has(s.id)).map((s) => [s.id, s.name]),
    scholars: engine.scholars.filter((s) => people.has(s.id)).map((s) => [s.id, s.name]).sort((a, b) => a[1].localeCompare(b[1])),
    topics: ordered.map((h) => [h.id, `${'– '.repeat((h.ancestors || []).length)}${h.label}`]),
  });
}

// A search gets its own question page only when the words typed are really that question (or one of its alternate phrasings).
function isThatQuestion(query, q) {
  const qt = textNorm(query).split(' ').filter(Boolean);
  if (!qt.length) return false;
  return [q.question, ...(q.alt_phrasings || [])].some((s) => { const n = textNorm(s); if (n === qt.join(' ')) return true; if (qt.length < 3) return false; const w = new Set(n.split(' ')); return qt.every((x) => w.has(x)); });
}
function questionPageHtml(st, result) {
  const q = result.curated.question, c = result.curated;
  const pins = (q.top_records || []).map(rec).filter(Boolean), pinIds = new Set(pins.map((r) => r.id));
  const rest = (es) => es.filter((e) => !(e.kind !== 'cluster' && pinIds.has(e.record.id)));
  const ex = rest(result.exact), rel = rest(result.related);
  let shown = 0; const take = (l) => { const o = l.slice(0, Math.max(0, ui.limit - shown)); shown += o.length; return o; };
  const exs = take(ex), rels = take(rel), total = ex.length + rel.length;
  const rowsOf = (es) => es.map((e) => (e.kind === 'cluster' ? rowHtml(e.items[0].record, { items: e.items.slice(1).map((i) => i.record), title: (e.parent || {}).title || 'the same section' }) : rowHtml(e.record))).join('');
  const related = (c.questions || []).filter((x) => x.id !== q.id);
  announceText = `${q.question}. ${pl(pins.length, 'page')} chosen, ${pl(total, 'more page')}.`;
  return `${refineHtml(st)}${q.draft ? draftBar('The pages chosen for this question') : ''}
  ${pins.length ? `<section class="tsec"><h2>Start with ${pins.length === 1 ? 'this page' : 'these pages'}</h2><p class="sub">Chosen for this question.</p><div class="minis">${pins.map(miniHtml).join('')}</div></section>` : ''}
  ${c.path ? `<section class="tsec"><h2>Read in order</h2><p class="sub">A short reading path on this subject.</p><div class="pgrid one">${pcardHtml(c.path)}</div></section>` : ''}
  ${related.length ? `<section class="tsec"><h2>Related questions</h2><ul class="qrows" style="margin-top:.8rem">${related.map((x) => qRow(x, '')).join('')}</ul></section>` : ''}
  ${total ? `<section class="tsec"><h2>More pages that match</h2><p class="sub">${pl(total, 'page')}, simpler material first.</p>${controlsHtml(st, result)}
  ${exs.length ? `<h3 class="gt">Exact matches <span>${ex.length}</span></h3><ul class="lrows">${rowsOf(exs)}</ul>` : ''}
  ${rels.length ? `<h3 class="gt">Related results <span>${rel.length}</span></h3><ul class="lrows">${rowsOf(rels)}</ul>` : ''}
  ${total > ui.limit ? `<p style="margin:1rem 0 0"><button class="more2" data-more>Show ${Math.min(20, total - ui.limit)} more</button></p>` : ''}</section>` : ''}
  ${externalHtml(result.query)}${nextBar('question')}`;
}
function resultsHtml(st, pre) {
  const result = pre || engine.search(st.q, st), browsing = result.mode === 'browse';
  const hasFilter = FILTERS.some((k) => st[k]);
  if (result.fallback) {
    announceText = `No close match for “${result.query}”.`;
    return `${refineHtml(st)}${fallbackHtml(result)}${externalHtml(result.query)}<div style="height:3rem"></div>${topicsHtml()}`;
  }
  const n = result.counts.total, ex = result.counts.exact, rel = result.counts.related;
  let out = browsing ? '' : refineHtml(st);
  const cap = Number(engine.config.layer2.max_results) || 150;
  out += `<div class="rhead"><p class="sub">${n >= cap ? `Showing the best ${n} pages. Narrow your search to see others.` : n ? `${pl(n, 'page')} found.` : ''}</p></div>`;
  if (!browsing) out += curatedHtml(result);
  out += controlsHtml(st, result);
  if (!n) {
    announceText = 'No results with these filters.';
    return out + `<div class="callout"><p>${hasFilter ? 'Nothing matches with these filters switched on.' : 'Nothing to show.'}</p>${hasFilter ? `<p><a class="btn line" href="${esc(searchHref({ ...blank(), q: st.q, order: st.order }))}">Clear all filters</a></p>` : ''}</div>`;
  }
  let shown = 0; const take = (l) => { const o = l.slice(0, Math.max(0, ui.limit - shown)); shown += o.length; return o; };
  const ee = take(result.exact), rr = take(result.related), total = result.exact.length + result.related.length;
  const list = (es, o) => `<ul class="cards">${es.map((e) => entryHtml(e, o)).join('')}</ul>`;
  if (browsing) {
    announceText = `${pl(n, 'page')}.`;
    out += `<section class="grp frame"><div class="gh"><h3>${pl(n, 'page')}</h3></div>${list(ee, { hideContextFor: st.section })}</section>`;
  } else {
    announceText = ex ? `${pl(ex, 'exact match', 'exact matches')}${rel ? ` and ${pl(rel, 'related result')}` : ''}.` : `No exact matches. ${pl(rel, 'related result')}.`;
    out += ex ? `<section class="grp frame"><div class="gh"><h3>Exact matches <span>${ex}</span></h3><p>Your words (or a matching topic) appear in the title or in the questions this page helps answer.</p></div>${list(ee)}</section>`
      : '<p class="callout">No exact matches. Here are related results.</p>';
    if (rel) out += `<section class="grp frame"><div class="gh"><h3>Related results <span>${rel}</span></h3><p>These share some of your words or the same topic. They may or may not be what you are looking for.</p></div>${list(rr)}</section>`;
  }
  if (total > ui.limit) out += `<button class="more2" data-more>Show ${Math.min(20, total - ui.limit)} more</button>`;
  if (!browsing) out += externalHtml(result.query);
  return out;
}
const refineHtml = (st) => `<form class="refine" id="refine" role="search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg><label class="sr" for="q2">Refine your search</label><input id="q2" type="search" autocomplete="off" enterkeyhint="search" value="${esc(st.q)}" maxlength="200"><button class="btn solid" type="submit">Search</button></form>`;

function miniHtml(r) {
  const src = sourceName(r.source);
  return `<article class="mini"><div class="badges"><span class="tag" style="--c:var(--t-${esc(r.content_tag)})">${esc(tagLabel(r.content_tag))}</span>${levelDots(r.level)}</div>
  <h3><a href="${esc(safeUrl(r.url))}" target="_blank" rel="noopener noreferrer" dir="auto">${esc(r.title)}<span class="sr"> (opens in a new tab)</span></a></h3>
  ${r.description ? `<p dir="auto">${esc(r.description)}</p>` : ''}<span class="mute" style="font-size:.875rem;margin-top:auto">Opens on ${esc(sourceShort(r.source))} <span aria-hidden="true">↗</span></span></article>`;
}
function rowHtml(r, more) {
  const sec = r.context && r.context.section ? r.context.section.title : '';
  return `<li class="lrow"><h4><a href="${esc(safeUrl(r.url))}" target="_blank" rel="noopener noreferrer" dir="auto">${esc(r.title)}<span class="sr"> (opens in a new tab)</span></a></h4>
  <div class="lm"><span class="tag" style="--c:var(--t-${esc(r.content_tag)})">${esc(tagLabel(r.content_tag))}</span>${levelDots(r.level)}${(r.authors || []).length ? `<span dir="auto">By ${esc((r.authors || []).map(scholarName).join(', '))}</span>` : ''}<span dir="auto">${esc(sourceShort(r.source))}</span>${sec ? `<span class="lr-sec" dir="auto">In ${esc(sec)}</span>` : ''}</div>
  ${r.description ? `<p class="lr-d" dir="auto">${esc(r.description)}</p>` : ''}${clusterDetails(more)}</li>`;
}
function topicHtml(id) {
  const h = engine.headingById.get(id); if (!h) return '<p class="callout">That topic does not exist.</p>';
  const res = engine.search('', { topic: id });
  const kids = (h.children || []).map((c) => ({ c, n: RECS.filter((r) => r.all.includes(c)).length })).filter((s) => s.n > 0);
  const levels = levelOrder().map((lv) => ({ lv, es: res.exact.filter((e) => entryLevel(e) === lv) }));
  const have = levels.filter((l) => l.es.length);
  const cur = have.some((l) => l.lv === ui.tl[id]) ? ui.tl[id] : (have[0] || {}).lv;
  const starters = RECS.filter((n) => n.all.includes(id) && n.g === 'work').sort((a, b) => (LV(a.lv) - LV(b.lv)) || String(a.raw.title).localeCompare(b.raw.title)).slice(0, 3);
  const es = (levels.find((l) => l.lv === cur) || { es: [] }).es, lim = ui.lm[id + cur] || 12;
  const rows = es.slice(0, lim).map((e) => (e.kind === 'cluster' ? rowHtml(e.items[0].record, { items: e.items.slice(1).map((i) => i.record), title: (e.parent || {}).title || 'the same section' }) : rowHtml(e.record))).join('');
  return `${kids.length ? `<nav class="tnav" aria-label="Sub-topics">${kids.map((s) => `<a class="chip" href="${esc(topicHref(s.c))}">${esc(TOPN(s.c))} <i>${s.n}</i></a>`).join('')}</nav>` : ''}
  ${starters.length ? `<section class="tsec"><h2>${starters.length === 1 ? 'Start with this' : 'Start with these'}</h2><p class="sub">${starters.length === 1 ? 'The one book or article on this topic.' : 'The easiest books and articles on this topic.'}</p><div class="minis">${starters.map((n) => miniHtml(n.raw)).join('')}</div></section>` : ''}
  <section class="tsec"><h2>Everything on this topic</h2><p class="sub">Choose a level. Within each level, books and articles come before individual pages.</p>
  <div class="seg" role="group" aria-label="Level">${levels.map((l) => `<button data-tl="${esc(id)}|${esc(l.lv)}" aria-pressed="${l.lv === cur}"${l.es.length ? '' : ' disabled'}>${esc(levelLabel(l.lv))}<i>${entryCount(l.es)}</i></button>`).join('')}</div>
  <ul class="lrows">${rows || '<li class="callout">Nothing at this level yet.</li>'}</ul>
  ${es.length > lim ? `<p style="margin:1rem 0 0"><button class="more2" data-lm="${esc(id)}|${esc(cur)}">Show ${Math.min(12, es.length - lim)} more of ${es.length - lim}</button></p>` : ''}</section>
  ${nextBar('topic')}`;
}

// ---------------------------------------------------------------------------
// The tour and the name pages
// ---------------------------------------------------------------------------
function buildTour() {
  E = {};
  const ent = (name, sub, kind, type, extra = {}) => { const k = extra.k || 'e-' + slug(name); if (!E[k]) E[k] = { k, name, sub, kind, type, ...extra, slides: [] }; return k; };
  const hadith = [], seen = new Set();
  for (const r of engine.records) {
    if (r.content_tag === 'hadith' && r.granularity === 'work' && !/\(Vol\. ([2-9]|\d\d)/.test(r.title) && !seen.has(r.title)) { seen.add(r.title); hadith.push(r.id); }
  }
  const workCount = (id) => engine.records.filter((r) => (r.authors || []).includes(id)).length;
  const resolve = (it) => {
    if (it.person) return ent(it.person, it.sub, { prophet: 'Prophet', imam: 'Imam', infallible: 'Infallible' }[it.as] || 'Person', 'person');
    if (it.concept) return ent(it.concept, it.sub, it.as === 'book' ? 'Book' : 'Concept', it.as === 'book' ? 'book' : 'concept');
    if (it.book) { const r = rec(it.book); return r ? ent(r.title, `${tagLabel(r.content_tag)} · ${levelLabel(r.level)}`, 'Book', 'book', { k: 'e-book-' + r.id, rid: r.id }) : null; }
    if (it.scholar) { const s = engine.scholarById.get(it.scholar); if (!s) return null; const w = workCount(s.id); return ent(s.name, w ? pl(w, 'page') : 'Author', 'Scholar', 'scholar', { k: 'e-scholar-' + s.id, sid: s.id }); }
    if (it.topic) return { href: topicHref(it.topic), name: it.name || TOPN(it.topic), sub: it.sub || 'Topic' };
    if (it.href) return { href: it.href === '#home' ? BASE : it.href.startsWith('#') ? pageHref(it.href.slice(1)) : it.href, name: it.name, sub: it.sub, ask: it.ask };
    return null;
  };
  TOURX = TOUR.map((s) => ({ ...s, groups: s.groups.map((g) => {
    let items = [];
    for (const it of g.items) {
      if (it.auto === 'hadith-works') items.push(...hadith.slice(0, it.limit || 6).map((id) => resolve({ book: id })));
      else if (it.auto === 'top-scholars') items.push(...[...engine.scholars].map((x) => ({ x, w: workCount(x.id) })).filter((o) => o.w).sort((a, b) => b.w - a.w).slice(0, it.limit || 12).map((o) => resolve({ scholar: o.x.id })));
      else items.push(resolve(it));
    }
    items = items.filter(Boolean);
    for (const it of items) if (typeof it === 'string' && !E[it].slides.includes(s.k)) E[it].slides.push(s.k);
    return { ...g, items };
  }) }));
  SL = TOURX.map((s) => [s.k, s.label]);
}
function ctxFor(k) {
  const e = E[k], want = lastSlide && e.slides.includes(lastSlide) ? lastSlide : e.slides[0];
  const s = TOURX.find((x) => x.k === want) || TOURX[0];
  const g = s.groups.find((gr) => gr.items.includes(k)) || { items: [k] };
  return { slide: s, peers: g.items.filter((i) => typeof i === 'string') };
}
const ARW = (d) => `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d ? 'M3 8h10M9 4l4 4-4 4' : 'M13 8H3M7 4L3 8l4 4'}"/></svg>`;
function tileHtml(it, i) {
  const st = `style="--i:${Math.min(i, 8)}"`;
  if (typeof it === 'string') { const e = E[it]; return `<a class="dt" ${st} href="${esc(pageHref(it))}"><b dir="auto">${esc(e.name)}</b><small>${esc(e.sub)}</small></a>`; }
  return `<a class="dt" ${st} href="${esc(it.href)}"${it.ask ? ' data-ask' : ''}><b>${esc(it.name)}</b><small>${esc(it.sub || '')}</small></a>`;
}
function slideHtml(key) {
  const i = SL.findIndex((s) => s[0] === key), s = TOURX[i], last = i === SL.length - 1;
  const prev = SL[(i + SL.length - 1) % SL.length], next = SL[(i + 1) % SL.length];
  let n = 0;
  const body = s.groups.map((g) => `${g.label ? `<p class="gl">${esc(g.label)}</p>` : ''}<div class="dgrid ${g.lead ? 'lead' : ''}">${g.items.map((it) => tileHtml(it, n++)).join('')}</div>`).join('') + (s.note ? `<p class="note" style="margin:0">${esc(s.note)}</p>` : '');
  return `<div class="sh-pad sh-top"><a class="sh-x" href="${esc(BASE)}" aria-label="Exit What is Islam?"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13"/></svg>Exit</a>
   <div class="sh-prog" aria-hidden="true">${SL.map((_, j) => `<i class="${j < i ? 'd' : j === i ? 'c' : ''}"></i>`).join('')}</div><span class="sh-n">${i + 1} / ${SL.length}</span></div>
  <div class="sh-pad sh-main"><div class="sh-l"><span class="sh-big" aria-hidden="true">${i + 1}</span><h1 id="shh" tabindex="-1">${esc(s.title)}</h1><p class="l2">${esc(s.lede)}</p></div><div class="sh-r">${body}</div></div>
  <div class="sh-pad sh-bot"><div class="row2">${i === 0 ? '<span></span>' : `<a class="pv2" href="${esc(pageHref('start-' + prev[0]))}" aria-label="Previous slide: ${esc(prev[1])}"><span class="rb">${ARW(0)}</span><span>${esc(prev[1])}</span></a>`}
   ${last ? `<a class="pn" href="${esc(pageHref('beginners'))}">Continue to Start here ${ARW(1)}</a>` : `<a class="pn" href="${esc(pageHref('start-' + next[0]))}">${esc(next[1])} ${ARW(1)}</a>`}</div></div>`;
}
function entityStageHtml(e) {
  const c = ctxFor(e.k);
  return pageStage({ kind: e.kind, title: e.name, lede: e.sub, back: [pageHref('start-' + c.slide.k), 'Back to ' + c.slide.label] });
}
function entityBodyHtml(e) {
  let rel = [], head = 'Learn more', empty = 'No pages for this name in the catalog yet.';
  const strip = (s) => s.replace(/^(The |Prophet |Imam )/, '').replace(/\s*\(.*\)/, '');
  const firstRecords = (res) => [...res.exact, ...res.related].map((x) => (x.kind === 'cluster' ? x.items[0].record : x.record));
  if (e.type === 'scholar') { rel = firstRecords(engine.search('', { scholar: e.sid })).slice(0, 6); head = 'Works by this author'; empty = 'No works by this author in the catalog yet.'; }
  else if (e.type === 'book' && e.rid) { const r = rec(e.rid); rel = [r, ...RECS.filter((x) => x.id !== r.id && x.raw.headings.some((h) => (r.headings || []).includes(h))).slice(0, 5).map((x) => x.raw)]; head = 'This book, and related pages'; }
  else { const res = engine.search(strip(e.name)); rel = firstRecords(res).slice(0, 6); }
  const q = e.name.replace(/^The /, '').replace(/\s*\(.*\)/, '');
  const c = ctxFor(e.k), g = c.peers, i = g.indexOf(e.k), p = E[g[(i + g.length - 1) % g.length]], n = E[g[(i + 1) % g.length]];
  return `<div class="egrid"><div><div class="bio"><h3>Short bio <span class="pill">Placeholder</span></h3><div class="ph"><i></i><i></i><i></i><p>A short, sourced bio will go here once it has been written and reviewed.</p></div></div>
  <div style="margin-top:1rem"><a class="btn solid big" href="${esc(qHref(q))}" style="width:100%;justify-content:center">Search more for “${esc(q)}”</a></div></div>
  <div class="frame" style="padding:8px"><div class="gh"><h3>${head} <span>${rel.length}</span></h3><p>Links to pages in the catalog.</p></div>${rel.length ? `<ul class="cards">${rel.map((r) => cardHtml(r)).join('')}</ul>` : `<div class="gh"><p>${empty}</p></div>`}</div></div>
  ${g.length > 1 ? `<div class="enav"><a href="${esc(pageHref(p.k))}"><small>Previous</small>${esc(p.name)}</a><a class="nx" href="${esc(pageHref(n.k))}"><small>Next</small>${esc(n.name)}</a></div>` : ''}`;
}

// ---------------------------------------------------------------------------
// Hero search box (suggestions as you type)
// ---------------------------------------------------------------------------
let rows = [], hi = 0;
const RET = '<kbd aria-hidden="true"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 3v5a2 2 0 0 1-2 2H3M5.5 7.5L3 10l2.5 2.5"/></svg></kbd>';
function buildRows() {
  const q = input.value.trim(), out = [];
  if (!q) {
    if (engine.questions.length) {
      out.push({ lab: `Suggested questions (${engine.questions.length})` });
      engine.questions.forEach((x) => out.push({ k: 'q', text: x.question, go: () => nav(qHref(x.question)) }));
      out.push({ k: 'q', text: `See all ${engine.questions.length} questions, grouped by theme`, go: () => nav(pageHref('questions')) });
    }
  } else {
    out.push({ k: 'all', text: `See all results for “${q}”`, go: () => nav(qHref(q)) });
    const res = engine.search(q), c = res.curated;
    const qs = c ? (c.question ? [c.question] : (c.questions || [])) : [];
    if (qs.length) { out.push({ lab: 'Questions' }); qs.slice(0, 4).forEach((x) => out.push({ k: 'q', text: x.question, go: () => nav(qHref(x.question)) })); }
    const top = [...res.exact, ...res.related].slice(0, 5).map((e) => (e.kind === 'cluster' ? e.items[0].record : e.record));
    if (top.length) { out.push({ lab: 'Top matches' }); top.forEach((r) => out.push({ k: 'r', r })); }
  }
  return out;
}
function buildList() {
  if (!engine) return;
  const items = buildRows(); rows = items.filter((x) => !x.lab); if (hi >= rows.length) hi = 0;
  let i = -1;
  $('#list').innerHTML = items.map((x) => {
    if (x.lab) return `<div class="lab" role="presentation">${esc(x.lab)}</div>`;
    i++; const sel = i === hi, id = 'opt' + i;
    if (x.k === 'r') { const r = x.r; return `<a class="row" id="${id}" role="option" aria-selected="${sel}" data-i="${i}" href="${esc(safeUrl(r.url))}" target="_blank" rel="noopener noreferrer"><span class="t" dir="auto">${esc(r.title)}</span><span class="r">${sel ? 'Open ' + RET : esc(tagLabel(r.content_tag))}</span></a>`; }
    return `<div class="row" id="${id}" role="option" aria-selected="${sel}" data-i="${i}"><span class="t" dir="auto">${esc(x.text)}</span><span class="r">${sel ? 'Select ' + RET : ''}</span></div>`;
  }).join('');
  input.setAttribute('aria-activedescendant', rows.length ? 'opt' + hi : '');
  comboState();
}
function comboState() { input.setAttribute('aria-expanded', String(!(document.body.classList.contains('has') && !$('#pal').matches(':focus-within')))); }
function setHi(n, scroll) { hi = (n + rows.length) % rows.length; buildList(); if (scroll) { const e = $('#opt' + hi); e && e.scrollIntoView({ block: 'nearest' }); } }
function choose(i) { const x = rows[i]; if (!x) return; if (x.k === 'r') $('#opt' + i).click(); else x.go(); }
input.addEventListener('input', () => { hi = 0; buildList(); });
input.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown') { e.preventDefault(); setHi(hi + 1, true); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); setHi(hi - 1, true); }
  else if (e.key === 'Enter') { e.preventDefault(); choose(hi); }
  else if (e.key === 'Escape') { input.value = ''; hi = 0; if (route.t === 'results') nav(BASE); else buildList(); }
});
$('#form').addEventListener('submit', (e) => e.preventDefault());
$('#pal').addEventListener('focusin', comboState);
$('#pal').addEventListener('focusout', () => setTimeout(comboState, 0));
$('#list').addEventListener('mousemove', (e) => { const r = e.target.closest('.row'); if (r && +r.dataset.i !== hi) { hi = +r.dataset.i; buildList(); } });
$('#list').addEventListener('mousedown', (e) => e.preventDefault());
$('#list').addEventListener('click', (e) => { const r = e.target.closest('.row'); if (!r || r.tagName === 'A') return; choose(+r.dataset.i); });

// ---------------------------------------------------------------------------
// Render
// ---------------------------------------------------------------------------
let announceText = '';
const MENU = [['beginners', 'Start here'], ['questions', 'Questions'], ['start-revelation', 'What is Islam?'], ['topics', 'Topics'], ['paths', 'Paths'], ['sources', 'Sources']];
function buildNav() {
  $('#mainnav').innerHTML = MENU.map(([h, l]) => `<a href="${esc(pageHref(h))}" data-nav="${h}">${esc(l)}</a>`).join('');
}
function setMenu(open) {
  const m = $('#mnav'), b = $('#menuBtn');
  if (open) {
    const cur = route.t === 'page' ? route.k : route.t === 'topic' ? 'topics' : '';
    m.innerHTML = [...MENU, ['guide', 'How to read the results'], ['about', 'About and scope'], ['feedback', 'Feedback and waitlist']].map(([h, l]) => `<a href="${esc(pageHref(h))}" ${h === cur ? 'aria-current="page"' : ''}>${esc(l)}</a>`).join('') + '<button class="btn line" type="button" id="mAsk">Search the catalog</button>';
  }
  m.hidden = !open; b.setAttribute('aria-expanded', String(open)); $('#menuLbl').textContent = open ? 'Close' : 'Menu';
}
function titleFor(r) {
  switch (r.t) {
    case 'page': return PG[r.k].title;
    case 'topic': return TOPN(r.k);
    case 'path': { const p = engine.pathById.get(r.st.path); return p ? p.title : 'Learning path'; }
    case 'entity': return E[r.k].name;
    case 'slide': return SL.find((s) => s[0] === r.k)[1] + ' · What is Islam?';
    case 'results': return r.st.q ? `${r.st.q}` : 'Browsing';
    default: return '';
  }
}

function render(opts = {}) {
  if (!engine) return;
  lastHref = location.href;
  route = parseRoute();
  const t = route.t, st = route.st || blank();
  const heroOn = t === 'home';
  document.body.classList.remove('has');
  document.body.classList.toggle('tour', t === 'slide');
  document.querySelectorAll('#mainnav a').forEach((a) => {
    const h = a.dataset.nav; a.removeAttribute('aria-current');
    if ((t === 'page' && route.k === h) || (t === 'topic' && h === 'topics')) a.setAttribute('aria-current', 'page');
  });
  $('#heroStage').hidden = !heroOn; $('#routeStage').hidden = heroOn || t === 'slide';
  const sh = $('#show'); sh.hidden = t !== 'slide';
  announceText = '';
  if (t === 'slide') {
    lastSlide = route.k;
    const i = SL.findIndex((s) => s[0] === route.k);
    sh.dataset.dir = i >= (render.lastIdx ?? 0) ? 'next' : 'prev'; render.lastIdx = i;
    sh.innerHTML = slideHtml(route.k); sh.scrollTop = 0; view.innerHTML = '';
    announceText = `Slide ${i + 1} of ${SL.length}: ${SL[i][1]}`;
  } else if (t === 'home') {
    view.innerHTML = homeHtml(); announceText = 'Home';
  } else if (t === 'page') {
    const m = PG[route.k]; $('#routeStage').innerHTML = pageStage(m);
    view.innerHTML = (m.draft && draftApplies(route.k) ? draftBar() : '') + m.body() + (m.next ? nextBar(route.k) : '');
    if (!m.noHide) { const h2 = view.querySelector('section.blk > h2'); if (h2) h2.classList.add('sr'); const sb = view.querySelector('section.blk > .sub'); if (sb) sb.remove(); }
    announceText = `${m.title} page`;
  } else if (t === 'topic') {
    $('#routeStage').innerHTML = pageStage({ kind: 'Topic', title: TOPN(route.k), lede: statsText(route.k), back: [pageHref('topics'), 'All topics'] });
    view.innerHTML = topicHtml(route.k); announceText = `Topic: ${TOPN(route.k)}`;
  } else if (t === 'path') {
    const p = engine.pathById.get(st.path);
    if (!p) { $('#routeStage').innerHTML = pageStage({ kind: 'Learning path', title: 'Path not found', back: [pageHref('paths'), 'All paths'] }); view.innerHTML = '<p class="callout">That reading path does not exist.</p>'; }
    else {
      $('#routeStage').innerHTML = pageStage({ kind: 'Learning path', title: p.title, lede: p.intro, back: [pageHref('paths'), 'All paths'] });
      view.innerHTML = pathHtml(p) + nextBar('path');
    }
    announceText = `Learning path: ${titleFor(route)}`;
  } else if (t === 'entity') {
    const e = E[route.k]; $('#routeStage').innerHTML = entityStageHtml(e); view.innerHTML = entityBodyHtml(e); announceText = `${e.name}, ${e.kind}`;
  } else if (t === 'results') {
    if (!st.q) {
      const sec = st.section && rec(st.section);
      const title = sec ? sec.title : st.scholar ? scholarName(st.scholar) : st.source ? sourceName(st.source) : st.tag ? `Everything tagged ${tagLabel(st.tag)}` : 'Everything in the catalog';
      $('#routeStage').innerHTML = pageStage({ kind: sec ? 'Browsing inside' : 'Browsing', title, back: [BASE, 'Back to start'] });
      view.innerHTML = resultsHtml(st);
    } else {
      const result = engine.search(st.q, st), cq = !result.fallback && result.curated && result.curated.question && isThatQuestion(st.q, result.curated.question) ? result.curated.question : null;
      input.value = st.q;
      if (cq) {
        const same = textNorm(cq.question) === textNorm(st.q);
        $('#routeStage').innerHTML = pageStage({ kind: 'Question', title: cq.question, lede: same ? '' : `The closest question to “${st.q}”.`, back: [pageHref('questions'), 'All questions'] });
        view.innerHTML = questionPageHtml(st, result);
      } else {
        $('#routeStage').innerHTML = pageStage({ kind: 'Search results', title: `“${st.q}”`, back: [BASE, 'Back to start'] });
        view.innerHTML = resultsHtml(st, result);
        announceText = `Results for ${st.q}. ${announceText}`;
      }
    }
  }
  buildList(); setMenu(false);
  try { document.title = t === 'home' ? `${SITE.name}: find where to learn about Shia Islam` : `${titleFor(route)} · ${SITE.name}`; } catch { /* ignore */ }
  afterRender(opts);
}
const draftApplies = (k) => ({ questions: engine.questions.some((q) => q.draft), paths: engine.paths.some((p) => p.draft), topics: engine.vocabularyDraft || engine.questions.some((q) => q.draft), beginners: true }[k] ?? true);

function afterRender(opts) {
  const t = route.t;
  if (t !== 'slide' && opts.push !== false) scrollTo(0, 0);
  if (firstLoad) { firstLoad = false; return; }
  let target = null;
  if (t === 'slide') target = $('#shh');
  else if (t === 'home') target = $('#heroStage h1');
  else target = $('#routeStage h1');
  if (target) { target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true }); }
  const a = $('#announce'); a.textContent = ''; setTimeout(() => { a.textContent = announceText; }, 60);
}

// ---------------------------------------------------------------------------
// Events (delegated)
// ---------------------------------------------------------------------------
view.addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b) return;
  const st = readState(), keep = (patch) => nav(searchHref({ ...st, ...patch }));
  if ('tag' in b.dataset) keep({ tag: st.tag === b.dataset.tag ? '' : b.dataset.tag });
  else if ('order' in b.dataset) keep({ order: b.dataset.order === engine.config.ranking.default_order ? '' : b.dataset.order });
  else if (b.dataset.clear) keep({ [b.dataset.clear]: '' });
  else if ('more' in b.dataset) { ui.limit += 20; render({ push: false }); }
  else if (b.dataset.lm) { const [id, lv] = b.dataset.lm.split('|'); ui.lm[id + lv] = (ui.lm[id + lv] || 12) + 12; const y = scrollY; render({ push: false }); scrollTo(0, y); }
  else if (b.dataset.g) { ui.openG[b.dataset.g] = !ui.openG[b.dataset.g]; const y = scrollY; render({ push: false }); scrollTo(0, y); }
  else if (b.dataset.tl) { const [id, lv] = b.dataset.tl.split('|'); ui.tl[id] = lv; const y = scrollY; render({ push: false }); scrollTo(0, y); const pressed = $(`[data-tl="${CSS.escape(b.dataset.tl)}"]`); if (pressed) pressed.focus({ preventScroll: true }); }
  else if ('pt' in b.dataset) { ui.pathTheme = b.dataset.pt; const y = scrollY; render({ push: false }); scrollTo(0, y); const pressed = $(`[data-pt="${CSS.escape(b.dataset.pt)}"]`); if (pressed) pressed.focus({ preventScroll: true }); }
  else if ('focus' in b.dataset) { scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); input.focus(); }
  else if ('askq' in b.dataset) { $('#ask').click(); }
  else if (b.dataset.jump) { const el = document.getElementById(b.dataset.jump); if (el) { el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); el.setAttribute('tabindex', '-1'); el.focus({ preventScroll: true }); } }
  else if (b.dataset.qt) { ui.qtheme = b.dataset.qt; ui.qfilter = ''; const y = scrollY; render({ push: false }); scrollTo(0, y); const pressed = $(`[data-qt="${CSS.escape(b.dataset.qt)}"]`); if (pressed) pressed.focus({ preventScroll: true }); }
});
view.addEventListener('input', (e) => { if (e.target.id === 'qfilter') { ui.qfilter = e.target.value; const l = $('#qlist'); if (l) l.innerHTML = qListHtml(); } });
view.addEventListener('change', (e) => {
  const t = e.target;
  if (t.dataset && t.dataset.filter) { const st = readState(); nav(searchHref({ ...st, [t.dataset.filter]: t.value })); return; }
  if (t.name === 'kind') { const f = FB[t.value] || FB.feedback; ui.fbkind = t.value; $('#fb-go').textContent = f.go; $('#fb-opt').textContent = f.need ? '' : '(optional)'; $('#fb-msg').placeholder = f.ph; $('#fb-merr').hidden = true; return; }
  if (t.dataset && t.dataset.read) {
    if (t.checked) read[t.dataset.read] = 1; else delete read[t.dataset.read]; saveRead();
    document.querySelectorAll(`[data-read="${CSS.escape(t.dataset.read)}"]`).forEach((x) => { x.checked = t.checked; const w = x.closest('li,.si'); if (w) { const d = w.classList.contains('si') ? w.children[1] : w; d.classList.toggle('done', t.checked); } });
    const sd = startData(), sdn = sd.shelf.filter((r) => read[r.id]).length; const sc = $('#shelfc'); if (sc) sc.textContent = `${sdn} of ${sd.shelf.length} read`;
    const stepLi = t.closest('.stepper > li'); if (stepLi) stepLi.classList.toggle('done', t.checked);
    if ($('#pathc') && route.t === 'path') { const p = engine.pathById.get(route.st.path), ids = p ? p.steps.map((s) => s.record).filter((id) => rec(id)) : [], d = ids.filter((id) => read[id]).length, pc2 = ids.length ? Math.round(d / ids.length * 100) : 0; $('#pathc').textContent = `${d} of ${ids.length} read`; $('#pathbar').style.width = pc2 + '%'; $('#pathbar').parentElement.setAttribute('aria-valuenow', pc2); }
    const pd = sd.all.filter((id) => read[id]).length, pct = sd.all.length ? Math.round(pd / sd.all.length * 100) : 0;
    const pc = $('#planc'); if (pc) pc.textContent = `${pd} of ${sd.all.length} read`; const pb = $('#planbar'); if (pb) { pb.style.width = pct + '%'; pb.parentElement.setAttribute('aria-valuenow', pct); }
  }
});
view.addEventListener('submit', (e) => {
  if (e.target.id === 'refine') { e.preventDefault(); const st = readState(); nav(searchHref({ ...blank(), q: $('#q2').value.trim(), order: st.order })); return; }
  if (e.target.id !== 'fbf') return;
  e.preventDefault();
  const k = (document.querySelector('input[name=kind]:checked') || {}).value, msg = $('#fb-msg').value.trim();
  const need = (FB[k] || FB.feedback).need && !msg; $('#fb-merr').hidden = !need; $('#fb-msg').setAttribute('aria-invalid', String(need));
  if (need) { $('#fb-msg').focus(); return; }
  const href = feedbackHref(k, msg); if (!href) return;
  if (SITE.report.kind === 'github') window.open(href, '_blank', 'noopener'); else location.href = href;
});
$('#show').addEventListener('click', (e) => { const a = e.target.closest('[data-ask]'); if (a) { e.preventDefault(); nav(BASE); setTimeout(() => $('#ask').click(), 80); } });
$('#skip').addEventListener('click', (e) => { e.preventDefault(); view.setAttribute('tabindex', '-1'); view.focus(); view.scrollIntoView({ block: 'start' }); });
$('#ask').addEventListener('click', () => {
  if (route.t === 'results' && route.st.q) { const r = $('#q2'); if (r) { scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); r.focus(); r.select(); return; } }
  if (route.t !== 'home') nav(BASE);
  setTimeout(() => { scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); input.focus(); }, 60);
});
$('#menuBtn').addEventListener('click', () => setMenu($('#mnav').hidden));
$('#mnav').addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); else if (e.target.id === 'mAsk') { setMenu(false); $('#ask').click(); } });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !$('#mnav').hidden) { setMenu(false); $('#menuBtn').focus(); return; }
  if (route.t !== 'slide' || /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
  const i = SL.findIndex((s) => s[0] === route.k);
  if (e.key === 'ArrowRight') nav(pageHref(i < SL.length - 1 ? 'start-' + SL[i + 1][0] : 'beginners'));
  if (e.key === 'ArrowLeft' && i > 0) nav(pageHref('start-' + SL[i - 1][0]));
  if (e.key === 'Escape') nav(BASE);
});
const curTheme = () => document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
function themeBtn() { const d = curTheme() === 'dark', b = $('#theme'); b.setAttribute('aria-label', d ? 'Switch to light theme' : 'Switch to dark theme'); b.classList.toggle('is-dark', d); }
$('#theme').addEventListener('click', () => { document.documentElement.dataset.theme = curTheme() === 'dark' ? 'light' : 'dark'; themeBtn(); });
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', themeBtn); themeBtn();

// Tour swipe: the slide follows the finger 1:1, release projects momentum (touch and pen only).
const showEl = $('#show'); let g = null, noClickUntil = 0;
const rubber = (o, dim, c = .55) => (o * dim * c) / (dim + c * Math.abs(o));
const projectPx = (v) => v * .998 / (1 - .998);
const curIdx = () => SL.findIndex((s) => s[0] === route.k);
showEl.addEventListener('pointerdown', (e) => {
  if (route.t !== 'slide' || e.pointerType === 'mouse' || g) return;
  const m = showEl.querySelector('.sh-main'); if (!m) return;
  g = { id: e.pointerId, x: e.clientX, y: e.clientY, drag: false, m, h: [[e.clientX, performance.now()]] };
});
showEl.addEventListener('pointermove', (e) => {
  if (!g || e.pointerId !== g.id) return;
  const dx = e.clientX - g.x, dy = e.clientY - g.y;
  if (!g.drag) {
    if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) { g = null; return; }
    if (Math.abs(dx) < 10) return;
    g.drag = true; try { showEl.setPointerCapture(e.pointerId); } catch { /* ignore */ }
    g.m.style.transition = 'none'; g.m.style.willChange = 'transform';
  }
  const i = curIdx(), W = innerWidth, edge = (dx > 0 && i === 0) || (dx < 0 && i === SL.length - 1);
  g.m.style.transform = `translate3d(${edge ? rubber(dx, W) : dx}px,0,0)`;
  g.dx = dx; g.h.push([e.clientX, performance.now()]); if (g.h.length > 5) g.h.shift();
});
function endDrag(e, cancel) {
  if (!g || e.pointerId !== g.id) return; const d = g; g = null;
  if (!d.drag) return;
  noClickUntil = performance.now() + 350;
  const f = d.h[0], l = d.h[d.h.length - 1], v = (l[0] - f[0]) / Math.max(1, l[1] - f[1]);
  const i = curIdx(), W = innerWidth, end = d.dx + projectPx(v); let to = null;
  if (!cancel && Math.abs(end) > W * .4) { if (end < 0 && i < SL.length - 1) to = SL[i + 1][0]; else if (end > 0 && i > 0) to = SL[i - 1][0]; }
  const m = d.m;
  if (to) { m.style.transition = 'transform 140ms cubic-bezier(.23,1,.32,1),opacity 140ms'; m.style.transform = `translate3d(${end < 0 ? -72 : 72}px,0,0)`; m.style.opacity = '0'; setTimeout(() => nav(pageHref('start-' + to)), 120); }
  else { m.style.transition = 'transform 260ms cubic-bezier(.32,.72,0,1)'; m.style.transform = 'translate3d(0,0,0)'; setTimeout(() => { m.style.willChange = ''; m.style.transition = ''; }, 280); }
}
showEl.addEventListener('pointerup', (e) => endDrag(e, false));
showEl.addEventListener('pointercancel', (e) => endDrag(e, true));
document.addEventListener('click', (e) => { if (performance.now() < noClickUntil) { e.preventDefault(); e.stopPropagation(); } }, true);

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
async function start() {
  for (const n of document.querySelectorAll('[data-site-name]')) n.textContent = SITE.name;
  try {
    const res = await fetch('data/index.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    engine = createEngine(await res.json());
    RECS = engine.records.map(normalize); N = new Map(RECS.map((n) => [n.id, n]));
    $('#n').textContent = engine.records.length.toLocaleString();
    $('#bd').textContent = engine.buildDate ? `Catalog updated ${engine.buildDate}.` : '';
    buildTour(); buildNav(); render();
  } catch (err) {
    view.innerHTML = '<p class="callout">The catalog could not be loaded. Please check your connection and reload the page.</p>';
    announceText = 'The catalog could not be loaded.'; console.error(err);
  }
}
start();

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
  return `<div class="shelf"><div class="shelf-h"><b>Day one shelf</b><span class="prog"><span id="shelfc">${n} of ${sd.shelf.length} read</span><div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${sd.shelf.length ? Math.round(n / sd.shelf.length * 100) : 0}" aria-label="Shelf progress"><i id="shelfbar" style="width:${sd.shelf.length ? Math.round(n / sd.shelf.length * 100) : 0}%"></i></div></span></div>${sd.shelf.map((r) =>
    `<div class="si"><div>${tickBox(r)}</div><div class="${read[r.id] ? 'done' : ''}">${extLink(r.url, 'tt', `${esc(r.title)} <span aria-hidden="true">↗</span>`)}<small>${(r.sample_questions || [])[0] ? `After this you can answer: “${esc(r.sample_questions[0])}”` : ''}</small></div></div>`).join('')}</div>`;
}
function planHtml(sd) {
  const done = sd.all.filter((id) => read[id]).length, pct = sd.all.length ? Math.round(done / sd.all.length * 100) : 0;
  return `<div class="plan"><div class="plan-h"><b>Your progress</b><div class="prog"><span id="planc">${done} of ${sd.all.length} read</span><div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}" aria-label="Plan progress"><i id="planbar" style="width:${pct}%"></i></div></div></div>
  <ol class="stages">${sd.stages.map((s, i) => {
    const lv = [...new Set(s.recs.map((r) => LV(r.level)))].sort();
    return `<li class="stg"><div class="stg-h"><span class="sg-n" aria-hidden="true">${i + 1}</span><div class="stg-t"><div class="no">Stage ${i + 1} of ${sd.stages.length}</div><h3>${esc(s.title)}</h3><p>${esc(s.note)}</p></div><span class="sg-m">${pl(s.recs.length, 'page')} · ${lv.map((l) => esc(levelLabel(levelOrder()[l - 1]))).join(', ')}</span></div>
    ${s.shelfStage ? `<p class="stg-s">These are the ${s.recs.length} pages on the day-one shelf. <button class="btn line" type="button" data-jump="st2">Go to the shelf</button></p>`
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
const qLine = (q, theme) => `<li><a class="ql" href="${esc(qHref(q.question))}"><span class="ql-t" dir="auto">${esc(q.question)}</span><span class="ql-m">${esc([theme, (() => { const n = (q.top_records || []).filter((id) => rec(id)).length; return n ? pl(n, 'page') : ''; })()].filter(Boolean).join(' · '))}</span></a></li>`;
function qTabs() {
  const { g, tops } = qGroups();
  const ordered = [...tops.filter((h) => h.id === 'new-to-shia-islam'), ...tops.filter((h) => h.id !== 'new-to-shia-islam')];
  return { g, ordered, cur: ui.qtheme === 'all' ? 'all' : (g[ui.qtheme] ? ui.qtheme : ordered[0].id) };
}
function qListHtml() {
  const { g, cur } = qTabs(), f = textNorm(ui.qfilter).split(' ').filter(Boolean), typed = ui.qfilter.trim();
  if (f.length) {
    const hits = engine.questions.filter((q) => { const hay = textNorm([q.question, ...(q.alt_phrasings || [])].join(' ')); return f.every((w) => hay.includes(w)); });
    return `<p class="qcount" role="status">${hits.length ? `${pl(hits.length, 'question')} like “${esc(typed)}”.` : 'No ready-made question like that yet.'}</p><ul class="qlines">${hits.map((q) => qLine(q, TOPN(topOf((q.headings || [])[0] || 'new-to-shia-islam')))).join('')}
      <li><a class="ql ql-go" href="${esc(qHref(typed))}"><span class="ql-t">Search the catalog for “${esc(typed)}”</span><span class="ql-m">All ${RECS.length.toLocaleString()} pages</span></a></li></ul>`;
  }
  const list = cur === 'all' ? engine.questions : g[cur];
  return `<ul class="qlines">${list.map((q) => qLine(q, cur === 'all' ? TOPN(topOf((q.headings || [])[0] || 'new-to-shia-islam')) : '')).join('')}</ul>`;
}
function questionsHtml() {
  const { g, ordered, cur } = qTabs();
  const ask = SITE.externalSearch && SITE.externalSearch.askUrl;
  return `<section class="blk" id="questions"><h2>Common questions</h2><p class="sub">Questions newcomers ask.</p>
  <form class="refine qa" id="qform" role="search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg><label class="sr" for="qfilter">Type a question or a word</label><input id="qfilter" type="search" autocomplete="off" enterkeyhint="search" placeholder="Type a question" value="${esc(ui.qfilter)}" maxlength="200"><button class="btn solid" type="submit">Ask</button></form>
  <div class="qtabs" role="group" aria-label="Theme">${ordered.map((h) => `<button class="qtab" data-qt="${esc(h.id)}" aria-pressed="${h.id === cur && !ui.qfilter.trim()}">${esc(TOPN(h.id))}<i>${g[h.id].length}</i></button>`).join('')}<button class="qtab" data-qt="all" aria-pressed="${cur === 'all' && !ui.qfilter.trim()}">All<i>${engine.questions.length}</i></button></div>
  <div id="qlist">${qListHtml()}</div>
  ${ask ? `<p class="qalt">Not here? ${esc(SITE.externalSearch.name)} also has its own <a href="${esc(ask)}" target="_blank" rel="noopener noreferrer">question service<span class="sr"> (opens in a new tab)</span> ↗</a>.</p>` : ''}</section>`;
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
  const i = pathInfo(p), lo = levelLabel(levelOrder()[i.first - 1]), hi = levelLabel(levelOrder()[i.last - 1]);
  return `<a class="pcard" href="${esc(searchHref({ ...blank(), path: p.id }))}"><span class="pt"><span>${esc(i.theme ? TOPN(i.theme) : 'Learning path')}</span><span>${esc(pl(p.steps.length, 'step'))}</span></span><h3 dir="auto">${esc(p.title)}</h3>${p.intro ? `<p dir="auto">${esc(p.intro)}</p>` : ''}
  <div class="pj"><span class="sdots" aria-hidden="true">${i.lv.map((l) => `<i class="d${Math.min(3, l)}"></i>`).join('')}</span><span class="pr">${i.first === i.last ? esc(lo) : `${esc(lo)} <span aria-hidden="true">→</span><span class="sr"> to </span> ${esc(hi)}`}</span></div></a>`;
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
function sourceFirstPage(id) {
  const w = engine.records.filter((r) => r.source === id && r.granularity === 'work' && LV(r.level) === 1).sort((x, y) => String(x.title).localeCompare(String(y.title)));
  return w[0] || null;
}
function levelPhrase(st) {
  const labels = levelOrder().map((l) => levelLabel(l).toLowerCase()), top = st.lv.indexOf(Math.max(...st.lv));
  return st.n && st.lv[top] / st.n > 0.5 ? `Mostly ${labels[top]}` : 'A mix of levels';
}
function sourcePanel(s) {
  const st = sourceStats(s.id), url = safeUrl(s.base_url), first = sourceFirstPage(s.id);
  return `<article class="scard"><div class="sc-top"><h3 dir="auto">${esc(srcName(s))}</h3><p class="sc-dom">${esc(s.id)}</p></div>
   <p class="sc-d">${esc(WHAT[s.id] || '')}</p>
   <div class="sc-n"><p><b>${st.n.toLocaleString()}</b> ${st.n === 1 ? 'page' : 'pages'}</p>
    <div class="lv ladder"><div class="bars" aria-hidden="true">${st.lv.map((n, i) => n ? `<i class="b${i + 1}" style="flex:${n}"></i>` : '').join('')}</div></div><p class="sc-l">${esc(levelPhrase(st))}</p></div>
   <p class="sc-f"><span>Good first page</span>${first ? extLink(first.url, '', `${esc(first.title)} <span aria-hidden="true">↗</span>`) : '<em>No beginner-level pages on this website</em>'}</p>
   <div class="sc-a"><a class="btn solid" href="${esc(searchHref({ ...blank(), source: s.id }))}">Browse ${st.n.toLocaleString()} pages</a>${url ? `<a class="sc-v" href="${esc(url)}" target="_blank" rel="noopener noreferrer">Visit site <span aria-hidden="true">↗</span><span class="sr"> (${esc(s.id)}, opens in a new tab)</span></a>` : ''}</div></article>`;
}
function sourcesHtml() {
  const active = engine.sources.filter((s) => s.status === 'active'), soon = engine.sources.filter((s) => s.status !== 'active');
  const total = engine.records.length;
  return `<section class="blk" id="sources"><h2>Where our resources come from</h2><p class="sub">Every result comes from one of these approved websites.</p>
  <ul class="sfacts"><li>Approved by hand</li><li>Twelver Shia only</li><li>English only</li><li><b>${total.toLocaleString()}</b> pages from <b>${active.length}</b> websites</li></ul>
  <div class="scards">${active.map(sourcePanel).join('')}</div>
  ${soon.length ? `<div class="tsec"><h2>On the way</h2><p class="sub">Approved, but not in the catalog yet.</p><ul class="soon-list">${soon.map((s) => `<li><div><b dir="auto">${esc(srcName(s))}</b><span>${esc(WHAT[s.id] || s.catalog_level || '')}</span></div><span class="state">${esc(STATE_TEXT[s.status] || 'Coming later')}</span></li>`).join('')}</ul></div>` : ''}
  <div class="scope"><div><h3>Know a website that belongs here?</h3><p>Fiqh rulings come from two scholars, Sayyid Ali al-Sistani and Sayyid Ali Khamenei. Everything else is not limited by author. Tell us about a website, or read the full scope.</p></div>
  <div class="scope-b"><a class="btn line" href="${esc(pageHref('feedback'))}" data-fbkind="source">Suggest a website</a><a class="btn line" href="${esc(pageHref('about'))}">Read the full scope</a></div></div></section>`;
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
  const scope = safeUrl(SITE.scopeUrl) ? `<a href="${esc(SITE.scopeUrl)}" rel="noopener noreferrer">Read the full scope and inclusion criteria ↗</a>` : 'A fuller written scope is kept with the project and will be linked here once it is public.';
  const cells = [['Who it is for', 'Twelver (Ithna ‘Ashari) Shia resources, in English, with beginners first. Searching with Arabic, Persian or Urdu terms and common spellings still works: they match the same topics.'],
    ['Where it comes from', `Approved websites only. Nothing appears unless it comes from one of them. <a href="${esc(pageHref('sources'))}">See the websites</a>.`],
    ['Fiqh (rulings)', 'Limited to two scholars for now: Sayyid Ali al-Sistani and Sayyid Ali Khamenei. Results show whose rulings a page follows.'],
    ['Everything else', 'History, beliefs, ethics, hadith, Quran and similar topics are not limited by author, as long as they come from an approved website.']];
  const steps = ['It checks a list of common questions and topics prepared in advance. If your search matches one, the pages chosen for it come first.',
    'Then it does an ordinary word search over titles, descriptions, the questions each page helps answer, topic names (including other spellings) and scholar names.',
    'Exact matches have your words, or another name for the same topic, in the title or the questions a page helps answer. Everything else is Related. If nothing is exact, the page says so.',
    'If nothing matches well, the page says “We couldn’t find a close match” and offers topics and questions instead of guessing.',
    'Simpler material is listed first by default. You can switch to “Show deeper material first” at any time.'];
  return `<section class="lead"><p class="lead-t">${esc(SITE.name)} is a catalog, not a library.</p><p class="lead-p">It points you to where Shia resources are published on a short list of approved websites. It never hosts, copies or writes them. It is made for people who are new and do not know where to look.</p></section>
  <section class="tsec"><div class="pilgrid">
   <div class="pil">${ICON.link}<h3>We point, we do not host</h3><p>Every result links to the website where the original is published, and names it.</p></div>
   <div class="pil">${ICON.list}<h3>Descriptions, not answers</h3><p>Our short summaries say what a page is about. For rulings, they only name the question. Read the ruling on the source page.</p></div>
   <div class="pil">${ICON.lock}<h3>No rulings, no positions</h3><p>This site describes, labels and links. It does not give religious rulings.</p></div></div>
   <p class="note">Catalog entries were prepared with the help of an AI assistant from the source pages, then checked by automatic rules. Items marked <span class="pill">Draft</span> have not yet been reviewed by a person.</p></section>
  <section class="tsec"><h2>What is included</h2><dl class="cells">${cells.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${v.includes('<a ') ? v : esc(v)}</dd></div>`).join('')}</dl><p class="note">${scope}</p></section>
  <section class="tsec"><h2>How results are chosen</h2><p class="sub">Plain matching rules. <strong>No AI writes answers here:</strong> the search only finds and orders catalog entries.</p>
   <details class="more"><summary>The five steps, in order</summary><ol class="hsteps">${steps.map((p) => `<li><p>${esc(p)}</p></li>`).join('')}</ol></details></section>
  <section class="tsec"><h2>Privacy</h2><ul class="ticks priv"><li>The search runs entirely in your browser. What you type is not sent to anyone and is not stored.</li><li>No cookies, no tracking, no accounts.</li><li>Pages you tick as read are saved only in your own browser.</li><li>When you follow a link you leave this site, and the other website’s own policies apply. The “Search Al-Islam.org” link under results sends your search words to that site only if you click it.</li></ul></section>
  <section class="tsec"><div class="qask"><div><h3>Report a wrong or broken link</h3><p>If a link is broken, goes to the wrong page, or a description is wrong, please tell us. Include the title of the result and what is wrong.</p></div><div class="qask-b">${rep}</div></div></section>`;
}

const FB = {
  waitlist: { tab: 'Waitlist', d: 'Hear when new sources and features arrive. A message is optional.', go: 'Join the waitlist', need: false, ph: 'Anything you would like us to know? (optional)' },
  source: { tab: 'Suggest a website', d: 'Tell us about a Shia website that belongs in the catalog, and what it offers.', go: 'Send suggestion', need: true, ph: 'The website address, and what it offers.' },
  feedback: { tab: 'Topic or feedback', d: 'Something missing, confusing or wrong? A topic you would like covered?', go: 'Send feedback', need: true, ph: 'What would help?' },
  link: { tab: 'Broken link', d: 'A link that fails or opens the wrong page. Include the title of the result.', go: 'Send report', need: true, ph: 'The title of the result and what is wrong.' },
};
function feedbackHtml() {
  const ok = reportConfigured(), via = SITE.report.kind === 'github' ? 'GitHub issue form' : 'email app';
  const k0 = ui.fbkind && FB[ui.fbkind] ? ui.fbkind : 'waitlist';
  if (!ok) {
    try { console.info('ShiaLib: feedback is switched off. Set SITE.report in site/js/config.js to turn it on.'); } catch { /* ignore */ }
    return `<section class="blk" id="feedback"><div class="fbc fbc-off"><h2>Feedback opens soon</h2><p>We have not connected a way to receive notes yet. Please check back, or use the links in the footer for now.</p><a class="btn line" href="${esc(BASE)}">Back to the start</a></div></section>`;
  }
  return `<section class="blk" id="feedback"><form class="fbc" id="fbf" novalidate>
   <fieldset class="fbtabs"><legend class="sr">What is this about?</legend>${Object.entries(FB).map(([k, v]) => `<label class="fbtab"><input type="radio" name="kind" value="${k}"${k === k0 ? ' checked' : ''}><span>${esc(v.tab)}</span></label>`).join('')}</fieldset>
   <p class="fb-d" id="fb-desc">${esc(FB[k0].d)}</p>
   <div class="fld" id="fb-msgw"><label for="fb-msg">Your message <span class="mute" id="fb-opt">${FB[k0].need ? '' : '(optional)'}</span></label><textarea id="fb-msg" placeholder="${esc(FB[k0].ph)}" aria-describedby="fb-merr"></textarea><span class="err" id="fb-merr" role="alert" hidden>Add a short message so we know what to look at.</span></div>
   <div class="fb-a"><button class="btn solid big" type="submit" id="fb-go">${esc(FB[k0].go)}</button><p class="fb-n">Your ${via} opens with the message ready. Nothing is sent until you send it. No account is needed, and this site stores nothing you type.</p></div></form></section>`;
}

function tourStrip() {
  return `<div class="tour2"><div class="t2-l"><h3>What is Islam?</h3><p>A seven-step tour, from the divine mission to today. Select any name or book to open its page.</p><a class="btn white big" href="${esc(pageHref('start-' + SL[0][0]))}">Begin the tour <span aria-hidden="true">→</span></a></div>
   <ol class="t2-r">${SL.map(([k, l]) => `<li><a href="${esc(pageHref('start-' + k))}">${esc(l)}</a></li>`).join('')}</ol></div>`;
}
function startHtml() {
  const sd = startData(), sn = sd.shelf.filter((r) => read[r.id]).length, pd = sd.all.filter((id) => read[id]).length;
  const J = [['st1', 'What is Islam?', `${SL.length}-stop tour`, 'ov-tour'], ['st2', 'Day-one shelf', `${sn} of ${sd.shelf.length} read`, 'ov-shelf'], ['st3', 'Your plan', `${pd} of ${sd.all.length} read`, 'ov-plan']];
  return `<nav aria-label="Your three steps"><ol class="jstrip">${J.map(([id, t, s, oid], i) => `<li><button class="jcard" type="button" data-jump="${id}"><span class="jn" aria-hidden="true">${i + 1}</span><span class="jt"><b>${esc(t)}</b><small id="${oid}">${esc(s)}</small></span></button></li>`).join('')}</ol></nav>
  <section class="blk" id="st1"><div class="stp"><h2><span class="sn">1</span>Begin with “What is Islam?”</h2><p>The big picture, one idea at a time.</p></div>${tourStrip()}</section>
  <section class="blk" id="st2"><div class="stp"><h2><span class="sn">2</span>Read the day-one shelf</h2><p>${sd.shelf.length} short introductions in a good order. Tick each one as you finish it.</p></div>${shelfHtml(sd)}</section>
  <section class="blk" id="st3"><div class="stp"><h2><span class="sn">3</span>Follow the plan</h2><p>A staged route from the basics to the source texts.</p></div>${planHtml(sd)}</section>`;
}

function homeHtml() {
  const sd = startData(), sn = sd.shelf.filter((r) => read[r.id]).length, pd = sd.all.filter((id) => read[id]).length;
  const starters = (qGroups().g['new-to-shia-islam'] || engine.questions).slice(0, 6);
  const tops = topHeadings().map((h) => ({ h, n: RECS.filter((r) => r.all.includes(h.id)).length })).filter((x) => x.n);
  const active = engine.sources.filter((s) => s.status === 'active'), counts = {};
  for (const r of engine.records) counts[r.source] = (counts[r.source] || 0) + 1;
  const started = sn || pd;
  return `<p class="hguide"><a href="${esc(pageHref('beginners'))}">New here? Follow the three-step guide <span aria-hidden="true">→</span></a></p>
  <section class="blk hq"><h2>Questions people start with</h2><p class="sub">Pick one to see the pages chosen for it.</p>
  <ul class="qlines">${starters.map((q) => qLine(q, '')).join('')}<li><a class="ql ql-go" href="${esc(pageHref('questions'))}"><span class="ql-t">See all ${engine.questions.length} questions</span><span class="ql-m"></span></a></li></ul></section>
  <section class="blk"><h2>Or be guided</h2><p class="sub">Three ways to learn in order.</p>
  <div class="g3"><a class="gcard" href="${esc(pageHref('beginners'))}"><small>${started ? 'Continue' : 'Step by step'}</small><h3>Start here</h3><p>The tour, a day-one shelf and a plan for the rest.</p><span class="gm">${started ? `${pd} of ${sd.all.length} pages read` : '3 steps'}</span></a>
   <a class="gcard" href="${esc(pageHref('start-' + (SL[0] || ['revelation'])[0]))}"><small>A short tour</small><h3>What is Islam?</h3><p>From the divine mission to today, one idea at a time.</p><span class="gm">${SL.length || 7} stops</span></a>
   <a class="gcard" href="${esc(pageHref('paths'))}"><small>Reading orders</small><h3>Learning paths</h3><p>Short paths on one subject, easiest first.</p><span class="gm">${pl(engine.paths.length, 'path')}</span></a></div></section>
  <section class="blk"><h2>Browse by topic</h2><p class="sub">Each subject has its own reading list.</p>
  <ul class="tt">${tops.map((x) => `<li><a class="ttl" href="${esc(topicHref(x.h.id))}"><span>${esc(TOPN(x.h.id))}</span><i>${x.n.toLocaleString()}</i></a></li>`).join('')}</ul>
  <p class="more-l"><a href="${esc(pageHref('topics'))}">See how the topics are laid out →</a></p></section>
  <section class="blk"><div class="inside"><div><h2>What is inside</h2><p>${engine.records.length.toLocaleString()} pages from ${active.length} approved websites. We link to them and never copy them.</p></div>
   <ul class="in-l">${active.map((s) => `<li><b dir="auto">${esc(srcName(s))}</b><span>${(counts[s.id] || 0).toLocaleString()} pages</span></li>`).join('')}</ul>
   <a class="btn line" href="${esc(pageHref('sources'))}">See the websites</a></div></section>
  <p class="quietfb">Missing something? <a href="${esc(pageHref('feedback'))}">Join the waitlist or send feedback</a>.</p>`;
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
  const fam = new Set([id, ...engine.headings.filter((x) => (x.ancestors || []).includes(id)).map((x) => x.id)]);
  const inFam = (r) => [...(r.headings || []), ...(r.inherited_headings || [])].some((x) => fam.has(x));
  const paths = engine.paths.map((p) => ({ p, n: p.steps.filter((s) => { const r = rec(s.record); return r && inFam(r); }).length })).filter((x) => x.n).sort((x, y) => y.n - x.n).slice(0, 3).map((x) => x.p);
  const qs = engine.questions.filter((q) => (q.headings || []).some((x) => fam.has(x))).slice(0, 6);
  const sec = (title, sub, body) => `<section class="tsec"><h2>${title}</h2>${sub ? `<p class="sub">${sub}</p>` : ''}${body}</section>`;
  return `${starters.length ? sec(starters.length === 1 ? 'Start with this' : 'Start with these', starters.length === 1 ? 'The one book or article on this topic.' : 'The easiest books and articles on this topic.', `<div class="minis">${starters.map((n) => miniHtml(n.raw)).join('')}</div>`) : ''}
  ${paths.length ? sec('Read in order', 'Short reading paths that include this topic.', `<div class="pgrid">${paths.map(pcardHtml).join('')}</div>`) : ''}
  ${qs.length ? sec('Questions people ask', 'Select one to see the pages chosen for it.', `<ul class="qrows">${qs.map((q) => qRow(q, '')).join('')}</ul>`) : ''}
  ${kids.length ? sec(`Inside ${esc(TOPN(id))}`, 'Narrower subjects.', `<ul class="subs">${kids.map((s) => `<li><a class="subt" href="${esc(topicHref(s.c))}"><span class="subt-n">${esc(TOPN(s.c))}</span><span class="subt-c">${pl(s.n, 'page')}</span></a></li>`).join('')}</ul>`) : ''}
  <section class="tsec" id="everything"><h2>Everything on this topic</h2><p class="sub">Choose a level. Within each level, books and articles come before individual pages.</p>
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
  const sameSub = (g) => { const subs = new Set(g.items.map((it) => (typeof it === 'string' ? (E[it] || {}).sub : it.sub))); return !g.lead && g.items.length >= 5 && subs.size === 1 && g.items.every((it) => typeof it === 'string'); };
  const body = s.groups.map((g) => `${g.label ? `<p class="gl">${esc(g.label)}${g.items.length > 3 ? ` <span>${g.items.length}</span>` : ''}</p>` : ''}${sameSub(g) ? `<div class="pills">${g.items.map((it) => `<a class="pl-l" style="--i:${Math.min(n++, 8)}" href="${esc(pageHref(it))}" dir="auto">${esc(E[it].name)}</a>`).join('')}</div>` : `<div class="dgrid ${g.lead ? 'lead' : ''}">${g.items.map((it) => tileHtml(it, n++)).join('')}</div>`}`).join('') + (s.note ? `<p class="note" style="margin:0">${esc(s.note)}</p>` : '');
  return `<div class="sh-pad sh-top"><a class="sh-x" href="${esc(BASE)}" aria-label="Exit What is Islam?"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13"/></svg>Exit</a>
   <div class="sh-prog" aria-hidden="true">${SL.map((_, j) => `<i class="${j < i ? 'd' : j === i ? 'c' : ''}"></i>`).join('')}</div><span class="sh-n">${i + 1} / ${SL.length}</span></div>
  <div class="sh-pad sh-main"><div class="sh-l"><h1 id="shh" tabindex="-1">${esc(s.title)}</h1><p class="l2">${esc(s.lede)}</p></div><div class="sh-r">${body}</div></div>
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
  else { const res = engine.search(strip(e.name)); rel = (res.exact.length ? firstRecords({ exact: res.exact, related: [] }) : firstRecords(res)).slice(0, 6); }
  const q = e.name.replace(/^The /, '').replace(/\s*\(.*\)/, '');
  const c = ctxFor(e.k), g = c.peers, i = g.indexOf(e.k), p = E[g[(i + g.length - 1) % g.length]], n = E[g[(i + 1) % g.length]];
  return `<div class="egrid"><div><div class="bio"><h3>Short bio <span class="pill">Placeholder</span></h3><p class="mute" style="margin:0">A short, sourced bio will go here once it has been written and reviewed.</p></div>
  <div style="margin-top:1rem"><a class="btn solid big" href="${esc(qHref(q))}" style="width:100%;justify-content:center">Search more for “${esc(q)}”</a></div></div>
  <section><h2 class="eh">${head} <span>${rel.length}</span></h2>${rel.length ? `<ul class="lrows" style="margin-top:.8rem">${rel.map((r) => rowHtml(r)).join('')}</ul>` : `<p class="mute">${empty}</p>`}</section></div>
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
function comboState() { input.setAttribute('aria-expanded', String($('#pal').matches(':focus-within'))); }
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
  if (t.name === 'kind') { const f = FB[t.value] || FB.feedback; ui.fbkind = t.value; $('#fb-go').textContent = f.go; $('#fb-opt').textContent = f.need ? '' : '(optional)'; $('#fb-msg').placeholder = f.ph; $('#fb-desc').textContent = f.d; $('#fb-merr').hidden = true; return; }
  if (t.dataset && t.dataset.read) {
    if (t.checked) read[t.dataset.read] = 1; else delete read[t.dataset.read]; saveRead();
    document.querySelectorAll(`[data-read="${CSS.escape(t.dataset.read)}"]`).forEach((x) => { x.checked = t.checked; const w = x.closest('li,.si'); if (w) { const d = w.classList.contains('si') ? w.children[1] : w; d.classList.toggle('done', t.checked); } });
    const sd = startData(), sdn = sd.shelf.filter((r) => read[r.id]).length; const sc = $('#shelfc'); if (sc) sc.textContent = `${sdn} of ${sd.shelf.length} read`; const shp = sd.shelf.length ? Math.round(sdn / sd.shelf.length * 100) : 0, sb = $('#shelfbar'); if (sb) { sb.style.width = shp + '%'; sb.parentElement.setAttribute('aria-valuenow', shp); } const ovs = $('#ov-shelf'); if (ovs) ovs.textContent = `${sdn} of ${sd.shelf.length} read`;
    const stepLi = t.closest('.stepper > li'); if (stepLi) stepLi.classList.toggle('done', t.checked);
    if ($('#pathc') && route.t === 'path') { const p = engine.pathById.get(route.st.path), ids = p ? p.steps.map((s) => s.record).filter((id) => rec(id)) : [], d = ids.filter((id) => read[id]).length, pc2 = ids.length ? Math.round(d / ids.length * 100) : 0; $('#pathc').textContent = `${d} of ${ids.length} read`; $('#pathbar').style.width = pc2 + '%'; $('#pathbar').parentElement.setAttribute('aria-valuenow', pc2); }
    const pd = sd.all.filter((id) => read[id]).length, pct = sd.all.length ? Math.round(pd / sd.all.length * 100) : 0;
    const pc = $('#planc'); if (pc) pc.textContent = `${pd} of ${sd.all.length} read`; const ovp = $('#ov-plan'); if (ovp) ovp.textContent = `${pd} of ${sd.all.length} read`; const pb = $('#planbar'); if (pb) { pb.style.width = pct + '%'; pb.parentElement.setAttribute('aria-valuenow', pct); }
  }
});
view.addEventListener('submit', (e) => {
  if (e.target.id === 'refine') { e.preventDefault(); const st = readState(); nav(searchHref({ ...blank(), q: $('#q2').value.trim(), order: st.order })); return; }
  if (e.target.id === 'qform') { e.preventDefault(); const v = ($('#qfilter').value || '').trim(); if (v) nav(qHref(v)); return; }
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

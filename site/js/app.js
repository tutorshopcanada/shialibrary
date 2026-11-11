// Page behaviour. All search decisions live in search.js; this file only draws.
// Every piece of catalog text is inserted with textContent, never as HTML.

import { createEngine } from './search.js';
import { createSuggester } from './suggest.js';
import { SITE, reportHref, externalSearchHref } from './config.js';

const $ = (id) => document.getElementById(id);
const view = $('view');
const statusEl = $('status');
const input = $('q');
const form = $('search-form');

let engine = null;
const PARAMS = ['q', 'tag', 'level', 'source', 'scholar', 'topic', 'section', 'order', 'path'];

// ---------------------------------------------------------------------------
// Small DOM helpers
// ---------------------------------------------------------------------------

/** Create an element. Text is always set as text, never parsed as HTML. */
function el(tag, attrs, ...children) {
  const node = document.createElement(tag);
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (v === null || v === undefined || v === false) continue;
      if (k === 'class') node.className = v;
      else if (k === 'text') node.textContent = v;
      else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v === true ? '' : v);
    }
  }
  for (const c of children.flat()) {
    if (c === null || c === undefined || c === false) continue;
    node.append(c.nodeType ? c : document.createTextNode(String(c)));
  }
  return node;
}

/** Only http(s) links are ever turned into clickable links. */
function safeUrl(url) {
  return typeof url === 'string' && /^https?:\/\//i.test(url) ? url : '';
}

function externalLink(url, attrs, ...children) {
  const href = safeUrl(url);
  if (!href) return el('span', attrs, ...children);
  return el('a', { ...attrs, href, target: '_blank', rel: 'noopener noreferrer' }, ...children);
}

function plural(n, one, many) { return `${n} ${n === 1 ? one : many}`; }

// ---------------------------------------------------------------------------
// URL state (shareable searches, working back button)
// ---------------------------------------------------------------------------

function readState() {
  const sp = new URLSearchParams(location.search);
  const s = {};
  for (const k of PARAMS) s[k] = (sp.get(k) || '').trim();
  return s;
}

function hrefFor(state) {
  const sp = new URLSearchParams();
  for (const k of PARAMS) if (state[k]) sp.set(k, state[k]);
  const qs = sp.toString();
  return qs ? `?${qs}` : location.pathname.replace(/[^/]*$/, '') || './';
}

function go(state, { replace = false, focusResults = false } = {}) {
  const url = hrefFor(state);
  if (replace) history.replaceState(null, '', url); else history.pushState(null, '', url);
  render();
  if (focusResults) {
    window.scrollTo({ top: 0 });
  }
}

/** Internal link that updates the page without a reload (still a real link). */
function navLink(state, attrs, ...children) {
  return el('a', {
    ...attrs,
    href: hrefFor(state),
    onclick: (ev) => {
      if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey || ev.button !== 0) return;
      ev.preventDefault();
      go(state, { focusResults: true });
    },
  }, ...children);
}

const blank = () => Object.fromEntries(PARAMS.map((k) => [k, '']));

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------

const tagLabel = (t) => engine.config.tags.labels[t] || t;
const levelLabel = (l) => engine.config.levels.labels[l] || l;
const scholarName = (id) => (engine.scholarById.get(id) || {}).name || id;
const sourceName = (id) => (engine.sourceById.get(id) || {}).name || id;
const headingLabel = (id) => (engine.headingById.get(id) || {}).label || id;

function draftMark() {
  return el('span', { class: 'draft-mark', title: 'Written as a draft. Not yet reviewed by the site owner or a scholar.' },
    'Draft, awaiting review');
}

function levelBadge(level) {
  const order = engine.config.levels.order;
  const n = Math.max(0, order.indexOf(level)) + 1;
  const dots = el('span', { class: 'level-dots', 'aria-hidden': 'true' });
  for (let i = 1; i <= order.length; i++) dots.append(el('span', { class: i <= n ? 'dot on' : 'dot' }));
  return el('span', { class: `badge level level-${level}` }, dots, levelLabel(level));
}

function tagBadge(tag) {
  return el('span', { class: `badge tag tag-${tag}` }, tagLabel(tag));
}

// ---------------------------------------------------------------------------
// Result card
// ---------------------------------------------------------------------------

function recordCard(record, { headingLevel = 'h3', compact = false, hideContextFor = '' } = {}) {
  const src = sourceName(record.source);
  const card = el('article', { class: compact ? 'card compact' : 'card' });

  card.append(el('div', { class: 'badges' }, tagBadge(record.content_tag), levelBadge(record.level)));

  card.append(el(headingLevel, { class: 'card-title' },
    externalLink(record.url, { dir: 'auto' }, record.title)));
  if (record.title_original) {
    card.append(el('p', { class: 'title-original', dir: 'auto', text: record.title_original }));
  }

  // Who wrote it, and where it is published.
  const meta = el('p', { class: 'meta' });
  const authors = (record.authors || []).map(scholarName);
  if (authors.length) meta.append(el('span', { dir: 'auto' }, 'By ', authors.join(', ')), el('span', { class: 'sep', 'aria-hidden': 'true' }, ' · '));
  meta.append(el('span', { class: 'source' }, 'Source: ', el('strong', { dir: 'auto', text: src })));
  if (record.location) meta.append(el('span', { class: 'sep', 'aria-hidden': 'true' }, ' · '), el('span', { dir: 'auto', text: record.location }));
  card.append(meta);
  if (record.marja) {
    card.append(el('p', { class: 'meta marja' }, 'Rulings of: ', el('span', { dir: 'auto', text: scholarName(record.marja) })));
  }

  if (record.description) card.append(el('p', { class: 'desc', dir: 'auto', text: record.description }));

  if (record.type === 'course') {
    const facts = [
      ['Offered by', record.provider], ['Taught by', (record.instructors || []).map(scholarName).join(', ')],
      ['Format', record.delivery], ['Length', record.duration], ['Starts', record.start_date], ['Cost', record.cost],
    ].filter(([, v]) => v);
    if (facts.length) {
      const dl = el('dl', { class: 'facts' });
      for (const [k, v] of facts) dl.append(el('div', null, el('dt', { text: k }), el('dd', { dir: 'auto', text: v })));
      card.append(dl);
    }
  }

  if (!compact) {
    const actions = el('p', { class: 'actions' });
    actions.append(externalLink(record.url, {
      class: 'open-link',
      'aria-label': `Open “${record.title}” on ${src} (opens in a new tab)`,
    }, `Open on ${src}`, el('span', { 'aria-hidden': 'true' }, ' ↗')));
    if (record.type === 'course' && safeUrl(record.enrollment_url) && record.enrollment_url !== record.url) {
      actions.append(externalLink(record.enrollment_url, { class: 'minor-link' }, 'Sign-up page ↗'));
    }
    card.append(actions);
  }

  // In context: step back to the chapter and the book.
  const ctx = record.context || {};
  const parts = [ctx.section, ctx.work].filter(Boolean);
  if (parts.length && !compact) {
    const line = el('p', { class: 'context' }, el('span', { class: 'context-label' }, 'In context: '));
    parts.forEach((p, i) => {
      if (i) line.append(el('span', { 'aria-hidden': 'true' }, ' · '));
      line.append(externalLink(p.url, { dir: 'auto', title: `Opens on ${src} in a new tab` }, p.title));
    });
    card.append(line);
    const sectionId = (ctx.section || ctx.work).id;
    if (sectionId !== hideContextFor) {
      card.append(el('p', { class: 'context' },
        navLink({ ...blank(), section: sectionId }, null,
          ctx.section ? 'More in this section' : 'More in this book')));
    }
  } else if (!compact && record.descendant_count && record.id !== hideContextFor) {
    card.append(el('p', { class: 'context' },
      navLink({ ...blank(), section: record.id }, null,
        `Browse the ${plural(record.descendant_count, 'entry', 'entries')} inside`)));
  }

  if (!compact) {
    const href = reportHref(record);
    card.append(el('p', { class: 'report' },
      href ? el('a', { href, rel: 'noopener noreferrer' }, 'Report a problem with this link')
        : el('a', { href: 'about.html#report' }, 'Report a problem with this link')));
  }
  return card;
}

/** Several items from one section, collapsed: best first, the rest behind a button. */
function clusterBlock(entry, uid) {
  const parent = entry.parent || {};
  const items = entry.items;
  const box = el('section', { class: 'cluster', 'aria-label': `Matches in ${parent.title || 'one section'}` });
  box.append(el('p', { class: 'cluster-head' },
    `${plural(items.length, 'match', 'matches')} in `,
    el('strong', { dir: 'auto', text: parent.title || 'the same section' })));
  box.append(recordCard(items[0].record));
  if (items.length > 1) {
    const restId = `cluster-rest-${uid}`;
    const rest = el('div', { id: restId, class: 'cluster-rest', hidden: true });
    const moreLabel = `Show ${items.length - 1} more from this section`;
    const btn = el('button', {
      type: 'button', class: 'expand', 'aria-expanded': 'false', 'aria-controls': restId,
      onclick: () => {
        const open = btn.getAttribute('aria-expanded') === 'true';
        if (!open && !rest.childElementCount) {
          for (const it of items.slice(1)) rest.append(recordCard(it.record));
        }
        rest.hidden = open;
        btn.setAttribute('aria-expanded', String(!open));
        btn.textContent = open ? moreLabel : 'Show fewer';
      },
    }, moreLabel);
    box.append(btn, rest);
  }
  return box;
}

let clusterSeq = 0;
function entryList(entries, opts) {
  const list = el('ol', { class: 'results' });
  for (const e of entries) {
    list.append(el('li', null, e.kind === 'cluster' ? clusterBlock(e, ++clusterSeq) : recordCard(e.record, opts)));
  }
  return list;
}

// ---------------------------------------------------------------------------
// Front-page pieces (also reused by the fallback)
// ---------------------------------------------------------------------------

function starterQuestions(limit = 10) {
  const qs = engine.questions;
  if (!qs.length) return null;
  const sec = el('section', { class: 'block', 'aria-labelledby': 'h-questions' });
  sec.append(el('h2', { id: 'h-questions' }, 'Not sure what to type? Start with a question'));
  if (qs.some((q) => q.draft)) {
    sec.append(el('p', { class: 'draft-note' }, draftMark(),
      ' These starter questions were drafted while building the catalog and have not been reviewed yet.'));
  }
  const list = el('ul', { class: 'question-list' });
  const add = (q) => list.append(el('li', null,
    navLink({ ...blank(), q: q.question }, { dir: 'auto' }, q.question),
    q.draft ? el('span', { class: 'draft-dot', title: 'Draft, awaiting review' }, 'Draft') : null));
  qs.slice(0, limit).forEach(add);
  sec.append(list);
  if (qs.length > limit) {
    const btn = el('button', { type: 'button', class: 'expand', onclick: () => { qs.slice(limit).forEach(add); btn.remove(); } },
      `Show all ${qs.length} questions`);
    sec.append(btn);
  }
  return sec;
}

function topicCounts() {
  const counts = new Map();
  for (const r of engine.records) {
    for (const h of new Set([...(r.headings || []), ...(r.inherited_headings || [])])) counts.set(h, (counts.get(h) || 0) + 1);
  }
  return counts;
}

function topicTiles() {
  const tops = engine.headings.filter((h) => !h.parent);
  if (!tops.length) return null;
  const counts = topicCounts();
  const sec = el('section', { class: 'block', 'aria-labelledby': 'h-topics' });
  sec.append(el('h2', { id: 'h-topics' }, 'Browse by topic'));
  if (engine.vocabularyDraft) {
    sec.append(el('p', { class: 'draft-note' }, draftMark(), ' This list of topics is a draft.'));
  }
  const grid = el('ul', { class: 'tiles' });
  for (const h of tops) {
    const n = counts.get(h.id) || 0;
    const kids = (h.children || []).map(headingLabel).slice(0, 3).join(', ');
    const inner = [
      el('span', { class: 'tile-title', dir: 'auto', text: h.label }),
      kids ? el('span', { class: 'tile-sub', dir: 'auto', text: kids + ((h.children || []).length > 3 ? ', …' : '') }) : null,
      el('span', { class: 'tile-count' }, n ? plural(n, 'resource', 'resources') : 'Nothing cataloged yet'),
    ];
    grid.append(el('li', null, n
      ? navLink({ ...blank(), topic: h.id }, { class: 'tile' }, ...inner)
      : el('div', { class: 'tile empty' }, ...inner)));
  }
  sec.append(grid);
  return sec;
}

function pathSteps(path, headingLevel = 'h3') {
  const wrap = el('div', { class: 'path' });
  const head = el(headingLevel, { class: 'path-title' }, el('span', { dir: 'auto', text: path.title }));
  if (path.draft) head.append(' ', draftMark());
  wrap.append(head);
  if (path.intro) wrap.append(el('p', { class: 'path-intro', dir: 'auto', text: path.intro }));
  const ol = el('ol', { class: 'steps' });
  for (const step of path.steps) {
    const rec = engine.recordById.get(step.record);
    if (!rec) continue;
    const li = el('li', { class: 'step' });
    if (step.why) li.append(el('p', { class: 'why', dir: 'auto', text: step.why }));
    li.append(recordCard(rec, { headingLevel: 'h4', compact: true }));
    ol.append(li);
  }
  wrap.append(ol);
  return wrap;
}

function startHerePaths() {
  if (!engine.paths.length) return null;
  const sec = el('section', { class: 'block', 'aria-labelledby': 'h-paths' });
  sec.append(el('h2', { id: 'h-paths' }, 'Start here: short reading paths'));
  sec.append(el('p', { class: 'muted' }, 'Each path is a few steps, from a simple introduction to more detailed material.'));
  engine.paths.forEach((p, i) => {
    const d = el('details', { class: 'path-box', open: i === 0 });
    const sum = el('summary', null, el('span', { class: 'path-summary', dir: 'auto', text: p.title }),
      el('span', { class: 'muted' }, ` · ${plural(p.steps.length, 'step', 'steps')}`));
    if (p.draft) sum.append(' ', draftMark());
    d.append(sum);
    const body = pathSteps(p, 'h3');
    body.querySelector('.path-title').classList.add('visually-hidden');
    d.append(body);
    sec.append(d);
  });
  return sec;
}

function renderHome() {
  document.body.classList.remove('has-results');
  view.replaceChildren();
  const parts = [starterQuestions(), topicTiles(), startHerePaths()].filter(Boolean);
  if (!engine.records.length) {
    view.append(el('p', { class: 'notice' }, 'The catalog is empty for now. Records will appear here as they are added.'));
  }
  view.append(...parts);
  statusEl.textContent = '';
}

// ---------------------------------------------------------------------------
// Results
// ---------------------------------------------------------------------------

function orderToggle(state, result) {
  const mk = (value, label, hint) => {
    const on = result.order === value;
    return el('button', {
      type: 'button', class: on ? 'seg on' : 'seg', 'aria-pressed': String(on), title: hint,
      onclick: () => go({ ...state, order: value === engine.config.ranking.default_order ? '' : value }),
    }, label);
  };
  return el('div', { class: 'order', role: 'group', 'aria-label': 'Which results come first' },
    mk('beginner', 'I’m new: simpler first', 'Beginner material is listed first'),
    mk('deeper', 'Show deeper material first', 'Advanced and detailed material is listed first'));
}

function tagChips(state, result) {
  const total = Object.values(result.counts.tags).reduce((a, b) => a + b, 0);
  const wrap = el('div', { class: 'chips', role: 'group', 'aria-label': 'Filter by type of content' });
  const chip = (tag, label, n) => {
    const on = (state.tag || '') === tag;
    return el('button', {
      type: 'button', class: `chip${on ? ' on' : ''}${tag ? ` chip-${tag}` : ''}`, 'aria-pressed': String(on),
      disabled: n === 0 && !on,
      onclick: () => go({ ...state, tag: on ? '' : tag }),
    }, label, el('span', { class: 'chip-count' }, ` ${n}`));
  };
  wrap.append(chip('', 'All', total));
  for (const t of engine.config.tags.order) {
    const n = result.counts.tags[t] || 0;
    if (n || state.tag === t) wrap.append(chip(t, tagLabel(t), n));
  }
  return wrap;
}

function select(id, label, value, options, onchange) {
  const sel = el('select', { id, onchange: (ev) => onchange(ev.target.value) });
  for (const [v, text] of options) sel.append(el('option', { value: v, selected: v === value, dir: 'auto' }, text));
  return el('div', { class: 'field' }, el('label', { for: id }, label), sel);
}

let facetCache = null;
function facets() {
  if (facetCache) return facetCache;
  const sources = new Set(), people = new Set();
  for (const r of engine.records) {
    sources.add(r.source);
    for (const id of [...(r.authors || []), ...(r.instructors || []), r.marja]) if (id) people.add(id);
  }
  const counts = topicCounts();
  const depth = (h) => (h.ancestors || []).length;
  const ordered = [];
  const walk = (h) => { if (counts.get(h.id)) ordered.push(h); (h.children || []).forEach((c) => walk(engine.headingById.get(c))); };
  engine.headings.filter((h) => !h.parent).forEach(walk);
  facetCache = {
    sources: engine.sources.filter((s) => sources.has(s.id)).map((s) => [s.id, s.name]),
    scholars: engine.scholars.filter((s) => people.has(s.id)).map((s) => [s.id, s.name])
      .sort((a, b) => a[1].localeCompare(b[1])),
    topics: ordered.map((h) => [h.id, `${'– '.repeat(depth(h))}${h.label}`]),
  };
  return facetCache;
}

function filterPanel(state) {
  const f = facets();
  const active = ['level', 'source', 'scholar', 'topic'].filter((k) => state[k]).length;
  const box = el('details', { class: 'filters', open: active > 0 });
  box.append(el('summary', null, active ? `More filters (${active} on)` : 'More filters'));
  const grid = el('div', { class: 'filter-grid' });
  const set = (key) => (v) => go({ ...state, [key]: v });
  grid.append(
    select('f-level', 'Level', state.level,
      [['', 'Any level'], ...engine.config.levels.order.map((l) => [l, levelLabel(l)])], set('level')),
    select('f-topic', 'Subject', state.topic, [['', 'Any subject'], ...f.topics], set('topic')),
    select('f-source', 'Source', state.source, [['', 'Any source'], ...f.sources], set('source')),
    select('f-scholar', 'Scholar or author', state.scholar, [['', 'Anyone'], ...f.scholars], set('scholar')),
  );
  box.append(grid);
  return box;
}

function activeFilters(state) {
  const items = [];
  if (state.topic) items.push(['topic', `Subject: ${headingLabel(state.topic)}`]);
  if (state.section) items.push(['section', `Inside: ${(engine.recordById.get(state.section) || {}).title || state.section}`]);
  if (state.level) items.push(['level', `Level: ${levelLabel(state.level)}`]);
  if (state.source) items.push(['source', `Source: ${sourceName(state.source)}`]);
  if (state.scholar) items.push(['scholar', `By: ${scholarName(state.scholar)}`]);
  if (state.tag) items.push(['tag', `Type: ${tagLabel(state.tag)}`]);
  if (!items.length) return null;
  const ul = el('ul', { class: 'active-filters', 'aria-label': 'Filters in use' });
  for (const [key, label] of items) {
    ul.append(el('li', null, el('button', {
      type: 'button', class: 'pill', 'aria-label': `Remove filter: ${label}`,
      onclick: () => go({ ...state, [key]: '' }),
    }, el('span', { dir: 'auto', text: label }), el('span', { 'aria-hidden': 'true' }, ' ×'))));
  }
  return ul;
}

function curatedBlock(result) {
  const c = result.curated;
  if (!c) return null;
  const box = el('section', { class: 'curated', 'aria-labelledby': 'h-curated' });
  if (c.question) {
    box.append(el('p', { class: 'eyebrow' }, 'A common question'));
    const h = el('h2', { id: 'h-curated' }, el('span', { dir: 'auto', text: c.question.question }));
    if (c.question.draft) h.append(' ', draftMark());
    box.append(h);
    if (!c.path) {
      box.append(el('p', { class: 'muted' }, 'The pages chosen for this question are listed first below.'));
    }
  } else if (c.heading) {
    box.append(el('p', { class: 'eyebrow' }, 'Topic'));
    const h = el('h2', { id: 'h-curated' }, el('span', { dir: 'auto', text: c.heading.label }));
    if (engine.vocabularyDraft) h.append(' ', draftMark());
    box.append(h);
    box.append(el('p', null, navLink({ ...blank(), topic: c.heading.id }, null, 'Browse everything on this topic')));
  }
  if (c.path) {
    box.append(el('p', { class: 'eyebrow' }, 'Start here'));
    box.append(pathSteps(c.path, 'h3'));
  }
  if (c.questions && c.questions.length) {
    box.append(el('p', { class: 'eyebrow' }, c.question ? 'Related questions' : 'Common questions on this topic'));
    const ul = el('ul', { class: 'question-list' });
    for (const q of c.questions) {
      ul.append(el('li', null, navLink({ ...blank(), q: q.question }, { dir: 'auto' }, q.question),
        q.draft ? el('span', { class: 'draft-dot', title: 'Draft, awaiting review' }, 'Draft') : null));
    }
    box.append(ul);
  }
  return box;
}

/** "Ask the source site" box: for questions the catalog does not cover. A plain outbound link. */
function externalSearchBlock(query) {
  const href = externalSearchHref(query);
  if (!href) return null;
  const name = SITE.externalSearch.name;
  const box = el('section', { class: 'external-search', 'aria-label': `Search ${name}` });
  box.append(el('h2', null, 'Have a question we don’t answer?'));
  box.append(el('p', null, 'We catalog books and articles, not individual questions and answers. ',
    `${name} has its own question-and-answer section and search, which may have your question.`));
  box.append(el('p', null, el('a', { class: 'button-link', href, target: '_blank', rel: 'noopener noreferrer' },
    `Search ${name} for “${String(query).trim()}” ↗`),
    SITE.externalSearch.askUrl ? el('span', null, ' ', el('a', { href: SITE.externalSearch.askUrl, target: '_blank', rel: 'noopener noreferrer' }, 'Or browse its questions ↗')) : null));
  box.append(el('p', { class: 'small' }, `This opens ${name} in a new tab and sends your search words to that site. We are not affiliated with it and do not control its results.`));
  return box;
}

function fallbackBlock(result) {
  const box = el('section', { class: 'fallback' });
  box.append(el('h2', null, 'We couldn’t find a close match'));
  if (result.emptyTopic) {
    box.append(el('p', null, 'We have a topic called ',
      el('strong', { dir: 'auto', text: result.emptyTopic.label }),
      ', but nothing has been cataloged for it yet.'));
  } else {
    box.append(el('p', null, 'Nothing in the catalog matches ',
      el('strong', { dir: 'auto', text: `“${result.query}”` }),
      ' closely enough to show. We would rather show nothing than a loose guess.'));
  }
  box.append(el('p', null, 'You could try a shorter search, a different spelling, or start from one of the topics or questions below.'));
  return box;
}

function renderPathPage(state) {
  const path = engine.pathById.get(state.path);
  document.body.classList.add('has-results');
  view.replaceChildren();
  if (!path) {
    view.append(el('p', { class: 'notice' }, 'That reading path does not exist. ', navLink(blank(), null, 'Back to the start')));
    statusEl.textContent = 'Reading path not found.';
    return;
  }
  view.append(el('p', { class: 'eyebrow' }, 'Start here'), pathSteps(path, 'h2'),
    el('p', null, navLink(blank(), null, '← All topics and questions')));
  statusEl.textContent = `Reading path: ${path.title}, ${plural(path.steps.length, 'step', 'steps')}.`;
}

function renderResults(state) {
  const result = engine.search(state.q, state);
  document.body.classList.add('has-results');
  view.replaceChildren();
  clusterSeq = 0;
  const browsing = result.mode === 'browse';
  const hasAnyFilter = ['tag', 'level', 'source', 'scholar', 'topic', 'section'].some((k) => state[k]);

  // Fallback (Layer 4): say so plainly, then offer ways forward.
  if (result.fallback) {
    statusEl.textContent = `No close match for “${result.query}”.`;
    view.append(fallbackBlock(result), ...[externalSearchBlock(result.query), topicTiles(), starterQuestions(8)].filter(Boolean));
    return;
  }

  const head = el('div', { class: 'results-head' });
  if (browsing) {
    const sectionRec = state.section && engine.recordById.get(state.section);
    const title = sectionRec ? sectionRec.title
      : state.topic ? headingLabel(state.topic)
        : state.scholar ? scholarName(state.scholar)
          : state.source ? sourceName(state.source) : 'Everything in the catalog';
    head.append(el('p', { class: 'eyebrow' }, sectionRec ? 'Browsing inside' : state.topic ? 'Browsing topic' : 'Browsing'));
    head.append(el('h2', { class: 'results-title', dir: 'auto', text: title }));
  } else {
    head.append(el('h2', { class: 'results-title' }, 'Results for ', el('span', { dir: 'auto', text: `“${result.query}”` })));
  }
  view.append(head);

  const curated = browsing ? null : curatedBlock(result);
  if (curated) view.append(curated);

  const controls = el('div', { class: 'controls' });
  controls.append(orderToggle(state, result), tagChips(state, result), filterPanel(state));
  const af = activeFilters(state);
  if (af) controls.append(af);
  view.append(controls);

  const n = result.counts.total;
  if (n === 0) {
    statusEl.textContent = 'No results with these filters.';
    view.append(el('div', { class: 'notice' },
      el('p', null, hasAnyFilter ? 'Nothing matches with these filters switched on.' : 'Nothing to show.'),
      hasAnyFilter ? el('p', null, el('button', {
        type: 'button', class: 'expand',
        onclick: () => go({ ...blank(), q: state.q, order: state.order }),
      }, 'Clear all filters')) : null));
    return;
  }

  if (browsing) {
    statusEl.textContent = `${plural(n, 'resource', 'resources')}.`;
    view.append(el('section', { 'aria-label': 'Resources' },
      entryList(result.exact, { hideContextFor: state.section })));
    return;
  }

  const ex = result.counts.exact, rel = result.counts.related;
  statusEl.textContent = ex
    ? `${plural(ex, 'exact match', 'exact matches')}${rel ? ` and ${plural(rel, 'related result', 'related results')}` : ''}.`
    : `No exact matches. ${plural(rel, 'related result', 'related results')}.`;

  const exactSec = el('section', { class: 'group', 'aria-labelledby': 'h-exact' });
  exactSec.append(el('h2', { id: 'h-exact', class: 'group-title' }, 'Exact matches ', el('span', { class: 'count' }, `(${ex})`)));
  if (ex) {
    exactSec.append(el('p', { class: 'group-note' }, 'Your words (or a matching topic) appear in the title or in the questions this page helps answer.'));
    exactSec.append(entryList(result.exact));
  } else {
    exactSec.append(el('p', { class: 'honest' }, 'No exact matches. Here are related results.'));
  }
  view.append(exactSec);

  if (rel) {
    const relSec = el('section', { class: 'group', 'aria-labelledby': 'h-related' });
    relSec.append(el('h2', { id: 'h-related', class: 'group-title' }, 'Related results ', el('span', { class: 'count' }, `(${rel})`)));
    relSec.append(el('p', { class: 'group-note' }, 'These share some of your words or the same topic. They may or may not be what you are looking for.'));
    relSec.append(entryList(result.related));
    view.append(relSec);
  }
  const ext = externalSearchBlock(result.query);
  if (ext) view.append(ext);
}

function render() {
  if (!engine) return;
  const state = readState();
  if (document.activeElement !== input || input.value.trim() !== state.q) input.value = state.q;
  document.title = state.q ? `${state.q} · ${SITE.name}` : SITE.name;
  if (state.path) return renderPathPage(state);
  const hasFilter = ['tag', 'level', 'source', 'scholar', 'topic', 'section'].some((k) => state[k]);
  if (!state.q && !hasFilter) return renderHome();
  renderResults(state);
}

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------


// ---------------------------------------------------------------------------
// Type-ahead suggestions (ARIA 1.2 combobox). Suggestions come from suggest.js,
// which only looks at the already-loaded catalog. Nothing typed is sent or stored.
// ---------------------------------------------------------------------------

const KIND_LABEL = { question: 'Question', topic: 'Topic', scholar: 'Scholar', title: 'Book or article' };
const sgBox = $('suggest-box');
const sgList = $('suggest-list');
const sgLabel = $('suggest-label');
const sgLive = $('suggest-live');
let suggester = null;
let sgItems = [];
let sgActive = -1;

function sgClose() {
  sgItems = [];
  sgActive = -1;
  sgList.replaceChildren();
  sgBox.hidden = true;
  sgLabel.hidden = true;
  input.setAttribute('aria-expanded', 'false');
  input.removeAttribute('aria-activedescendant');
}

function sgSetActive(i) {
  const prev = sgList.children[sgActive];
  if (prev) prev.setAttribute('aria-selected', 'false');
  sgActive = i;
  const cur = sgList.children[i];
  if (cur) {
    cur.setAttribute('aria-selected', 'true');
    input.setAttribute('aria-activedescendant', cur.id);
    cur.scrollIntoView({ block: 'nearest' });
  } else {
    input.removeAttribute('aria-activedescendant');
  }
}

function sgText(text, ranges) {
  const span = el('span', { class: 'sg-text', dir: 'auto' });
  let pos = 0;
  for (const [a, b] of ranges || []) {
    if (a < pos) continue;
    if (a > pos) span.append(document.createTextNode(text.slice(pos, a)));
    span.append(el('b', { text: text.slice(a, b) }));
    pos = b;
  }
  if (pos < text.length) span.append(document.createTextNode(text.slice(pos)));
  return span;
}

function sgPick(item) {
  sgClose();
  const prev = readState();
  if (item.target.topic) {
    // Same as the topic tiles on the home page.
    input.value = '';
    go({ ...blank(), topic: item.target.topic, order: prev.order }, { focusResults: true });
  } else {
    input.value = item.target.query;
    go({ ...blank(), q: item.target.query, order: prev.order }, { focusResults: true });
  }
  if (window.matchMedia && matchMedia('(pointer: coarse)').matches) input.blur();
}

function sgUpdate() {
  if (!suggester) return sgClose();
  const typed = input.value.trim();
  const starting = !typed;
  const items = starting ? suggester.starters(5) : suggester.suggest(typed, 8);
  if (!items.length || document.activeElement !== input) return sgClose();
  const same = items.length === sgItems.length && items.every((it, i) => it.text === sgItems[i].text && it.kind === sgItems[i].kind);
  sgItems = items;
  if (!same) {
    sgList.replaceChildren(...items.map((it, i) => el('li', {
      id: `sg-${i}`, role: 'option', 'aria-selected': 'false', class: `sg-option sg-${it.kind}`,
      // Keep focus in the input so the click below still registers.
      onmousedown: (ev) => ev.preventDefault(),
      onpointerdown: (ev) => { if (ev.pointerType === 'mouse') ev.preventDefault(); },
      onclick: () => sgPick(it),
    }, sgText(it.text, it.ranges), el('span', { class: 'sg-kind', text: KIND_LABEL[it.kind] || '' }))));
    sgActive = -1;
    input.removeAttribute('aria-activedescendant');
    sgLive.textContent = `${items.length} ${items.length === 1 ? 'suggestion' : 'suggestions'}`;
  }
  sgLabel.hidden = !starting;
  sgBox.hidden = false;
  input.setAttribute('aria-expanded', 'true');
}

input.addEventListener('input', sgUpdate);
input.addEventListener('focus', sgUpdate);
input.addEventListener('blur', sgClose);
input.addEventListener('keydown', (ev) => {
  const open = !sgBox.hidden;
  if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
    if (!open) { sgUpdate(); if (sgBox.hidden) return; }
    ev.preventDefault();
    const n = sgItems.length;
    sgSetActive(ev.key === 'ArrowDown' ? (sgActive + 1) % n : (sgActive <= 0 ? n - 1 : sgActive - 1));
  } else if (ev.key === 'Enter' && open && sgActive >= 0) {
    ev.preventDefault();
    sgPick(sgItems[sgActive]);
  } else if (ev.key === 'Escape' && open) {
    ev.preventDefault();
    sgClose();
  } else if (ev.key === 'Tab') {
    sgClose();
  }
});

form.addEventListener('submit', (ev) => {
  ev.preventDefault();
  sgClose();
  const q = input.value.trim();
  const prev = readState();
  // A new search keeps the reading order but drops old filters.
  go({ ...blank(), q, order: prev.order });
});
window.addEventListener('popstate', () => { sgClose(); render(); });

for (const node of document.querySelectorAll('[data-site-name]')) node.textContent = SITE.name;

async function start() {
  try {
    const res = await fetch('data/index.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const index = await res.json();
    engine = createEngine(index);
    suggester = createSuggester(index);
    if (engine.buildDate) $('build-date').textContent = `· Catalog updated ${engine.buildDate}`;
    render();
  } catch (err) {
    view.replaceChildren(el('p', { class: 'notice' },
      'The catalog could not be loaded. Please check your connection and reload the page.'));
    statusEl.textContent = 'The catalog could not be loaded.';
    console.error(err);
  }
}
start();

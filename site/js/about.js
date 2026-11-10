// Fills the About page from index.json and config.js. Text is set with
// textContent only.

import { SITE, reportConfigured, reportHref } from './config.js';

const $ = (id) => document.getElementById(id);
const make = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
};
const safeUrl = (u) => (typeof u === 'string' && /^https?:\/\//i.test(u) ? u : '');

for (const node of document.querySelectorAll('[data-site-name]')) node.textContent = SITE.name;
document.title = `About and scope · ${SITE.name}`;

// Report link (no backend: email app or a pre-filled GitHub issue).
const slot = $('report-slot');
if (reportConfigured()) {
  const a = make('a', 'open-link', SITE.report.kind === 'github' ? 'Report a problem (opens GitHub)' : 'Report a problem by email');
  a.href = reportHref(null);
  a.rel = 'noopener noreferrer';
  slot.replaceChildren(a);
}

// Link to the published scope document, if the owner has set one.
if (safeUrl(SITE.scopeUrl)) {
  const p = $('scope-link');
  const a = make('a', '', 'Read the full scope and inclusion criteria');
  a.href = SITE.scopeUrl;
  a.rel = 'noopener noreferrer';
  p.replaceChildren(a, document.createTextNode('.'));
}

const STATUS_TEXT = {
  active: 'In the catalog',
  backlog: 'Approved, not added yet',
  blocked: 'Approved, waiting for access',
};

async function loadSources() {
  const list = $('source-list');
  try {
    const res = await fetch('data/index.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const index = await res.json();
    const counts = new Map();
    for (const r of index.records || []) counts.set(r.source, (counts.get(r.source) || 0) + 1);
    list.replaceChildren();
    for (const s of index.sources || []) {
      const li = make('li');
      const head = make('div');
      const url = safeUrl(s.base_url);
      let name;
      if (url) {
        name = make('a', 'name', s.name);
        name.href = url; name.target = '_blank'; name.rel = 'noopener noreferrer';
      } else {
        name = make('span', 'name', s.name);
      }
      name.dir = 'auto';
      head.append(name, make('span', `state state-${s.status}`, STATUS_TEXT[s.status] || s.status));
      li.append(head);
      const n = counts.get(s.id) || 0;
      const bits = [];
      if (n) bits.push(`${n} ${n === 1 ? 'entry' : 'entries'} so far`);
      if (s.catalog_level) bits.push(s.catalog_level);
      if (bits.length) li.append(make('div', 'muted', bits.join(' · ')));
      list.append(li);
    }
    if (!list.childElementCount) list.append(make('li', '', 'No sources are listed yet.'));
    if (index.build_date) $('build-date').textContent = `Catalog last updated ${index.build_date}.`;
  } catch (err) {
    list.replaceChildren(make('li', '', 'The list of sources could not be loaded. Please reload the page.'));
    console.error(err);
  }
}
loadSources();

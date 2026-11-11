// Site-wide settings the owner may want to change. No build step: edit and reload.

export const SITE = {
  // Shown in the header and page titles.
  // TODO(owner): choose the public name of the tool.
  name: 'Shia Resource Finder',

  // "Report a wrong or broken link". Needs no server: it opens the visitor's
  // email app or a pre-filled GitHub issue.
  //
  // TODO(owner): set ONE of these, then delete the other.
  //   kind: 'mailto', target: 'someone@example.org'
  //   kind: 'github', target: 'https://github.com/OWNER/REPO'   (issues must be enabled)
  //
  // While the target still contains "TODO", the site shows "reporting is not
  // set up yet" instead of a link that goes nowhere.
  report: {
    kind: 'mailto',
    target: 'TODO-OWNER-EMAIL@example.org',
  },

  // For questions we have no catalog entry for, send people to the source site's own
  // search. This is a plain link the visitor chooses to click; the site's search words are
  // sent to that site only then. (Its robots.txt only restricts crawlers, not visitors.)
  // The address pattern was read from the site's own indexed search pages on 2026-11-10.
  externalSearch: {
    name: 'Al-Islam.org',
    url: 'https://al-islam.org/search/site/',
    askUrl: 'https://al-islam.org/ask',
  },

  // Where the full scope document is published (docs/scope.md in the repository).
  // TODO(owner): set to the public URL of docs/scope.md once the repository is public.
  scopeUrl: '',
};

/** True once the owner has replaced the placeholder above. */
export function reportConfigured() {
  const t = SITE.report && SITE.report.target;
  return !!t && !/TODO/i.test(t);
}

/**
 * Link for reporting a problem, optionally about one record.
 * Returns '' when reporting is not set up.
 */
export function reportHref(record) {
  if (!reportConfigured()) return '';
  const subject = record ? `Link problem: ${record.id}` : 'Problem with a link';
  const body = record
    ? `Record: ${record.id}\nTitle: ${record.title}\nLink: ${record.url}\n\nWhat is wrong (broken link, wrong page, wrong description, other):\n`
    : 'Which result, and what is wrong (broken link, wrong page, wrong description, other):\n';
  if (SITE.report.kind === 'github') {
    const base = SITE.report.target.replace(/\/+$/, '');
    return `${base}/issues/new?title=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
  return `mailto:${SITE.report.target}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** Link to the source site's own search for a query, or '' if the query is empty. */
export function externalSearchHref(query) {
  const q = String(query || '').trim().replace(/\s+/g, ' ');
  if (!q || !SITE.externalSearch) return '';
  return SITE.externalSearch.url + encodeURIComponent(q);
}

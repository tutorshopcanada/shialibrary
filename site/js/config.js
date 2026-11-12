// Site-wide settings the owner may want to change. No build step: edit and reload.

export const SITE = {
  // Shown in the header and page titles.
  name: 'ShiaLib',

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

  // Outside AI tool offered only when the catalog has no close match (owner decision 2026-11-12:
  // free to use, and "redirect what we don't have"). Not a catalog source. The link carries no
  // search words because its address pattern for queries is not known. We do not run it or vouch for it.
  aiTool: {
    name: 'hyder.ai',
    url: 'https://hyder.ai',
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

/**
 * Link for general feedback or a waitlist request. Same no-server approach as reportHref:
 * the visitor's email app, or a pre-filled GitHub issue. Returns '' when not set up.
 * @param {'waitlist'|'feedback'|'link'} kind
 * @param {string} message  what the visitor typed (may be empty)
 */
export function feedbackHref(kind, message) {
  if (!reportConfigured()) return '';
  const subject = { waitlist: `${SITE.name}: add me to the waitlist`, feedback: `${SITE.name}: feedback`, link: `${SITE.name}: link problem`, source: `${SITE.name}: website suggestion` }[kind] || `${SITE.name}: feedback`;
  const body = String(message || '').trim() || (kind === 'waitlist' ? 'Please add me to the waitlist.' : '');
  if (SITE.report.kind === 'github') {
    const base = SITE.report.target.replace(/\/+$/, '');
    return `${base}/issues/new?title=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
  return `mailto:${SITE.report.target}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * "Start here" curation. Owner-editable. Every id must be a record in the catalog; missing ids are
 * skipped (and logged in the browser console) so a rename never breaks the page.
 * Wording on the page that comes from these lists is a draft until the owner reviews it.
 */
export const START = {
  // Step 2 of "Start here": the introductions, in reading order.
  shelf: [
    'al-islam-brief-introduction-to-islam',
    'al-islam-discovering-islam',
    'al-islam-discovering-shii-islam',
    'al-islam-prophet-muhammad-brief-biography',
    'al-islam-holy-quran-some-basic-facts',
    'al-islam-imamate-and-the-imams',
    'al-islam-nahjul-balagah-revisited-imam-ali',
  ],
  // Step 3: the plan. `ids: 'shelf'` means "the introductions".
  stages: [
    { title: 'Foundations', note: 'Start with the introductions above.', ids: 'shelf' },
    { title: 'Beliefs and the Imams in depth', note: 'The same ideas, one level deeper.', ids: [
      'al-islam-islamic-teachings-in-brief', 'al-islam-basic-teachings-of-islam', 'al-islam-lets-learn-about-divine-justice',
      'al-islam-brief-history-fourteen-infallibles', 'al-islam-imamate-wilayah-part-1'] },
    { title: 'Living it: prayer', note: 'How prayer works, then the detailed rulings.', ids: [
      'sistani-west-salat-introduction', 'sistani-west-salat-general-rules', 'sistani-qa-congregational-prayers'] },
    { title: 'Remembrance: Karbala and Ashura', note: 'The events, their message, then the narrations.', ids: [
      'al-islam-tears-for-karbala', 'al-islam-karbala-chain-of-events', 'al-islam-from-resolution-to-revolution', 'thaqalayn-kamil-al-ziyarat'] },
    { title: 'The source texts', note: 'Primary collections, for when you are ready.', ids: [
      'al-islam-preface-nahjul-balaghah', 'thaqalayn-nahj-al-balagha', 'thaqalayn-al-kafi-vol-1'] },
  ],
};

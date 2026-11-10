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

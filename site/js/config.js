// Site-wide settings the owner may want to change. No build step: edit and reload.

export const SITE = {
  // Shown in the header and page titles.
  name: 'ShiaLib',

  // "Report a problem" and "Send feedback" both open a Google Form in a new tab. No server and no
  // email address on the page. Setup (owner):
  //   1. Create a Google Form with a long-answer question for the message, and optionally a short-answer
  //      question for the report type.
  //   2. Copy its link ending in /viewform and set `target` below.
  //   3. Optional: to pre-fill the message, open the form, click ⋮ > "Get pre-filled link", type anything
  //      in each box, click "Get link", and read the entry.NNNNN names from the URL. Put them in `fields`.
  // If `target` is blank or still contains "TODO", the site shows "reporting is not set up yet".
  report: {
    kind: 'form',
    target: 'https://docs.google.com/forms/d/e/1FAIpQLSd_w-XsFp9zWK4H7BQAS7B3Vc0TR8ygHaBrI-0NHkjbzcTnng/viewform',
    fields: {
      subject: '',   // e.g. 'entry.1111111111': receives the report type ("Link problem", ...)
      message: '',   // e.g. 'entry.2222222222': receives the full message (record id, title, link, words typed)
    },
  },

  // For questions we have no catalog entry for, link to the source site's own question page.
  // No search words are sent. (The site's own search is not linked: Cloudflare can block visitors.)
  externalSearch: {
    name: 'Al-Islam.org',
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
  return !!t && !/TODO/i.test(t) && /^https:\/\//.test(t.trim());
}

/** What a report can be about. `label` is the choice the visitor sees; `title` and `ask` go into the message. */
export const REPORT_KINDS = {
  mismatch: { title: 'Search mismatch', label: null, ask: 'What were you looking for? (optional)' },
  link: { title: 'Link problem', label: 'The link is broken or opens the wrong page', ask: 'What is wrong (broken link, wrong page, other)?' },
  info: { title: 'Wrong description or level', label: 'The description or level is wrong', ask: 'What is wrong with the description or level?' },
};

/** Google Form URL with any configured pre-fill fields added. Returns '' when reporting is not set up. */
function formHref(subject, body) {
  if (!reportConfigured()) return '';
  const base = SITE.report.target.trim();
  const f = SITE.report.fields || {};
  const p = new URLSearchParams();
  if (f.subject) p.set(f.subject, subject);
  if (f.message) p.set(f.message, body);
  const qs = p.toString();
  return qs ? `${base}${base.includes('?') ? '&' : '?'}${qs}` : base;
}

/**
 * Link for reporting a problem, optionally about one record. Returns '' when reporting is not set up.
 * @param {object|null} record  the result being reported
 * @param {'link'|'info'|'mismatch'} [kind]
 * @param {{q?: string, topic?: string}} [ctx]  for 'mismatch': what the visitor searched for. These words are
 *   only ever put in the form the visitor chooses to send; nothing is sent from the page itself.
 */
export function reportHref(record, kind = 'link', ctx = {}) {
  if (!reportConfigured()) return '';
  const k = REPORT_KINDS[kind] || REPORT_KINDS.link;
  const q = String(ctx.q || '').trim().slice(0, 200), topic = String(ctx.topic || '').trim().slice(0, 120);
  let subject, body;
  if (!record) {
    subject = 'Problem with a link';
    body = 'Which result, and what is wrong (broken link, wrong page, wrong description, other):\n';
  } else if (kind === 'mismatch') {
    subject = q ? `Search mismatch: "${q}" -> ${record.id}` : `Topic mismatch: ${topic} -> ${record.id}`;
    body = [
      q ? 'This result does not match my search.' : 'This result does not belong in this topic.',
      '',
      q ? `Search words: ${q}` : `Topic: ${topic}`,
      `Record: ${record.id}`,
      `Title: ${record.title}`,
      `Link: ${record.url}`,
      '',
      k.ask,
      '',
    ].join('\n');
  } else {
    subject = `${k.title}: ${record.id}`;
    body = `Record: ${record.id}\nTitle: ${record.title}\nLink: ${record.url}\n\n${k.ask}\n`;
  }
  return formHref(subject, body);
}

/**
 * Link for general feedback: the same Google Form. Returns '' when reporting is not set up.
 * @param {'feedback'|'link'|'source'} kind
 * @param {string} message  what the visitor typed (may be empty)
 */
export function feedbackHref(kind, message) {
  if (!reportConfigured()) return '';
  const subject = { feedback: `${SITE.name}: feedback`, link: `${SITE.name}: link problem`, source: `${SITE.name}: website suggestion` }[kind] || `${SITE.name}: feedback`;
  return formHref(subject, String(message || '').trim());
}
/**
 * The questions shown when the empty search box is clicked, and as "Common questions" on the home page, in this order.
 * Each id is a question in data/questions.yaml (all of those are still drafts awaiting review). Chosen as the things
 * newcomers and everyday Muslims most often ask: what Shia Islam is, how it differs from Sunni Islam, how to start,
 * how Shias pray and why they mourn, who the Imams are, khums, Ramadan fasting. Missing ids are skipped.
 */
export const SUGGESTED = [
  'q-what-is-shia-islam',
  'q-how-to-become-muslim',
  'q-shia-sunni-difference',
  'q-how-do-shias-pray',
  'q-why-mourn-husayn',
  'q-who-are-the-twelve-imams',
  'q-what-is-khums',
  'q-fasting-ramadan',
];

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

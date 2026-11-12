# almizan.org: how the English Tafsir al-Mizan site is organized

Inspected 2026-11-12. Source id `almizan.org`. Work stopped after 24 HTTP requests (robots.txt x2, sitemap, 20 pages, copyright page), with 2 s between requests. No records were written. See "Terms of use" first: it decides whether cataloging can go ahead.

## Terms of use (owner decision needed before any further fetching)

The site's copyright page (`/copyright/`, read 2026-11-12) says:

- The English translation of the commentary, with its notes, editing and arrangement, is copyright Tawheed Institute Australia Ltd.
- Without prior written permission, users may not **"copy, download or extract the commentary in whole or in substantial part, by hand or by automated means (scraping, crawling or bulk downloading)"**, and may not **"use it to build or train software, databases or artificial-intelligence models."**
- Short quotations are allowed for study, teaching, research, review or a sermon, with the source named and a link to almizan.org.

robots.txt has no Disallow rules and no content-signal lines that restrict crawling. The copyright page is the binding restriction. CLAUDE.md section 10 says that if a site disallows automated access, stop and tell the owner. The brief's "curl is allowed" covers robots.txt and rate limits only. It does not cover a site's own terms. This site's terms restrict automated access and building a database, and a catalog of its pages is a database.

**Decision for the owner:** either (a) ask Tawheed Institute Australia for written permission (their contact form is linked from the copyright page) for a catalog of work, section and chapter-level records with links, or (b) limit the catalog to what a person can read without automated crawling (e.g., the owner or a human reviewer checks pages by hand and writes records). Until then, no further fetching and no records.

Not used: the commentary text itself. Saved page copies were deleted from the scratch folder after reading; only the sitemap URL list remains there.

## Site structure

- Single-page-app style site (SSR HTML with a sidebar); the readable text is in the HTML. Page `<title>` and meta description are present on each page.
- The site states that it publishes the **full English commentary** free online, verse by verse (home page: "the full Qur'an commentary"; chapter pages state "Printed edition: Volume 1, pp. 34–44" and similar). Verse ranges are listed for all 114 chapters (the "Chapters" page).
- Qur'an text on the site is from the Tanzil Project; translation of the Qur'an credited to Ali Quli Qarai. This is a separate translation from the commentary, and the record should not credit it as the commentary's translator. The commentary's English translator is not named on the pages read so far. Check the Preface or Publisher's Note before writing the work record.
- Commentator: "ʿAllāmah Muḥammad Ḥusayn al-Ṭabāṭabāʾī" (1904–1981), "By Allamah Muhammad Hussain al-Tabatabai" on the home page. Existing scholar id: `tabatabai` in data/scholars.yaml (needs_review: true). Spellings seen on this site to add to that entry (owner or reviewer to approve; not edited here): Allamah Muhammad Hussain al-Tabatabai; ʿAllāmah Ṭabāṭabāʾī; ʿAllāmah Muḥammad Ḥusayn al-Ṭabāṭabāʾī; al-Sayyid Muḥammad Ḥusayn al-Ṭabāṭabāʾī.

## Sections and counts (from sitemap.xml, 1028 URLs)

| Section | URL pattern | Count in sitemap | Notes |
|---|---|---|---|
| Home | `/` | 1 | Latest updates; links to the main tools |
| Chapters (index) | `/chapters/` | 1 | Lists all 114 surahs with verse counts |
| Chapter landing | `/chapter-N-slug/` | not in sitemap; 1 checked | Checked only `/chapter-2-al-baqarah/` (200): chapter title, printed volume and pages, then "Circumstances of Revelation", "Theme of the Sūrah" and verse groups. The other 113 landing pages are not yet checked; the slug may differ from the sitemap (e.g. `chapter-99-al-zilzal` in links vs `al-zalzalah` in the Themes list) |
| Verse groups (item level) | `/chapter-N-slug/verses-A-B` | 561 | Commentary text per verse group; the site has a "Verse map" and a "Cited" feature per verse. Item level: NOT for the pilot |
| Circumstances of revelation | `/chapter-N-slug/circumstances-of-revelation` | 114 | Per surah |
| Qur'anic Themes | `/themes/` and `/themes/chapter-N-slug` | 114 + 1 | Short English summary of each surah's aim; links to the commentary |
| Verse Map | `/verse-map/` | 1 | Interactive tool; the page is a tool, no text to catalog |
| Concept Maps | `/concept-maps/` and 9 concept pages | 10 | Mind maps of nine concepts (tawḥīd, wilāyah, shafāʿah, ʿiṣmah, soul and fiṭrah, covenant, prophethood, immutability, muḥkam and mutashābih) |
| Qur'anic Parables | `/parables/` | 1 | Index of parables grouped by theme |
| Striking Quotations | `/quotations/` and 6 topic pages | 7 | Quotations grouped by topic |
| Topic index | `/topics/` | 1 | Subjects with passages from the commentary |
| Who's who | `/people/` | 1 | Names of prophets, figures, exegetes |
| Glossary | `/glossary/` and 19 letter pages | 21 | Terms explained from their root |
| Key Debates | `/debates/` and debate pages | 44 | One page per verse debate (e.g. 2:26 Compulsion and Delegation) |
| Glimpses of al-Mizan | `/glimpses/` and topic pages | 81 | Short essays/discourse summaries |
| In ʿAllāmah's Presence | `/presence/` and 12 chapter pages | 13 | Chapter-based pages on the author's views and discussions |
| Preface | `/preface/`: about-the-author, preface-by-the-author, publishers-note, transliteration-key | 4 | Front matter |
| Meccan and Medinan sūrahs | `/revelation/meccan-and-medinan` | 1 | Grouping by place of revelation, with reasons |
| Flow of the Qur'an | `/flow-of-the-quran/` | 1 | Explains the principle of jary and where it is used |
| Narrations / Discourses / Abrogation index | `/narrations/`, `/discourses/`, `/abrogation/` | 3 | Indexes |
| Reading plans | `/plans/` | 1 | Interactive (sign-in for progress); the content is not in the static HTML |
| Why Read | `/why-read-al-mizan` | 1 | Newcomer guide to the commentary |
| Tafsir Compare, Search, Verse finder | `/tafsir-compare/`, `/search/`, `/verse/` | 3 | Tools |

Skip (not catalog targets): `/app/`, `/my-study/`, `/my-study/shared` (personal and sign-in pages), `/contact/`, `/updates/`, `/copyright/` (terms, read only).

## What the pilot would look like (if the owner allows it)

- Work record: `almizan-tafsir-al-mizan`, type book, content_tag book, url `https://almizan.org/`, authors `[tabatabai]`, headings `tafsir` (plus `quran` if that fits). Granularity work.
- Reader-guide records (granularity section, parent the work): Why Read, Flow of the Qur'an, Meccan and Medinan, Parables, Key Debates, Concept Maps, Qur'anic Themes, Glossary, Topic index, Verse Map. Type `other`, content_tag `other`.
- Chapter-landing records (granularity section, parent the work): one per surah, pilot Al-Fatiha (1), Al-Baqarah (2), and a few more. Type book, content_tag book. Heading `tafsir` and the surah's topic heading if one fits.
- Item-level verse-group records are out of scope for the pilot. The verse groups are the commentary itself. Any item record needs the owner's decision.

## Points for the owner

1. Terms of use (above): permission or a manual approach before any cataloging.
2. Copyright warning on unauthorized PDFs: the site says circulating PDFs contain errors. Records should link only to almizan.org and must not cite those PDFs.
3. Translator of the commentary: not yet identified on the pages read.
4. Scholar entry `tabatabai`: approve the spellings above.
5. Scope: 114 chapters and about 560 verse groups. Confirm whether the site's topic and debate pages (about 44 debates, 81 glimpses) are wanted as separate records.

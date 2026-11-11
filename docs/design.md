# Site design (ShiaLib)

How the static site in `site/` is put together, and where to change things. No build step: edit and reload.

## Files

| File | What |
|---|---|
| `site/index.html` | Page shell: nav strip, hero search, page area, footer, the full-screen tour |
| `site/css/style.css` | All styling. Colours and radii are tokens at the top (`:root`), with a dark theme |
| `site/js/app.js` | Drawing and routing only. Every search decision lives in `site/js/search.js` |
| `site/js/search.js` | The search engine, shared with `scripts/eval_search.mjs` (untouched by the redesign) |
| `site/js/config.js` | Site name, report/feedback target, external search, and the "Start here" lists |
| `site/js/tour.js` | Content of the "What is Islam?" tour (all draft placeholders, see below) |
| `site/fonts/` | Inter and Instrument Serif, self-hosted so no request leaves the site for fonts |
| `site/about.html` | Redirects to `./#about` (the About page now lives inside the app) |

## Links (every state has a real URL)

- Searches and browsing: `?q=…&tag=…&level=…&source=…&scholar=…&topic=…&section=…&order=…`
- One learning path: `?path=<id>`
- Pages: `#beginners` (Start here), `#questions`, `#topics`, `#paths`, `#sources`, `#guide`, `#about`, `#feedback`
- The tour: `#start-<slide>`; a name or book from the tour: `#e-<name>`

## Design system

- **Type scale:** 12, 14, 16, 18, 22, 34 px for interface text; serif display sizes for headlines. Do not add new sizes.
- **Radii:** 8 (cards), 12 (inputs, rows), 16 (search boxes), 22 (frames).
- **Palette** (sampled from photographs of Najaf): tile blue to turquoise for the dark panels and buttons, sand brick for the page and frames, gold only as a small accent.
- **One journey:** Start here (tour, day-one shelf, plan), then each page ends with one "next step" button.
- **Motion:** short, ease-out, off for reduced-motion (fades only). Hover effects only on devices with a mouse.
- **Accessibility:** skip link, landmarks, focus moved to the page heading on every page change with a polite announcement, visible focus on dark panels, 44 px touch targets.

## Topics and paths

- **Topics page:** one grid of eight cards. Each card is a single link (stretched link) with the sub-topics in plain words, an honest split of "books and articles" against "Q&A and ruling pages" (the fiqh topic is mostly Q&A pages, so one combined number misleads), a level ladder, and a "Start with" link.
- **One topic:** sub-topic chips, "Start with these" (the three easiest books and articles), then level tabs (Beginner, Intermediate, Advanced) over compact rows. Pages from the same book or section collapse under the best match. A topic is `?topic=<heading-id>`.
- **Paths page:** a theme filter and a grid of cards. Each card shows its steps as dots (darker = more detailed) and its level range. The theme comes from the first step's subject heading.
- **One path:** a numbered stepper with the "why" for each step, a read tick on each (saved only in the visitor's browser), a progress count, and related paths. A path is `?path=<id>`.
- Topic and path cards read from the catalog; nothing about them is hard-coded.

## Things that are drafts (owner to review)

- `site/js/tour.js`: slide titles, one-line intros, the lists of names (the prophets and the books are samples), and the bios, which are placeholders.
- `START` in `site/js/config.js`: the day-one shelf and the five plan stages. Each id must be a real record; missing ids are skipped and logged to the console.
- Page purpose lines and "next step" prompts in `site/js/app.js` (`PG` and `NEXT`).
- Starter questions and learning paths are still the drafts in `data/`.

## Not set up yet

- `SITE.report` in `config.js` is still a placeholder, so the Feedback page and "Report a problem with this link" say reporting is not set up. Set an email address or a GitHub repository and both start working (the visitor's own email app or a pre-filled issue; no server).
- The waitlist is a message to that same address. There is no list or database.

## Checks

```bash
python3 scripts/validate.py
python3 scripts/build_index.py
node scripts/eval_search.mjs
python3 -m http.server 8000 --directory site   # then open http://localhost:8000
```

## Questions and sources

- **Questions** (`#questions`): six "start with these" newcomer questions, then all 90 with a filter box (partial re-render of `#qlist`, nothing typed is stored) and theme chips (`data-qt`). A closing card sends people to the search box or the source site's own questions.
- **A question's own page**: typing a curated question (or one of its alternate phrasings, see `isThatQuestion`) shows the question as the page headline, the pages chosen for it (`top_records`), its reading path, related questions, then the other matching pages as compact rows. Broad searches such as "prayer" keep the normal results layout.
- **Sources** (`#sources`): one panel per approved website with page count, level bar, content-tag counts, "Browse all N pages" (`?source=id`) and a link to the site. Sources not yet in the catalog sit under "On the way" with their status. The About page uses a compact list (`sourceRowsHtml`).


## About and feedback

- **About** is split into scannable sections with an on-page jump row (`data-jump` buttons, so the hash stays a route): three principle cards, a "what is included" fact list, the website list, numbered "how results are chosen" steps, a privacy checklist, and a report-a-link card.
- **Feedback** is a four-card chooser (waitlist, suggest a website, topic or feedback, broken link) with a short form beside a three-step explainer. The button label, placeholder and required message follow the choice (`FB` in `app.js`). "Suggest a source" on the Sources page opens it with the website option selected. Until the owner sets `SITE.report` in `site/js/config.js`, the form is replaced by a notice.

## Calmer cards

Cards were visually heavy: tan outlines, tan group backgrounds around white cards, and seven lines per result. Now: outlines use the light `--line` colour; groups sit on the page ground with no colour block (`.frame` is only used on the hero); a result shows tag and level, title, one meta line (author, source, location, rulings of), a three-line description, a text link out, and one small footer line (context, more in section, report). Topic tiles drop the level legend and "start with" link (the bar stays). Filter chips and the order switch use a softer tint.

## Path cards

A path card shows its theme and step count on one line, the title, a two-line intro, then a small journey line: one dot per step, joined, from light (beginner) to dark (advanced), with "Beginner → Advanced" under it. No divider and no second row of counts.

## Topic pages

A topic page now orients first and lists last: "Start with these" (easiest works), "Read in order" (learning paths that include the topic), "Questions people ask" (curated questions under the topic), "Inside <topic>" (sub-topics as a tile grid with page counts, replacing a horizontally scrolling chip strip), then "Everything on this topic" with the level switch and compact rows. Sections that have nothing to show are left out.

## Start here

Three steps with a map on top: a strip of three jump cards (What is Islam?, Day-one shelf, Your plan) that scroll to each step and show live "N of M read" counts. Step 1 is a short banner with the seven tour stops as a grid instead of a tall column. The shelf and the plan each have a progress bar (teal, not gold). Plan stages are cards with a numbered header, a note and page count, then tickable rows; the Foundations stage points back to the shelf instead of repeating it. The tour card on the home page is unchanged.

## Sources (second pass)

For a newcomer the level bars and tag counts were noise, so the page leads with what each website is. A row of facts first (approved by hand, Twelver Shia, English only, totals), then one card per website in a three-column grid: name and domain, a plain description, page count with its content types, a single level bar with a phrase ("Mostly intermediate"), a "Good first page" link (the first beginner-level work from that website, left out when it has none), and the "Browse N pages" button with a quiet "Visit site" link. Websites not yet in the catalog stay under "On the way". The closing card invites suggestions and links to the full scope.

## Questions (second pass)

One control and one quiet list. The page opens with a single input: typing narrows the ready-made questions live, and "Ask" (or Enter) searches the whole catalog; a "Search the catalog for …" line is always the last row of a filtered list. Themes are underlined tabs (New to Shia Islam first, All last) instead of tan chips. The list is hairline rows with the question in the serif face and a page count at the right, not a grid of boxes. The separate "Start with these" block is gone, because it repeated the first tab. The source site's own question service is one line of text under the list.

## Home

The home answers "what do you want to do?" in three ways, in this order: ask, be guided, browse. The hero keeps the headline and search box; the suggestion list opens only when the box is focused. Below it: a quiet "New here? Follow the three-step guide" link, "Questions people start with" (six real questions as hairline rows, then "See all 90"), "Or be guided" (Start here with progress for returning visitors, the What is Islam? tour, Learning paths), "Browse by topic" (eight compact tiles with page counts), "What is inside" (the three websites and their page counts), and one quiet feedback line. Removed: the "Where to begin" frame, the four-card "Explore" row, the pill over the wave and the gold feedback banner.

## Tour pages

Slides: the large ghost numeral behind the title is gone (the progress bar already says "2 / 7"). A group whose names all carry the same sub-label (for example nineteen prophets, each "Prophet") shows as a wrapping row of name pills instead of nineteen identical tiles, so both groups fit on one screen. Group labels are small capitals with a count. Groups of different items (the Imams, scholars, books) keep the tile style.

Name pages: the short bio is a plain card (placeholder wording, no skeleton bars). "Learn more" uses the compact rows from topic pages, and lists exact matches only when there are any, so a name does not pull in unrelated pages. Previous and next names sit below.

## Feedback (second pass)

One narrow card instead of a side column plus four boxed options. Four underlined tabs (Waitlist, Suggest a website, Topic or feedback, Broken link) pick the kind; one sentence under the tabs says what that kind is for, then a message box and a single button. The button label, placeholder and whether a message is required follow the tab. The explainer is one muted note under the button. Until the owner sets `SITE.report` in `site/js/config.js`, visitors see a plain "Feedback opens soon" card (no developer wording) and the console logs a one-line hint for the owner.

## About (second pass)

Shorter and with one clear lead. The page opens with a single serif statement ("ShiaLib is a catalog, not a library") and a short paragraph, then three promise cards and the AI-preparation note. "What is included" is four labelled cells in two columns, and the websites list is dropped in favour of a link to Sources. "How results are chosen" gives the headline rule and keeps the five steps inside an expandable row. Privacy is a short checklist. When no public scope document is set, the page says a fuller written scope will be linked once public, rather than naming a file path.

## Copy and voice

Plain, direct and specific; every line should tell a visitor something they can use.

- Say what is there, with a number when there is one ("Ninety questions…", "Seven stops…"). No "one idea at a time", "ways to learn", "more ways in".
- A page lede says something the title does not. Section subtitles say what a click gives you ("Each one opens a short list of pages chosen to answer it").
- Calls to action name the destination or the outcome ("All topics", "See the sources"), not "Learn more" or "Click here".
- Draft notices are one sentence and say what was not reviewed.
- Placeholders that were notes to the owner ("Sample lists for the layout…") do not appear on the public pages. Developer wording (file names, config keys) never does.
- Prefer the plain word. "How to read search results" beats "Anatomy of a result"; "Common questions" beats "Questions people start with"; "Coming later" beats "On the way". A subtitle says what the page shows: "See what each part of a result tells you."
- The tour slides and name pages are draft content written for layout. Their wording is for the owner to replace.

## Guide

Built around one real result. "Anatomy of a result" shows an actual catalog page with numbered markers (tag, level, title, author and source, description) and a legend beside it; the sample card is decorative and not focusable, and the legend carries the same information as text. Below it, Levels (three rows), Tags (only kinds that exist in the catalog, each with a page count) and "On a results page" (exact matches, related results, the Draft mark). The old Sources card is gone because About covers it.

## Results page

Built to scan. The page stage carries the query and the count ("150 pages found", or the cap notice), so the separate count line is gone. Above the results, a plain "Questions about <topic>" list (or "Closest questions") replaces the tan block that presented a loosely matched question as if it had been asked; a matching reading path shows as a path card under "Read in order". The order switch and type chips stay on one line; "More filters" is a quiet text control that opens a panel. Exact and Related groups use the compact rows from topic pages instead of full cards, roughly halving the page height. Each row shows tag, level, author, source and whose rulings it follows, a short description, an "In <section> · More in this section" line, and a "Report a problem" link that appears on hover or focus on desktop and is always visible on touch.

## Verification pass

Checked with axe-core (WCAG 2.1 A and AA plus best-practice) on 16 pages at desktop and phone width, in light and dark: no contrast, label, landmark or heading-order violations remain. The one finding left is axe's "skip link" note on the tour slides, which flags in-app tile links like `#e-the-psalms`; they are route links, not skip links, so it is a false positive. Fixed from the audit: low-contrast count badges on chips and tabs, heading levels on topic, name and About pages, missing keyboard focus ring on path cards and search bars, a stray "Loading the catalog…" line with JavaScript off, and 44px hit areas on footer links, back links, shelf titles and report links on touch. Load time (Chromium, gzip, local server): on slow 4G with a 4x slower CPU the hero shows at about 0.3 s and search is ready at about 4 s; on slow 3G with a 6x slower CPU, about 0.7 s and 11.5 s. About a third of that is building the search index on the main thread. Not covered: a real phone, Safari and Firefox.

## Hero artwork

The home hero uses three layers, all decorative and hidden from assistive tech: a very faint sand girih tiling (`site/img/girih.svg`) that fades out behind the headline and is cut away on the right where the shrine sits (14% on desktop, 11% on phones); a white shrine line drawing (`site/img/shrine.svg`) at the right; and the turquoise search arrow beside the search pill, which nudges every few seconds and hides when the box is focused or the user prefers reduced motion. Both SVGs are used as CSS masks so their colour is set in CSS. They are traced artwork taken from another project (jaffariyouth/jiy) and optimised with svgo; confirm the right to reuse them. Sizes: shrine 159 KB (54 KB gzipped), girih 291 KB (83 KB gzipped).

Inner-page headers carry the same girih with no arch: 12% opacity, clear behind the title at the left and strongest at the right (strongest at the bottom on phones).

Tour slides carry the girih too, fixed behind the content at 10% (8% on phones), clear around the title at the left.

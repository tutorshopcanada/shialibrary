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

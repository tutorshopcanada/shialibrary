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

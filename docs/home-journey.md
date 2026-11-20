# Home page: photo hero and the journey

The home page has two parts that sit on top of the search.

**Hero.** A photograph behind the headline and the search box. The photograph loads only after the catalog has (the same rule as the other decorative art). Clicking the empty search box opens a card of starter questions; the suggestions float over the page as their own card, so nothing on it moves.

**Journey ("The Ark of Salvation: From the Kaaba to Khorasan").** The map panel fades up out of the foot of the hero: the photograph darkens into the map's teal, and the panel's top edge dissolves into it, so there is no hard line. As you scroll away the photograph cools toward turquoise and the headline lifts off. Inside it a pinned, scroll-driven 3D map flies from Mecca, Medina, Najaf, Karbala, Baghdad (Kadhimiya), Mashhad, Qom and Samarra to Toronto, "where it comes to you". Each stop opens a card with a photograph, who is buried in that city, and buttons to the matching catalog pages. The photograph then grows to fill the screen and slowly zooms toward the shrine.

- **Autoplay.** It starts by itself as soon as the panel has risen into view and the visitor pauses for about a third of a second; the page then glides down to the map and plays. Any wheel, touch, key press or manual scroll pauses it. The Play, Pause and Replay button and the "Legacy of Islam" tab control it. A full run takes about 45 seconds. It is off for visitors who ask for reduced motion or have Data Saver on; they get a still map and a list of the nine stops instead.
- **Loading.** Nothing heavy runs while the visitor reads the hero: a plain panel stands in, and `js/journey.js`, the map data (`journey/geo.json`) and the first photographs are set up on the first scroll or touch, or after six quiet seconds. Each later photograph is fetched as its stop approaches, and the map is redrawn only a few times a second while just its top edge shows under the hero. The setup runs in small idle steps after the catalog has finished loading, and the map is drawn once, then rests, while only its top edge shows. At steady state the hero holds 60 fps even with the CPU slowed to a quarter.
- **Links.** The buttons use the site's own search and path links (see `journeyLink` in `js/app.js`), so every button opens real catalog results. This is navigation only: the journey writes no answers.

## Files

| File | What it is |
|---|---|
| `site/js/journey.js` | The module: stops and their text, the map renderer, the photo zoom, autoplay |
| `site/css/type.css` | Site-wide typography: Fraunces for headings and display text, Inter for reading text and controls (replaces Instrument Serif) |
| `site/css/journey.css` | Home-only styles (everything is scoped to `body.home`, `.jrn` or `.j-*`) |
| `site/journey/geo.json` | Map data, built by `scripts/journey_geo/` |
| `site/journey/img/` | The home photograph and the nine stop photographs |
| `site/journey/CREDITS.md` | Credits and the permission status of every photograph |
| `site/fonts/fraunces-*.woff2` | The headline font, self-hosted |

## Open items for the owner

- The photographer credit for the home photograph (see `site/journey/CREDITS.md`). The owner has confirmed permission for the Al-Kafeel photographs. The About page says the site "never hosts, copies or writes" others' content; a line about decorative photographs would keep that accurate.
- The wording of the nine cards is a draft. Like the starter questions and paths, a person the owner trusts should read it before it goes live.

**Suggested questions.** The empty search box and the home page's "Common questions" show the list `SUGGESTED` in `site/js/config.js` (owner-editable, in order): what Shia Islam is, where to start, Shia and Sunni, how Shias pray, why they mourn, the Twelve Imams, khums, Ramadan fasting. Every id is a question in `data/questions.yaml` (still drafts). The full set stays under "See all questions".

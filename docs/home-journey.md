# Home page: photo hero and the journey

The home page has two parts that sit on top of the search.

**Hero.** A photograph behind the headline and the search box. The photograph loads only after the catalog has (the same rule as the other decorative art). Suggestions open upward so they never run into the panel below.

**Journey ("Places of the Prophet and the Imams").** A rounded panel rises from the foot of the hero. Inside it a pinned, scroll-driven 3D map flies from Mecca, Medina, Najaf, Karbala, Baghdad (Kadhimiya), Mashhad, Qom and Samarra to Toronto, "where it comes to you". Each stop opens a card with a photograph, who is buried in that city, and buttons to the matching catalog pages. The photograph then grows to fill the screen and slowly zooms toward the shrine.

- **Autoplay.** It starts by itself about a second after the visitor arrives at the journey and stops scrolling. Any wheel, touch, key press or manual scroll pauses it. The Play, Pause and Replay button and the "Follow the shrines" tab control it. A full run takes about a minute. It is off for visitors who ask for reduced motion or have Data Saver on; they get a still map and a list of the nine stops instead.
- **Loading.** `js/journey.js` is imported only when the journey is within one and a half screens of the viewport. The map data (`journey/geo.json`) and each photograph are fetched as that stop approaches.
- **Links.** The buttons use the site's own search and path links (see `journeyLink` in `js/app.js`), so every button opens real catalog results. This is navigation only: the journey writes no answers.

## Files

| File | What it is |
|---|---|
| `site/js/journey.js` | The module: stops and their text, the map renderer, the photo zoom, autoplay |
| `site/css/journey.css` | Home-only styles (everything is scoped to `body.home`, `.jrn` or `.j-*`) |
| `site/journey/geo.json` | Map data, built by `scripts/journey_geo/` |
| `site/journey/img/` | The home photograph and the nine stop photographs |
| `site/journey/CREDITS.md` | Credits and the permission status of every photograph |
| `site/fonts/fraunces-*.woff2` | The headline font, self-hosted |

## Open items for the owner

- Permission to use the Al-Kafeel photographs, and the credit for the home photograph (see `site/journey/CREDITS.md`). The About page says the site "never hosts, copies or writes" others' content; a line about decorative photographs would keep that accurate.
- The wording of the nine cards is a draft. Like the starter questions and paths, a person the owner trusts should read it before it goes live.

# duas.org structure (inspected 2026-11-12)

Site: Duas.org, a free collection of supplications (duas), visitations (ziyarat), and calendar-based practices, with Arabic text, transliteration and English translation. The site says "No Copyright - Extend credit if using the content", but this catalog still only describes pages and links to them.

## How the site is built

- **Robots and sitemap.** `/robots.txt` returns 404 (no rules). There is no sitemap. Pages are found from the home page, the index pages and the JSON files below.
- **Two kinds of page.**
  1. **Dynamic dua pages** (new template). The HTML is a shell; a script (`js_v2/dua.js`) reads `data_v2/<page-filename>.json` and renders the text. The JSON holds the title, the site's own description, the reference, timing metadata (days, times, events, dates), and the text in segments (Arabic, transliteration, translation). Pages such as `dua-kumayl.html`, `dua-tawassul.html`, `ziyarat-imam-hussain-ashura.html`, and `dua-simaat.html` work this way.
  2. **Static old-style pages** (most `/mobile/*.html` pages and the calendar pages). The text is in the HTML, with an English translation alongside the Arabic and a "Signifance" (significance) block. Examples: `mobile/ziyarat-arbaeen.html`, `mobile/dua-sabah.html`, `mobile/dua-mashlool.html`, `mobile/morning-evening-duas.html`.
- **Data files that can be read without rendering.** `data_v2/index_links.json` holds the lists behind the home page's menu (dailyTaqibat, ziyarat, specificNeeds, sahifa, sections). `data_v2/index.json` holds only home-page text. `data_v2/config.json` holds the version and modules.
- **Stubs.** Some dynamic pages return a 2.6 KB shell with no data file (`data_v2/<id>.json` gives 404). Examples: `mobile/dua-nudba.html`, `mobile/dua-faraj.html`, `mobile/ziyarat-imam-mahdi.html`, `mobile/ramadan-suhoor-dua-abu-hamza-thumali.html`. These are logged in `progress/failed-duas.org.txt`. Their English text was not available in the pages fetched.
- **Mixed data paths.** The JSON file is looked up relative to the page URL. A page under `/mobile/` looks for `/mobile/data_v2/...`, which did not exist for the pages tested. The root `data_v2/<id>.json` worked for the pages tested. Some dynamic pages have no JSON at either path.

## Index pages (what each lists)

| Index page | What it lists | Approx. items |
|---|---|---|
| `/` (home) | Feature tiles (Popular, Daily Taqibat, Ziyarat, Specific Needs, Sahifa of Masumeen), a date calendar widget loaded by script, and two links (Enemy protection, Muharram links) | few |
| `/dua-sections.html` ("All Sections", the main index) | Every section: Taqeebat (after each prayer, by weekday), Ziyarat, Sahifa Sajjadia, Specific Needs and Routines, Calendar (by month, 12th Imam, Sahifas, Quran, Resources). Includes all day-of-month pages (Sahifa Alawia 1-30) | 400 unique links: 311 page links (of which 13 are PDFs), 44 external; a rough reading is that most of the internal links are dua, ziyarat or calendar pages |
| `/index_links.json` (menu source for the home page) | dailyTaqibat (4), ziyarat (8), specificNeeds (10), sahifa (11), sections (19) | about 52 |
| `/ziyarat.html` ("All Ziyarat") | Ziyarat of Iraq, Mecca-Medina, Mashad, Salawat of Ahlulbayt, amulets, Salaat of Masumeen, each hour | not fetched |
| `/specific-need-routine-time.htm` | Specific needs (rizq, debt, illness, marriage, travel, students, routines) and times of day | not fetched |
| `/Calendar.html` and `/mobile/*-index.html` month pages | Dates and recommended duas/amaal per Islamic month (Ramadan, Muharram, Safar, Rajab, Shaban and so on) | 12 months; not counted further |
| `/muharramlinks.htm` (linked from the home page) | Muharram community resources, selected resources (mostly on al-islam.org and other sites), and Imam Husayn links | about 90 links (94 anchors on the page, including tabs and share buttons), mixed (many external) |
| `/mobile/sahifa-sajjadia-index.html` | Sahifa Sajjadiya: 60 numbered supplications plus the 15 munajat (intimate prayers) | 60 numbered entries and 15 munajat |

## Content types and rough counts

- **Taqeebat (after prayers).** Fajr, Zuhr/Asr, Maghrib/Isha, common taqeeb, plus Ghufaylah and Salaat Layl (prayers). Pages are short and mostly static.
- **Ziyarat.** Listed on the home and All Ziyarat pages (for example Ashura, Warith, Arbaeen, Aal-e-Yasin, Jamia Kabira, Ameenullah, Nahiya, Ahad after Fajr, Imam Mahdi). The full count was not taken. Mostly static or dynamic with English translation.
- **Named duas.** The Dua section lists well over 100 titles (Kumayl, Tawassul, Nudba, Faraj, Ahad, Sabah, Mashlool, Adeelah, Simaat, Jawshan Kabir and Sagheer, Abu Hamza Thumali, and others). The full count was not taken. Some pages are Arabic-only.
- **Sahifa collections.** Sahifa Sajjadiya (Imam Zain al-Abidin), Sahifa Alawiya (Imam Ali), Sahifa Mohammadiya (Prophet Muhammad), Sahifa Fatimiya, Sahifa Mahdi, Sahifa Baqariya, Sahifa Razaviya and others. Some are English, some are Arabic PDFs only.
- **Day-by-day and month pages.** About 70 entries on the All Sections page are month or date pages (Rajab, Shaban, Ramadan, Shawwal, Zilqad, Zilhajj, Muharram, Safar, Rabi, Jamadi and others), many with an amaal (a set of practices) for that date.
- **Specific needs and routines.** Several dozen pages (rizq, debt, illness, travel, bedtime, leaving home, wudhu, using the washroom, and so on).
- **Hadith and Quran-related pages.** Hadith Kisa, Quran resources, and some Nahj al-Balagha duas. Hadith pages are catalogued as hadith (not duas), so they are not part of this site's duas records.

## Out of scope (do not catalog)

- **Shop, sales and commerce.** None were seen, but the site links to apps and books (Phone Apps, IslamicMobility.com e-books) that are external sales sites.
- **Forums, feedback and accounts.** The "Your Feedback" Google Form, the Facebook, Twitter and Email share buttons, and Instagram and YouTube social links.
- **Other languages.** Arabic-only and Persian pages, Urdu and Indian language pages (`/indian.htm`), and Arabic PDFs (Sahifa Baqariya, Sadiqiya, Kazimiya; the Arabic dua-book folder `/duabooks/`). The brief says English only.
- **PDFs and audio/video.** Dua PDFs, MP3-only lists, PowerPoint files, and YouTube playlists. Their text is not catalogued; the page that links to them is.
- **Apps and players.** The Quran web app (`quran.duas.org`), the Dua Player (`duaplayer.org`), and the app links.
- **External sites.** Links to al-islam.org, islamic-laws.com, wikishia, and others are not catalogued from here; only pages on duas.org are in scope (and external sources only if they are in `config/sources.yaml`).
- **Fiqh (rulings).** Some routine pages state rulings (for example wudhu, eating and drinking etiquette, salat rules, and "Recommended Recitations during Salaat"). Fiqh rules apply: catalog only if the page clearly names Sistani or Khamenei. Otherwise skip and log under `proposals/review-flags.md`.
- **Calendar-only pages.** Pages that are mostly historical notes about a date, with links to other sites (for example the Islamic-laws.com "marja" pages).

## Pilot in this batch (20 records, data/records/duas/)

Catalogued from pages and data files read in this batch: Dua Kumayl, Dua Tawassul, Dua Arafah of Imam Husayn, Ziyarat Ashura, Ziyarat Warith, Ziyarat Arbaeen, Ziyarat Aal-e-Yasin, Ziyarat Jamia Kabira, Ziyarat Ameenullah, Ziyarat Ahad after Fajr, Ziyarat Nahiya, Dua Simaat, Dua Sabah, Sahifa Sajjadiya (index, work level), Morning and Evening Duas, Sunset Duas, Dua Jawshan Kabir (Ramadan), Dua Mashlool, Dua Adeelah and Dua Jawshan Sagheer.

Not catalogued in the pilot:
- Dua Nudba, Dua Faraj, Ziyarat of Imam Mahdi (dynamic stub pages, no data file found). Logged in `progress/failed-duas.org.txt`.
- Dua Ahad: the data file has a description in English but no English dua text segments. Skipped, see `proposals/review-flags.md`.
- Munajat Shabaniyyah: not found on the index pages read.
- Hadith Kisa: a hadith narration, so under the hadith rules it is not a dua record.

## Notes for the owner

- **Authors.** The supplications are attributed to Imams (Ali, Husayn, Zain al-Abidin, Musa al-Kazim, al-Sadiq, al-Mahdi). `data/scholars.yaml` has no entries for them, so `authors` is blank. Add them to the scholars file only if you want the attribution searchable.
- **Translator credits.** Ziyarat Nahiya credits a translator (Vahid Majd) and an introduction. The schema has no translator field, so this is not recorded.
- **Dynamic pages.** The text is loaded by script. Checking a page as a human sees it is more reliable than reading its HTML.
- **Request budget.** About 70 requests were used across the inspection and pilot (limit 70). Each page or data file was fetched with a 3-second gap.

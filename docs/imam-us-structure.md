# imam-us.org structure (inspected 2026-11-12)

Site: Imam Mahdi Association of Marjaeya (I.M.A.M.). WordPress with a theme whose category archives load posts by AJAX ("Load More"), so the category HTML pages hold only a few posts plus a sidebar. Use the **category feeds** (`/category/<slug>/feed`, about 10 items each, most recent first) to list posts. The site feed `/feed` holds only the latest 10 posts overall.

robots.txt: disallows `/wp-admin` and an invoice folder under `/wp-content/uploads/`; allows `wp-ajax.php`. No crawl delay stated. Pages are fetched with curl at 2-second intervals.

## Sections and URL patterns

| Section (category slug) | Feed items seen | Scope | Notes |
|---|---|---|---|
| articles (`/category/articles`) | 10 (feed page 1; more on `/category/articles/page/2`) | In scope when non-fiqh | Mixed: Karbala and Muharram reflection, theology, spirituality, and some fiqh-leaning pieces (imsak/fajr time, 2021) |
| books (`/category/books`) | 10 | In scope when non-fiqh; book pages give a description and a "get your copy" link | Islamic Laws of Khums is a fiqh book naming Sistani |
| video (`/category/video`) | 10 | Video pages (text plus embedded video). Catalog as `type: video`, `content_tag: other`, unless clearly a lecture | Mostly 2022-2025 PSYCHED4U parenting videos, some Ramadan and Sistani-related messages |
| rediscovering-faith (`/category/rediscovering-faith`) | 4 | In scope (spirituality, personal faith) | Some items are shared with other categories |
| blogs (`/category/blogs`) | 10 | Mixed: Karbala and Arbaeen guides (in scope), announcements (out), zakat and jurist-death pieces (fiqh) | Feed items often also tagged "Announcements" or "Martyrdom Announcements" |
| everyday-fiqh (`/category/everyday-fiqh`) | 6 | Fiqh: in scope only when Sistani or Khamenei is named | Items are short Q&A-style pages from 2020-2023 |
| from-the-marja (`/category/from-the-marja`) | 10 | Mostly marja statements and letters (Sistani to the UN, Pope Francis, Turkey-Syria earthquake) and advice lists (Sistani's Top 10 on Hussaini gatherings). Not fiqh rulings as such; a reviewer should decide | Page says nothing about marja; Sistani is the named source throughout |
| what-should-i-do (`/category/what-should-i-do`) | 10 | Fiqh Q&A ("WSID" / "What Should I Do?"). Each has a situation, then a "Ruling" section | Two checked name Sistani in the ruling section; one (jurist passing away) names no marja |

Other sections seen but not inspected: `/category/news` and `/category/announcements` (out of scope), `/arabic`, `/farsi`, `/urdu` (other languages, skip), product pages under `/product-category/...` and `/my-account`, `/cart`, `/checkout` (never fetch).

## Article pages

- Pattern: `https://imam-us.org/<slug>` (no category in the path). Slugs are in the feed link.
- Publication date is shown on the page below the title. Some items use "Share this..." before the body.
- No author byline on the page. The feed's `dc:creator` is a WordPress account name (for example "Huda Almuhaisen", "Syed Abidin", "asar"); it is not a byline, so `authors` is left blank.
- Body text sits in an `<article>` element. The meta description is a usable one-line summary.
- Book pages have a short "About this book" text. Some offer a PDF only after login.

## Fiqh pages

- Everyday Fiqh, From the Marja and WSID pages are in scope only when they name Sayyid Sistani or Sayyid Khamenei as the source. Checked so far: Islamic Laws of Khums (names Sistani in the title subtitle), Rules of Prayer and Fasting While Traveling ("According to the edicts of His Eminence Sayyid al-Sistani"), WSID Praying on a Plane ("the rulings of Sayyid Ali al-Sistani"), WSID Fasting on Ashura ("According to Sayyid Sistani"). Not cataloged, see below.
- No fiqh page checked so far names Khamenei.
- The site's own marja for its fiqh pages has not been stated in any page read. The owner must confirm.

## Counts (from feeds, 2026-11-12)

- Feed items inspected: 44 unique posts across the five non-fiqh categories plus 26 across the three fiqh categories.
- Records cataloged in the pilot: 14 (see `data/records/imam-us/`).
- Requests used: 39 (robots, site feed, five category pages, five category feeds, three fiqh category feeds, three fiqh category pages, and 21 post pages). Limit 60.

## Owner decisions

1. Which marja the site follows for its fiqh pages (not stated in any page read).
2. Whether WSID Q&A pages get one record per page (like sistani.org Q&A items) or whether they are held until the owner confirms.
3. Whether the "From the Marja" letters and advice lists are in scope (they are not fiqh rulings as such, but they are Sistani's statements).
4. Whether account names in feed `dc:creator` count as authors.
5. Whether "Why Does Islam Have So Many Laws?" is fiqh (it explains the purpose of law and gives examples).

## Batch 3 (2026-11-12): older posts and remaining categories

- Category feeds ignore `?paged=2`: `/category/<slug>/feed/?paged=2` returns the same first 10 items. The HTML archive loads older posts by AJAX, so they cannot be listed from the category pages. The post sitemaps (`/post-sitemap.xml`, `/post-sitemap2.xml`, about 1,300 posts, mostly announcements from 2017-2021) are the only full list; they carry no category.
- Cataloged in batch 3: 27 records (8 articles and blogs, 5 books, 14 videos). Sources: the feed items not yet cataloged in articles, blogs, books, rediscovering-faith and video, plus 10 video pages from the post sitemap (Let's Talk Religion and I.M.A.M. at Home series).
- Requests used in batch 3: 44 (7 feeds, 1 archive page, 1 sitemap index, 2 sitemaps, 33 post pages). The limit was 60; spacing 2 s.
- Still open: the other Let's Talk Religion episodes (2, 4, 6, 8, 9, 10, 11) and other I.M.A.M. at Home episodes seen only in the sitemap. Older /category/articles posts need a list the site does not serve as HTML or feed.
- Fiqh held back for the owner: the Hajj rulings webinar (marja not stated), the zakat al-Fitrah price guide (marja not stated) and the Fayyad advice (not an approved marja). See `proposals/review-flags.md`.

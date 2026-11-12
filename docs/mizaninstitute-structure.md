# mizaninstitute.org: structure (inspected 2026-11-12)

Inspected for the courses pilot. Source id `mizaninstitute.org`, folder `data/records/mizan/`, id prefix `mizan-`.

## Access and etiquette
- robots.txt: `Crawl-delay: 10`; disallows `/wp-admin/` (except admin-ajax), WooCommerce logs and transient files, `?add-to-cart=`, wpforms uploads. Sitemaps: `/sitemap.xml` (index), `/sitemap.rss`.
- Fetched with one request at a time, 10 s apart. Cart, checkout, account, login and order pages were never fetched.
- Course pages are WordPress with LearnDash (lesson lists are visible; lesson content is locked behind enrolment).

## Sitemap index (`/sitemap.xml`)
Sub-sitemaps include `post`, `page`, `product`, `sfwd-courses` (LearnDash courses, about 60 URLs), `sfwd-lessons`, `sfwd-topic`, `sfwd-quiz`, `groups`, `ld_course_category`, `product_cat`, `category`.

## URL patterns
- `/courses/<slug>/`: one page per course. Holds the title, a status line, a price (`Free` or `$NN.NN`), the synopsis or description, and the lesson list. Some have numeric slugs (`/courses/443/`, `/courses/439/` and so on, 2022 presentations). These are the course records.
- `/product/<slug>/`: WooCommerce product pages. They mirror several courses (for example Jinn, Dreams, Preservers of the Legacy, Muawiyah). They duplicate course pages and were not catalogued separately.
- `/course-category/online/`, `/course-category/sisters/`, `/course-category/extensives/`: category archives. Not fetched; their course lists are covered by the sitemap.
- Listing pages (marketing text, few course links): `/online/` (Online Presentations), `/extensives/` (Online Extensives), `/in-person-new/` (In Person Courses, book a city via a form), `/teenscatelog/` (Teens presentations, links to 7 teen courses), `/women/` (links to Women's Ahkam courses), `/sisters/` (virtual one-on-one with female scholars: a service, not a course), `/q30/` (Qur'an 30/30: a sisters-only 18-month programme, registration full at the time of inspection), `/roadmap/`, `/podcast/` (podcasts on streaming services), `/books/` (store page).
- `fiqh.mizaninstitute.org`: a separate fiqh site, linked from the header. Not visited. Its courses are fiqh and are skipped by rule (CLAUDE.md section 3).

## What each course page gives (fields we can ground)
- Title (`og:title` and the h1), price or Free, status ("Not Enrolled"), synopsis text, lesson or session titles.
- Published date (JSON-LD `datePublished`) is the web-post date, not a course start date. It is not used as `date`.
- The instructor name is not shown in the visible byline. The JSON-LD Person (for example "Ali Rizvi", "Naqi Syed", "Anam Farooqi", "Naseeruddin") looks like the WordPress author account. Records leave `instructors` blank. Owner to decide whether to use the JSON-LD author or the instructor named in the synopsis (for example "Shaykh Amin Rastani", "Shaykh Mahdi").
- Dates appear only in the synopsis text of live sessions (for example "May 30th & 31st", "August 29th & 30th").

## Counts (rough, from the sitemap and the pages read)
- About 60 `/courses/` URLs in the sitemap. About 13 are numeric or old 2022 presentations.
- Pilot: 12 records catalogued. About 12 more are in scope but were not catalogued (see the candidates below).

## Catalogued in this batch (12)
History of Fatimiyyah; Jinn: The Hidden Creation; Dreams in Karbala (free episode); The Life of Imam Ridha Part 2; The Journey of Husayn's Caravan (free); Shaytan in the Quran; Preservers of the Legacy; A Primer on Hadith Sciences; A Lesson Per Page Season 1; History of Aza; The Makkan Era; Tafsir al-Mizan & Hadith.

## Skipped, with reasons (logged in proposals/review-flags.md)
- Fiqh by rule: Women's Ahkam; Intermediate Rulings of Salat for Teens; Ijtihad Unveiled.
- Borderline, owner to decide: Secrets of Hajj & Umrah; Teens Secret of Salat (ritual meanings, not stated as rulings).
- Polemical or contested framing, owner to decide: Mu'awiyah: A Distortion of History; Fall of the Elite; The Case for Shi'ism (Thaqalayn).
- Ended: Death & Barzakh Online (May 2026); The Hour Part One Online (August 2026); The Spirit of God (page says "currently closed").

## Candidates in scope, not yet catalogued (for the next batch)
- Verses of Wilayah (`/courses/440/`), a 2.5 hour comparison of Shia and Sunni readings of the wilayah verses. Contested topic, but the page describes both views. Next batch.
- The Turbah of Imam Hussain (`/courses/428/`), Karbala symbols.
- The Mahdi Part 1, Online Recording June 2025 (`/courses/the-mahdi-part-1-online-recording-june-2025/`, $64.99). Parts 2 to 4 also exist.
- Dreams A Window Into The Unseen (`/courses/dreams/`, free). Page mostly intro text.
- Negotiating Doubt in the Age of Occultation (`/courses/437/`), And When You Speak (`/courses/438/`, Quranic conversation ethics), Understanding the Life of the Prophet (`/courses/442/`), A Short History of Shia Persecution (`/courses/425/`). Page text is thin; check fetched text before cataloguing.
- Understanding Muharram for Teens, The Journey of Husayn's Caravan for Teens, Mizan Teens Webinar Recording, Teens Purpose of Creation, Prophethood for Teens, Teens Q&A (`/courses/teensqna/`), Winter Camp Bundle for Teens. Not yet fetched.
- Quran 30/30 (`/q30/`): a programme with registration full, so it is not a course record yet.
- Becoming Bani Adam (`/books/`): a store page for a book ($25). Shop pages are skipped by the brief. A catalogue record would be `type: book`, `content_tag: book`, but the provider and source rules would need the owner's decision.

## Owner decisions needed
1. Whether the instructor should come from the JSON-LD author (WordPress account) or from the names in the synopsis. Records currently leave `instructors` blank.
2. Whether ritual-meaning courses (hajj, salat) count as fiqh-subject. Currently skipped and logged.
3. Polemic calls for Mu'awiyah, Fall of the Elite and The Case for Shi'ism.
4. Whether ended live sessions (with recording access) should be catalogued as recordings.
5. Whether closed enrolment (The Spirit of God) counts as ended.
6. Whether teen-course pages and the sisters-only programmes (Quran 30/30, Women's Ahkam) are in scope.
7. Whether the `/courses/` numeric-slug pages (2022) are current offerings. They are catalogued with their stated price.

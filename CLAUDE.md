# CLAUDE.md: Project Brief for the Cataloging Agent

Read this file fully before doing any work. It contains the project's purpose, audience, constraints, architecture, rules, and workflow. If something here conflicts with a request in chat, ask the user before proceeding.

---

## 1. What we are building

A **free, web-only catalog and search tool for Shia resources**, modeled on **PubMed**.

PubMed is not a library. It does not host papers. It holds a **catalog record** for each paper (title, author, journal, date, subject tags, abstract) and links to where the paper lives. We are building the same thing for Shia content:

> A user types a topic or question. The tool returns links to where that content can be found on approved Shia websites, with consistent metadata, subject headings, a visible content tag, and source attribution. For common beginner questions, it guides the user to a short learning path.

**We never host or republish other people's content.** We only describe it and point to it.

### Who it is for
The audience has mixed levels of knowledge, but the **goal is to help people who would not know to look at these websites in the first place**: beginners with the most basic questions, who need a way to start their learning journey. Design every decision for the newcomer first. Expert users are served by filters and the deeper sources, not by making the front door harder.

### Core principles
1. **Curated whitelist.** Only sources the owner has explicitly approved appear. Credibility comes from a clear, published scope.
2. **Catalog, not crawl dump.** Each item is a clean, structured record, not raw page text.
3. **Controlled vocabulary.** Every record is tagged from a fixed, hierarchical list of subject headings (like PubMed's MeSH). Each heading has alternate terms (spelling variants, Arabic, Persian, Urdu, transliterations, and plain-English phrasings) that map to it.
4. **Authority file for scholars.** One entry per scholar or author, with all name variants.
5. **Attribution and tags on every result.** Every result shows its source, a content tag, and links out to the original.
6. **No text generation at search time.** The search tool only retrieves and ranks human-vetted catalog records. It never writes answers, rulings, or summaries on the fly. Small retrieval models (embeddings) are allowed in the optional vector layer (section 11, Layer 3), but never a model that generates text. AI (you, the agent) is used at **build time** to create and maintain catalog records.
7. **Free to run.** No paid services for end users. Open-source models and plain files preferred. Do not depend on a free-tier API that can change or disappear.
8. **Beginner first.** Plain language, clear levels, starter questions, and learning paths come before advanced features.

---

## 2. Approved sources (initial)

| Source | Type | Catalog level |
|---|---|---|
| **thaqalayn.net** (now redirects to thaqalayn.com; same site) | Hadith collections | One record per collection/book/volume (e.g., "Al-Kafi, Vol. 1"). Do NOT catalog every individual hadith unless the owner asks. |
| **al-islam.org** | Shia books, articles, lectures, Q&A | One record per book or article. Optionally one per major chapter. Prioritize introductory and beginner material. Scripted requests (curl) are refused by the site's Cloudflare protection, so pages are read one at a time with the web-fetch tool, at least 10 seconds apart as its robots.txt asks; candidates are found by a web search limited to the site. Never use `/search/`, `/book/export/` or `/printpdf/` URLs. |
| **sistani.org** | Fiqh: rulings and Q&A of Sayyid Sistani | Books: the book (work) and each of its pages (section); rulings inside a book page have no links of their own. Q&A area: the area (work), each topic (section), and each question (item, with its own anchor link). See `docs/sistani-structure.md`. Every record from this source has `content_tag: fiqh` and `marja: sistani`. |
| **Whitelisted YouTube channels** | Lectures | One record per video. Channel list to be supplied by the owner. Backlog until supplied. |
| **Shia institutes (courses)** | Course listings from approved Shia institutes (the owner named the Shia Research Institute and Tasneem Institute as examples) | One record per course (not per lesson). Every record gets `type: course` and `content_tag: course`. The owner must supply each institute's exact website before you touch it. |
| **Others** | TBD | Owner adds them to `config/sources.yaml` before you touch them. An official source for Sayyid Khamenei's fiqh has not been named yet; ask the owner which site to use. |

**Rule: never catalog a source that is not listed in `config/sources.yaml`.** If you think a source belongs, propose it in `proposals/new-sources.md` and wait for approval.

### sistani.org specifics
- Structure was inspected on 2026-11-10 and is written up in `docs/sistani-structure.md`. Read it before cataloging.
- The main resource the owner described ("Rulings in the West") is titled **A Code of Practice For Muslims in the West** on the site (`/english/book/46/`). Its author is Sayyid Abdul Hadi al-Hakim; it presents Sayyid Sistani's rulings. Catalog it first, at book and page level.
- The site's **Question & Answer** area is the only part with a stable link per question. Item-level records come from there, one topic at a time.
- Other sistani.org books (Islamic Laws, Jurisprudence Made Easy, and so on) come after, when the owner says which.

---

## 3. Scope

### Decided by the owner (current phase)
- **School:** Twelver (Ithna 'Ashari) Shia only. Ismaili, Zaidi and other branches are out of scope.
- **Fiqh content is restricted to two marja':** **Sayyid Ali al-Sistani** and **Sayyid Ali Khamenei** only. "Fiqh content" means rulings, jurisprudence, practical law, fatwa-style Q&A, and books/pages whose purpose is to state or explain legal rulings (prayer, fasting, khums, purity, transactions, etc.). Fiqh from any other scholar is out of scope for now. Do not add other marja' without the owner's approval.
- **Hadith is never fiqh.** Anything that is a hadith collection gets `content_tag: hadith`, whatever its subject; hadith are not fiqh rulings on their own. A hadith volume about prayer, purity or law is tagged `hadith-collections` plus `legal-hadith` (under the Hadith branch), never a heading under Fiqh, and needs no review flag for that reason.
- **Non-fiqh content is NOT restricted by scholar.** Historical, theological, ethical, explanatory, analytical, hadith-related and similar articles and books from approved sources are in scope regardless of author, as long as the source is approved, the content is Twelver, and it is in English.
- **Language:** **English only** for now. Skip Arabic, Persian, Urdu and other-language resources (note them in `proposals/` if they look valuable). Keep alternate terms in the vocabulary multilingual anyway, so Arabic/Persian/Urdu search terms still map to headings and the tool can expand later.
- **Audience:** beginners first (see section 1).

### Still open (ask the owner before assuming)
- **Mixed or borderline items.** Some works blend fiqh with other material. Do not guess. Catalog it only if the main purpose is clearly non-fiqh, set `needs_review: true`, and explain in `review_note`. If its main purpose is fiqh and the author is not Sistani or Khamenei, skip it and log it in `proposals/review-flags.md`.
- **Inclusion criteria** for what counts as a valid resource, beyond the above.
- **Institute courses and fiqh.** Should a course whose subject is fiqh be limited to ones based on Sistani's or Khamenei's rulings? The owner chose to leave this for now. Until answered, skip and log fiqh-subject courses, or flag with `needs_review: true`. Courses on history, theology, Quran, ethics, Arabic, hadith sciences and similar are in scope.
- **Which institutes.** Do not guess their websites or add other institutes. Wait for approved URLs in `config/sources.yaml`.
- **Refreshing courses.** Decide with the owner how often to re-check approved institutes (suggested: every few months, with a dead-link check).
- **YouTube channels:** the owner must supply the approved channel list. Until then, do not harvest any YouTube content.
- **Starter questions and learning paths:** who writes them? Default until the owner decides: you draft them, mark them `draft: true`, and the owner (or a scholar they trust) reviews before they go live.
- **Beginner-first ranking:** automatic by default, or user-chosen ("I'm new" / "I want more detail")? Until decided, default to beginner material first with an easy toggle.
- **Vector layer hosting and languages:** default to an open-source model running in the browser, English only (section 11).

### Practical effects of this scope
- On al-islam.org and elsewhere, apply the fiqh rule first: catalog fiqh items only if they are by Sistani or Khamenei. Non-fiqh books and articles from any author are in scope, subject to the other rules.
- Decide fiqh vs non-fiqh by the item's main purpose and its headings. A record with any heading under the **Fiqh** branch of the vocabulary is a fiqh record and must set `marja` to `sistani` or `khamenei` (whose rulings it presents). `authors` stays truthful: a book of Sistani's rulings compiled by someone else lists the compiler as author and Sistani as `marja`.
- `data/scholars.yaml` starts with these two entries and grows as you catalog non-fiqh works by other authors (add each new author with all verifiable name variants and flag for review). Entries for Sistani and Khamenei include all English spellings and titles that appear on approved sources, e.g. Sistani / al-Sistani / Sayyid Ali Sistani / Ayatollah Sistani; Khamenei / Khamene'i / Sayyid Ali Khamenei / Seyyed Ali Khamenei / Ayatollah Khamenei / Imam Khamenei (use only spellings that actually appear on approved sources). Add Arabic and Persian name forms as alternate terms only, and only if verified from an approved page.
- Because non-fiqh content can come from many authors, make sure every record's `authors` field and the scholar filter work cleanly, including for authors with several spellings.

Record these answers in `docs/scope.md` (create it from this section). That file is meant to be published openly alongside the tool.

---

## 4. Architecture

```
config/sources.yaml  ->  fetch pages  ->  YOU create catalog records  ->  validator
                                                                            |
        data/questions.yaml + data/paths/*.yaml (curated layer) -----------+
                                                                            v
                                            build_index.py -> index.json (+ vectors in Phase 2)
                                                                            |
                                              Search page (layered search, tags, levels)
```

### Proposed repo layout
```
/
  CLAUDE.md                  (this file)
  config/
    sources.yaml             approved sources + per-source settings
    search.yaml              search thresholds, tag order, ranking weights
  data/
    vocabulary.yaml          subject headings + alternate terms
    scholars.yaml            authority file for scholars/authors
    questions.yaml           starter questions (plain-language) -> headings/records/paths
    paths/*.yaml             "start here" learning paths, one per topic
    search-eval.yaml         test queries with the results that should come back
    records/
      thaqalayn/*.yaml
      al-islam/*.yaml
      sistani/*.yaml         works, sections and Q&A items
      youtube/*.yaml
  docs/
    scope.md                 published scope + inclusion criteria
    cataloging-guide.md      detailed rules (expand from section 6)
    sistani-structure.md     how sistani.org is organized (books, Q&A, URL patterns)
  proposals/
    new-headings.md
    new-sources.md
    review-flags.md          records needing human/scholar review, skipped items
  scripts/
    validate.py              (no AI)
    build_index.py           builds the search index (no AI)
    harvest_youtube.py       (no AI) backlog until channels are supplied
    list_urls.py             sitemap/RSS URL listers (no AI)
  progress/
    done-<source>.txt        URLs already cataloged, so work can resume
    failed-<source>.txt      pages that could not be fetched (date | URL | what happened)
  site/                      search UI
```

Default stack: Python for scripts; a **static site** (plain HTML and JavaScript with a small search library such as MiniSearch, one `index.json`), so there is no server or database to run. SQLite FTS5 is an acceptable alternative. Confirm with the owner before changing.

---

## 5. Catalog record schema

One YAML file per record. Fields:

```yaml
id: sistani-<slug>             # unique, stable
type: qa                       # format: book | lecture | article | hadith-collection | qa | video | course | other
content_tag: fiqh              # display tag on every result: fiqh | hadith | book | article | course | lecture | other
                               # RULE: courses are always tagged "course" (their subject shows in headings).
                               # For every other item, "fiqh" wins: if the item is fiqh (see section 3),
                               # content_tag is fiqh even if its format is book or qa. Otherwise use the tag that
                               # fits (hadith-collection -> hadith, article -> article, etc.).
granularity: item              # work | section | item (see hierarchy below)
parent: sistani-west-prayer    # id of the parent record; empty for a work
level: beginner                # beginner | intermediate | advanced (see level rules)
title: ""                      # the title/heading as shown on the page; never the answer text
title_original: ""             # Arabic/Persian/Urdu title if the page gives it
authors: [scholar-id]          # IDs from scholars.yaml (may be empty if page gives none)
marja: ""                      # sistani | khamenei. Required on fiqh records: whose rulings the item presents.
                               # Blank on everything else. The author may be a different person (a compiler).
source: sistani.org            # must match an entry in config/sources.yaml
url: ""                        # deep link to the exact page or anchor for this record
language: en                   # ISO code
date: ""                       # publication/upload date if stated, else blank
description: ""                # 1-3 plain-English sentences for a newcomer (see rules 3 and 13)
sample_questions: []           # 3-8 plain-language questions this record helps answer
headings: [heading-id]         # IDs from vocabulary.yaml ONLY
access: free                   # free | paid | login-required | unknown
location: ""                   # e.g., "Vol. 2, Ch. 5", "ruling 14", when applicable
# Course records only (type: course). Leave blank when the page doesn't say:
provider: ""                   # the institute offering it
instructors: [scholar-id]
delivery: ""                   # online | in-person | hybrid | self-paced | live, only if stated
duration: ""                   # as stated, e.g., "8 weeks"
start_date: ""                 # next start date if stated; blank for ongoing/self-paced
cost: ""                       # free | paid | amount as stated | unknown
enrollment_url: ""             # direct sign-up link if different from url
needs_review: false            # true if classification is uncertain
review_note: ""
cataloged_on: YYYY-MM-DD
```

**Blank is better than wrong.** If the page does not state a field, leave it empty. Never guess.

### Hierarchy (work, section, item)
Some sources have a natural tree. Model it with `granularity` and `parent`:
- **work**: a book or collection (e.g., the main sistani.org book of rulings for Muslims in the West).
- **section**: a chapter or topic section inside it.
- **item**: a single Q&A or numbered ruling with its own page or anchor.

Every item links to its section, and every section links to its work. This lets the search page send someone straight to the specific Q&A, and show the surrounding chapter and book as optional links underneath (section 12). For sources without a tree (most al-islam.org books, courses), use `granularity: work` and leave `parent` empty. Only create item-level records when the page has a stable, individually linkable URL or anchor; otherwise stop at section level and tell the owner.

### Level rules
`level` applies to every record: **beginner** (written for someone new, assumes no background), **intermediate** (assumes basic knowledge), **advanced** (scholarly, specialized, or primary sources). Assign it from what the page says about itself (e.g., "an introduction to...", "for beginners", "a detailed study of...") and from its apparent audience. If unclear, pick the more advanced level and set `needs_review: true`. Typical defaults: hadith collections and detailed fiqh rulings are usually advanced for a newcomer; introductory books and articles on al-islam.org are often beginner.

---

## 6. Cataloging rules (the most important section)

1. **Ground every record in the fetched page.** Fetch the page and read it. Do not write records from memory or general knowledge. If you cannot fetch a page, do not make up a record. Log it in `progress/failed-<source>.txt`.
2. **Use only headings from `data/vocabulary.yaml`.** If no heading fits, do not invent one in the record. Add the suggestion to `proposals/new-headings.md` and tag the record with the closest existing heading plus `needs_review: true`.
3. **Descriptions are neutral, factual and written for a newcomer.** 1-3 sentences in your own words: what it is, what it covers, and who it is for. Use plain English and briefly explain any term a beginner wouldn't know (e.g., "khums, a religious payment"). No endorsement, no criticism, no sectarian commentary.
4. **Do not copy content.** Don't paste passages, full texts, or full hadith. A short description and a link is the whole record.
5. **Resolve scholars through `scholars.yaml`.** If an author already exists, use the ID. If not, add an entry (all name spellings you can verify from the page) and flag it for review. Do not guess identities or titles.
6. **Contested or sensitive classification gets flagged.** When how to classify or describe an item is debatable (a sensitive ruling topic, theology, history disputes, Shia-Sunni matters), set `needs_review: true` and explain why. An ordinary fiqh record whose topic is clear does not need the flag just for being fiqh; otherwise the flag would be on every sistani.org record and mean nothing. A knowledgeable human decides these, not you. (Owner decision 2026-11-11: everything cataloged so far from al-islam.org, sistani.org and thaqalayn is approved and its flags were cleared. New records from approved sources use `needs_review: true` only for a real boundary case: a possible fiqh work by someone other than the two marja', a possible polemic, or a source page that gives too little to describe. Level guesses and sensitive topics no longer need the flag, but the wording rules still apply.)
7. **No duplicates.** Check for an existing record with the same URL before creating one.
8. **Keep IDs and URLs stable.** Never rename or delete existing records unless asked.
9. **Respect scope.** If a page is outside the agreed scope (`docs/scope.md`), skip it and note it in `review-flags.md`.
10. **Never modify `vocabulary.yaml` or `scope.md` directly** unless the owner tells you to. Propose changes in `proposals/`.
11. **Apply the fiqh rule on every record.** If the item is fiqh, it must present the rulings of Sistani or Khamenei (recorded in `marja`), otherwise skip it and log it. Non-fiqh items have no author restriction.
12. **Courses are time-sensitive.** Copy dates, prices, levels and delivery format only as the page states them. Record the date you cataloged it. Don't catalog a course the page marks as ended unless the owner asks. If a course's main subject is fiqh, skip and log it (section 3).
13. **Fiqh records describe the topic, never restate the ruling.** For rulings and Q&A items, the description says what the question or section is about (e.g., "Covers how prayer is performed on an airplane"), not what the ruling is. Restating a ruling in your own words risks getting it wrong and amounts to issuing a ruling. The user reads the ruling on the source page. The same goes for the `title` field: use the heading or question as shown on the page, never the answer.
14. **Write `sample_questions` in beginner language.** 3-8 short questions a newcomer might actually type that this record helps answer (e.g., "How do Shias pray?", "What is khums?"). Base them on what the page covers, not on outside knowledge. These improve search and later become test data.
15. **Set `level` on every record** (see level rules in section 5).
16. **Build the tree top-down for hierarchical sources.** Create the work record, then its sections, then items, each with the correct `parent`. Do items one section at a time and validate.

---

## 7. Controlled vocabulary

`data/vocabulary.yaml` is a hierarchical tree. Each heading:

```yaml
- id: prayer
  label: "Prayer (Salah)"
  parent: fiqh
  alt_terms: ["salah", "salat", "namaz", "how to pray", "praying", "صلاة"]
  notes: ""
```

- Searching a parent heading also returns its children.
- Alternate terms include spelling variants and transliterations (Husayn / Hussain / Hussein / Ḥusayn / حسين), terms in Arabic, Persian and Urdu, **and plain-English phrasings a beginner would use** ("how to pray", "why do Shias mourn"). Beginners rarely know the technical term, so this last group matters a lot.
- Example top-level areas: Beliefs and theology (Tawhid, Adl, Nubuwwah, Imamate, Ma'ad); Fiqh (prayer, fasting, khums, etc.); History (Ahl al-Bayt, Karbala, Ghaybah); Hadith sciences; Ethics and spirituality; Duas and ziyarat; Quran and tafsir; "New to Shia Islam" (an entry area for basics).

Draft about 50 headings to begin, keep it shallow (2-3 levels), and mark it clearly as a draft for scholar review.

---

## 8. Starter questions and learning paths (core, not optional)

These are what make the tool work for newcomers who don't know what to type.

**`data/questions.yaml`**: 50 to 100 starter questions in plain language, each mapped to headings and to the best records:

```yaml
- id: q-how-to-pray
  question: "How do Shias pray?"
  alt_phrasings: ["how to perform salah", "shia prayer steps", "what is shia prayer like"]
  headings: [prayer]
  path: path-learn-to-pray      # optional: a learning path to start with
  top_records: [al-islam-xxx, sistani-xxx]
  draft: true
```

**`data/paths/*.yaml`**: a short ordered "start here" path per major topic, moving from beginner to deeper material:

```yaml
id: path-learn-to-pray
title: "Learning to pray"
intro: "One or two plain sentences for a newcomer."
steps:
  - record: al-islam-xxx        # beginner overview
    why: "A simple introduction to the daily prayers."
  - record: sistani-xxx         # detailed rulings, labelled as such
    why: "The detailed rulings, once you know the basics."
draft: true
```

Rules:
- Use only records that exist and pass validation. Never reference a record you haven't cataloged.
- Order beginner to advanced. Do not put a heavy fiqh ruling or a hadith collection as step 1 for a newcomer.
- Keep each path to roughly 3-6 steps. Short beats complete.
- All questions and paths start as `draft: true`. The owner (or a scholar they trust) reviews before they go live. Never mark your own work as reviewed.
- Write the intro and `why` lines in neutral, plain English.

---

## 9. Workflow for a cataloging session

1. Read this file and `docs/scope.md`.
2. Pick **one source** and one section of it (e.g., "al-islam.org: introductory books", "sistani.org: Chapter X of the main book").
3. Get the URL list using scripts (sitemap/RSS) where possible. Use scripts for mechanical work and save your effort for judgment work.
4. Check `progress/done-<source>.txt` and skip anything already done.
5. For each resource: fetch, read, write the record (including `level` and `sample_questions`), append the URL to the done file.
6. Run `scripts/validate.py` after each batch and fix any errors.
7. Summarize at the end: records created, flagged, skipped, headings proposed, failed pages, and anything the owner should decide.
8. Commit each batch separately with a clear message (e.g., `catalog: sistani.org prayer chapter (24 items)`). Git history is the review queue.

Work in **batches of a manageable size** and stop to report. Do not try to do an entire source in one go.

---

## 10. Fetching etiquette and limits

- Check each site's **robots.txt and terms of use** before bulk fetching, and respect them. If a site disallows automated access, stop and tell the owner. Do not work around blocks.
- Rate-limit: no more than about one request per second or two.
- Prefer **sitemaps, RSS feeds, and official APIs** over scraping.
- Do not bypass logins, paywalls, CAPTCHAs, or other access controls.
- If a fetch is refused or fails, log it and move on. Do not retry aggressively or try alternate routes around a block.
- Item-level cataloging of sistani.org means many pages. Keep to the rate limit, work section by section, and tell the owner if the volume looks like it needs the site owners' permission.
- Using a site's data for a public catalog may merit contacting the site owners. Remind the owner if relevant.

---

## 10b. YouTube (backlog until the owner supplies channels)

- Use the **YouTube Data API v3** (free daily quota) through `scripts/harvest_youtube.py`, not scraping.
- For each approved channel, get its **uploads playlist** and list it with `playlistItems.list` (1 quota unit per call). Do not use `search.list`: per Google's quota page it sits in a separate small daily bucket (reported as 100 calls per day), which is not enough for harvesting. Re-check Google's quota page before building, since limits change.
- Store title, description, publish date, video ID and URL. Tag `lecture`, assign `level` and `sample_questions` like any other record.
- **Only channels listed in `config/sources.yaml` are allowed.**
- Transcripts are a possible later addition. Do not scrape transcripts unless the owner decides to add them, since the methods are unofficial.
- The fiqh rule applies: a lecture whose main subject is fiqh is in scope only if it is by Sistani or Khamenei. Flag borderline cases.

---

## 11. Search: layered, no text generation

Search works in layers. Each layer has a measurable pass rule set in `config/search.yaml`. If a layer returns a confident result, show it; if not, fall to the next layer.

**Layer 1: Curated questions and topics.** Match the query against `questions.yaml` (and their alternate phrasings) and topic headings. A strong match shows the curated answer: the start-here path and top records.

**Layer 2: Keyword search.** Full-text search over titles, descriptions, sample questions, heading labels and alternate terms, and scholar name variants (a hand-built synonym table, not a model). BM25-style ranking, title matches weighted above description matches, diacritics and punctuation stripped, exact-phrase and prefix support. Passes when the top results clear a minimum score and result count.

**Layer 3: Vector (semantic) search. BUILT (owner request, 2026-11-11).** If Layer 2 is weak, embed the query with a small **open-source embedding model running in the browser**, and find the closest records by meaning using vectors precomputed at build time. Results are labelled "Related results". The model only measures similarity; it never writes text. Do not use a hosted API (queries would leave the user's device, and free tiers can change). Confirm the model, its download size and its licence at build time; load it lazily, only when this layer is needed. English only for now; a multilingual model is a later decision.

*As built:* the model is `minishlab/potion-base-4M` (MIT licence), a static embedding model chosen over transformer models (MiniLM, bge-small) because on 25 paraphrase queries it found 21 of 25 versus 20 and 22 while downloading about 4 MB instead of 33 to 45 MB and needing no WebAssembly runtime. Its token vectors are self-hosted in `site/data/l3/` (8-bit), record vectors are built with `node scripts/build_vectors.mjs` after `python3 scripts/build_index.py`, and CI fails if they are stale. The page loads them only when keyword search is weak (or when the visitor taps the button under Data Saver). Meaning-matched pages are fused into the Related group and labelled "Found by meaning". Known gaps are listed as comments at the end of `data/search-eval.yaml`.

**Layer 4: Graceful fallback.** If nothing is confident: "We couldn't find a close match", then show topic tiles and starter questions. Optionally record the unmatched query so the owner can add it to `questions.yaml`. If queries are logged, they must be anonymous (no IP, no account, no identifiers), stored only as text, and disclosed on the About page. The owner decides whether to enable logging.

### Exact versus related results
Results are shown in two labelled groups:
- **Exact matches**: results where every key term of the query (after normalization, and counting alternate terms of the same heading as the same term) appears in the title, question text or sample questions, or where the query matches a curated question or an exact phrase. Decided by plain rules, not a model.
- **Related results**: everything else retrieved by partial keyword match or (Phase 2) by vector search.

If there are no exact matches, say so honestly ("No exact matches. Here are related results") instead of presenting loose matches as exact.

### Other behaviors
- **Beginner-first ordering.** By default, within each group, rank beginner-level records above intermediate and advanced, then by relevance. Provide a clear toggle to show deeper material first or to filter by level. Weights live in `config/search.yaml`.
- **Mixed content, clearly tagged.** A broad query like "prayer" returns every content type together, each with a visible `content_tag` badge, so sistani.org rulings appear marked **Fiqh** next to **Article**, **Book**, **Hadith**, **Course**. Do not hide one kind behind another.
- **Tag chips with counts** (All / Fiqh / Hadith / Book / Article / Course / Lecture) let the user narrow a vague search in one click. Tag order is set in config; default: Fiqh, Hadith, Book, Article, Course, Lecture, Other.
- **Hierarchy grouping.** When several Q&A items from the same section match, collapse them under the section ("5 matching questions in *Section name*") with the best match first and an expand option, so one chapter doesn't flood the results.
- Inherit headings upward: searching a heading also finds records under its child headings, and item records inherit useful context from their section and work for matching.
- **Evaluation set.** `data/search-eval.yaml` holds real-style test queries (including beginner phrasings like "how do shias pray", "why do shia cry on ashura", "what is khums", "who is the mahdi") with the records that should appear. Run it after changes to catch regressions, and use it to tune the thresholds.
- Typo tolerance is optional and later.

---

## 12. UI requirements

- **Front page for newcomers:** a search box, plus starter questions and topic tiles ("New to Shia Islam?", "Learn to pray", "The Twelve Imams", "Ashura and Muharram", and so on) that lead into start-here paths. A search box alone is not enough for someone who doesn't know what to type.
- **Results** show: a visible **content tag badge**, a **level badge** (Beginner / Intermediate / Advanced), title, scholar, source, a short plain-English description, and a clear **link out** to the original.
- **Deep link with context.** For a hierarchical record (e.g., a sistani.org Q&A), the primary link goes straight to that specific item. Underneath, show an optional **"In context"** line with links to its section and its book (e.g., *Chapter name · Book name*), plus "More in this section". The user can go to the exact answer or step back to the chapter and book.
- **Two labelled groups:** "Exact matches" then "Related results" (section 11).
- **Tag chips** with counts and filters for level, source, scholar, language and subject heading.
- **Start-here paths** shown as an ordered, numbered sequence with the short "why" under each step.
- **Right-to-left support** for Arabic, Persian and Urdu (needed once those languages are added).
- Mobile-friendly. Fast on a slow phone: load the vector model only if Layer 3 is needed.
- An "About / Scope" page that publishes the inclusion criteria, the source list, and how results are chosen. A simple way to **report a wrong or broken link**.
- Every result makes its source obvious. The tool never implies it is the author or publisher.

---

## 13. Validation (scripts, no AI)

`scripts/validate.py` must check:
- Records match the schema, and required fields are present.
- Every `headings` ID exists in `vocabulary.yaml`; every `authors` ID exists in `scholars.yaml`; `source` is in `config/sources.yaml`.
- `level` is present and one of beginner / intermediate / advanced; `description` and `sample_questions` are present (3-8 questions).
- Any record with a heading under the Fiqh branch has `marja` set to `sistani` or `khamenei`; `marja` is blank on non-fiqh records.
- `content_tag` is present and one of fiqh / hadith / book / article / course / lecture / other. For non-course records, `content_tag` is `fiqh` if and only if the record has a heading under the Fiqh branch, and every `sistani.org` record is `fiqh`.
- `type: course` records have `content_tag: course` and a `provider` that matches an approved institute; course dates are valid; flag courses whose `start_date` has passed.
- **Hierarchy:** `granularity` is work, section or item; every section and item has an existing `parent`; the parent's granularity is higher (item -> section -> work); no cycles; parent and child share the same `source`.
- `language` is `en` for every record (English only for now).
- URLs are well-formed, no duplicate URLs or IDs, and item URLs differ from their section URLs.
- `questions.yaml` and `paths/*.yaml` reference only existing records and headings, and each path has 3-6 steps.
- Optional: a periodic dead-link check.

Do not consider a batch finished until validation passes.

---

## 14. Hard rules (do not break)

- Never invent facts, authors, titles, dates, levels or classifications. Leave blank (or choose the more cautious level) and flag.
- Never catalog unapproved sources, and never guess a site's address.
- Never host, copy, or republish source content beyond a brief original description.
- Never restate or paraphrase a ruling. Describe what a fiqh page is about, and link to it.
- Never issue religious rulings or take positions. Describe, classify and tag only, and flag contested cases.
- Never bypass access controls or robots.txt.
- Never add text generation to the search path. Retrieval and ranking only.
- Never mark your own drafts (questions, paths, vocabulary) as reviewed.
- Never silently change the vocabulary, scope, or existing records. Propose changes instead.

---

## 15. Phases and first tasks (in order)

**Phase 1: curated and keyword search (the foundation)**
1. Confirm scope answers with the owner and write `docs/scope.md`.
2. Create `config/sources.yaml` and `config/search.yaml` with the initial sources.
3. Draft `data/vocabulary.yaml` (about 50 headings, flagged as draft, including plain-English phrasings) and `data/scholars.yaml` (starter set).
4. Write `scripts/validate.py`.
5. Check robots.txt and terms for thaqalayn.net, al-islam.org and sistani.org. **Inspect and report sistani.org's structure** (books, chapters, items, URL patterns, linkability) before bulk fetching.
6. Pilot: about 10 beginner records from al-islam.org, about 10 hadith collections from thaqalayn.net, and one chapter of the main sistani.org book at item level (work, section, items). Validate. Stop for owner review.
7. Draft 20 starter questions and 3 start-here paths from the cataloged pilot records (`draft: true`). Stop for owner review.
8. Adjust these rules based on review, then scale up source by source.
9. Build `build_index.py` and the search page (layers 1, 2 and 4, exact/related groups, tags, levels, deep-link-with-context), plus `search-eval.yaml`.

**Phase 2: semantic layer**
10. Once the evaluation set shows where keyword search falls short, add Layer 3 (open-source in-browser embeddings) with the "Related results" label, and tune thresholds against the evaluation set.

**Backlog (do not build yet):** YouTube harvesting (once channels are supplied), Khamenei fiqh source, institute courses (once URLs are supplied), transcripts, right-to-left UI, typo tolerance, scheduled refresh and dead-link checks, contributor submissions, other languages.

---

## 16. When in doubt

Ask the owner. A short question is cheaper than a wrong batch of 200 records.

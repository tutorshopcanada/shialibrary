# Search v2: evaluation of the current search and a proposed redesign

Status: **phases A–D built on 2026-11-19** (results in section 8). Phases E and F still need the owner decisions in section 6.

Constraints kept from CLAUDE.md: static site, free to run, no server, nothing typed leaves the device,
**no text generation anywhere in the search path**, beginner-first, results are human-vetted catalog records only.

---

## 1. How the current search works (summary)

`site/js/search.js` (840 lines) and `site/js/semantic.js`:

1. **Layer 1**: the query is compared with starter questions (word overlap ≥ 0.8) and heading names.
2. **Layer 2**: BM25 over 8 weighted fields (title 3.0, sample questions 2.0, headings 1.5 …), prefix
   matching, one-letter typo correction, and a flat **concept bonus** (+3.5 per word) for every record tagged
   with a heading that the query names.
3. **Exact / Related split**: a record is "exact" when every key term, *or a heading the term maps to*,
   is found in its title or questions.
4. **Ordering**: inside "Exact", beginner level first, then score.
5. **Layer 3**: a 1 MB static embedding model (potion-base-4M), loaded only when there are fewer than
   2 exact matches; its results are fused into "Related".

## 2. Measurements (2026-11-19, 8,788 records)

| Measure | Result | Comment |
|---|---|---|
| Evaluation set (`search-eval.yaml`) pass rate | 82 / 82 | Lenient: passes if *any* expected page is in the top 10 |
| Same set: expected page ranked **1st** | 36 / 82 (44 %) | MRR 0.60 |
| Same set: expected page in **top 3** | 58 / 82 (71 %) | |
| **Hold-out test** (600 records: sample questions hidden, then searched with) hit@1 | **16.7 %** | MRR 0.29 |
| Hold-out hit@10 | 56 % | 76 % counting a page from the same section |
| Hold-out zero-result rate | 0.2 % | |
| Query time (node, server CPU) | p50 6 ms, p95 43 ms | Not the bottleneck |
| Engine start-up (building the inverted index in the browser) | 690 ms on a server CPU | Likely 2–4 s on a slow phone |
| Download | index.json 635 KB gz + index-more 261 KB gz; Layer 3 +1.7 MB gz | |

The current evaluation set says "all pass", yet the right page comes first less than half the time. On
unseen beginner phrasings it comes first one time in six. **Accuracy of ranking, not recall, is the problem.**

## 3. What goes wrong, with evidence

Run on 25 realistic beginner queries (script: hard-query list in the session; reproducible with any query).

| # | Root cause | Example |
|---|---|---|
| R1 | **Heading flooding.** A query word that names a *broad* heading makes every record under that heading "exact" and gives it the same flat bonus. Specific pages are drowned. | "temporary marriage" → 143 exact; top 3 are generic marriage pages. "why do shias do matam" → 110 exact. "can the prophets make mistakes" → 51 exact; the Infallibility page is 3rd. |
| R2 | **Synonyms and topics are the same thing.** A specific term (mutah, matam, ismah) can only be declared as an alternate term of a broad heading, so it inherits R1. (The new `arabic-terms.yaml` has the same limit.) | "mutah" ≡ "marriage-family" |
| R3 | **Beginner-first overrides relevance** inside "Exact": a loosely matching beginner page outranks the exact advanced page. | Infallibility page (advanced) below two general prophethood books |
| R4 | **Word sense / missing everyday words.** No mapping from everyday words to the catalog's terms. | "why do shias pray with a **stone**" → Hajj chapters on the Black Stone (wanted: turbah/mohr). "mosque during **period**" → misses haydh pages. |
| R5 | **No entity knowledge.** Ordinals and roles are not resolved. | "who was the **first imam**" → general books, not Imam Ali pages first |
| R6 | **Layer 3 rarely runs.** It only runs when keywords find < 2 exact matches, so when keyword search is confidently *wrong* (R1, R4) meaning search is never asked. | "pray with a stone": 3 junk exact hits → Layer 3 skipped |
| R7 | **Too many results, weak precision.** Up to 150 shown; related results often share one common word. | "dua for anxiety" → 2 exact, 148 related |
| R8 | **Start-up cost on phones.** The index is shipped as JSON text and the inverted index is rebuilt in the browser on every visit; the heading bonus scans all 8,788 records per concept. | 690 ms on a fast CPU |

## 4. Proposed design

A standard **retrieve → re-rank** pipeline, all on the visitor's device, all ranking, no generation.

```
query
  │ 1. Query understanding (tables + rules, built offline)
  │    normalize → spelling (SymSpell, ≤2 edits, catalog dictionary)
  │    → phrase & entity recognition (headings, scholars, NEW entity table)
  │    → term synonyms with weights (NEW, separate from headings)
  │    → intent (ruling question / who / what-is / how-to / why-do-Shia)
  ▼
  │ 2. Candidate retrieval, two retrievers, union of top ~200
  │    a. BM25F over fields, synonyms at reduced weight
  │    b. dense vectors (domain-tuned static model)
  ▼
  │ 3. Re-ranking: one score per candidate from ~15 features
  │    (trained offline on the catalog's own 40k sample questions)
  ▼
  │ 4. Presentation: strict Exact rule, Related cap, near-duplicate collapse,
  │    beginner-first as a bounded boost, calibrated "no confident match"
  ▼
results
```

### 4.1 Query understanding (fixes R2, R4, R5)

- **`data/synonyms.yaml` (new, separate from headings).** Term ↔ term equivalences with a weight:
  `mutah = temporary marriage (1.0)`, `matam = latm = chest beating`, `period = menstruation = haydh`,
  `ismah = infallibility = sinless`. A synonym expands the *query terms*; it does not drag in a whole
  heading. The Arabic table moves here; only true topic words stay as heading alternate terms.
- **Context rules** for ambiguous words, as plain table rows: `stone` + (`pray` | `sajdah`) → `turbah`, `mohr`.
- **`data/entities.yaml` (new).** "first imam" → Imam Ali; "twelfth imam", "hidden imam" → Imam Mahdi;
  "the Prophet's daughter" → Fatimah, … Each row points at an existing heading or scholar. These encode facts,
  so they are **drafts for owner/scholar review**, like the vocabulary.
- **Spelling: SymSpell** (precomputed deletion dictionary from catalog words, up to 2 edits, frequency-ranked).
  Replaces the current 1-edit linear scan; faster and handles "infalibilty", "khumms", "prohets".
- **Intent detection.** Plain patterns ("is it haram/allowed", "can I", "what does Sistani say") plus,
  optionally, a tiny logistic-regression classifier trained offline on sample questions → `type`/`content_tag`.
  Used only as a ranking feature (a ruling question favours Q&A and fiqh records).

### 4.2 Retrieval (fixes R6)

- Keep BM25F, but weigh a heading match by how **specific** the heading is
  (`idf(heading) = log(N / records under it)`). A match on "Temporary marriage" counts far more than on
  "Marriage and family". This alone should stop most flooding (R1).
- Pre-compute heading → record lists, so the concept bonus no longer scans all records (R8).
- **Dense retrieval runs on every query** (owner decision, §6), not only when keywords are weak, and is fused
  with BM25 before re-ranking. Query cost is about 5 ms; the cost is the 1.7 MB first download.
- **Upgrade the static model** with Model2Vec distillation from a stronger open-licence teacher, with the
  catalog's own domain words added to its vocabulary (khums, taqlid, haydh, turbah, mutah, ghaybah …), and
  optionally fine-tuned on (sample question, record) pairs. The file size and runtime code stay the same as
  today (1–4 MB, no WebAssembly). Teacher model and licence to be confirmed at build time, as CLAUDE.md requires.

### 4.3 Re-ranking (fixes R1, R3, R7)

A **learned linear ranker** (or ≤ 50 small decision trees, exported as JSON) over features such as:
BM25 per field · fraction of query terms in title / questions · phrase match · specific-heading match
weighted by heading idf · entity match · synonym-only match · dense cosine · rank in each retriever ·
intent ↔ record-type agreement · granularity · level · record length.

- **Training data already exists:** about 40,000 (sample question → record) pairs written by the cataloger.
  Train with k-fold hold-out (a record's own questions are removed from the index while it is a training
  target), so the ranker learns from *unseen* phrasings, exactly the beginner case.
- Output: about 15 numbers in `config/search.yaml`. Inspectable, versioned, no runtime model.
- **Beginner-first becomes a bounded boost** (for example at most ×1.15, and the tie-breaker), so it orders
  pages of similar relevance but never lifts a weak match above a strong one. The "deeper first" toggle stays.

### 4.4 Presentation (fixes R1, R7)

- **Stricter Exact rule:** a heading-only match counts as "exact" only for a specific heading (low record count)
  or when the whole query is the topic name. Everything else goes to Related.
- **Related cap** at about 30, cut by a calibrated score floor instead of a relative 15 %.
- **Near-duplicate collapse:** sistani.org and al-islam.org hold many near-identical questions; group them
  (MinHash on titles at build time) like section clusters today.
- **Calibrated fallback:** the ranker score maps to a probability on the evaluation set; below the threshold,
  show the honest "no close match" page. Today's thresholds were tuned by hand.

### 4.5 Efficiency (fixes R8)

- **Pre-built binary index**: postings, field lengths and heading lists written by `build_index.py` as typed
  arrays (varint-packed), so the browser loads arrays instead of building the index. Target: start-up under
  100 ms on a server CPU (now 690 ms), to be measured.
- Run the search engine in a **Web Worker**, so typing never freezes the page on slow phones.
- Keep lazy loading of the second half of the index and the model (already done).
- Query time is already fine (6 ms median). The work is in start-up and downloads, not query speed.

## 5. Measuring it (do this first)

1. **Graded judgments:** about 150 real beginner queries, each with 3–10 records judged 0–3
   (0 wrong, 3 ideal). Judged by the owner or a trusted reviewer; Claude may draft, marked `draft: true`.
2. **Hold-out harness** (built during this evaluation): sample questions held out, measuring MRR, hit@1, hit@10.
3. Metrics in CI: **nDCG@10, MRR, hit@1, P@5 (share of top 5 judged relevant), junk-in-top-3 rate,
   zero-result rate.** A change merges only if it does not lower them.
4. Keep the current `search-eval.yaml` as a smoke test.

**Targets (goals, not promises):** hold-out MRR from 0.29 to at least 0.45; hit@1 from 17 % to at least 30 %;
evaluation-set hit@1 from 44 % to at least 65 %; no hard query in §3 with a wrong page in its top 3.

## 6. Decisions for the owner

1. **Learned ranker.** CLAUDE.md allows small retrieval models in Layer 3 only. A ranker whose ~15 weights are
   *trained* offline on our own sample questions generates no text, but it is a learned model in Layer 2
   ordering. Allow it? (The alternative is hand-tuned weights, as now, which is less accurate.)
2. **Meaning search on every query.** CLAUDE.md says to load the model only when Layer 3 is needed. Running it on
   every query costs a one-time ~1.7 MB download on the first search. Allow it, or keep it lazy with wider
   triggers (low ranker confidence, question-shaped queries)?
3. **Synonym and entity tables** state facts ("first imam" → Imam Ali). Review them like the vocabulary?
4. **Who judges** the graded queries in §5?
5. **Teacher model** for the distilled embedding: Claude proposes candidates with licences and sizes; the owner picks.

## 7. Plan, in order

| Phase | Work | Needs a decision? |
|---|---|---|
| A | Graded eval + hold-out harness in CI | Q4 |
| B | Heading-specificity weighting, stricter Exact rule, bounded beginner boost, Related cap, near-duplicate collapse | No: rule changes only |
| C | `synonyms.yaml` (move the Arabic table there), context rules, `entities.yaml`, SymSpell | Q3 |
| D | Binary pre-built index + Web Worker | No |
| E | Learned ranker trained on sample questions | Q1 |
| F | Distilled domain embedding; hybrid retrieval on every query | Q2, Q5 |

Phases A–D are rules and engineering only and should give most of the gain. Each phase is measured against §5
before the next one starts.

**Not recommended:** an in-browser cross-encoder re-ranker. It is the most accurate kind of ranker, but it is
20–30 MB and slow on phones, which conflicts with the slow-phone requirement.

## 8. Results of phases A–D (built 2026-11-19)

| Measure (scripts/eval_metrics.mjs) | Before | After A–D |
|---|---|---|
| Judged queries nDCG@10 (26 draft graded queries) | 0.684 | 0.792 |
| Judged hit@1 (first result good or ideal) | 65 % | 73 % |
| Judged junk@3 (wrong results in the first 3, per query) | 0.39 | 0.19 |
| Evaluation set MRR / hit@1 | 0.65 / 49 % | 0.72 / 59 % |
| Hold-out MRR / hit@1 / hit@10 | 0.29 / 16 % / 59 % | 0.46 / 35 % / 70 % |
| Query time p50 / p95 (server CPU) | 7 / 47 ms | 3 / 16 ms |
| Longest page freeze, 4× CPU slow-down | 2.7 s | 0.23 s |

What was built:
- **A** `data/search-judgments.yaml` (draft), `scripts/eval_metrics.mjs`, CI minimums in `.github/workflows/site.yml`.
- **B** Topic bonus scaled by topic size; broad headings no longer make pages "exact"; book boost 3.0 → 1.4 and
  beginner boost 1.5 → 1.25 (chosen by a measured sweep); known-item title match; Related capped at 40;
  near-duplicate pages from one source grouped ("7 similar pages from the same source").
- **C** `data/synonyms.yaml` and `data/entities.yaml` (drafts), context rules, spelling correction up to 2 edits,
  Arabic "al-" folded; only a heading's own names stand in for a query word in the exact rule.
- **D** Changed from the plan after measuring (see below): records are added to the engine in chunks of 250
  with a pause between them, per-record exact-match data is computed lazily, and the rest of the catalog is
  appended instead of rebuilding the engine.

Two planned items were dropped on evidence:
- **Pre-built binary index**: it would add about 300–500 KB (gzip) to the first download, on top of 635 KB.
  `scripts/perf_check.mjs` shows time-to-ready on a throttled connection is dominated by download (5.5 s
  before and after), so on a slow phone the extra file would cost more than the CPU it saves.
- **Web Worker**: after chunking, no task blocks the page for longer than about 0.23 s at 4× slow-down, so
  moving the engine to a worker (which would make every search call asynchronous across the whole page) is
  not worth its complexity now.

Still open: the owner should review the drafts (`search-judgments.yaml`, `synonyms.yaml`, `entities.yaml`),
and decide section 6 before phases E and F. More beginner phrasings per record (from cataloging agents)
would raise the hold-out numbers further, since sample questions are the strongest signal.

### Re-tuning (added 2026-11-19)
`scripts/tune_search.mjs` re-tunes the ranking numbers after big cataloging batches (coordinate search over
the settings in `config/search.yaml`; a value is kept only if the combined score rises, no evaluation query
starts failing, and neither graded nDCG nor evaluation MRR drops). First run: phrase boost 1.6 → 1.2 and
intermediate level boost 1.1 → 1.05 (objective 0.641 → 0.646). The hold-out test alone rewards weakening the
sample-question field (it hides the target's own questions), so that weight is not tuned.

The wider Layer 3 trigger (`layer3.min_word_coverage`) is built but stays off: none of the values tried
improved the measurements. Re-test it after the al-islam.org Q&As and the beginner-phrasing pass, and after
retraining the meaning model on the catalog's own words.

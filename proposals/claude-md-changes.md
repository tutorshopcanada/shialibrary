# CLAUDE.md: flaws found and what was done

## Fixed in CLAUDE.md (2026-11-10)

1. **The fiqh rule keyed on `authors`, which would force a false author.** The main sistani.org
   book is written by Sayyid Abdul Hadi al-Hakim and presents Sayyid Sistani's rulings. Under the
   old rule it either failed validation or had to list Sistani as author. Added a `marja` field
   (whose rulings a fiqh record presents); the fiqh rule and the validator now check `marja`, and
   `authors` stays truthful.
2. **"Three levels" on sistani.org did not match the site.** Rulings inside a book page have no
   link of their own; only the separate Q&A area has a link per question. Rewrote the sistani.org
   notes to match (`docs/sistani-structure.md`), with the book's real title.
3. **Rule 6 flagged every fiqh record for review**, which would put the flag on every sistani.org
   record and make it useless. Narrowed it to cases where the classification or description is
   actually debatable.
4. **thaqalayn.net redirects to thaqalayn.com.** Noted as the same approved source.
5. **al-islam.org blocks automated access.** Marked `status: blocked`.
6. `progress/failed-<source>.txt` was required by rule 1 but missing from the layout. Added.

## Not changed: owner to decide

7. **The pilot depends on al-islam.org for all beginner material.** Without it there are no
   beginner records, so no learning path can honestly start with a beginner overview (section 8),
   and "beginner first" has nothing to put first. This is the biggest gap. Options: get
   permission or an export from al-islam.org; approve another introductory source; or supply
   page copies by hand.
8. **3-8 `sample_questions` on every record** is heavy for item-level Q&A, where the record is
   itself one question. Suggest 1-8 for `granularity: item`. Not changed; pilot items carry 3-4.
9. **Legal hadith volumes** (for example prayer chapters of a hadith collection) are not rulings
   but would naturally take a Fiqh heading, which the fiqh rule forbids for other authors.
   Current handling: tag as hadith only and flag. Suggest saying this in section 3.
10. **No translator field.** Many English works are translations. Suggest `translators: []`.
11. **`type` has both `lecture` and `video`**, and both display as Lecture. Suggest one of them.
12. **Query logging and "report a broken link" need a backend** if they are to be more than a
    mailto or GitHub link. A Supabase table would do it, but principle 7 says not to depend on a
    free tier. Suggest starting with a link that needs no backend, and deciding later.
13. **Build order.** The search page was scheduled after scaling up (step 9). It was built
    alongside the pilot instead, so pilot records can be reviewed in the real interface.
14. Section 8 asks for 50-100 starter questions; step 7 asks for 20. Read as 20 for the pilot.

## Proposed (2026-11-13): Q&A level rule
Section 5 "Level rules" does not say how to level Q&A items, whose pages state no audience, so
nearly all sistani.org Q&A defaulted to intermediate (935 of 953). Owner direction 2026-11-13:
everyday-situation questions are beginner. The test is written in `docs/cataloging-guide.md`
(Writing a record > level). Proposed CLAUDE.md edit: add one line to section 5 pointing to it. Pilot of
100 sistani.org items re-leveled 2026-11-13 (41 beginner, 22 advanced); the rest is pending owner review.
Superseded the same day: owner decision is that all fiqh Q&A is beginner, and only contested or confusing
topics (Shia-Sunni matters, third testimony, la'nah, mut'ah, seeking help from the Imams, physical mourning
customs, kafir topic) are intermediate. All 953 Q&A records re-leveled on that basis; the intermediate list is in
the commit message of that change.
Narrowed again 2026-11-13: only mut'ah and la'nah Q&A are intermediate; every other fiqh Q&A is beginner.

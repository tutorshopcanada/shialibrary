# Scope

This page says what the catalog includes and why. It is published alongside the search tool.
Changes to it are made by the owner (proposals go in `proposals/`).

## What this is

A free catalog and search tool for Shia resources, in the spirit of PubMed: it holds a short
record describing each resource and links to where the resource lives. It does not host,
copy or republish anyone's content, and it does not write answers or rulings. Records are
prepared with AI assistance at build time and are meant to be checked by people; the search
itself only retrieves and ranks those records.

## Decided

- **School:** Twelver (Ithna 'Ashari) Shia only.
- **Language:** English only for now. Subject headings carry Arabic, Persian and Urdu
  alternate terms so those search terms still work.
- **Sources:** only websites the owner has approved, listed in `config/sources.yaml`.
- **Fiqh (practical rulings):** restricted to the rulings of two marja', **Sayyid Ali
  al-Sistani** and **Sayyid Ali Khamenei**. This covers rulings, fatwa-style questions and
  answers, and books or pages whose purpose is to state or explain legal rulings.
  A fiqh record names whose rulings it follows. Fiqh records describe what a page is
  about; they never restate the ruling.
  **Exception (owner decision 2026-11-13):** fiqh-subject courses at approved institutes, and
  fiqh questions and answers on al-islam.org, are in scope because they are taught or answered
  by scholars. They do not need to follow Sayyid Sistani or Sayyid Khamenei, and `marja` stays
  blank unless the page names one.
- **Hadith is never fiqh.** Anything that is a hadith collection carries the Hadith label,
  whatever its subject. Narrations about prayer, fasting or law are not rulings on their own,
  so they are not covered by the two-marja' restriction. They are tagged under the Hadith
  headings, not the Fiqh ones.
- **Everything else** (history, theology, ethics, Quran, hadith, biography and so on) is in
  scope whatever the author, provided the source is approved, the content is Twelver and it
  is in English.
- **Audience:** beginners first. Every record has a level (beginner, intermediate, advanced).

## Outside tools we link to

- **hyder.ai**, a free Shia AI tool (owner decision 2026-11-12). It is not a catalog source.
  The site links to it only on the "no close match" screen, with a plain notice that its
  answers are AI-written and are not checked by us or by a scholar. We do not run it, send it
  anything, or show its output.

## Current sources

| Source | What is cataloged | Status |
|---|---|---|
| thaqalayn.net | Hadith collections: one record per collection or volume, plus one section record per chapter (owner decision 2026-11-11). Individual hadith are still not cataloged. | Active |
| sistani.org | Books of rulings (book and page level) and the Q&A area (topic and single-question level) | Active |
| al-islam.org | Books and articles, beginner material first | Active |
| YouTube channels | One record per video | Waiting for the owner's channel list |
| Institute courses | One record per course | Waiting for the owner's list of institute websites |

## Still open (owner to decide)

- Works that mix fiqh with other material: cataloged only if the main purpose is clearly not
  fiqh, and flagged for review.
- An official source for Sayyid Khamenei's rulings.
- Who reviews starter questions, learning paths and the subject headings. Until then they
  are marked as drafts.
- How often courses and links are re-checked.

## What is not included

- Other branches (Ismaili, Zaidi and others) and non-English material.
- Fiqh books and rulings from scholars other than the two named above (courses and al-islam.org
  questions and answers excepted, see Scope).
- Anything from a website not on the approved list.
- Any generated answer, summary of a ruling, or religious opinion.

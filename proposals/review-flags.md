# Review flags and skipped items

Records flagged in their own file carry `needs_review: true` and a `review_note`; list them with
`grep -l "needs_review: true" -r data/records`. This file is for things that are not in a record.

## Skipped
- Nothing skipped at source level. (al-islam.org refused scripted requests on 2026-11-10; it is now read with the web-fetch tool within its robots.txt rules.)

## Questions for a reviewer
- sistani.org Q&A lists some questions twice under different ids (for example 15001 and 15489
  under Congregational Prayers). Both are cataloged. Keep both, or keep one?
- Translators are not recorded (the schema has no field). The Code of Practice names
  Sayyid Mohammad Rizvi as translator.

## Skipped (polemical)
- 2026-11-10 | The Twelve Successors of the Holy Prophet (Sayyid Murtadha al-'Askari) | https://al-islam.org/twelve-successors-holy-prophet-sayyid-murtadha-al-askari | Chapters such as "The Twelve Imams According to the School of the Caliphate" and "Bewildering Interpretations" compare and argue against other groups' readings; borderline polemic on the succession question. Owner may want to reconsider.

## Skipped (polemical)
- 2026-11-10 | Beliefs: Twelve Successors | https://al-islam.org/articles/beliefs-twelve-successors | Mainly argues against Sunni interpretations of the "twelve successors" hadith (concludes only Twelvers fit), so skipped as polemical.

## Skipped (fiqh by other authors)
- 2026-11-10 | Legal Age Of Bulugh For Girls (Syed Ali Imran) | https://al-islam.org/articles/legal-age-bulugh-girls-syed-ali-imran | main purpose is a survey of jurists' opinions, Quranic verses and traditions on the legal age of puberty (bulugh), i.e. a fiqh topic by an author other than Sistani or Khamenei; borderline analytical format, a reviewer may reconsider.
- 2026-11-10 | Safeguarding Azadari Against Wrong Practices (Mustafa Husseini Tabatabai) | https://al-islam.org/message-thaqalayn/vol-15-no-3-autumn-2014/safeguarding-azadari-wrong-practices-mustafa-tabatabai | sections state prohibitions and scholarly consensus on a mourning practice (ruling-style, other author); fetched but not cataloged
- 2026-11-10 | Pork (Sayyid Saeed Akhtar Rizvi); Hijab, Dress and Modesty in Islam (Sayyid Saeed Akhtar Rizvi); Place, Direction and Beginning of Prayer, and Timing and Clothing of Prayer (Mohammad Ali Shomali) | https://al-islam.org/articles/pork-sayyid-saeed-akhtar-rizvi ; https://al-islam.org/articles/hijab-dress-modesty-islam-sayyid-saeed-akhtar-rizvi ; https://al-islam.org/articles/place-direction-and-beginning-prayer-mohammad-ali-shomali ; https://al-islam.org/articles/timing-and-clothing-prayer-mohammad-ali-shomali | listed on hubs; by titles these are rulings-style pieces by authors other than Sistani/Khamenei; not fetched, not cataloged (decided from title only, a reviewer may reconsider the Shomali prayer pieces)

## Possible typo in a page title (check against the source)
- sistani-women-8562: the page title reads "Modium Istiḥāḍa", probably "Medium"; kept as the site shows it.

## Level looks uniform (second-reader note)
- The second-reader audit noted that nearly all sistani.org Q&A records are `intermediate`, which was a default for that area (no audience stated), not a per-question judgment. A reviewer may want to set very basic questions to beginner.
- A few Q&A topics overlap (Qasam/Oath, Loan/Mortgage, Nafilah/Night Prayer, Movies/Films and Movies); each is cataloged as the site lists it.

## Second-reader audit: level and heading suggestions (not applied; a reviewer decides)
- al-islam-holy-month-ramadhan-poem (LEVEL, low): An eight-line poem by a young child is plainly beginner material, not intermediate.
- sistani-laws-2206 (LEVEL, low): The record describes a general introduction to the importance of prayer, which suggests beginner rather than advanced; the page is probably an opening section, so this is worth a check.
- sistani-qa-14989 (HEADING, low): The prayer heading is not supported by the description or sample questions, which concern perfume and modesty in public.
- sistani-qa-15287 (HEADING, medium): The record is about blood money (diyyah) and gold equivalents, which has nothing to do with dress or appearance.
- sistani-qa-15318 (HEADING, low): The question concerns men embracing and kissing other men, so the women-rulings heading does not fit.
- sistani-qa-15559 (HEADING, low): The question is about draping a mosque with black cloth, which concerns decoration of a building rather than clothing or personal appearance.
- sistani-qa-24574 (HEADING, medium): The question asks for Sayyid Sistani's view on a book of sayings, not a legal ruling; the vocabulary has a nahj-al-balagha heading that fits better, and the fiqh tag and marja setting would need revisiting if the heading changes.
- sistani-qa-nahjul-balaghah (HEADING, medium): The record's own flag says the item may not be fiqh (a book of sayings), yet it sits under the generic fiqh heading; the nahj-al-balagha heading fits the subject.
- sistani-qa-rules-of-say (LEVEL, low): Detailed procedural rules for sa'y (floors, laps, purity, layout) are better marked advanced for a newcomer under the level rules, not intermediate.
- sistani-qa-rules-of-slaughtering-during-hajj (LEVEL, low): Detailed technical rules on slaughtering the hady are better marked advanced for a newcomer under the level rules, not intermediate.
- sistani-worship-8478 (LEVEL, low): The record describes itself as an introduction and its sample questions are basic, but the level is set to advanced.
- sistani-worship-8501 (LEVEL, low): The record describes itself as an introduction and its sample questions are basic (e.g. How do Shias pray?), but the level is set to advanced.
- sistani-worship-8511 (LEVEL, low): The record describes itself as an introduction and its sample questions are basic (e.g. What is Hajj?), but the level is set to advanced.
- sistani-worship-8513 (LEVEL, low): The record describes itself as an introduction and its sample questions are basic (e.g. What is zakat?), but the level is set to advanced.

## Skipped (polemical) - batch ai10
- 2026-11-10 | Abu Hurayra and the Falsification of Traditions (Hadith) (Yasin T. al-Jibouri) | https://al-islam.org/articles/abu-hurayra-and-falsification-traditions-hadith-yasin-t-al-jibouri | Page's own tone is polemical: argues against Abu Hurayra, Mu'awiyah, the Umayyads and some Sunni scholars.

## Skipped (not an article) - batch ai10
- 2026-11-10 | Conversion Story For Haider Brad Haber | https://al-islam.org/discover/haider-brad-haber | The page is a video (ABTV Reborn); /discover/ convert-story pages (also Abdul Baqi, Joe Belden, David Kingdavong, Nishith Desai, Maryam Flemming, listed on converts-to-islam?page=1) were not fetched and look like video stories, outside the articles-only brief.
- 2026-11-10 | Fatwas about Unity from Contemporary Ulama of the Islamic World | https://al-islam.org/al-taqrib/number-4-winter-2009/fatwas-about-unity-contemporary-ulama-islamic-world | Not fetched; title indicates fatwas by various scholars (fiqh-style), so skipped under the fiqh rule pending owner decision.

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

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

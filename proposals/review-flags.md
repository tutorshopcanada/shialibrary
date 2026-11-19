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

## Skipped (fiqh by other authors) - batch ai11
- 2026-11-11 | An Introduction To The Rights And Duties Of Women In Islam (Ibrahim Amini) | https://al-islam.org/introduction-rights-and-duties-women-islam-ibrahim-amini | Borderline, not cataloged: mixes social status of women with legal topics (hijab, mahr, nafaqah, inheritance, polygamy, divorce); main purpose not clearly non-fiqh. Owner to decide.
- 2026-11-11 | From Marriage to Parenthood: The Heavenly Path (Shaheen Merali) | https://al-islam.org/marriage-parenthood-heavenly-path | Not cataloged: includes chapters titled "Important Fiqh Rules" for couples and mothers; mixed with fiqh, main purpose not clearly non-fiqh.
- 2026-11-11 | How To Start Your Journey Of Religious Responsibility? (Al-Maaref Islamic Cultural Association) | https://al-islam.org/how-start-your-journey-religious-responsibility | Not cataloged: addresses religious rules, imitation (taqlid) and duties (prayer, hijab) for girls reaching religious maturity; main purpose is partly rulings, mixed.

## Skipped (fiqh by other authors) - batch ai12
- 2026-11-11 | How To Start Your Journey Of Religious Responsibility? (Al-Maaref Islamic Cultural Association) | https://al-islam.org/how-start-your-journey-religious-responsibility | booklet for girls on religious rules, imitation (taqlid) and duties including prayer and the veil; main purpose appears to be religious rules, not clearly non-fiqh. Owner decision needed.

## Skipped for lack of a description (not fiqh)
- 2026-11-11 | Story of Sacrifice (Jalil Dorrani) | https://al-islam.org/story-sacrifice | not fiqh; skipped only because the page states no description, tags or audience to ground a record. Revisit if wanted.

## Skipped for lack of a description (not fiqh)
- 2026-11-11 | Story of Sacrifice (Jalil Dorrani) | https://al-islam.org/story-sacrifice | page states no summary, tags or audience (batch ai13)

## Skipped (fiqh by other authors) - batch ai13
- 2026-11-11 | How To Start Your Journey Of Religious Responsibility? (Al-Maaref Islamic Cultural Association) | https://al-islam.org/how-start-your-journey-religious-responsibility | guide for girls reaching religious maturity centred on religious rules and duties (prayer, veil, taqlid); borderline, main purpose appears to be legal duties

## Skipped (polemical)
- 2026-11-11 | Completion of Argument (Sayyid Sa'eed Akhtar Rizvi) | https://al-islam.org/completion-argument-sayyid-saeed-akhtar-rizvi | page describes it as answering objections of Ahlul Sunnat scholars against Shia beliefs; tag Debate (batch ai13)

## Owner decision 2026-11-11
The owner approved everything cataloged from al-islam.org ("anything from al-islam.org is good"). Their needs_review flags were cleared in one change; the review_note text was kept as a record of why each was flagged (level evidence, disputed topics). This does not change the rule for sistani.org, thaqalayn or any other source, which stay flagged for a reviewer.

## Owner decision 2026-11-11 (second)
The owner also approved everything cataloged from sistani.org and thaqalayn ("anything from sistani.org and thaqalayn is good too"). Their remaining needs_review flags were cleared; review_note text was kept. The sensitive-topic wording rule still applies to new records (describe what is asked, never the ruling), and the second-reader audit fixes stay in place.

## Skipped (polemical) - batch al-islam-s2 (2026-11-11)
- 2026-11-11 | Today, I Have Perfected For You Your Religion (Muhammad al-Tijani al-Samawi, chapter in All Solutions are with the Prophet's Progeny) | https://al-islam.org/node/46853 | argues that Eid al-Ghadir is the greatest festival and that Quran 5:3 names Imam Ali as successor, opening with a line urging Muslims to convert to Shia; a polemical chapter for owner decision.
- 2026-11-11 | Shia-Sunni Debate: Answering 50 Most Common Questions (Liaket Dewji, Baqerali Alidina) | https://al-islam.org/shia-sunni-debate-answering-50-most-common-questions-liaket-dewji-baqerali-alidina | title seen on a listing page, not fetched; a Shia-Sunni debate work, so flagged for owner decision on whether debate works are in scope.

## sistani.org audit 2026-11-11: truncated Q&A titles (not changed)
- The audit compared all 709 Q&A item records with the live question headings on the 174 topic pages. Every item URL is in the done file, and every live question has a record (none missing). The 5 titles in sistani-qa-15352..15356 match the live page verbatim.
- 123 item records have a title cut off with "..." (about 200 characters). The live page shows the full question, and CLAUDE.md requires the title to be the question as shown. Not changed in this audit, because the owner approved only the five titles above. Proposed fix: replace each title with the full question text from its topic page, and keep the existing "..." text out of the record. Records: sistani-qa-14821, sistani-qa-14841, sistani-qa-14849, sistani-qa-14855, sistani-qa-14856, sistani-qa-14857, sistani-qa-14862, sistani-qa-14863, sistani-qa-14871, sistani-qa-14873, sistani-qa-14874, sistani-qa-14875, sistani-qa-14893, sistani-qa-14894, sistani-qa-14895, sistani-qa-14896, sistani-qa-14902, sistani-qa-14903, sistani-qa-14909, sistani-qa-14924, sistani-qa-14926, sistani-qa-14927, sistani-qa-14931, sistani-qa-14934, sistani-qa-14942, sistani-qa-14950, sistani-qa-14951, sistani-qa-14952, sistani-qa-14954, sistani-qa-14973, sistani-qa-14974, sistani-qa-14981, sistani-qa-14984, sistani-qa-15018, sistani-qa-15019, sistani-qa-15020, sistani-qa-15030, sistani-qa-15044, sistani-qa-15045, sistani-qa-15046, sistani-qa-15049, sistani-qa-15056, sistani-qa-15060, sistani-qa-15061, sistani-qa-15082, sistani-qa-15083, sistani-qa-15089, sistani-qa-15091, sistani-qa-15092, sistani-qa-15093, sistani-qa-15101, sistani-qa-15107, sistani-qa-15109, sistani-qa-15110, sistani-qa-15111, sistani-qa-15112, sistani-qa-15114, sistani-qa-15129, sistani-qa-15131, sistani-qa-15132, sistani-qa-15133, sistani-qa-15134, sistani-qa-15139, sistani-qa-15144, sistani-qa-15165, sistani-qa-15166, sistani-qa-15167, sistani-qa-15170, sistani-qa-15198, sistani-qa-15203, sistani-qa-15219, sistani-qa-15223, sistani-qa-15224, sistani-qa-15229, sistani-qa-15230, sistani-qa-15231, sistani-qa-15232, sistani-qa-15241, sistani-qa-15249, sistani-qa-15250, sistani-qa-15252, sistani-qa-15263, sistani-qa-15264, sistani-qa-15266, sistani-qa-15267, sistani-qa-15278, sistani-qa-15279, sistani-qa-15370, sistani-qa-15376, sistani-qa-15388, sistani-qa-15389, sistani-qa-15394, sistani-qa-15414, sistani-qa-15415, sistani-qa-15422, sistani-qa-15423, sistani-qa-15426, sistani-qa-15432, sistani-qa-15441, sistani-qa-15442, sistani-qa-15445, sistani-qa-15451, sistani-qa-15452, sistani-qa-15454, sistani-qa-15458, sistani-qa-15459, sistani-qa-15471, sistani-qa-15504, sistani-qa-15507, sistani-qa-15514, sistani-qa-15517, sistani-qa-15532, sistani-qa-15538, sistani-qa-15558, sistani-qa-15566, sistani-qa-15584, sistani-qa-15626, sistani-qa-25232, sistani-qa-25351, sistani-qa-25361, sistani-qa-25369, sistani-qa-25374, sistani-qa-26970

## Seen in search, not evaluated (batch al-islam-s2, 2026-11-11)
- 2026-11-11 | An Introduction To The Rights And Duties Of Women In Islam (Ibrahim Amini) | https://al-islam.org/introduction-rights-and-duties-women-islam-ibrahim-amini | women's rights and duties, with housewifery and family topics; may touch on rulings; owner to decide whether it is fiqh before anyone catalogues it.
- 2026-11-11 | A New Perspective: Women in Islam (Fatma Saleh, Sayyid Moustafa al-Qazwini) | https://al-islam.org/printpdf/book/export/html/21294 | dialogue on rights and laws; borderline fiqh; not fetched.
- 2026-11-11 | Introduction to Islam (Islamic Humanitarian Service, 2001) | https://al-islam.org/introduction-islam/introduction-islam | a general 20-chapter introduction; the page does not state the school (Shia or other), so it is not catalogued. Owner to decide whether it is in scope.
- 2026-11-11 | Lessons from the Tradition of the Cloak commentary (Abu Shahba) and Shiite Encyclopedia introduction | not fetched; advanced or comparative, left for a later batch.
- 2026-11-11 | Files and booklets (Let's Learn About Imam Ali, Let's Learn About Imam Ridha, Let Me Learn About Aimmatiy, Let Us Learn About Sayyida Fatimah, The Father of Orphans) | the site's file pages showed only navigation text when fetched; not catalogued. See progress/failed-al-islam.txt.

## Skipped (polemical) - batch al-islam-s3 (2026-11-12)
- 2026-11-12 | Beliefs: Twelve Successors (Ahlul Bayt DILP, no author stated) | https://al-islam.org/articles/beliefs-twelve-successors | the page's main purpose is to test Sunni scholars' readings of the twelve-successors hadith ("What the Sunni scholars say", "Confused?") and then present the Twelver view as the answer; it argues against another group. Owner decision needed on whether argument-style pieces on this hadith are in scope. Fetched 2026-11-12.

## imam-us.org pilot (2026-11-12)
Pilot records: `data/records/imam-us/` (14 records). Fiqh pages naming Sayyid Sistani were cataloged (Islamic Laws of Khums; Rules of Prayer and Fasting While Traveling), with `marja: sistani`. The site's own marja statement is not recorded elsewhere, so the owner should confirm that Sistani is the marja the site follows on its fiqh pages before more fiqh is added.

Owner decisions needed:
- Which marja does imam-us.org follow for its fiqh pages? Pages checked name Sayyid Sistani (see below), and a Marjaeya representative is named on one page only in truncated form ("Ayatullah Sayyid Ali..."). Do not assume.
- The "What Should I Do?" (WSID) Q&A pages present rulings in a "Ruling" section. Two name Sistani and are held for the owner (see below). Should Q&A items be cataloged one per page, like sistani.org items, or is the site-level page enough?
- "Expressions of Togetherness" (video page, 2023) is non-fiqh and in scope, but no vocabulary heading fits interfaith reflections. Not cataloged; see proposals/new-headings.md.
- Authors: the WordPress feed credits pages to staff account names ("Huda Almuhaisen", "Syed Abidin", "asar"). These are not bylines on the pages, so `authors` is blank. Confirm whether account names count as authors.
- Presenters: "Sr. Berak Hussain" presents the depression video, but she is not an author in scholars.yaml. Left without `authors`.

## Skipped (fiqh, marja not stated)
- 2026-11-12 | The Difference Between the Time of Imsak and the Time of Fajr Prayer | https://imam-us.org/the-difference-between-the-time-of-imsak-and-the-time-of-fajr-prayer | fiqh (fasting and prayer times, with precaution and "your marja" guidance). Names no marja. Its only named scholar is cited as a source (Ayatullah Abul Qasim al-Khoei, a footnote), so it is skipped.
- 2026-11-12 | What Should I Do When the Jurist (faqih) Whom I Follow Passes Away? | https://imam-us.org/what-should-i-do-when-the-jurist-faqih-whom-i-follow-passes-away | fiqh (taqlid). The page names no marja in its text. A sidebar links to a Marjaeya representative and says "his Eminence Ayatullah Sayyid Ali…" (truncated), which could be either marja. Skipped until the owner confirms.
- 2026-11-12 | Why Does Islam Have So Many Laws? | https://imam-us.org/why-does-islam-have-so-many-laws | borderline. It explains the purpose of Islamic law in general and lists everyday rulings as examples, with no marja named. Skipped; the owner should say whether this is fiqh (the rule would then require a marja) or non-fiqh explanatory material.
- 2026-11-12 | What Should I Do? Praying on a Plane | https://imam-us.org/what-should-i-do-praying-on-a-plane | fiqh. Names Sayyid Ali al-Sistani as the source of "the rulings" in its Ruling section. Eligible under the fiqh rule but not cataloged in the pilot, held for the owner's decision on WSID format (see above).
- 2026-11-12 | WSID: Can I Fast on the Day of Ashura? | https://imam-us.org/wsid-can-i-fast-on-the-day-of-ashura | fiqh. Its Ruling section says "According to Sayyid Sistani". Eligible but held for the same decision.
- 2026-11-12 | Prepare for the Walk to Karbala and Journey to Karbala: Arbaeen Guide (2025) | https://imam-us.org/journey-to-karbala-arbaeen-guide-2 | not fiqh; the 2025 post is near-identical to the 2026 one. Only the 2026 post is cataloged. The owner may want to retire the older one on the site.
- 2026-11-12 | Expressions of Togetherness | Pope Francis and Sayyid al-Sistani | https://imam-us.org/expressions-of-togetherness-pope-francis-and-sayyid-al-sistani | not fiqh and in scope, but no heading fits. Held pending a heading (proposals/new-headings.md).

## Not fetched (titles only, fiqh-looking, decided from title)
- 2026-11-12 | Clarification Regarding College Student Residence; Why Are There Varying Dates for Some Islamic Events?; Clarification on Exempting a Debtor from Khums; Rules of Doubt in Prayers; What Should I Do? Attending the Religious Commemorations of Other Religions (everyday-fiqh) | URLs under https://imam-us.org/ with the same slugs as the feed | fiqh; marja not checked
- 2026-11-12 | Zakat al-Fitrah: Why It's Just $10 This Year; Marriage in Islam (about this book) | https://imam-us.org/its-only-10-00-how-is-zakat-al-fitrah-calculated_2026 ; https://imam-us.org/marriage-in-islam-about-this-book | fiqh-leaning; not fetched

## Skipped (fiqh course) - mizaninstitute.org pilot (2026-11-12)
- 2026-11-12 | Women's Ahkam (sisters-only; hayd, istihadah, nifas) | https://mizaninstitute.org/courses/womens-ahkam/ | fiqh; page does not name Sistani or Khamenei
- 2026-11-12 | Intermediate Rulings of Salat – For Teens | https://mizaninstitute.org/courses/rulingsforteens/ | fiqh (rulings of salat); no marja stated
- 2026-11-12 | Ijtihad Unveiled | https://mizaninstitute.org/courses/ijtihad/ | fiqh methodology (ijtihad, the derivation of legal rulings); no marja stated
- 2026-11-12 | Secrets of Hajj & Umrah | https://mizaninstitute.org/courses/hajj/ | borderline: the page frames it as the meanings and inner dimensions of hajj, but its topics are the rites of hajj and umrah (ritual law). Owner to decide whether ritual-meaning courses count as fiqh.
- 2026-11-12 | Teens Secret of Salat | https://mizaninstitute.org/courses/teens-secret-of-salat/ | borderline, same question as Secrets of Hajj: the page presents the meanings of prayer, but covers wudhu, adhan, and the etiquette of prayer. Owner to decide.

## Skipped (polemical) - mizaninstitute.org pilot (2026-11-12)
- 2026-11-12 | Mu'awiyah: A Distortion of History | https://mizaninstitute.org/courses/muawiyah/ | title and synopsis frame the course as a critique of a TV series and of a historical figure's character; owner to decide
- 2026-11-12 | Fall of the Elite | https://mizaninstitute.org/courses/fall-of-the-elite/ | presents the betrayal of Imam Ali (as) by early figures; sensitive early-history framing; owner to decide
- 2026-11-12 | The Case for Shi'ism: An Analysis of Hadith al-Thaqalayn and Ithna Ashara Khalifah | https://mizaninstitute.org/courses/thaqalayn/ | apologetic framing ("the case for"); owner to decide whether it is polemic

## Skipped (ended) - mizaninstitute.org pilot (2026-11-12)
- 2026-11-12 | Death & Barzakh Online – May 2026 | https://mizaninstitute.org/courses/death-barzakh-online-may-2026/ | live dates (May 30-31, 2026) have passed; recording access only
- 2026-11-12 | The Hour Part One Online – August 2026 | https://mizaninstitute.org/courses/the-hour-part-one-online-august-2026/ | live dates (Aug 29-30, 2026) have passed; recording access only
- 2026-11-12 | The Spirit of God | https://mizaninstitute.org/courses/436/ | page says "This course is currently closed"; owner to decide whether closed enrolment counts as ended

## imam-us.org batch 2 (2026-11-12)
Owner decision 2026-11-12: every fiqh record from imam-us.org is `marja: sistani`, even where the page does not name him, and nothing from this site is flagged. The 28 records added here follow that rule. The items held back in the pilot are now cataloged: the WSID pages (plane, Ashura fast, jurist passes away), the imsak/fajr article (fiqh, fasting), and "Why Does Islam Have So Many Laws?" (non-fiqh, `article`). The earlier "Skipped (fiqh, marja not stated)" entries above are superseded by this decision.

Points for the owner:
- The three "Top 10 Advice from Sayyid al-Sistani" posts (2022) show only an introduction and an embedded Instagram post. The ten points are not in the fetched page or in the feed. Their records describe the topic only and are classed non-fiqh (`article`, `authors: sistani`). Check the ten points before relying on the classification. If any point is a ruling, the record must become fiqh.
- "Regarding a Member of the Clergy Who Claims Strange Things..." (2022) is a question and reply from the office. It is classed fiqh (social conduct), with `authors: sistani`.
- "Why Are There Varying Dates for Some Islamic Events?" is classed non-fiqh (calendar history).
- "Expressions of Togetherness | Pope Francis and Sayyid al-Sistani" (video page, `/expressions-of-togetherness-pope-francis-and-sayyid-al-sistani`) is still not cataloged. It is separate from the letter record "Ayatullah Sayyid al-Sistani's Letter to Pope Francis".
- Authors: letters, statements and advice by Sayyid al-Sistani are listed as `authors: sistani`. Reports and guides with no named author are left blank, and the UN Secretary-General's letter is left blank because no author entry exists for him.


## Institutes batch (2026-11-12): Tasneem, Shia Research Institute, Hujjah Seminary

Skipped, with reasons:

- tasneeminstitute.org: Introduction to Islamic Law (https://tasneeminstitute.org/courses/introduction-to-islamic-law/): fiqh-subject course; page names no marja. Skipped under the open institute-fiqh question.
- tasneeminstitute.org: Fiqh Made Easy: Practical Principles (https://tasneeminstitute.org/courses/fiqh-made-easy-practical-principles/): fiqh-subject course; page names no marja. Skipped under the open institute-fiqh question.
- tasneeminstitute.org: Introduction to Arabic Grammar (https://tasneeminstitute.org/courses/introduction-to-arabic-grammar/): Arabic language course; no heading fits. Propose heading arabic-language.
- tasneeminstitute.org: The Islamic Prayer (https://tasneeminstitute.org/courses/the-islamic-prayer/): fiqh-subject course; page names no marja. Skipped under the open institute-fiqh question.
- tasneeminstitute.org: Introduction to Islamic Legal Theory (https://tasneeminstitute.org/courses/introduction-to-islamic-legal-theory/): fiqh-subject course; page names no marja. Skipped under the open institute-fiqh question.
- tasneeminstitute.org: Ijtihad and Taqlid (https://tasneeminstitute.org/courses/ijtihad-and-taqlid/): fiqh-subject course; page names no marja. Skipped under the open institute-fiqh question.
- tasneeminstitute.org: The Fiqh of Food (https://tasneeminstitute.org/courses/the-fiqh-of-food/): fiqh-subject course; page names no marja. Skipped under the open institute-fiqh question.
- tasneeminstitute.org: Laws of Fasting (https://tasneeminstitute.org/courses/laws-of-fasting/): fiqh-subject course; page names no marja. Skipped under the open institute-fiqh question.
- tasneeminstitute.org: Faith and Finance (https://tasneeminstitute.org/courses/faith-and-finance/): fiqh-subject course; page names no marja. Skipped under the open institute-fiqh question.
- tasneeminstitute.org: The History of Du'a and Ziyarah (https://tasneeminstitute.org/courses/history-of-dua-and-ziyarah/): page states no price (only a "Start free" button), so price_tag cannot be set from the page.
- tasneeminstitute.org: The Confident Muslim (https://tasneeminstitute.org/in-person-courses/confident-muslim/): in-person course: page gives no price and no dates (only "Next dates: To be announced"), so price_tag cannot be set from the page.
- tasneeminstitute.org: Family Matters (https://tasneeminstitute.org/in-person-courses/family-matters/): in-person course: page gives no price and no dates (only "Next dates: To be announced"), so price_tag cannot be set from the page.
- tasneeminstitute.org: Perfecting Noble Character (https://tasneeminstitute.org/in-person-courses/noble-character/): in-person course: page gives no price and no dates (only "Next dates: To be announced"), so price_tag cannot be set from the page.
- tasneeminstitute.org: The Case for the Creator (https://tasneeminstitute.org/in-person-courses/case-for-creator/): in-person course: page gives no price and no dates (only "Next dates: To be announced"), so price_tag cannot be set from the page.
- tasneeminstitute.org: Self-Knowledge (https://tasneeminstitute.org/in-person-courses/self-knowledge/): in-person course: page gives no price and no dates (only "Next dates: To be announced"), so price_tag cannot be set from the page.
- tasneeminstitute.org: Navigating the -isms of Our Time (https://tasneeminstitute.org/in-person-courses/isms/): in-person course: page gives no price and no dates (only "Next dates: To be announced"), so price_tag cannot be set from the page.
- tasneeminstitute.org: The Miraculous Qur'an (https://tasneeminstitute.org/in-person-courses/miraculous-quran/): in-person course: page gives no price and no dates (only "Next dates: To be announced"), so price_tag cannot be set from the page.
- hujjahseminary.com: Islamic Law (Fiqh) - 01 (https://hujjahseminary.com/Course/1008): fiqh-subject course; page names no Sistani/Khamenei basis (Not a named marja. Page says rulings are based on the edicts of the majority of scholars.).
- hujjahseminary.com: Legal Theory (Usul) (https://hujjahseminary.com/Course/1010): fiqh-subject course; page names no Sistani/Khamenei basis (Not stated; covers methods, not specific rulings of a named marja.).
- hujjahseminary.com: Arabic Grammar (https://hujjahseminary.com/Course/1016): Arabic language / logic / speaking skills course; no heading fits. Propose headings arabic-language and islamic-study-skills.
- hujjahseminary.com: Islamic Law (Fiqh) - 02 (https://hujjahseminary.com/Course/1017): fiqh-subject course; page names no Sistani/Khamenei basis (Not stated.).
- hujjahseminary.com: Arabic Morphology (Sarf) (https://hujjahseminary.com/Course/1027): Arabic language / logic / speaking skills course; no heading fits. Propose headings arabic-language and islamic-study-skills.
- hujjahseminary.com: Rulings for Muslims in the West (https://hujjahseminary.com/Course/1025): fiqh-subject course; page names no Sistani/Khamenei basis (Not stated; page does not say which school's rulings are presented. Number of students shown: 95.).
- hujjahseminary.com: Islamic Law (Fiqh) - 03 (https://hujjahseminary.com/Course/1037): fiqh-subject course; page names no Sistani/Khamenei basis (Not stated.).
- hujjahseminary.com: Islamic Speaking (https://hujjahseminary.com/Course/1028): Arabic language / logic / speaking skills course; no heading fits. Propose headings arabic-language and islamic-study-skills.
- hujjahseminary.com: Islamic Law (Fiqh) - 04 (https://hujjahseminary.com/Course/1050): fiqh-subject course; page names no Sistani/Khamenei basis (Not stated.).
- hujjahseminary.com: Contemporary Islamic Law (Fiqh) (https://hujjahseminary.com/Course/1022): fiqh-subject course; page names no Sistani/Khamenei basis (Not stated; page does not name a school.).
- hujjahseminary.com: Islamic Law (Fiqh) - 05 (https://hujjahseminary.com/Course/1059): fiqh-subject course; page names no Sistani/Khamenei basis (Not stated.).
- hujjahseminary.com: Family Law (Fiqh) (https://hujjahseminary.com/Course/1056): fiqh-subject course; page names no Sistani/Khamenei basis (Page says the rulings follow the edicts of the majority of scholars.).
- hujjahseminary.com: Intro to Logic (Mantiq) (https://hujjahseminary.com/Course/1058): Arabic language / logic / speaking skills course; no heading fits. Propose headings arabic-language and islamic-study-skills.
- hujjahseminary.com: Jurisprudential Maxims (Qawa'ed Fiqhiyya) (https://hujjahseminary.com/Course/1041): fiqh-subject course; page names no Sistani/Khamenei basis (Not stated; page names no school.).
- hujjahseminary.com: Islamic Dietary Laws (https://hujjahseminary.com/Course/1065): fiqh-subject course; page names no Sistani/Khamenei basis (Page says the rulings discussed are based on the edicts of the majority of scholars.).
- hujjahseminary.com: Islamic Laws for Muslims in the West (https://hujjahseminary.com/Course/2089): fiqh-subject course; page names no Sistani/Khamenei basis (Not stated; page does not say which school's rulings are presented.).
- shiaresearch.ca: Contemporary Topics in Islamic Theology at the University of Toronto (https://shiaresearch.ca/courses/smt3810hs-contemporary-topics-in-islamic-theology/): credit course at the University of Toronto; the page states no price, so price_tag cannot be set from the page.
- shiaresearch.ca: Islam, Christianity and Modernity at the University of Toronto (https://shiaresearch.ca/courses/smt6800hf-islam-christianity-and-modernity/): credit course at the University of Toronto; the page states no price, so price_tag cannot be set from the page.
- shiaresearch.ca: Devotional Prayer in the Islamic Tradition, at the University of Toronto (https://shiaresearch.ca/courses/smt3367h-devotional-prayer/): credit course at the University of Toronto; the page states no price, so price_tag cannot be set from the page; its term (Fall 2025 to Winter 2026) has also passed.
- shiaresearch.ca: Holiness and Sainthood in Islamic Thought, at the University of Toronto (https://shiaresearch.ca/courses/smt3378h-holiness-and-sainthood/): credit course at the University of Toronto; the page states no price, so price_tag cannot be set from the page; its term (Fall 2025 to Winter 2026) has also passed.

Not cataloged, owner to decide:
- hujjahseminary.com FAQ (`/Home/IndexFaqs`): one very large page of fiqh questions and answers. Almost all answers are unattributed ("scholars", "most scholars"); Sayyid Sistani is named in two answers, Ayatollah Shirazi in one, Sayyid Khamenei in none. It has no per-question links. It does not present one marja's rulings, so under the fiqh rule it is not cataloged. The owner expected a Sistani Q&A; please confirm.
- shiaresearch.ca other item types: 34 Insight Interviews (`/insight-interviews/ep-N/`), conferences and lectures, publications and blog posts. Not cataloged; each type needs a scope decision.
- SRI micro-certificate: four component courses sit on stmikes.utoronto.ca (another domain, not an approved source). Only the programme page is cataloged.
- Instructors are named on many pages but `instructors` is left blank (as for Mizan) because scholars.yaml has no entries for them. Owner to decide whether to add them.
- Hujjah `/AboutUs` shows info@hujjahseminary.com but the mailto link points to a different domain; worth checking before the owner contacts them.
- Tasneem "Hell in the Quran" says "Class begins on June 10th 2023" but the page does not say it has ended, so it was cataloged.

### Update 2026-11-13
Owner decisions on the institutes batch: fiqh-subject courses are in scope (taught by scholars), so the 8 Tasneem and 12 Hujjah fiqh courses listed above were cataloged after all, with `marja` blank. The fiqh questions and answers on al-islam.org are Sayyid Sistani's per the owner (2026-11-13), so they use marja sistani (none cataloged yet). The Hujjah FAQ page and the extra SRI item types stay uncataloged for now. Instructors are not added to `scholars.yaml` (authors only).
## Skipped (polemical)
- 2026-11-12 | Beliefs: Do the Shi'ah Believe in a Different Quran | https://al-islam.org/articles/beliefs-do-shiah-believe-different-quran | Mainly a rebuttal of accusations against Shia belief about the Quran (Sunni-Shi'a topic tag); skipped under the polemic rule, owner may review.

## Skipped (fiqh by other authors) - al-islam.org articles batch (2026-11-12)
- 2026-11-12 | Hijab, The Dress of Modesty in Islam | https://al-islam.org/articles/hijab-dress-modesty-islam-sayyid-saeed-akhtar-rizvi | Author Sayyid Saeed Akhtar Rizvi (not Sistani or Khamenei). Page is a booklet whose main purpose is stating the legal rules of hijab (what must be covered, what is allowed); fiqh rule applies.
- 2026-11-12 | Laws and Practices: Why Do Muslims Have a Dress Code | https://al-islam.org/articles/laws-practices-why-do-muslims-have-dress-code | Not fetched; title and the site's 'Laws' grouping point to rulings. Skipped on the title alone (fiqh by other authors, marja not stated). Owner may review.

## imam-us.org batch 3 (2026-11-12): skipped and not reached
- 2026-11-12 | Missed the Hajj Webinar? Watch the Recording Now! (video, 2025-05-14) | https://imam-us.org/missed-the-hajj-webinar-watch-the-recording-now | Skipped (fiqh, marja not stated). The page is a video guide to "the most important rulings of Hajj" by Dr. Shaykh Faiyaz Jaffer; it names no marja. Owner may decide.
- 2026-11-12 | Its Only $10.00: How Is Zakat al-Fitrah Calculated (blog, 2026-02-11) | https://imam-us.org/its-only-10-00-how-is-zakat-al-fitrah-calculated_2026 | Skipped (fiqh, marja not stated). A yearly price guide for zakat al-Fitrah; the page does not name Sistani or Khamenei.
- 2026-11-12 | Advice from Ayatullah Shaykh Ishaq al-Fayyad to Believers in the West (video, 2022-09-03) | https://imam-us.org/advice-from-ayatullah-shaykh-ishaq-al-fayyad-to-believers-in-the-west | Skipped. Advice from the office of Ayatullah al-Fayyad, who is not an approved marja for fiqh. The page is a visit report whose advice may include rulings; owner to decide.
- 2026-11-12 | Reflections on 2025 and Prayers for a Year of Justice and Peace in 2026 (blog, 2025-12-24) | https://imam-us.org/reflections-on-2025-and-prayers-for-a-year-of-justice-and-peace-in-2026 | Skipped as an announcement-type community letter (greetings and year-end message).
- 2026-11-12 | Inspiration from Prophet Muhammad (pbuh&hp) (video, 2023-10-03) | https://imam-us.org/inspiration-from-prophet-muhammad-pbuhhp | Not cataloged. The page text is two sentences plus links to other posts, too little to describe.
- 2026-11-12 | Video: Advice of the Supreme Religious Authority to the Preachers and Public Speakers (video, 2018-10-12) | https://imam-us.org/video-advice-of-the-supreme-religious-authority-to-the-preachers-and-public-speakers | Not cataloged. It appears to cover the same advice as the Top 10 speakers record (imam-us-top-10-advice-hussaini-speakers). Owner to decide whether the video is a separate record.
- 2026-11-12 | Martyrdom anniversaries 1447 and 1448 AH; Congratulations on Eid al-Ghadir 1447 (blogs) | https://imam-us.org/martyrdom-anniversary-of-imam-hussain-ibn-ali-p-1448-a-h and the other two | Skipped as announcements. Not fetched.
- 2026-11-12 | /category/rise (6 items: R-I-S-E workshop, training, conference, webinar and highlight posts) | https://imam-us.org/category/rise | Skipped by title as event and news reports (announcement rule). Not fetched.
- 2026-11-12 | Get Your Copy of Spiritual Journeys... (books) | https://imam-us.org/get-your-copy-of-spiritual-journeys-through-the-daily-supplications-of-the-holy-month-of-ramadan-today | Skipped as a shop page.
- 2026-11-12 | Older posts of /category/articles, /category/books, /category/video, /category/blogs | The category feeds stop at 10 items and ?paged=2 on the feed returns the same first 10 posts. The HTML archive loads older posts by AJAX, so they could not be listed. Not cataloged beyond the feed items.
- 2026-11-12 | "Lets Talk Religion" episodes 2, 4, 6, 8, 9, 10, 11 and "I.M.A.M. at Home" other episodes (video) | https://imam-us.org/lets-talk-religion-ep-2-3 and similar sitemap entries | Seen in the post sitemap only, not fetched in batch 3. Category membership is inferred from the video- slug and "Video" title; still to do.

## Mizan batch 2 (courses, 2026-11-12): skipped items
Owner decision 2026-11-12: Mizan records are never flagged `needs_review`. The skips below follow the existing rules; the open owner questions from the pilot still apply.

## Skipped (fiqh course) - mizaninstitute.org batch 2 (2026-11-12)
- 2026-11-12 | Winter Camp Bundle for Teens ($100) | https://mizaninstitute.org/courses/winter-camp-bundle-for-teens/ | bundle whose sessions are "Teens Intermediate Rulings of Salat" (fiqh, no marja stated) plus Proofs of Prophethood sessions. Also dated April 2025 sessions. Skipped as fiqh.
- 2026-11-12 | Women's Ahkam 2 (sisters-only) | https://mizaninstitute.org/courses/womens-ahkam-2/ | fiqh; page does not name Sistani or Khamenei (same as Women's Ahkam, batch 1)

## Skipped (ended or dates passed) - mizaninstitute.org batch 2 (2026-11-12)
- 2026-11-12 | The Mahdi Part 1, Online Recording June 2025 | https://mizaninstitute.org/courses/the-mahdi-part-1-online-recording-june-2025/ | live session with past dates, recording access only; same class as Death & Barzakh (owner decision 4). Not "closed" on the page.
- 2026-11-12 | The Mahdi Part 2, Online September 2025 | https://mizaninstitute.org/courses/the-mahdi-part-2-online-september-2025/ | same class as Part 1. Page oddity for the owner: its Materials list has a Secrets of Salat booklet, and its session list includes "Teens Purpose of Creation - October 2025" sessions.
- 2026-11-12 | The Mahdi Part 3, Online November 2025 | https://mizaninstitute.org/courses/the-mahdi-part-3-online-november-2025/ | live dates Nov 22-23 (2025) have passed; recording access only
- 2026-11-12 | The Mahdi Part 4, Online February 2026 | https://mizaninstitute.org/courses/the-mahdi-part-4-online-february-2026/ | live dates Feb 7-8 (2026) have passed; recording access only
- 2026-11-12 | Mizan Q&A For Teens (Teens Q&A) | https://mizaninstitute.org/courses/teensqna/ | live Q&A on December 6 (page dated 2025-11-17, so the session has passed)
- 2026-11-12 | Teens Purpose of Creation Recording October 2025 | https://mizaninstitute.org/courses/teens-purpose-of-creation-recording-october-2025/ | page says "This course is currently closed"

## Skipped (borderline ritual, owner to decide) - mizaninstitute.org batch 2 (2026-11-12)
- 2026-11-12 | Teens Secret of Salat Online Recording July 2025 | https://mizaninstitute.org/courses/teens-secret-of-salat-recording-july-2025/ | title only, not fetched; same question as Secrets of Salat (ritual meanings; owner to decide)
- 2026-11-12 | Secrets of Salat Online Recording November 2024 | https://mizaninstitute.org/courses/secrets-of-salat-online-recording-november-2024/ | title only, not fetched; same question; dated
- 2026-11-12 | Secrets of Salat Online Recording April 2025 | https://mizaninstitute.org/courses/secrets-of-salat-online-recording-april-2025/ | title only, not fetched; same question; dated

## Skipped (promotional or bundle) - mizaninstitute.org batch 2 (2026-11-12)
- 2026-11-12 | Mizan Teens Webinar Recording (free) | https://mizaninstitute.org/courses/mizan-teens-webinar-recording/ | a recorded information webinar about the Mizan Teens program, not a teaching course; owner to decide whether such recordings count
- 2026-11-12 | Lesson Per Page Bundle | https://mizaninstitute.org/courses/lesson-per-page-bundle/ | product bundle of series already cataloged as separate records; not fetched
- 2026-11-12 | Lesson Per Page Seasons 1-4 Bundle | https://mizaninstitute.org/courses/lesson-per-page-seasons-1-4-bundle/ | product bundle of series already cataloged as separate records; not fetched
- 2026-11-12 | Abu Hurayra and the Falsification of Traditions (Hadith) | https://al-islam.org/articles/abu-hurayra-and-falsification-traditions-yasin-al-jibouri | Not fetched; title is a critique of a named Companion's narrations, so treated as polemical against another group. Owner may review.
- 2026-11-12 | Islam the First and Last Religion | https://al-islam.org/articles/islam-first-and-last-religion-mansour-leghaei | Mainly argues for Islam over earlier scriptures and critiques the Bible (contains a 'Some Facts about the Bible' section); skipped under the polemic rule. Owner may review.
- 2026-11-12 | The Narration (Hadith) of Hudhayfah Ibn Al-Yaman | https://al-islam.org/articles/narration-hadith-hudhayfah-ibn-al-yaman | Translator's introduction stresses disowning (tabarra) those blamed for opposing Imam Ali, and the narration is about companions' conduct; skipped under the polemic rule. Owner may review.

## imam-us.org batch 4 (2026-11-12): skipped and open
- 2026-11-12 | Let's Talk Religion, "Join us for Episodes 2 & 3", "Episodes 4 & 5", "Episodes 6 & 7" and "Episodes 10 & 11" (announcements) | https://imam-us.org/lets-talk-religion-ep-2-3 (fetched; the other three not fetched) | Skipped as event notices. The episode pages they announce are cataloged separately (episodes 2, 4, 6, 8, 9, 10, 11).
- 2026-11-12 | I.M.A.M. at Home promos: Ramadan edition (https://imam-us.org/imam-at-home-ramadan-edition), weeks 2 and 4 (https://imam-us.org/week-2-imam-at-home-ramadan-edition, https://imam-us.org/week-4-imam-at-home-ramadan-edition), Muharram edition 1442 (https://imam-us.org/imam-at-home-muharram-1442) and two Muharram 2020 edition pages (https://imam-us.org/i-m-a-m-at-home-muharram-edition-timeless-lessons-from-karbala-with-shaykh-faiyaz-jaffer and https://imam-us.org/i-m-a-m-at-home-muharram-edition-inspirations-from-ashura-with-sayyid-muntadher-aljabery) | Skipped as event notices. Week 2 and 4 pages list fiqh topics (social media rulings, fidyah) as the episode subjects.
- 2026-11-12 | I.M.A.M. Presents: Is Mental Health Psychology Compatible with Islam? (live event, 2021-02-09) | https://imam-us.org/i-m-a-m-presents-islam-and-mental-health-psychology | Skipped as an event notice. Its recording, https://imam-us.org/video-islam-and-mental-health-psychology-compatible-or-incompatible, was not fetched; owner may ask for it.
- 2026-11-12 | Exploring the Holy Quran: Applied Lessons on Faith, Human Nature, and Navigating Life (2025-10-16) | https://imam-us.org/exploring-the-holy-quran-applied-lessons-on-faith-human-nature-and-navigating-life | Skipped as a promotion for a live weekly series (starts 2025-10-20, 10 weeks). Could be cataloged once the series is over, or as a course-like series; owner to decide.
- 2026-11-12 | Islam Weekly video series (about 90 "video-islam-weekly-..." and similar sitemap entries) | sitemap only | Not fetched in batch 4. Many of the titles are fiqh questions (for example permissibility, fasting, vaccines, leather, zakat al-Fitrah, divorce), which are skipped under the fiqh rule where no marja is named. Some titles look like non-fiqh talks (civic engagement, evolution, social pressure, thankfulness and giving). Owner to decide whether to harvest them in a later batch.
- 2026-11-12 | Advice from Ayatullah Shaykh Ishaq al-Fayyad to Believers in the West (batch 3 note, unchanged) | still skipped: other marja.
- 2026-11-12 | Missed the Hajj Webinar (video, 2025-05-14) and Zakat al-Fitrah 2026 price guide (blog, 2026-02-11) | Batch 3 holds are now cataloged as fiqh with marja sistani, per owner decision 2026-11-12. Neither page names Sistani; the record follows the site's fiqh marja. The zakat record's title is a page heading ("How Is the Monetary Value Calculated") rather than the page title, which states an amount.

## Skipped (fiqh, marja not stated) - Islam Weekly batch (2026-11-12)

Checked the body text of each page: none names Sayyid Sistani or Sayyid Khamenei as the source of the rulings (the only one that does is the COVID-19 vaccine rulings page, which is cataloged). Owner to decide whether any of these should be cataloged once the site confirms its marja.

- 2020-11-20 | Islamic Rulings on the Use of Marijuana | https://imam-us.org/video-islam-weekly-islamic-rulings-on-the-use-of-marijuana | Fiqh question; marja not stated.
- 2021-01-22 | Abortion and Morning-After Pills | https://imam-us.org/video-islam-weekly-abortion-and-morning-after-pills | Fiqh question; marja not stated.
- 2021-02-12 | Is it Permissible to Celebrate Valentine's Day? | https://imam-us.org/video-islam-weekly-is-it-permissible-to-celebrate-valentines-day | Fiqh question; marja not stated.
- 2021-03-05 | Can a Wife Divorce her Husband? | https://imam-us.org/video-islam-weekly-can-a-wife-divorce-her-husband | Fiqh question on divorce; marja not stated.
- 2021-04-02 | Wiswas | https://imam-us.org/video-islam-weekly-wiswas | Fiqh question on doubts during prayer; marja not stated.
- 2021-04-09 | Can I Receive the COVID-19 Vaccine While Fasting? | https://imam-us.org/video-islam-weekly-can-i-receive-the-covid-19-vaccine-while-fasting | Fiqh question; marja not stated.
- 2021-04-23 | Is it Permissible for a Muslim to Attend Prom? | https://imam-us.org/video-is-it-permissible-for-a-muslim-to-attend-prom-islam-weekly | Fiqh question; marja not stated.
- 2021-05-07 | Zakat al-Fitrah | https://imam-us.org/video-zakat-al-fitrah-islam-weekly | Fiqh (zakat al-fitra); marja not stated.
- 2021-05-21 | Permissibility of Alcohol | https://imam-us.org/permissibility-of-alcohol-islam-weekly | Fiqh question; marja not stated.
- 2021-05-28 | Do I Have To Go To Hajj? | https://imam-us.org/video-do-i-have-to-go-to-hajj-islam-weekly | Fiqh (obligation of Hajj); marja not stated.
- 2021-06-18 | Is Birth Control Permissible in Islam? | https://imam-us.org/video-is-birth-control-permissible-in-islam-islam-weekly | Fiqh question; marja not stated.
- 2021-06-25 | Is it Permissible to Perform Salat While Wearing Leather? | https://imam-us.org/video-is-it-permissible-to-perform-salat-while-wearing-leather-islam-weekly | Fiqh question; marja not stated.
- 2021-11-12 | Difference Between Obligatory and Recommended Precautions | https://imam-us.org/video-difference-between-obligatory-and-recommended-precautions-islam-weekly | Explains fiqh terminology from a book of Islamic laws; the book and marja are not named on the page.

Note: the Islam Weekly series has 50 sitemap entries whose slug contains "islam-weekly" (the batch brief expected about 90). Remaining unfetched entries from the sitemap: none; all 50 were read in this batch, 37 cataloged and 13 skipped as above.

## duas.org pilot (2026-11-12): skipped, not cataloged
- 2026-11-12 | Dua Ahad | https://www.duas.org/mobile/dua-ahad.html | The page's data file has an English description but no dua text segments, so the English text could not be confirmed. Skipped for now; the owner or a later pass can add it once the English text is checked on the page.
- 2026-11-12 | Hadith Kisa | https://www.duas.org/mobile/hadith-kisa.html | A hadith narration rather than a dua or ziyarat. Under the hadith rules it would be `hadith`, not this site's `other` tag; left out of the duas pilot.
- 2026-11-12 | Munajat Shabaniyyah | (search of the index pages read) | Not found on the All Sections or Shaban index pages read. Not catalogued.
- 2026-11-12 | Dua Nudba, Dua Faraj, Ziyarat of Imam Mahdi, Abu Hamza Thumali | see progress/failed-duas.org.txt | Dynamic stub pages with no data file found (or not checked). Owner may want to ask the site owner whether the English text is still published.
- 2026-11-12 | Calendar, shop, forum, app and external links on duas.org | docs/duas-org-structure.md, section "Out of scope" | Not catalogued by design (scope).

## imam-us.org batch 3 sitemap pass (2026-11-12)

Records cataloged from the post sitemaps: 46 (see data/records/imam-us/, cataloged_on 2026-11-12, batch 3 sitemap pass). One fiqh record with Sistani as marja: The Day of Arafah (imam-us-day-of-arafah); one with Sistani's rulings: 3rd Rakat or 4th? (imam-us-rules-of-doubt-third-or-fourth-rakat).

## Skipped (fiqh, marja not stated) - imam-us.org batch 3
- 2022-03-14 | Islamic Laws of Fasting | https://imam-us.org/islamic-laws-of-fasting | Book page; Sistani is not named on the page text.
- 2021-11-15 | What Should I Do? - Can I Play Cards With My Friends? | https://imam-us.org/what-should-i-do-can-i-play-cards-with-my-friends | Names only "a jurist"; no marja.
- 2021-03-04 | What Should I Do? - Halal Meat | https://imam-us.org/what-should-i-do-halal-meat | Fiqh Q&A; no marja named.
- 2021-09-20 | What Should I Do? - Ziyarat Arbaeen or Hajj? | https://imam-us.org/what-should-i-do-ziyarat-arbaeen-or-hajj | Names only "a jurist"; no marja.

## Skipped (no free copy on the page) - imam-us.org batch 3
- 2016-2023 | 100 Pearls: Advice from Grand Ayatullah al-Sayyid Ali al-Sistani | https://imam-us.org/100-pearls-advice-from-grand-ayatullah-al-sayyid-ali-al-sistani | Only an Arabic PDF is linked; no English copy found.
- 2016-12-02 | Tajwid - A Guide to Quranic Recitation | https://imam-us.org/tajwid-a-guide-to-quranic-recitation | Book page with no free copy on the page.
- 2016-06-04 | FASTING - A Haven from Hellfire | https://imam-us.org/fasting-a-haven-from-hellfire | Book page with no free copy on the page; author not named on the page.
- 2023-07-04 | Shaykh Tusi: An Annotated Bibliography | https://imam-us.org/shaykh-tusi-an-annotated-bibliography | Book page with no free copy on the page.
- 2016-09-01 | The Illuminating Lantern | https://imam-us.org/the-illuminating-lantern | Book page with no free copy on the page; author (Shaykh Habib al-Kadhimi) not in scholars.yaml.

## Skipped (event notice or announcement) - imam-us.org batch 3
- 2021-10-05 | Sayyid M.B. Kashmiri Participates in University of Nebraska-Lincoln Debate Series | https://imam-us.org/video-the-problem-of-pain-and-suffering | Event report.
- 2021-02-24 | Video: Islam and Mental Health Psychology: Compatible or Incompatible? | https://imam-us.org/video-islam-and-mental-health-psychology-compatible-or-incompatible | Webinar promotion; little description on the page.
- 2021-06-14 | Spiritual Abuse | Understanding & Healing as a Community | https://imam-us.org/spiritual-abuse-understanding-healing-as-a-community | Webinar notice.
- 2020-02-03 | Let's Talk Religion - Join us for Episodes 2 & 3 | https://imam-us.org/lets-talk-religion-ep-2-3 | Announcement.
- 2025-11-21 | The Hawzah Between Heritage and Modernity - MIT Sessions | https://imam-us.org/the-hawzah-between-heritage-and-modernity-mit-sessions | Event report.

## Skipped (other worker's series or other marja) - imam-us.org batch 3
- 2021-08-27 | Video - Imam Hussain (p) and Dignity | https://imam-us.org/imam-hussain-p-and-dignity | Islam Weekly series (another worker).
- 2021-03-19 | Video - Islam Weekly: Istikhara and Making a Right Decision | https://imam-us.org/istikhara-and-making-a-right-decision | Islam Weekly series (another worker).
- Advice from Ayatullah Shaykh Ishaq al-Fayyad to believers in the West (title only, not fetched) | Other marja, out of scope.

## Skipped (too little text on the page) - imam-us.org batch 3
- 2024-02-19 | 12 Signs Accompanying the Reappearance of the Awaited Mahdi (p) | https://imam-us.org/12-signs-accompanying-the-reappearance-of-the-awaited-mahdi-pbuh | The page body is only a shortcode; the list of signs is not in the HTML text.
- 2021-09-19 | The Merits & Etiquette of Ziyarat Imam Hussain (p) | https://imam-us.org/the-merits-etiquette-of-ziyarat-imam-hussain-p | Body is a video embed and related-post links only.

## Skipped (fiqh by other authors) - al-islam.org chapters batch (2026-11-12)

2026-11-12 | Discovering Islam, "Islamic Practices" chapter (Moustafa Al-Qazwini) | https://al-islam.org/discovering-islam-sayyid-moustafa-al-qazwini/islamic-practices | Not cataloged: chapter's main purpose is the practices of prayer, fasting, zakat-khums, hajj and jihad, which is fiqh by an author other than Sistani or Khamenei.
2026-11-12 | Discovering Shi'i Islam, "Chapter 4: Practices" (Mohammad Ali Shomali) | https://al-islam.org/discovering-shii-islam-mohammad-ali-shomali/chapter-4-practices | Not cataloged: chapter's main purpose is the Shia practices (daily prayers, fasting, pilgrimage, almsgiving), which is fiqh by an author other than Sistani or Khamenei.

## imam-us.org series 2 (2026-11-12): skipped
Fiqh, marja not stated:
- 2021-01-27 | ICYMI: How are Islamic Laws Produced? | https://imam-us.org/icymi-how-are-islamic-laws-produced (fiqh methodology; no marja named)
- 2021-05-12 | The Etiquette of Eid & Crescent Sightings | Instagram Live | https://imam-us.org/the-etiquette-of-eid-crescent-sightings-instagram-live (covers Zakat al-Fitrah and Eid-night rules; no marja named)

Event notices (live sessions or series sign-ups, no recorded content on the page):
- 2020-08-19 | I.M.A.M. Presents I.M.A.M. at Home: The Muharram Edition | https://imam-us.org/imam-at-home-muharram-1442
- 2020-08-25 | I.M.A.M. at Home: Muharram Edition - Inspirations from Ashura with Sayyid Muntadher Aljabery | https://imam-us.org/i-m-a-m-at-home-muharram-edition-inspirations-from-ashura-with-sayyid-muntadher-aljabery
- 2020-08-20 | I.M.A.M. at Home: Muharram Edition - Timeless Lessons From Karbala with Shaykh Faiyaz Jaffer | https://imam-us.org/i-m-a-m-at-home-muharram-edition-timeless-lessons-from-karbala-with-shaykh-faiyaz-jaffer
- 2020-04-27 | I.M.A.M. Presents I.M.A.M. at Home: The Month of Ramadan Edition | https://imam-us.org/imam-at-home-ramadan-edition
- 2020-05-04 | This Week on I.M.A.M. at Home: The Month of Ramadan Edition (week 2) | https://imam-us.org/week-2-imam-at-home-ramadan-edition
- 2020-05-18 | This Week on I.M.A.M. at Home: The Month of Ramadan Edition (week 4) | https://imam-us.org/week-4-imam-at-home-ramadan-edition
- 2021-03-22 | The Inner Dimensions of Supplication (Instagram Live notice) | https://imam-us.org/the-inner-dimensions-of-supplication
- 2021-10-23 | Live Webinar: The Contributions of Imam Jafar al-Sadiq (p) | https://imam-us.org/the-contributions-of-imam-jafar-al-sadiq-p
- 2021-08-04 | Etiquette of Majlis | Instagram Live (notice) | https://imam-us.org/etiquette-of-majlis-instagram-live
- 2021-09-19 | The Merits & Etiquette of Ziyarat Imam Hussain (p) (notice) | https://imam-us.org/the-merits-etiquette-of-ziyarat-imam-hussain-p
- 2025-10-16 | Exploring the Holy Quran: Applied Lessons on Faith, Human Nature, and Navigating Life (10-week live series sign-up) | https://imam-us.org/exploring-the-holy-quran-applied-lessons-on-faith-human-nature-and-navigating-life
- 2026-02-20 | Why Allah Repeats the Same Stories (live lecture notice) | https://imam-us.org/why-allah-repeats-the-same-stories
- 2025-12-01 | Serve Your Community (volunteer recruitment) | https://imam-us.org/serve-your-community

Login or paywall (book content not free):
- 2016-12-02 | Tajwid - A Guide to Quranic Recitation (PDF and print/eBook behind login or purchase) | https://imam-us.org/tajwid-a-guide-to-quranic-recitation

Not fetched (outside the requested list or not reviewed): the-night-prayer, meditate-your-mind, and similar pages in the sitemap.

## imam-us.org batch, 2026-11-12 (fiqh Q&A, explainers, videos, free books)

## Skipped (login-gated, imam-us.org)
- 2023-10-27 | Islamic Laws of Food & Drink (PDF behind login) | https://imam-us.org/islamic-laws-of-food-drink
- 2023-07-12 | Islamic Laws of Medicine (PDF behind login) | https://imam-us.org/islamic-laws-of-medicine
- 2022-03-14 | Islamic Laws of Fasting (PDF behind login) | https://imam-us.org/islamic-laws-of-fasting
- 2018-07-12 | Islamic Laws of Expiation (PDF behind login) | https://imam-us.org/islamic-laws-of-expiation-by-sayyid-sistani
- 2018-09-07 | Islamic Laws of the Will (PDF behind login) | https://imam-us.org/islamic-laws-of-will-by-grand-ayatullah-sistani
- 2024-10-04 | Islamic Laws of the Female Reproductive Cycle (PDF behind login) | https://imam-us.org/islamic-laws-of-the-female-reproductive-cycle-menstrual-postpartum-and-non-menstrual-bleeding
Note: Islamic Laws of Death and Burial was cataloged because its PDF link is public (no login).

## Skipped (contested, owner to decide)
- 2017-09-25 | Clarification of Sayyid al-Sistani's Opinion on Tatbir (a reply to a public dispute over the marja's stated position; a sensitive ritual topic) | https://imam-us.org/clarification-sayyid-al-sistanis-opinion-tatbir

## Skipped (duplicate)
- 2022-04-19 | 3rd Rakat or 4th? Rules of Doubt in Four-Unit Prayer (second URL with the same title as imam-us-rules-of-doubt-third-or-fourth-rakat) | https://imam-us.org/rules-of-doubt-in-four-unit-prayers
- undated (not fetched) | Should I Get the COVID-19 Vaccine While Fasting? (WSID; topic already cataloged as imam-us-can-i-receive-the-covid-19-vaccine-while-fasting; not fetched) | https://imam-us.org/what-should-i-do-should-i-get-the-covid-19-vaccine-while-fasting

## Not fetched (requests limit)
- Other 2016-2026 "Reminder about Qada / Feed the Fasting" annual notices and the zakat al-Fitrah yearly guides: only the 2026 Qada reminder was cataloged; older years are near-duplicates.

## Skipped (polemical) - batch al-islam-chapters (2026-11-12)
- 2026-11-12 | An Introduction to the Glorious Quran, chapter 'Is there any Parallel to The Miraculous Qur'an?' | https://al-islam.org/introduction-glorious-quran-bahram-samii/there-any-parallel-miraculous-quran | Compares the Bible and the Qur'an to argue the Qur'an's uniqueness; treated as comparative polemic against another scripture, skipped.

## Skipped (fiqh, marja not stated) - duas.org M-Z batch (2026-11-12)
- Sajda Shukr / Thanksgiving Prostration | https://www.duas.org/mobile/sajda-shukr.html | the page is mainly a statement of rulings on the thanksgiving prostration (validity, how it may be done) and does not name Sistani or Khamenei as the source of those rulings. Not cataloged.
- Recommended Recitations During Salaat and the salat pages (Salaat Layl, Salaat of Masumeen, Salat Jafar Tayyar) were not fetched in this batch; they are listed in the scratch unprocessed.txt for the next worker to check under the fiqh rule.

## imam-us.org post-sitemap pass (2026-11-12): skipped and logged
### Skipped (fiqh, marja not stated or not an approved marja)
- 2026-11-12 | Fasting on the Day of Ashura | https://imam-us.org/fasting-on-ashura | response by Sayyid Mohammed Saeed al-Hakeem, who is not an approved marja. Owner to confirm.
- 2026-11-12 | Why Is Taqlid Necessary in Islam? | https://imam-us.org/taqlid-necessary-islam | fiqh methodology (emulation); no marja named on the page.
- 2026-11-12 | Principles of Emulation (Taqlid) | https://imam-us.org/principles-of-emulation-taqlid | fiqh methodology (conditions for a jurist); no marja named on the page.
- 2026-11-12 | ICYMI: How are Islamic Laws Produced? | https://imam-us.org/icymi-how-are-islamic-laws-produced | fiqh methodology conversation; Sistani mentioned only in passing.
- 2026-11-12 | The Hijab Meaning Explored | https://imam-us.org/hijab-meaning-explored | borders on dress rulings; Sistani named 5 times. Owner to decide whether it is fiqh.
- 2026-11-12 | The Horizon in the School of al-Sayyid al-Sistani | https://imam-us.org/the-horizon-in-the-school-of-al-sayyid-al-sistani | marja named; only the opening was read, so its purpose is not established. Owner to decide.
### Skipped (polemical)
- 2026-11-12 | Questions from the BBC about some inappropriate practices, and the responses to them | https://imam-us.org/questions-bbc-inappropriate-practices-responses | a rebuttal to media criticism of religious practices. Owner to decide.
### Skipped (duplicate)
- 2026-11-12 | Journey to Karbala: Arbaeen Guide | https://imam-us.org/journey-to-karbala-arbaeen-guide | same title and content as the record for https://imam-us.org/journey-to-karbala-arbaeen-guide-2 (already cataloged).
### Skipped (event notice, news, promotion or no text)
- Let's Talk Religion "join us" live-session notices: https://imam-us.org/lets-talk-religion-ep-2-3 , https://imam-us.org/lets-talk-religion-ep-4-5 , https://imam-us.org/lets-talk-religion-ep-6-7 , https://imam-us.org/lets-talk-religion-ep-10-11 , https://imam-us.org/lets-talk-religion-ep-1-introduction-ubudiyyah , https://imam-us.org/m-m-presents-lets-talk-religion
- Event or webinar notices: https://imam-us.org/connect-with-the-marjaeya-muharram-1440 , https://imam-us.org/the-inner-dimensions-of-supplication , https://imam-us.org/spiritual-abuse-understanding-healing-as-a-community , https://imam-us.org/the-contributions-of-imam-jafar-al-sadiq-p
- News or event reports: https://imam-us.org/finding-unity-majalis-imam-hussain-p-photo-essay , https://imam-us.org/spiritual-journey-remember , https://imam-us.org/video-the-problem-of-pain-and-suffering
- Instagram live recap and service promotion: https://imam-us.org/icymi-lets-talk-thanksgiving , https://imam-us.org/introducing-azwaja
- No article text (only a widget and related-post links): https://imam-us.org/12-signs-accompanying-the-reappearance-of-the-awaited-mahdi-pbuh

## Skipped (duplicate, city event) - mizaninstitute.org batch 3 (2026-11-12)
- 2026-11-12 | Ethical Dilemmas, Ottawa (sisters only, Oct 7, $35 ticket) | https://mizaninstitute.org/ottawasisters/ | city event for the course already catalogued at https://mizaninstitute.org/ethical-dilemmas-godly-decision-making-and-moral-philosophy/ (mizan-ethical-dilemmas); not catalogued twice.

## Skipped (fiqh course) - mizaninstitute.org unprocessed batch (2026-11-13)
- 2026-11-13 | Ijtihad Unveiled | https://mizaninstitute.org/courses/ijtihad/ | a course on ijtihad, the method of deriving legal rulings from the sources; its subject is fiqh methodology and the page does not name Sistani or Khamenei as the source of rulings. Owner to confirm.
- 2026-11-13 | Intermediate Rulings of Salat - For Teens | https://mizaninstitute.org/courses/rulingsforteens/ | the subject is the rulings of salat itself (owner decision 2026-11-13: rulings courses are skipped).
- 2026-11-13 | Women's Ahkam | https://mizaninstitute.org/courses/womens-ahkam/ | rulings on hayd, istihadah and nifas (owner decision 2026-11-13: skipped).
- 2026-11-13 | Women's Ahkam Premium | https://mizaninstitute.org/courses/womens-ahkam-2/ | same course, premium version (owner decision 2026-11-13: skipped).

## Skipped (bundle or promotion) - mizaninstitute.org unprocessed batch (2026-11-13)
- 2026-11-13 | Lesson per Page Bundle (Seasons 1-3) | https://mizaninstitute.org/courses/lesson-per-page-bundle/ | bundle of earlier seasons, shown as closed.
- 2026-11-13 | Lesson Per Page Seasons 1-4 Bundle | https://mizaninstitute.org/courses/lesson-per-page-seasons-1-4-bundle/ | bundle of earlier seasons, shown as closed.
- 2026-11-13 | Winter Camp Bundle for Teens | https://mizaninstitute.org/courses/winter-camp-bundle-for-teens/ | bundle of two teens offerings sold together.

## Skipped (closed, no way to enrol) - mizaninstitute.org unprocessed batch (2026-11-13)
- 2026-11-13 | The Spirit of God | https://mizaninstitute.org/courses/436/ | the page shows "This course is currently closed", price "Closed", and no enrol or recording option (owner decision: skip).

## Catalogued with owner-decided inclusions - mizaninstitute.org (2026-11-13)
- Recordings and offerings shown as "Closed" with materials but no enrol button: mizan-secrets-of-salat-recording-april-2025, mizan-secrets-of-salat-recording-november-2024, mizan-teens-purpose-of-creation-recording-october-2025. Cost is recorded as "Closed" as shown. Owner to confirm these count as recording access.
- mizan-the-mahdi-part-3-online-november-2025 and mizan-the-mahdi-part-4-online-february-2026 are online runs of courses whose in-person versions are already catalogued (mizan-the-mahdi-part-3-signs-of-reappearance, mizan-the-mahdi-part-4). Separate records, separate URLs.
- mizan-teens-secret-of-salat and mizan-teens-secret-of-salat-recording-july-2025 are the course page and the July 2025 recording of the same teens course.

## imam-us.org half1 sitemap triage (2026-11-13): skipped and logged
Fetched 42 pages (43 requests with robots.txt); 14 cataloged (imam-us-* records added 2026-11-13). Most of the half1 slugs are announcements, moon-sighting and birthday or martyrdom notices, event sign-ups, competitions and fundraising, which the owner's skip list covers; those were dropped by slug without fetching.

## Skipped (fiqh, marja not stated) - imam-us.org half1
- https://imam-us.org/reminder-about-qada-make-up-fasts-fidyah-and-kaffarah-1442-2021 (2021-03-12): fiqh reminder; no marja named on the page. The 1439, 1440 and 1441 qada reminders were not fetched and are held on the same ground.
- https://imam-us.org/what-should-i-do-should-i-get-the-covid-19-vaccine-while-fasting (2021-04-19): WSID fiqh Q&A; no marja named. Also the same question as the cataloged imam-us-can-i-receive-the-covid-19-vaccine-while-fasting.
- https://imam-us.org/zakat-al-fitrah-2016 and the zakat-al-fitrah 2017, 2018, 2019 and 2020 pages: held as before (price guides, marja not stated); not fetched.

## Skipped (boundary, owner to decide) - imam-us.org half1
- https://imam-us.org/towards-greater-clarity-in-decision-making-part-iii-istikhara-terms-conditions-and-practical-application-in-contemporary-life (2019-03-13): sets out the terms and conditions of consultative istikhara and cites Sayyid al-Sistani's rulings (5 mentions). It reads as rules of practice, so it may be fiqh. Owner to say whether it is fiqh (marja sistani) or non-fiqh.
- https://imam-us.org/guidelines-for-conducting-muharram-1442-programs (2020-08-10): COVID-era rules for organisers of Muharram programmes from Sayyid al-Sistani's office. Practical rules, not clearly fiqh and not clearly announcements. Owner to decide. The 1443 version was not fetched.

## Skipped (duplicate) - imam-us.org half1
- https://imam-us.org/is-salat-al-ayaat-obligatory-for-a-penumbral-lunar-eclipse-11-30-2020 (2020-11-29): same question as the cataloged imam-us-is-salat-al-ayaat... record (url .../is-salat-al-ayaat-obligatory-for-a-penumbral-lunar-eclipse-according-to-sayyid-al-sistani). Not cataloged twice.
- https://imam-us.org/advice-public-speakers-muharram (2017-09-18): same advice as the cataloged video page video-advice-of-the-supreme-religious-authority-to-the-preachers-and-public-speakers.
- https://imam-us.org/webinar-at-the-crossroads-of-religious-obligation-and-medicine-what-to-know-about-islamic-rules-covid-19-and-vaccinations (2021-04-21): same webinar as the cataloged video-at-the-crossroads record.

## Skipped (event notice or announcement) - imam-us.org half1
- I.M.A.M. at Home series pages (imam-at-home-muharram-1442, imam-at-home-ramadan-edition, week-2 and week-4 imam-at-home-ramadan-edition, the two Muharram 1442 episode pages): live-stream notices.
- Instagram Live and live-event notices: the-merits-etiquette-of-ziyarat-imam-hussain-p, etiquette-of-majlis-instagram-live, preparing-for-the-month-of-ramadan, i-m-a-m-presents-school-work-and-beyond, i-m-a-m-presents-islam-and-mental-health-psychology, a-dialogue-with-cardinal-wilton-gregory-and-sayyid-m-b-kashmiri.
- Webinar recap: pope-francis-grand-imam-al-tayyeb-and-ayatollah-al-sistani-what-do-their-relationships-mean-for-us (Georgetown panel page, mainly an event notice).
- Welcome message for Ramadan by Sayyid M.B. Kashmiri (welcoming-holy-month-ramadan, 2018): welcome message, skipped as an announcement.
- Death anniversary notice: death-holy-prophet-islam-muhammad (2016).

## Skipped (news or report) - imam-us.org half1
- https://imam-us.org/icymi-sayyid-kashmiri-speaks-at-the-marifa-conference (2020-04-10): news recap of a keynote speech.
- https://imam-us.org/34916-2 (IMAM annual symposium report, 2019) and the 2016 self-enhancement competition highlights (1617-2): event reports and competition notices.
- https://imam-us.org/qc (Quran tajwid competition, 2021): competition.

## Skipped (too little text on the page) - imam-us.org half1
- https://imam-us.org/remembering-prophet-muhammad-pbuh-a-ssaf-shia-sunni-alliance-forum-presentation (2020-11-03): the page holds only a greeting; no description possible.
- https://imam-us.org/advice-marjaeya-religious-scholars-speakers-holy-month-muharram-1441-h (2019-08-31): link-only page; the statement itself is not on the page.

## Skipped (fiqh) - duas.org batch c (2026-11-13)
Pages whose main content is how to perform a prayer, or that state rulings. Fiqh by authors other than Sistani or Khamenei (or with no marja stated), so not cataloged.
- 2026-11-13 | Sajda Shukr (thanksgiving prostration) | https://www.duas.org/mobile/sajda-shukr.html | states rulings on when and how to perform the prostration
- 2026-11-13 | Death related duas (includes rulings on care of the dying) | https://www.duas.org/death.htm | mixed page; ruling statements (wajib) on the dying person
- 2026-11-13 | Tahajjud / Salaat Layl | https://www.duas.org/mobile/tahajjud-salat-shab.html | states rulings (obligatory and recommended status) with the procedure of the prayer
- 2026-11-13 | Salaat of Masumeen | https://www.duas.org/mobile/salat-masumeen.html | prayer procedure with recommendations on when to pray it
- 2026-11-13 | Sunday Zilqad Salaat | https://www.duas.org/mobile/zilqad-sunday-salat.html | states that the prayer is recommended, with rulings on ghusl and wudhu before it
- 2026-11-13 | Rajab Month Daywise Salaahs | https://www.duas.org/mobile/rajab-daywise-salaahs.html | prayer procedures (rak'ahs) for each night
- 2026-11-13 | Sha'ban Month Datewise Salaahs | https://www.duas.org/mobile/shaban-datewise-salaahs.html | prayer procedures (rak'ahs) for each night
- 2026-11-13 | Dua During Salaat | https://www.duas.org/dua_during_salaat.htm | etiquette and procedure of recitation within the prayer

## Skipped (other) - duas.org batch c (2026-11-13)
- Invocation (dhikr with a narration about Imam Hasan): narration-based, treated as hadith. https://www.duas.org/Misc/invocation.htm
- Seven Haykal: practice of blowing breath after recitation, meaning and use unclear from the page. https://www.duas.org/Misc/seven_haykal.htm
- Spiritual healings from the diary of Ayatullah Behjat: practical spiritual guidance attributed to a marja not in the approved list; owner to decide. https://www.duas.org/Aytbehjatduas.htm
- Hazrat Abbas (as) litany: Arabic only (14 English words). https://www.duas.org/hzabbasdua.htm
- Dua's for the Month of Rajab: index page of other duas, not a dua. https://www.duas.org/kamil.htm
- Sahifa dua 42 (completing the Quran): stub page, no English text. https://www.duas.org/mobile/sahifasajjadia-dua42-completing-quran.html

## Skipped (fiqh, marja not stated) - imam-us.org half2 (2026-11-13)
- 2026-11-13 | https://imam-us.org/islamic-laws-of-medicine | fiqh or fiqh-adjacent page; Sistani or Khamenei not named on the page (155 also duplicates the Food & Drink book at 311, which names Sistani).
- 2026-11-13 | https://imam-us.org/can-i-buy-a-car-during-muharram | fiqh or fiqh-adjacent page; Sistani or Khamenei not named on the page (155 also duplicates the Food & Drink book at 311, which names Sistani).
- 2026-11-13 | https://imam-us.org/should-i-move-into-a-new-home-during-muharram | fiqh or fiqh-adjacent page; Sistani or Khamenei not named on the page (155 also duplicates the Food & Drink book at 311, which names Sistani).
- 2026-11-13 | https://imam-us.org/islamic-laws-of-the-female-reproductive-cycle-menstrual-postpartum-and-non-menstrual-bleeding | fiqh or fiqh-adjacent page; Sistani or Khamenei not named on the page (155 also duplicates the Food & Drink book at 311, which names Sistani).
- 2026-11-13 | https://imam-us.org/islamic-laws-of-fasting | fiqh or fiqh-adjacent page; Sistani or Khamenei not named on the page (155 also duplicates the Food & Drink book at 311, which names Sistani).
- 2026-11-13 | https://imam-us.org/reminder-get-your-copy-of-islamic-laws-of-fasting-today | fiqh or fiqh-adjacent page; Sistani or Khamenei not named on the page (155 also duplicates the Food & Drink book at 311, which names Sistani).
- 2026-11-13 | https://imam-us.org/can-muslims-invest-in-a-401k-plan | fiqh or fiqh-adjacent page; Sistani or Khamenei not named on the page (155 also duplicates the Food & Drink book at 311, which names Sistani).
- 2026-11-13 | https://imam-us.org/know-your-prayer-times | fiqh or fiqh-adjacent page; Sistani or Khamenei not named on the page (155 also duplicates the Food & Drink book at 311, which names Sistani).
- 2026-11-13 | https://imam-us.org/introducing-the-i-m-a-m-khums-calculator | fiqh or fiqh-adjacent page; Sistani or Khamenei not named on the page (155 also duplicates the Food & Drink book at 311, which names Sistani).
- 2026-11-13 | https://imam-us.org/islamic-laws-of-food-drink | fiqh or fiqh-adjacent page; Sistani or Khamenei not named on the page (155 also duplicates the Food & Drink book at 311, which names Sistani).

## Skipped (polemical or sensitive, owner to decide) - imam-us.org half2 (2026-11-13)
- 2026-11-13 | https://imam-us.org/sayyid-sistanis-fatwa-about-the-companions-of-prophet-pbuhhp | a statement on the Companions or on the misuse of religious authority; owner to decide.
- 2026-11-13 | https://imam-us.org/an-important-advice-regarding-misuses-of-the-power-of-religious-authority-talaq-al-hakim-al-shari | a statement on the Companions or on the misuse of religious authority; owner to decide.

## Skipped (other marja, not approved) - imam-us.org half2 (2026-11-13)
- 2026-11-13 | https://imam-us.org/advice-from-ayatullah-shaykh-ishaq-al-fayyad-to-believers-in-the-west | advice from Ayatollah Ishaq al-Fayyad, who is not an approved marja. Fayyad's condolence page (425) is also out of scope as a statement.

## Skipped (duplicate of an existing record) - imam-us.org half2 (2026-11-13)
- 2026-11-13 | https://imam-us.org/islamic-laws-of-food-drink | same title or content as an existing imam-us-org record (see data/records/imam-us/).
- 2026-11-13 | https://imam-us.org/our-duties-in-the-period-of-occultation-insights-from-sayyid-al-sistani | same title or content as an existing imam-us-org record (see data/records/imam-us/).
- 2026-11-13 | https://imam-us.org/new-book-release-islamic-laws-of-death-and-burial | same title or content as an existing imam-us-org record (see data/records/imam-us/).
- 2026-11-13 | https://imam-us.org/advice-to-youth-ayatullah-sayyed-sistani | same title or content as an existing imam-us-org record (see data/records/imam-us/).
- 2026-11-13 | https://imam-us.org/who-is-hussain-english-spanish | same title or content as an existing imam-us-org record (see data/records/imam-us/).
- 2026-11-13 | https://imam-us.org/get-your-copy-of-who-is-hussain-and-who-is-zaynab-today-2 | same title or content as an existing imam-us-org record (see data/records/imam-us/).
- 2026-11-13 | https://imam-us.org/get-your-copy-of-who-is-hussain-and-who-is-zaynab-today | same title or content as an existing imam-us-org record (see data/records/imam-us/).

## Skipped (event, news, statement, fundraising, promotion) - imam-us.org half2 (2026-11-13)
- Statements and news (not catalogued): https://imam-us.org/ayatullah-sistani-fatwa-concerning-isis-attack-in-iraq https://imam-us.org/a-letter-of-congratulations-to-his-eminence-pope-francis https://imam-us.org/secretary-general-of-oic-visits-his-eminence-grand-ayatollah-sayyid-sistani https://imam-us.org/united-nations-delegation-visits-grand-ayatullah-al-sistani https://imam-us.org/statement-regarding-the-current-tragedy-and-oppression-spreading-in-the-world https://imam-us.org/an-important-message-from-the-office-of-grand-ayatollah-sayyid-al-sistani https://imam-us.org/official-statement-from-sayyid-sistani-on-the-recent-attacks-on-lebanon https://imam-us.org/sayyid-sistani-addresses-the-heinous-crimes-in-parachinar https://imam-us.org/statement-from-council-on-recent-defamatory-comments https://imam-us.org/condolence-statement-on-the-passing-of-his-holiness-pope-francis https://imam-us.org/i-m-a-m-welcomes-his-holiness-pope-leo-xivs-call-for-peace-and-respect-for-international-law https://imam-us.org/statement-on-the-recent-plot-to-attack-a-shia-muslim-islamic-center-in-illinois https://imam-us.org/condolences-and-call-to-action-in-solidarity-with-the-people-of-afghanistan https://imam-us.org/official-statement-from-the-council-of-shia-muslim-scholars-of-north-america-concerning-the-tragic-hate-crime-at-the-islamic-center-of-san-diego-and-the-systemic-rise-of-islamophobia https://imam-us.org/international-day-of-innocent-children-victims-of-aggression https://imam-us.org/ayatollah-al-sistanis-condolences-on-the-passing-of-grand-ayatollah-al-fayyad https://imam-us.org/condolence-statement-from-his-eminence-sayyid-sistani-following-the-passing-of-ayatollah-sayyid-musa-shobeiri-zanjani 
- Event, webinar, series and promo notices: https://imam-us.org/introducing-psyched4u-1 https://imam-us.org/fasting https://imam-us.org/our-childrens-protection-is-mandatory-not-recommended-sayyid-kashmiri https://imam-us.org/prepare-for-muharram-with-guidance-from-sayyid-al-sistani https://imam-us.org/serve-your-community https://imam-us.org/exploring-the-holy-quran-applied-lessons-on-faith-human-nature-and-navigating-life https://imam-us.org/how-to-file-and-save-big-a-wise-approach-to-tax-season https://imam-us.org/why-allah-repeats-the-same-stories https://imam-us.org/they-had-everything-then-god-took-it-overnight https://imam-us.org/discover-the-lives-of-imam-hussain-p-and-lady-zaynab-p-this-muharram https://imam-us.org/contemporary-medical-ethics-islamic-jurisprudence https://imam-us.org/global-blood-heroes https://imam-us.org/emergency-khums-authorization-flood-relief-in-pakistan-and-afghanistan 

## imam-us.org fiqh and marja statements run (2026-11-13): skipped and logged
- Skipped (login-gated book, owner rule): Islamic Laws of Medicine (https://imam-us.org/islamic-laws-of-medicine), Islamic Laws of the Female Reproductive Cycle (https://imam-us.org/islamic-laws-of-the-female-reproductive-cycle-menstrual-postpartum-and-non-menstrual-bleeding), Islamic Laws of Fasting book page (https://imam-us.org/islamic-laws-of-fasting). The PDF needs login. Owner to say whether the online-reading pages count as open.
- Skipped (promotion): https://imam-us.org/reminder-get-your-copy-of-islamic-laws-of-fasting-today
- Skipped (same book as an existing record): https://imam-us.org/islamic-laws-of-food-drink
- Not fetched (404): https://imam-us.org/zakat-al-fitrah-2016 and the istikhara Part III page (https://imam-us.org/towards-greater-clarity-in-decision-making-part-iii-istikhara-terms-conditions-and-practical-application-in-contemporary-life)
- Statements from non-marja authors (I.M.A.M. or the council) and a message by Sayyid Mohammad Rida al-Sistani (not in scholars.yaml): see the list in the worker's scratch notes; owner to decide.

## Skipped (fiqh, marja not stated) - held pages decision (2026-11-13)
- https://imam-us.org/an-important-advice-regarding-misuses-of-the-power-of-religious-authority-talaq-al-hakim-al-shari (dated 2021-07-15). Owner asked for this page to be cataloged, but the page does not say that Sayyid Sistani or Sayyid Khamenei is the source of its guidance. It is issued by "The Internal Affairs Committee, The Council of Shia Muslim Scholars of North America", so the office-of-Sistani assumption in the brief does not hold. Its guidance covers the legal conditions for a divorce by a religious authority, which is fiqh, so it was skipped under the fiqh rule. Owner to decide: add a marja, or accept it as a non-fiqh advisory statement.

## imam-us.org chunk 2 skips (2026-11-15)

Fetched and skipped:
- https://imam-us.org/week-2-imam-at-home-ramadan-edition | programme index page for a video series with no content of its own (event/programme notice)
- https://imam-us.org/imam-at-home-ramadan-edition | programme index page for a video series with no content of its own (event/programme notice)
- https://imam-us.org/icymi-sayyid-kashmiri-speaks-at-the-marifa-conference | news coverage of a student conference
- https://imam-us.org/imam-presents-panel-discussion | event report and live-stream notice for a panel
- https://imam-us.org/judeo-christian-relationships-early-muslims-panel-discussion | event announcement for a panel (live-stream notice)
- https://imam-us.org/arbaeen-imam-hussain-ibn-ali-1440 | anniversary notice (the 40th day of the martyrdom of Imam Hussain)
- https://imam-us.org/17th-annual-conference-shia-muslim-scholars-north-america | news recap of an annual conference

Skipped by title without fetching (notices, news, fundraising, greetings, events; no content record):
- https://imam-us.org/an-update-on-the-recovery-of-his-eminence-sayyid-al-sistani | news update
- https://imam-us.org/letter-absence-students-going-arbaeen-pilgrimage | announcement
- https://imam-us.org/support-people-nyc-ramadan-relief-fund | fundraising
- https://imam-us.org/sayyid-sistani-resumes-daily-activities | news
- https://imam-us.org/join-us-live-muharram-1441-ah | event sign-up
- https://imam-us.org/eid-al-adha-1440 | greeting notice
- https://imam-us.org/feed-fasting-report-2019 | fundraising/activity report
- https://imam-us.org/ayatullah-sistani-un-representative-assistance-mission-iraq | news
- https://imam-us.org/sayyid-sistani-meets-un-team-investigating-isis-crimes | news
- https://imam-us.org/lunar-eclipse-north-america-january-2019 | notice
- https://imam-us.org/m-m-s-board-directors-meets-grand-ayatullah-sayyid-ali-al-sistani | news
- https://imam-us.org/grand-ayatullah-al-sistani-receives-un-special-representative-iraq | news
- https://imam-us.org/holy-prophet-of-islam-death-anniversary-2 | anniversary notice
- https://imam-us.org/m-m-chairman-visits-unity-islamic-center-cleveland | news
- https://imam-us.org/lunar-eclipse-north-america-january-2018 | notice
- https://imam-us.org/imam-delegation-attends-new-york-encounter-2018 | news
- https://imam-us.org/new-york-encounter-2018 | event notice
- https://imam-us.org/eid-al-adha-1439 | greeting notice
- Birthday, martyrdom and Islamic-month notices (moon sighting, month greetings): birthday-of-imam-ali-al-hadi-1441, martyrdom-of-imam-ali-al-hadi-1441, birthday-of-imam-muhammad-al-baqir-1441, birthday-of-sayyida-fatimah-al-zahra-1441, martyrdom-sayyida-fatimah-al-zahra-1441-3, birthday-of-sayyida-zaynab-bint-ali-1441, martyrdom-sayyida-fatimah-al-zahra-1441-2, birthday-of-prophet-muhammad-and-imam-jafar-sadiq-1440, birthday-of-imam-hasan-al-askari-1440, martyrdom-imam-hasan-al-askari-1440, martyrdom-of-imam-jawad-copy, islamic-month-of-dhu-al-hjjah-1439-ah, martyrdom-of-imam-jawad-1439, birthday-of-imam-ridha-1439, islamic-month-of-dhu-al-qidah-2018, martyrdom-of-imam-jafar-sadiq, islamic-month-of-shawwal-2018, martyrdom-of-imam-ali-ramadan, birthday-of-imam-hasan-1439, islamic-month-of-ramadan-2018, birthday-of-imam-mahdi-1439, birthday-of-imam-zayn-al-abidin-1439, birthday-of-hadhrat-abbas-1439, birthday-of-imam-hussain-ibn-ali-1439, islamic-month-of-shaban-1439, martyrdom-of-imam-musa-kadhim-rajab, death-of-lady-zainab-al-kubra-rajab, birthday-of-imam-ali-ibn-abi-talib-1439, birthday-imam-muhammad-al-taqi-al-jawad-rajab, martyrdom-of-imam-ali-al-naqi-al-hadi-rajab, birthday-of-imam-ali-al-naqi-al-hadi, birthday-of-imam-muhammad-al-baqir, islamic-month-of-rajab-2018, birthday-of-lady-fatimah-bint-muhammad, martyrdom-of-fatima-the-daughter-of-muhammad-2018, birthday-of-zaynab-al-kubra-2018, birthday-of-imam-hassan-al-askari (all at https://imam-us.org/<slug>)

Catalog result: 1 record (imam-us-statement-council-shia-scholars-george-floyd). No fiqh pages in this chunk. Requests used: 8 of 80.

## imam-us.org chunk 5 skips (2026-11-15)
Fiqh held (marja not named on the page; fiqh rule):
- https://imam-us.org/how-is-zakat-al-fitrah-calculated (zakat al-Fitrah guide; page says "religious authority (Marja)" without naming Sistani or Khamenei)
- https://imam-us.org/how-is-zakat-al-fitrah-calculated-for-2023 (same guide, 2023 price note)
- https://imam-us.org/how-is-zakat-al-fitrah-calculated-for-2024 (same guide, 2024 price note)
- https://imam-us.org/how-is-zakat-alfitrah-calculated (same guide, 2025 price note, titled "It's Only $10.00")
- https://imam-us.org/lunar-eclipse-over-north-america-on-sunday-may-15th-2022 (Salat al-Ayat ruling notice; no marja named)
- https://imam-us.org/lunar-eclipse-over-north-america-on-tuesday-november-8th-2022 (same, Nov 2022)
- https://imam-us.org/partial-lunar-eclipse-2024 (same, Sept 2024)
- https://imam-us.org/partial-lunar-eclipse-august-28th-2026 (same, Aug 2026)
- https://imam-us.org/partial-solar-eclipse-march-29-2025 (same, Mar 2025)

Duplicates (same book or sermon already cataloged under another URL):
- https://imam-us.org/islamic-laws-of-food-drink (same book as imam-us-islamic-laws-of-food-drink, url new-book-release-islamic-laws-food-drink)
- https://imam-us.org/new-book-release-islamic-laws-of-death-and-burial (same book as imam-us-islamic-laws-of-death-and-burial)
- https://imam-us.org/prophet-muhammads-sermon-welcoming-the-holy-month-of-ramadan-2 , -2024 and -3 (same sermon as imam-us-prophet-sermon-welcoming-ramadan; the base URL /prophet-muhammads-sermon-welcoming-the-holy-month-of-ramadan was also not cataloged separately)
- https://imam-us.org/prepare-for-muharram-with-guidance-from-sayyid-al-sistani and -1447 (promotion of the 100 Pearls book, already imam-us-100-pearls-advice-of-sistani)

News, reports, statements on current events, or event notices (skipped):
- grand-opening-of-masjid-al-nabi-p-chantelly-virginia; grandsons-of-late-grand-ayatullah-sayyid-al-khoei-visit-i-m-a-m; ground-breaking-of-the-ali-center-houston; groundbreaking-of-the-zainabiya-center-st-louis-missouri; highlights-from-i-m-a-m-s-participation-at-the-2024-aar-sbl-annual-meeting; highlights-from-i-m-a-m-s-participation-at-the-2025-aar-sbl-annual-meeting; his-eminence-sayyid-monir-al-khabbaz-visits-the-united-states-itinerary-and-programs (2015 announcement); honoring-dr-shaykh-mehdi-s-hazari; honoring-sayyid-muntadher-al-jaberi (recognition news)
- hurricane-ida-disaster-relief (fundraising appeal); help-share-their-message-this-muharram-safar-who-is-hussain-who-is-zaynab (book bulk-order promotion)
- how-to-file-and-save-big-a-wise-approach-to-tax-season (webinar sign-up)
- i-m-a-m-at-filbo-2026-a-journey-of-spiritual-and-cultural-exchange; i-m-a-m-at-the-international-book-fair-of-cali-colombia; i-m-a-m-at-the-parliament-of-the-worlds-religions; i-m-a-m-hosts-the-imams-council-of-michigan-with-imam-magid-and-dr-sayyid-sulayman-hassan; i-m-a-m-joins-corewell-health-in-chna-initiative; i-m-a-m-participates-at-civil-rights-summit; imam-hosts-the-imams-council-of-michigan; imam-participates-in-the-2023-michigan-response-to-hate-conference; imam-takleef-course-and-ceremony; imi-conference-youth-session-with-sayyid-kashmiri; interfaith (event reports)
- i-m-a-m-welcomes-his-holiness-pope-leo-xivs-call-for-peace-and-respect-for-international-law (statement reacting to a news event; owner to decide if statements like this are in scope)
- introducing-psyched4u-1 (launch announcement with survey giveaway)
- join-i-m-a-m-s-creative-digital-team (job advertisement)
- join-us-live-on-instagram-for-the-ssaf-solidarity-gathering-for-the-new-mexico-community; join-us-live-on-youtube-imam-hussain-love-giving-and-sacrifice; join-us-live-on-youtube-prophetic-community-passion-tolerance-and-solidarity (live event notices)
- marifa-conference-2024-join-sayyid-kashmiri-shaykh-dr-hazari (event notice); marjaeya-fiqh-concepts-at-mica (event report)
- martyrdom-imam-musa-al-kadhim-p (martyrdom notice)
- muslim-and-christian-leaders-discuss-the-issue-of-christians-in-the-middle-east; naacp-loudon-branch-marks-juneteenth-sayyid-kashmiri-attends (news)
- national-open-mosque-masjid-day (event announcement)
- official-statement-from-the-council-of-shia-muslim-scholars-of-north-america-concerning-the-tragic-hate-crime-at-the-islamic-center-of-san-diego (statement on a news event; owner to decide)
- one-day-shia-youth-conference-at-nyu; opening-words-of-the-first-imi-youth-professional-conference (event reports)
- our-childrens-protection-is-mandatory-not-recommended-sayyid-kashmiri (school opening speech report)
- participation-of-i-m-a-m-in-the-conference-religious-resistance-to-authoritarianism (event report)
- predictions-for-the-beginning-of-the-holy-month-of-ramadan-1444-a-h; preliminary-statement-about-the-beginning-of-the-holy-month-of-ramadan-1445-a-h; preliminary-statement-regarding-the-expected-beginning-of-the-month-of-muharram-1447-a-h (moon-sighting)
- promoting-wellness-r-i-s-e-trains-new-mental-health-first-aiders (news)

## imam-us.org chunk 6 skips (2026-11-15)
Cataloged from this chunk: psyched4u-conference-sayyid-kashmiris-remarks (article) and r-i-s-e-leads-mental-health-wellness-workshop-on-islam-grief (article, new scholar sayyid-sameer-ali added with needs_review: true). Everything else below was skipped.

### Skipped (fiqh, marja not stated) - chunk 6
- 2021-2023 Qada (make-up) fasts, fidyah and kaffarah reminders for 1443/2022, 1444/2023, 1445/2024 and 1446/2025: https://imam-us.org/reminder-about-qada-make-up-fasts-fidyah-and-kaffarah-1443-2022 , https://imam-us.org/reminder-about-qada-make-up-fasts-fidyah-and-kaffarah-1444-2023 , https://imam-us.org/reminder-about-qada-make-up-fasts-fidyah-and-kaffarah-1445-2024 , https://imam-us.org/reminder-about-qada-make-up-fasts-fidyah-and-kaffarah-1446-2025 . The pages set out rulings and name no marja in the body (only a sidebar link to Sistani's book). Owner to decide.
- Zakat al-Fitrah price and rules pages for 2021, 2022, 2023, 2024, 2025 and 2026: https://imam-us.org/zakat-al-fitrah-for-2021 , https://imam-us.org/zakat-al-fitrah-2023 , https://imam-us.org/zakat-al-fitrah-for-2022 , https://imam-us.org/zakat-al-fitrah-for-2024 , https://imam-us.org/zakat-al-fitrah-for-2025 , https://imam-us.org/zakat-al-fitrah-for-2026 . They refer only to "the religious authority (Marja)" in general terms, so no marja is named. Same decision as the held zakat guide in batch half2; owner to decide.

### Skipped (announcement, notice, prayer-time or moon-sighting notice) - chunk 6
- Ramadan prayer timetable and fajr/imsak notice: https://imam-us.org/ramadan-prayer-timetable (notice; it says a timetable was adopted by Sistani's office. It is fiqh-leaning. Owner may want to decide whether such notices count.)
- Solar and lunar eclipse Salat al-Ayat notices: https://imam-us.org/solar-eclipse-over-north-america-on-monday-april-8th-2024 , https://imam-us.org/solar-eclipse-over-north-america-on-saturday-october-14th-2023 , https://imam-us.org/total-lunar-eclipse-march-13-14-2025 , https://imam-us.org/total-lunar-eclipse-march-3-2026 , https://imam-us.org/total-solar-eclipse-august-12th-2026
- Moon-sighting and Eid date notices: https://imam-us.org/when-is-eid-al-fitr-1443 , https://imam-us.org/when-is-the-first-of-ramadan-the-why-and-the-how
- Martyrdom anniversary notice: https://imam-us.org/thank-supporting-needy-fasting-people-holy-month (the fetched page is a martyrdom-anniversary notice for Imam Ali, not the thanks message its slug suggests; owner may want to check the URL)
- Other notices: https://imam-us.org/serve-your-community (volunteer call), https://imam-us.org/reminder-get-your-copy-of-islamic-laws-of-fasting-today (promotion)

### Skipped (statement, condolence, thanks, appeal) - chunk 6
- Statements: https://imam-us.org/statement-from-council-on-recent-defamatory-comments , https://imam-us.org/statement-on-the-recent-plot-to-attack-a-shia-muslim-islamic-center-in-illinois , https://imam-us.org/statement-on-the-targeted-killing-of-shia-muslims-in-new-mexico , https://imam-us.org/statement-regarding-the-current-tragedy-and-oppression-spreading-in-the-world , https://imam-us.org/statement-regarding-the-mosque-attack-in-peshawar-pakistan , https://imam-us.org/the-closing-statement-of-the-19th-annual-conference , https://imam-us.org/united-nations-delegation-visits-grand-ayatullah-al-sistani , https://imam-us.org/words-of-thanks-from-the-marjaeyas-office-in-najaf
- Urgent appeals and fundraising: https://imam-us.org/urgent-appeal-colombia-earthquake-relief , https://imam-us.org/urgent-appeal-to-support-our-fellow-believers-in-philadelphia , https://imam-us.org/thank-supporting-needy-fasting-people-holy-month

### Skipped (event news, visit report, conference report, or event sign-up) - chunk 6
- Event reports with no more than attendance or visit news: https://imam-us.org/r-i-s-e-attends-sacred-journeys-network-conference-2026 , https://imam-us.org/r-i-s-e-empowers-dearborn-educators-with-islam-integrated-mental-health-first-aid-training , https://imam-us.org/r-i-s-e-hosts-ramadan-iftar-honoring-muslim-chaplains-and-advancing-spiritual-care , https://imam-us.org/sayyid-al-khabbaz-visit-a-lecture-at-western-michigan-university-kalamazoo , https://imam-us.org/sayyid-al-khabbaz-visit-discussion-at-the-catholic-university-of-america-in-washington-d-c , https://imam-us.org/sayyid-al-khabbaz-visit-discussion-with-professor-juan-cole-at-u-of-m-ann-arbor , https://imam-us.org/sayyid-al-khabbaz-visit-study-and-discussion-at-sais-of-johns-hopkins-university , https://imam-us.org/sayyid-kashmiri-lecturing-at-iowa-university-about-religion-and-violence , https://imam-us.org/sayyid-kashmiri-visits-iec-orlando , https://imam-us.org/sayyid-m-b-kashmiri-leads-united-islamic-centers-eid-prayers-in-denver-co , https://imam-us.org/sayyid-m-b-kashmiri-visits-imam-hussain-p-center-st-louis-mo , https://imam-us.org/sayyid-m-b-kashmiri-visits-the-dare-zehra-islamic-center-of-cincinnati-ohio , https://imam-us.org/sayyid-mohammed-baqir-kashmiri-at-51th-annual-isna-convention , https://imam-us.org/shaykh-amjed-riyadh-visit-to-the-united-states-itinerary-and-programs , https://imam-us.org/shia-and-sunni-scholars-work-toward-unity-at-ssaf-retreat , https://imam-us.org/the-5th-marifa-conference-a-look-back , https://imam-us.org/the-hawzah-between-heritage-and-modernity-mit-sessions , https://imam-us.org/the-resident-scholars-receive-marjaeya-remarks , https://imam-us.org/the-sbl-aar-annual-meeting , https://imam-us.org/the-umaa-conference-celebrates-20-years-with-blueprint-for-shia-muslims , https://imam-us.org/youth-participate-in-transformative-ziyarah-journey-to-iraq-in-partnership-with-the-imam-hussain-holy-shrine , https://imam-us.org/secretary-general-of-oic-visits-his-eminence-grand-ayatollah-sayyid-sistani
  Owner to decide: several of these hold short talk summaries (e.g., the MIT hawzah lecture, the Ma'rifa keynote). The chunk-6 rule was to catalog event reports only where the page summarizes substantive teaching, and the two cataloged here (PSYCHED4U remarks, grief workshop) are the only ones that did.
- Webinar and workshop sign-ups or promos: https://imam-us.org/they-had-everything-then-god-took-it-overnight , https://imam-us.org/why-allah-repeats-the-same-stories , https://imam-us.org/workshop-islamic-laws-of-purity-%d8%a3%d8%ad%d9%83%d8%a7%d9%85-%d8%a7%d9%84%d8%b7%d9%87%d8%a7%d8%b1%d8%a9-dearborn-mi , https://imam-us.org/workshop-pre-marriage-dearborn-mi , https://imam-us.org/youre-not-just-starving-yourself

### Skipped (duplicate of an existing record) - chunk 6
- https://imam-us.org/what-should-i-do-music-at-a-religious-gathering (same title and situation as imam-us-wsid-music-religious-gathering, whose URL is ...-gathering-2; dated 2025-12-12 here, 2026-08-27 there. Owner to check whether it is one page or two.)
- https://imam-us.org/who-is-hussain-english-spanish (already listed as a duplicate in the half2 skips)

## imam-us.org chunk 3 skips (2026-11-15)

Fetched 63 pages (one cataloged: imam-us-concept-of-a-savior-part-1). Skipped:

Birthday, martyrdom and anniversary notices (owner rule):
- https://imam-us.org/birthday-of-prophet-muhammad-and-imam-jafar-sadiq-1439 | birthday notice (Rabi al-Awwal)
- https://imam-us.org/holy-prophet-of-islam-death-anniversary | anniversary notice
- https://imam-us.org/arbaeen-imam-hussain-ibn-ali-p-1439 | Arbaeen notice
- https://imam-us.org/martyrdom-imam-ali-1438 | martyrdom notice
- https://imam-us.org/martyrdom-sayyida-fatimah-al-zahra | martyrdom notice
- https://imam-us.org/martyrdom-imam-ali-ibn-musa-al-ridha | martyrdom notice
- https://imam-us.org/birth-anniversaries-prophet-muhammad-pbuh-imam-jafar-al-sadiq-p | birthday notice
- https://imam-us.org/arbaeen-imam-hussain-ibn-ali-p | Arbaeen notice
- https://imam-us.org/martyrdom-imam-husayn-ibn-ali | Ashura notice
- https://imam-us.org/martyrdom-imam-muhammad-al-baqir | martyrdom notice
- https://imam-us.org/martyrdom-imam-jafar-al-sadiq | martyrdom notice
- https://imam-us.org/martyrdom-imam-muhammad-al-jawad | martyrdom notice
- https://imam-us.org/1536-2 | birthday notice (Imam Ali al-Hadi)
- https://imam-us.org/1527-2 | birthday notice (Sayyidah Fatimah al-Zahra)

Moon-sighting, eclipse and Eid notices (owner rule):
- https://imam-us.org/islamic-month-of-rabi-al-awwal-2017 | moon-sighting announcement
- https://imam-us.org/solar-eclipse-north-america | eclipse notice
- https://imam-us.org/penumbral-lunar-eclipse-north-america | eclipse notice
- https://imam-us.org/is-salat-al-ayaat-obligatory-for-a-penumbral-lunar-eclipse-11-30-2020 | dated eclipse ruling notice naming Sistani (2020-11-29). Same kind as the moon-sighting notices, so skipped; owner to decide whether dated ruling notices count (see imam-us-salat-al-ayaat-lunar-eclipse)
- https://imam-us.org/clarification-beginning-holy-month-ramadhan-1437-ah | moon-sighting clarification
- https://imam-us.org/1529-2 | moon-sighting announcement (crescent moon, Rajab 1437)
- https://imam-us.org/predicting-eid-tolerance | Eid moon-sighting prediction, mixed with a reflection; treated as a moon-sighting notice
- https://imam-us.org/imam-celebrates-eid-ghadir-mubahalah-dearborn-2017 | event report (Eid celebration)
- https://imam-us.org/eid-al-adha-1438 | Eid greeting

Fiqh, marja not named on the page (fiqh rule):
- https://imam-us.org/coming-month-ramadhan | Ramadan rulings (Qadha, Fidyah, Kaffarah); no marja named on the page
- https://imam-us.org/zakat-ul-fitrah-2016 | zakat al-Fitrah payment guide; no marja named
- https://imam-us.org/toward-greater-clarity-in-decision-making-part-iii-istikhara-terms-conditions-and-practical-application-in-contemporary-life | rules and conditions of istikhara (jurisprudential terms); no marja named. Part 2 (cataloged) is the non-fiqh philosophy piece. Owner to decide whether Part 3 counts as fiqh
- https://imam-us.org/fasting-students-letter | template letter to schools on fasting accommodations; religious rulings referenced, no marja named

Duplicates:
- https://imam-us.org/advice-public-speakers-muharram | same advice text as imam-us-video-advice-preachers-public-speakers (video page with the same text)

Statements from councils or non-marja bodies (owner to decide):
- https://imam-us.org/closing-statement-of-the-18th-annual-conference-of-the-council-of-shia-muslim-scholars-of-north-america | conference statement by the Council of Shia Muslim Scholars of North America (not a marja)

Announcements, news, event reports and sign-ups (owner rule):
- https://imam-us.org/connect-with-the-marjaeya | visit schedule for Muharram
- https://imam-us.org/sayyid-m-b-kashmiri-visits-durham-north-carolina | visit news
- https://imam-us.org/sayyid-m-b-kashmiri-visits-jafaria-islamic-society-miami | visit news
- https://imam-us.org/sayyid-m-b-kashmiri-visits-american-islamic-center-florida-subject-islamophobia | visit news
- https://imam-us.org/sayyid-kashmiri-visits-iowa-community | lecture-series event report
- https://imam-us.org/sayyid-m-b-kashmiri-visits-centers-in-california-july-28-30-2016 | lecture-series event report
- https://imam-us.org/sayyid-m-b-kashmiri-visits-minnesota-september-17-21-2016 | visit news
- https://imam-us.org/sayyid-m-b-kashmiri-attends-interfaith-gathering-governor-ali-hassan-joho-kenya | event news
- https://imam-us.org/m-m-participates-faith-fear-panel | event news
- https://imam-us.org/delegation-visits-islamic-centers-georgia | visit news
- https://imam-us.org/celebrating-successorship-imam-mahdi-p-dar-e-panjatan-miami-florida | event news
- https://imam-us.org/sayyid-khabbaz-archbishop-washington | meeting news
- https://imam-us.org/sayyid-m-b-kashmiri-delivers-keynote-imam-hussain-p-islamic-center-grand-opening-boise-idaho | event news
- https://imam-us.org/sayyid-kashmiri-meets-students-at-al-murtada-institute | event news
- https://imam-us.org/grand-ayatullah-sayyid-ali-al-sistani-meets-medicines-sans-frontiers-msf-delegation | news
- https://imam-us.org/birth-imam-mahdi-p-celebration-held-m-m-dearborn-mi | event report
- https://imam-us.org/community-members-remember-officer-anthony-dia | news
- https://imam-us.org/i-m-a-m-hosts-a-luncheon-for-young-participants | event report
- https://imam-us.org/i-m-a-m-gives-haj-jasim-al-hassani-an-award-of-appreciation | event report
- https://imam-us.org/i-m-a-m-commemorates-arbaeen-during-a-3-night-event | event report
- https://imam-us.org/video-imi-organizes-a-virtual-forum-to-plan-for-a-safe-muharram | news report (video)
- https://imam-us.org/imam-at-home-muharram-1442 | live-stream programme notice
- https://imam-us.org/i-m-a-m-at-home-muharram-edition-timeless-lessons-from-karbala-with-shaykh-faiyaz-jaffer | live-stream event notice
- https://imam-us.org/i-m-a-m-at-home-muharram-edition-inspirations-from-ashura-with-sayyid-muntadher-aljabery | live-stream event notice
- https://imam-us.org/i-m-a-m-presents-school-work-and-beyond | webinar sign-up
- https://imam-us.org/i-m-a-m-presents-islam-and-mental-health-psychology | webinar sign-up
- https://imam-us.org/remembering-prophet-muhammad-pbuh-a-ssaf-shia-sunni-alliance-forum-presentation | event promotion (SSAF forum)
- https://imam-us.org/hurricane-aid-appeal | fundraising appeal
- https://imam-us.org/feed-fasting-report-thank | fundraising report
- https://imam-us.org/reminder-feed-fasting-in-need | fundraising
- https://imam-us.org/feed-fasting-in-need | fundraising
- https://imam-us.org/sec2017-submissions | competition
- https://imam-us.org/1617-2 | competition highlights (2016 Self-Enhancement Competition)


## imam-us.org chunk 1 skips (2026-11-15)
Fiqh with no marja named in the page body (owner to confirm whether these should be cataloged):
- 2026-11-15 | https://imam-us.org/reminder-coming-holy-month-ramadhan-1438-h | Fiqh (qada, fidyah, kaffarah), 2017. The body names no marja; Sistani appears only in the sidebar.
- 2026-11-15 | https://imam-us.org/qada-fasts-kaffarah-1439 | Fiqh (qada, fidyah, kaffarah), 2018. No marja named.
- 2026-11-15 | https://imam-us.org/reminder-about-qada-make-up-fasts-fidyah-kaffarah-1440 | Fiqh (qada, fidyah, kaffarah), 2019. No marja named.
- 2026-11-15 | https://imam-us.org/reminder-about-qada-make-up-fasts-fidyah-kaffarah-1441 | Fiqh (qada, fidyah, kaffarah), 2020. No marja named.

Skipped as not in scope (news, event reports, notices, listings, moon-sighting or Eid-date messages):
- 2026-11-15 | https://imam-us.org/islamic-awareness/blog-posts | Listing page, not content.
- 2026-11-15 | https://imam-us.org/predicting-eid-tolerance-respect-differences | Eid date and moon-sighting message (notice).
- 2026-11-15 | https://imam-us.org/closing-statement-16th-annual-conference-council-shia-muslim-scholars-north-america | Conference closing statement (event report). Owner to decide whether conference statements are in scope.
- 2026-11-15 | https://imam-us.org/martyrdom-imam-hassan-al-askari-1439 | Martyrdom or birth anniversary notice (a date and a quote); no substantive content.
- 2026-11-15 | https://imam-us.org/ayatullah-al-sistani-receives-un-special-representative-iraq | News report of a meeting.
- 2026-11-15 | https://imam-us.org/closing-statement-17th-annual-conference-council-shia-muslim-scholars-north-america | Conference report with a link to the full statement. Same question as the 16th conference.
- 2026-11-15 | https://imam-us.org/imam-hosts-sayyid-moneer-al-khabbaz | Visit report (news).
- 2026-11-15 | https://imam-us.org/imam-honors-sayyida-fatimah-p-3-day-event | Event report.
- 2026-11-15 | https://imam-us.org/martyrdom-sayyida-fatimah-al-zahra-1441 | Martyrdom or birth anniversary notice (a date and a quote); no substantive content.
- 2026-11-15 | https://imam-us.org/martyrdom-sayyida-fatimah-al-zahra-1440 | Martyrdom or birth anniversary notice (a date and a quote); no substantive content.
- 2026-11-15 | https://imam-us.org/birthday-of-sayyida-zaynab-bint-ali-1440 | Martyrdom or birth anniversary notice (a date and a quote); no substantive content.
- 2026-11-15 | https://imam-us.org/birthday-of-imam-hasan-ibn-ali-1441 | Martyrdom or birth anniversary notice (a date and a quote); no substantive content.
- 2026-11-15 | https://imam-us.org/martyrdom-of-imam-ali-ibn-abi-talib-1441 | Martyrdom or birth anniversary notice (a date and a quote); no substantive content.
- 2026-11-15 | https://imam-us.org/34916-2 | Event report (annual symposium).
- 2026-11-15 | https://imam-us.org/imam-honors-prophet-muhammad-pbuhhp-imam-jafar-al-sadiq-p | Event report.
- 2026-11-15 | https://imam-us.org/birthday-of-imam-hasan-askari-1441 | Martyrdom or birth anniversary notice (a date and a quote); no substantive content.
- 2026-11-15 | https://imam-us.org/birthday-of-prophet-muhamma-imam-sadiq-1441 | Martyrdom or birth anniversary notice (a date and a quote); no substantive content.
- 2026-11-15 | https://imam-us.org/martyrdom-of-imam-hasan-al-mujtaba-1441 | Martyrdom or birth anniversary notice (a date and a quote); no substantive content.
- 2026-11-15 | https://imam-us.org/arbaeen-imam-hussain-ibn-ali-1441 | Martyrdom or birth anniversary notice (a date and a quote); no substantive content.
- 2026-11-15 | https://imam-us.org/martyrdom-of-imam-zayn-al-abidin-1441 | Martyrdom or birth anniversary notice (a date and a quote); no substantive content.
- 2026-11-15 | https://imam-us.org/martyrdom-of-imam-ali-al-rida-1441 | Martyrdom or birth anniversary notice (a date and a quote); no substantive content.
- 2026-11-15 | https://imam-us.org/holy-prophet-of-islam-death-anniversary-1441 | Martyrdom or birth anniversary notice (a date and a quote); no substantive content.
- 2026-11-15 | https://imam-us.org/martyrdom-of-imam-hasan-al-askari-1441 | Martyrdom or birth anniversary notice (a date and a quote); no substantive content.
- 2026-11-15 | https://imam-us.org/martyrdom-of-imam-muhammad-al-baqir-1440 | Martyrdom or birth anniversary notice (a date and a quote); no substantive content.
- 2026-11-15 | https://imam-us.org/advice-marjaeya-religious-scholars-speakers-holy-month-muharram-1441-h | Notice linking to advice for speakers; the advice is covered by existing records (imam-us-top-10-advice-hussaini-speakers, imam-us-video-advice-preachers-public-speakers).
- 2026-11-15 | https://imam-us.org/martyrdom-of-imam-hussain-1441 | Martyrdom or birth anniversary notice (a date and a quote); no substantive content.
- 2026-11-15 | https://imam-us.org/martyrdom-of-imam-muhammad-al-jawad-1440 | Martyrdom or birth anniversary notice (a date and a quote); no substantive content.
- 2026-11-15 | https://imam-us.org/birthday-of-imam-naqi-al-hadi-1440 | Martyrdom or birth anniversary notice (a date and a quote); no substantive content.
- 2026-11-15 | https://imam-us.org/martyrdom-of-imam-jafar-al-sadiq-1440 | Martyrdom or birth anniversary notice (a date and a quote); no substantive content.
- 2026-11-15 | https://imam-us.org/martyrdom-of-imam-ali-ibn-abi-talib-1440 | Martyrdom or birth anniversary notice (a date and a quote); no substantive content.
- 2026-11-15 | https://imam-us.org/birthday-of-imam-ali-ibn-musa-rida-1440 | Martyrdom or birth anniversary notice (a date and a quote); no substantive content.
- 2026-11-15 | https://imam-us.org/birthday-of-imam-muhammad-al-mahdi-1440 | Martyrdom or birth anniversary notice (a date and a quote); no substantive content.
- 2026-11-15 | https://imam-us.org/25012-2 | Organization news (graduation ceremony).
- 2026-11-15 | https://imam-us.org/25007-2 | Organization news (youth camp).
- 2026-11-15 | https://imam-us.org/iabat-hosts-a-groundbreaking-ceremony | Organization news (groundbreaking).
- 2026-11-15 | https://imam-us.org/birthday-of-imam-hasan-ibn-ali-1440 | Martyrdom or birth anniversary notice (a date and a quote); no substantive content.
- 2026-11-15 | https://imam-us.org/imam-hosts-inter-organizational-seminar | Event report (seminar).
- 2026-11-15 | https://imam-us.org/24041-2 | Fundraising dinner.
- 2026-11-15 | https://imam-us.org/martyrdom-of-imam-musa-al-kadhim-1440 | Martyrdom or birth anniversary notice (a date and a quote); no substantive content.
- 2026-11-15 | https://imam-us.org/birthday-of-imam-hussain-ibn-ali-1440 | Martyrdom or birth anniversary notice (a date and a quote); no substantive content.
- 2026-11-15 | https://imam-us.org/members-imam-board-attend-symposium-rutgers-university | Event report (news).
- 2026-11-15 | https://imam-us.org/birthday-of-hadhrat-abbas-ibn-ali-1440 | Martyrdom or birth anniversary notice (a date and a quote); no substantive content.
- 2026-11-15 | https://imam-us.org/birthday-of-imam-zayn-al-abidin-1440 | Martyrdom or birth anniversary notice (a date and a quote); no substantive content.
- 2026-11-15 | https://imam-us.org/24045-2 | Event report (birth anniversary celebration).
- 2026-11-15 | https://imam-us.org/birthday-of-imam-muhammad-al-baqir-1440 | Martyrdom or birth anniversary notice (a date and a quote); no substantive content.
- 2026-11-15 | https://imam-us.org/birthday-of-imam-ali-al-hadi-1440 | Martyrdom or birth anniversary notice (a date and a quote); no substantive content.
- 2026-11-15 | https://imam-us.org/birthday-of-imam-ali-ibn-abi-talib-1440 | Martyrdom or birth anniversary notice (a date and a quote); no substantive content.
- 2026-11-15 | https://imam-us.org/martyrdom-of-imam-ali-al-hadi-1440 | Martyrdom or birth anniversary notice (a date and a quote); no substantive content.
- 2026-11-15 | https://imam-us.org/24037-2 | Organization news (visit).
- 2026-11-15 | https://imam-us.org/birthday-of-sayyida-fatimah-al-zahra-1440 | Martyrdom or birth anniversary notice (a date and a quote); no substantive content.
- 2026-11-15 | https://imam-us.org/week-4-imam-at-home-ramadan-edition | Weekly events roundup.
- 2026-11-15 | https://imam-us.org/mufid-academic-seminary-launches-its-ba-in-hawzah-studies-program | Program announcement.
- 2026-11-15 | https://imam-us.org/19th-night-month-ramadan | Date notice with no substantive content.
- 2026-11-15 | https://imam-us.org/birthday-of-imam-muhammad-al-mahdi-1441 | Martyrdom or birth anniversary notice (a date and a quote); no substantive content.
- 2026-11-15 | https://imam-us.org/birthday-of-imam-ali-ibn-abi-talib-1441 | Martyrdom or birth anniversary notice (a date and a quote); no substantive content.

Already cataloged in this chunk: welcoming-holy-month-ramadan, a-message-from-the-representative-of-the-jurist-on-the-eve-of-the-15th-of-shaban, video-an-important-message-regarding-coronavirus-covid-19-from-the-representative-of-the-jurist. eid-al-fitr was already in the done file.

## imam-us.org chunk 4 skips (2026-11-15)

Cataloged from this chunk (3): imam-us-video-3-bits-advice-better-ramadan, imam-us-video-preparing-nights-of-destiny, imam-us-arbaeen-visitor-recommendations-2021 (the 2021 edition of the Arbaeen visitor guide; the 1444 and 1445 editions were already cataloged). Everything else below was skipped.

### Skipped (fiqh, marja not stated)
- 2021-04-19 | What Should I Do? Should I Get the COVID-19 Vaccine While Fasting? | https://imam-us.org/what-should-i-do-should-i-get-the-covid-19-vaccine-while-fasting | the page names no marja.
- 2026-04-27 | Going for Preparing for Hajj: a Spiritual and Legal Guide (Shaykh Faiyaz Jaffer) | https://imam-us.org/going-for-preparing-for-hajj-a-spiritual-legal-guide-dr-shaykh-faiyaz-jaffer | fiqh subject (Hajj rulings); no marja named; also a webinar page.

### Skipped (fiqh, another or unapproved marja)
- 2022-09-03 | Advice from Ayatullah Shaykh Ishaq al-Fayyad to Believers in the West | https://imam-us.org/advice-from-ayatullah-shaykh-ishaq-al-fayyad-to-believers-in-the-west | Fayyad is not an approved marja; held for owner, as with the earlier Fayyad advice.

### Skipped (fiqh matter from Sistani's office, owner to decide)
- 2014-11-24 | Clarification Regarding the Determination of Arbaeen | https://imam-us.org/clarification-regarding-the-determination-of-arbaeen | a calendar ruling-type statement from the office; not cataloged.
- 2022-08-29 | Emergency Khums Authorization: Flood Relief in Pakistan and Afghanistan | https://imam-us.org/emergency-khums-authorization-flood-relief-in-pakistan-and-afghanistan | khums authorization attached to a relief appeal; fiqh matter and fundraising.

### Skipped (duplicate of an existing record)
- 2020-05-06 | The difference between imsak time and fajr time | https://imam-us.org/difference-time-imsak-fajr-prayer | same article as imam-us-imsak-and-fajr-time (other URL).
- 2017-12-07 | Youth: Advice from Grand Ayatullah Sayyid Ali al-Sistani | https://imam-us.org/advice-to-youth-ayatullah-sayyed-sistani | same as imam-us-advice-to-youth-sayyid-al-sistani; the English PDF is also login-only.
- 2022-08-19 | Reminder: Get Your Copy of "Who is Hussain?" and "Who is Zaynab?" Today | https://imam-us.org/get-your-copy-of-who-is-hussain-and-who-is-zaynab-today | promotional reminder for books already cataloged (imam-us-who-is-hussain-book, imam-us-who-is-zaynab-book).
- 2023-08-17 | "Who is Hussain?" and "Who is Zaynab?" sales page | https://imam-us.org/get-your-copy-of-who-is-hussain-and-who-is-zaynab-today-2 | same two books.
- 2026-06-12 | Discover the Lives of Imam Hussain (p) and Lady Zaynab (p) This Muharram | https://imam-us.org/discover-the-lives-of-imam-hussain-p-and-lady-zaynab-p-this-muharram | sales promotion for the same two books.
- 2016-11-08 | God's Emissaries: Adam to Jesus | https://imam-us.org/gods-emissaries-adam-to-jesus | same book as imam-us-book-gods-emissaries-adam-to-jesus (its URL ends in -2).

### Skipped (login-only PDF)
- The English PDF of the Sistani youth booklet requires a login (see the duplicate entry above).

### Skipped (news, event notices and sign-ups, announcements, fundraising, product or shop promotion, statements, other languages)
- 2021-03-06 | His Holiness Pope Francis Meets Ayatullah Sayyid al-Sistani | https://imam-us.org/pope-francis-meets-ayatullah-sayyid-al-sistani | news report.
- 2021-03-13 | A Dialogue with Cardinal Wilton Gregory and Sayyid M.B. Kashmiri | https://imam-us.org/a-dialogue-with-cardinal-wilton-gregory-and-sayyid-m-b-kashmiri | webinar notice.
- 2021-03-30 | Mufid Academic Seminary Fall 2021 Registration Open | https://imam-us.org/62010-2 | admissions announcement.
- 2021-04-07 | Preparing for the Month of Ramadan | https://imam-us.org/preparing-for-the-month-of-ramadan | Instagram live notice.
- 2021-03-10 | Quran Tajwid Recitation Competition, Ramadan 1442 | https://imam-us.org/qc | competition.
- 2021-04-16 | Clarification on the Beginning of the Holy Month of Ramadan 1442 A.H. | https://imam-us.org/clarification-on-the-beginning-of-the-holy-month-of-ramadan-1442-a-h | moon-sighting notice.
- 2021-05-12 | Statement Regarding the Ongoing Confrontations in Occupied Palestine | https://imam-us.org/statement-regarding-the-ongoing-confrontations-in-occupied-palestine | statement on current events.
- 2021 | Lunar and solar eclipse notices | https://imam-us.org/lunar-eclipse-in-north-america-on-wednesday-may-26-2021, https://imam-us.org/solar-eclipse-june-10-2021, https://imam-us.org/lunar-eclipse-over-north-america-on-friday-november-19th-2021 | calendar notices.
- 2021-06-01 | Do The Right Thing: COVID-19 Vaccine PSA | https://imam-us.org/do-the-right-thing-covid-19-vaccine-psa | public service announcement.
- 2021-06-04 | The Quest for Knowledge | https://imam-us.org/67488-2 | Instagram live notice.
- 2021-07-26 | Dr. Hassan Abbas to Join Sr. Salimi | https://imam-us.org/dr-hassan-abbas-to-join-sr-salimi-to-talk-about-the-prophets-heir | event notice.
- 2021-08-04 | Etiquette of Majlis, Instagram Live | https://imam-us.org/etiquette-of-majlis-instagram-live | event notice.
- 2021-08-17 | Survey on Programs for Muharram 1443 | https://imam-us.org/survey-on-programs-for-the-sacred-month-of-muharram-in-north-america-1443-2021 | survey.
- 2021-08-05 | Guidelines for Conducting Muharram 1443 Programs | https://imam-us.org/guidelines-for-conducting-muharram-1443-programs | COVID-era operational guidance for event organisers.
- 2021-09-19 | The Merits & Etiquette of Ziyarat Imam Hussain (p) | https://imam-us.org/the-merits-etiquette-of-ziyarat-imam-hussain-p | Instagram live notice (its video recap is cataloged under imam-us-video-merits-etiquette-of-ziyarat-instagram-live).
- 2021-09-28 | I.M.A.M. in Georgetown University Webinar | https://imam-us.org/pope-francis-grand-imam-al-tayyeb-and-ayatollah-al-sistani-what-do-their-relationships-mean-for-us | webinar report.
- 2021-11-16 | Sayyid Kashmiri Meets Dr. al-Issa | https://imam-us.org/sayyid-kashmiri-meets-dr-al-issa-chairman-of-the-muslim-world-league | news.
- 2016-11-27 | Death Anniversary of the Holy Prophet of Islam | https://imam-us.org/death-holy-prophet-islam-muhammad | anniversary notice.
- 2021-12-16 | Sayyid al-Sistani Meets Young Cancer Patients | https://imam-us.org/sayyid-al-sistani-meets-young-cancer-patients | news.
- 2021 | PSA: Free At-Home COVID-19 Test Kits | https://imam-us.org/psa-free-at-home-covid-19-test-kits | public service announcement.
- 2022-09-20 | 2022 Annual MI Response to Hate Conference | https://imam-us.org/2022-annual-mi-response-to-hate-conference-imam-attends | event report.
- undated | Al-Hawraa Institute celebrates the end of the school year | https://imam-us.org/al-hawraa-institute-celebrate-the-end-of-the-school-year | news.
- 2023-02-03 | Al-Imam al-Muntadher Islamic Center of Dayton, Ohio | https://imam-us.org/al-imam-al-muntadher-islamic-center-of-dayton-ohio | visit report.
- 2026-09-19 | An Educational & Spiritual Journey to Iraq | https://imam-us.org/an-educational-spiritual-journey-to-iraq | tour sign-up.
- 2025-07-20 | Register today to embark on a Spiritual and Educational Journey to Iraq | https://imam-us.org/embark-on-a-transformative-spiritual-educational-journey-to-iraq | tour sign-up.
- 2024-03-05 | An Important Message from the Office of Grand Ayatollah Sayyid al-Sistani | https://imam-us.org/an-important-message-from-the-office-of-grand-ayatollah-sayyid-al-sistani | message to seminary students; statement and news.
- 2026-03-30 | An Urgent Call for Humanitarian Relief | https://imam-us.org/an-urgent-call-for-humanitarian-relief | fundraising appeal.
- 2025-09-07 | Annual Commemoration of Sayyid Musa al-Sadr Held in Dearborn, MI | https://imam-us.org/annual-commemoration-of-sayyid-musa-al-sadr-held-in-dearborn-mi | event news.
- 2022-08-13 | Aug 15th @8pm Shia-Sunni Alliance Forum Solidarity Gathering | https://imam-us.org/aug-15th-8pm-shia-sunni-alliance-forum-ssaf-solidarity-gathering-for-new-mexico-muslim-community | event notice.
- 2025-06-25 | Ayatollah Sayyid Monir al-Khabbaz Meets Scholars in Dearborn | https://imam-us.org/ayatollah-sayyid-monir-al-khabbaz-meets-scholars-in-dearborn | visit news.
- 2026-08-20 | Versiti, I.M.A.M. and Who is Hussain Michigan partner to support Arabic-speaking blood donors | https://imam-us.org/blood-drive-2026 | blood drive announcement.
- 2025-04-27 | Book Launch in Colombia: Emisarios de Dios | https://imam-us.org/book-launch-in-colombia-emisarios-de-dios-la-vida-de-jesus | event report; Spanish.
- 2025-11-28 | Boston's Community for a Better Future | https://imam-us.org/bostons-community-for-a-better-future | visit news.
- 2026-06-13 | Bring Karbala Home This Muharram with Hujja Kids | https://imam-us.org/bring-karbala-home-this-muharram-with-hujja-kids | product promotion.
- 2026-06-14 | Community Leaders Complete Mental Health First Aid Training | https://imam-us.org/community-leaders-complete-mental-health-first-aid-training | training news.
- 2026-06-01 | Community Workshop: ACEs Awareness and Suicide Prevention | https://imam-us.org/community-workshop-highlights-the-importance-of-aces-awareness-and-suicide-prevention | workshop report.
- 2026-06-26 | Contemporary Medical Ethics & Islamic Jurisprudence | https://imam-us.org/contemporary-medical-ethics-islamic-jurisprudence | forum sign-up.
- 2022-09-28 | Delegation from the Imam Hussain Shrine visits Pope Francis | https://imam-us.org/delegation-from-the-imam-hussain-shrine-visits-pope-francis-at-the-vatican | news.
- 2022-11-09 | ECOTHEE-22 Conference | https://imam-us.org/ecological-theology-and-environmental-ethics-ecothee-22-conference | conference news.
- 2025-10-16 | Exploring the Holy Quran: Applied Lessons (live weekly series) | https://imam-us.org/exploring-the-holy-quran-applied-lessons-on-faith-human-nature-and-navigating-life | event sign-up; a 10-week live series, not a course listing.
- 2025-09-24 | Empowering Preparedness: A Proactive Approach to Community Safety | https://imam-us.org/empowering-preparedness-a-proactive-approach-to-community-safety | session report.
- 2026-05-02 | Empowering Our Community: 11 Certified as Youth Mental Health First Aiders | https://imam-us.org/empowering-our-community-11-certified-as-youth-mental-health-first-aiders | certification news.
- 2025-04-26 | Empowering Our Community: Successful Certification in Youth Mental Health First Aid | https://imam-us.org/empowering-our-community-successful-certification-in-youth-mental-health-first-aid | certification news.
- 2023-11-10 | Faith-Based Clergy Conversation at DWIHN | https://imam-us.org/faith-based-clergy-conversation-at-dwihn | event news.
- 2023-03-08 | Feed the Fasting in Need | https://imam-us.org/fasting | fundraising appeal.
- 2023-10-01 | Grand Opening of Al-Zahra Center, Albuquerque, NM | https://imam-us.org/grand-opening-of-al-zahra-center-albuquerque-nm | news.
- 2022-08-11 | Global Blood Heroes | https://imam-us.org/global-blood-heroes | blood drive.

## Skipped (fiqh) - duas.org discovery batch (2026-11-15)
- 2026-11-15 | Special salaat for 7 Rajab (Lailatul Raghaib) | https://www.duas.org/rajab7.htm | prayer-performance page, not a dua record
- 2026-11-15 | Rajab daily salaahs | https://www.duas.org/mobile/rajab-daywise-salaahs.html | prayer-performance guide (not fetched)
- 2026-11-15 | Dua during salah | https://www.duas.org/mobile/dua-during-salah.html | prayer-performance (not fetched)
- 2026-11-15 | Wudhu | https://www.duas.org/wadhu.htm | purity rulings (not fetched)
- 2026-11-15 | Toilet use etiquette | https://www.duas.org/mobile/toiletuse.html | purity rulings (not fetched)
- 2026-11-15 | Salat of Ziarat (ziaratsalat) | https://www.duas.org/ziaratsalat.htm | prayer-performance (not fetched)

## Skipped (fiqh) - duas.org pass (2026-11-15, Haiku worker f)
- 2026-11-15 | Death related duas and info | https://www.duas.org/death.htm | Mainly funeral rulings (ghusl, kafan, burial, will, inheritance) citing Sistani.org. Main purpose is fiqh; no Fiqh heading may be used on duas records. Owner may decide.
- 2026-11-15 | Sajda Shukr (thanksgiving prostration) | https://www.duas.org/mobile/sajda-shukr.html | Prostration with its rules and merits; a ritual performance page, not a dua record.
- 2026-11-15 | Mealtime eating and drinking duas | https://www.duas.org/eating.htm | Includes eating etiquette rules, and the page names no marja.
- 2026-11-15 | Duas to be recited during Wudhu | https://www.duas.org/wadhu.htm | Includes the steps of performing wudhu (purity rules); the page names no marja.
- 2026-11-15 | Salaat of Masomeen | https://www.duas.org/mobile/salat-masumeen.html | Prayer-performance page. (Another worker has since cataloged a salaat-masumeen record; this entry only records this worker's skip.)

## Skipped (other) - duas.org pass (2026-11-15, Haiku worker f)
- 2026-11-15 | Invocation (superiority of tasbeehat and invocations) | https://www.duas.org/Misc/invocation.htm | Led by hadith narrations; hadith narrations are not catalogued as duas.
- 2026-11-15 | Dua Taj / Battles | https://www.duas.org/dua-taj-battles.html | Duplicate of the cataloged Dua Taj (duas-taj, https://www.duas.org/Duataj.htm).
- 2026-11-15 | Dua Ehtejab (ehtijab-dua) | https://www.duas.org/ehtijab-dua.html | Duplicate of the cataloged Dua Ehtejab (duas-ehtejab).
- 2026-11-15 | Dua in obligatory sajda | https://www.duas.org/Misc/sajdadua.htm | Almost no English text (Arabic only).
- 2026-11-15 | Qazai Hajat | https://www.duas.org/duaqazaihajat.htm | No English text (Arabic only).
- 2026-11-15 | Sajjadia index (sajjadiya/sajjadiya.htm) | https://www.duas.org/sajjadiya/sajjadiya.htm | Duplicate of the cataloged Sahifa Sajjadiyah index (duas-sahifa-sajjadiyya).
- 2026-11-15 | Shaban month index variants and Ramadan pages | https://www.duas.org/mobile/ramadan-dua-first-night.html, ramadan-laylatul-qadr-19/21/23 | Dynamic stub pages with no English text.
- 2026-11-15 | Index pages: ziyarat.html, mobile/iraq-ziarat.html, mobile/madina-mecca-rites.html, mobile/imam-mahdi-related.html, mobile/imam-taqi-duas-list.html, mobile/salawaat-list.html, rabiulawwal.htm | Navigation lists that link to pages (many already cataloged); not catalogued as records. Madina-Mecca page also covers Hajj and Umrah rites.

## Skipped (fiqh) - duas.org g1 (2026-11-15)
- 2026-11-15 | Etiquettes of Izn Dukhool, farewell and post-ziyarat rites | https://www.duas.org/mobile/izn-dukhool-etiquettes.html | Mixes etiquette with rulings and prayer instructions (recommended, obligatory, makruh) and salat after ziyarat; names no marja. Owner may decide.
- 2026-11-15 | Routine duas and etiquettes (eating, sleep, mirror, walking, clothing) | https://www.duas.org/routine.htm | Etiquette lists stated as mustahab / makruh / haram, with no marja named. Same reason as the eating page logged above.

## Skipped (other) - duas.org g1 (2026-11-15)
- 2026-11-15 | Imam biography pages (Ali Naqi, Hasan Askari, Imam Ali, Ali Ridha, Zain al-Abidin, Hasan Mujtaba, Husayn, Mahdi) | https://duas.org/mobile/imam-ali-naqi-hadi-as.html ; https://www.duas.org/mobile/imam-hassan-askari-as.html ; https://www.duas.org/mobile/imam-ali-as.html ; https://www.duas.org/mobile/imam-ali-ridha-as.html ; https://www.duas.org/mobile/imam-ali-zainulabideen-as.html ; https://www.duas.org/mobile/imam-hassan-mujtaba-as.html ; https://www.duas.org/mobile/imam-hussain-as.html ; https://www.duas.org/mobile/imam-mahdi-ajtfs.html | Brief life sketches, not dua or ziyarat pages. Owner to decide whether biographies belong in this catalog.
- 2026-11-15 | Baqi cemetery in Medina (history of its destruction) | https://www.duas.org/baqee.htm | History article, not a dua page. Owner to decide.
- 2026-11-15 | Visiting Holy Places index | https://www.duas.org/mobile/visitholyplaces.html | Index of links, no dua text of its own.
- 2026-11-15 | Muharram and Safar resources index | https://www.duas.org/mobile/muharram-home.html | Index of resources and apps, no dua text of its own.
- 2026-11-15 | Ziyarat Aimatul Momineen (alternate page) | https://www.duas.org/mobile/ziarat-aimmat-momineen.html | Same text as the existing record duas-ziyarat-aimmat-momineen (mobile/ziyarat-aimmat-momineen.html); duplicate, not cataloged again.

## Skipped (fiqh) - duas.org G2 batch (2026-11-15)
- 2026-11-15 | Shaban datewise salaahs (night prayers) | https://www.duas.org/mobile/shaban-datewise-salaahs.html | Prayer-performance instructions (rak'at, surahs) with hadith-style reward narrations; marja not stated on the page.
- 2026-11-15 | Sunday Zilqad salat | https://www.duas.org/mobile/zilqad-sunday-salat.html | Prayer-performance instructions (4 rak'at, surahs, istighfar) citing Mafatih al-Jinan; marja not stated on the page.

## Skipped (polemical) - duas.org G2 batch (2026-11-15)
- 2026-11-15 | Rabi al-Awwal 17 (birth of the Prophet and Imam Jafar al-Sadiq) | https://www.duas.org/mobile/rabiulawal-17.html | Date-amaal page that includes a passage attacking a Sunni-named group (Wahhabis) over Mawlid celebrations. Mixed; the owner should decide whether a calendar record without the polemic is acceptable.

## Skipped (mixed, not cataloged) - duas.org G2 batch (2026-11-15)
- 2026-11-15 | Letter to Reciters and Sponsors of Majalis (advice letters) | https://www.duas.org/lettermajalis.htm | A collection of advice from several authorities (Sistani and others). Mixed sources, and a record would need needs_review, which this batch does not allow.

## al-islam.org Ask a Question (2026-11-19)
Partly cataloged: 936 threads so far out of about 5,650 found across 96 topics (items under topic sections under one work record). Drafted by Haiku agents, one fetch per thread page, with titles read in segments so they are the page's own wording; descriptions and sample questions are written from the question title only, never from the answer. Fiqh threads carry `marja: sistani` per the owner (2026-11-13/19), with no author listed. Skipped so far: rows without a complete title (the fetch tool sometimes returns answer text or cuts the title), one thread outside Twelver scope (Ismaili), and threads naming another marja. The rest of the run resumes later; the drafts and shard files are kept outside the repository.

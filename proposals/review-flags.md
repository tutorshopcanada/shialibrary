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

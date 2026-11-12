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

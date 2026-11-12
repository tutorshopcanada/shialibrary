// The "What is Islam?" tour: seven full-screen slides.
//
// DRAFT CONTENT. Everything here is placeholder structure for the design: the slide titles,
// the one-line intros, and the lists of names. None of it is religious content written by the
// catalog, and nothing here has been reviewed by the owner or a scholar. Bios on the name pages
// are placeholders too. Change names, add or remove items freely: no build step.
//
// Item kinds:
//   { concept: 'Tawhid', sub: 'The oneness of God' }          an idea; its page searches the catalog
//   { person: 'Imam Ali', sub: 'Imam 1', as: 'imam' }         a named person (as: prophet | imam | infallible)
//   { book: 'record-id' }                                      a book or collection from the catalog
//   { scholar: 'scholar-id' }                                  an author from data/scholars.yaml
//   { topic: 'heading-id', sub: 'Topic' }                      a topic page
//   { href: '#beginners', name: '...', sub: '...' }            a plain link; add ask: true to focus the search box
//   { auto: 'hadith-works' | 'top-scholars', limit: 6 }        filled from the catalog at load time
// A repeated name (for example the Prophet on slides 3 and 5) is one page, reachable from both slides.

export const TOUR_DRAFT = true;

const IMAMS = [
  ['Imam Ali', 'Imam 1'], ['Imam Hasan', 'Imam 2'], ['Imam Husayn', 'Imam 3'], ['Imam Zayn al-Abidin', 'Imam 4'],
  ['Imam al-Baqir', 'Imam 5'], ['Imam al-Sadiq', 'Imam 6'], ['Imam al-Kazim', 'Imam 7'], ['Imam al-Rida', 'Imam 8'],
  ['Imam al-Jawad', 'Imam 9'], ['Imam al-Hadi', 'Imam 10'], ['Imam al-Askari', 'Imam 11'], ['Imam al-Mahdi', 'Imam 12'],
];
// Sample list for the layout. The owner confirms the final list.
const PROPHETS = ['Adam', 'Idris', 'Nuh', 'Hud', 'Salih', 'Ibrahim', 'Ismail', 'Ishaq', 'Yaqub', 'Yusuf', 'Musa', 'Harun',
  'Dawud', 'Sulayman', 'Ayyub', 'Yunus', 'Zakariyya', 'Yahya', 'Isa'];

const muhammad = { person: 'The Prophet Muhammad', sub: 'The Prophet', as: 'prophet' };
const fatimah = { person: 'Lady Fatimah al-Zahra', sub: 'Lady Fatimah', as: 'infallible' };
const quran = { concept: 'The Quran', sub: 'Scripture', as: 'book' };
const imams = IMAMS.map(([person, sub]) => ({ person, sub, as: 'imam' }));

export const TOUR = [
  { k: 'revelation', label: 'The divine mission', title: 'The divine mission',
    lede: 'Where the story begins: the idea of a divine mission, and of revelation.',
    groups: [{ label: 'Key ideas', items: [
      { concept: 'Tawhid', sub: 'The oneness of God' },
      { concept: 'Revelation (Wahy)', sub: 'How guidance is sent' },
      { concept: 'Prophethood (Nubuwwah)', sub: 'Messengers and guidance' },
      { concept: 'Divine justice (Adl)', sub: 'Justice as a principle' },
      { concept: 'The afterlife (Maad)', sub: 'Return and accountability' },
    ] }] },
  { k: 'prophets', label: 'The prophets and the books', title: 'The prophets and the books',
    lede: 'The prophets, and the books linked with them.',
    groups: [
      { label: 'The prophets', items: PROPHETS.map((n) => ({ person: `Prophet ${n}`, sub: 'Prophet', as: 'prophet' })) },
      { label: 'The books', lead: true, items: [
        { concept: 'The Torah', sub: 'Scripture', as: 'book' }, { concept: 'The Psalms', sub: 'Scripture', as: 'book' },
        { concept: 'The Gospel', sub: 'Scripture', as: 'book' }, quran] },
    ] },
  { k: 'muhammad', label: 'Prophet Muhammad and the Quran', title: 'Prophet Muhammad and the Quran',
    lede: 'The last messenger, and the book revealed to him.',
    groups: [{ lead: true, items: [muhammad, quran,
      { concept: 'Hadith and the Prophet’s sayings', sub: 'How they were recorded' },
      { concept: 'Ahl al-Bayt', sub: 'The Prophet’s family' }] }] },
  { k: 'wilayah', label: 'Wilayah', title: 'Wilayah', lede: 'Wilayah, the idea of guardianship and leadership after the Prophet, and where to read about it.',
    groups: [{ lead: true, items: [{ concept: 'Wilayah', sub: 'Guardianship and leadership' },
      { concept: 'Ghadir and the succession', sub: 'A turning point' },
      { book: 'al-islam-imamate-wilayah-part-1' }, { book: 'al-islam-shiism-imamate-wilayat' },
      { topic: 'imamate', sub: 'Topic', name: 'Imamate' }] }] },
  { k: 'infallibles', label: 'The infallibles', title: 'The infallibles', lede: 'The Prophet, Lady Fatimah and the Twelve Imams.',
    groups: [{ label: 'The Prophet and Lady Fatimah', lead: true, items: [muhammad, fatimah] },
      { label: 'The Twelve Imams', items: imams }] },
  { k: 'scholars', label: 'The traditions and the scholars', title: 'The traditions and the scholars',
    lede: 'The early works of Shia history, and the classical scholars who compiled and preserved them.',
    groups: [
      { label: 'The four main books', lead: true, items: [
        { concept: 'Al-Kafi', sub: 'Al-Kulayni · Hadith collection', as: 'book' },
        { concept: 'Man La Yahduruhu al-Faqih', sub: 'Al-Saduq · Hadith collection', as: 'book' },
        { concept: 'Tahdhib al-Ahkam', sub: 'Al-Tusi · Hadith collection', as: 'book' }] },
      { label: 'Other early works', items: [
        { book: 'thaqalayn-nahj-al-balagha' }, { book: 'thaqalayn-risalat-al-huquq' },
        { book: 'thaqalayn-kitab-al-ghayba-numani' }, { book: 'thaqalayn-al-tawhid' }, { book: 'thaqalayn-kamal-al-din' }] },
      { label: 'The classical scholars', items: ['kulayni', 'saduq', 'mufid', 'sharif-al-radi', 'tusi', 'ibn-qulawayh', 'numani'].map((x) => ({ scholar: x })) }] },
  { k: 'today', label: 'Today', title: 'Today', lede: 'The major scholars of the 20th century and of today, and where to go next.',
    groups: [
      { label: 'Scholars of the 20th century', lead: true, items: [
        { person: 'Sayyid Husayn Burujirdi', sub: 'Scholar', as: 'scholar' }, { person: 'Sayyid Muhsin al-Hakim', sub: 'Scholar', as: 'scholar' },
        { person: 'Sayyid Abu al-Qasim al-Khoei', sub: 'Scholar', as: 'scholar' }, { scholar: 'ruhullah-khomeini' },
        { scholar: 'tabatabai' }, { scholar: 'mutahhari' }, { scholar: 'muhammad-baqir-al-sadr' }, { scholar: 'ali-shariati' },
        { person: 'Sayyid Muhammad Husayn Fadlallah', sub: 'Scholar', as: 'scholar' }, { person: 'Shaykh Muhammad Taqi Bahjat', sub: 'Scholar', as: 'scholar' }] },
      { label: 'Scholars of today', items: [
        { scholar: 'sistani' }, { scholar: 'khamenei' }, { scholar: 'makarem-shirazi' },
        { person: 'Shaykh Husayn Vahid Khorasani', sub: 'Scholar', as: 'scholar' }, { person: 'Shaykh Hossein Nouri Hamadani', sub: 'Scholar', as: 'scholar' },
        { person: 'Shaykh Muhammad Ishaq al-Fayyad', sub: 'Scholar', as: 'scholar' }, { person: 'Shaykh Bashir al-Najafi', sub: 'Scholar', as: 'scholar' },
        { scholar: 'misbah-yazdi' }, { scholar: 'abdullah-jawadi-amuli' }, { scholar: 'jafar-subhani' }] },
      { label: 'Go further', items: [
        { href: '#beginners', name: 'Read the introductions', sub: 'Seven introductions, then a plan' },
        { href: '#topics', name: 'Browse by topic', sub: 'Eight subjects, easiest first' },
        { href: '#home', ask: true, name: 'Ask a question', sub: 'Search the catalog' },
        { topic: 'taqlid', sub: 'Topic', name: 'Following a jurist' },
        { topic: 'muslims-in-west', sub: 'Topic', name: 'Muslims in the West' }] },
    ] },
];

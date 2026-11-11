# sistani.org: how the English site is organized

Inspected 2026-11-10 (about 20 page requests). robots.txt: `User-agent: *` with no disallow rules.

## Books (`/english/book/fatwa/`)

| Book | URL | Pages listed |
|---|---|---|
| Islamic Laws | `/english/book/48/` | about 310 |
| A Code of Practice For Muslims in the West | `/english/book/46/` | 62 |
| Jurisprudence Made Easy | `/english/book/49/` | about 35 |
| Summary of the Rules of Worship | `/english/book/26890/` | about 48 |
| Women's Religious Rules | `/english/book/26927/` | about 71 |
| Hajj Rituals | `/english/book/47/` | about 34 |

- The book the owner called "Rulings in the West" is titled **A Code of Practice For Muslims
  in the West** on the site (Arabic title given in its preface: *al-Fiqh lil Mughtaribin*).
  Its front matter names **Sayyid Abdul Hadi al-Hakim** as author and says it presents the
  views of Sayyid Sistani; translated by Sayyid Mohammad Rizvi.
- It has 4 front-matter pages, then 18 topic chapters (Migration, Taqlid, Purity, Salat,
  Fasting, Hajj, Death, Eating and drinking, Dress, Local laws, Work, Social life, Medical,
  Marriage, Women, Youth, Music, Miscellaneous), each split into **three pages**:
  Introduction, General Rules, Questions and Answers. Then an epilogue and 4 appendices.
- URL pattern: `/english/book/<book-id>/<page-id>/`. Each page has a stable URL.
- **The individual rulings and questions inside a book page have no anchors or URLs of their
  own.** So for the books, the deepest record we can link to is the page. In the catalog:
  book = `work`, page = `section`, no `item` records.

## Question & Answer (`/english/qa/`)

- An alphabetical index of about 175 topics (Abortion, Alcohol, Congregational Prayers, ...).
- Topic page: `/english/qa/<5-digit topic id>/` listing its questions with answers.
- **Each question has a stable address:** `/english/qa/<question id>/` redirects to
  `/english/qa/<topic id>/#<question id>` (an anchor on the topic page), and the page prints
  a short link `sistani.org/<question id>`.
- In the catalog: Q&A area = `work`, topic = `section`, question = `item`, with the item URL
  in the anchored form the site redirects to.
- Some topics list the same question twice under different ids. Each is cataloged, since
  each has its own link.

## Volume

Item-level cataloging of the whole Q&A area means about 175 topic pages (one request each;
the questions are on the topic page), likely a few thousand item records. The six books are
about 560 pages. At one request per 1.5 seconds this is light traffic, but for a public
catalog it is worth telling the office what we are doing.

## Pilot done

- Code of Practice: the work record and the three Salat chapter pages.
- Q&A: the work record, the topic "Congregational Prayers", and its 8 questions.

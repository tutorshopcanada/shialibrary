# Cataloging guide

The rules are in `CLAUDE.md` section 6. This page adds the working details.

## Before a session
1. Read `docs/scope.md` and check the source is `status: active` in `config/sources.yaml`.
2. Check `progress/done-<source>.txt` and skip what is already there.
3. Fetch politely: identify the client, one request every 1.5 seconds or slower, never the
   paths robots.txt disallows. A refusal is logged in `progress/failed-<source>.txt` and left alone.

## Writing a record
- One file per record: `data/records/<source-folder>/<id>.yaml`, file name equal to the id.
- Ids: `<source>-<slug>`, lowercase with hyphens. Never renamed once committed.
- `title` is the heading or question as the page shows it. `description` is your own 1-3
  sentences (600 characters at most) for a newcomer, with unfamiliar terms explained.
- Fiqh records (`content_tag: fiqh`, a heading under Fiqh, `marja` set): describe the topic of
  the page or question. Never say what the ruling is, in the description or the sample questions.
- `authors` is who the page names as author. `marja` is whose rulings a fiqh record presents.
- `sample_questions`: 3-8 questions a beginner might type, based on what the page covers.
- `level`: from what the page says about itself. If unsure, choose the more advanced level and flag.
- Anything the page does not state stays blank.

## Hierarchy by source
- **sistani.org books:** book = work, each page = section. No items (no per-ruling links).
- **sistani.org Q&A:** Q&A area = work, topic = section, question = item with the URL
  `https://www.sistani.org/english/qa/<topic>/#<question-id>`.
- **thaqalayn:** see the notes in the thaqalayn records and `config/sources.yaml`.

## After a batch
Run `python3 scripts/validate.py` until it reports no errors, append the URLs to the done
file, and commit the batch on its own.

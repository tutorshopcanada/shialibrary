# Shia Library

A free catalog and search tool for Shia resources, modeled on PubMed: short, structured
records that describe a resource and link to where it lives on an approved website. Nothing
is hosted or republished here, and the search never writes answers.

- Scope and inclusion rules: [docs/scope.md](docs/scope.md)
- Project brief and cataloging rules: [CLAUDE.md](CLAUDE.md)

## Layout

| Path | What |
|---|---|
| `config/sources.yaml` | Approved sources. Nothing else is cataloged. |
| `data/records/` | One YAML file per catalog record |
| `data/vocabulary.yaml` | Subject headings with alternate terms (draft) |
| `data/scholars.yaml` | Authority file for scholars and authors |
| `data/questions.yaml`, `data/paths/` | Starter questions and learning paths (drafts) |
| `scripts/validate.py` | Checks every record and reference |
| `scripts/build_index.py` | Builds `site/data/index.json` |
| `site/` | The static search page |

## Use

```bash
pip install pyyaml
python3 scripts/validate.py
python3 scripts/build_index.py
python3 -m http.server 8000 --directory site
node scripts/eval_search.mjs
```

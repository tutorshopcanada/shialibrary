#!/usr/bin/env python3
"""Build the static search index (no AI, no network).

Reads the catalog (records, vocabulary, scholars, sources, starter questions,
learning paths, search settings) and writes ONE file, site/data/index.json,
which the search page loads. Also converts data/search-eval.yaml to
site/data/search-eval.json so the Node eval runner needs no YAML parser.

Usage:
    python3 scripts/build_index.py                 # build from the repo
    python3 scripts/build_index.py --exclude-drafts
    python3 scripts/build_index.py --root /path/to/fixtures --out /tmp/out

The build fails loudly (exit code 1, every problem listed) on dangling
references: unknown headings, scholars, sources, parents, or records named by
questions and paths. It is not a replacement for scripts/validate.py, which
checks the full schema; it only refuses to publish an index with broken links
between its own parts.
"""

from __future__ import annotations

import argparse
import datetime as _dt
import json
import sys
from pathlib import Path

try:
    import yaml
except ImportError:  # pragma: no cover
    sys.exit("PyYAML is required: pip install pyyaml")

LEVELS = ("beginner", "intermediate", "advanced")
TAGS = ("fiqh", "hadith", "book", "article", "course", "lecture", "other")
GRANULARITY_RANK = {"work": 0, "section": 1, "item": 2}

# Record fields copied into the index as-is when they are not empty.
RECORD_FIELDS = (
    "id", "type", "content_tag", "granularity", "parent", "level", "title",
    "title_original", "authors", "marja", "source", "url", "language", "date",
    "description", "sample_questions", "headings", "access", "location",
    "provider", "instructors", "delivery", "duration", "start_date", "cost",
    "enrollment_url", "needs_review",
)


class Problems:
    """Collects every error so the owner sees them all in one run."""

    def __init__(self) -> None:
        self.errors: list[str] = []
        self.warnings: list[str] = []

    def error(self, msg: str) -> None:
        self.errors.append(msg)

    def warn(self, msg: str) -> None:
        self.warnings.append(msg)


def load_yaml(path: Path, problems: Problems):
    try:
        with path.open(encoding="utf-8") as fh:
            return yaml.safe_load(fh)
    except yaml.YAMLError as exc:
        problems.error(f"{path}: not valid YAML ({exc})")
        return None


def as_list(value) -> list:
    if value is None or value == "":
        return []
    if isinstance(value, (list, tuple)):
        return [v for v in value if v not in (None, "")]
    return [value]


def text(value) -> str:
    """Plain string for a scalar field (dates become ISO strings)."""
    if value is None:
        return ""
    if isinstance(value, (_dt.date, _dt.datetime)):
        return value.isoformat()
    return str(value).strip()


def is_http_url(value: str) -> bool:
    return value.startswith("https://") or value.startswith("http://")


def top_level_list(doc, key: str, path: Path, problems: Problems) -> list:
    """Return doc[key] as a list. Accepts a bare list too. Empty file -> []."""
    if doc is None:
        return []
    if isinstance(doc, list):
        return doc
    if isinstance(doc, dict):
        items = doc.get(key)
        if items is None:
            return []
        if isinstance(items, list):
            return items
    problems.error(f"{path}: expected a top-level '{key}:' list")
    return []


# --------------------------------------------------------------------------
# Loaders
# --------------------------------------------------------------------------

def load_sources(root: Path, problems: Problems) -> list[dict]:
    path = root / "config" / "sources.yaml"
    if not path.exists():
        problems.error(f"{path}: missing (approved sources are required)")
        return []
    out = []
    for raw in top_level_list(load_yaml(path, problems), "sources", path, problems):
        if not isinstance(raw, dict) or not raw.get("id"):
            problems.error(f"{path}: every source needs an id")
            continue
        base_url = text(raw.get("base_url"))
        out.append({
            "id": text(raw["id"]),
            "name": text(raw.get("name")) or text(raw["id"]),
            "type": text(raw.get("type")),
            "base_url": base_url if is_http_url(base_url) else "",
            "status": text(raw.get("status")) or "active",
            "catalog_level": text(raw.get("catalog_level")),
        })
    return out


def load_headings(root: Path, problems: Problems) -> tuple[list[dict], bool]:
    path = root / "data" / "vocabulary.yaml"
    if not path.exists():
        problems.error(f"{path}: missing (the subject headings are required)")
        return [], False
    doc = load_yaml(path, problems)
    draft = bool(doc.get("draft")) if isinstance(doc, dict) else False
    out, seen = [], set()
    for raw in top_level_list(doc, "headings", path, problems):
        if not isinstance(raw, dict) or not raw.get("id"):
            problems.error(f"{path}: every heading needs an id")
            continue
        hid = text(raw["id"])
        if hid in seen:
            problems.error(f"{path}: duplicate heading id '{hid}'")
            continue
        seen.add(hid)
        out.append({
            "id": hid,
            "label": text(raw.get("label")) or hid,
            "parent": text(raw.get("parent")),
            "alt_terms": [text(t) for t in as_list(raw.get("alt_terms"))],
        })
    by_id = {h["id"]: h for h in out}
    for h in out:
        if h["parent"] and h["parent"] not in by_id:
            problems.error(f"{path}: heading '{h['id']}' has unknown parent '{h['parent']}'")
            h["parent"] = ""
    # Ancestors (nearest first), with cycle detection.
    for h in out:
        chain, cur, guard = [], h["parent"], {h["id"]}
        while cur:
            if cur in guard:
                problems.error(f"{path}: heading '{h['id']}' is in a parent cycle")
                break
            guard.add(cur)
            chain.append(cur)
            cur = by_id[cur]["parent"] if cur in by_id else ""
        h["ancestors"] = chain
    for h in out:
        h["children"] = [c["id"] for c in out if c["parent"] == h["id"]]
    return out, draft


def load_scholars(root: Path, problems: Problems) -> list[dict]:
    path = root / "data" / "scholars.yaml"
    if not path.exists():
        problems.error(f"{path}: missing (the scholar authority file is required)")
        return []
    out, seen = [], set()
    for raw in top_level_list(load_yaml(path, problems), "scholars", path, problems):
        if not isinstance(raw, dict) or not raw.get("id"):
            problems.error(f"{path}: every scholar needs an id")
            continue
        sid = text(raw["id"])
        if sid in seen:
            problems.error(f"{path}: duplicate scholar id '{sid}'")
            continue
        seen.add(sid)
        out.append({
            "id": sid,
            "name": text(raw.get("name")) or sid,
            "alt_names": [text(n) for n in as_list(raw.get("alt_names"))],
        })
    return out


def load_search_config(root: Path, problems: Problems) -> dict:
    path = root / "config" / "search.yaml"
    if not path.exists():
        # Fixture roots usually have no search settings: use this repo's.
        path = Path(__file__).resolve().parent.parent / "config" / "search.yaml"
    if not path.exists():
        problems.warn(f"{path}: missing, the page will use its built-in defaults")
        return {}
    doc = load_yaml(path, problems)
    return doc if isinstance(doc, dict) else {}


def load_records(root: Path, problems: Problems) -> list[dict]:
    base = root / "data" / "records"
    if not base.exists():
        problems.warn(f"{base}: no records directory yet, building an empty index")
        return []
    out = []
    for path in sorted(base.rglob("*.yaml")) + sorted(base.rglob("*.yml")):
        doc = load_yaml(path, problems)
        if doc is None:
            continue
        if not isinstance(doc, dict):
            problems.error(f"{path}: expected one record (a mapping) per file")
            continue
        doc["_file"] = str(path.relative_to(root))
        out.append(doc)
    return out


# --------------------------------------------------------------------------
# Building
# --------------------------------------------------------------------------

def build_records(raw_records, headings, scholars, sources, problems: Problems) -> list[dict]:
    heading_by_id = {h["id"]: h for h in headings}
    scholar_ids = {s["id"] for s in scholars}
    source_by_id = {s["id"]: s for s in sources}

    records, by_id, urls = [], {}, {}
    for raw in raw_records:
        where = raw.get("_file", "?")
        rid = text(raw.get("id"))
        if not rid:
            problems.error(f"{where}: record has no id")
            continue
        if rid in by_id:
            problems.error(f"{where}: duplicate record id '{rid}' (also in {by_id[rid]['_file']})")
            continue

        rec: dict = {"_file": where}
        for field in RECORD_FIELDS:
            value = raw.get(field)
            if field in ("authors", "instructors", "headings", "sample_questions"):
                value = [text(v) for v in as_list(value)]
            elif field == "needs_review":
                value = bool(value)
            else:
                value = text(value)
            rec[field] = value

        for field in ("title", "url", "source"):
            if not rec[field]:
                problems.error(f"{where}: '{rid}' has no {field}")
        if rec["url"] and not is_http_url(rec["url"]):
            problems.error(f"{where}: '{rid}' url must start with http:// or https://")
        if rec["enrollment_url"] and not is_http_url(rec["enrollment_url"]):
            problems.error(f"{where}: '{rid}' enrollment_url must start with http:// or https://")
        if rec["level"] not in LEVELS:
            problems.error(f"{where}: '{rid}' level '{rec['level']}' is not one of {', '.join(LEVELS)}")
        if rec["content_tag"] not in TAGS:
            problems.error(f"{where}: '{rid}' content_tag '{rec['content_tag']}' is not one of {', '.join(TAGS)}")
        rec["granularity"] = rec["granularity"] or "work"
        if rec["granularity"] not in GRANULARITY_RANK:
            problems.error(f"{where}: '{rid}' granularity '{rec['granularity']}' is not work, section or item")

        if rec["source"] and rec["source"] not in source_by_id:
            problems.error(f"{where}: '{rid}' source '{rec['source']}' is not in config/sources.yaml")
        elif rec["source"] and source_by_id[rec["source"]]["status"] != "active":
            problems.warn(f"{where}: '{rid}' comes from source '{rec['source']}' whose status is "
                          f"'{source_by_id[rec['source']]['status']}', not active")
        for hid in rec["headings"]:
            if hid not in heading_by_id:
                problems.error(f"{where}: '{rid}' uses unknown heading '{hid}'")
        for field in ("authors", "instructors"):
            for sid in rec[field]:
                if sid not in scholar_ids:
                    problems.error(f"{where}: '{rid}' {field} has unknown scholar '{sid}'")
        if rec["marja"] and rec["marja"] not in scholar_ids:
            problems.error(f"{where}: '{rid}' marja '{rec['marja']}' is not in data/scholars.yaml")
        if rec["url"]:
            if rec["url"] in urls:
                problems.warn(f"{where}: '{rid}' has the same url as '{urls[rec['url']]}'")
            urls[rec["url"]] = rid

        # Headings inherited upward: the record's own headings plus all ancestors.
        inherited: list[str] = []
        for hid in rec["headings"]:
            for anc in heading_by_id.get(hid, {}).get("ancestors", []):
                if anc not in rec["headings"] and anc not in inherited:
                    inherited.append(anc)
        rec["inherited_headings"] = inherited

        by_id[rid] = rec
        records.append(rec)

    # Hierarchy: resolve parents into "in context" links.
    for rec in records:
        rid, where = rec["id"], rec["_file"]
        chain, cur, guard = [], rec["parent"], {rid}
        while cur:
            if cur not in by_id:
                problems.error(f"{where}: '{rid}' has unknown parent '{cur}'"
                               if cur == rec["parent"]
                               else f"{where}: '{rid}' has an ancestor with unknown parent '{cur}'")
                break
            if cur in guard:
                problems.error(f"{where}: '{rid}' is in a parent cycle")
                break
            guard.add(cur)
            chain.append(by_id[cur])
            cur = by_id[cur]["parent"]
        if rec["granularity"] != "work" and not rec["parent"]:
            problems.error(f"{where}: '{rid}' is a {rec['granularity']} but has no parent")
        if chain:
            direct = chain[0]
            if GRANULARITY_RANK.get(direct["granularity"], 0) >= GRANULARITY_RANK.get(rec["granularity"], 0):
                problems.error(f"{where}: '{rid}' ({rec['granularity']}) cannot have parent "
                               f"'{direct['id']}' ({direct['granularity']})")
        context = {}
        for anc in chain:
            kind = anc["granularity"]
            if kind in ("section", "work") and kind not in context:
                context[kind] = {"id": anc["id"], "title": anc["title"], "url": anc["url"]}
        rec["context"] = context
        rec["ancestors"] = [anc["id"] for anc in chain]

    children: dict[str, int] = {}
    for rec in records:
        for anc in rec["ancestors"]:
            children[anc] = children.get(anc, 0) + 1
    for rec in records:
        rec["descendant_count"] = children.get(rec["id"], 0)

    return records


def slim(rec: dict) -> dict:
    """Drop empty values and private keys to keep index.json small."""
    return {k: v for k, v in rec.items()
            if not k.startswith("_") and v not in ("", [], {}, None, False, 0)}


def build_questions(root: Path, record_ids, heading_ids, path_ids, exclude_drafts, problems: Problems):
    path = root / "data" / "questions.yaml"
    if not path.exists():
        return []
    out, seen = [], set()
    for raw in top_level_list(load_yaml(path, problems), "questions", path, problems):
        if not isinstance(raw, dict) or not raw.get("id"):
            problems.error(f"{path}: every question needs an id")
            continue
        qid = text(raw["id"])
        draft = bool(raw.get("draft", True))  # unreviewed unless stated otherwise
        if exclude_drafts and draft:
            continue
        if qid in seen:
            problems.error(f"{path}: duplicate question id '{qid}'")
            continue
        seen.add(qid)
        if not text(raw.get("question")):
            problems.error(f"{path}: '{qid}' has no question text")
        q = {
            "id": qid,
            "question": text(raw.get("question")),
            "alt_phrasings": [text(p) for p in as_list(raw.get("alt_phrasings"))],
            "headings": [text(h) for h in as_list(raw.get("headings"))],
            "path": text(raw.get("path")),
            "top_records": [text(r) for r in as_list(raw.get("top_records"))],
            "draft": draft,
        }
        for hid in q["headings"]:
            if hid not in heading_ids:
                problems.error(f"{path}: '{qid}' uses unknown heading '{hid}'")
        for rid in q["top_records"]:
            if rid not in record_ids:
                problems.error(f"{path}: '{qid}' names unknown record '{rid}'")
        if q["path"] and q["path"] not in path_ids["all"]:
            problems.error(f"{path}: '{qid}' names unknown path '{q['path']}'")
        elif q["path"] and q["path"] not in path_ids["kept"]:
            q["path"] = ""  # the path is a draft and drafts are excluded
        out.append(slim(q) | {"draft": draft})
    return out


def build_paths(root: Path, record_ids, exclude_drafts, problems: Problems):
    base = root / "data" / "paths"
    out, all_ids = [], set()
    if not base.exists():
        return out, {"all": all_ids, "kept": set()}
    for path in sorted(base.glob("*.yaml")) + sorted(base.glob("*.yml")):
        raw = load_yaml(path, problems)
        if raw is None:
            continue
        if not isinstance(raw, dict) or not raw.get("id"):
            problems.error(f"{path}: expected one path with an id")
            continue
        pid = text(raw["id"])
        if pid in all_ids:
            problems.error(f"{path}: duplicate path id '{pid}'")
            continue
        all_ids.add(pid)
        draft = bool(raw.get("draft", True))
        steps = []
        for i, step in enumerate(as_list(raw.get("steps")), start=1):
            rid = text(step.get("record")) if isinstance(step, dict) else ""
            if rid not in record_ids:
                problems.error(f"{path}: step {i} names unknown record '{rid}'")
                continue
            steps.append({"record": rid, "why": text(step.get("why"))})
        if not steps:
            problems.error(f"{path}: '{pid}' has no steps")
        if exclude_drafts and draft:
            continue
        out.append({
            "id": pid,
            "title": text(raw.get("title")) or pid,
            "intro": text(raw.get("intro")),
            "steps": steps,
            "draft": draft,
        })
    return out, {"all": all_ids, "kept": {p["id"] for p in out}}


def build_eval(root: Path, record_ids, problems: Problems):
    path = root / "data" / "search-eval.yaml"
    if not path.exists():
        return []
    out = []
    for raw in top_level_list(load_yaml(path, problems), "queries", path, problems):
        if not isinstance(raw, dict) or not text(raw.get("query")):
            problems.error(f"{path}: every entry needs a query")
            continue
        expect = [text(r) for r in as_list(raw.get("expect_any"))]
        expect_none = bool(raw.get("expect_none"))
        if expect_none and expect:
            problems.error(f"{path}: query '{raw['query']}' has both expect_any and expect_none")
        for rid in expect:
            if rid not in record_ids:
                problems.error(f"{path}: query '{raw['query']}' expects unknown record '{rid}'")
        group = text(raw.get("expect_group")) or "any"
        if group not in ("exact", "related", "any"):
            problems.error(f"{path}: query '{raw['query']}' expect_group must be exact, related or any")
        out.append({"query": text(raw["query"]), "expect_any": expect, "expect_none": expect_none,
                    "expect_group": group, "note": text(raw.get("note"))})
    return out


def main(argv=None) -> int:
    repo = Path(__file__).resolve().parent.parent
    ap = argparse.ArgumentParser(description="Build site/data/index.json from the catalog.")
    ap.add_argument("--root", type=Path, default=repo,
                    help="project root containing config/ and data/ (default: this repo)")
    ap.add_argument("--out", type=Path, default=None,
                    help="output directory (default: <repo>/site/data, or <root>/site/data with --root)")
    ap.add_argument("--exclude-drafts", action="store_true",
                    help="leave out starter questions and paths marked draft: true")
    ap.add_argument("--pretty", action="store_true", help="indent the JSON (bigger file)")
    args = ap.parse_args(argv)

    root = args.root.resolve()
    out_dir = (args.out or (root / "site" / "data")).resolve()
    problems = Problems()

    sources = load_sources(root, problems)
    headings, vocab_draft = load_headings(root, problems)
    scholars = load_scholars(root, problems)
    config = load_search_config(root, problems)
    records = build_records(load_records(root, problems), headings, scholars, sources, problems)

    record_ids = {r["id"] for r in records}
    heading_ids = {h["id"] for h in headings}
    paths, path_ids = build_paths(root, record_ids, args.exclude_drafts, problems)
    questions = build_questions(root, record_ids, heading_ids, path_ids, args.exclude_drafts, problems)
    eval_queries = build_eval(root, record_ids, problems)

    for w in problems.warnings:
        print(f"warning: {w}", file=sys.stderr)
    if problems.errors:
        for e in problems.errors:
            print(f"ERROR: {e}", file=sys.stderr)
        print(f"\nIndex NOT written: {len(problems.errors)} problem(s) found.", file=sys.stderr)
        return 1

    index = {
        "schema": 1,
        "build_date": _dt.date.today().isoformat(),
        "drafts_excluded": bool(args.exclude_drafts),
        "vocabulary_draft": vocab_draft,
        "config": config,
        "sources": sources,
        "scholars": scholars,
        "headings": headings,
        "questions": questions,
        "paths": paths,
        "records": [slim(r) for r in records],
    }

    out_dir.mkdir(parents=True, exist_ok=True)
    dump = dict(ensure_ascii=False, sort_keys=False)
    dump.update({"indent": 1} if args.pretty else {"separators": (",", ":")})
    (out_dir / "index.json").write_text(json.dumps(index, **dump) + "\n", encoding="utf-8")
    (out_dir / "search-eval.json").write_text(
        json.dumps({"queries": eval_queries}, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")

    size_kb = (out_dir / "index.json").stat().st_size / 1024
    print(f"Wrote {out_dir / 'index.json'} ({size_kb:.0f} KB): {len(records)} records, "
          f"{len(headings)} headings, {len(scholars)} scholars, {len(sources)} sources, "
          f"{len(questions)} questions, {len(paths)} paths; {len(eval_queries)} eval queries.")
    return 0


if __name__ == "__main__":
    sys.exit(main())

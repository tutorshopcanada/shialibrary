#!/usr/bin/env python3
"""Validate the catalog. Plain rules only: no AI, no network.

Usage:  python3 scripts/validate.py [--root PATH]
Exit code 0 when there are no errors (warnings do not fail the run).
"""
import argparse
import datetime
import glob
import os
import re
import sys
from urllib.parse import urlparse

import yaml

TYPES = {"book", "lecture", "article", "hadith-collection", "qa", "video", "course", "other"}
TAGS = {"fiqh", "hadith", "book", "article", "course", "lecture", "other"}
GRANULARITY = ["item", "section", "work"]  # low -> high
LEVELS = {"beginner", "intermediate", "advanced"}
ACCESS = {"free", "paid", "login-required", "unknown"}
MARJA = {"sistani", "khamenei"}
REQUIRED = ["id", "type", "content_tag", "granularity", "level", "title", "source", "url",
            "language", "description", "sample_questions", "headings", "access", "cataloged_on"]
KNOWN = set(REQUIRED) | {
    "parent", "title_original", "authors", "marja", "date", "location", "provider",
    "instructors", "delivery", "duration", "start_date", "cost", "enrollment_url",
    "needs_review", "review_note"}
ID_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
# A type's natural tag when the record is not fiqh.
TYPE_TAG = {"hadith-collection": "hadith", "book": "book", "article": "article",
            "lecture": "lecture", "video": "lecture", "course": "course"}


class Report:
    def __init__(self):
        self.errors, self.warnings = [], []

    def err(self, where, msg):
        self.errors.append(f"ERROR  {where}: {msg}")

    def warn(self, where, msg):
        self.warnings.append(f"warn   {where}: {msg}")


def load(path):
    with open(path, encoding="utf-8") as f:
        return yaml.safe_load(f)


def as_date(value):
    if isinstance(value, datetime.date):
        return value
    if isinstance(value, str) and re.fullmatch(r"\d{4}-\d{2}-\d{2}", value):
        try:
            return datetime.date.fromisoformat(value)
        except ValueError:
            return None
    return None


def good_url(u):
    if not isinstance(u, str) or u != u.strip() or " " in u:
        return False
    p = urlparse(u)
    return p.scheme in ("http", "https") and "." in p.netloc


def norm_url(u):
    p = urlparse(u.strip())
    host = p.netloc.lower()
    host = host[4:] if host.startswith("www.") else host
    return f"{host}{p.path.rstrip('/')}?{p.query}#{p.fragment}"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", default=os.path.join(os.path.dirname(__file__), ".."))
    args = ap.parse_args()
    root = os.path.abspath(args.root)
    rep = Report()
    today = datetime.date.today()

    # ── vocabulary ────────────────────────────────────────────────────────────
    vocab = (load(os.path.join(root, "data/vocabulary.yaml")) or {}).get("headings") or []
    heads = {}
    for h in vocab:
        hid = h.get("id")
        if not hid or not ID_RE.match(str(hid)):
            rep.err("vocabulary", f"bad heading id {hid!r}")
            continue
        if hid in heads:
            rep.err("vocabulary", f"duplicate heading id {hid}")
        heads[hid] = h
        if not h.get("label"):
            rep.err("vocabulary", f"{hid}: missing label")
        if not isinstance(h.get("alt_terms") or [], list):
            rep.err("vocabulary", f"{hid}: alt_terms must be a list")
    for hid, h in heads.items():
        if h.get("parent") and h["parent"] not in heads:
            rep.err("vocabulary", f"{hid}: parent {h['parent']!r} does not exist")

    def ancestors(hid):
        seen = []
        while hid and hid in heads and hid not in seen:
            seen.append(hid)
            hid = heads[hid].get("parent")
        return seen

    for hid in heads:
        chain, cur = set(), hid
        while cur:
            if cur in chain:
                rep.err("vocabulary", f"{hid}: cycle in parents")
                break
            chain.add(cur)
            cur = heads.get(cur, {}).get("parent")

    def is_fiqh(hid):
        return "fiqh" in ancestors(hid)

    # ── scholars and sources ──────────────────────────────────────────────────
    scholars = {}
    for s in (load(os.path.join(root, "data/scholars.yaml")) or {}).get("scholars") or []:
        sid = s.get("id")
        if not sid or not ID_RE.match(str(sid)):
            rep.err("scholars", f"bad scholar id {sid!r}")
            continue
        if sid in scholars:
            rep.err("scholars", f"duplicate scholar id {sid}")
        if not s.get("name"):
            rep.err("scholars", f"{sid}: missing name")
        scholars[sid] = s

    src_cfg = load(os.path.join(root, "config/sources.yaml")) or {}
    sources = {s["id"]: s for s in src_cfg.get("sources") or []}
    institutes = {i.get("name") for i in src_cfg.get("institutes") or []}

    # ── records ───────────────────────────────────────────────────────────────
    records, urls = {}, {}
    for path in sorted(glob.glob(os.path.join(root, "data/records/**/*.yaml"), recursive=True)):
        rel = os.path.relpath(path, root)
        try:
            r = load(path)
        except yaml.YAMLError as e:
            rep.err(rel, f"YAML does not parse: {e}")
            continue
        if not isinstance(r, dict):
            rep.err(rel, "file is not a single record (mapping)")
            continue
        rid = r.get("id")
        for k in REQUIRED:
            if r.get(k) in (None, "", []):
                rep.err(rel, f"missing required field '{k}'")
        for k in r:
            if k not in KNOWN:
                rep.err(rel, f"unknown field '{k}'")
        if not rid or not ID_RE.match(str(rid)):
            rep.err(rel, f"bad id {rid!r} (lowercase letters, digits, hyphens)")
            continue
        if os.path.basename(path) != f"{rid}.yaml":
            rep.err(rel, f"file name must be {rid}.yaml")
        if rid in records:
            rep.err(rel, f"duplicate id (also in {records[rid]['_file']})")
            continue
        r["_file"] = rel
        records[rid] = r

        if r.get("type") not in TYPES:
            rep.err(rel, f"type {r.get('type')!r} not allowed")
        if r.get("content_tag") not in TAGS:
            rep.err(rel, f"content_tag {r.get('content_tag')!r} not allowed")
        if r.get("granularity") not in GRANULARITY:
            rep.err(rel, f"granularity {r.get('granularity')!r} not allowed")
        if r.get("level") not in LEVELS:
            rep.err(rel, f"level {r.get('level')!r} not allowed")
        if r.get("access") not in ACCESS:
            rep.err(rel, f"access {r.get('access')!r} not allowed")
        if r.get("language") != "en":
            rep.err(rel, "language must be 'en' (English only for now)")
        if not as_date(r.get("cataloged_on")):
            rep.err(rel, "cataloged_on must be YYYY-MM-DD")
        elif as_date(r["cataloged_on"]) > today:
            rep.err(rel, "cataloged_on is in the future")

        src = r.get("source")
        if src not in sources:
            rep.err(rel, f"source {src!r} is not in config/sources.yaml")
        elif sources[src].get("status") != "active":
            rep.err(rel, f"source {src} has status {sources[src].get('status')!r}, not active")
        expected_dir = {"thaqalayn.net": "thaqalayn", "al-islam.org": "al-islam",
                        "sistani.org": "sistani", "youtube": "youtube"}.get(src)
        if expected_dir and os.path.basename(os.path.dirname(path)) != expected_dir:
            rep.err(rel, f"records for {src} belong in data/records/{expected_dir}/")

        u = r.get("url")
        if u:
            if not good_url(u):
                rep.err(rel, f"url is not well-formed: {u!r}")
            else:
                key = norm_url(u)
                if key in urls:
                    rep.err(rel, f"duplicate url (also in {urls[key]})")
                urls[key] = rel
        if r.get("enrollment_url") and not good_url(r["enrollment_url"]):
            rep.err(rel, "enrollment_url is not well-formed")

        desc = r.get("description") or ""
        if isinstance(desc, str) and len(desc) > 600:
            rep.err(rel, f"description is {len(desc)} characters; keep it to 1-3 sentences (max 600)")
        sq = r.get("sample_questions") or []
        if not isinstance(sq, list) or not all(isinstance(q, str) and q.strip() for q in sq):
            rep.err(rel, "sample_questions must be a list of non-empty strings")
        elif not 3 <= len(sq) <= 8:
            rep.err(rel, f"sample_questions has {len(sq)} entries; need 3-8")

        hs = r.get("headings") or []
        if not isinstance(hs, list):
            rep.err(rel, "headings must be a list")
            hs = []
        for h in hs:
            if h not in heads:
                rep.err(rel, f"heading {h!r} is not in vocabulary.yaml")
        if len(set(hs)) != len(hs):
            rep.err(rel, "headings contains duplicates")
        fiqh = any(is_fiqh(h) for h in hs if h in heads)

        for field in ("authors", "instructors"):
            vals = r.get(field) or []
            if not isinstance(vals, list):
                rep.err(rel, f"{field} must be a list")
                continue
            for a in vals:
                if a not in scholars:
                    rep.err(rel, f"{field}: {a!r} is not in scholars.yaml")

        # Fiqh rule. `marja` names whose rulings the record follows; `authors` names who
        # wrote the page or book (may be a compiler or translator, or empty).
        marja = r.get("marja") or ""
        if marja and marja not in MARJA:
            rep.err(rel, f"marja {marja!r} must be one of {sorted(MARJA)} or blank")
        is_course = r.get("type") == "course"
        if fiqh and not is_course and marja not in MARJA:
            rep.err(rel, "fiqh record (has a heading under Fiqh) must set marja to sistani or khamenei")
        if marja and not fiqh:
            rep.err(rel, "marja is set but the record has no heading under Fiqh")
        tag = r.get("content_tag")
        if is_course:
            if tag != "course":
                rep.err(rel, "type course must have content_tag course")
            if not r.get("provider"):
                rep.err(rel, "course must name its provider")
            elif r["provider"] not in institutes:
                rep.err(rel, f"provider {r['provider']!r} is not an approved institute in config/sources.yaml")
            if fiqh and not r.get("needs_review"):
                rep.err(rel, "fiqh-subject course must be flagged needs_review (scope question is open)")
            sd = r.get("start_date")
            if sd:
                d = as_date(sd)
                if not d:
                    rep.err(rel, "start_date must be YYYY-MM-DD or blank")
                elif d < today:
                    rep.warn(rel, f"course start_date {sd} has passed")
        else:
            if tag == "course":
                rep.err(rel, "content_tag course is only for type course")
            if fiqh and tag != "fiqh":
                rep.err(rel, "record has a Fiqh heading, so content_tag must be fiqh")
            if not fiqh and tag == "fiqh":
                rep.err(rel, "content_tag is fiqh but no heading is under the Fiqh branch")
            want = TYPE_TAG.get(r.get("type"))
            if not fiqh and want and tag in TAGS and tag != want:
                rep.warn(rel, f"type {r.get('type')} usually has content_tag {want}, found {tag}")
        if src == "sistani.org" and tag != "fiqh":
            rep.err(rel, "every sistani.org record must have content_tag fiqh")

        if r.get("needs_review") not in (None, True, False):
            rep.err(rel, "needs_review must be true or false")
        if r.get("needs_review") and not (r.get("review_note") or "").strip():
            rep.err(rel, "needs_review is true but review_note is empty")

    # ── hierarchy ─────────────────────────────────────────────────────────────
    for rid, r in records.items():
        rel, g, parent = r["_file"], r.get("granularity"), r.get("parent") or ""
        if g == "work":
            if parent:
                rep.err(rel, "a work must not have a parent")
            continue
        if g not in GRANULARITY:
            continue
        if not parent:
            rep.err(rel, f"a {g} must have a parent")
            continue
        p = records.get(parent)
        if not p:
            rep.err(rel, f"parent {parent!r} does not exist")
            continue
        want = GRANULARITY[GRANULARITY.index(g) + 1]
        if p.get("granularity") != want:
            rep.err(rel, f"parent of a {g} must be a {want}; {parent} is a {p.get('granularity')}")
        if p.get("source") != r.get("source"):
            rep.err(rel, "parent and child must share the same source")
        if p.get("url") and r.get("url") and norm_url(p["url"]) == norm_url(r["url"]):
            rep.err(rel, "url is the same as its parent's url")
        seen, cur = set(), rid
        while cur:
            if cur in seen:
                rep.err(rel, "cycle in parent chain")
                break
            seen.add(cur)
            cur = (records.get(cur) or {}).get("parent")

    # ── starter questions ─────────────────────────────────────────────────────
    path_ids = set()
    paths = []
    for path in sorted(glob.glob(os.path.join(root, "data/paths/*.yaml"))):
        rel = os.path.relpath(path, root)
        p = load(path) or {}
        paths.append((rel, p))
        if p.get("id"):
            if p["id"] in path_ids:
                rep.err(rel, f"duplicate path id {p['id']}")
            path_ids.add(p["id"])

    qpath = os.path.join(root, "data/questions.yaml")
    qids = set()
    if os.path.exists(qpath):
        for q in (load(qpath) or {}).get("questions") or []:
            where = f"questions.yaml {q.get('id')}"
            if not q.get("id") or q["id"] in qids:
                rep.err(where, "missing or duplicate question id")
            qids.add(q.get("id"))
            if not (q.get("question") or "").strip():
                rep.err(where, "missing question text")
            for h in q.get("headings") or []:
                if h not in heads:
                    rep.err(where, f"heading {h!r} is not in vocabulary.yaml")
            for t in q.get("top_records") or []:
                if t not in records:
                    rep.err(where, f"top_records: {t!r} does not exist")
            if not (q.get("headings") or q.get("top_records") or q.get("path")):
                rep.err(where, "question maps to nothing (no headings, records or path)")
            if q.get("path") and q["path"] not in path_ids:
                rep.err(where, f"path {q['path']!r} does not exist")
            if "draft" not in q:
                rep.err(where, "missing draft flag")

    order = {"beginner": 0, "intermediate": 1, "advanced": 2}
    for rel, p in paths:
        if not p.get("id") or not str(p["id"]).startswith("path-"):
            rep.err(rel, "path id must start with 'path-'")
        elif os.path.basename(rel) != f"{p['id']}.yaml":
            rep.err(rel, f"file name must be {p['id']}.yaml")
        for k in ("title", "intro"):
            if not (p.get(k) or "").strip():
                rep.err(rel, f"missing {k}")
        if "draft" not in p:
            rep.err(rel, "missing draft flag")
        steps = p.get("steps") or []
        if not 3 <= len(steps) <= 6:
            rep.err(rel, f"path has {len(steps)} steps; need 3-6")
        last = 0
        for i, s in enumerate(steps, 1):
            rec = records.get(s.get("record"))
            if not rec:
                rep.err(rel, f"step {i}: record {s.get('record')!r} does not exist")
                continue
            if not (s.get("why") or "").strip():
                rep.err(rel, f"step {i}: missing 'why'")
            lv = order.get(rec.get("level"), 2)
            if lv < last:
                rep.warn(rel, f"step {i} is easier than the step before it; paths go beginner to advanced")
            last = max(last, lv)
            if i == 1 and (rec.get("level") == "advanced" or rec.get("content_tag") in ("fiqh", "hadith")):
                rep.warn(rel, "step 1 is advanced, a fiqh ruling or a hadith collection; start with a beginner overview")

    # ── report ────────────────────────────────────────────────────────────────
    for line in rep.warnings + rep.errors:
        print(line)
    flagged = sum(1 for r in records.values() if r.get("needs_review"))
    print(f"\n{len(records)} records ({flagged} flagged for review), {len(heads)} headings, "
          f"{len(scholars)} scholars, {len(qids)} questions, {len(paths)} paths")
    print(f"{len(rep.errors)} error(s), {len(rep.warnings)} warning(s)")
    return 1 if rep.errors else 0


if __name__ == "__main__":
    sys.exit(main())

#!/usr/bin/env python3
"""List URLs from a sitemap (or sitemap index) of an approved source. No AI.

Usage:  python3 scripts/list_urls.py https://example.org/sitemap.xml [--match REGEX] [--max-sitemaps N]
Only hosts found in config/sources.yaml are allowed. Waits 1.5 seconds between requests.
"""
import argparse, os, re, sys, time, urllib.request
import xml.etree.ElementTree as ET
from urllib.parse import urlparse
import yaml

UA = "ShiaCatalogBot/0.1 (catalog; sitemap listing)"
EXTRA_HOSTS = {"thaqalayn.com"}  # thaqalayn.net redirects here


def allowed_hosts(root):
    cfg = yaml.safe_load(open(os.path.join(root, "config/sources.yaml"), encoding="utf-8"))
    hosts = set(EXTRA_HOSTS)
    for s in cfg.get("sources") or []:
        if s.get("status") == "active" and s.get("base_url"):
            hosts.add(urlparse(s["base_url"]).netloc.lower().removeprefix("www."))
    return hosts


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("sitemap")
    ap.add_argument("--match", default="")
    ap.add_argument("--max-sitemaps", type=int, default=20)
    a = ap.parse_args()
    root = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
    hosts = allowed_hosts(root)
    queue, done, pat = [a.sitemap], 0, re.compile(a.match) if a.match else None
    while queue and done < a.max_sitemaps:
        url = queue.pop(0)
        host = urlparse(url).netloc.lower().removeprefix("www.")
        if host not in hosts:
            sys.exit(f"{host} is not an active approved source; refusing to fetch {url}")
        if done:
            time.sleep(1.5)
        try:
            tree = ET.fromstring(fetch(url))
        except Exception as e:  # log and move on; never retry around a block
            print(f"# failed: {url}: {e}", file=sys.stderr)
            done += 1
            continue
        done += 1
        for el in tree.iter():
            if el.tag.endswith("}loc") or el.tag == "loc":
                loc = (el.text or "").strip()
                if tree.tag.endswith("sitemapindex"):
                    queue.append(loc)
                elif not pat or pat.search(loc):
                    print(loc)


if __name__ == "__main__":
    main()

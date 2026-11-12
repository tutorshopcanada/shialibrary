# Proposed sources (owner approves before anything is cataloged)

None proposed as catalog sources yet.

## Proposed: hyder.ai as an outbound "ask an AI" link (not a catalog source) - 2026-11-11
Raised by the owner in chat. **Status: approved by the owner 2026-11-12 (free to use; redirect what we do not have). Built on the "no close match" screen only. Still open: whether to hide it for fiqh-type queries.**

What it is: a single link on the site to hyder.ai, a Shia AI tool, with a plain disclaimer
that it is AI and not a human-vetted source. It would not be a catalog record, and the
site would never call it or show its output.

How it fits the rules:
- Principle 6 (no text generation at search time): holds, because the answers are written on
  hyder.ai, not by us. The wording must make clear we neither run nor vouch for it.
- Principle 1 (curated whitelist) and the rule on unlisted sources: it is not a catalog source,
  so it would not go in `config/sources.yaml`. It needs its own approved "external tools"
  entry in `docs/scope.md`.
- Not verified by us: we have not visited hyder.ai, so we do not know who runs it, which
  scholars vet it, its terms, or whether it gives fiqh rulings. Owner to confirm.

Decisions for the owner:
1. Where does it appear? Suggested: only on the "We couldn't find a close match" fallback
   and the About page, not beside normal results.
2. Draft disclaimer: "hyder.ai is an independent AI tool. It is not part of this catalog,
   and its answers are not checked by us or by a scholar. For religious rulings, ask a
   qualified scholar or read the source texts."
3. Should it be hidden for fiqh queries? AI-written rulings are the main risk, so suggest yes.
4. Is it free to use with no login? We can only point to free sites (principle 7).

## Notes on approved sources
- **al-islam.org** refuses scripted requests but can be read with the web-fetch tool within its
  robots.txt rules (10-second delay). Active.
- **khamenei.ir** (named by the owner 2026-11-10) could not be reached from the build machine
  (connection reset / HTTP 503). Options: the owner checks from their own browser which section
  holds the English rulings and sends a few example links; or we retry another day; or the
  owner names a different official site for Sayyid Khamenei's rulings.
- **thaqalayn.net** now redirects to thaqalayn.com. Treated as the same approved source.

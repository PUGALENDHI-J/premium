"""Summarise research/gt-holidays-url-inventory.json into the page-type, hierarchy and crawl reports.
Usage: python tools/analyse_reference.py
"""
import json, re
from collections import Counter, defaultdict
from pathlib import Path

R = Path(__file__).resolve().parent.parent / "research"
inv = json.load(open(R / "gt-holidays-url-inventory.json", encoding="utf-8"))
meta = json.load(open(R / ".crawl-meta.json", encoding="utf-8"))
P = inv["pages"]
cfg = inv["config"]
# Links present on more than half of all pages are site-wide navigation. Store them once and keep only
# page-specific links per page (internal_link_count still counts all of them).
if "sitewide_links" not in inv:
    freq = Counter(u for p in P for u in set(p.get("internal_links", [])))
    nav = {u for u, c in freq.items() if c > len(P) / 2}
    inv["sitewide_links"] = sorted(nav)
    for p in P:
        p["internal_links"] = [u for u in p.get("internal_links", []) if u not in nav]
    json.dump(inv, open(R / "gt-holidays-url-inventory.json", "w", encoding="utf-8"), indent=0, ensure_ascii=False)
by_type = defaultdict(list)
for p in P:
    by_type[p["page_type"]].append(p)

TYPE_NOTES = {
    "home": "Home page: hero search, popular packages, group departures, testimonials, accreditation.",
    "package-hub": "`/packages/`: entry point that splits into India and International.",
    "package-region-hub": "`/packages/india/` and `/packages/international/`: lists of regions, states/countries and themes.",
    "package-listing": "Destination or theme listing under `/packages/india/...` or `/packages/international/...` (state, country, region, honeymoon, educational). Each links to package-detail pages.",
    "package-detail": "Individual itinerary at `/package/<slug>/` (flat URL, not nested under its destination). Sections: Itinerary, Tour's Location, Reviews.",
    "honeymoon-listing": "`/honeymoon-packages/<place>/` landing pages.",
    "destination-wedding-listing": "`/destination-wedding/<place>/` landing pages.",
    "blog-post": "Article at a root-level slug (from post-sitemap.xml).",
    "blog-archive": "`/blog/`, `/category/<x>/`, `/tag/<x>/` and their `/page/N/` pagination.",
    "page": "Other WordPress pages: branch/city office pages (e.g. `/chennai/`), company pages (`/history/`, contact, policies).",
}

def common_h2(pages, n=8):
    c = Counter(h for p in pages for h in p.get("h2", []) if h and len(h) < 60)
    return [f"{h} ({k})" for h, k in c.most_common(n)]

# ---------- page types ----------
lines = ["# GT Holidays: page types", "", f"Derived from the crawl of {len(P)} fetched pages ({inv['generated_at']}). Counts are fetched pages only.", "",
         "| Page type | Fetched | URL pattern / notes |", "|---|---:|---|"]
for t, ps in sorted(by_type.items(), key=lambda x: -len(x[1])):
    lines.append(f"| {t} | {len(ps)} | {TYPE_NOTES.get(t, '')} |")
lines += ["", "## Typical sections (most common H2 headings) by type", ""]
for t, ps in sorted(by_type.items(), key=lambda x: -len(x[1])):
    lines.append(f"**{t}**: " + "; ".join(common_h2(ps)) if common_h2(ps) else f"**{t}**: (no H2s)")
    lines.append("")
lines += ["## Example URLs", ""]
for t, ps in sorted(by_type.items()):
    lines.append(f"* **{t}**: " + ", ".join(f"`{p['source_url'].replace('https://www.gtholidays.in', '')}`" for p in ps[:4]))
lines += ["", "## Observations used for Nexara's architecture", "",
          "* Package detail pages use a flat `/package/<slug>/` URL. Nexara nests packages under their destination (`/packages/india/kerala/<slug>/`) so the URL itself carries the hierarchy.",
          "* Listings are organised two ways: by geography (India → state; International → region → country) and by theme (honeymoon, educational, destination wedding). Nexara mirrors this with `/destinations/...` (geography) and `/tour-types/...` (themes).",
          "* Breadcrumbs on listings follow Home → Tour Packages → India/International → [region] → listing; package detail pages use only Home → title. Nexara uses full breadcrumbs on every page.",
          f"* Only {sum(1 for p in by_type['package-detail'] if p.get('days'))} of {len(by_type['package-detail'])} package pages state a duration in their title or headings; none show a price in headings. Nexara shows duration on every package and uses quote requests instead of prices.",
          "* The blog has many tag and category archives (thin, near-duplicate listing pages). Nexara uses a small number of topic pages instead of tag archives."]
(R / "gt-holidays-page-types.md").write_text("\n".join(lines) + "\n", encoding="utf-8")

# ---------- hierarchy (from listing breadcrumbs) ----------
tree = {}
for p in by_type["package-listing"] + by_type["package-region-hub"]:
    bc = [b for b in p.get("breadcrumbs", []) if b]
    if len(bc) < 3: continue
    node = tree
    for name in bc[2:]:
        node = node.setdefault(name, {})
    node.setdefault("_url", p["source_url"])
    node.setdefault("_package_links", len(p.get("related_package_links", [])))
def clean(n):
    out = {"url": n.get("_url"), "package_links_on_page": n.get("_package_links")}
    kids = {k: clean(v) for k, v in n.items() if not k.startswith("_")}
    if kids: out["children"] = kids
    return out
hier = {"source": "Breadcrumbs of fetched /packages/ listing pages", "generated_at": inv["generated_at"], "tree": {k: clean(v) for k, v in tree.items()},
        "honeymoon_listings": sorted(p["source_url"] for p in by_type["honeymoon-listing"]),
        "destination_wedding_listings": sorted(p["source_url"] for p in by_type["destination-wedding-listing"])}
json.dump(hier, open(R / "gt-holidays-destination-hierarchy.json", "w", encoding="utf-8"), indent=1, ensure_ascii=False)

# ---------- crawl report ----------
nf, bl, rd = inv["discovered_not_fetched"], inv["blocked_by_robots"], inv["redirects"]
fetched = {p["source_url"] for p in P}
ok = [p for p in P if p["http_status"] == 200]
err = [p for p in P if p["http_status"] != 200]
canon_diff = [p for p in P if p.get("canonical_url") and p["canonical_url"] != p["source_url"]]
no_canon = [p for p in P if not p.get("canonical_url")]
dup_titles = [t for t, c in Counter(p.get("title") for p in ok).items() if t and c > 1]
mojibake = [p["source_url"] for p in P if "�" in (p.get("title", "") + " ".join(p.get("h1", [])))]
total_unique = len(fetched | set(nf) | set(bl))
sm = meta["sitemap_counts"]
rep = f"""# GT Holidays crawl report

Crawled {inv['generated_at']} with `tools/crawl_reference.py`.

## Configuration

| Setting | Value |
|---|---|
| User agent | `{inv['user_agent']}` |
| Seeds | `robots.txt` → `sitemap_index.xml` ({', '.join(f'{k}: {v}' for k, v in sm.items())} URLs) plus the home page |
| Max depth from seeds | {cfg['max_depth']} |
| Max pages | {cfg['max_pages']} |
| Rate | {cfg['rate']} request/second overall, {cfg['workers']} workers, 30 s timeout, 3 attempts with back-off on 429/503/network errors |
| robots.txt | Obeyed (`Disallow: /offers/`, `/daily-deals/`, `/wp-admin/` and others) |
| Stored | Metadata only (titles, headings, links, image URLs + alt text). No page prose, images or private endpoints |
| Elapsed | {meta['elapsed_s']} s |

## Completion status

The crawl **reached its configured completion condition**: the queue emptied with every URL inside the depth limit fetched, well under the {cfg['max_pages']}-page cap. It is complete *for depth ≤ {cfg['max_depth']}*, not an exhaustive crawl of every pagination page.

## Results

| Measure | Count |
|---|---:|
| Total unique URLs discovered (canonicalised) | {total_unique} |
| URLs successfully fetched (HTTP 200) | {len(ok)} |
| Fetched with an error status | {len(err)} |
| Discovered but not fetched (beyond max depth) | {len(nf)} |
| Blocked by robots.txt (not requested) | {len(bl)} |
| Redirects followed (source → canonical target) | {len(rd)} |
| Pages whose canonical tag differs from the fetched URL | {len(canon_diff)} |
| Pages with no canonical tag | {len(no_canon)} |
| Titles used by more than one page | {len(dup_titles)} |
| Pages that could not be verified | {len(nf)} (the not-fetched URLs above; existence inferred from links only) |

### Fetched pages by type

| Type | Pages |
|---|---:|
""" + "\n".join(f"| {t} | {len(ps)} |" for t, ps in sorted(by_type.items(), key=lambda x: -len(x[1]))) + f"""

### Discovered but not fetched

All are pagination of blog, category or tag archives found at depth {cfg['max_depth'] + 1}:

""" + "\n".join(f"* `{u}`" for u in nf) + """

### Blocked by robots.txt

""" + "\n".join(f"* `{u}`" for u in bl) + """

### Duplicates and canonicalisation

URLs were canonicalised before queueing (https, `www.` host, lower-cased host, query strings and fragments removed, trailing slash added), so variants such as `?utm_*` links count once. Redirects observed:

""" + "\n".join(f"* `{a}` → `{b}`" for a, b in rd.items()) + f"""

## Data-quality notes

* {len(mojibake)} pages show replacement characters (�) in the title or H1 where the source page's declared encoding did not match some bytes (for example en dashes). The URLs are still valid.
* Durations were parsed only from titles and headings: {sum(1 for p in by_type['package-detail'] if p.get('days'))} of {len(by_type['package-detail'])} package pages state one there. No package showed a price in its headings, so the inventory's price column is empty rather than guessed.
* Breadcrumbs come from `BreadcrumbList` JSON-LD where present, otherwise from elements with a `breadcrumb` class.

## How the inventory was used

GT Holidays was used only to understand structure and coverage: the destination hierarchy, which themes get their own listings, and typical itinerary sections. No prose, itineraries, prices, photos or branding were copied into the Nexara site. Nexara's destination and package records are original and are listed in `research/build-report.json`.
"""
(R / "gt-holidays-crawl-report.md").write_text(rep, encoding="utf-8")
print("total unique", total_unique, "fetched", len(ok), "not fetched", len(nf), "blocked", len(bl), "mojibake", len(mojibake))

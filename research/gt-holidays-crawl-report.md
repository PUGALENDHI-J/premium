# GT Holidays crawl report

Crawled 2026-10-23T18:14:32+00:00 with `tools/crawl_reference.py`.

## Configuration

| Setting | Value |
|---|---|
| User agent | `NexaraResearchBot/1.0 (+https://nexaraholidays.com; contact hello@nexaraholidays.com)` |
| Seeds | `robots.txt` → `sitemap_index.xml` (post-sitemap.xml: 168, page-sitemap.xml: 253, st_tours-sitemap.xml: 605 URLs) plus the home page |
| Max depth from seeds | 2 |
| Max pages | 2500 |
| Rate | 1.0 request/second overall, 2 workers, 30 s timeout, 3 attempts with back-off on 429/503/network errors |
| robots.txt | Obeyed (`Disallow: /offers/`, `/daily-deals/`, `/wp-admin/` and others) |
| Stored | Metadata only (titles, headings, links, image URLs + alt text). No page prose, images or private endpoints |
| Elapsed | 1364 s |

## Completion status

The crawl **reached its configured completion condition**: the queue emptied with every URL inside the depth limit fetched, well under the 2500-page cap. It is complete *for depth ≤ 2*, not an exhaustive crawl of every pagination page.

## Results

| Measure | Count |
|---|---:|
| Total unique URLs discovered (canonicalised) | 1380 |
| URLs successfully fetched (HTTP 200) | 1340 |
| Fetched with an error status | 0 |
| Discovered but not fetched (beyond max depth) | 28 |
| Blocked by robots.txt (not requested) | 12 |
| Redirects followed (source → canonical target) | 2 |
| Pages whose canonical tag differs from the fetched URL | 0 |
| Pages with no canonical tag | 1340 |
| Titles used by more than one page | 2 |
| Pages that could not be verified | 28 (the not-fetched URLs above; existence inferred from links only) |

### Fetched pages by type

| Type | Pages |
|---|---:|
| package-detail | 605 |
| blog-archive | 301 |
| package-listing | 181 |
| blog-post | 168 |
| honeymoon-listing | 39 |
| page | 26 |
| destination-wedding-listing | 16 |
| package-region-hub | 2 |
| home | 1 |
| package-hub | 1 |

### Discovered but not fetched

All are pagination of blog, category or tag archives found at depth 3:

* `https://www.gtholidays.in/blog/page/15/`
* `https://www.gtholidays.in/blog/page/4/`
* `https://www.gtholidays.in/category/bali-tour/page/3/`
* `https://www.gtholidays.in/category/bali-tour/page/6/`
* `https://www.gtholidays.in/category/dubai-tour/page/3/`
* `https://www.gtholidays.in/category/dubai-tour/page/9/`
* `https://www.gtholidays.in/category/honeymoon-packages/page/3/`
* `https://www.gtholidays.in/category/honeymoon-packages/page/5/`
* `https://www.gtholidays.in/category/maldives-tour/page/3/`
* `https://www.gtholidays.in/category/maldives-tour/page/9/`
* `https://www.gtholidays.in/tag/bali-honeymoon-packages/page/3/`
* `https://www.gtholidays.in/tag/bali-honeymoon-packages/page/6/`
* `https://www.gtholidays.in/tag/bali-tour-packages/page/3/`
* `https://www.gtholidays.in/tag/bali-tour-packages/page/6/`
* `https://www.gtholidays.in/tag/bali-travel-packages/page/3/`
* `https://www.gtholidays.in/tag/bali-travel-packages/page/5/`
* `https://www.gtholidays.in/tag/dubai-honeymoon-packages/page/3/`
* `https://www.gtholidays.in/tag/dubai-honeymoon-packages/page/6/`
* `https://www.gtholidays.in/tag/dubai-tour-packages/page/3/`
* `https://www.gtholidays.in/tag/dubai-tour-packages/page/7/`
* `https://www.gtholidays.in/tag/dubai-travel-packages/page/3/`
* `https://www.gtholidays.in/tag/dubai-travel-packages/page/8/`
* `https://www.gtholidays.in/tag/maldives-honeymoon-packages/page/3/`
* `https://www.gtholidays.in/tag/maldives-honeymoon-packages/page/8/`
* `https://www.gtholidays.in/tag/maldives-tour-packages/page/3/`
* `https://www.gtholidays.in/tag/maldives-tour-packages/page/8/`
* `https://www.gtholidays.in/tag/maldives-travel-packages/page/3/`
* `https://www.gtholidays.in/tag/maldives-trip-packages/page/3/`

### Blocked by robots.txt

* `https://www.gtholidays.in/daily-deals/`
* `https://www.gtholidays.in/daily-deals/3n-4d-male/`
* `https://www.gtholidays.in/daily-deals/4n-5d-armenia/`
* `https://www.gtholidays.in/daily-deals/4n-5d-egypt/`
* `https://www.gtholidays.in/daily-deals/4n-5d-london/`
* `https://www.gtholidays.in/daily-deals/4n-5d-paris/`
* `https://www.gtholidays.in/daily-deals/4n-5d-zurich/`
* `https://www.gtholidays.in/daily-deals/5n-6d-nepal/`
* `https://www.gtholidays.in/daily-deals/5n-6d-russia/`
* `https://www.gtholidays.in/daily-deals/5n-6d-spain/`
* `https://www.gtholidays.in/daily-deals/5n6d-mauritius/`
* `https://www.gtholidays.in/daily-deals/6n-7d-turkey/`

### Duplicates and canonicalisation

URLs were canonicalised before queueing (https, `www.` host, lower-cased host, query strings and fragments removed, trailing slash added), so variants such as `?utm_*` links count once. Redirects observed:

* `https://www.gtholidays.in/honeymoon-packages/chennai/` → `https://www.gtholidays.in/honeymoon-packages/india/`
* `https://www.gtholidays.in/honeymoon-packages/India/` → `https://www.gtholidays.in/honeymoon-packages/india/`

## Data-quality notes

* 0 pages show replacement characters (�) in the title or H1 where the source page's declared encoding did not match some bytes (for example en dashes). The URLs are still valid.
* Durations were parsed only from titles and headings: 110 of 605 package pages state one there. No package showed a price in its headings, so the inventory's price column is empty rather than guessed.
* Breadcrumbs come from `BreadcrumbList` JSON-LD where present, otherwise from elements with a `breadcrumb` class.

## How the inventory was used

GT Holidays was used only to understand structure and coverage: the destination hierarchy, which themes get their own listings, and typical itinerary sections. No prose, itineraries, prices, photos or branding were copied into the Nexara site. Nexara's destination and package records are original and are listed in `research/build-report.json`.

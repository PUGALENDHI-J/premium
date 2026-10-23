# Nexara Holidays expansion: final report

Build of 24 October 2026. All figures come from `research/build-report.json`, `research/validation-report.json` and the crawl files in this folder.

## 1. Reference crawl (GT Holidays)

| Measure | Count |
|---|---:|
| Total unique reference URLs discovered | 1,380 |
| Fetched successfully (HTTP 200) | 1,340 |
| Discovered but not fetched (pagination beyond max depth 2) | 28 |
| Blocked by robots.txt (not requested) | 12 |
| Redirects observed | 2 |

The crawl reached its configured completion condition (queue empty at depth ≤ 2). It is not an exhaustive crawl of every archive page. Only metadata was stored; no prose, images or prices were copied. Details: `gt-holidays-crawl-report.md`.

## 2. Pages

| Type | Published URLs |
|---|---:|
| Existing home page (retained; nav and footer links added) | 1 |
| Destination directory | 1 |
| India hub, regions, states and UTs | 1 + 6 + 28 |
| India destination pages | 121 |
| International hub, regions, countries | 1 + 11 + 56 |
| International destination pages | 148 |
| Package listing pages (all, India, international) | 3 |
| India package pages | 189 |
| International package pages (including the 3 existing Thailand departures) | 322 |
| Holiday-theme (category) pages + index | 29 + 1 |
| Travel guides + index | 99 + 1 |
| Blog posts + index + 10 topic pages | 100 + 1 + 10 |
| Company, contact, enquiry, FAQ, policy and HTML site-map pages | 8 |
| **Total canonical URLs in sitemaps** | **1,137** |

Not indexed: `404.html` (noindex). Held back by the quality gate: 1 record (the accessible-travel theme, because accessibility details are unverified). During the work, a further 7 near-duplicate itineraries were removed from the data rather than published.

"Published" means built, linked and listed in the sitemap. None of these pages are indexed by search engines yet; nothing has been deployed.

## 3. Content quality

- Every destination has an original intro, at least 4 attractions, at least 3 activities, best time, how to reach and coordinates. Short records are held back automatically.
- Itineraries are suggested private routes. **No prices, hotel names, availability, ratings or reviews are invented.** The only price shown is the existing ₹34,999 for the Ultimate Boys Escape, copied from the home page.
- Day plans are generated from destination data, ordered by each trip's main theme, with a theme-specific "How this version is planned" section. Same-route variants above 69% similarity were removed. The most similar remaining pair of packages is at 66%; the validator fails anything above 80%.
- Articles: guides average 286 words of body text (range 228–362); blog posts average 243 words (range 220–294). The publishing floor is 220 words, at least 2 internal links and a meta description. These are focused, single-question pieces; the top 20 by traffic would benefit from expanding later.
- Visa and tax topics (Schengen, TCS, passports) explain how processes work and point to official sources instead of quoting figures that change.
- Images: the 12 Thailand destinations and 3 Thailand packages reuse the home page's licensed photos. All other pages use the site's existing illustrated fallback (gradient plus SVG motif). No external or unlicensed images were added.

## 4. Validation (`npm run validate`)

0 errors across 1,138 checked pages. The checks cover: one H1 per page, unique titles, descriptions and canonicals, canonical matching URL, valid JSON-LD, no rating markup, broken internal links, missing assets, sitemap entries that exist and are indexable, orphans, empty sections, unsupported price or marketing claims, and near-duplicate content.

Warnings (342): 306 page pairs at 50–66% similarity (mostly packages sharing destinations), 22 titles over 75 characters, 13 descriptions outside 50–170 characters, and the home page's pre-existing 9 `<h1>` elements (hero slides and hidden views).

## 5. Files

- Data: `content/` (destinations, packages, themes, guides, blog, pages, site facts)
- Generator and checks: `tools/build.mjs`, `tools/lib/html.mjs`, `tools/lib/md.mjs`, `tools/validate.mjs`, `tools/serve.mjs`
- Styling and behaviour for new pages: `assets/css/nexara-pages.css`, `assets/js/nexara-pages.js`; `assets/css/nexara-base.css` is generated from `index.html`
- Research: `research/existing-site-baseline.md`, `gt-holidays-url-inventory.csv/.json`, `gt-holidays-page-types.md`, `gt-holidays-destination-hierarchy.json`, `gt-holidays-crawl-report.md`
- Sitemaps: `/sitemap.xml` (index) → `sitemap-pages.xml`, `sitemap-destinations.xml`, `sitemap-packages.xml`, `sitemap-guides.xml`, `sitemap-blog.xml`; `robots.txt`
- `index.html`: one "Holidays" nav item, footer links to the new sections and policy pages, real URLs on the footer destination links (they still open the existing dialog), and one CSS rule so seven nav items fit between 861 and 960px

## 6. Enquiries

The new pages use the same WhatsApp-based enquiry flow and validation as the home page, adding destination or package, departure date, duration, budget and special requirements. Nothing is stored on the site and no keys or secrets are involved. Messages state clearly that an enquiry is not a booking.

## 7. Not done or needs the owner

- **Deployment:** not deployed. The hosting provider could not be identified from the repository.
- **Email:** `hello@nexaraholidays.com` is still the placeholder noted in the original README.
- **Policies:** the privacy, terms and cancellation pages are sensible drafts matched to how the site works; have them reviewed.
- **Photos:** most new pages use illustrations. Adding licensed photos per destination would improve them.
- **Accessible-travel theme:** held back until accessibility details are verified with suppliers.
- **Facts:** destination facts (distances, closures, festival months) were written from general knowledge and should be spot-checked periodically; the `SITE.reviewed` date in `content/site.mjs` drives `lastmod` in the sitemaps.

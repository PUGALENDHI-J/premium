NEXARA HOLIDAYS – THAILAND WEBSITE
===================================
Files
  index.html   the whole website (Home, Packages, 3 package pages, Experiences, Gallery, Contact, enquiry pop-up)
  assets/      photos (.webp) and videos (.mp4)
  assets/frames/d and assets/frames/m   the scroll film on the Home page (175 frames each: d = desktop 1280px, m = phones 720px)

About the original PNG frames
  assets/Nexara_Holidays_Thailand_travel___..._frames (228 MB) is your source PNG set. The website does NOT use it,
  so do not upload it to hosting. Keep it on your computer as a backup.

How to publish
  Upload everything (index.html and the assets folder) to your hosting for nexaraholidays.com,
  or drag the folder into Netlify / Vercel / Cloudflare Pages. Keep index.html and assets/ side by side.
  To test on your computer: double-click index.html.

What to edit (open index.html in VS Code and search)
  7305971481        WhatsApp / phone number (also +91 73059 71481)
  hello@nexaraholidays.com   placeholder email
  Call for price    add prices for Honeymoon and Boys Unleashed (search: pr:"Call for price")
  2026-11-19T20:00  countdown date/time for the Nov 19 batch
  const DS=         the 12 destinations on the home page (text, attractions, best for).
                    Destinations with im:"..." use a photo; the rest use an illustration (m:"sea|karst|peak|temple").
  const MP=         the "More places to explore" tiles
  Story captions    search: const CH=[  (frame ranges, chapter names and text for the scroll film)


CONTENT PAGES (destinations, packages, guides, blog) – added October 2026
=========================================================================
About 1,100 extra pages are generated from data files. index.html stays hand-made; the build copies
its <style> block into assets/css/nexara-base.css so every new page uses the same design.

Folders
  content/          the data you edit: site.mjs (phone, email, domain), india*.mjs and world*.mjs
                    (destinations), packages-*.mjs (itineraries), tour-types.mjs (themes),
                    guides/ and blog/ (articles), pages.mjs (about, contact, policies, FAQs)
  tools/            build.mjs (makes the pages), validate.mjs (quality checks), serve.mjs (local preview),
                    crawl_reference.py + analyse_reference.py (the GT Holidays research crawl)
  research/         audit, crawl inventory and reports, build-report.json, validation-report.json
  destinations/ packages/ tour-packages/ tour-types/ travel-guides/ blog/ about-us/ ...
                    GENERATED. Do not edit by hand; they are rewritten on every build.
  sitemap.xml, sitemap-*.xml, robots.txt, 404.html   GENERATED.

Commands (needs Node.js 20 or newer)
  npm run build      regenerate all pages after editing anything in content/ or index.html's CSS
  npm run validate   check titles, canonicals, broken links, sitemap, orphans, near-duplicates
  npm run check      both of the above
  npm run serve      preview at http://localhost:4321/  (sub-pages do NOT work by double-clicking files)

Quality gate
  Records that are too thin (short intros, missing details, short articles) are held back as drafts
  and listed in research/build-report.json instead of being published.

How to publish now
  Upload the whole folder EXCEPT: content/, tools/, research/, node_modules/, package.json,
  NEXARA-DESIGN-PROMPT.md, nexara-redesign.html and the PNG frames folder.
  The host must serve folder/index.html for clean URLs like /destinations/india/ and use 404.html
  for missing pages. Netlify, Vercel, Cloudflare Pages and GitHub Pages all do this by default.
  The site must be served from the root of nexaraholidays.com (links start with "/").

Before going live, please review
  - the email address (still the placeholder hello@nexaraholidays.com) in content/site.mjs and index.html
  - the privacy, terms and cancellation pages (content/pages.mjs) with your own business terms
  - itinerary prices: none are shown except the Ultimate Boys Escape (copied from the home page)

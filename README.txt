NEXARA HOLIDAYS – INDIA AND INTERNATIONAL HOLIDAYS WEBSITE
==========================================================
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
  const DS=         the 12 world destinations on the home page (text, attractions, best for, u: page link,
                    ph: photo path under assets/, t: tabs "intl", "india", "honey").
  const MP=         the "More places to explore" tiles
  const FP=         the "Popular holiday packages" cards and the trip finder (u: package page, r: intl or india,
                    w: couple, family, friends). The Thailand group batch links to the #ultimate page.
  const MQ=         the scrolling strip of highlights
  Hero slides       search: <div class="sl  (photos in assets/hero/, keys w1–w4 in const IM=)
  Story captions    search: const CH=[  (frame ranges, chapter names and text for the scroll film)


CONTENT PAGES (destinations, packages, guides, blog) – added October 2026
=========================================================================
About 1,100 extra pages are generated from data files. index.html stays hand-made; the build copies
its <style> block into assets/css/nexara-base.css so every new page uses the same design.

Folders
  content/          the data you edit: site.mjs (phone, email, domain), india*.mjs and world*.mjs
                    (destinations), packages-*.mjs (itineraries), tour-types.mjs (themes),
                    guides/ and blog/ (articles), pages.mjs (about, contact, policies, FAQs)
  tools/lib/menu.mjs  the top bar, mega menu (Packages, India, Honeymoon, Themes, Company) and footer
                    destination links. Built from the destination and package data, so new countries, states
                    and honeymoon itineraries appear in the menu automatically. index.html gets the same menu
                    between its <!--TOPBAR--> and <!--MENU--> markers on every build. Styles: assets/css/nexara-menu.css
  tools/            build.mjs (makes the pages), validate.mjs (quality checks), serve.mjs (local preview),
                    crawl_reference.py + analyse_reference.py (the GT Holidays research crawl)
  research/         audit, crawl inventory and reports, build-report.json, validation-report.json
  destinations/ packages/ tour-packages/ tour-types/ travel-guides/ blog/ about-us/ ...
                    GENERATED. Do not edit by hand; they are rewritten on every build.
  sitemap.xml, sitemap-*.xml, robots.txt, 404.html   GENERATED.

Destination photos
  Source is set in content/site.mjs (photos:): "vw+commons" = Veena World first with Wikimedia Commons filling
  gaps (current), "vw" = Veena World only, "commons" = Commons only. (The GT Holidays photos were retired in October 2026.)
  Veena World (used with the owner's written permission; credited on /photo-credits/)
    assets/main images/     the original zips (veenaworld-part1..11.zip); kept out of git and Vercel
    assets/veenaworld/      the zips extracted, part1 ... part11, each with products.csv (5.3 GB; out of git and Vercel)
    assets/photos/vw/       web-sized copies used by the site (vw/sm/ = card size); content/photos-vw.json = index
    Refresh:  node tools/place-list.mjs  then  python tools/vw_photos.py  then  npm run build
    The matcher skips guest feedback galleries, staff photos, logo-marked banners, thumbnails, hotel/food/festival
    shots and any photo with a prominent face. Photos rejected on review: research/vw-rejected.json (by name).
    research/vw-unmatched.json lists usable photos naming no Nexara place: a list of destinations worth adding.
  Wikimedia Commons (free licences, credited on /photo-credits/ when used)
    assets/photos/ (+ sm/, a/), content/photos.json, content/photo-overrides.json
    Refresh:  node tools/photo-targets.mjs  then  python tools/fetch_photos.py  then  npm run build

Destination page template (every state, country and place page)
  One template in tools/build.mjs (section 7) renders: header photo + facts panel, quick facts, essential tips,
  OpenStreetMap map, who it suits, plan-from-your-city buttons, overview, packages, places, top attractions,
  wildlife or nature, culture, outdoor activities, travel tips, FAQs, related destinations, guides, enquiry form.
  Sections without data for that destination are left out. Country practicals (calling code, driving side,
  plugs, emergency numbers, tipping, water) live in content/country-facts.mjs; update FACTS_REVIEWED when you review them.
  Visitor statistics are deliberately not shown: no verified source has been added yet.

New destinations
  content/places-added.mjs  states, cities, countries and itineraries added in October 2026 (merged by build.mjs)

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

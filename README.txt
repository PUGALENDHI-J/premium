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

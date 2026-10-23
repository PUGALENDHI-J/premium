# Existing site baseline (audit before expansion)

Audited 2026-10-23 at commit `bde1b52` ("Recolor site to red and orange palette"), branch `main`, clean tree.

## Stack

| Item | Finding |
|---|---|
| Framework | None. One hand-written static `index.html` (~177 KB) with inline CSS and JS |
| Routing | Client-side hash router: `#home`, `#packages`, `#experiences`, `#gallery`, `#contact`, plus package views `#honeymoon`, `#boys`, `#ultimate` |
| Backend / CMS / DB | None. Data lives in JS arrays inside `index.html` (`P` packages, `DS` destinations, `MP` extra places, `E` experiences, `GL` gallery) |
| Enquiry | 3-step `<dialog id="enq">` (name + mobile, trip/travellers/date/city, review + note), validated in JS, then opens `wa.me/917305971481` with a prefilled message. Contact page form does the same. Nothing is stored server-side |
| Build / lint / tests | None configured (no `package.json`) |
| Hosting | Not determinable from the repo: no CNAME, `netlify.toml`, `vercel.json` or workflow files. `README.txt` says to upload `index.html` + `assets/` to the host for nexaraholidays.com or drag the folder into Netlify/Vercel/Cloudflare Pages. Git remote `PUGALENDHI-J/nexora-premium` (not visible to the local `gh` login) |
| Other files | `nexara-redesign.html` + `NEXARA-DESIGN-PROMPT.md` (an alternate single-file design, not linked from the site); `assets/Nexara_Holidays_Thailand_travel___*_frames/` (228 MB source PNGs, README says do not upload) |

## Existing indexable URLs

Only **one** URL is indexable: `https://nexaraholidays.com/`. Hash views are not separate URLs for search engines.
No `robots.txt`, no `sitemap.xml`, no `404.html`.

## SEO already present (home only)

`<title>`, meta description, keywords, `robots: index, follow`, canonical `https://nexaraholidays.com/`, Open Graph + Twitter card (`assets/og-image.jpg`, 1200×630), `TravelAgency` JSON-LD (telephone, email, Chennai address, Instagram).

## Design system (must be preserved)

| Token | Value |
|---|---|
| `--red` / `--red2` | `#f20000` / `#c70000` |
| `--gold` (orange accent) | `#ff7a2f` |
| `--ink` / `--mut` | `#111111` / `#555555` |
| `--bg` / `--line` | `#fff7f5` / `#f1e4e1` |
| `--grad` | `linear-gradient(90deg,#ff4d2e,#ffa63b)` |
| `--sun` | `linear-gradient(135deg,#ff9a3c,#ff4d2e)` |
| `--ease` | `cubic-bezier(.2,.8,.2,1)` |
| Fonts | Playfair Display 500/700/800 (headings, nav), Poppins 400/500/600 (body), Mr Dafoe (script eyebrows `.eye` / `.scr`) |
| Radii | Pills `99px`; cards 20–26px; dialogs 18–22px; inputs 10–12px |
| Shadows | Red-tinted, e.g. `0 24px 50px rgba(242,0,0,.2)` on hover |
| Breakpoints | 1340, 1240, 1140, 1060, 980, 960, 860 (burger menu), 820, 760, 700, 680, 620, 600, 560, 520, 480, 430, 420 px |

Reusable components: `header` (brand + capsule nav `.nl` + call chip `.hc` + jewel CTA `a.ph` + `.burger`), `.pgh` page header with `.crumb` + `.scr` + `h1`, `.wrap`, `section` + `.h` heading block, `.btn` (`.red`, `.ghost2`, `.glass`, `.mini`), `.tabs` pill filter, `.dc` destination card (gradient media `.dm` + SVG motif fallback `sea|karst|peak|temple`), `.card` photo package card, `.mb` two-column package body with `.day` accordions + `.sd.pk-side` included/excluded, `.faq` details, `.tg` tag chips, `.gl2` fact tiles, `.dat` bullet list, `.cta` band, footer (`.fcta`, `.fg` 5-column grid, `.fb2`, `.credits`), floating `.wa` WhatsApp button and `.enq` button, `#enq` dialog, `.fl` floating-label inputs.

## Content worth retaining

* 3 live Thailand packages with real departure dates (Nov 19, 2026 batch; Yi Peng Nov 24–25, 2026) and one published price (Ultimate Boys Escape ₹34,999 pp without flight).
* 12 Thailand destination records + 10 "more places" with photos in `assets/dest/` and `assets/hero/`.
* Contact: +91 73059 71481 (call/WhatsApp), hello@nexaraholidays.com (README marks it a placeholder), Instagram `nexara_holidays_official`.
* Image credits for Wikimedia Commons photos in the footer.

## Issues found

* `hello@nexaraholidays.com` is flagged in `README.txt` as a placeholder email.
* No crawlable internal links beyond `/` (everything is a hash route), so search engines see one page.
* Footer destination links are `href="#"` buttons that open a dialog (not crawlable).
* No broken image references were found in `index.html`; all `assets/...` paths it references exist.

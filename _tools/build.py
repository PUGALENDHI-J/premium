#!/usr/bin/env python3
"""Generates the static pages for the RIB Cotton Exports site from shared partials.
Run:  python3 build.py   (writes the .html files next to this script's ./site folder)
"""
import json, os, re, html

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, "site") if os.path.isdir(os.path.join(HERE, "site")) else os.path.dirname(HERE)
BRAND = "RIB Cotton Exports"
PHONE_DISPLAY = "+91 95005 73568 / +91 94430 43950"
WHATSAPP_DISPLAY = "+91 80120 29452"
WEBSITE = "https://www.ribcottonexports.in"
ADDRESS = "2A, Amaravathi Nagar<br>Dharapuram Road<br>Tirupur – 638701<br>South India"

src = open(os.path.join(ROOT, "js/products.js"), encoding="utf-8").read()
PRODUCTS = json.loads(re.search(r"window\.PRODUCTS = (\[.*?\]);\nwindow", src, re.S).group(1))
CATS = []
for p in PRODUCTS:
    if p["category"] not in CATS:
        CATS.append(p["category"])
COUNT = {c: sum(1 for p in PRODUCTS if p["category"] == c) for c in CATS}
def img(i): return f"assets/products/p{i:02d}.webp"
def q(c): return c.replace(" & ", "+%26+").replace(" ", "+")

SPRITE = """<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
<symbol id="i-mark" viewBox="0 0 24 24"><path d="M4 7v10M8.5 4v16M13 7v10M17.5 4v16M22 7v10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></symbol>
<symbol id="i-wa" viewBox="0 0 24 24"><path d="M17.47 14.38c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.95 1.18-.18.2-.35.23-.65.08-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.79-1.68-2.09-.18-.3-.02-.46.13-.61.14-.13.3-.35.45-.53.15-.17.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.63-.93-2.24-.25-.59-.5-.51-.68-.52h-.58c-.2 0-.53.08-.8.38-.28.3-1.06 1.03-1.06 2.5 0 1.49 1.08 2.92 1.23 3.12.15.2 2.12 3.24 5.14 4.55.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.08-.13-.28-.2-.58-.35zM12 2a10 10 0 0 0-8.56 15.17L2 22l4.98-1.39A10 10 0 1 0 12 2z"/></symbol>
<symbol id="i-phone" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></symbol>
<symbol id="i-plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></symbol>
<symbol id="i-close" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></symbol>
<symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 8h16M4 16h16"/></symbol>
<symbol id="i-bag" viewBox="0 0 24 24"><path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></symbol>
<symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></symbol>
<symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></symbol>
<symbol id="i-grid" viewBox="0 0 24 24"><rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/></symbol>
</defs></svg>"""

FAVICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' rx='5' fill='%230e1a38'/%3E%3Cpath d='M5 8v8M8.7 5v14M12.5 8v8M16.3 5v14M20 8v8' stroke='%23fff' stroke-width='1.7' stroke-linecap='round' fill='none'/%3E%3C/svg%3E"

def icon(name, cls="i", extra=""):
    return f'<svg class="{cls}" viewBox="0 0 24 24" aria-hidden="true" {extra}><use href="#i-{name}"/></svg>'

NAV = [("About", "about.html", "about"), ("Collection", "shop.html", "shop"), ("Contact", "contact.html", "contact")]

def header(active):
    links = "".join(
        f'<li><a href="{h}"{" aria-current=\"page\"" if k == active else ""}>{t}</a></li>' for t, h, k in NAV)
    menu_links = "".join(f'<a href="{h}">{t}</a>' for t, h, _ in [("Home", "index.html", "")] + NAV)
    return f"""
<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <div class="wrap nav-row">
    <a class="brand" href="index.html" aria-label="{BRAND}, home">{icon("mark","i brand-mark")}<span class="brand-name"><b>RIB</b> Cotton Exports</span></a>
    <nav class="nav" aria-label="Main"><ul>{links}</ul></nav>
    <div class="nav-actions">
      <a class="list-link" href="enquiry.html" aria-label="Your list">{icon("bag")}<span class="label">Your list</span><span class="count js-count" hidden>0</span></a>
      <a class="btn btn-ghost btn-sm" data-wa href="#">{icon("wa","i i-fill")} WhatsApp</a>
      <button class="menu-btn" id="menuOpen" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="menu">{icon("menu")}</button>
    </div>
  </div>
</header>
<div class="menu-sheet" id="menu" role="dialog" aria-modal="true" aria-label="Menu">
  <div class="menu-top"><a class="brand" href="index.html">{icon("mark","i brand-mark")}<span class="brand-name"><b>RIB</b> Cotton Exports</span></a>
    <button class="menu-btn" id="menuClose" type="button" aria-label="Close menu" style="display:grid;color:#fff">{icon("close")}</button></div>
  <nav class="menu-links" aria-label="Menu">{menu_links}</nav>
  <div class="menu-foot"><span>Questions about a style?</span><a data-wa href="#">Chat on WhatsApp {WHATSAPP_DISPLAY}</a><a data-tel href="#">{PHONE_DISPLAY}</a></div>
</div>"""

DOCK = f"""
<nav class="dock" aria-label="Quick actions">
  <a class="dock-ghost" href="shop.html">{icon("grid")} Shop</a>
  <a class="dock-wa" data-wa href="#">{icon("wa","i i-fill")} WhatsApp</a>
  <a class="dock-ghost" data-tel href="#">{icon("phone")} Call</a>
</nav>"""

def footer():
    shop = "".join(f'<li><a href="shop.html?cat={q(c)}">{c}</a></li>' for c in CATS)
    return f"""
<footer class="site-footer">
  <div class="wrap">
    <div class="foot-grid">
      <div class="foot-brand">
        <a class="brand" href="index.html">{icon("mark","i brand-mark")}<span class="brand-name"><b>RIB</b> Cotton Exports</span></a>
        <p>Certified knitted garment manufacturing and exports from Tirupur, South India.</p>
      </div>
      <nav aria-label="Shop"><h3>Shop</h3><ul>{shop}</ul></nav>
      <nav aria-label="Company"><h3>Company</h3><ul><li><a href="about.html">About us</a></li><li><a href="contact.html">Contact</a></li><li><a href="contact.html#faq">Questions</a></li><li><a href="enquiry.html">Your list</a></li></ul></nav>
      <div><h3>Reach us</h3><ul><li><a data-wa href="#">WhatsApp {WHATSAPP_DISPLAY}</a></li><li><a data-tel href="#">{PHONE_DISPLAY}</a></li><li><a href="{WEBSITE}">ribcottonexports.in</a></li></ul></div>
    </div>
    <div class="foot-mark" aria-hidden="true">{BRAND}</div>
    <div class="foot-bottom"><span>© 2026 {BRAND}</span><span>Tirupur, South India</span></div>
  </div>
</footer>"""

def page(fname, title, desc, body, active="", pg="", extra_head=""):
    out = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{title}</title>
<meta name="description" content="{html.escape(desc, quote=True)}">
<meta name="theme-color" content="#0e1a38">
<link rel="icon" href="{FAVICON}">
<link rel="stylesheet" href="css/style.css">
{extra_head}
</head>
<body data-page="{pg}">
{SPRITE}
{header(active)}
<main id="main">
{body}
</main>
{footer()}
{DOCK}
<script src="js/products.js"></script>
<script src="js/app.js"></script>
</body>
</html>
"""
    open(os.path.join(ROOT, fname), "w", encoding="utf-8").write(out)

# ---------------------------------------------------------------- HOME
tile_defs = [
    ("Kids", "assets/lifestyle/collection-kids.webp", "shop.html?for=Kids", 40, "Smiling girl in a white puff-sleeve top and jeans"),
    ("Men", "assets/lifestyle/collection-men.webp", "shop.html?for=Men", 9, "Man in a black oversized graphic t-shirt"),
    ("Women", "assets/lifestyle/collection-women.webp", "shop.html?for=Women", 10, "Woman in a white t-shirt and jeans"),
]
tiles = "".join(
    f'''<a class="tile tile-photo" href="{h}"><div class="panel"><img src="{im}" alt="{alt}" loading="lazy"></div>
<div class="tile-cap"><h3>{c}</h3><span>{n} styles</span></div></a>''' for c, im, h, n, alt in tile_defs)

audience_slides_data = [
    ("Men", "assets/lifestyle/family-men-pexels-12969212.webp", "Parents and child sharing an outdoor family moment."),
    ("Children", "assets/lifestyle/kids-playing.webp", "Children laughing and running together through a sunny meadow."),
]
audience_slides = "".join(
    f'''<div class="audience-slide" id="audience-slide-{i + 1}" data-slide role="group" aria-roledescription="slide" aria-label="{audience}, {i + 1} of {len(audience_slides_data)}"{" hidden" if i else ""}>
      <img src="{image}" alt="{alt}" decoding="async" {"fetchpriority='high'" if i == 0 else "loading='lazy'"}>
    </div>'''
    for i, (audience, image, alt) in enumerate(audience_slides_data)
)

home = f"""
<section class="hero">
  <div class="wrap hero-grid">
    <div class="hero-copy">
      <h1>Fresh styles developed exclusively for your brand</h1>
      <p class="lead">High-quality knitted garments for men, women and children, made for customers across Europe and Scandinavia.</p>
      <div class="hero-actions">
        <a class="btn" href="shop.html">Browse the collection</a>
        <a class="btn btn-wa" data-wa href="#">{icon("wa","i i-fill")} Chat on WhatsApp</a>
      </div>
    </div>
    <div class="hero-stage audience-slider" id="audienceSlider" role="region" aria-roledescription="carousel" aria-label="Lifestyle image slideshow">
      <div class="audience-slides" aria-live="off">{audience_slides}</div>
    </div>
  </div>
</section>

<section class="section-tight" id="collection">
  <div class="wrap">
    <div class="section-head">
      <div><h2>The collection</h2></div>
      <a class="link" href="shop.html">View every style {icon("arrow","i i-sm","style='width:18px;height:18px'")}</a>
    </div>
    <div class="tiles">{tiles}</div>
  </div>
</section>

<section class="section statement">
  <div class="wrap">
    <p class="display">Organic and conventional knitted garments, made with azo-free dyes.</p>
    <p style="margin-top:24px">Our certified production units follow strict quality control and support responsible garment manufacturing.</p>
  </div>
</section>

<section class="section-tight">
  <div class="wrap">
    <div class="section-head"><h2>Latest styles</h2><a class="link" href="shop.html">See all {icon("arrow","i","style='width:18px;height:18px'")}</a></div>
    <div class="grid rail" id="newRail"></div>
  </div>
</section>

<section class="section floor">
  <div class="wrap floor-grid">
    <div>
      <h2>Made on our own floor</h2>
      <p>Our compliant, certified production units manufacture high-quality knitted garments with strict quality control throughout the process.</p>
      <a class="link" href="about.html">Read our story {icon("arrow","i","style='width:18px;height:18px'")}</a>
    </div>
    <div class="photo-trio">
      <img src="assets/factory/f38.webp" alt="Sewing operators working on the production floor" loading="lazy">
      <img src="assets/factory/f39.webp" alt="Rows of sewing machines under the ceiling fans" loading="lazy">
      <img src="assets/factory/f40.webp" alt="Folded garments stacked on the finishing table" loading="lazy">
    </div>
  </div>
</section>

<section class="section statement">
  <div class="wrap">
    <p class="display">Quality knitted garments for men, women and children, made with a focus on comfort, consistency and responsible production.</p>
    <p style="margin-top:32px"><a class="link" href="about.html#quality">Our quality standards</a></p>
  </div>
</section>

<section class="section-tight" id="how">
  <div class="wrap">
    <div class="section-head"><h2>How ordering works</h2></div>
    <ol class="steps">
      <li><h3>Choose your pieces</h3><p>Browse the collection and add anything you like to your list.</p></li>
      <li><h3>Send us the list</h3><p>One tap opens WhatsApp with every item code already filled in.</p></li>
      <li><h3>We confirm the details</h3><p>We reply with sizes, prices, minimum quantities and dispatch timing.</p></li>
    </ol>
  </div>
</section>

<section class="section-tight" style="padding-bottom:clamp(72px,10vw,144px)">
  <div class="wrap">
    <div class="cta rib-deep">
      <div><h2>Speak to us directly</h2><p>WhatsApp is the quickest way to reach us. Send a photo, ask about a size, or request the latest catalogue.</p></div>
      <div class="cta-actions"><a class="btn btn-wa" data-wa href="#">{icon("wa","i i-fill")} Chat on WhatsApp</a><a class="btn btn-light" data-tel href="#">{icon("phone")} Call {PHONE_DISPLAY}</a></div>
    </div>
  </div>
</section>"""
page("index.html", f"{BRAND} | Knitted garment manufacturer and exporter",
     "Certified knitted garment manufacturing and exports from Tirupur, South India. Organic and conventional garments for men, women and children.", home, pg="home")

# ---------------------------------------------------------------- SHOP
who = ["Boys", "Girls", "Teens", "Women", "Men", "Kids"]
shop = f"""
<div class="wrap page-head">
  <h1>The collection</h1>
  <p class="lead">Knitted garments for men, women and children. Add pieces to your list and send them to us on WhatsApp in one go.</p>
</div>
<section class="section-tight"><div class="wrap"><div class="audience-collections">
  <a class="cta rib-deep" href="shop.html?for=Men"><h2>Men's wear</h2></a>
  <a class="cta rib-deep" href="shop.html?for=Women"><h2>Women's wear</h2></a>
  <a class="cta rib-deep" href="shop.html?for=Kids"><h2>Kidswear</h2></a>
</div></div></section>
<div class="filters"><div class="wrap filters-row">
  <div class="chips" id="chips" role="group" aria-label="Filter by type"></div>
</div></div>
<div class="wrap">
  <div class="result-bar"><span id="count" aria-live="polite"></span>
    <div class="filter-tools">
      <label class="field search"><span class="sr-only">Search styles</span>{icon("search","i","style='width:18px;height:18px'")}<input id="search" type="search" placeholder="Search styles" autocomplete="off"></label>
      <label class="sr-only" for="who">Filter by who it is for</label>
      <select class="field" id="who"><option value="All">Everyone</option>{"".join(f'<option>{w}</option>' for w in who)}</select>
    </div>
  </div>
  <div class="grid" id="shopGrid" style="padding-bottom:clamp(64px,8vw,112px)"></div>
  <div class="empty" id="empty" hidden><h2>No styles match</h2><p>Try a different search, or clear the filters to see everything.</p><button class="btn" id="reset" type="button">Clear filters</button></div>
</div>"""
page("shop.html", f"The collection | {BRAND}", "Browse knitted garments for men, women and children, including organic and conventional options.", shop, active="shop", pg="shop")

# ---------------------------------------------------------------- PRODUCT
prod = f"""
<div class="wrap" style="padding-top:20px">
  <nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><span>/</span><a href="shop.html">Collection</a><span>/</span><span id="pdCrumb">Style</span></nav>
  <div class="pd" id="pd"></div>
  <div style="padding-bottom:clamp(72px,10vw,144px)">
    <div class="section-head"><h2>More from the collection</h2><a class="link" href="shop.html">View all</a></div>
    <div class="grid rail" id="moreRail"></div>
  </div>
</div>"""
page("product.html", f"Style | {BRAND}", f"{BRAND} style details.", prod, active="shop", pg="product")

# ---------------------------------------------------------------- ENQUIRY
enq = f"""
<div class="wrap page-head"><h1>Your list</h1><p class="lead">Pieces you have added. Send the whole list to us on WhatsApp in one message.</p></div>
<div class="wrap">
  <div class="empty" id="listEmpty" hidden><h2>Your list is empty</h2><p>Add pieces as you browse and they will gather here, ready to send.</p><a class="btn" href="shop.html">Browse the collection</a></div>
  <div class="list-wrap" id="listWrap" hidden>
    <ul class="list-items" id="listItems"></ul>
    <aside class="list-side rib" id="side">
      <h2>Send your list</h2>
      <p class="muted" id="sum"></p>
      <div><label for="note">Sizes, quantities or questions (optional)</label><textarea class="field" id="note" placeholder="For example: sizes 6 to 10 years, 24 pieces per style"></textarea></div>
      <a class="btn btn-wa btn-block" id="send" target="_blank" rel="noopener" href="#">{icon("wa","i i-fill")} Send on WhatsApp</a>
      <button class="link" id="clear" type="button" style="justify-self:start">Clear list</button>
    </aside>
  </div>
</div>"""
page("enquiry.html", f"Your list | {BRAND}", f"Review the {BRAND} pieces you have chosen and send the list on WhatsApp.", enq, pg="enquiry")

# ---------------------------------------------------------------- ABOUT
about = f"""
<div class="wrap page-head"><h1 class="rib-title">{BRAND}</h1>
<p class="lead">A certified apparel manufacturing and export company based in Tirupur, South India.</p></div>

<section class="section-tight">
  <div class="wrap split">
    <div class="photo"><img src="assets/factory/f38.webp" alt="Sewing operators working on the production floor"></div>
    <div class="prose">
      <h2 style="margin-bottom:24px">Quality knitwear for global customers</h2>
      <p class="lead">Fresh styles developed exclusively for your brand.</p>
      <p>We specialize in high-quality knitted garments for men, women, and children. Our product range includes T-shirts, polo shirts, sweatshirts, tank tops, hooded jackets, and leggings. We currently supply customers across Europe and Scandinavian countries.</p>
      <p>Our production units are fully compliant and certified. We manufacture both organic and conventional garments using azo-free dyes, reflecting our commitment to quality, consistency, and environmental responsibility.</p>
      <p>We offer competitive pricing, flexible MOQs, and strict quality control throughout the production process.</p>
      <p>I would be happy to discuss your requirements and provide samples or quotations based on your needs.</p>
      <p>Thank you for considering {BRAND}. I look forward to the opportunity to work together.</p>
    </div>
  </div>
</section>

<section class="section" id="quality">
  <div class="wrap">
    <div class="section-head"><h2>Quality, comfort and responsibility</h2></div>
    <div class="facts">
      <div><h3>Made for everyday movement</h3><p>Rib construction offers comfortable stretch and recovers its shape, helping cuffs, hems and necklines maintain their fit.</p></div>
      <div><h3>Softness for everyday wear</h3><p>Soft knitted fabrics provide a comfortable feel across our men's, women's and kids' collections.</p></div>
      <div><h3>Organic and conventional</h3><p>We manufacture organic and conventional garments using azo-free dyes, with quality and consistency checks throughout production.</p></div>
    </div>
  </div>
</section>

<section class="floor section">
  <div class="wrap">
    <div class="photo-trio wide" style="aspect-ratio:2.1/1;grid-template-columns:1.4fr 1fr 1fr;grid-template-rows:1fr">
      <img src="assets/factory/f38.webp" alt="Sewing operators working on the production floor" style="grid-row:auto" loading="lazy">
      <img src="assets/factory/f39.webp" alt="Rows of sewing machines on the production floor" loading="lazy">
      <img src="assets/factory/f40.webp" alt="Finished garments stacked for checking" loading="lazy">
    </div>
    <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:32px;flex-wrap:wrap;margin-top:clamp(32px,4vw,56px)">
      <h2 style="margin:0;max-width:14em">Come and see how it is made</h2>
      <div class="cta-actions"><a class="btn btn-wa" data-wa="Hello RIB Cotton Exports, I would like to discuss a visit to your production unit." href="#">{icon("wa","i i-fill")} Discuss a visit on WhatsApp</a><a class="btn btn-light" href="shop.html">Browse the collection</a></div>
    </div>
  </div>
</section>"""
page("about.html", f"About | {BRAND}", f"{BRAND} is a certified knitted garment manufacturer and exporter based in Tirupur, South India.", about, active="about", pg="about")

# ---------------------------------------------------------------- CONTACT
faqs = [
 ("How do I place an order?", "Add pieces to your list and send it to us on WhatsApp, or message us directly. We reply with sizes, prices, minimum quantities and dispatch timing, then confirm your order."),
 ("Do you supply in bulk?", "Yes. Shops, schools and corporate buyers are welcome. Tell us the styles and quantities you need and we will quote."),
 ("How quickly do you ship?", "Orders confirmed before 2 PM are dispatched the same business day. Delivery usually takes 2 to 3 business days to metro cities and 3 to 5 days elsewhere in India."),
 ("What is your returns policy?", "If a size is not right, message us within 7 days of delivery and we will arrange an exchange."),
]
faq_html = "".join(f"<details class='faq'><summary>{a}</summary><p>{b}</p></details>" for a, b in faqs)
contact = f"""
<div class="wrap page-head"><h1>Talk to us</h1><p class="lead">The quickest way to reach us is WhatsApp. We usually reply within an hour during opening hours.</p></div>
<section class="section-tight">
  <div class="wrap contact-grid">
    <dl class="reach">
      <div><dt>WhatsApp</dt><dd><a data-wa href="#">{WHATSAPP_DISPLAY}</a></dd></div>
      <div><dt>Mobile</dt><dd><a data-tel href="#">{PHONE_DISPLAY}</a></dd></div>
      <div><dt>Website</dt><dd><a href="{WEBSITE}">www.ribcottonexports.in</a></dd></div>
      <div><dt>Address</dt><dd>{ADDRESS}</dd></div>
    </dl>
    <form class="form" id="contactForm">
      <h2>Message us on WhatsApp</h2>
      <div class="two"><div><label for="name">Your name</label><input class="field" id="name" name="name" required autocomplete="name"></div>
      <div><label for="topic">Topic</label><select class="field" id="topic" name="topic"><option>Sizes and styles</option><option>Bulk or wholesale</option><option>Delivery</option><option>Exchange</option><option>Something else</option></select></div></div>
      <div><label for="message">Message</label><textarea class="field" id="message" name="message" required placeholder="Tell us what you are looking for"></textarea></div>
      <button class="btn btn-wa" type="submit">{icon("wa","i i-fill")} Continue on WhatsApp</button>
    </form>
  </div>
</section>
<section class="section" id="faq">
  <div class="wrap"><div class="section-head"><h2>Questions</h2></div>{faq_html}</div>
</section>"""
page("contact.html", f"Contact | {BRAND}", f"Contact {BRAND} in Tirupur, South India, by phone or WhatsApp.", contact, active="contact", pg="contact")
print("built")

#!/usr/bin/env python3
"""Generates the static pages for the Rib Cotton site from shared partials.
Run:  python3 build.py   (writes the .html files next to this script's ./site folder)
"""
import json, os, re, html

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, "site") if os.path.isdir(os.path.join(HERE, "site")) else os.path.dirname(HERE)
PHONE_DISPLAY = "+91 98400 12345"
EMAIL = "support@ribcotton.com"
ADDRESS = "No. 42, Cotton Mills Avenue, Tirupur, Tamil Nadu - 600001"

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

NAV = [("Collection", "shop.html", "shop"), ("About", "about.html", "about"), ("Contact", "contact.html", "contact")]

def header(active):
    links = "".join(
        f'<li><a href="{h}"{" aria-current=\"page\"" if k == active else ""}>{t}</a></li>' for t, h, k in NAV)
    menu_links = "".join(f'<a href="{h}">{t}</a>' for t, h, _ in [("Home", "index.html", "")] + NAV + [("Your list", "enquiry.html", "")])
    return f"""
<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <div class="wrap nav-row">
    <a class="brand" href="index.html" aria-label="Rib Cotton, home">{icon("mark","i brand-mark")}<span class="brand-name">Rib Cotton</span></a>
    <nav class="nav" aria-label="Main"><ul>{links}</ul></nav>
    <div class="nav-actions">
      <a class="list-link" href="enquiry.html" aria-label="Your list">{icon("bag")}<span class="label">Your list</span><span class="count js-count" hidden>0</span></a>
      <a class="btn btn-ghost btn-sm" data-wa href="#">{icon("wa","i i-fill")} WhatsApp</a>
      <button class="menu-btn" id="menuOpen" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="menu">{icon("menu")}</button>
    </div>
  </div>
</header>
<div class="menu-sheet" id="menu" role="dialog" aria-modal="true" aria-label="Menu">
  <div class="menu-top"><a class="brand" href="index.html">{icon("mark","i brand-mark")}<span class="brand-name">Rib Cotton</span></a>
    <button class="menu-btn" id="menuClose" type="button" aria-label="Close menu" style="display:grid;color:#fff">{icon("close")}</button></div>
  <nav class="menu-links" aria-label="Menu">{menu_links}</nav>
  <div class="menu-foot"><span>Questions about a style?</span><a data-wa href="#">Chat on WhatsApp</a><a data-tel href="#">{PHONE_DISPLAY}</a></div>
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
        <a class="brand" href="index.html">{icon("mark","i brand-mark")}<span class="brand-name">Rib Cotton</span></a>
        <p>Knitwear for children, women and the whole family. Made in Tirupur.</p>
      </div>
      <nav aria-label="Shop"><h3>Shop</h3><ul>{shop}</ul></nav>
      <nav aria-label="Company"><h3>Company</h3><ul><li><a href="about.html">About us</a></li><li><a href="contact.html">Contact</a></li><li><a href="contact.html#faq">Questions</a></li><li><a href="enquiry.html">Your list</a></li></ul></nav>
      <div><h3>Reach us</h3><ul><li><a data-wa href="#">WhatsApp</a></li><li><a data-tel href="#">{PHONE_DISPLAY}</a></li><li><a data-mail href="#">{EMAIL}</a></li></ul></div>
    </div>
    <div class="foot-mark" aria-hidden="true">Rib Cotton</div>
    <div class="foot-bottom"><span>© 2026 Rib Cotton Apparel Private Limited</span><span>Tirupur, Tamil Nadu</span></div>
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
    ("Hoodies & Sweatshirts", [30, 25]),
    ("Tees & Polos", [7, 17]),
    ("Nightwear", [31]),
    ("Shorts & Leggings", [14]),
    ("Sets", [24, 26]),
    ("Tops & Tunics", [11, 28]),
]
tiles = "".join(
    f'''<a class="tile" href="shop.html?cat={q(c)}"><div class="panel rib">{"".join(f'<img src="{img(i)}" alt="" loading="lazy">' for i in ids)}</div>
<div class="tile-cap"><h3>{c}</h3><span>{COUNT[c]} styles</span></div></a>''' for c, ids in tile_defs)

home = f"""
<section class="hero">
  <div class="wrap hero-grid">
    <div class="hero-copy">
      <h1><span class="kw">W</span>ear the comfort.</h1>
      <p class="lead">Rib-cotton knitwear for children, women and the whole family, cut and finished at our own unit in Tirupur.</p>
      <div class="hero-actions">
        <a class="btn" href="shop.html">Browse the collection</a>
        <a class="btn btn-wa" data-wa href="#">{icon("wa","i i-fill")} Chat on WhatsApp</a>
      </div>
    </div>
    <div class="hero-stage rib" role="img" aria-label="A selection of Rib Cotton hoodies, polos and tees laid flat">
      <img class="hs-a" src="{img(24)}" alt="">
      <img class="hs-b" src="{img(17)}" alt="">
      <img class="hs-c" src="{img(7)}" alt="">
      <img class="hs-d" src="{img(25)}" alt="">
    </div>
  </div>
</section>

<section class="section-tight" id="collection">
  <div class="wrap">
    <div class="section-head">
      <div><h2>The collection</h2><p class="lead">{len(PRODUCTS)} styles in six families, from everyday tees to cosy sets.</p></div>
      <a class="link" href="shop.html">View every style {icon("arrow","i i-sm","style='width:18px;height:18px'")}</a>
    </div>
    <div class="tiles">{tiles}</div>
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
      <p>Every piece starts as a roll of knit fabric on our cutting tables and leaves as a finished garment from the same building. Buyers are always welcome to visit and see the work first-hand.</p>
      <a class="link" href="about.html">Read our story {icon("arrow","i","style='width:18px;height:18px'")}</a>
    </div>
    <div class="photo-trio">
      <img src="assets/factory/f38.webp" alt="Sewing operators at work on the production floor" loading="lazy">
      <img src="assets/factory/f39.webp" alt="Rows of sewing machines under the ceiling fans" loading="lazy">
      <img src="assets/factory/f40.webp" alt="Folded garments stacked on the finishing table" loading="lazy">
    </div>
  </div>
</section>

<section class="section statement">
  <div class="wrap">
    <p class="display">Rib knit stretches with every movement and springs back. The neckline stays crisp and the fit stays true, wash after wash.</p>
    <p style="margin-top:32px"><a class="link" href="about.html#rib">Why we knit in rib</a></p>
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
page("index.html", "Rib Cotton | Rib-cotton knitwear made in Tirupur",
     "Rib-cotton knitwear for children, women and the whole family. Browse tees, polos, hoodies, sets and nightwear, then enquire on WhatsApp.", home, pg="home")

# ---------------------------------------------------------------- SHOP
who = ["Boys", "Girls", "Teens", "Women", "Men", "Kids"]
shop = f"""
<div class="wrap page-head">
  <h1>The collection</h1>
  <p class="lead">Every style we make. Add pieces to your list and send them to us on WhatsApp in one go.</p>
</div>
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
page("shop.html", "The collection | Rib Cotton", "Browse every Rib Cotton style: tees and polos, hoodies and sweatshirts, sets, shorts and leggings, nightwear and tunics.", shop, active="shop", pg="shop")

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
page("product.html", "Style | Rib Cotton", "Rib Cotton style details.", prod, active="shop", pg="product")

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
page("enquiry.html", "Your list | Rib Cotton", "Review the Rib Cotton pieces you have chosen and send the list on WhatsApp.", enq, pg="enquiry")

# ---------------------------------------------------------------- ABOUT
about = f"""
<div class="wrap page-head"><h1>Knitwear, made with care in Tirupur</h1>
<p class="lead">We are a knitwear maker. We cut, stitch and finish our garments ourselves, and we build every collection around soft cotton knits and honest finishing.</p></div>

<section class="section-tight">
  <div class="wrap split">
    <div class="photo"><img src="assets/factory/f38.webp" alt="Operators at their sewing stations on our production floor"></div>
    <div class="prose">
      <h2 style="margin-bottom:24px">One roof, start to finish</h2>
      <p>Fabric arrives as rolls and leaves as finished garments from the same building. Keeping cutting, stitching and finishing together lets us check quality at every step and move quickly when a style needs to change.</p>
      <p>Our range covers children, teens and women, with everyday tees and polos, warm fleece, matching sets and soft nightwear. If you buy for a shop, a school or a family, we are happy to talk through quantities and timing.</p>
    </div>
  </div>
</section>

<section class="section" id="rib">
  <div class="wrap">
    <div class="section-head"><h2>Why we knit in rib</h2></div>
    <div class="facts">
      <div><h3>It stretches and recovers</h3><p>The ridges open as you move and close again afterwards, so cuffs, hems and necklines keep their shape.</p></div>
      <div><h3>It sits close and soft</h3><p>A fine rib hugs the body without pinching, which is why it works so well for children and for lounge wear.</p></div>
      <div><h3>It lets the skin breathe</h3><p>Cotton knit moves air and moisture away from the body, keeping long days comfortable.</p></div>
    </div>
  </div>
</section>

<section class="floor section">
  <div class="wrap">
    <div class="photo-trio wide" style="aspect-ratio:2.1/1;grid-template-columns:1.4fr 1fr 1fr;grid-template-rows:1fr">
      <img src="assets/factory/f39.webp" alt="Rows of sewing machines on the production floor" style="grid-row:auto" loading="lazy">
      <img src="assets/factory/f40.webp" alt="Finished garments stacked for checking" loading="lazy">
      <img src="assets/factory/f38.webp" alt="Operators stitching garments" loading="lazy">
    </div>
    <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:32px;flex-wrap:wrap;margin-top:clamp(32px,4vw,56px)">
      <h2 style="margin:0;max-width:14em">Come and see how it is made</h2>
      <div class="cta-actions"><a class="btn btn-wa" data-wa="Hello Rib Cotton, I would like to plan a visit to your unit." href="#">{icon("wa","i i-fill")} Plan a visit on WhatsApp</a><a class="btn btn-light" href="shop.html">Browse the collection</a></div>
    </div>
  </div>
</section>"""
page("about.html", "About | Rib Cotton", "Rib Cotton is a knitwear maker in Tirupur. We cut, stitch and finish our garments under one roof.", about, active="about", pg="about")

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
      <div><dt>WhatsApp</dt><dd><a data-wa href="#">{PHONE_DISPLAY}</a><small>Daily, 9 AM to 9 PM</small></dd></div>
      <div><dt>Phone</dt><dd><a data-tel href="#">{PHONE_DISPLAY}</a></dd></div>
      <div><dt>Email</dt><dd><a data-mail href="#">{EMAIL}</a><small>For bulk and corporate enquiries</small></dd></div>
      <div><dt>Visit us</dt><dd>{ADDRESS}<small>Monday to Saturday, 10 AM to 8 PM. Sunday, 11 AM to 6 PM.</small></dd></div>
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
page("contact.html", "Contact | Rib Cotton", "Message Rib Cotton on WhatsApp, call, email or visit our unit in Tirupur.", contact, active="contact", pg="contact")
print("built")

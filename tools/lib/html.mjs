// Shared page shell and components for generated pages.
// Markup and class names are copied from index.html so new pages use the existing design system.
import { readFileSync } from "node:fs";
import { SITE } from "../../content/site.mjs";
import { menuLinks, topbar, footLinks } from "./menu.mjs";

// the floating WhatsApp button is copied verbatim from the home page
const WA_BTN = readFileSync(new URL("../../index.html", import.meta.url), "utf8").match(/<a class="wa"[\s\S]*?<\/a>/)[0].replace('href="https', 'target="_blank" rel="noopener" href="https');

export const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
export const slugify = s => String(s).toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export const abs = u => SITE.origin + u;
export const list = (a, sep = ", ", last = " and ") => a.length < 2 ? (a[0] || "") : a.slice(0, -1).join(sep) + last + a[a.length - 1];

const SVG = d => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
export const IC = {
  pin: SVG('<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'),
  cal: SVG('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>'),
  sun: SVG('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
  plane: SVG('<path d="M2 16l20-6-3-2-6 2-6-6H5l3 7-4 1-2-2H1z"/><path d="M3 21h18"/>'),
  clock: SVG('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  user: SVG('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20v-1a6.5 6.5 0 0 1 13 0v1M16 4.5a3.5 3.5 0 0 1 0 7M18.5 13.5a6.5 6.5 0 0 1 3 5.5v1"/>'),
  cash: SVG('<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/>'),
  talk: SVG('<path d="M4 5h16v11H8l-4 4z"/><path d="M8 10h8"/>'),
  food: SVG('<path d="M4 4v5M2.5 4v3a1.5 1.5 0 0 0 3 0V4M4 9v11M18 4c-1.5 1-2 3-2 5h2v11"/>'),
  star: SVG('<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>'),
  tip: SVG('<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z"/>'),
  wa: SVG('<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>'),
  call: SVG('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>'),
  mail: SVG('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
  globe: SVG('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>'),
  route: SVG('<circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h7a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h7"/>'),
  doc: SVG('<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>'),
  arrow: SVG('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  flag: SVG('<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>'),
  car: SVG('<path d="M5 17h14v-5l-2-5H7l-2 5zM5 12h14"/><circle cx="8" cy="17" r="1.6"/><circle cx="16" cy="17" r="1.6"/>'),
  plug: SVG('<path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4"/>'),
  drop: SVG('<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>'),
  shield: SVG('<path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z"/><path d="M12 8v5M12 16h.01"/>'),
  heart: SVG('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'),
  compass: SVG('<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>'),
  mountain: SVG('<path d="m2 20 7-12 4 6 3-4 6 10z"/><path d="m7.5 10.5 1.5 1.5 1.5-1.5"/>'),
  leaf: SVG('<path d="M5 20c0-9 6-15 15-15 0 9-6 15-15 15z"/><path d="M5 20l8-8"/>'),
  temple: SVG('<path d="M12 3 4 8h16z"/><path d="M6 8v11M18 8v11M10 12v7M14 12v7M3 20h18"/>'),
  wave: SVG('<path d="M2 15c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2M2 19c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2"/><circle cx="16" cy="7" r="3"/>'),
  camera: SVG('<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>'),
  boat: SVG('<path d="M3 15h18l-3 5H6z"/><path d="M12 3v12M12 4l6 9h-6"/>'),
  tent: SVG('<path d="M3 20 12 4l9 16zM9 20l3-6 3 6"/>'),
  bike: SVG('<circle cx="6" cy="16" r="3.5"/><circle cx="18" cy="16" r="3.5"/><path d="m6 16 4-7h5l3 7M10 9l2 7M14 6h2"/>'),
  wind: SVG('<path d="M3 9h11a3 3 0 1 0-3-3M3 15h15a3 3 0 1 1-3 3M3 12h7"/>'),
  snow: SVG('<path d="M12 2v20M3.3 7l17.4 10M20.7 7 3.3 17"/>'),
};

// SVG motifs from index.html (const MO): the site's fallback when no licensed photo exists
const MO = {
  sea: '<svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><circle cx="300" cy="70" r="34" fill="#ffc46b" opacity=".85"/><path d="M0 130q50-18 100 0t100 0 100 0 100 0V200H0z" fill="#fff" opacity=".18"/><path d="M0 150q50-16 100 0t100 0 100 0 100 0V200H0z" fill="#fff" opacity=".22"/><path d="M0 172q50-14 100 0t100 0 100 0 100 0V200H0z" fill="#fff" opacity=".3"/></svg>',
  karst: '<svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><circle cx="90" cy="60" r="26" fill="#ffc46b" opacity=".8"/><path d="M120 160c4-50 14-90 34-96 18-4 22 40 26 96zM200 160c2-34 10-66 24-70 16-2 18 30 20 70zM280 160c6-60 18-104 40-108 22-2 28 50 30 108z" fill="#fff" opacity=".28"/><path d="M0 160h400v40H0z" fill="#fff" opacity=".14"/><path d="M0 172q50-10 100 0t100 0 100 0 100 0V200H0z" fill="#fff" opacity=".22"/></svg>',
  peak: '<svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><circle cx="310" cy="58" r="24" fill="#ffc46b" opacity=".8"/><path d="M0 200V140l70-60 50 40 70-80 90 90 50-30 70 50v50z" fill="#fff" opacity=".18"/><path d="M0 200v-36l90-50 70 46 80-60 90 70 70-30v60z" fill="#fff" opacity=".28"/></svg>',
  temple: '<svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><circle cx="80" cy="62" r="24" fill="#ffc46b" opacity=".8"/><g fill="#fff" opacity=".3"><path d="M200 30L206 60 216 70 212 76 224 90 218 96 232 114 224 120 240 150H160L176 120 168 114 182 96 176 90 188 76 184 70 194 60Z"/><path d="M120 88l3 18 7 6-3 4 8 9-4 4 9 21h-40l9-21-4-4 8-9-3-4 7-6z"/><path d="M280 88l3 18 7 6-3 4 8 9-4 4 9 21h-40l9-21-4-4 8-9-3-4 7-6z"/></g><path d="M0 150h400v50H0z" fill="#fff" opacity=".22"/></svg>',
};
// gradients already used by the home page destination cards, grouped by motif
const GR = {
  sea: ["#0b5c6b,#1aa3ad,#8fd8c8", "#0a6870,#2bb3a8,#ffa63b", "#27285e,#3f6fb0,#7fd0e0"],
  karst: ["#0b4f59,#1f9aa0,#ff8a3d", "#123f36,#1c7a64,#6cc4a0"],
  peak: ["#1d4d3a,#2f8f6b,#9fd8b0", "#23305e,#4a6fb5,#a9c4ec"],
  temple: ["#5a2a1e,#b3562b,#ff8a3d", "#4a2a52,#a0507a,#f08a7a", "#23305e,#4a6fb5,#a9c4ec"],
};
const hash = s => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
export function motifFor(tags = "", key = "") {
  const t = " " + tags + " ";
  const m = /\s(beach|island|coast|cruise)\s/.test(t) ? "sea" : /\s(hill|mountain|snow|trek|himalaya)\s/.test(t) ? "peak" : /\s(wildlife|nature|backwater|desert|lake|forest|safari)\s/.test(t) ? "karst" : "temple";
  const g = GR[m][hash(key || tags) % GR[m].length];
  return { m, g };
}
export const media = (v, alt) => v.img ? `<img src="${v.sm || v.img}" alt="${esc(alt)}" loading="lazy">` : MO[v.m];
/** Attribution for a Wikimedia Commons photo: author (linked to the file page) and licence. */
export const photoCredit = p => { const who = esc(p.author.length > 60 ? p.author.slice(0, 57) + "…" : p.author); return `Photo: ${p.source ? `<a href="${p.source}" target="_blank" rel="noopener">${who}</a>` : who}, ${p.licenseUrl ? `<a href="${p.licenseUrl}" target="_blank" rel="noopener">${esc(p.license)}</a>` : esc(p.license)}` };

/* ---------- shell ---------- */
const FONTS = "https://fonts.googleapis.com/css2?family=Mr+Dafoe&family=Playfair+Display:wght@400;500;700;800&family=Poppins:wght@300;400;500;600;700&display=swap";
// menu data comes from the destination graph; build.mjs sets it before the first page is rendered
let MENU = null;
export const setMenu = m => { MENU = m };

function header(active) {
  const nl = menuLinks(MENU, active);
  return `${topbar()}<header><a class="brand" href="/" aria-label="Nexara Holidays, home"><img src="/assets/logo-circle.webp" alt="" width="56" height="56"><span class="bw" aria-hidden="true"><b>NEXARA</b><i>Holidays</i></span></a><nav><span class="nl">${nl}</span><span class="hc"><a class="hcall" href="tel:${SITE.tel}"><i>${IC.call}</i><span><small>Talk to a planner</small><b>${SITE.phone}</b></span></a><a class="hmail" href="mailto:${SITE.email}" title="${SITE.email}" aria-label="Email ${SITE.email}">${IC.mail}</a></span><a class="ph" href="/custom-tour/" data-enq><span>Get a free quote</span><i><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></i></a></nav><button class="burger" aria-label="Menu" aria-expanded="false"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h16M8 16h12"/></svg></button></header>`;
}

function footer() {
  const soc = `<div class="soc"><a href="https://instagram.com/${SITE.insta}" target="_blank" rel="noopener" aria-label="Instagram"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/></svg></a><a href="https://wa.me/${SITE.wa}" target="_blank" rel="noopener" aria-label="WhatsApp">${IC.wa}</a><a href="tel:${SITE.tel}" aria-label="Call">${IC.call}</a><a href="mailto:${SITE.email}" aria-label="Email">${IC.mail}</a></div>`;
  return `<footer><svg class="sky" viewBox="0 0 1200 64" preserveAspectRatio="none" aria-hidden="true"><path fill="currentColor" d="M0 64V50H120L140 40L160 50H230L238 38L242 22L246 38L254 50H300L320 34H332L352 50H420L432 30L440 2L448 30L460 50H470L478 36L482 26L486 36L494 50H600L620 42L640 50H720L728 36L734 12L740 36L748 50H820L840 32L860 50H900L906 40L910 26L914 40L920 50H1020L1040 40L1060 50H1200V64Z"/></svg><div class="fin">
<div class="fcta"><div><h3>Your next holiday <em>starts here</em></h3><p>Tell us where you want to go. We reply on WhatsApp with a plan and a price.</p></div><a class="btn" href="/custom-tour/" data-enq>Get a free quote →</a></div>
<div class="fg"><div class="fbrand"><a class="flogo" href="/"><img src="/assets/logo-circle.webp" alt="Nexara Holidays" width="96" height="96" loading="lazy"></a><p>Holidays planned from Chennai: India and international tours, honeymoons, family trips and custom routes, with a real person to message at every step.</p>${soc}</div>
<div><h5>Explore</h5><a href="/tour-packages/">All tour packages</a><a href="/tour-packages/india/">India holidays</a><a href="/tour-packages/international/">International holidays</a><a href="/destinations/">Destinations</a><a href="/tour-types/">Holiday themes</a><a href="/travel-guides/">Travel guides</a><a href="/blog/">Travel blog</a></div>
<div><h5>Popular</h5><a href="/tour-types/honeymoon/">Honeymoon packages</a><a href="/tour-types/family-holidays/">Family holidays</a><a href="/tour-types/group-tours/">Group tours</a><a href="/destinations/international/southeast-asia/thailand/">Thailand</a><a href="/destinations/india/kerala/">Kerala</a><a href="/destinations/international/indian-ocean/maldives/">Maldives</a></div>
<div><h5>Company</h5><a href="/about-us/">About us</a><a href="/custom-tour/">Custom tour enquiry</a><a href="/faqs/">FAQs</a><a href="/privacy-policy/">Privacy policy</a><a href="/terms-and-conditions/">Terms and conditions</a><a href="/cancellation-policy/">Cancellation and refunds</a><a href="/sitemap/">Site map</a></div>
<div class="fc"><h5>Get in touch</h5><a href="tel:${SITE.tel}">${IC.call}${SITE.phone}</a><a href="mailto:${SITE.email}">${IC.mail}${SITE.email}</a><a href="https://wa.me/${SITE.wa}" target="_blank" rel="noopener">${IC.wa}WhatsApp chat</a><a href="https://instagram.com/${SITE.insta}" target="_blank" rel="noopener"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/></svg>@${SITE.insta}</a></div></div>
${footLinks(MENU)}
<div class="fb2">© <span class="yr">${new Date().getFullYear()}</span> Nexara Holidays, Chennai. Prices, availability and inclusions are confirmed only in your written quote. An enquiry is not a booking.</div>${SITE.photos == "gt" ? "" : `<p class="credits">Some destination photos via Wikimedia Commons under free licences; see <a href="/photo-credits/">photo credits</a>.</p>`}</div></footer>`;
}

/** Full page. crumbs: [[name, url]] ending with the current page (url may be omitted). */
export function page({ path, title, desc, h1, scr, sub, crumbs = [], hero = {}, heroAside = "", body, jsonld = [], robots, active, ogType = "website", headExtra = "" }) {
  const canonical = abs(path);
  const ld = [...jsonld];
  if (crumbs.length > 1) ld.push({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: crumbs.map(([n, u], i) => ({ "@type": "ListItem", position: i + 1, name: n, item: abs(u || path) })) });
  const crumbHtml = crumbs.length > 1 ? `<div class="crumb" role="navigation" aria-label="Breadcrumb">${crumbs.map(([n, u], i) => i < crumbs.length - 1 ? `<a href="${u}">${esc(n)}</a>` : `<span aria-current="page">${esc(n)}</span>`).join(" / ")}</div>` : "";
  const bg = hero.img ? "" : hero.g ? ` style="background:linear-gradient(135deg,${hero.g})"` : "";
  return `<!DOCTYPE html>
<html lang="en-IN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="${robots || "index, follow"}">
<meta name="theme-color" content="#f20000">
<script>try{var t=+sessionStorage.getItem("nx-pt");sessionStorage.removeItem("nx-pt");if(Date.now()-t<4e3&&!matchMedia("(prefers-reduced-motion:reduce)").matches)document.documentElement.classList.add("pt-in")}catch(e){}</script>
<link rel="canonical" href="${canonical}">
<link rel="icon" href="/favicon.ico" sizes="any"><link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32.png"><link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<meta property="og:type" content="${ogType}"><meta property="og:site_name" content="Nexara Holidays"><meta property="og:locale" content="en_IN">
<meta property="og:url" content="${canonical}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${abs(hero.img || SITE.ogImage)}"><meta name="twitter:card" content="summary_large_image">
${ld.map(j => `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, "\\u003c")}</script>`).join("\n")}
<link rel="preconnect" href="https://fonts.googleapis.com"><link href="${FONTS}" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/nexara-base.css"><link rel="stylesheet" href="/assets/css/nexara-pages.css"><link rel="stylesheet" href="/assets/css/nexara-menu.css"><link rel="stylesheet" href="/assets/css/nexara-ui.css"><link rel="stylesheet" href="/assets/css/nexara-flat.css"><link rel="stylesheet" href="/assets/css/nexara-dest.css">${headExtra}
</head><body class="sub">
${header(path)}
<main id="main">
${hero.spot
  // spotlight header (destination, package and theme pages): facts beside a photo slider
  ? hero.spot(crumbHtml)
  : hero.img
  // GT-style header: title, then a large photo with the facts panel beside it
  ? `<section class="ph2"><div class="ph2w">${crumbHtml}<div class="ph2h">${scr ? `<span class="scr">${esc(scr)}</span>` : ""}<h1>${esc(h1)}</h1>${sub ? `<p>${sub}</p>` : ""}</div><div class="ph2g${heroAside ? "" : " one"}"><figure class="ph2f"><img src="${hero.img}" alt="${esc(h1)}" fetchpriority="high">${hero.credit?.license ? `<p class="pcred">${photoCredit(hero.credit)}</p>` : ""}</figure>${heroAside ? `<aside class="ph2a">${heroAside}</aside>` : ""}</div></div></section>`
  // the wave/hill/temple artwork only appears where the page sets a motif (destinations, regions, packages)
  : `<div class="pgh mo"${bg}>${hero.m ? MO[hero.m] : ""}${crumbHtml}${scr ? `<span class="scr">${esc(scr)}</span>` : ""}<h1>${esc(h1)}</h1>${sub ? `<p>${sub}</p>` : ""}</div>`}
${body}
</main>
${footer()}
<div id="prog"></div><div id="toast" role="status" aria-live="polite"></div>
<button class="btt" aria-label="Back to top"><svg viewBox="0 0 50 50"><circle cx="25" cy="25" r="23"/></svg>↑</button>
<button class="btn red enq" data-enq><i></i>Enquire now</button>
${WA_BTN}
<script src="/assets/js/nexara-pages.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.15.0/gsap.min.js" defer></script>
<script src="/assets/js/nexara-menu.js" defer></script>
<script src="/assets/js/nexara-ui.js" defer></script>
<script src="/assets/js/nexara-transition.js" defer></script>
</body></html>`;
}

/* ---------- components ---------- */
/** Spotlight header: an "at a glance" facts grid beside a photo slider (styles in nexara-dest.css, slider in nexara-pages.js).
    o = { eye, h1 (html), desc (html), label, facts: [[icon, label, value]], best, btns (html), slides: [{ img, cap }], g, m }.
    Returns a function of the breadcrumb html, which page() fills in. */
export const spotlight = o => crumbHtml => {
  const sl = o.slides || [], f = (o.facts || []).filter(r => r && r[2]);
  const scr = `<span class="spscr" aria-hidden="true">Explore<br>Experience<br>Travel Better</span>`;
  const media = sl.length
    ? `<div class="sps">${sl.map((s, i) => `<figure${i ? "" : ' class="on"'} data-cap="${esc(s.cap)}"><img src="${s.img}" alt="${esc(s.cap)}"${i ? ' loading="lazy"' : ' fetchpriority="high"'}></figure>`).join("")}${scr}<div class="spc"><b>${esc(sl[0].cap)}</b>${sl.length > 1 ? `<button type="button" aria-label="Next photo">${IC.arrow}</button>` : ""}</div></div>` +
      (sl.length > 1 ? `<div class="spdots">${sl.map((s, i) => `<button type="button" aria-label="Photo ${i + 1}: ${esc(s.cap)}"${i ? "" : ' class="on" aria-current="true"'}></button>`).join("")}</div>` : "")
    : `<div class="sps sp0"${o.g ? ` style="background:linear-gradient(135deg,${o.g})"` : ""}>${o.m ? MO[o.m] : ""}${scr}</div>`;
  return `<section class="spot"><div class="spw">${crumbHtml}<div class="spg"><div class="spl"><span class="spe">${esc(o.eye)}</span><h1>${o.h1}</h1>${o.desc ? `<p class="spd">${o.desc}</p>` : ""}` +
    (f.length ? `${o.label ? `<p class="spk">${esc(o.label)}</p>` : ""}<ul class="spf">${f.map(([ic, k, v]) => `<li><i>${IC[ic] || IC.star}</i><span><small>${esc(k)}</small><b>${esc(v)}</b></span></li>`).join("")}</ul>` : "") +
    `${o.best ? `<p class="spt">${IC.sun}<span>Best time to visit: <b>${esc(o.best)}</b></span></p>` : ""}<div class="spb">${o.btns}</div></div><div class="spr" data-sps>${media}</div></div></div></section>`;
};
export const sec = (eye, h2, inner, { id, cls = "", p } = {}) => `<section${id ? ` id="${id}"` : ""}${cls ? ` class="${cls}"` : ""}><div class="h">${eye ? `<span class="eye">${esc(eye)}</span>` : ""}<h2>${esc(h2)}</h2>${p ? `<p>${p}</p>` : ""}</div>${inner}</section>`;

/** Card linking to a page; v = {url, name, img|m+g, badge, loc, tags[], text, best, go, t(filter tags)} */
export const card = (v, i = 0) => `<a class="dc" href="${v.url}" data-t="${esc(v.t || "")}"><div class="dm" style="--g:${v.g || ""}">${media(v, v.name)}${v.badge ? `<span class="dn">${esc(v.badge)}</span>` : ""}${v.loc ? `<span class="dr">${IC.pin}${esc(v.loc)}</span>` : ""}</div><div class="db">${v.tags?.length ? `<div class="dcat">${v.tags.slice(0, 3).map(x => `<span>${esc(x)}</span>`).join("")}</div>` : ""}<h3>${esc(v.name)}</h3>${v.text ? `<p>${esc(v.text)}</p>` : ""}${v.best ? `<div class="dbest"><b>${esc(v.bestLabel || "Best for")}</b>${esc(v.best)}</div>` : ""}<span class="dgo">${esc(v.go || "Discover")} <i>→</i></span></div></a>`;
export const cards = (arr, cls = "") => arr.length ? `<div class="dgrid${cls ? " " + cls : ""}">${arr.map(card).join("")}</div>` : "";

export const faq = qa => qa.length ? `<div class="faq">${qa.map(([q, a]) => `<details><summary>${esc(q)}</summary><div class="a">${a}</div></details>`).join("")}</div>` : "";
export const tags = a => `<div class="tg">${a.map(x => `<span>${esc(x)}</span>`).join("")}</div>`;
export const dat = a => `<ul class="dat">${a.map(x => Array.isArray(x) ? `<li><b>${esc(x[0])}</b>${x[1] ? ` – ${esc(x[1])}` : ""}</li>` : `<li>${x}</li>`).join("")}</ul>`;
export const facts = a => `<div class="gl2">${a.filter(Boolean).map(([ic, b, s]) => `<div><i>${IC[ic] || IC.star}</i><b>${esc(b)}</b><span>${s}</span></div>`).join("")}</div>`;
export const linkList = (a, cls = "") => `<ul class="lnk${cls ? " " + cls : ""}">${a.map(([n, u, s]) => `<li><a href="${u}">${esc(n)}</a>${s ? `<small>${esc(s)}</small>` : ""}</li>`).join("")}</ul>`;
export const cta = (h, p, trip) => `<div class="cta"><span class="eye">Plan it with us</span><h2>${esc(h)}</h2><p>${esc(p)}</p><a class="btn" href="/custom-tour/" data-enq${trip ? ` data-trip="${esc(trip)}"` : ""}>Request a free quote →</a><a class="btn glass" href="https://wa.me/${SITE.wa}?text=${encodeURIComponent(`Hi Nexara Holidays, I would like to plan a trip${trip ? ": " + trip : ""}.`)}" target="_blank" rel="noopener">Chat on WhatsApp</a></div>`;
export const note = html => `<p class="note">${html}</p>`;
export const filterTabs = (opts) => `<div class="tabs ftabs" role="toolbar" aria-label="Filter">${opts.map(([v, n], i) => `<button type="button"${i ? "" : ' class="on"'} data-f="${v}">${esc(n)}</button>`).join("")}</div>`;

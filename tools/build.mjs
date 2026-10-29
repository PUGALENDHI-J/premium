// Static site generator for the content pages. Usage: node tools/build.mjs
// Reads content/*.mjs, renders through tools/lib/html.mjs templates and writes clean-URL folders
// (e.g. destinations/india/kerala/munnar/index.html) next to the hand-made index.html.
// Records that fail the quality gate are held back as drafts and listed in research/build-report.json.
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SITE } from "../content/site.mjs";
import { INDIA, IN_REGIONS, STATES, IN_CITIES } from "../content/india.mjs";
import { WORLD, W_REGIONS, COUNTRIES, W_CITIES } from "../content/world.mjs";
import { PK_IN } from "../content/packages-india.mjs";
import { PK_W } from "../content/packages-world.mjs";
import { SIGNATURE } from "../content/packages-signature.mjs";
import { TYPES } from "../content/tour-types.mjs";
import { SACRED, SACRED_GROUPS, SACRED_HUB } from "../content/sacred.mjs";
import { EXPERIENCES } from "../content/experiences.mjs";
import { buildExperiences, homeExperiences } from "./lib/exp.mjs";
import { GUIDES, GUIDE_CATS } from "../content/guides/index.mjs";
import { POSTS, CLUSTERS } from "../content/blog/index.mjs";
import { PAGES, FAQS, destOptions } from "../content/pages.mjs";
import { SERVICES, SERVICE_GROUPS, SERVICE_FAQ } from "../content/services.mjs";
import { COUNTRY_FACTS, INDIA_FACTS, INDIA_TZ, FACTS_REVIEWED } from "../content/country-facts.mjs";
import { ADD_STATES, ADD_IN_CITIES, ADD_W_REGIONS, ADD_COUNTRIES, ADD_W_CITIES, ADD_PK_IN, ADD_PK_W } from "../content/places-added.mjs";
import { esc, slugify, abs, list, IC, motifFor, page, sec, card, cards, faq, brush, tags, dat, facts, linkList, cta, note, filterTabs, setMenu, photoCredit, spotlight } from "./lib/html.mjs";
import { buildMenu, menuLinks, topbar } from "./lib/menu.mjs";
import { renderMd } from "./lib/md.mjs";

// destinations added later live in their own file; merge them before anything is built
for (const s of ADD_STATES) { STATES.push(s); IN_REGIONS.find(r => r.s == s.region).states.push(s.s) }
W_REGIONS.splice(W_REGIONS.findIndex(r => r.s == "south-asia") + 1, 0, ...ADD_W_REGIONS);
IN_CITIES.push(...ADD_IN_CITIES); COUNTRIES.push(...ADD_COUNTRIES); W_CITIES.push(...ADD_W_CITIES); PK_IN.push(...ADD_PK_IN); PK_W.push(...ADD_PK_W);

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = ROOT, MANIFEST = path.join(ROOT, "research", ".generated-files.json");
// destination photos: Veena World library (tools/vw_photos.py) and/or Wikimedia Commons (tools/fetch_photos.py), per SITE.photos
const readJson = f => existsSync(path.join(ROOT, "content", f)) ? JSON.parse(readFileSync(path.join(ROOT, "content", f), "utf8")) : {};
const VW_PHOTOS = readJson("photos-vw.json"), COMMONS_ALL = readJson("photos.json");
// a Commons photo is used only when the Wikipedia article it came from names the same attraction (or place, for a place photo);
// loose matches such as a nearby park or a district article are dropped so a card never shows the wrong sight;
// a photo picked by hand in photo-overrides.json (p.q) is always kept
const GEN = new Set("the of and in at on to de la le du da del national park city old new town temple island islands beach lake fort palace district state river valley hill hills mount museum street market sri saint st san jungle safari safaris walk walks tour tours drive drives game zone view views point cruise boat ride rides trip visit area region list day night big five centre center square road garden gardens bay sea coast falls waterfall wildlife sanctuary reserve camp trek trail india".split(" "));
const tokOf = s => String(s).toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").split(/[^a-z0-9]+/).filter(x => x.length > 2 && !GEN.has(x));
const squash = s => String(s).toLowerCase().normalize("NFKD").replace(/[^a-z0-9]/g, "");
const sameSight = (name, page) => { const a = tokOf(name), b = tokOf(page); return (squash(page).length > 3 && (squash(name).includes(squash(page)) || squash(page).includes(squash(name)))) || a.some(x => b.some(y => x == y || (x.length > 4 && y.length > 4 && (x.startsWith(y.slice(0, 5)) || y.startsWith(x.slice(0, 5)))))) };
// photos checked by eye are listed in photo-overrides.json "_verified"
const VERIFIED = new Set(readJson("photo-overrides.json")._verified || []);
const COMMONS = Object.fromEntries(Object.entries(COMMONS_ALL).filter(([k, p]) => { const [pl, at] = k.split("--"); return p.q || VERIFIED.has(k) || sameSight((at || pl).replace(/-/g, " "), p.page || "") }));
// topic photos for card sections (money, water, trekking, ...): tools/fetch_topic_photos.py
const TOPIC = readJson("photos-topics.json");
const PHOTOS = SITE.photos == "commons" ? COMMONS : SITE.photos == "vw+commons" ? { ...COMMONS, ...VW_PHOTOS } : VW_PHOTOS;
const report = { built_at: new Date().toISOString(), drafts: [], warnings: [], missingLinks: [], counts: {} };
const warn = m => report.warnings.push(m);
const draft = (kind, id, why) => report.drafts.push({ kind, id, why });
const words = s => String(s || "").split(/\s+/).filter(w => /[a-z]/i.test(w)).length;

/* ---------- 1. base stylesheet: extracted verbatim from index.html ---------- */
const indexHtml = readFileSync(path.join(ROOT, "index.html"), "utf8");
const baseCss = indexHtml.match(/<style>([\s\S]*?)<\/style>/)[1];
mkdirSync(path.join(ROOT, "assets/css"), { recursive: true });
writeFileSync(path.join(ROOT, "assets/css/nexara-base.css"), "/* GENERATED by tools/build.mjs from the <style> block in index.html. Do not edit; edit index.html. */\n" + baseCss.trim() + "\n");

/* ---------- 2. destination graph ---------- */
const N = new Map(); // slug -> node
function addNode(n) { if (N.has(n.s)) throw new Error("duplicate destination slug " + n.s); N.set(n.s, n); return n }
const hubIN = { kind: "hub", s: "india", n: "India", url: "/destinations/india/" };
const hubW = { kind: "hub", s: "international", n: "International", url: "/destinations/international/" };
const inReg = IN_REGIONS.map(r => ({ ...r, kind: "inregion", url: `/destinations/india/${r.s}/` }));
const wReg = W_REGIONS.map(r => addNode({ ...r, kind: "wregion", url: `/destinations/international/${r.s}/` }));
for (const s of STATES) addNode({ ...s, kind: "state", dom: true, url: `/destinations/india/${s.s}/`, region: inReg.find(r => r.states.includes(s.s)) });
for (const c of COUNTRIES) { const r = N.get(c.rg); if (!r) throw new Error("country region " + c.rg); addNode({ ...c, kind: "country", dom: false, url: `${r.url}${c.s}/`, region: r }) }
for (const c of [...IN_CITIES.map(x => ({ ...x, dom: true })), ...W_CITIES.map(x => ({ ...x, dom: false }))]) {
  const p = N.get(c.p); if (!p) throw new Error(`city ${c.s} parent ${c.p}`);
  addNode({ ...c, kind: "city", url: `${p.url}${c.s}/`, parent: p });
}
for (const r of inReg) for (const s of r.states) if (!N.has(s)) throw new Error("region state " + s);
const smOf = img => img.replace(/\/([^/]+)$/, "/sm/$1");
for (const n of N.values()) { const ph = PHOTOS[n.s]; if (ph && !n.img) { n.img = ph.img; n.sm = smOf(ph.img); n.photo = ph } }
// regions borrow the photo of their first state or country that has one
for (const r of [...inReg, ...wReg]) { const kid = (r.kind == "inregion" ? r.states : COUNTRIES.filter(c => c.rg == r.s).map(c => c.s)).map(x => N.get(x)).find(x => x?.photo); if (kid) Object.assign(r, { img: kid.img, sm: kid.sm, photo: kid.photo }) }
const isPlace = n => n.kind == "city" || n.self; // a place with attractions
const top = n => n.kind == "city" ? n.parent : n; // state or country
const kids = p => [...N.values()].filter(n => n.kind == "city" && n.parent === p);
const placesIn = p => p.self ? [p] : kids(p);
// a related photo for a place with none of its own: one of its sights, a place inside it, then its state or country
const relImg = n => { for (const [a] of n.a || []) { const ph = PHOTOS[`${n.s}--${slugify(a)}`]; if (ph) return { img: ph.img, credit: ph } }
  for (const k of N.values()) if (k.parent === n && k.img && !k.draft) return { img: k.img, sm: k.sm, credit: k.photo };
  for (let p = n.parent; p; p = p.parent) if (p.img) return { img: p.img, sm: p.sm, credit: p.photo };
  return null };
const vis = n => {
  if (n.img) return { img: n.img, sm: n.sm, credit: n.photo };
  const r = relImg(n); if (r) return r;
  const mo = motifFor(n.t || (n.k || []).join(" "), n.s);
  return { m: mo.m, g: mo.g };
};
const hav = (a, b) => { if (!a?.ll || !b?.ll) return 9999; const R = 6371, r = x => x * Math.PI / 180, [la1, lo1] = a.ll, [la2, lo2] = b.ll, d = Math.sin(r(la2 - la1) / 2) ** 2 + Math.cos(r(la1)) * Math.cos(r(la2)) * Math.sin(r(lo2 - lo1) / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(d)) };

// quality gate for places
function placeOk(n) {
  const why = [];
  if (words(n.d) < 25) why.push("intro under 25 words");
  if (!n.a || n.a.length < 4) why.push("fewer than 4 attractions");
  if (!n.ac || n.ac.length < 3) why.push("fewer than 3 activities");
  if (!n.bt) why.push("no best time");
  if (!n.r || n.r.length < 2) why.push("no how-to-reach");
  if (!n.ll) why.push("no coordinates");
  if (why.length) { draft("destination", n.s, why.join("; ")); n.draft = true }
  return !n.draft;
}
for (const n of N.values()) if (isPlace(n)) placeOk(n);
for (const n of N.values()) if (n.kind == "state" || n.kind == "country") { if (words(n.d) < 30) { draft("destination", n.s, "overview under 30 words"); n.draft = true } }

// countries where we have a tied-up partner company (SITE.partners lists cities and countries)
const PARTNER_TOPS = new Set(SITE.partners.map(([s]) => N.get(s)).filter(n => n && !n.draft).map(top));

/* ---------- 3. packages ---------- */
const THEME_LABEL = Object.fromEntries(TYPES.map(t => [t.s, t.n]));
const SPOT_LABEL = Object.fromEntries(TYPES.flatMap(t => (t.spots || []).map(([n]) => ["kid-" + slugify(n), n])));
const PK = [];
const pkgId = s => "NX-" + ([...s].reduce((h, c) => (h * 33 ^ c.charCodeAt(0)) >>> 0, 5381)).toString(36).toUpperCase().slice(0, 6);
function addPkg(dom, [home, name, stops, th, sum, opt = {}]) {
  const H = N.get(home); if (!H) { warn(`package ${name}: unknown home ${home}`); return }
  const st = stops.map(([s, n]) => [N.get(s), n]);
  const bad = stops.filter(([s]) => !N.get(s) || !isPlace(N.get(s)));
  const nights = stops.reduce((a, [, n]) => a + n, 0), days = nights + 1;
  const slug = opt.slug || `${slugify(name)}-${days}-days`;
  const p = { dom, home: H, name, slug, stops: st, nights, days, sum, opt, id: pkgId(slug), url: `/packages/${dom ? "india" : "international"}/${H.s}/${slug}/` };
  const themes = new Set(th.split(/\s+/).filter(Boolean));
  if (days <= 4) themes.add("short-breaks");
  if (dom && days <= 3) themes.add("weekend-getaways");
  if (days >= 10) themes.add("long-stays");
  if (new Set(st.filter(x => x[0]).map(([n]) => top(n).s)).size > 1 && !dom) themes.add("multi-country-tours");
  p.themes = [...themes];
  const why = [];
  if (bad.length) why.push("unknown or draft stops: " + bad.map(b => b[0]).join(","));
  if (words(sum) < 12) why.push("summary under 12 words");
  if (st.some(([n]) => n && n.draft)) why.push("includes a draft destination");
  for (const t of p.themes) if (!THEME_LABEL[t]) why.push("unknown theme " + t);
  if (why.length) { draft("package", slug, why.join("; ")); return }
  if (PK.some(q => q.url == p.url)) { draft("package", slug, "duplicate URL"); return }
  const sig = st.map(([n, k]) => n.s + k).join(">");
  const twin = PK.find(q => q.stops.map(([n, k]) => n.s + k).join(">") == sig);
  if (twin) { draft("package", slug, "same route and nights as " + twin.slug); return }
  PK.push(p);
}
PK_IN.forEach(x => addPkg(true, x));
PK_W.forEach(x => addPkg(false, x));
// signature departures already sold on the home page (real dates and inclusions)
for (const s of SIGNATURE) {
  const H = N.get(s.home), st = s.stops.map(([x, n]) => [N.get(x), n]);
  PK.push({ ...s, dom: false, home: H, stops: st, nights: s.nights, days: s.nights + 1, id: s.id, sig: true, themes: s.themes, url: `/packages/international/${H.s}/${s.slug}/` });
}
const pkgsAt = n => PK.filter(p => p.stops.some(([x]) => x === n));
const pkgsIn = t => PK.filter(p => p.home === t || p.stops.some(([x]) => top(x) === t));
const pkgsOfType = s => PK.filter(p => p.themes.includes(s));
// a package that stops anywhere in Tamil Nadu
const inTN = p => p.stops.some(([n]) => n && top(n).s == "tamil-nadu");

/* ---------- 3b. site menu: generated pages and the home page share it ---------- */
const MENU = buildMenu({ N, PK, TYPES, inReg, SERVICES, SERVICE_GROUPS, SACRED, SACRED_GROUPS, EXPERIENCES });
setMenu(MENU);
{
  // index.html is hand-made; only the regions between the MENU markers are rewritten
  let home = indexHtml;
  const put = (name, html) => { const rx = new RegExp(`(<!--${name}-->)[\\s\\S]*?(<!--/${name}-->)`); if (!rx.test(home)) throw new Error(`index.html: missing <!--${name}--> markers`); home = home.replace(new RegExp(rx.source, "g"), (_, a, b) => a + html + b) };
  put("TOPBAR", topbar());
  put("MENU", menuLinks(MENU, "/", { spa: true }));
  put("EXPERIENCES", homeExperiences(TOPIC));
  put("DESTS", destOptions());
  if (home != indexHtml) writeFileSync(path.join(ROOT, "index.html"), home);
}

/* ---------- 4. guides & blog: resolver for [[slug]] links ---------- */
const TYPE_BY = Object.fromEntries(TYPES.map(t => [t.s, t]));
const resolveSlug = k => {
  if (k.startsWith("t:")) { const t = TYPE_BY[k.slice(2)]; return t && !t.draft ? { url: `/tour-types/${t.s}/`, name: t.n } : null }
  if (k.startsWith("g:")) { const g = GUIDES.find(x => x.s == k.slice(2)); return g ? { url: `/travel-guides/${g.s}/`, name: g.title } : null }
  if (k.startsWith("b:")) { const b = POSTS.find(x => x.s == k.slice(2)); return b ? { url: `/blog/${b.s}/`, name: b.title } : null }
  if (k.startsWith("s:")) { const v = SERVICES.find(x => x.s == k.slice(2)); return v ? { url: `/services/${v.s}/`, name: v.n } : null }
  if (k.startsWith("p:")) { const p = PK.find(x => x.slug == k.slice(2)); return p ? { url: p.url, name: p.name } : null }
  const n = N.get(k); return n && !n.draft ? { url: n.url, name: n.n } : null;
};
function article(a, kind) {
  const missing = [];
  const r = renderMd(a.body, resolveSlug, m => missing.push(m));
  if (missing.length) report.missingLinks.push({ page: kind + ":" + a.s, missing });
  const internal = (r.html.match(/href="\//g) || []).length;
  const why = [];
  const min = 220; // body words; the averages are reported in build-report.json
  if (r.words < min) why.push(`only ${r.words} words (minimum ${min})`);
  if (internal < 2) why.push("fewer than 2 internal links");
  if (!a.desc || a.desc.length < 50) why.push("missing meta description");
  if (a.draft) why.push("marked draft by editor");
  (report.articleWords[kind] ||= []).push(r.words);
  if (why.length) { draft(kind, a.s, why.join("; ")); return null }
  return r;
}
report.articleWords = {};
const G = GUIDES.map(g => ({ ...g, r: article(g, "guide") })).filter(g => g.r).map(g => ({ ...g, url: `/travel-guides/${g.s}/` }));
const B = POSTS.map(b => ({ ...b, r: article(b, "blog") })).filter(b => b.r).map(b => ({ ...b, url: `/blog/${b.s}/` }));
const relTo = (arr, n) => arr.filter(a => (a.rel || []).includes(n.s) || (n.kind == "city" && (a.rel || []).includes(n.parent.s)));

/* ---------- 4b. one photo per page ---------- */
// cards, header slides and galleries pick photos independently, so a page could show one picture several times.
// Each photo is kept once per page (galleries first, then header slides, then cards in page order); a repeat is swapped
// for an unused photo of the card's own package stops or place, then its state/country, its region, then all of India
// or abroad. A repeated topic picture becomes its icon.
const canon = src => src.replace(/\/sm\/([^/]+)$/, "/$1");
const PH_INFO = new Map(), PH_OF = new Map(); // full img -> { n, cap, of }; place slug -> [full img]
// Veena World replaces the Commons photo of a place; the Commons one is kept here as a spare
const SPARE = SITE.photos == "vw+commons" ? Object.entries(COMMONS).filter(([k]) => !k.includes("--") && VW_PHOTOS[k]).map(([k, p]) => [k, p]) : [];
for (const [k, p] of [...Object.entries(PHOTOS).sort(([a], [b]) => a.includes("--") - b.includes("--")), ...SPARE]) {
  const [pl, at] = k.split("--"), n = N.get(pl), a = at && (n?.a || []).find(([x]) => slugify(x) == at)?.[0];
  if (!n || n.draft || (at && !a) || PH_INFO.has(p.img) || !existsSync(path.join(ROOT, p.img))) continue;
  PH_INFO.set(p.img, { n, of: n.n, cap: a ? `${a} – ${n.n}` : n.kind == "city" ? `${n.n}, ${n.parent.n}` : n.n });
  if (!PH_OF.has(n.s)) PH_OF.set(n.s, []);
  PH_OF.get(n.s).push(p.img);
}
const NEAR = new Map(), BY_URL = new Map([...N.values()].map(n => [n.url, n])), PK_BY_URL = new Map(PK.map(p => [p.url, p]));
const nearImgs = n => {
  if (!NEAR.has(n.s)) {
    // stay inside the same state or country (a region tile: its own countries), so a card never shows another country's photo;
    // with nothing unused left, the repeat is kept rather than borrowing a picture of somewhere else
    const t = top(n);
    const order = n.kind == "wregion" || n.kind == "inregion" ?[n, ...[...N.values()].filter(x => top(x).region === n)] : [n, t, ...kids(t)];
    NEAR.set(n.s, [...new Set(order.flatMap(x => PH_OF.get(x.s) || []))]);
  }
  return NEAR.get(n.s);
};
const smIf = img => existsSync(path.join(ROOT, smOf(img))) ? smOf(img) : img;
// brush-label photo tiles: [slug, optional short name]
const brushOf = list => list.map(x => Array.isArray(x) ? x : [x]).map(([s, name, sub]) => { const n = typeof s == "string" ? N.get(s) : s; return n && !n.draft && n.img ? { url: n.url, name: (name || n.n).replace(/\s*\(.*?\)/g, ""), img: smIf(n.img), sub } : null }).filter(Boolean);
// tied-up partner destinations (SITE.partners) as brush tiles: the home page passes "rv" for its reveal animation
const partnerSec = (rv = "") => `<section class="brhome" id="partners"><div class="h${rv ? " " + rv : ""}"><span class="eye">Our partner network</span><h2>Tied-up partners on the ground</h2><p>We work with our own partner companies in these destinations, so guides, drivers and hotels are arranged by people who live there.</p></div>${brush(brushOf(SITE.partners))}<p class="brall"><a class="btn ghost2" href="/destinations/international/central-asia/">Central Asia &amp; the Caucasus →</a></p></section>`;
const POP_INTL = ["maldives", "bali", "dubai", "switzerland", "thailand", "singapore", "paris", "japan", "santorini", "mauritius", "london", "vietnam"];
const POP_IN = ["kerala", ["jammu-and-kashmir", "Kashmir"], "goa", "ladakh", "munnar", "ooty", "manali", "jaipur", ["andaman-and-nicobar", "Andaman"], "rishikesh", "darjeeling", "coorg"];
// No unused photo of the place is left on this page. Optional cards (attractions, brush tiles, gallery photos) are
// dropped; a package or place card takes an unused photo of its travel style or kind of place; an article or
// topic card loses just the picture. Nothing shows the same photo twice.
const KIND_TOPIC = [[/pilgrimage|temple/, ["tt-pilgrimage-tours", "temple", "temple-2"]], [/beach|island/, ["tt-beach-holidays", "beach", "beach-2", "beach-3", "sunset-2", "dive"]],
  [/hill|mountain|snow/, ["tt-hill-stations", "naturewalk-2", "trek", "trek-2", "trek-3", "outdoors-2", "drive-2"]], [/wildlife|safari/, ["tt-wildlife-safaris", "safari", "safari-2", "safari-3"]],
  [/heritage|culture|city/, ["tt-cultural-holidays", "walk", "walk-2", "walk-3", "tt-photography-tours"]], [/adventure|trek|lake|nature|waterfall/, ["tt-adventure", "outdoors", "outdoors-3", "naturewalk", "naturewalk-3", "rafting"]]];
function noPhotoLeft(html, o, pk, at, used, edits) {
  const near = cls => { const k = html.lastIndexOf(cls, o.i); return k >= 0 && k > html.lastIndexOf("</section>", o.i) ? k : -1 };
  const cut = (s, e) => edits.push([s, e, ""]);
  const box = html.lastIndexOf('<div class="ipc', o.i), card = html.lastIndexOf("<div><figure>", o.i);
  if (box >= 0 && card > box && html.lastIndexOf("</section>", o.i) < box) return cut(card, html.indexOf("</div></div>", o.i) + 12);
  const brt = html.lastIndexOf('<a class="brt"', o.i); if (brt >= 0 && html.indexOf("</a>", brt) > o.i) return cut(brt, html.indexOf("</a>", o.i) + 4);
  if (o.kind == 0) { const f = html.lastIndexOf("<figure", o.i); return cut(f, html.indexOf("</figure>", o.i) + 9) }
  const fig = html.lastIndexOf('<figure class="cph"', o.i); if (fig >= 0 && html.indexOf("</figure>", fig) > o.i) return cut(fig, html.indexOf("</figure>", o.i) + 9);
  if (/class="aci"/.test(o.tag)) return cut(o.i, o.i + o.tag.length);
  const kind = (pk ? pk.stops.map(([n]) => n.t).join(" ") : at?.t) || "";
  const tags = [...KIND_TOPIC.filter(([rx]) => rx.test(kind)).flatMap(([, k]) => k.filter(x => !x.startsWith("tt-"))), ...(pk ? pk.themes.map(t => "tt-" + t) : [])];
  const alt = [...tags, ...KIND_TOPIC.flatMap(([, k]) => k).filter(x => !x.startsWith("tt-")), ...KIND_TOPIC.map(([, k]) => k[0])].map(k => TOPIC[k]?.img).find(x => x && !used.has(canon(x)));
  if (alt) { used.add(canon(alt)); edits.push([o.i, o.i + o.tag.length, o.tag.replace(`src="${o.src}"`, `src="${alt}"`)]) }
  else if (near('class="dc"') < 0 && near('class="tpc"') < 0) cut(o.i, o.i + o.tag.length);
}
function onePhotoEach(html) {
  const occ = [], rx = /<img\b[^>]*?\ssrc="(\/assets\/(?:photos|dest|hero|exp)\/[^"]+|\/assets\/img-[^"]+)"[^>]*>/g;
  for (let m; (m = rx.exec(html));) {
    const i = m.index, aOpen = html.lastIndexOf("<a ", i), aTag = aOpen > html.lastIndexOf("</a>", i) ? html.slice(aOpen, html.indexOf(">", aOpen) + 1) : "";
    const kind = / data-lb/.test(aTag) ? 0 : html.lastIndexOf("<div", i) == html.lastIndexOf('<div class="sps">', i) ? 1 : 2;
    occ.push({ i, tag: m[0], src: m[1], key: canon(m[1]), kind, aOpen, aTag, href: aTag.match(/href="([^"]+)"/)?.[1] });
  }
  const used = new Set(), edits = [];
  for (const o of [...occ].sort((a, b) => a.kind - b.kind || a.i - b.i)) {
    if (!used.has(o.key)) { used.add(o.key); continue }
    if (o.src.startsWith("/assets/photos/t/")) {
      // repeated topic photo: another photo of the same topic (planner, planner-2, ...), else the icon
      const base = o.src.match(/\/t\/(.+?)(-\d)?\.webp$/)[1], near = OUT_NEAR[base] ? [...OUT_NEAR[base], "outdoors"].filter(k => k != "heritage") : [];
      const alt = [base, ...near].flatMap(k => ["", "-2", "-3", "-4", "-5", "-6"].map(v => TOPIC[k + v]?.img)).find(x => x && !used.has(canon(x)));
      if (alt) { used.add(canon(alt)); edits.push([o.i, o.i + o.tag.length, o.tag.replace(`src="${o.src}"`, `src="${alt}"`)]); continue }
      const f =html.lastIndexOf('<figure class="cph"', o.i), ic = html.slice(f, o.i).match(/data-ic="([^"]+)"/)?.[1], end = html.indexOf("</figure>", o.i) + 9;
      if (ic) edits.push([f, end, `<i>${IC[ic] || IC.tip}</i>`]);
      continue;
    }
    // repeated sight photo on an activity card: use the activity's topic photo rather than an unrelated nearby place
    const fig = html.lastIndexOf('<figure class="cph"', o.i), tk = fig >= 0 && html.indexOf("</figure>", fig) > o.i ? html.slice(fig, o.i).match(/data-t="([^"]+)"/)?.[1] : null;
    if (tk) {
      const alt = ["", "-2", "-3", "-4", "-5", "-6"].map(v => TOPIC[tk + v]?.img).find(x => x && !used.has(canon(x)));
      if (alt) { used.add(canon(alt)); edits.push([o.i, o.i + o.tag.length, o.tag.replace(`src="${o.src}"`, `src="${alt}"`)]) }
      else { const ic = html.slice(fig, o.i).match(/data-ic="([^"]+)"/)?.[1]; edits.push([fig, html.indexOf("</figure>", o.i) + 9, `<i>${IC[ic] || IC.compass}</i>`]) }
      continue;
    }
    const pk = PK_BY_URL.get(o.href), at = BY_URL.get(o.href);
    const seeds = pk ? pk.stops.map(([n]) => n) : at ? [at] : PH_INFO.get(o.key) ? [PH_INFO.get(o.key).n] : [];
    const pick = [...new Set(seeds.flatMap(n => PH_OF.get(n.s) || [])), ...(seeds[0] ? nearImgs(seeds[0]) : [])].find(x => !used.has(x));
    if (!pick) { noPhotoLeft(html, o, pk, at, used, edits); continue }
    used.add(pick);
    const old = PH_INFO.get(o.key), nu = PH_INFO.get(pick), src = o.src.includes("/sm/") ? smIf(pick) : pick;
    let tag = o.tag.replace(`src="${o.src}"`, `src="${src}"`);
    if (old) tag = tag.replace(/alt="([^"]*)"/, (s, alt) => alt == esc(old.cap) ? `alt="${esc(nu.cap)}"` : alt == esc(old.of) || alt.startsWith(esc(old.of) + ",") ? `alt="${esc(nu.of)}"` : s);
    edits.push([o.i, o.i + o.tag.length, tag]);
    if (o.kind == 0) edits.push([o.aOpen, o.aOpen + o.aTag.length, o.aTag.replace(`href="${o.src}"`, `href="${pick}"`)]);
    if (o.kind == 1) {
      const f = html.lastIndexOf("<figure", o.i), fTag = html.slice(f, o.i);
      edits.push([f, o.i, fTag.replace(/data-cap="[^"]*"/, `data-cap="${esc(nu.cap)}"`)]);
      if (fTag.includes('class="on"')) { const b = html.indexOf('<div class="spc"><b>', o.i) + 20; edits.push([b, html.indexOf("</b>", b), esc(nu.cap)]) }
    }
    // place label on an attraction card's photo
    const after = o.i + o.tag.length, lab = html.slice(after, after + 600).match(/^<span>(<svg[\s\S]*?<\/svg>)([^<]*)<\/span>/);
    if (lab && old && lab[2] == esc(old.of)) edits.push([after, after + lab[0].length, `<span>${lab[1]}${esc(nu.of)}</span>`]);
  }
  for (const [s, e, t] of edits.sort((a, b) => b[0] - a[0])) html = html.slice(0, s) + t + html.slice(e);
  return html;
}

/* ---------- 5. writer ---------- */
const written = [], sitemap = { pages: [], destinations: [], packages: [], guides: [], blog: [] };
function emit(urlPath, html, group, { index = true } = {}) {
  const file = urlPath.endsWith("/") ? path.join(OUT, urlPath, "index.html") : path.join(OUT, urlPath);
  if (html.includes("<main")) html = onePhotoEach(html);
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, html);
  written.push(path.relative(ROOT, file).replace(/\\/g, "/"));
  if (index && group) sitemap[group].push(urlPath);
}

/* ---------- helpers for cards ---------- */
const placeCard = n => ({ url: n.url, name: n.n, ...vis(n), loc: n.kind == "city" ? n.parent.n : (n.region?.n || ""), tags: (n.t || "").split(" ").filter(Boolean).map(x => x[0].toUpperCase() + x.slice(1)), text: firstSentence(n.d), best: n.b, t: n.t || "" });
const topCard = n => ({ url: n.url, name: n.n, ...vis(n), loc: n.region?.n || (n.dom ? "India" : ""), tags: (n.k || []).slice(0, 3), text: firstSentence(n.d), best: n.bt?.[0], bestLabel: "Best time", go: "Explore" });
const pkgCard = p => ({ url: p.url, name: p.name, ...pkgVis(p), badge: `${p.days}D / ${p.nights}N`, loc: p.stops.map(([n]) => n.n).filter((v, i, a) => a.indexOf(v) == i).slice(0, 4).join(" · "), tags: p.themes.filter(t => !["short-breaks", "long-stays", "weekend-getaways", "private-tours"].includes(t)).slice(0, 2).map(t => THEME_LABEL[t]), text: p.sum, go: "View itinerary", t: p.themes.join(" ") + (p.dom ? " india" : " international") + (inTN(p) ? " tamil-nadu" : "") });
// package photo: varied per package (seeded by its slug) from its stops' own photos and their attraction photos,
// so packages sharing a stop don't all show the same picture
const usedPkgImg = new Map();
function pkgVis(p) {
  if (p.img) return { img: p.img };
  if (usedPkgImg.has(p.slug)) return usedPkgImg.get(p.slug);
  const pool = p.stops.flatMap(([n]) => [n.img && { img: n.img, sm: n.sm, credit: n.photo }, ...(n.a || []).map(([a]) => PHOTOS[`${n.s}--${slugify(a)}`]).filter(Boolean).map(ph => ({ img: ph.img, credit: ph }))]).filter(Boolean);
  let v;
  if (pool.length) { const h = [...p.slug].reduce((x, c) => (x * 31 + c.charCodeAt(0)) >>> 0, 7); v = pool[h % pool.length] }
  else { const r = p.stops.map(([n]) => relImg(n)).find(Boolean); if (r) v = r; else { const mo = motifFor(p.stops.map(([n]) => n.t).join(" "), p.slug); v = { m: mo.m, g: mo.g } } }
  usedPkgImg.set(p.slug, v);
  return v;
}
// "1 day", "1–2 days", "3 days"
const daysTxt = d => d + (d == "1" ? " day" : " days");
function firstSentence(s = "") { const m = String(s).match(/^.*?[.!?](\s|$)/); return (m ? m[0] : s).trim() }
const monthsOf = n => n.bt?.[0] || "";
// article photo: its own; else the related destination its title names; else its first related destination with a photo;
// else a destination photo picked by its slug (decorative)
const ALL_IMG = [...new Set(Object.values(PHOTOS).map(p => p.img))];
const reEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const artImg = a => {
  if (a.img) return a.img;
  const h = [...(a.slug || a.url)].reduce((x, c) => (x * 31 + c.charCodeAt(0)) >>> 0, 7);
  const rel = (a.rel || []).map(s => N.get(s)).filter(Boolean).map(n => [n, n.img || top(n)?.img]).filter(([, im]) => im);
  const named = rel.find(([n]) => new RegExp(`\\b${reEsc(n.n.replace(/\s*\(.*?\)/g, ""))}\\b`, "i").test(a.title || ""));
  return named ? named[1] : rel.length ? rel[0][1] : ALL_IMG[h % ALL_IMG.length];
};
const artCards = (arr, label) => arr.length ? `<div class="acards ph">${arr.map(a => `<a class="acard" href="${a.url}"><img class="aci" src="${artImg(a)}" alt="" loading="lazy"><small>${esc(label(a))}</small><h3>${esc(a.title)}</h3><p>${esc(a.desc)}</p><span>Read →</span></a>`).join("")}</div>` : "";
const quoteBox = (trip, extra = "") => `<div class="box"><h3>Plan this trip</h3><p class="quote-p">Request a customised quote</p><p class="quote-s">Prices depend on dates, hotel category and group size, so we quote each trip individually.</p>${extra}<a class="btn red" href="/custom-tour/" data-enq data-trip="${esc(trip)}">Request a quote</a><a class="btn ghost2" href="https://wa.me/${SITE.wa}?text=${encodeURIComponent("Hi Nexara Holidays, I would like a quote for: " + trip)}" target="_blank" rel="noopener">${IC.wa} WhatsApp us</a><a class="btn ghost2" href="tel:${SITE.tel}">${IC.call} Call ${SITE.phone}</a></div>`;
// facts panel beside the header photo (GT style): big value, small label, then action buttons
const heroFacts = (rows, trip, { packages = false, note = "" } = {}) => `<div class="hf">${rows.filter(r => r && r[1]).map(([k, v, wide]) => `<div${wide ? ' class="hfw"' : ""}><b>${esc(v)}</b><small>${esc(k)}</small></div>`).join("")}</div>${note ? `<p class="hfn">${note}</p>` : ""}<div class="hfb"><a class="btn red" href="/custom-tour/" data-enq data-trip="${esc(trip)}">Request a quote</a>${packages ? `<a class="btn ghost2" href="#packages">View packages</a>` : `<a class="btn ghost2" href="https://wa.me/${SITE.wa}?text=${encodeURIComponent("Hi Nexara Holidays, I would like a quote for: " + trip)}" target="_blank" rel="noopener">WhatsApp us</a>`}</div>`;
const kv = rows => `<dl class="kv">${rows.filter(r => r && r[1]).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${v}</dd></div>`).join("")}</dl>`;
const crumbsOf = n => {
  const c = [["Home", "/"], ["Destinations", "/destinations/"]];
  if (n.dom) c.push(["India", "/destinations/india/"]); else { c.push(["International", "/destinations/international/"]); }
  const t = top(n);
  if (!n.dom && t.region) c.push([t.region.n, t.region.url]);
  if (n.kind == "city") c.push([t.n, t.url]);
  c.push([n.n, n.url]);
  return c;
};
const destLd = n => ({ "@context": "https://schema.org", "@type": "TouristDestination", name: n.n, description: firstSentence(n.d), url: abs(n.url), ...(n.ll ? { geo: { "@type": "GeoCoordinates", latitude: n.ll[0], longitude: n.ll[1] } } : {}), containedInPlace: { "@type": n.kind == "city" ? (n.dom ? "State" : "Country") : "Country", name: n.kind == "city" ? n.parent.n : (n.dom ? "India" : n.n) } });

/* ---------- 6. place sections (city pages and self-contained states/countries) ---------- */
// attractions with a licensed photo become a gallery; the rest stay a list
function attractions(n) {
  const all = n.a.map(([a, note]) => [a, note, PHOTOS[`${n.s}--${slugify(a)}`]]), shot = all.filter(x => x[2]), rest = all.filter(x => !x[2]);
  const gal = shot.length ? `<div class="gal">${shot.map(([a, note, p]) => `<figure><a href="${p.img}" data-lb data-cap="${esc(a)}"><img src="${p.img}" alt="${esc(a)}, ${esc(n.n)}" loading="lazy" width="960" height="640"></a><figcaption><b>${esc(a)}</b><span>${esc(note)}</span>${p.license ? `<small>${photoCredit(p)}</small>` : ""}</figcaption></figure>`).join("")}</div>` : "";
  return gal + (rest.length ? itemCards(rest.map(([a, note]) => ({ name: a, note, at: n }))) : "");
}
const photoStrip = places => { const ps = places.filter(n => n.img).slice(0, 4); return ps.length > 1 ? `<div class="pstrip">${ps.map(n => `<a href="${n.url}"><img src="${n.img}" alt="${esc(n.n)}" loading="lazy"><span>${esc(n.n)}</span></a>`).join("")}</div>` : "" };
/* ---------- 7. destination pages: one template for places, states and countries ----------
   Every section is built from the destination's own record (content/*.mjs + content/country-facts.mjs).
   A section is left out when the destination has no data for it; nothing is filled with generic text. */
const factsOf = n => n.dom ? INDIA_FACTS : COUNTRY_FACTS[top(n).s] || null;
const placesOf = n => isPlace(n) ? [n] : placesIn(n).filter(x => !x.draft);
const pkgsFor = n => isPlace(n) && n.kind == "city" ? pkgsAt(n) : pkgsIn(n);
const RX = {
  wild: /national park|wildlife|sanctuary|safari|game|reserve|bird|tiger|elephant|rhino|whale|dolphin|lemur|turtle|penguin|leopard|lion|zoo|marine|reef|migration|crater floor/i,
  nature: /lake|falls|waterfall|valley|beach|peak|mountain|glacier|forest|garden|island|canyon|gorge|lagoon|cliffs?|meadow|hills?\b|cave|river|coast|dunes?|desert|fjord|volcano|terraces/i,
  culture: /temple|fort|palace|museum|church|cathedral|mosque|monastery|old town|old city|heritage|market|bazaar|tomb|castle|ruins|square|quarter|basilica|shrine|stupa|gompa|dzong|haveli|ghat|abbey|citadel|medina|souq|souk|mahal|memorial|gallery|theatre|library|mansion|village|wat\b|pagoda|cathedral|synagogue|amphitheatre|colosseum|acropolis/i,
  cultAct: /festival|cooking|market|dance|show|craft|workshop|music|ceremony|aarti|darshan|tasting|food|shopping|performance|lantern|heritage|museum|puja|parade|carnival|tea\b|wine/i,
  outdoor: /trek|hik|raft|kayak|div(e|ing)|snorkel|ski|cycl|bik|camp|safari|boat|cruise|paraglid|surf|climb|zip|jeep|cable car|gondola|horse|swim|beach|sunrise|sunset|drive|sail|canoe|fishing|balloon|ropeway|houseboat|shikara|game drive|walk/i,
};
const PERMIT = new Set(["arunachal-pradesh", "nagaland", "manipur", "sikkim", "ladakh", "lakshadweep", "andaman-and-nicobar"]);
const DEPART = ["Chennai", "Bengaluru", "Mumbai", "Delhi", "Hyderabad", "Kochi", "Coimbatore", "Kolkata", "Ahmedabad", "Pune"];
const SMALL_COUNTRY = { singapore: .25, "hong-kong": .3, macau: .08, maldives: 1.5, qatar: .9, bhutan: 1.2, fiji: 1.6, seychelles: .6, mauritius: .5, reunion: .45 };
const tagsOf = n => " " + [n.t, top(n).t].filter(Boolean).join(" ") + " ";
// photo for an attraction card: its own licensed photo, else a photo of the place it is in (labelled with that place).
// A fallback photo is used at most twice per grid; a card with no photo is left out.
function itemCards(items, cls = "") {
  const used = new Map(), rows = [];
  for (const x of items) {
    const own = PHOTOS[`${x.at.s}--${slugify(x.name)}`];
    let ph = own && { img: own.img, of: x.at.n, alt: `${x.name}, ${x.at.n}` };
    if (!ph) for (const f of [x.at, top(x.at), x.at.region].filter(Boolean)) if (f.img && (used.get(f.img) || 0) < 2) { ph = { img: f.img, of: f.n, alt: f.n }; break }
    if (!ph) continue;
    used.set(ph.img, (used.get(ph.img) || 0) + 1); rows.push({ ...x, ph });
  }
  return rows.length ? `<div class="ipc${cls ? " " + cls : ""}">${rows.map(x => `<div><figure><img src="${x.ph.img}" alt="${esc(x.ph.alt)}" loading="lazy"><span>${IC.pin}${esc(x.ph.of)}</span></figure><div><b>${esc(x.name)}</b>${x.note ? `<p>${esc(x.note)}</p>` : ""}${x.p ? `<a href="${x.p.url}">${esc(x.p.n)} →</a>` : ""}</div></div>`).join("")}</div>` : "";
}
// card picture: the topic photo for an icon key, else the icon itself
const TOPIC_OF = { cash: "currency", star: "tipping", drop: "water", plug: "plug", shield: "emergency", talk: "language", route: "transport", tip: "planner", sun: "season", plane: "flight",
  wave: "dive", mountain: "trek", boat: "boat", snow: "ski", bike: "cycle", tent: "camp", leaf: "safari", wind: "air", compass: "outdoors" };
const pic = (ic, key = TOPIC_OF[ic]) => TOPIC[key] ? `<figure class="cph" data-ic="${ic}"><img src="${TOPIC[key].img}" alt="" loading="lazy"></figure>` : `<i>${IC[ic] || IC.tip}</i>`;
// photo cards in a grid; planner's tips ("pt") sit below it as dark full-width notes
const tipCards = items => { const ok = items.filter(x => x && x[2]), pt = ok.filter(x => x[3] == "pt");
  return `<div class="et2">${ok.filter(x => x[3] != "pt").map(([ic, h, t, cls]) => `<div${cls ? ` class="${cls}"` : ""}>${pic(ic)}<b>${esc(h)}</b><p>${t}</p></div>`).join("")}</div>` +
    (pt.length ? `<div class="ptips">${pt.map(([, h, t]) => `<div><i>${IC.tip}</i><div><b>${esc(h)}</b><p>${t}</p></div></div>`).join("")}</div>` : "") };
const waLink = txt => `https://wa.me/${SITE.wa}?text=${encodeURIComponent(txt)}`;
const clipV = (s, n = 46) => { s = String(s || ""); if (s.length <= n) return s; const c = s.slice(0, n); return c.slice(0, c.lastIndexOf(" ")).replace(/[,;:(\-–\s]+$/, "") + "…" };
// opening sentences of a description, up to about max characters
const leadOf = (s, max = 250) => { const ss = String(s).split(/\n\n+/)[0].match(/[^.!?]+[.!?]+(\s|$)/g) || [String(s)]; let out = ""; for (const x of ss) { if (out && (out + x).length > max) break; out += x } return out.trim() };
// header slides: the place's own photo, then attraction photos taken in turn from each place
function slidesOf(n, max = 4) {
  const out = [], add = (img, cap) => { if (img && !out.some(o => o.img == img)) out.push({ img, cap }) };
  if (n.img) add(n.img, n.kind == "city" ? `${n.n}, ${n.parent.n}` : n.n);
  const ls = placesOf(n).map(p => p.a.map(([a]) => [PHOTOS[`${p.s}--${slugify(a)}`]?.img, `${a} – ${p.n}`]).filter(x => x[0]));
  for (let i = 0; out.length < max && ls.some(l => l[i]); i++) for (const l of ls) if (l[i]) add(...l[i]);
  return out.slice(0, max);
}
// the name inside a heading shown in red
const hiName = (text, name) => { const e = esc(text), k = esc(name), i = e.toLowerCase().indexOf(k.toLowerCase()); return i < 0 ? e : `${e.slice(0, i)}<em>${e.slice(i, i + k.length)}</em>${e.slice(i + k.length)}` };
const firstOf = (arr, k) => arr.find(x => x[k])?.[k];

// facts for the spotlight header, in the order of a country fact sheet; best time is shown on its own line
function glanceRows(n) {
  const F = factsOf(n), T = top(n), city = n.kind == "city";
  return [
    ["pin", city ? "Location" : "Region", city ? `${T.n}, ${n.dom ? "India" : T.region?.n || ""}` : n.dom ? `${n.region?.n || ""}, India` : T.region?.n],
    !city && ["flag", "Capital", T.cap],
    ["clock", "Time zone", n.dom ? INDIA_TZ : T.tz],
    F && ["car", "Driving side", F.dr],
    F && ["call", "Calling code", F.cc],
    ["cash", "Currency", n.dom ? "Indian rupee (INR)" : T.cur],
    ["talk", "Languages", T.lang],
    F && !n.dom && ["plug", "Power plugs", F.plug],
    isPlace(n) && n.days && ["cal", "Ideal stay", daysTxt(n.days)],
    isPlace(n) && n.r?.[0] && ["plane", "Getting there", n.r[0]],
    F && F.em && ["shield", "Emergency", F.em],
  ].filter(r => r && r[2]).slice(0, 8).map(([ic, k, v]) => [ic, k, clipV(v)]);
}
function destSpot(n, ps) {
  return spotlight({
    eye: n.kind == "city" ? `Destination spotlight · ${n.parent.n}` : "Destination spotlight",
    h1: hiName(destH1(n), n.n), desc: esc(leadOf(n.d)), label: `${n.n} at a glance`, facts: glanceRows(n), best: n.bt[0],
    btns: (ps.length ? `<a class="spbtn" href="#packages">Explore ${esc(n.n)} packages <span>${IC.arrow}</span></a>` : `<a class="spbtn" href="/custom-tour/" data-enq data-trip="${esc(n.n)} holiday">Plan my ${esc(n.n)} trip <span>${IC.arrow}</span></a>`) +
      `<a class="spwa" href="${waLink(`Hi Nexara Holidays, I would like to plan a trip to ${n.n}.`)}" target="_blank" rel="noopener"><i>${IC.wa}</i>Ask on WhatsApp</a>`,
    slides: slidesOf(n), ...vis(n),
  });
}
// four photo cards under the header, one per travel style where possible
const GENERIC_T = new Set(["short-breaks", "long-stays", "weekend-getaways", "private-tours"]);
const styleOf = p => THEME_LABEL[p.themes.find(t => !GENERIC_T.has(t) && THEME_LABEL[t])] || "";
const tpCard = p => { const v = pkgVis(p), b = styleOf(p), at = [...new Set(p.stops.map(([s]) => s.n))].join(" · ");
  return `<a class="tpc" href="${p.url}">${v.img ? `<img src="${v.img}" alt="${esc(p.name)}" loading="lazy">` : `<span class="tpf" style="background:linear-gradient(135deg,${v.g})"></span>`}${b ? `<span class="tpb">${esc(b)}</span>` : ""}<span class="tpi"><small>${IC.pin}${esc(clipV(at, 40))}</small><b>${esc(p.name)}</b><span>${p.days} Days | ${p.nights} Nights</span></span><i class="tpa">${IC.arrow}</i></a>` };
function topPkgs(n, ps) {
  if (ps.length < 2) return "";
  const pick = [], seen = new Set();
  for (const p of ps) { if (pick.length == 4) break; const s = styleOf(p); if (s && !seen.has(s)) { seen.add(s); pick.push(p) } }
  for (const p of ps) { if (pick.length == 4) break; if (!pick.includes(p)) pick.push(p) }
  return `<section class="tps"><div class="h tph"><div><span class="eye">Popular packages</span><h2>Top ${esc(n.n)} travel packages</h2><p>A few of our ${esc(n.n)} itineraries in different travel styles. Every one is private and can be changed to suit you.</p></div>${ps.length > 4 ? `<a class="tpl" href="#packages">View all ${ps.length} packages ${IC.arrow}</a>` : ""}</div><div class="tpg">${pick.map(tpCard).join("")}</div></section>`;
}

function essentialTips(n) {
  const F = factsOf(n), T = top(n);
  if (!F) return "";
  const lowV = /1[012]\d V/.test(F.plug);
  const plug = n.dom ? "" : `${F.plug}. ${/\bC\b/.test(F.plug) ? "Indian two-pin plugs usually fit; carry an adapter for three-pin chargers." : "Indian plugs will not fit; carry a universal adapter."}${lowV ? " Check that your chargers accept 100–240 V." : ""}`;
  const money = n.dom ? "UPI and cards are widely accepted in cities and hotels; keep some cash for small shops, rural areas, hill towns and tips."
    : `${esc(T.cur)}. Carry some local currency for markets, small shops and tips, and ask your bank about international card charges before you travel.`;
  const tips = [...(T.tips || []), n !== T && n.tip].filter(Boolean);
  const partner = PARTNER_TOPS.has(T) && `We work with our own tied-up partner company in ${esc(T.n)}, so your guides, drivers, hotels and transfers are arranged by people who live there, with local support throughout your trip.`;
  return sec("Before you go", `Essential tips for travelling to ${n.n}`, tipCards([
    ["cash", "Currency and payments", money],
    ["star", "Tipping", esc(F.tip)],
    ["drop", "Drinking water", esc(F.water)],
    ["plug", "Power plugs", plug],
    ["shield", "Emergency numbers", esc(F.em || "")],
    ["talk", "Language", T.lang ? `Languages spoken: ${esc(T.lang)}.` : ""],
    ["route", "Getting around", esc(T.go || "")],
    ["tip", "Our partner on the ground", partner || "", "pt"],
    ...tips.map(t => ["tip", "Planner's tip", esc(t), "pt"]),
  ]) + note(`General guidance. Local rules and services change; we confirm details for your dates.`), { id: "tips" });
}

function mapSection(n) {
  const pts = placesOf(n).filter(p => p.ll);
  if (!pts.length) return "";
  let d, c;
  if (pts.length == 1 && (n.kind == "city" || n.self)) {
    c = pts[0].ll; d = n.kind == "city" || n.dom ? .12 : SMALL_COUNTRY[n.s] || 2.2;
    var [s, w, nn, e] = [c[0] - d * .6, c[1] - d, c[0] + d * .6, c[1] + d];
  } else {
    const la = pts.map(p => p.ll[0]), lo = pts.map(p => p.ll[1]), pad = Math.max(.3, (Math.max(...la) - Math.min(...la)) * .15);
    var [s, w, nn, e] = [Math.min(...la) - pad, Math.min(...lo) - pad * 1.4, Math.max(...la) + pad, Math.max(...lo) + pad * 1.4];
    c = [(s + nn) / 2, (w + e) / 2];
  }
  const f = x => x.toFixed(4), mk = pts.length == 1 ? `&marker=${f(pts[0].ll[0])},${f(pts[0].ll[1])}` : "";
  const zoom = pts.length == 1 && n.kind == "city" ? 12 : 6;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${f(w)},${f(s)},${f(e)},${f(nn)}&layer=mapnik${mk}`;
  const big = `https://www.openstreetmap.org/?mlat=${f(c[0])}&mlon=${f(c[1])}#map=${zoom}/${f(c[0])}/${f(c[1])}`;
  const list = pts.length > 1 ? `<ul class="mpl">${pts.map(p => `<li><a href="${p.url}">${esc(p.n)}</a><small>${p.ll[0].toFixed(2)}°, ${p.ll[1].toFixed(2)}°</small></li>`).join("")}</ul>` : "";
  return sec("Map", `Where is ${n.n}?`, `<div class="mapw"><iframe src="${src}" title="Map of ${esc(n.n)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div><p class="maplink"><a href="${big}" target="_blank" rel="noopener">Open a larger map →</a>${pts.length > 1 ? ` · The map frames the ${pts.length} places we cover in ${esc(n.n)}.` : ""}</p>${list}`, { id: "map" });
}

const TT = [["honeymoon", "Honeymooners", /honeymoon/], ["couples", "Couples", /honeymoon|couple/], ["family-holidays", "Families", /family/], ["group-tours", "Friends and groups", null],
  ["solo-travel", "Solo travellers", null], ["adventure", "Adventure seekers", /adventure|trek/], ["wildlife-safaris", "Wildlife lovers", /wildlife|safari/], ["cultural-holidays", "Culture and heritage lovers", /heritage|culture/],
  ["pilgrimage-tours", "Pilgrims", /pilgrimage/], ["beach-holidays", "Beach lovers", /beach|island/], ["hill-stations", "Hill-station lovers", /\bhill\b/], ["luxury-holidays", "Luxury travellers", null],
  ["budget-holidays", "Budget-conscious travellers", null], ["educational-tours", "School and college groups", null], ["senior-friendly", "Senior travellers", null], ["kids-holidays", "Families with kids", null], ["photography-tours", "Photographers", null]];
const TT_IC = { honeymoon: "heart", couples: "heart", "family-holidays": "user", "group-tours": "user", "solo-travel": "compass", adventure: "mountain", "wildlife-safaris": "leaf", "cultural-holidays": "temple", "pilgrimage-tours": "temple", "beach-holidays": "wave", "hill-stations": "mountain", "luxury-holidays": "star", "budget-holidays": "cash", "educational-tours": "doc", "senior-friendly": "user", "kids-holidays": "star", "photography-tours": "camera" };
const liveType = s => { const t = TYPE_BY[s]; return t && !t.draft && pkgsOfType(s).length >= 3 };
function travellerTypes(n) {
  const ps = pkgsFor(n), tg = tagsOf(n);
  const rows = TT.filter(([s]) => liveType(s)).map(([s, label, rx]) => [s, label, ps.filter(p => p.themes.includes(s)).length, rx && rx.test(tg)]).filter(r => r[2] || r[3]);
  if (rows.length < 2) return "";
  const used = new Set(), own = [n, ...placesOf(n)].map(x => x.img).filter(Boolean);
  const photo = s => { const img = [TOPIC[`tt-${s}`]?.img, ...ps.filter(p => p.themes.includes(s)).map(p => pkgVis(p).img), ...own].find(x => x && !used.has(x)); if (img) used.add(img); return img };
  return sec("Who it suits", `Who should visit ${n.n}?`, `<div class="ppl">${rows.map(r => [...r, photo(r[0])]).map(([s, label, k, , img]) => `<a href="/tour-types/${s}/">${img ? `<figure class="cph" data-ic="${TT_IC[s] || "user"}"><img src="${img}" alt="" loading="lazy"></figure>` : `<i>${IC[TT_IC[s]] || IC.user}</i>`}<b>${esc(label)}</b><span>${k ? `${k} ${esc(n.n)} itinerar${k == 1 ? "y" : "ies"} in this style` : `${esc(THEME_LABEL[s])} across our destinations`}</span><small>Explore ${IC.arrow}</small></a>`).join("")}</div>`, { cls: "tight" });
}

const IATA = { Chennai: "MAA", Bengaluru: "BLR", Mumbai: "BOM", Delhi: "DEL", Hyderabad: "HYD", Kochi: "COK", Coimbatore: "CJB", Kolkata: "CCU", Ahmedabad: "AMD", Pune: "PNQ" };
function departure(n) {
  const cities = DEPART.filter(c => c.toLowerCase() != n.n.toLowerCase()), by = n.dom ? "Train or flight" : "Flights";
  return sec("Plan from your city", n.dom ? `Plan your ${n.n} trip` : `Plan your ${n.n} trip from India`,
    `<div class="dpbd"><div class="dpbh"><b>${IC.plane} Departures to ${esc(n.n)}</b><span>Pick the city you travel from and we include ${n.dom ? "trains or flights" : "flights"} from there in your quote.</span></div><div class="dpbg">${cities.map(c => `<button type="button" class="dep" data-enq data-trip="${esc(n.n)} holiday" data-city="${c}"><b>${IATA[c]}</b><span>${c}</span><small>${by} · get a quote</small></button>`).join("")}<button type="button" class="dep" data-enq data-trip="${esc(n.n)} holiday"><b>+</b><span>Another city</span><small>Tell us where you start</small></button></div></div>`, { cls: "tight" });
}

function everything(n) {
  const places = placesOf(n), ps = pkgsFor(n), T = top(n);
  const attr = places.flatMap(p => p.a.slice(0, isPlace(n) ? 4 : 1).map(a => a[0])).slice(0, 5);
  const food = [...new Set(places.flatMap(p => p.f || []))].slice(0, 4);
  const paras = String(n.d).split(/\n\n+/).map((p, i) => `<p${i ? "" : ' class="lede"'}>${esc(p)}</p>`).join("");
  const more = [
    !isPlace(n) && places.length ? `We plan trips to ${places.length} destination${places.length == 1 ? "" : "s"} in ${esc(n.n)}: ${esc(list(places.slice(0, 6).map(p => p.n)))}${places.length > 6 ? " and more" : ""}.` : "",
    attr.length ? `Highlights include ${esc(list(attr))}.` : "",
    food.length ? `Local food worth trying: ${esc(list(food))}.` : "",
    isPlace(n) && n.days ? `Plan ${esc(daysTxt(n.days))} here${n.b ? `; it suits ${esc(n.b.toLowerCase())}` : ""}.` : "",
    ps.length ? `Our ${esc(n.n)} itineraries run from ${Math.min(...ps.map(p => p.days))} to ${Math.max(...ps.map(p => p.days))} days and every one can be changed to suit you.` : "",
  ].filter(Boolean).join(" ");
  const [air, rail, road] = isPlace(n) ? n.r : [];
  const info = [
    ["sun", "When to go", `<p><strong>${esc(n.bt[0])}.</strong> ${esc(n.bt[1] || "")}</p>`],
    air && ["plane", `How to reach ${esc(n.n)}`, `<ul><li><strong>By air:</strong> ${esc(air)}</li>${rail ? `<li><strong>By rail:</strong> ${esc(rail)}</li>` : ""}${road ? `<li><strong>By road:</strong> ${esc(road)}</li>` : ""}</ul>`],
    !isPlace(n) && T.go && ["route", "Getting around", `<p>${esc(T.go)}</p>`],
  ].filter(Boolean);
  const main = `<div class="prose evr"><h2 id="about">Everything you need to know about ${esc(n.n)}</h2>${paras}${more ? `<p>${more}</p>` : ""}</div><div class="kc3">${info.map(([ic, h, body]) => `<div>${pic(ic)}<h3>${h}</h3>${body}</div>`).join("")}</div>`;
  const aside = `<aside>${quoteBox(n.n + " holiday")}${places.length > 1 ? `<div class="box"><h3>Places in ${esc(n.n)}</h3>${linkList(places.map(x => [x.n, x.url, x.bt[0]]), "one")}</div>` : ""}</aside>`;
  return `<div class="lay"><div>${main}</div>${aside}</div>`;
}

function packagesSec(n) {
  const ps = pkgsFor(n);
  if (!ps.length) return sec("Custom trips", `Plan a ${n.n} holiday`, `<p>We don't have a ready-made itinerary for ${esc(n.n)} yet, but we plan custom trips here. Share your dates and we'll send a route with a price.</p><p><a class="btn red" href="/custom-tour/" data-enq data-trip="${esc(n.n)} holiday">Plan my ${esc(n.n)} trip</a></p>`, { id: "packages" });
  const themes = [...new Set(ps.flatMap(p => p.themes))].filter(t => THEME_LABEL[t] && ps.filter(p => p.themes.includes(t)).length >= 2).slice(0, 6);
  return sec("Tour packages", `View all ${n.n} packages`, (themes.length && ps.length > 4 ? filterTabs([["all", "All"], ...themes.map(t => [t, THEME_LABEL[t]])]) : "") + cards(ps.map(pkgCard)) + `<p class="fcount">${ps.length} itinerar${ps.length == 1 ? "y" : "ies"}</p>`, { id: "packages", p: "Private, customisable itineraries with prices quoted for your dates, hotel category and group size." });
}

function subdest(n) {
  if (n.kind == "city") { const sib = kids(n.parent).filter(x => x !== n && !x.draft).slice(0, 8); return sib.length ? sec("Nearby in " + n.parent.n, `More places in ${n.parent.n}`, (brushOf(sib).length == sib.length ? brush(brushOf(sib), "sm") : cards(sib.map(placeCard), "sm"))) : "" }
  if (n.self) return "";
  const places = placesOf(n);
  return places.length ? sec("Where to go", `Places to visit in ${n.n}`, cards(places.map(placeCard))) : "";
}

function topAttractions(n) {
  if (isPlace(n)) { const h = attractions(n); return h ? sec("Top attractions", `Top things to see in ${n.n}`, h, { id: "attractions" }) : "" }
  const items = placesOf(n).flatMap(p => p.a.slice(0, 2).map(([a, nt]) => ({ a, nt, p, ph: PHOTOS[`${p.s}--${slugify(a)}`] })));
  const shot = items.filter(x => x.ph).slice(0, 8), rest = items.filter(x => !x.ph).slice(0, Math.max(0, 12 - shot.length));
  const restHtml = rest.length ? itemCards(rest.map(x => ({ name: x.a, note: x.nt, p: x.p, at: x.p }))) : "";
  if (!shot.length && !restHtml) return "";
  return sec("Top attractions", `Top attractions in ${n.n}`, (shot.length ? `<div class="gal g3">${shot.map(x => `<figure><a href="${x.ph.img}" data-lb data-cap="${esc(x.a)}, ${esc(x.p.n)}"><img src="${x.ph.img}" alt="${esc(x.a)}, ${esc(x.p.n)}" loading="lazy"></a><figcaption><b>${esc(x.a)}</b><span>${esc(x.nt)}</span><a class="figl" href="${x.p.url}">${esc(x.p.n)} →</a></figcaption></figure>`).join("")}</div>` : "") + restHtml, { id: "attractions" });
}

function wildNature(n) {
  const multi = !isPlace(n), all = placesOf(n).flatMap(p => p.a.map(([a, nt]) => ({ name: a, note: nt, p: multi ? p : null, at: p })));
  const acts = [...new Set(placesOf(n).flatMap(p => p.ac || []))];
  const wild = all.filter(x => RX.wild.test(x.name + " " + x.note)), wildAct = acts.filter(a => RX.wild.test(a));
  const wildHtml = wild.length ? itemCards(wild.slice(0, 9)) : "";
  if (wildHtml || wildAct.length) return sec("Wildlife", `Wildlife in ${n.n}`, wildHtml + (wildAct.length ? `<h3 class="sh">Wildlife experiences</h3>${tags(wildAct)}` : "") + note("Sightings depend on season and luck and are never guaranteed. Keep your distance, stay with licensed guides and never feed wild animals."));
  const nat = all.filter(x => RX.nature.test(x.name + " " + x.note) && !RX.culture.test(x.name));
  const natHtml = nat.length >= 2 ? itemCards(nat.slice(0, 9)) : "";
  return natHtml ? sec("Nature", `Nature and landscapes of ${n.n}`, natHtml) : "";
}

function culture(n) {
  const multi = !isPlace(n), places = placesOf(n);
  const sites = places.flatMap(p => p.a.map(([a, nt]) => ({ name: a, note: nt, p: multi ? p : null, at: p }))).filter(x => RX.culture.test(x.name + " " + x.note) && !RX.wild.test(x.name));
  const acts = [...new Set(places.flatMap(p => p.ac || []))].filter(a => RX.cultAct.test(a) && !RX.outdoor.test(a));
  const food = [...new Set(places.flatMap(p => p.f || []))];
  const siteHtml = sites.length ? itemCards(sites.slice(0, 9), "num") : "";
  if (!siteHtml && !acts.length && !food.length) return "";
  return sec("Culture", `Cultural experiences in ${n.n}`, (siteHtml ? `<h3 class="sh">${IC.temple} Heritage and landmarks</h3>${siteHtml}` : "") +
    (acts.length || food.length ? `<div class="cx2${acts.length && food.length ? "" : " cx1"}">${acts.length ? `<div class="cxe"><h3>${IC.star} Experiences</h3><ul>${acts.slice(0, 12).map(a => `<li>${esc(a)}</li>`).join("")}</ul>${acts.some(a => /\(|festival/i.test(a)) ? `<p class="hint2">Festivals and events marked with months happen only at those times of year; dates vary, so ask us before you plan around one.</p>` : ""}</div>` : ""}` +
      `${food.length ? `<div class="cxm"><h3><span>On the menu</span>Food to try</h3><ul>${food.slice(0, 12).map(f => `<li>${esc(f)}</li>`).join("")}</ul></div>` : ""}</div>` : ""));
}

const OUT_IC = [[/jet ski/i, "wave"], [/trek|hik|walk|climb/i, "mountain"], [/raft|kayak|canoe|boat|cruise|sail|shikara|houseboat|ferry/i, "boat"], [/div(e|ing)|snorkel|swim|surf|beach|fishing|jet ski/i, "wave"], [/ski|snow/i, "snow"], [/cycl|bik/i, "bike"], [/camp/i, "tent"], [/safari|game drive|jeep/i, "leaf"], [/paraglid|balloon|zip|cable car|gondola|ropeway/i, "wind"], [/sunrise|sunset/i, "sun"], [/drive/i, "route"]];
const outIc = a => (OUT_IC.find(([rx]) => rx.test(a)) || [0, "compass"])[1];
const OUT_PH = [[/husky|sled/i, "husky"], [/balloon/i, "balloon"], [/paraglid|parasail|skydiv/i, "air"], [/zip|cable car|gondola|ropeway|skywalk/i, "cablecar"], [/camel|dune|desert/i, "desert"],
  [/horse/i, "horse"], [/fishing/i, "fishing"], [/vineyard|winery|wine/i, "vineyard"], [/raft(?!-house)/i, "rafting"], [/kayak|canoe/i, "boat"], [/houseboat|backwater/i, "houseboat"], [/shikara/i, "shikara"], [/cruise|boat|sail|shikara|houseboat|ferry|catamaran|dhow|raft-house/i, "cruise"],
  [/snorkel|div(e|ing)|undersea|sea walk/i, "dive"], [/surf|jet ski|water sport/i, "surf"], [/safari|game drive|jeep|bush walk/i, "safari"], [/beach|swim|cenote/i, "beach"],
  [/street food|food walk/i, "foodwalk"], [/ski|snow/i, "ski"], [/cycl|bik/i, "cycle"], [/camp/i, "camp"], [/sunrise|sunset/i, "sunset"], [/climb|trek|hik/i, "trek"], [/food|market/i, "foodwalk"], [/village/i, "village"], [/temple|monastery|parikrama|pilgrim/i, "temple"],
  [/(nature|forest|meadow|valley|waterfall|ridge|tea|coffee|garden|birdwatch|lemur|wildlife|lake|river|trail).*walk/i, "naturewalk"],
  [/(heritage|fort|old city|monument|ruins|palace).*walk|walk.*(fort|old city|ruins)/i, "heritage"], [/walk/i, "walk"], [/drive/i, "drive"]];
// when an activity's own photos are used up on the page, the next-closest topics to try before the generic one
const OUT_NEAR = { desert: ["camp", "safari"], camp: ["desert"], rafting: ["boat"], boat: ["cruise", "rafting"], cruise: ["boat", "houseboat", "sunset"], houseboat: ["cruise"], shikara: ["cruise", "boat"],
  dive: ["beach", "surf"], surf: ["beach", "dive"], beach: ["dive", "sunset"], safari: ["naturewalk"], cablecar: ["air"], air: ["balloon", "cablecar"], balloon: ["air"], sunset: ["beach"],
  trek: ["naturewalk"], naturewalk: ["trek"], heritage: ["walk"], walk: ["heritage"], temple: ["heritage", "walk"], foodwalk: ["walk"], village: ["naturewalk", "walk"], fishing: ["boat", "cruise"],
  vineyard: ["naturewalk"], husky: ["ski"], cycle: ["walk"] };
const GENERIC = /^(Boat|Boating|Sunset|Sunrise|Trek|Walk|Hike|Hiking|Cycling|Jeep|River|Lake|Village|Temple|Heritage|Old|City|Fort|Beach|Island|Day|Night|Morning|Dawn|Guided|Scenic|Snorkelling|Diving|Camping|Rafting|White|Hot|Cable|Desert|Camel|Mountain|Nature|Forest|Short|Food|Market|Street|Glass|Swim|Visit|Speedboat|Climb|Drive|Bike)$/;
const outPh = a => (OUT_PH.find(([rx]) => rx.test(a)) || [0, "outdoors"])[1];
function outdoor(n) {
  const places = placesOf(n), acts = [...new Set(places.flatMap(p => p.ac || []))].filter(a => RX.outdoor.test(a));
  if (!acts.length) return "";
  // an activity that names a sight ("Boating at Mattupetty") gets that sight's photo; others get a topic photo,
  // rotating through its variants (cruise, cruise-2, ...) so a grid repeats a photo as little as possible
  const shots = places.flatMap(p => p.a.map(([a]) => [a.split(/\W+/), PHOTOS[`${p.s}--${slugify(a)}`]?.img])).filter(x => x[1]), used = new Map();
  const photo = a => {
    const names = (a.replace(/\(.*?\)/g, "").match(/\b[A-Z][\w'-]{3,}/g) || []).filter(w => !GENERIC.test(w) && !OUT_PH.some(([rx]) => rx.test(w)));
    const own = names.length ? shots.find(([ws, img]) => !used.has(img) && names.some(w => ws.includes(w)))?.[1] : null;
    // the heritage-walk photos are Indian streets, so they only lead on India pages
    const key = outPh(a) == "heritage" && !n.dom ? "walk" : outPh(a);
    const img = own || [key, ...(OUT_NEAR[key] || []), "outdoors"].filter(k => n.dom || k != "heritage").flatMap(k => ["", "-2", "-3"].map(v => TOPIC[k + v]?.img)).find(x => x && !used.has(x));
    if (img) used.set(img, (used.get(img) || 0) + 1);
    return img ? `<figure class="cph" data-ic="${outIc(a)}"${own ? ` data-t="${key}"` : ""}><img src="${img}" alt="" loading="lazy"></figure>` : `<i>${IC[outIc(a)]}</i>`;
  };
  return sec("Outdoors", `Outdoor activities in ${n.n}`, `<div class="oat">${acts.slice(0, 12).map(a => `<div>${photo(a)}<b>${esc(a)}</b><button type="button" data-enq data-trip="${esc(n.n)} holiday with ${esc(a.replace(/\s*\(.*?\)/, "").toLowerCase())}">Add to my trip <span>+</span></button></div>`).join("")}</div>` + note(`Many activities are seasonal. Best time for ${esc(n.n)}: ${esc(n.bt[0])}. We check operating seasons for your dates.`));
}

function travelTips(n) {
  const F = factsOf(n), T = top(n), tg = tagsOf(n), permit = PERMIT.has(T.s);
  const visa = n.dom ? `<p>Indian citizens do not need a visa; carry a government photo ID such as Aadhaar or a passport for hotels and flights.${permit ? ` Parts of ${esc(T.n)} need an Inner Line Permit or Protected Area Permit for visitors; we arrange these as part of your trip.` : ""}</p>`
    : `<p>Entry rules for Indian passport holders change, including visa-free, visa-on-arrival and e-visa schemes, so confirm the current rules on the official government or embassy website for ${esc(T.n)} before booking flights. Most countries require a passport valid for at least six months beyond your return date. We check the current requirements when we prepare your quote; we cannot guarantee visa approval.</p>`;
  const high = /\b(mountain|snow)\b/.test(tg) || /ladakh|spiti|sikkim|tawang|nubra|pangong/.test(n.s + " " + T.s);
  const health = `<p>${n.dom ? "Travel insurance is a good idea, especially for adventure activities." : "Buy travel insurance that covers medical treatment and evacuation; healthcare abroad can be expensive."} Carry prescription medicines in their original packaging with a copy of the prescription.${high ? " Some places here are at high altitude: rest on arrival, drink plenty of water and ascend gradually." : ""}${n.dom ? "" : ` For current safety advice, check the travel advisories published by the Government of India and the embassy in ${esc(T.n)}.`}</p>`;
  const pack = [/\b(snow|mountain)\b/.test(tg) && "warm layers, a down jacket and gloves", /\bhill\b/.test(tg) && "a light jacket or sweater for cool evenings", /\b(beach|island)\b/.test(tg) && "sunscreen, sunglasses, a hat and swimwear",
    /\b(pilgrimage|heritage)\b/.test(tg) && "modest clothing that covers shoulders and knees for religious sites", /monsoon|rain|wet/i.test(n.bt[1] || "") && "a compact umbrella or rain jacket",
    "comfortable walking shoes", !n.dom && F && !/\bC\b/.test(F.plug) && "a universal travel adapter"].filter(Boolean);
  const etiquette = [/\b(pilgrimage|heritage|culture)\b/.test(tg) && "Dress modestly at temples, churches and mosques, and remove footwear where asked.", "Ask before photographing people, and follow photography rules at religious sites and museums.", ...(T.tips || []).filter(t => /dress|respect|cover|photograph|etiquette|quiet|shoes|modest/i.test(t))].filter(Boolean);
  const remote = /\b(mountain|snow|wildlife|nature|desert|island)\b/.test(tg);
  const conn = n.dom ? `<p>Mobile data is good in towns and cities.${remote ? " Coverage can be patchy in remote, hill and forest areas, so download offline maps before you set off." : ""}</p>`
    : `<p>Indian mobile operators sell international roaming packs, or you can buy a local SIM or eSIM on arrival with your passport. Check that your phone is unlocked and supports eSIM before you travel.</p>`;
  const body = `<div class="prose tt2">
<h3>Visa and entry</h3>${visa}
<h3>Health and safety</h3>${health}
${F ? `<h3>Currency and tipping</h3><p>${n.dom ? "The currency is the Indian rupee (INR)." : `The currency is the ${esc(T.cur)}.`} ${esc(F.tip)}</p>` : ""}
<h3>Best time to visit</h3><p><strong>${esc(n.bt[0])}.</strong> ${esc(n.bt[1] || "")}</p>
${T.go || (isPlace(n) && n.r) ? `<h3>Getting around</h3><p>${esc(T.go || n.r.filter(Boolean).join(". "))}</p>` : ""}
<h3>Local etiquette</h3><ul>${etiquette.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
<h3>What to pack</h3><p>Pack ${esc(list(pack))}.</p>
<h3>Phone and internet</h3>${conn}
<h3>Budget</h3><p>We don't publish fixed prices because the season, hotel category, flights and group size change the cost. Your written quote lists exactly what is included, so you can compare like for like.</p></div>`;
  return sec("Travel tips", `${n.n} travel tips`, body, { id: "travel-tips" });
}

function destFaq(n) {
  const F = factsOf(n), T = top(n), places = placesOf(n), ps = pkgsFor(n), city = n.kind == "city";
  const famous = isPlace(n) ? n.a.slice(0, 4).map(a => a[0]) : (T.k || []).length ? T.k : places.slice(0, 4).map(p => p.n);
  const q = [
    [`What is ${n.n} famous for?`, `${esc(n.n)} is known for ${esc(list(famous))}. ${esc(firstSentence(n.d))}`],
    !n.dom && !city && [`Where is ${n.n}?`, `${esc(n.n)} is in ${esc(T.region?.n || "")}. Its capital is ${esc(T.cap || "")}.`],
    [`What is the best time to visit ${n.n}?`, `${esc(n.bt[0])}. ${esc(n.bt[1] || "")}`],
    isPlace(n) && n.days && [`How many days are enough for ${n.n}?`, `Plan ${esc(daysTxt(n.days))} to see the main sights without rushing.${ps.length ? ` Our itineraries that include ${esc(n.n)} run from ${Math.min(...ps.map(p => p.days))} to ${Math.max(...ps.map(p => p.days))} days, usually combined with nearby places.` : ""}`],
    !isPlace(n) && ps.length && [`How many days do I need for ${n.n}?`, `Our ${esc(n.n)} itineraries run from ${Math.min(...ps.map(p => p.days))} to ${Math.max(...ps.map(p => p.days))} days. ${places.length > 1 ? `A first trip usually covers ${esc(list(places.slice(0, 3).map(p => p.n)))}.` : ""}`],
    isPlace(n) && n.r?.[0] && [`How do I reach ${n.n}?`, esc(n.r.filter(Boolean).join(". ")) + "."],
    !n.dom && [`What currency is used in ${n.n}?`, `${esc(T.cur || "")}.${F ? ` ${esc(F.tip)}` : ""}`],
    !n.dom && T.lang && [`What languages are spoken in ${n.n}?`, esc(T.lang) + "."],
    !n.dom && F && [`What plug type does ${T.n} use?`, `${esc(F.plug)}. ${/\bC\b/.test(F.plug) ? "Indian two-pin plugs usually fit; bring an adapter for three-pin chargers." : "Indian plugs do not fit, so carry a universal adapter."}`],
    F && [`Is tap water safe to drink in ${T.n}?`, esc(F.water)],
    !n.dom && T.tz && [`What is the time difference between India and ${T.n}?`, `${esc(T.n)} is ${esc(T.tz)}.`],
    !n.dom && [`Do Indian citizens need a visa for ${T.n}?`, `Rules for Indian passport holders vary and change, including visa-free, visa-on-arrival and e-visa schemes. Check the official government or embassy website before you travel; we confirm the current rules when you book with us.`],
    n.dom && PERMIT.has(T.s) && [`Do I need a permit to visit ${n.n}?`, `Parts of ${esc(T.n)} require an Inner Line Permit or Protected Area Permit for visitors. Requirements depend on where you go; we arrange the permits for your route.`],
    F && F.em && [`What are the emergency numbers in ${T.n}?`, esc(F.em) + "."],
    [`How much does a ${n.n} tour package cost?`, `It depends on your travel month, hotel category, the number of travellers and whether flights are included, so we quote every trip individually. Share your dates and we send a day-by-day plan with a price on WhatsApp.`],
    [`Can Nexara Holidays plan a ${n.n} trip from ${SITE.city}?`, `Yes. We plan trips from ${SITE.city} and other Indian cities, including ${n.dom ? "trains or flights" : "flights"}, hotels, transfers and sightseeing.`],
  ].filter(Boolean);
  return sec("FAQs", `${n.n} FAQs`, faq(q), { cls: "tight", id: "faqs" });
}

function related(n) {
  let rel = [], h = "";
  if (n.kind == "city") { rel = [...N.values()].filter(x => isPlace(x) && x !== n && !x.draft && x.dom === n.dom && x.parent !== n.parent).map(x => [x, hav(n, x)]).sort((a, b) => a[1] - b[1]).slice(0, 6).filter(([, d]) => d < (n.dom ? 600 : 1500)).map(([x]) => placeCard(x)); h = `Destinations near ${n.n}` }
  else if (n.kind == "country") { rel = COUNTRIES.filter(c => c.rg == n.region.s && c.s != n.s).map(c => N.get(c.s)).filter(c => !c.draft).slice(0, 6).map(topCard); h = `More destinations in ${n.region.n}` }
  else { rel = (n.region?.states || []).filter(s => s != n.s).map(s => N.get(s)).filter(s => s && !s.draft).slice(0, 6).map(topCard); h = `More destinations in ${n.region?.n || "India"}` }
  return rel.length ? sec("Related destinations", h, cards(rel, "sm")) : "";
}

const opt2 = a => a.map(v => `<option>${v}</option>`).join("");
const destForm = n => `<section id="enquire" class="dform"><div class="h"><span class="eye">Enquire now</span><h2>Plan your ${esc(n.n)} holiday</h2><p>Fill this in and WhatsApp opens with your enquiry ready to send. Nothing is stored on this website.</p></div>
<form id="ctf" novalidate>
<div class="fl"><input id="cfn" placeholder=" " autocomplete="name"><label for="cfn">Your name</label><span class="ok">✓</span></div>
<div class="fl"><input id="cfp" type="tel" inputmode="tel" placeholder=" " autocomplete="tel"><label for="cfp">Mobile number (WhatsApp)</label><span class="ok">✓</span></div>
<div class="fl"><input id="cfc" placeholder=" " autocomplete="address-level2"><label for="cfc">City you live in</label></div>
<div class="fl"><input id="cfd" placeholder=" " value="${esc(n.n)}"><label for="cfd">Destination</label></div>
<div class="fl"><input id="cfdt" type="month" placeholder=" "><label for="cfdt">Approximate travel month</label></div>
<div class="fl"><input id="cft" type="number" min="1" max="99" placeholder=" "><label for="cft">Number of travellers</label></div>
<div class="fl f"><select id="cfk">${opt2(["Not sure yet", "Honeymoon", "Family holiday", "Friends or group trip", "Pilgrimage", "Adventure", "Luxury holiday", "School or college tour", "Corporate trip"])}</select><label for="cfk">Type of trip</label></div>
<div class="fl f"><textarea id="cfm" placeholder=" " rows="3"></textarea><label for="cfm">Anything else we should know? (optional)</label></div>
<button class="btn red f" type="submit">Send on WhatsApp →</button></form>
<p class="note">Sending opens WhatsApp on your device; your enquiry reaches us only when you press send there. An enquiry is not a booking.</p></section>`;

// must-see places for kids (TYPES[].spots): each card opens the best kids' trip that visits the place, else the destination page
const SPOT_F = { disney: "Disney", universal: "Universal & Jurassic", parks: "Theme parks", dino: "Dinosaurs", islands: "Islands & water parks", lego: "LEGOLAND", more: "More fun" };
const KID_SPOTS = TYPES.flatMap(t => (t.spots || []).map(([name, s, where, text, f]) => {
  const n = N.get(s); if (!n || n.draft) { warn(`type ${t.s}: unknown spot place ${s}`); return null }
  const tp = PK.filter(p => !p.dom && (p.home === n || p.stops.some(([m]) => m === n))).sort((a, b) => b.themes.includes("kids-holidays") - a.themes.includes("kids-holidays") || b.themes.includes("family-holidays") - a.themes.includes("family-holidays"))[0];
  const ph = TOPIC["kid-" + slugify(name)]; // attraction photo from content/photo-topics.json, else the destination's
  return { type: t, node: n, url: tp ? tp.url : n.url, name, ...vis(n), ...(ph?.img ? { img: ph.img, sm: null, credit: null } : {}), loc: where, tags: [SPOT_F[f]], text, t: f, go: tp ? "See the trip" : `Explore ${n.n}` };
})).filter(Boolean);
const spotTabs = spots => spots.length > 6 ? filterTabs([["all", "All"], ...Object.entries(SPOT_F).filter(([k]) => spots.some(v => v.t == k))]) : "";
// places for kids in this destination, or anywhere inside it (a country page lists its cities' places too)
function kidsHere(n) {
  const a = KID_SPOTS.filter(v => { for (let x = v.node; x; x = x.parent) if (x === n) return true; return false });
  if (!a.length) return "";
  return sec("For kids", `Kids' favourites in ${n.n}`, spotTabs(a) + cards(a), { p: `Theme parks, dinosaurs and family fun. See all <a href="/tour-types/kids-holidays/#places">kids' places around the world</a>.`, id: "kids" });
}

function destBody(n) {
  return topPkgs(n, pkgsFor(n)) + `<div class="alt">${essentialTips(n)}</div>` + mapSection(n) + travellerTypes(n) + `<div class="alt">${departure(n)}</div>` +
    everything(n) + `<div class="alt">${packagesSec(n)}</div>` + subdest(n) + topAttractions(n) + kidsHere(n) + `<div class="alt">${wildNature(n)}</div>` + culture(n) +
    `<div class="alt">${outdoor(n)}</div>` + travelTips(n) + `<div class="alt">${destFaq(n)}</div>` + related(n) + relGuides(n) + `<div class="alt">${destForm(n)}</div>`;
}
const relGuides = n => { const a = [...relTo(G, n).map(g => ({ ...g, lab: "Travel guide" })), ...relTo(B, n).map(b => ({ ...b, lab: "Blog" }))].slice(0, 6); return a.length ? sec("Read before you go", `${n.n} guides and articles`, artCards(a, x => x.lab)) : "" };
const destH1 = n => pkgsFor(n).length ? `${n.n} Tour Packages` : `${n.n} Travel Guide`;

for (const n of N.values()) {
  if (n.draft || !["city", "state", "country"].includes(n.kind)) continue;
  const city = n.kind == "city", ps = pkgsFor(n), T = top(n), F = factsOf(n);
  emit(n.url, page({
    path: n.url, active: "/destinations/",
    title: city ? fitTitle(`${n.n}, ${n.parent.n}: Travel Guide & Packages | Nexara Holidays`, `${n.n} Travel Guide & Tour Packages | Nexara Holidays`, `${n.n} Travel Guide & Packages | Nexara`, `${n.n} Travel Guide | Nexara Holidays`, `${n.n} | Nexara Holidays`)
      : fitTitle(`${n.n} Tour Packages${n.dom ? "" : " from India"} & Travel Guide | Nexara Holidays`, `${n.n} Tour Packages & Travel Guide | Nexara Holidays`, `${n.n} Tour Packages & Travel Guide | Nexara`, `${n.n} Holidays | Nexara Holidays`),
    desc: clip(city ? `${firstSentence(n.d)} Best time: ${n.bt[0]}. Top sights, travel tips and ${n.n} packages from ${SITE.city}.` : `${firstSentence(n.d)} Best time ${n.bt[0]}. ${ps.length} ${n.n} tour packages${n.dom ? "" : " from India"}, travel tips and FAQs.`),
    h1: destH1(n), crumbs: crumbsOf(n), hero: { img: n.img, spot: destSpot(n, ps) },
    jsonld: isPlace(n) ? [destLd(n)] : [], body: destBody(n),
  }), "destinations");
}

// India regions
for (const r of inReg) {
  const st = r.states.map(s => N.get(s)).filter(s => !s.draft), ps = PK.filter(p => p.dom && st.includes(p.home));
  const table = `<div class="tbl-wrap prose" style="max-width:none"><table><thead><tr><th>State</th><th>Best time</th><th>Known for</th></tr></thead><tbody>${st.map(s => `<tr><td><a href="${s.url}">${esc(s.n)}</a></td><td>${esc(s.bt[0])}</td><td>${esc((s.k || []).join(", "))}</td></tr>`).join("")}</tbody></table></div>`;
  emit(r.url, page({
    path: r.url, active: "/destinations/", title: `${r.n} Tour Packages & Destinations | Nexara Holidays`, desc: clip(`${firstSentence(r.d)} Explore ${st.length} states and ${ps.length} itineraries across ${r.n}.`),
    h1: `${r.n} holidays`, scr: "India", sub: esc(firstSentence(r.d)), crumbs: [["Home", "/"], ["Destinations", "/destinations/"], ["India", "/destinations/india/"], [r.n, r.url]], hero: r.img ? { img: r.img, credit: r.photo } : { m: r.m || "temple", g: r.g },
    body: `<section><div class="prose">${r.d.split(/\n\n+/).map(p => `<p>${esc(p)}</p>`).join("")}</div></section>` + sec("Explore", `Popular places in ${r.n}`, brush(brushOf(st.flatMap(c => [c, ...kids(c)]).filter(x => isPlace(x) && !x.draft).sort((a, b) => pkgsAt(b).length - pkgsAt(a).length).slice(0, 8)))) + sec("States", `States in ${r.n}`, cards(st.map(topCard))) + sec("Plan by season", "When to visit each state", table, { cls: "tight" }) + (ps.length ? sec("Itineraries", `${r.n} tour packages`, cards(ps.map(pkgCard))) : "") + cta(`Plan a ${r.n} holiday`, "Pick one state or combine a few. We build the route around your dates.", r.n + " holiday"),
  }), "destinations");
}
// international regions
for (const r of wReg) {
  const cs = COUNTRIES.filter(c => c.rg == r.s).map(c => N.get(c.s)).filter(c => !c.draft), ps = PK.filter(p => !p.dom && cs.includes(p.home));
  const table = `<div class="tbl-wrap prose" style="max-width:none"><table><thead><tr><th>Country</th><th>Best time</th><th>Time vs India</th></tr></thead><tbody>${cs.map(s => `<tr><td><a href="${s.url}">${esc(s.n)}</a></td><td>${esc(s.bt[0])}</td><td>${esc(s.tz || "")}</td></tr>`).join("")}</tbody></table></div>`;
  emit(r.url, page({
    path: r.url, active: "/destinations/", title: `${r.n} Tour Packages from India | Nexara Holidays`, desc: clip(`${firstSentence(r.d)} ${cs.length} countries and ${ps.length} itineraries, planned from ${SITE.city}.`),
    h1: `${r.n} holidays`, scr: "International", sub: esc(firstSentence(r.d)), crumbs: [["Home", "/"], ["Destinations", "/destinations/"], ["International", "/destinations/international/"], [r.n, r.url]], hero: r.img ? { img: r.img, credit: r.photo } : { m: r.m || "sea", g: r.g },
    body: `<section><div class="prose">${r.d.split(/\n\n+/).map(p => `<p>${esc(p)}</p>`).join("")}</div></section>` + sec("Explore", `Popular places in ${r.n}`, brush(brushOf(cs.flatMap(c => [c, ...kids(c)]).filter(x => isPlace(x) && !x.draft).sort((a, b) => pkgsAt(b).length - pkgsAt(a).length).slice(0, 8)))) + sec("Countries", `Countries in ${r.n}`, cards(cs.map(topCard))) + sec("Plan by season", "Best time for each country", table, { cls: "tight" }) + (ps.length ? sec("Itineraries", `${r.n} tour packages`, cards(ps.map(pkgCard))) : "") + cta(`Plan a ${r.n} holiday`, "Single-country or multi-country, we build the route around your dates.", r.n + " holiday"),
  }), "destinations");
}
// hubs
{
  const sts = STATES.map(s => N.get(s.s)).filter(s => !s.draft);
  emit(hubIN.url, page({
    path: hubIN.url, active: "/destinations/", title: "India Tour Packages & Destinations | Nexara Holidays", desc: clip(`Explore ${sts.length} Indian states and ${[...N.values()].filter(n => n.dom && isPlace(n) && !n.draft).length} destinations: hill stations, beaches, heritage and wildlife. Itineraries planned from ${SITE.city}.`),
    h1: "Incredible India, planned for you", scr: "Domestic holidays", sub: esc(firstSentence(INDIA.d)), crumbs: [["Home", "/"], ["Destinations", "/destinations/"], ["India", hubIN.url]], hero: N.get("kerala")?.img ? { img: N.get("kerala").img, credit: N.get("kerala").photo } : { m: "temple", g: "#5a2a1e,#b3562b,#ff8a3d" },
    body: `<section><div class="prose">${INDIA.d.split(/\n\n+/).map(p => `<p>${esc(p)}</p>`).join("")}</div></section>` + sec("Popular", "Popular places in India", brush(brushOf(POP_IN))) + sec("By region", "India's regions", cards(inReg.map(r => ({ url: r.url, name: r.n, ...motifFor(r.m == "sea" ? "beach" : r.m == "peak" ? "hill" : "heritage", r.s), g: r.g || motifFor("heritage", r.s).g, m: r.m || "temple", img: r.img, sm: r.sm, text: firstSentence(r.d), best: r.states.map(s => N.get(s).n).join(", "), bestLabel: "States", go: "Explore" })))) + sec("All states", "States and union territories", cards(sts.map(topCard))) + cta("Plan an India holiday", "Tell us what you enjoy and we suggest the right region for the season.", "India holiday"),
  }), "destinations");
  const cs = COUNTRIES.map(c => N.get(c.s)).filter(c => !c.draft);
  emit(hubW.url, page({
    path: hubW.url, active: "/destinations/", title: "International Tour Packages from India | Nexara Holidays", desc: clip(`${cs.length} countries across ${wReg.length} regions, from Dubai and Bali to Europe and Japan. International holidays planned from ${SITE.city}.`),
    h1: "International holidays", scr: "Explore the world", sub: esc(firstSentence(WORLD.d)), crumbs: [["Home", "/"], ["Destinations", "/destinations/"], ["International", hubW.url]], hero: { img: "/assets/photos/vw/santorini.webp" },
    body: `<section><div class="prose">${WORLD.d.split(/\n\n+/).map(p => `<p>${esc(p)}</p>`).join("")}</div></section>` + sec("Popular", "Popular destinations abroad", brush(brushOf(POP_INTL))) + sec("By region", "Regions of the world", cards(wReg.map(r => ({ url: r.url, name: r.n, m: r.m || "sea", img: r.img, sm: r.sm, g: r.g || motifFor("beach", r.s).g, text: firstSentence(r.d), best: COUNTRIES.filter(c => c.rg == r.s).map(c => c.n).join(", "), bestLabel: "Countries", go: "Explore" })))) + sec("All countries", "Countries we plan", cards(cs.map(topCard))) + cta("Plan an international holiday", "Visa guidance, flights from Chennai and a day-by-day plan, all in one quote.", "International holiday"),
  }), "destinations");
  emit("/destinations/", page({
    path: "/destinations/", active: "/destinations/", title: "Destinations: India & International Holidays | Nexara Holidays", desc: clip(`Browse every destination we plan: ${sts.length} Indian states and ${cs.length} countries, with best times to visit, top sights and ready itineraries.`),
    h1: "Where do you want to go?", scr: "Destination directory", sub: "Every place we plan, from Indian hill stations to European capitals.", crumbs: [["Home", "/"], ["Destinations", "/destinations/"]], hero: { img: "/assets/photos/t/hero-world.webp" },
    body: sec("Trending", "Trending destinations", brush(brushOf([...POP_INTL.slice(0, 6), ...POP_IN.slice(0, 6)]))) + `<div class="alt">` + sec("India", "Destinations in India", `<div class="groups">${inReg.map(r => `<div><h3><a href="${r.url}">${esc(r.n)}</a><small>${r.states.length} states</small></h3>${linkList(r.states.map(s => N.get(s)).filter(s => !s.draft).flatMap(s => [[s.n, s.url, "State"], ...kids(s).filter(c => !c.draft).map(c => [c.n, c.url, s.n])]))}</div>`).join("")}</div>`) +
      `</div>${sec("International", "Destinations abroad", `<div class="groups">${wReg.map(r => `<div><h3><a href="${r.url}">${esc(r.n)}</a><small>${COUNTRIES.filter(c => c.rg == r.s).length} countries</small></h3>${linkList(COUNTRIES.filter(c => c.rg == r.s).map(c => N.get(c.s)).filter(c => !c.draft).flatMap(c => [[c.n, c.url, "Country"], ...kids(c).filter(x => !x.draft).map(x => [x.n, x.url, c.n])]))}</div>`).join("")}</div>`)}` + cta("Not sure where to go?", "Tell us your budget, dates and travel style and we will suggest three options.", ""),
  }), "pages");
}

/* ---------- 8. packages ---------- */
function transfer(a, b, dom) {
  if (a === b) return "";
  const d = hav(a, b), isl = /island|beach/.test((a.t || "") + (b.t || "")) && (a.isl || b.isl);
  const cross = top(a) !== top(b) && !dom ? ` and cross into ${top(b).n}` : "";
  if (a.ferry?.includes(b.s) || b.ferry?.includes(a.s)) return `Ferry from ${a.n} to ${b.n}${cross} (sailing times vary by season and are confirmed in your quote)`;
  if (isl && d > 20) return `Transfer from ${a.n} to ${b.n}${cross} by ferry or short flight, depending on schedules`;
  if (d < 260) return `Travel from ${a.n} to ${b.n}${cross} by private vehicle${d > 120 ? ", with stops on the way" : ""}`;
  if (d < 520) return `Travel from ${a.n} to ${b.n}${cross} by road or train, or fly where it saves time (we compare options in your quote)`;
  return `Fly from ${a.n} to ${b.n}${cross} (flight timings confirmed in your quote)`;
}
// How each kind of trip is set up differently. The first matching theme of a package decides which sights its
// day plan favours (rx) and the planning notes shown on its page.
const FOCUS = {
  "honeymoon": { rx: /sunset|cruise|spa|dinner|lake|beach|view|garden|palace|boat|island|massage|lagoon|villa/i, notes: ["Fewer hotel changes and later starts, so mornings are yours", "A room upgrade request and a cake or flower decoration on one night, on request and subject to the hotel", "Evenings kept free for sunsets and dinners rather than packed with sightseeing", "Private transfers throughout instead of shared coaches"] },
  "family-holidays": { rx: /zoo|park|aquarium|safari|theme|boat|beach|garden|museum|show|train|cable|ropeway|wildlife|elephant|lake/i, notes: ["Daily drives kept short, with stops for children", "Family rooms, connecting rooms or extra beds requested and confirmed in the quote", "One active day followed by a slower morning", "Child-friendly sights and meals noted for each stop"] },
  "couples": { rx: /sunset|walk|view|lake|garden|café|cafe|cruise|spa|market/i, notes: ["A relaxed pace with two-night stays where possible", "One special dinner or experience suggested at each stop", "Flexible days you can fill as you like"] },
  "group-tours": { rx: /show|night|market|water sports|island|beach|party|street|safari|boat/i, notes: ["Vehicle sized for the whole group and its luggage", "Rooms quoted on twin or triple sharing, with single supplements shown", "One point of contact in your group for changes", "Group activities pre-booked so you are not split up"] },
  "educational-tours": { rx: /museum|observatory|fort|temple|caves?|heritage|monument|palace|library|science|dam|workshop|ruins/i, notes: ["Each stop linked to a learning theme agreed with teachers in advance", "Licensed guides briefed for student groups", "Supervised schedules with fixed meeting points and times", "Dietary lists and emergency contacts shared before travel"] },
  "luxury-holidays": { rx: /palace|villa|spa|lake|cruise|private|view|dinner|garden/i, notes: ["Hotels chosen for the room and setting, not only the star rating", "Private guides and vehicles throughout", "Longer stays so you can enjoy the hotels", "Priority or skip-the-line entry booked where it exists"] },
  "budget-holidays": { rx: /market|walk|beach|temple|street|view|park|free/i, notes: ["Well-reviewed three-star or guesthouse stays in central locations", "Shared tours where they save money without spoiling the experience", "Free and low-cost sights given priority", "Fewer hotel changes to cut transfer costs"] },
  "adventure": { rx: /trek|hike|raft|dive|snorkel|kayak|climb|paraglid|zip|bungee|jeep|safari|canyon|sandboard|sled|ski|surf|cave/i, notes: ["Activities booked with licensed, insured operators", "Fitness level and experience checked before we confirm each activity", "Weather and season buffers built in for outdoor days", "Travel insurance covering the activities strongly recommended"] },
  "wildlife-safaris": { rx: /safari|national park|wildlife|sanctuary|reserve|bird|elephant|tiger|rhino|lion|game|whale|dolphin|turtle|penguin/i, notes: ["Safari permits booked as soon as dates are fixed, as zones sell out", "Early-morning and afternoon drives when animals are most active", "Lodges chosen close to park gates", "Naturalist-led drives where available"] },
  "pilgrimage-tours": { rx: /temple|mandir|shrine|ghat|aarti|darshan|mosque|church|monastery|stupa|gurudwara|sacred|holy|basilica|jyotirlinga/i, notes: ["Darshan and aarti timings planned around temple hours", "Online darshan or registration booked through official channels where available", "Comfortable pace and short walks planned for elders", "Dress codes and rules for each shrine shared before you go"] },
  "cultural-holidays": { rx: /temple|museum|fort|palace|heritage|old town|old city|cathedral|church|mosque|monastery|ruins|caves?|gallery|market|quarter/i, notes: ["Licensed local guides at the major heritage sites", "Timed tickets booked for sites that need them", "Craft, music or cooking experiences added where they fit", "Time built in to explore old quarters on foot"] },
  "beach-holidays": { rx: /beach|island|snorkel|lagoon|bay|boat|water sports|sunset|coast|sea/i, notes: ["Beachfront or walk-to-beach hotels requested", "Boat and island trips planned for calm-sea mornings", "Free beach days between excursions"] },
  "island-holidays": { rx: /island|beach|snorkel|dive|lagoon|boat|ferry|reef|sunset/i, notes: ["Ferries and boats booked with buffer time before flights", "No flight home on the same day as an outer-island ferry", "Snorkelling and reef trips planned for calm-sea days"] },
  "hill-stations": { rx: /view|lake|garden|tea|train|walk|falls|waterfall|peak|point|forest|valley|ropeway|cable/i, notes: ["Realistic drive times on hill roads", "Viewpoints planned for clear mornings", "Warm layers advised even in summer"] },
  "kids-holidays": { rx: /theme park|disney|universal|aquarium|zoo|safari|water ?park|science|museum|cable|ropeway|show|snow|santa|beach/i, notes: ["One big park or activity day followed by an easier morning", "Family or connecting rooms requested and confirmed in your quote", "Park and attraction tickets booked ahead where they sell out", "Child seats requested for transfers"] },
  "senior-friendly": { rx: /garden|lake|temple|cruise|museum|palace|view|boat|market/i, notes: ["Two- or three-night stays to limit hotel changes", "Ground-floor or lift-access rooms requested", "Short daily drives and rest built into each day", "Airport wheelchair assistance requested with the airline on request"] },
  "photography-tours": { rx: /sunrise|sunset|view|lake|valley|market|dunes?|old town|terraces|bridge|falls|temple|ghat|cliff/i, notes: ["Sunrise and sunset kept free for shooting", "Hotels close to the best viewpoints", "Extra time where weather can spoil the shot", "Local guides who know the angles"] },
  "food-tours": { rx: /market|food|street|cooking|café|cafe|tasting|bazaar|night market|tea|coffee|chocolate/i, notes: ["A guided food walk or market visit at each main stop", "A cooking class where available", "Vegetarian options checked in advance"] },
  "festival-trips": { rx: /festival|fair|aarti|lantern|ceremony|procession|market|show/i, notes: ["Dates confirmed against the official festival calendar each year", "Hotels booked early, as festival weeks sell out", "Viewing spots and timings planned with local contacts"] },
  "road-trips": { rx: /drive|pass|road|viewpoint|valley|village|lake|dunes?/i, notes: ["Daily driving kept to comfortable distances with scenic stops", "An experienced local driver who knows the roads", "Road and weather conditions checked before each long day"] },
  "train-journeys": { rx: /train|railway|rail|toy train|station|viaduct/i, notes: ["Train seats booked as soon as bookings open", "A road alternative planned in case seats are unavailable", "Luggage handled so you can travel light on board"] },
  "solo-travel": { rx: /walk|market|café|cafe|yoga|class|old town|street|trek/i, notes: ["Central, well-reviewed hotels with good solo-guest feedback", "Airport pick-up on arrival", "Small-group day tours where you can meet people"] },
  "cruise-holidays": { rx: /cruise|houseboat|boat|river|lake|backwater|bay|ferry|shikara/i, notes: ["The cruise or houseboat night booked first, then the route around it", "Cabin type confirmed in your quote", "Time on the water planned for the best light"] },
  "multi-country-tours": { rx: /old town|museum|view|market|palace|temple|tower|cruise/i, notes: ["Visa applications sequenced for each country", "Short flights or trains between countries chosen to save time", "Currency and SIM tips for each country"] },
  "short-breaks": { rx: /walk|view|market|beach|temple|palace|sunset/i, notes: ["One or two bases only", "Easy arrival-day plans after the journey", "The main sights first, with free time to finish"] },
  "weekend-getaways": { rx: /walk|view|market|beach|temple|sunset|café|cafe/i, notes: ["Fits a Friday-to-Sunday break", "Short journey from Chennai or nearby cities", "A relaxed final morning before heading home"] },
  "long-stays": { rx: /walk|museum|village|market|lake|garden|view/i, notes: ["Rest days built in every few days", "Laundry stops planned", "Travel insurance covering the full trip recommended"] },
};
const focusOf = p => p.themes.map(t => [t, FOCUS[t]]).filter(x => x[1]);

function itinerary(p) {
  if (p.sig) return p.d.map(([t, items]) => ({ t, items }));
  const days = []; let prev = null;
  const rx = focusOf(p)[0]?.[1].rx;
  p.stops.forEach(([n, k], si) => {
    const raw = [...n.a.map(([nm, ds]) => ({ nm, ds })), ...n.ac.map(x => ({ nm: x }))];
    // sights that suit the trip's main theme come first, so variants of the same route plan different days
    const fits = x => rx.test(x.nm + " " + (x.ds || ""));
    const pool = rx ? [...raw.filter(fits), ...raw.filter(x => !fits(x))] : raw;
    // each package starts at a different point in the pool so routes through the same city do not read identically
    let pi = (p.slug.length + si) % Math.max(1, Math.min(2, n.a.length - 1));
    const take = c => { const r = []; for (let j = 0; j < c && pi < pool.length; j++) r.push(pool[pi++]); return r };
    const line = x => x.ds ? `${x.nm}: ${x.ds}` : x.nm;
    for (let d = 0; d < k; d++) {
      const items = []; let t;
      if (d == 0 && si == 0) { t = `Arrive in ${n.n}`; items.push(`Arrive via ${n.r[0].split(/,\s/)[0]} and transfer to your hotel`); items.push("Check in and settle in"); take(1).forEach(x => items.push("Later: " + line(x))) }
      else if (d == 0) { t = `${prev.n} to ${n.n}`; items.push(transfer(prev, n, p.dom)); items.push(`Check in at your ${n.n} hotel`); take(1).forEach(x => items.push(line(x))) }
      else { const h = take(2); t = h.length ? `${n.n}: ${h.map(x => x.nm).join(" and ")}` : `${n.n} at your own pace`; h.forEach(x => items.push(line(x))); if (!h.length) items.push(`A free day in ${n.n}. Relax, shop or add an optional excursion; ask us for ideas`) }
      if (p.themes.includes("honeymoon") && si == p.stops.length - 1 && d == k - 1 && k > 1) items.push("Optional: a private candlelight dinner (arranged on request)");
      days.push({ t, items });
    }
    prev = n;
  });
  const last = p.stops[p.stops.length - 1][0];
  days.push({ t: `Depart from ${last.n}`, items: ["Breakfast and hotel check-out", `Transfer to ${last.r[0].split(/,\s/)[0]} for your journey home`] });
  return days;
}
const DEF_IN = { dom: ["Hotel stay for {n} nights with daily breakfast (hotel category as per your quote)", "Private air-conditioned vehicle for transfers and sightseeing as per the itinerary", "Pick-up and drop at the arrival and departure point", "Driver allowances, tolls, parking and fuel for the itinerary route", "Trip support from our Chennai team on WhatsApp"], intl: ["Hotel stay for {n} nights with daily breakfast (hotel category as per your quote)", "Airport transfers and sightseeing as per the itinerary (private or shared, stated in your quote)", "Entry tickets for the sightseeing listed in your quote", "Visa documentation guidance before you travel", "Trip support from our Chennai team on WhatsApp"] };
const DEF_EX = { dom: ["Flights or train tickets unless added to your quote", "Lunch and dinner unless stated", "Entry tickets, camera fees and optional activities unless stated", "Personal expenses such as laundry, tips and shopping", "Travel insurance", "GST as applicable"], intl: ["International flights unless added to your quote", "Visa fees and travel insurance", "Lunch and dinner unless stated", "Optional activities and personal expenses", "City or tourism taxes payable at hotels where applicable", "GST and TCS as applicable under Indian tax rules"] };

// package header: the package photo first, then each stop and its attractions
function pkgSpot(p, uniq, eye, forWho, bts) {
  const v = pkgVis(p), pool = [];
  const add = (img, cap) => { if (img && !pool.some(o => o.img == img)) pool.push({ img, cap }) };
  for (const n of uniq) { add(n.img, n.kind == "city" ? `${n.n}, ${n.parent.n}` : n.n); for (const [a] of n.a.slice(0, 3)) add(PHOTOS[`${n.s}--${slugify(a)}`]?.img, `${a} – ${n.n}`) }
  const first = pool.find(o => o.img == v.img), slides = (first ? [first, ...pool.filter(o => o !== first)] : pool).slice(0, 4);
  const T = top(p.home);
  return spotlight({
    eye, h1: hiName(p.name, [p.home, ...uniq].find(n => p.name.toLowerCase().includes(n.n.toLowerCase()))?.n || p.home.n), desc: esc(p.sum), label: "Trip at a glance", best: bts[0],
    facts: [["cal", "Duration", `${p.days} days / ${p.nights} nights`], ["plane", "Starts in", uniq[0].n], ["route", "Route", clipV(uniq.map(n => n.n).join(" · "))], ["pin", "Places", `${uniq.length} destination${uniq.length == 1 ? "" : "s"}`],
      ["globe", p.dom ? "State" : "Country", p.dom ? `${T.n}, India` : T.n], ["heart", "Ideal for", forWho.slice(0, 2).join(", ")], ["star", "Trip style", p.sig ? p.style || "Group departure" : "Private, customisable"], ["doc", "Package code", p.id]],
    btns: `<a class="spbtn" href="/custom-tour/" data-enq data-trip="${esc(p.name)}">Request a quote <span>${IC.arrow}</span></a><a class="spwa" href="#itinerary"><i>${IC.cal}</i>See the day-by-day plan</a>`,
    slides, ...(v.img ? {} : v),
  });
}
for (const p of PK) {
  const dd = itinerary(p), places = p.stops.map(([n]) => n);
  const uniq = [...new Map(places.map(n => [n.s, n])).values()];
  const bts = [...new Set(uniq.map(monthsOf))];
  const forWho = p.themes.filter(t => THEME_LABEL[t] && !["short-breaks", "long-stays", "weekend-getaways"].includes(t)).map(t => THEME_LABEL[t]);
  const inc = p.i || (p.dom ? DEF_IN.dom : DEF_IN.intl).map(x => x.replace("{n}", p.nights));
  const exc = p.x || (p.dom ? DEF_EX.dom : DEF_EX.intl);
  const routeHtml = `<ol class="route">${p.stops.map(([n, k]) => `<li><a href="${n.url}">${esc(n.n)} <small>${k}N</small></a></li>`).join("")}</ol>`;
  const tips = uniq.filter(n => n.tip).map(n => `<li><strong>${esc(n.n)}:</strong> ${esc(n.tip)}</li>`).join("");
  const overview = `<p class="lede">${esc(p.sum)}</p><p>${p.sig ? esc(p.over || "") : `The route spends ${list(p.stops.map(([n, k]) => `${k} night${k > 1 ? "s" : ""} in ${n.n}`))}, so you get time for the main sights without changing hotels every day. It suits ${forWho.length ? list(forWho.map(x => x.toLowerCase())) : "most travellers"}, and every day can be shortened, swapped or extended.`}</p>`;
  const qa = [
    ["Can I change this itinerary?", "Yes. This is a private, customisable itinerary. We can add or remove nights, change hotels, swap sightseeing and adjust the pace before you book."],
    [`When is the best time for this trip?`, uniq.map(n => `${esc(n.n)}: ${esc(n.bt[0])}`).join(". ") + "."],
    [`How do I start the trip from ${SITE.city}?`, `The trip begins in ${esc(places[0].n)} (${esc(places[0].r[0])}). We can add ${p.dom ? "flights or train tickets" : "return flights"} from ${SITE.city} or any other city to your quote.`],
    ["How much does this package cost?", p.pr ? `${esc(p.pr)}${p.prNote ? " " + esc(p.prNote) : ""}. Final price and inclusions are confirmed in your written quote.` : "We quote each trip individually because the price depends on travel dates, hotel category, room sharing and group size. Request a quote and we send a price on WhatsApp."],
  ];
  if (!p.dom) qa.push(["What documents do I need?", "A passport valid for at least six months beyond your return date is commonly required. Visa and entry rules for Indian citizens vary by country and change, so we confirm the current requirements from official sources when you book."]);
  const rel = PK.filter(q => q !== p).map(q => [q, q.stops.filter(([n]) => places.includes(n)).length * 3 + (q.home === p.home ? 2 : 0) + q.themes.filter(t => p.themes.includes(t)).length]).filter(x => x[1] > 2).sort((a, b) => b[1] - a[1] || Math.abs(a[0].days - p.days) - Math.abs(b[0].days - p.days)).slice(0, 6).map(x => x[0]);
  const main = `<div class="prose"><h2 id="overview">Trip overview</h2>${overview}${routeHtml}
<h2 id="highlights">Highlights</h2>${tags([...new Set(uniq.flatMap(n => n.a.slice(0, 3).map(a => a[0])))].slice(0, 10))}
</div><h2 id="itinerary" style="font-size:clamp(1.5rem,3vw,2rem);margin:38px 0 12px">Day-by-day itinerary</h2><div class="days"><div class="dayx"><button type="button" data-x="open">Expand all</button><button type="button" data-x="close">Collapse all</button></div>${dd.map((d, i) => `<div class="day${i ? "" : " open"}"><h3><span><em>Day ${i + 1}</em>${esc(d.t)}</span></h3><ul>${d.items.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>`).join("")}</div>
<div class="prose">${focusOf(p).length && !p.sig ? `<h2 id="how-planned">How this version is planned</h2><ul>${[...new Set(focusOf(p).slice(0, 2).flatMap(([, f]) => f.notes))].slice(0, 5).map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}${p.sig ? "" : note("This is a suggested itinerary. Sightseeing order may change with opening days, weather and local conditions; your final plan is in your written quote.")}${tips ? `<h2 id="tips">Good to know</h2><ul>${tips}</ul>` : ""}</div>`;
  const aside = `<aside><div class="box"><h3>At a glance</h3>${kv([["Duration", `${p.days} days / ${p.nights} nights`], ["Route", esc(uniq.map(n => n.n).join(", "))], ["Ideal for", esc(forWho.slice(0, 3).join(", "))], ["Best time", esc(bts.join("; "))], ["Trip style", p.sig ? esc(p.style || "Group departure") : "Private, customisable"], ["Package code", p.id]])}${p.pr ? `<p class="quote-p">${esc(p.pr)}</p><p class="quote-s">${esc(p.prNote || "")}</p>` : ""}</div>${quoteBox(p.name)}<div class="box"><h3>${p.sig ? "Included" : "Typically included"}</h3><ul class="sd" style="list-style:none;padding:0;margin:0">${inc.map(x => `<li class="y" style="padding:6px 0;border-bottom:1px dashed var(--line);font-size:.9rem">${esc(x)}</li>`).join("")}</ul><h3 style="margin-top:18px">Not included</h3><ul style="list-style:none;padding:0;margin:0">${exc.map(x => `<li class="n" style="padding:6px 0;border-bottom:1px dashed var(--line);font-size:.9rem">${esc(x)}</li>`).join("")}</ul>${p.sig ? "" : `<p class="quote-s" style="margin-top:12px">Final inclusions are listed in your written quote.</p>`}</div></aside>`;
  const scr = p.sig ? p.tag : THEME_LABEL[p.themes[0]] || (p.dom ? "India" : top(p.home).n);
  const crumbs = [["Home", "/"], ["Tour packages", "/tour-packages/"], [p.dom ? "India" : "International", p.dom ? "/tour-packages/india/" : "/tour-packages/international/"], [p.home.n, p.home.url], [p.name, p.url]];
  const ld = { "@context": "https://schema.org", "@type": "TouristTrip", name: p.name, description: p.sum, url: abs(p.url), touristType: forWho.slice(0, 4), itinerary: { "@type": "ItemList", numberOfItems: uniq.length, itemListElement: uniq.map((n, i) => ({ "@type": "ListItem", position: i + 1, item: { "@type": "TouristDestination", name: n.n, url: abs(n.url) } })) }, provider: { "@type": "TravelAgency", name: SITE.name, url: SITE.origin + "/" } };
  emit(p.url, page({
    path: p.url, active: "/tour-packages/", title: clipT(`${p.name} – ${p.days} Days ${p.nights} Nights | Nexara Holidays`), desc: clip(`${p.days}-day ${p.name} itinerary: ${uniq.map(n => n.n).join(", ")}. ${p.sum}`),
    h1: p.name, crumbs, hero: { img: pkgVis(p).img, spot: pkgSpot(p, uniq, scr, forWho, bts) }, jsonld: [ld],
    body: `<div class="lay"><div>${main}</div>${aside}</div>` + sec("FAQs", "Questions about this trip", faq(qa), { cls: "tight" }) + (rel.length ? `<div class="alt">${sec("You may also like", "Similar itineraries", cards(rel.map(pkgCard)))}</div>` : "") + sec("Destinations on this trip", "Read more about each stop", cards(uniq.map(placeCard), "sm")) + cta(`Ready for ${p.name}?`, "Share your dates and we send a quote with hotels and a price on WhatsApp.", p.name),
  }), "packages");
}
function clip(s, n = 158) { s = s.replace(/\s+/g, " ").trim(); if (s.length <= n) return s; const c = s.slice(0, n - 1); return c.slice(0, c.lastIndexOf(" ")).replace(/[,;:.\-–]$/, "") + "…" }
function clipT(s) { return s.length > 70 ? s.replace(" | Nexara Holidays", "") : s }
function fitTitle(...options) { return options.find(o => o.length <= 70) || options[options.length - 1] }

// package listings
function pkgGroups(arr, keyFn) {
  const m = new Map(); for (const p of arr) { const k = keyFn(p); if (!m.has(k)) m.set(k, []); m.get(k).push(p) }
  return [...m.entries()];
}
{
  const dom = PK.filter(p => p.dom), intl = PK.filter(p => !p.dom);
  const gHtml = (arr, label) => `<div class="groups">${pkgGroups(arr, p => p.home).map(([h, ps]) => `<div id="${h.s}"><h3><a href="${h.url}">${esc(h.n)}</a><small>${ps.length} itinerar${ps.length == 1 ? "y" : "ies"}</small></h3>${cards(ps.map(pkgCard), "sm")}</div>`).join("")}</div>`;
  const jump = arr => `<p class="byline">Jump to: ${pkgGroups(arr, p => p.home).map(([h]) => `<a href="#${h.s}" style="color:var(--red)">${esc(h.n)}</a>`).join(" · ")}</p>`;
  emit("/tour-packages/india/", page({
    path: "/tour-packages/india/", active: "/tour-packages/", title: "India Tour Packages: Domestic Holidays from Chennai | Nexara Holidays", desc: clip(`${dom.length} domestic itineraries across ${new Set(dom.map(p => p.home)).size} states: Kerala, Kashmir, Rajasthan, Goa, the Himalaya, the Northeast and more. Private, customisable trips.`),
    h1: "India tour packages", scr: "Domestic holidays", sub: `${dom.length} customisable itineraries across India. Request a quote for your dates.`, crumbs: [["Home", "/"], ["Tour packages", "/tour-packages/"], ["India", "/tour-packages/india/"]], hero: { m: "temple", g: "#5a2a1e,#b3562b,#ff8a3d" },
    body: sec("By state", "Choose a state", jump(dom) + gHtml(dom)) + cta("Can't find your route?", "Tell us where you want to go and we will build it.", "India holiday"),
  }), "pages");
  emit("/tour-packages/international/", page({
    path: "/tour-packages/international/", active: "/tour-packages/", title: "International Tour Packages from Chennai | Nexara Holidays", desc: clip(`${intl.length} international itineraries in ${new Set(intl.map(p => p.home)).size} countries: Dubai, Bali, Europe, Japan, Singapore, Thailand and more, planned from Chennai.`),
    h1: "International tour packages", scr: "Holidays abroad", sub: `${intl.length} customisable itineraries in ${new Set(intl.map(p => p.home)).size} countries.`, crumbs: [["Home", "/"], ["Tour packages", "/tour-packages/"], ["International", "/tour-packages/international/"]], hero: { img: "/assets/photos/vw/switzerland.webp" },
    body: sec("By country", "Choose a country", jump(intl) + gHtml(intl)) + cta("Planning a multi-country trip?", "We combine countries, flights and visas into one plan.", "International holiday"),
  }), "pages");
  const feat = TYPES.filter(t => !t.draft && pkgsOfType(t.s).length).slice(0, 12);
  emit("/tour-packages/", page({
    path: "/tour-packages/", active: "/tour-packages/", title: "All Tour Packages: India & International Holidays | Nexara Holidays", desc: clip(`${PK.length} itineraries in India and abroad, from 2-day getaways to 15-day tours. Honeymoon, family, group and adventure trips, planned from Chennai.`),
    h1: "All tour packages", scr: "Handpicked journeys", sub: `${PK.length} itineraries: ${dom.length} in India and ${intl.length} abroad. Every one is private and customisable.`, crumbs: [["Home", "/"], ["Tour packages", "/tour-packages/"]], hero: { img: "/assets/photos/vw/maldives.webp" },
    body: sec("Holidays in India", `India: ${dom.length} itineraries`, `<p><a class="btn red" href="/tour-packages/india/">Browse India packages →</a></p>` + linkList(pkgGroups(dom, p => p.home).map(([h, ps]) => [h.n, `/tour-packages/india/#${h.s}`, `${ps.length} itineraries`])), { cls: "tight" }) +
      sec("Holidays abroad", `International: ${intl.length} itineraries`, `<p><a class="btn red" href="/tour-packages/international/">Browse international packages →</a></p>` + linkList(pkgGroups(intl, p => p.home).map(([h, ps]) => [h.n, `/tour-packages/international/#${h.s}`, `${ps.length} itineraries`])), { cls: "tight" }) +
      sec("Signature departures", "Fixed-date group and honeymoon trips", cards(PK.filter(p => p.sig).map(pkgCard)), { p: "Departures from Chennai with confirmed inclusions." }) +
      `<div class="alt">${sec("By theme", "Find packages by travel style", linkList(feat.map(t => [t.n, `/tour-types/${t.s}/`, `${pkgsOfType(t.s).length} itineraries`])))}</div>` + cta("Want something different?", "Every trip is custom. Tell us your idea and we will price it.", ""),
  }), "pages");
}

/* ---------- 9. tour types ---------- */
function typeSpot(t, ps, pd, pi, places) {
  const slides = [], add = (img, cap) => { if (img && !slides.some(o => o.img == img)) slides.push({ img, cap }) };
  add(t.img, t.n); for (const p of ps) { if (slides.length == 4) break; add(pkgVis(p).img, p.name) }
  const days = ps.map(p => p.days);
  return spotlight({
    eye: t.scr || "Holiday themes", h1: hiName(t.h1 || t.n, t.n), desc: esc(t.sub || t.desc), label: `${t.n} at a glance`,
    facts: [["route", t.sample ? "Sample itineraries" : "Itineraries", ps.length ? String(ps.length) : ""], ["pin", "In India", pd.length ? `${pd.length} itineraries` : ""], ["plane", "Abroad", pi.length ? `${pi.length} itineraries` : ""],
      ["globe", "Destinations", places.length ? `${places.length} places` : ""], ["cal", "Trip lengths", days.length ? `${Math.min(...days)} to ${Math.max(...days)} days` : ""], ["star", "Trip style", "Private, customisable"],
      ["user", "Best suited to", clipV(t.who?.[0] || "")], ["heart", "Also suits", clipV(t.who?.[1] || "")]],
    btns: (ps.length ? `<a class="spbtn" href="#itineraries">See the itineraries <span>${IC.arrow}</span></a>` : `<a class="spbtn" href="/custom-tour/" data-enq data-trip="${esc(t.n)}">Plan my trip <span>${IC.arrow}</span></a>`) +
      `<a class="spwa" href="${waLink(`Hi Nexara Holidays, I would like to plan a trip: ${t.n}.`)}" target="_blank" rel="noopener"><i>${IC.wa}</i>Ask on WhatsApp</a>`,
    slides, m: t.m || "temple", g: t.g,
  });
}
for (const t of TYPES) {
  const sampled = t.sample ? [...new Map(PK.filter(p => !p.sig).map(p => [p.home, p])).values()].filter((_, i, a) => i % Math.max(1, Math.floor(a.length / t.sample)) == 0).slice(0, t.sample) : [];
  const ps = t.sample ? sampled : pkgsOfType(t.s);
  const places = t.places ? t.places.map(s => N.get(s)).filter(n => { if (!n) warn(`type ${t.s}: unknown place`); return n && !n.draft }) : [...N.values()].filter(n => isPlace(n) && !n.draft && t.tags && t.tags.some(g => (" " + n.t + " ").includes(" " + g + " ")));
  if (t.draft) { draft("tour-type", t.s, t.draftWhy || "marked draft"); continue }
  if (ps.length + places.length < 3) { draft("tour-type", t.s, "fewer than 3 matching packages/destinations"); continue }
  const r = renderMd(t.body, resolveSlug, m => report.missingLinks.push({ page: "type:" + t.s, missing: [m] }));
  const pd = ps.filter(p => p.dom), pi = ps.filter(p => !p.dom);
  t.url = `/tour-types/${t.s}/`;
  const spots = KID_SPOTS.filter(v => v.type === t);
  const spotSec = spots.length ? `<div class="alt">${sec("Must-see for kids", "The big kids' places around the world", spotTabs(spots) + cards(spots) + `<p class="fcount">${spots.length} places</p>`, { id: "places" })}</div>` : "";
  // Tamil Nadu leads every theme: its trips in this style, else its places that fit, else the state's best-known places
  const TN = N.get("tamil-nadu"), tnPk = ps.filter(inTN), tnPl = places.filter(n => top(n) === TN);
  const tnTiles = brushOf((tnPl.length ? tnPl : kids(TN).filter(n => !n.draft).sort((a, b) => pkgsAt(b).length - pkgsAt(a).length)).slice(0, 8));
  const tnSec = TN ? sec("Tamil Nadu", `${t.n} in Tamil Nadu`, (tnPk.length ? cards(tnPk.slice(0, 6).map(pkgCard)) : `<p class="tnlead">${tnPl.length ? `Places in Tamil Nadu that suit ${esc(t.n.toLowerCase())}. Tell us your dates and we plan the trip.` : `We plan ${esc(t.n.toLowerCase())} in Tamil Nadu on request. Start from one of these places, or tell us what you have in mind.`}</p>`) + (tnPk.length ? "" : brush(tnTiles)) +
    `<p class="tnmore"><a class="btn red" href="/custom-tour/" data-enq data-trip="${esc(t.n)} in Tamil Nadu">Plan ${esc(t.n.toLowerCase())} in Tamil Nadu →</a> <a class="btn ghost2" href="${TN.url}">Explore Tamil Nadu</a></p>`, { id: "tamil-nadu" }) : "";
  const tnN = tnPk.length;
  emit(t.url, page({
    path: t.url, active: "/tour-types/", title: clipT(`${t.title || t.n + " Packages"} | Nexara Holidays`), desc: clip(t.desc),
    h1: t.h1 || t.n, crumbs: [["Home", "/"], ["Holiday themes", "/tour-types/"], [t.n, t.url]], hero: { img: t.img, spot: typeSpot(t, ps, pd, pi, places) },
    body: `<div class="lay"><div class="prose">${r.html}</div><aside>${quoteBox(t.n)}${t.who ? `<div class="box"><h3>Best suited to</h3><ul class="dat">${t.who.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>` : ""}</aside></div>` + `<div class="alt">${tnSec}</div>` + spotSec +
      (ps.length ? sec("Itineraries", t.sample ? "Itineraries to start from" : `${t.n}: ${ps.length} itineraries`, (pd.length && pi.length || tnN ? filterTabs([["all", "All"], ...(tnN ? [["tamil-nadu", `Tamil Nadu (${tnN})`]] : []), ...(pd.length ? [["india", `India (${pd.length})`]] : []), ...(pi.length ? [["international", `International (${pi.length})`]] : [])]) : "") + cards(ps.map(pkgCard)) + `<p class="fcount">${ps.length} itineraries</p>`, { id: "itineraries" }) : "") +
      (places.length ? `<div class="alt">${sec("Where to go", `Destinations for ${t.n.toLowerCase()}`, cards(places.slice(0, 24).map(placeCard), "sm"))}</div>` : "") +
      (t.faq?.length ? sec("FAQs", `${t.n} FAQs`, faq(t.faq.map(([q, a]) => [q, esc(a)])), { cls: "tight" }) : "") + cta(`Plan your ${t.n.toLowerCase()} trip`, "Tell us your dates and budget and we send a plan with a price.", t.n),
  }), "pages");
}
{
  const live = TYPES.filter(t => t.url);
  emit("/tour-types/", page({
    path: "/tour-types/", active: "/tour-types/", title: "Holiday Themes: Honeymoon, Family, Adventure & More | Nexara Holidays", desc: clip(`Browse ${live.length} holiday themes, from honeymoons and family trips to safaris, pilgrimages, cruises and train journeys, with matching itineraries.`),
    h1: "Holidays by theme", scr: "Travel your way", sub: "Pick the kind of trip you want and see itineraries that fit.", crumbs: [["Home", "/"], ["Holiday themes", "/tour-types/"]], hero: { img: "/assets/photos/vw/cappadocia.webp" },
    body: sec("Themes", "Choose a travel style", `<div class="acards ph">${live.map(t => `<a class="acard" href="${t.url}">${(t.img || pkgsOfType(t.s).map(p => pkgVis(p).img).find(Boolean)) ? `<img class="aci" src="${t.img || pkgsOfType(t.s).map(p => pkgVis(p).img).find(Boolean)}" alt="" loading="lazy">` : ""}<small>${pkgsOfType(t.s).length} itineraries</small><h3>${esc(t.n)}</h3><p>${esc(t.desc)}</p><span>Explore →</span></a>`).join("")}</div>`) + cta("Mixing styles?", "Honeymoon with adventure, family with wildlife: we plan combinations too.", ""),
  }), "pages");
}

/* ---------- 9b. sacred journeys (/sacred/): faith pilgrimages grouped by category, from content/sacred.mjs ---------- */
{
  const byName = new Map(PK.map(p => [p.name, p]));
  for (const c of SACRED) {
    c.url = `/sacred/${c.s}/`;
    c.ps = c.pk.map(n => { const p = byName.get(n); if (!p) warn(`sacred ${c.s}: unknown package "${n}"`); return p }).filter(Boolean);
    c.img = PHOTOS[c.hero]?.img || N.get(c.hero)?.img || c.ps.map(p => pkgVis(p).img).find(Boolean);
  }
  const all = [...new Set(SACRED.flatMap(c => c.ps))];
  // a package card that the India / abroad pages can filter by category
  const sacCard = p => { const v = pkgCard(p); return { ...v, t: v.t + " " + SACRED.filter(c => c.ps.includes(p)).map(c => c.s).join(" ") } };
  const catCards = cs => `<div class="acards ph">${cs.map(c => `<a class="acard" href="${c.url}">${c.img ? `<img class="aci" src="${c.img}" alt="" loading="lazy">` : ""}<small>${c.ps.length} itineraries</small><h3>${esc(c.n)}</h3><p>${esc(c.short)}</p><span>Explore →</span></a>`).join("")}</div>`;
  const how = `<div class="kc3">${SACRED_HUB.how.map(([h, p]) => `<div><h3>${esc(h)}</h3><p>${esc(p)}</p></div>`).join("")}</div>`;
  const crumb = [["Home", "/"], ["Sacred journeys", "/sacred/"]];

  for (const c of SACRED) {
    const pd = c.ps.filter(p => p.dom), pi = c.ps.filter(p => !p.dom);
    const places = [...new Set(c.ps.flatMap(p => p.stops.map(([n]) => n)))].filter(n => n && isPlace(n) && !n.draft);
    const t = { n: c.n, h1: c.n, scr: c.scr, sub: c.short, desc: c.desc, who: c.who, img: c.img, m: "temple" };
    const others = SACRED.filter(o => o !== c);
    emit(c.url, page({
      path: c.url, active: "/sacred/", title: clipT(`${c.n}: Pilgrimage Tours | Nexara Holidays`), desc: clip(c.desc),
      h1: c.n, crumbs: [...crumb, [c.n, c.url]], hero: { img: c.img, spot: typeSpot(t, c.ps, pd, pi, places) },
      body: `<div class="lay"><div class="prose">${renderMd(c.intro, resolveSlug).html}</div><aside>${quoteBox(c.n)}<div class="box"><h3>Best suited to</h3><ul class="dat">${c.who.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div></aside></div>` +
        sec("Itineraries", `${c.n}: ${c.ps.length} itineraries`, (pd.length && pi.length ? filterTabs([["all", "All"], ["india", `India (${pd.length})`], ["international", `International (${pi.length})`]]) : "") + cards(c.ps.map(pkgCard)) + `<p class="fcount">${c.ps.length} itineraries</p>`, { id: "itineraries" }) +
        `<div class="alt">${sec("How we plan", "Planned with reverence", how, { cls: "tight" })}</div>` +
        (places.length ? sec("Holy places", `Places on these journeys`, cards(places.slice(0, 12).map(placeCard), "sm")) : "") +
        (c.faq?.length ? `<div class="alt">${sec("FAQs", `${c.n}: common questions`, faq(c.faq.map(([q, a]) => [q, esc(a)])), { cls: "tight" })}</div>` : "") +
        sec("More sacred journeys", "Other faith journeys", linkList(others.map(o => [o.n, o.url, `${o.ps.length} itineraries`])), { cls: "tight" }) +
        cta(`Plan your ${c.n.toLowerCase()}`, "Tell us the shrines, dates and who is travelling, and we send a day-by-day plan with a price.", c.n),
    }), "pages");
  }

  // all sacred journeys in India / abroad, filterable by category
  for (const [u, dom, h, sub] of [["/sacred/india/", true, "Sacred journeys in India", "Temple yatras, gurdwaras, Jain tirths, dargahs, churches and Buddhist sites across India."], ["/sacred/international/", false, "Sacred journeys abroad", "Kailash, Nepal, the Holy Land, Rome, Sri Lanka, Bhutan and Hindu temples across Asia."]]) {
    const ps = all.filter(p => p.dom == dom), cs = SACRED.filter(c => c.ps.some(p => p.dom == dom));
    // the featured category (Tamil Nadu, home state) leads the India page
    const ft = dom && SACRED.find(c => c.feature);
    const feat = ft ? sec(ft.scr, ft.n, `<div class="prose"><p>${esc(ft.short)}</p></div>` + cards(ft.ps.slice(0, 6).map(pkgCard)) + `<p style="margin-top:18px"><a class="btn red" href="${ft.url}">All ${ft.ps.length} ${esc(ft.n)} itineraries →</a></p>`, { id: ft.s }) : "";
    emit(u, page({
      path: u, active: "/sacred/", title: clipT(`${h}: Pilgrimage Tours | Nexara Holidays`), desc: clip(`${ps.length} pilgrimage itineraries ${dom ? "in India" : "abroad"}. ${sub}`),
      h1: h, scr: SACRED_HUB.scr, sub: esc(sub), crumbs: [...crumb, [h, u]], hero: { img: cs[0]?.img },
      body: (feat ? feat + `<div class="alt">` : "") + sec(`${ps.length} itineraries`, h, filterTabs([["all", "All"], ...cs.map(c => [c.s, c.n])]) + cards(ps.map(sacCard)) + `<p class="fcount">${ps.length} itineraries</p>`, { id: "itineraries" }) + (feat ? "</div>" : "") +
        (feat ? sec("By category", "Choose a faith journey", catCards(cs)) : `<div class="alt">${sec("By category", "Choose a faith journey", catCards(cs))}</div>`) + cta(`Plan a pilgrimage ${dom ? "in India" : "abroad"}`, "Tell us the shrines and dates and we plan the route.", h),
    }), "pages");
  }

  const hubImg = PHOTOS[SACRED_HUB.hero]?.img;
  emit("/sacred/", page({
    path: "/sacred/", active: "/sacred/", title: SACRED_HUB.title, desc: clip(SACRED_HUB.desc), h1: SACRED_HUB.h1, scr: SACRED_HUB.scr, sub: esc(SACRED_HUB.sub), crumbs: crumb, hero: { img: hubImg },
    body: `<section><div class="prose">${renderMd(SACRED_HUB.intro, resolveSlug).html}</div></section>` +
      `<div class="alt">${sec("National + International", "Where would you like to go?", `<div class="acards ph">${[["/sacred/india/", "Sacred journeys in India", all.filter(p => p.dom), "Char Dham, Jyotirlingas, temple trails, gurdwaras, Jain tirths, dargahs and churches."], ["/sacred/international/", "Sacred journeys abroad", all.filter(p => !p.dom), "Kailash, Nepal, the Holy Land, Rome, Fatima, Sri Lanka, Bhutan and Hindu temples abroad."]].map(([u, h, ps, d], i) => `<a class="acard" href="${u}"><img class="aci" src="${PHOTOS[SACRED_HUB.tiles[i ? "abroad" : "india"]]?.img}" alt="" loading="lazy"><small>${ps.length} itineraries</small><h3>${esc(h)}</h3><p>${esc(d)}</p><span>Explore →</span></a>`).join("")}</div>`)}</div>` +
      Object.entries(SACRED_GROUPS).map(([k, h], i) => { const cs = SACRED.filter(c => c.group == k); return cs.length ? (i % 2 ? `<div class="alt">` : "<div>") + sec(h, h == SACRED_GROUPS.india ? "Faith journeys within India" : h == SACRED_GROUPS.abroad ? "Faith journeys beyond India" : "Journeys across faiths, in India and abroad", catCards(cs)) + "</div>" : "" }).join("") +
      `<div class="alt">${sec("How we plan", "Planned with reverence", how, { cls: "tight" })}</div>` +
      sec("FAQs", "Questions about sacred journeys", faq(SACRED_HUB.faq.map(([q, a]) => [q, esc(a)])), { cls: "tight" }) +
      cta("Plan a sacred journey", "Tell us the shrines you want to visit, your dates and who is travelling. We reply with a plan and a price.", "Sacred journey"),
  }), "pages");
}

/* ---------- 9c. travel experiences (/experiences/): business, heritage, education, cruises, yachts ---------- */
buildExperiences({ N, PHOTOS, TOPIC, emit, pkgsOfType, pkgCard, pkgsOf: f => PK.filter(f) });
{
  // home page: popular destinations as brush-label photo tiles (between the BRUSH markers in index.html)
  const f = path.join(ROOT, "index.html"), h = readFileSync(f, "utf8");
  const html = `<section class="brhome"><div class="h rv"><span class="eye">Popular destinations</span><h2>Where will you go next?</h2></div>${brush(brushOf([...POP_INTL.slice(0, 4), ...POP_IN.slice(0, 4)]))}<p class="brall"><a class="btn ghost2" href="/destinations/">All destinations →</a></p></section>` + partnerSec("rv");
  const out = h.replace(/(<!--BRUSH-->)[\s\S]*?(<!--\/BRUSH-->)/, (_, a, b) => a + html + b);
  if (out != h) writeFileSync(f, out);
}

/* ---------- 10. guides & blog ---------- */
const articleLd = (a, kind) => ({ "@context": "https://schema.org", "@type": kind == "blog" ? "BlogPosting" : "Article", headline: a.title, description: a.desc, datePublished: a.date || SITE.reviewed, dateModified: a.updated || a.date || SITE.reviewed, mainEntityOfPage: abs(a.url), author: { "@type": "Organization", name: "Nexara Holidays travel desk", url: SITE.origin + "/about-us/" }, publisher: { "@type": "Organization", name: SITE.name, logo: { "@type": "ImageObject", url: abs("/assets/logo-circle.png") } }, image: abs(a.img || SITE.ogImage) });
function articlePage(a, kind) {
  const relNodes = (a.rel || []).map(s => N.get(s)).filter(n => n && !n.draft);
  const relP = PK.filter(p => p.stops.some(([n]) => relNodes.includes(n) || relNodes.includes(top(n)))).slice(0, 6);
  const sib = (kind == "guide" ? G : B).filter(x => x !== a && (x.cat == a.cat || x.cluster == a.cluster || (x.rel || []).some(s => (a.rel || []).includes(s)))).slice(0, 4);
  const toc = a.r.toc.length > 2 ? `<div class="toc" role="navigation" aria-label="On this page"><b>On this page</b><ol>${a.r.toc.map(([t, id]) => `<li><a href="#${id}">${esc(t)}</a></li>`).join("")}</ol></div>` : "";
  const label = kind == "guide" ? GUIDE_CATS[a.cat] : CLUSTERS[a.cluster]?.n;
  const crumbs = kind == "guide" ? [["Home", "/"], ["Travel guides", "/travel-guides/"], [a.title, a.url]] : [["Home", "/"], ["Blog", "/blog/"], [CLUSTERS[a.cluster].n, `/blog/topic/${a.cluster}/`], [a.title, a.url]];
  // articles: a photo if there is one, otherwise a plain gradient (the wave artwork is kept for place pages)
  const v0 = relNodes[0] ? vis(relNodes[0]) : null;
  const hero = a.img ? { img: a.img } : v0?.img ? { img: v0.img } : { g: v0?.g || "#5a2a1e,#b3562b,#ff8a3d" };
  return page({
    path: a.url, active: kind == "guide" ? "/travel-guides/" : "/blog/", ogType: "article", title: clipT(`${a.title} | Nexara Holidays`), desc: clip(a.desc), h1: a.title, scr: label, sub: `${esc(a.desc)}`, crumbs, hero, jsonld: [articleLd(a, kind)],
    body: `<div class="lay"><article class="prose"><p class="byline">By the Nexara Holidays travel desk · ${Math.max(2, Math.round(a.r.words / 220))} min read</p>${a.r.html}${a.facts ? note(a.facts) : ""}</article><aside>${toc}${quoteBox(a.trip || (relNodes[0] ? relNodes[0].n + " holiday" : "Holiday"))}${relNodes.length ? `<div class="box"><h3>Destinations in this ${kind == "guide" ? "guide" : "article"}</h3>${linkList(relNodes.map(n => [n.n, n.url]), "one")}</div>` : ""}</aside></div>` +
      (relP.length ? `<div class="alt">${sec("Itineraries", "Trips that match", cards(relP.map(pkgCard)))}</div>` : "") + (sib.length ? sec("Keep reading", "Related reading", artCards(sib, x => kind == "guide" ? GUIDE_CATS[x.cat] : CLUSTERS[x.cluster].n)) : "") + cta("Turn this into a trip", "Tell us your dates and we send a day-by-day plan with a price.", a.trip || ""),
  });
}
for (const g of G) emit(g.url, articlePage(g, "guide"), "guides");
for (const b of B) emit(b.url, articlePage(b, "blog"), "blog");
emit("/travel-guides/", page({
  path: "/travel-guides/", active: "/travel-guides/", title: "Travel Guides: When to Go, How to Plan, What to Pack | Nexara Holidays", desc: clip(`${G.length} practical travel guides for India and abroad: best times to visit, sample itineraries, packing lists and planning advice from our travel desk.`),
  h1: "Travel guides", scr: "Plan smarter", sub: "Practical answers to the questions travellers ask us most.", crumbs: [["Home", "/"], ["Travel guides", "/travel-guides/"]], hero: { img: "/assets/photos/vw/kyoto.webp" },
  body: Object.entries(GUIDE_CATS).map(([k, n], i) => { const a = G.filter(g => g.cat == k); return a.length ? (i % 2 ? `<div class="alt">` : "<div>") + sec(`${a.length} guides`, n, artCards(a, () => n)) + "</div>" : "" }).join("") + cta("Have a question we haven't answered?", "Message us. A planner will reply on WhatsApp.", ""),
}), "pages");
for (const [k, c] of Object.entries(CLUSTERS)) {
  const a = B.filter(b => b.cluster == k); if (!a.length) { draft("blog-topic", k, "no published posts"); continue }
  const u = `/blog/topic/${k}/`;
  emit(u, page({ path: u, active: "/blog/", title: `${c.n}: Travel Blog | Nexara Holidays`, desc: clip(c.d), h1: c.n, scr: "Travel blog", sub: esc(c.d), crumbs: [["Home", "/"], ["Blog", "/blog/"], [c.n, u]], hero: { g: c.g }, body: sec(`${a.length} articles`, `Articles on ${c.n.toLowerCase()}`, artCards(a, () => c.n)) + cta("Planning a trip?", "Tell us where you want to go and we send a plan with a price.", "") }), "blog");
}
emit("/blog/", page({
  path: "/blog/", active: "/blog/", title: "Travel Blog: Ideas, Comparisons & Planning Tips | Nexara Holidays", desc: clip(`${B.length} articles on honeymoons, family travel, budgets, seasons and destination comparisons, written by the Nexara Holidays travel desk in Chennai.`),
  h1: "The Nexara travel blog", scr: "Stories and ideas", sub: "Honest planning advice, comparisons and seasonal ideas.", crumbs: [["Home", "/"], ["Blog", "/blog/"]], hero: { img: "/assets/photos/vw/venice.webp" },
  body: Object.entries(CLUSTERS).map(([k, c], i) => { const a = B.filter(b => b.cluster == k); return a.length ? (i % 2 ? `<div class="alt">` : "<div>") + sec(`${a.length} articles`, c.n, artCards(a.slice(0, 6), () => c.n) + (a.length > 6 ? `<p style="margin-top:18px"><a class="btn ghost2" href="/blog/topic/${k}/">All ${a.length} articles on ${esc(c.n.toLowerCase())} →</a></p>` : "")) + "</div>" : "" }).join(""),
}), "blog");

/* ---------- 11. company pages ---------- */
// About us carries the partner tiles where its copy has a <!--PARTNERS--> marker
for (const pg of PAGES) {
  const r = renderMd(pg.body, resolveSlug, m => report.missingLinks.push({ page: "page:" + pg.s, missing: [m] }));
  const u = `/${pg.s}/`;
  emit(u, page({ path: u, active: pg.s == "contact-us" ? "/contact-us/" : "", title: pg.title, desc: clip(pg.desc), h1: pg.h1, scr: pg.scr, sub: esc(pg.sub || ""), crumbs: [["Home", "/"], [pg.n, u]], hero: pg.img ? { img: pg.img } : {}, body: (pg.pre || "") + (pg.body ? `<section><div class="prose">${r.html}</div></section>` : "") + (pg.post || "").replace("<!--PARTNERS-->", partnerSec()) + (pg.noCta ? "" : cta("Talk to a planner", "Call, WhatsApp or send an enquiry. We usually reply the same day.", "")) }), "pages");
}

/* ---------- 11b. travel services (flights, forex, visas, insurance ...) ---------- */
const svcCards = arr => `<div class="ppl">${arr.map(v => `<a href="/services/${v.s}/"><i>${IC[v.ic] || IC.star}</i><b>${esc(v.n)}</b><span>${esc(v.short)}</span><small>Explore ${IC.arrow}</small></a>`).join("")}</div>`;
const svcBox = v => `<div class="box"><h3>Ask about ${esc(v.n.toLowerCase())}</h3><p class="quote-s">Tell us your dates and destination. A planner replies on WhatsApp, usually the same day.</p><a class="btn red" href="/custom-tour/" data-enq data-trip="${esc(v.n)}">Send an enquiry</a><a class="btn ghost2" href="${waLink(`Hi Nexara Holidays, I need help with: ${v.n}.`)}" target="_blank" rel="noopener">${IC.wa} WhatsApp us</a><a class="btn ghost2" href="tel:${SITE.tel}">${IC.call} Call ${SITE.phone}</a></div>`;
for (const v of SERVICES) {
  const r = renderMd(v.body, resolveSlug, m => report.missingLinks.push({ page: "service:" + v.s, missing: [m] }));
  const u = `/services/${v.s}/`, others = SERVICES.filter(x => x !== v);
  emit(u, page({
    path: u, active: "/services/", title: v.title, desc: clip(v.desc), h1: v.n, scr: SERVICE_GROUPS[v.grp], sub: esc(v.sub), crumbs: [["Home", "/"], ["Travel services", "/services/"], [v.n, u]], hero: { g: v.g },
    body: `<div class="lay"><div class="prose">${r.html}</div><aside>${svcBox(v)}<div class="box"><h3>What we handle</h3>${dat(v.inc.map(esc))}</div><div class="box"><h3>Keep these ready</h3>${dat(v.need.map(esc))}</div></aside></div>` +
      (v.faq?.length ? `<div class="alt">${sec("FAQs", `${v.n}: common questions`, faq(v.faq.map(([q, a]) => [q, esc(a)])), { cls: "tight" })}</div>` : "") +
      sec("More services", "Everything else for your trip", svcCards(others), { cls: "tight" }) + cta(`Need help with ${v.n.toLowerCase()}?`, "Book it on its own or add it to a holiday. We reply on WhatsApp with options and a price.", v.n),
  }), "pages");
}
emit("/services/", page({
  path: "/services/", active: "/services/", title: "Travel Services: Flights, Forex, Visas & Insurance | Nexara Holidays", desc: clip(`Flights, forex and currency exchange, visas, travel insurance, hotels, transfers, eSIMs and more: ${SERVICES.length} travel services from Nexara Holidays in Chennai.`),
  h1: "Travel services", scr: "Everything around the trip", sub: "Flights, forex, visas, insurance and more, on their own or with a holiday.", crumbs: [["Home", "/"], ["Travel services", "/services/"]], hero: { g: "#5a2a1e,#b3562b,#ff8a3d" },
  body: Object.entries(SERVICE_GROUPS).map(([k, h], i) => (i % 2 ? `<div class="alt">` : "<div>") + sec(i ? "On the trip" : "Get ready", h, svcCards(SERVICES.filter(v => v.grp == k))) + "</div>").join("") +
    sec("How it works", "One planner for every part of the trip", `<div class="prose">${renderMd(`1. **Tell us what you need** on WhatsApp, by phone or through the [enquiry form](/custom-tour/): a single flight, forex for a trip, or the whole holiday.
2. **We send options and a written price**, with any service fee shown separately.
3. **You confirm**, and we book, deliver documents to WhatsApp and stay reachable until you are home.

Forex is supplied by RBI-authorised dealers and insurance by IRDAI-licensed insurers. Visa decisions are made by the embassy or immigration authority.`, resolveSlug).html}</div>`, { cls: "tight" }) +
    `<div class="alt">${sec("FAQs", "Questions about our services", faq(SERVICE_FAQ.map(([q, a]) => [q, esc(a)])), { cls: "tight" })}</div>` + cta("Need something not listed?", "Message us. If it helps your trip, we can usually arrange it.", ""),
}), "pages");

emit("/faqs/", page({
  path: "/faqs/", title: "FAQs: Booking, Payments, Visas & Travel | Nexara Holidays", desc: "Answers to common questions about planning, quotes, payments, visas, flights from Chennai, changes and travelling with Nexara Holidays.",
  h1: "Frequently asked questions", scr: "Good to know", sub: "How quotes, bookings, payments and trip support work.", crumbs: [["Home", "/"], ["FAQs", "/faqs/"]], hero: { img: "/assets/photos/vw/kerala.webp" },
  body: FAQS.map(([h, qa], i) => (i % 2 ? `<div class="alt">` : "<div>") + sec("", h, faq(qa.map(([q, a]) => [q, renderMd(a, resolveSlug).html]))) + "</div>").join("") + cta("Still have a question?", "Message us on WhatsApp or call. A planner will help.", ""),
}), "pages");

/* ---------- 12. html sitemap, 404, xml sitemaps, robots ---------- */
{
  const rows = [...Object.entries(PHOTOS), ...SPARE].filter(([, p]) => p.license).sort(([a], [b]) => a.localeCompare(b)).map(([k, p]) => {
    const [place, attr] = k.split("--"), n = N.get(place), what = attr ? (n?.a || []).find(([a]) => slugify(a) == attr)?.[0] : n?.n;
    return n && !n.draft && what ? `<tr><td>${n.url ? `<a href="${n.url}">${esc(what)}</a>` : esc(what)}${attr ? ` <small>(${esc(n.n)})</small>` : ""}</td><td>${photoCredit(p)}</td></tr>` : "";
  }).filter(Boolean);
  const LABEL = { currency: "Currency and payments", tipping: "Tipping", water: "Drinking water", plug: "Power plugs", emergency: "Emergency numbers", language: "Language", transport: "Getting around", planner: "Planner's tip", season: "When to go", flight: "How to reach",
    trek: "Trekking", boat: "Kayaking and boat trips", dive: "Snorkelling and diving", ski: "Skiing", cycle: "Cycling", camp: "Camping", safari: "Safaris", air: "Paragliding and balloon rides", sunset: "Sunrise and sunset", drive: "Scenic drives", outdoors: "Outdoor activities",
    husky: "Husky safaris", balloon: "Hot-air balloon rides", cablecar: "Cable cars and ropeways", desert: "Desert and camel safaris", horse: "Horse riding", rafting: "Rafting", cruise: "Cruises and boat rides", surf: "Surfing and water sports",
    beach: "Beach time", foodwalk: "Food and market walks", walk: "Heritage and city walks", naturewalk: "Nature walks", village: "Village walks", temple: "Temple walks", houseboat: "Houseboat stays", shikara: "Shikara rides", fishing: "Fishing", vineyard: "Vineyard visits", heritage: "Heritage walks in India",
    "hero-world": "Home page: The World, Your Way", "hero-honeymoon": "Home page: Honeymoons", "x-biz-hero": "Business & Trade Travel", "x-biz-sourcing": "Sourcing trips", "x-biz-hubs": "Industry hubs", "x-biz-corporate": "Corporate travel", "x-biz-skyline": "Travel Experiences",
    "x-her-festival": "Roots & Heritage Journeys", "x-her-hero": "Heritage villages", "x-her-food": "Heritage food", "x-edu-campus": "Educational Trips", "x-edu-hero": "Field trips", "x-edu-science": "Science visits",
    "x-cru-deck": "Cruise Holidays", "x-cru-river": "River cruises", "x-cru-expedition": "Expedition cruises", "x-cru-hero": "Cruise holidays", "x-yac-hero": "Luxury Yacht Experiences", "x-yac-cat": "Catamaran charters", "x-yac-gulet": "Gulet charters" };
  const topicRows = Object.entries(TOPIC).filter(([, p]) => p.license).map(([k, p]) => `<tr><td>${esc(k.startsWith("tt-") ? THEME_LABEL[k.slice(3)] || k : SPOT_LABEL[k] ? SPOT_LABEL[k] : LABEL[k.replace(/-\d$/, "")] || k)}</td><td>${photoCredit(p)}</td></tr>`);
  if (rows.length) emit("/photo-credits/", page({
    path: "/photo-credits/", title: "Photo Credits | Nexara Holidays", desc: "Credits and licences for the destination photographs used on Nexara Holidays, sourced from Wikimedia Commons under free licences.",
    h1: "Photo credits", scr: "Thank you, photographers", sub: `${rows.length + topicRows.length} photographs from Wikimedia Commons, used under free licences.`, crumbs: [["Home", "/"], ["Photo credits", "/photo-credits/"]], hero: N.get("tamil-nadu")?.img ? { img: N.get("tamil-nadu").img } : {},
    body: sec("Credits", "Destination photographs", `${Object.keys(VW_PHOTOS).length && SITE.photos != "commons" ? `<p>Most destination and attraction photographs come from the Veena World image library and are used with permission. The photographs listed below are from Wikimedia Commons.</p>` : ""}<p>Photos are resized and cropped from the originals on Wikimedia Commons. Each is used under the licence shown; follow the links for the original file, author and licence terms.</p><div class="tbl-wrap prose" style="max-width:none"><table><thead><tr><th>Photo</th><th>Author and licence</th></tr></thead><tbody>${rows.join("")}</tbody></table></div>`) +
      (topicRows.length ? sec("Topics", "Travel tips and activity photographs", `<div class="tbl-wrap prose" style="max-width:none"><table><thead><tr><th>Used for</th><th>Author and licence</th></tr></thead><tbody>${topicRows.join("")}</tbody></table></div>`) : ""),
  }), "pages");
}
const allUrls = Object.values(sitemap).flat();
emit("/sitemap/", page({
  path: "/sitemap/", title: "Site Map | Nexara Holidays", desc: "Every page on Nexara Holidays: destinations, tour packages, holiday themes, travel guides, blog articles and company information.",
  h1: "Site map", scr: "All pages", sub: `${allUrls.length + 2} pages`, crumbs: [["Home", "/"], ["Site map", "/sitemap/"]], hero: {},
  body: sec("Main", "Main pages", linkList([["Home", "/"], ["All tour packages", "/tour-packages/"], ["India packages", "/tour-packages/india/"], ["International packages", "/tour-packages/international/"], ["Destinations", "/destinations/"], ["Holiday themes", "/tour-types/"], ["Travel experiences", "/experiences/"], ["Sacred journeys", "/sacred/"], ["Travel services", "/services/"], ["Travel guides", "/travel-guides/"], ["Blog", "/blog/"], ...PAGES.map(p => [p.n, `/${p.s}/`]), ["FAQs", "/faqs/"]])) +
    sec("", "Holiday themes", linkList(TYPES.filter(t => t.url).map(t => [t.n, t.url]))) +
    sec("", "Travel services", linkList(SERVICES.map(v => [v.n, `/services/${v.s}/`]))) +
    sec("", "Tour packages", `<div class="groups">${pkgGroups(PK, p => p.home).map(([h, ps]) => `<div><h3>${esc(h.n)}</h3>${linkList(ps.map(p => [p.name, p.url, `${p.days} days`]))}</div>`).join("")}</div>`) +
    (G.length ? sec("", "Travel guides", linkList(G.map(g => [g.title, g.url]))) : "") + (B.length ? sec("", "Blog", linkList(B.map(b => [b.title, b.url]))) : ""),
}), "pages");
emit("/404.html", page({
  path: "/404.html", robots: "noindex, follow", title: "Page not found | Nexara Holidays", desc: "This page does not exist. Browse destinations, tour packages and travel guides instead.", h1: "Page not found", scr: "Lost?", sub: "The page you were looking for has moved or does not exist.", hero: {},
  body: `<section class="nf"><p>Try one of these instead:</p><p><a class="btn red" href="/">Home</a><a class="btn ghost2" href="/tour-packages/">Tour packages</a><a class="btn ghost2" href="/destinations/">Destinations</a><a class="btn ghost2" href="/sitemap/">Site map</a></p></section>`,
}).replace(/<link rel="canonical"[^>]*>\n/, ""), null, { index: false });

const xmlUrls = urls => `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `<url><loc>${abs(u)}</loc><lastmod>${SITE.reviewed}</lastmod></url>`).join("\n")}\n</urlset>\n`;
sitemap.pages.unshift("/");
const smFiles = [];
for (const [k, urls] of Object.entries(sitemap)) { if (!urls.length) continue; const f = `sitemap-${k}.xml`; writeFileSync(path.join(OUT, f), xmlUrls(urls)); written.push(f); smFiles.push(f) }
writeFileSync(path.join(OUT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${smFiles.map(f => `<sitemap><loc>${abs("/" + f)}</loc><lastmod>${SITE.reviewed}</lastmod></sitemap>`).join("\n")}\n</sitemapindex>\n`);
writeFileSync(path.join(OUT, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /research/\nDisallow: /tools/\nDisallow: /content/\nDisallow: /nexara-redesign.html\nDisallow: /assets/Nexara_Holidays_Thailand_travel___20261022134034_frames/\n\nSitemap: ${SITE.origin}/sitemap.xml\n`);
written.push("sitemap.xml", "robots.txt", "assets/css/nexara-base.css");

/* ---------- 13. remove stale generated files, write report ---------- */
if (existsSync(MANIFEST)) {
  const prev = JSON.parse(readFileSync(MANIFEST, "utf8")), now = new Set(written);
  for (const f of prev) if (!now.has(f) && existsSync(path.join(ROOT, f))) { rmSync(path.join(ROOT, f)); pruneEmpty(path.dirname(path.join(ROOT, f))) }
}
function pruneEmpty(d) { while (d.startsWith(ROOT) && d !== ROOT && readdirSync(d).length === 0) { rmSync(d, { recursive: true }); d = path.dirname(d) } }
mkdirSync(path.dirname(MANIFEST), { recursive: true });
writeFileSync(MANIFEST, JSON.stringify(written.sort(), null, 0));
report.counts = {
  sitemap_urls_total: Object.values(sitemap).flat().length, by_sitemap: Object.fromEntries(Object.entries(sitemap).map(([k, v]) => [k, v.length])),
  destinations: { india_hub: 1, india_regions: inReg.length, states: STATES.filter(s => !N.get(s.s).draft).length, india_places: [...N.values()].filter(n => n.kind == "city" && n.dom && !n.draft).length, intl_hub: 1, intl_regions: wReg.length, countries: COUNTRIES.filter(c => !N.get(c.s).draft).length, intl_places: [...N.values()].filter(n => n.kind == "city" && !n.dom && !n.draft).length, directory: 1 },
  packages: { india: PK.filter(p => p.dom).length, international: PK.filter(p => !p.dom).length, signature: PK.filter(p => p.sig).length, listings: 3 },
  tour_types: TYPES.filter(t => t.url).length, guides: G.length, blog_posts: B.length, blog_topics: Object.keys(CLUSTERS).filter(k => B.some(b => b.cluster == k)).length,
  drafts: report.drafts.length, files_written: written.length,
};
writeFileSync(path.join(ROOT, "research", "build-report.json"), JSON.stringify(report, null, 1));
console.log(JSON.stringify(report.counts, null, 1));
if (report.drafts.length) console.log(`${report.drafts.length} records held back as drafts (see research/build-report.json)`);
if (report.missingLinks.length) console.log(`${report.missingLinks.length} pages reference unknown [[links]]`);
if (report.warnings.length) console.log(report.warnings.join("\n"));

// Quality checks over the built site. Usage: node tools/validate.mjs  (run after tools/build.mjs)
// Errors fail the run (exit 1); warnings are reported. Results: research/validation-report.json
import { readFileSync, existsSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ORIGIN = "https://nexaraholidays.com";
const files = JSON.parse(readFileSync(path.join(ROOT, "research/.generated-files.json"), "utf8")).filter(f => f.endsWith(".html"));
const errors = [], warnings = [];
const err = (page, msg) => errors.push({ page, msg }), warn = (page, msg) => warnings.push({ page, msg });
const urlOf = f => f == "404.html" ? "/404.html" : "/" + f.replace(/index\.html$/, "");
const fileFor = u => { const p = decodeURIComponent(u.split("#")[0].split("?")[0]); if (p == "/") return "index.html"; return p.endsWith("/") ? p.slice(1) + "index.html" : p.slice(1) };
const text = h => h.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<style[\s\S]*?<\/style>/g, " ").replace(/<[^>]+>/g, " ").replace(/&[a-z#0-9]+;/g, " ").replace(/\s+/g, " ").trim();

const pages = new Map();
for (const f of [...files, "index.html"]) {
  const html = readFileSync(path.join(ROOT, f), "utf8"), u = urlOf(f);
  const g = re => (html.match(re) || [])[1];
  const main = (html.match(/<main[^>]*>([\s\S]*?)<\/main>/) || [, html])[1];
  pages.set(u, {
    f, html, main, title: g(/<title>([^<]*)<\/title>/), desc: g(/<meta name="description" content="([^"]*)"/), canonical: g(/<link rel="canonical" href="([^"]*)"/),
    robots: g(/<meta name="robots" content="([^"]*)"/) || "", h1: (html.match(/<h1[\s>]/g) || []).length,
    links: [...main.matchAll(/href="(\/[^"]*)"/g)].map(m => m[1]), allLinks: [...html.matchAll(/href="(\/[^"#?]*)/g)].map(m => m[1]),
    srcs: [...html.matchAll(/(?:src|url\()="?(\/assets\/[^")\s]+)/g)].map(m => m[1]), ld: [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => m[1]),
  });
}

// 1. per-page SEO basics
const seen = { title: new Map(), desc: new Map(), canonical: new Map() };
for (const [u, p] of pages) {
  if (u == "/404.html") { if (!/noindex/.test(p.robots)) err(u, "404 page must be noindex"); continue }
  if (p.h1 != 1) (u == "/" ? warn : err)(u, `has ${p.h1} <h1> elements${u == "/" ? " (pre-existing home page: hero slides and hidden views)" : ""}`);
  if (!p.title) err(u, "missing <title>");
  if (!p.desc) err(u, "missing meta description"); else if (p.desc.length < 50 || p.desc.length > 170) warn(u, `meta description length ${p.desc.length}`);
  if (p.title && p.title.length > 75) warn(u, `title length ${p.title.length}`);
  if (!p.canonical) err(u, "missing canonical"); else if (p.canonical != ORIGIN + u) err(u, `canonical ${p.canonical} does not match URL`);
  for (const k of ["title", "desc", "canonical"]) if (p[k]) { if (seen[k].has(p[k])) err(u, `duplicate ${k} (also on ${seen[k].get(p[k])})`); else seen[k].set(p[k], u) }
  for (const j of p.ld) { try { JSON.parse(j) } catch { err(u, "invalid JSON-LD") } }
  if (/"aggregateRating"|"review"/.test(p.ld.join(""))) err(u, "rating or review structured data present (not supported by real reviews)");
}
// 2. broken internal links and missing assets
const missing = new Map();
for (const [u, p] of pages) {
  for (const l of new Set(p.allLinks)) if (!existsSync(path.join(ROOT, fileFor(l)))) missing.set(l, (missing.get(l) || []).concat(u));
  for (const s of new Set(p.srcs)) if (!existsSync(path.join(ROOT, decodeURIComponent(s.slice(1))))) err(u, `missing asset ${s}`);
}
for (const [l, from] of missing) err(from[0], `broken link ${l} (on ${from.length} pages)`);
// 3. sitemaps
const smIndex = readFileSync(path.join(ROOT, "sitemap.xml"), "utf8");
const smUrls = [];
for (const sm of [...smIndex.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].replace(ORIGIN + "/", ""))) {
  if (!existsSync(path.join(ROOT, sm))) { err("/sitemap.xml", `sitemap file ${sm} missing`); continue }
  smUrls.push(...[...readFileSync(path.join(ROOT, sm), "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].replace(ORIGIN, "")));
}
const smSet = new Set(smUrls);
if (smSet.size != smUrls.length) err("/sitemap.xml", `${smUrls.length - smSet.size} duplicate sitemap entries`);
for (const u of smSet) { const p = pages.get(u); if (!p) err("/sitemap.xml", `sitemap lists ${u} which was not built`); else if (/noindex/.test(p.robots)) err(u, "noindex page listed in sitemap") }
for (const [u] of pages) if (u != "/404.html" && !smSet.has(u)) warn(u, "built page not in sitemap");
// 4. orphans: indexable pages with no inbound links from other pages (navigation included)
const inbound = new Map();
for (const [u, p] of pages) for (const l of new Set(p.allLinks.map(x => x.split("#")[0]))) if (l != u) inbound.set(l, (inbound.get(l) || 0) + 1);
for (const u of smSet) if (u != "/" && !inbound.get(u)) err(u, "orphan page: no internal links point here");
const weak = [...smSet].filter(u => u != "/" && (inbound.get(u) || 0) == 1);
// 5. empty sections
for (const [u, p] of pages) {
  if (/<div class="h">(?:<span class="eye">[^<]*<\/span>)?<h2>[^<]*<\/h2>(?:<p>[^<]*<\/p>)?<\/div><\/section>/.test(p.main)) err(u, "section with a heading but no content");
  if (/<ul[^>]*><\/ul>|<ol[^>]*><\/ol>|<div class="(?:dgrid|acards|tg|faq)[^"]*"><\/div>/.test(p.main)) err(u, "empty list or card grid");
}
// 6. unsupported claims
const SIG = /thailand-(?:honeymoon-lantern-of-love|boys-unleashed|ultimate-boys-escape)/;
for (const [u, p] of pages) {
  const t = text(p.main).replace(/(?:not|never|aren't|isn't)(?: be)? guaranteed|promises guaranteed/gi, "").replace(/₹\d+ notes/g, "");
  if (u != "/" && !SIG.test(u) && /₹\s?\d/.test(t.replace(/₹\s?[\d,]+(?:\s?(?:–|-|to)\s?[\d,]+)?\s?(?:lakh)?\s?per person|Under ₹[\d,]+|Above ₹[\d,]+|₹1–2 lakh|₹50,000–1 lakh|₹25,000–50,000/g, ""))) warn(u, "rupee amount in page text outside a signature package: check it is a real, current price");
  for (const w of ["guaranteed", "lowest price", "best price", "cheapest price", "100% refund", "No.1", "number one travel"]) if (t.toLowerCase().includes(w.toLowerCase())) warn(u, `marketing claim "${w}"`);
}
// 7. near-duplicate content within each section of the site
const group = u => u.split("/")[1] + (u.startsWith("/destinations/") ? "/" + (u.split("/").length - 2) : "");
const shingles = t => { const w = t.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter(Boolean), s = new Set(); for (let i = 0; i + 5 <= w.length; i++) s.add(w.slice(i, i + 5).join(" ")); return s };
// card grids and link lists are navigation to other pages, not this page's own content
const stripNav = h => h.replace(/<(?:header|footer|nav)[\s\S]*?<\/(?:header|footer|nav)>/g, "").replace(/<a class="(?:dc|acard)"[\s\S]*?<\/a>/g, "").replace(/<ul class="lnk[^"]*">[\s\S]*?<\/ul>/g, "");
const byGroup = new Map();
for (const [u, p] of pages) { if (!smSet.has(u)) continue; const g = group(u); if (!byGroup.has(g)) byGroup.set(g, []); byGroup.get(g).push([u, shingles(text(stripNav(p.main)))]) }
const sims = [];
for (const [g, arr] of byGroup) for (let i = 0; i < arr.length; i++) for (let j = i + 1; j < arr.length; j++) {
  const [a, A] = arr[i], [b, B] = arr[j]; let n = 0; const [S, L] = A.size < B.size ? [A, B] : [B, A]; for (const x of S) if (L.has(x)) n++;
  const jac = n / (A.size + B.size - n || 1); if (jac > 0.5) sims.push([jac, a, b]);
}
sims.sort((x, y) => y[0] - x[0]);
for (const [s, a, b] of sims) (s > 0.8 ? err : warn)(a, `content ${Math.round(s * 100)}% similar to ${b}`);

const summary = { checked_pages: pages.size, sitemap_urls: smSet.size, errors: errors.length, warnings: warnings.length, pages_with_single_inbound_link: weak.length, most_similar_pairs: sims.slice(0, 15).map(([s, a, b]) => `${Math.round(s * 100)}% ${a} ~ ${b}`) };
writeFileSync(path.join(ROOT, "research/validation-report.json"), JSON.stringify({ summary, errors, warnings }, null, 1));
console.log(JSON.stringify(summary, null, 1));
const byMsg = a => Object.entries(a.reduce((m, e) => { const k = e.msg.replace(/\/[^\s)]+/g, "<url>").replace(/\d+/g, "#"); m[k] = (m[k] || 0) + 1; return m }, {})).sort((a, b) => b[1] - a[1]).slice(0, 25);
if (errors.length) { console.log("\nERRORS by type:"); for (const [k, n] of byMsg(errors)) console.log(`  ${n} × ${k}`); console.log("  e.g.", errors.slice(0, 8)) }
if (warnings.length) { console.log("\nWARNINGS by type:"); for (const [k, n] of byMsg(warnings)) console.log(`  ${n} × ${k}`) }
process.exit(errors.length ? 1 : 0);

// Site-wide top bar and mega menu (Packages / Experiences / India / Honeymoon / Sacred / Themes / Services / Company dropdowns).
// buildMenu() turns the destination graph and packages into plain link data; the render functions
// are shared by generated pages (html.mjs) and the hand-made index.html (injected between markers by build.mjs).
import { SITE } from "../../content/site.mjs";
import { TN_ROOTS } from "../../content/experiences.mjs";

const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const byName = (a, b) => a.n.localeCompare(b.n);

// "Bali Honeymoon" -> "Bali"; long names ("Bangkok and Krabi Honeymoon") fall back to the country or state
const halves = a => { const k = Math.ceil(a.length / 2); return [a.slice(0, k), a.slice(k)] };
const isHoney = p => /honeymoon/i.test(p.name);
function honeyLabel(p) {
  const pre = p.name.split(/\s+honeymoon/i)[0].replace(/\s+island$/i, "").trim();
  return isHoney(p) && pre && pre.split(/\s+/).length <= 2 && !/honeymoon/i.test(pre) ? pre : p.home.n;
}
// one link per place, preferring the itinerary actually named as a honeymoon
function honeyLinks(ps, max = 99) {
  const seen = new Set(), out = [];
  for (const p of [...ps].sort((a, b) => isHoney(b) - isHoney(a))) { const l = honeyLabel(p); if (seen.has(l)) continue; seen.add(l); out.push([l, p.url, isHoney(p)]) }
  return out.sort((a, b) => b[2] - a[2]).slice(0, max).map(([l, u]) => [l, u]).sort((a, b) => a[0].localeCompare(b[0]));
}

/** N: destination graph, PK: packages, TYPES: tour types, inReg: India regions with state slugs, SERVICES: travel services. */
export function buildMenu({ N, PK, TYPES, inReg, SERVICES = [], SERVICE_GROUPS = {}, SACRED = [], SACRED_GROUPS = {}, EXPERIENCES = [] }) {
  const live = s => { const n = N.get(s); return n && !n.draft ? n : null };
  const countries = (...rs) => [...N.values()].filter(n => n.kind == "country" && !n.draft && rs.includes(n.region.s)).sort(byName).map(n => [n.n, n.url]);
  const g = (h, url, links) => links.length ? { h, url, links } : null;
  const W = s => `/destinations/international/${s}/`;
  const ISLANDS = ["andaman-and-nicobar", "lakshadweep"];
  const states = r => r.states.filter(s => !ISLANDS.includes(s)).map(live).filter(Boolean).sort(byName).map(n => [n.n, n.url]);
  const R = s => inReg.find(r => r.s == s);
  const honey = PK.filter(p => p.themes.includes("honeymoon"));
  const cruise = TYPES.find(t => t.s == "cruise-holidays" && !t.draft);
  // busiest Indian places by number of itineraries
  const count = new Map();
  for (const p of PK) if (p.dom) for (const [n] of p.stops) if (n.kind == "city") count.set(n, (count.get(n) || 0) + 1);
  const popular = [...count.entries()].filter(([n]) => !n.draft).sort((a, b) => b[1] - a[1] || byName(a[0], b[0])).slice(0, 14).map(([n]) => [n.n, n.url]);

  return {
    packages: {
      label: "Packages", url: "/tour-packages/international/", match: ["/tour-packages/", "/packages/international/", "/destinations/international/"],
      cols: [
        [g("Africa", W("africa"), countries("africa")), g("America", null, countries("north-america", "central-america", "south-america")), g("Pacific", W("oceania"), countries("oceania"))],
        [g("Asia", null, countries("southeast-asia", "east-asia", "south-asia", "central-asia"))],
        [g("Europe", W("europe"), countries("europe"))],
        [g("Island", W("indian-ocean"), countries("indian-ocean")), g("Middle East", W("middle-east"), countries("middle-east")), cruise && g("Cruises", cruise && `/tour-types/${cruise.s}/`, [["Cruise holidays", `/tour-types/${cruise.s}/`]])],
        [g("Honeymoon", "/tour-types/honeymoon/", honeyLinks(honey.filter(p => !p.dom), 18))],
      ],
      all: ["View all packages", "/tour-packages/"],
    },
    india: {
      label: "India", url: "/tour-packages/india/", match: ["/tour-packages/india/", "/packages/india/", "/destinations/india/"],
      cols: [
        [g("South India", R("south-india")?.url, states(R("south-india"))), g("Central India", R("central-india")?.url, states(R("central-india")))],
        [g("North India", R("north-india")?.url, states(R("north-india")))],
        [g("West India", R("west-india")?.url, states(R("west-india"))), g("East India", R("east-india")?.url, states(R("east-india")))],
        [g("Northeast India", R("northeast-india")?.url, states(R("northeast-india"))), g("Islands", null, ISLANDS.map(live).filter(Boolean).map(n => [n.n, n.url]))],
        [g("Popular places", null, popular)],
      ],
      all: ["View all India packages", "/tour-packages/india/"],
    },
    honeymoon: {
      label: "Honeymoon", url: "/tour-types/honeymoon/", match: ["/tour-types/honeymoon/"],
      cols: [
        [g("Honeymoon in India", null, honeyLinks(honey.filter(p => p.dom && isHoney(p))))],
        ...halves(honeyLinks(honey.filter(p => !p.dom && isHoney(p)))).map((l, i) => [g(i ? "" : "Honeymoon abroad", null, l)]),
      ],
      all: ["All honeymoon packages", "/tour-types/honeymoon/"],
      small: true,
    },
    experiences: {
      label: "Experiences", url: "/experiences/", match: ["/experiences/"],
      cols: [[g("Travel Experiences", "/experiences/", EXPERIENCES.map(e => [e.n, `/experiences/${e.s}/`]))],
        [g("Business travel", null, [["Global trade fairs", "/experiences/business-trade-travel/#events"], ["Sourcing trips", "/experiences/business-trade-travel/#sourcing"], ["Industry tours", "/experiences/business-trade-travel/#hubs"], ["Corporate travel", "/experiences/business-trade-travel/#corporate"], ["Business trip planner", "/experiences/business-trade-travel/#planner"]])],
        [g("Tamil Nadu roots", "/experiences/roots-heritage-journeys/#tamil-nadu", TN_ROOTS.areas.map(a => [a.name.split(":")[0], `/experiences/roots-heritage-journeys/#tn-${a.id}`]))]],
      all: ["Search all experiences", "/experiences/"],
      small: true,
    },
    sacred: {
      label: "Sacred", url: "/sacred/", match: ["/sacred/"],
      cols: Object.entries(SACRED_GROUPS).map(([k, h]) => [g(h, null, SACRED.filter(c => c.group == k).map(c => [c.n, `/sacred/${c.s}/`])),
        k == "abroad" && g("India & abroad", null, [["Sacred journeys in India", "/sacred/india/"], ["Sacred journeys abroad", "/sacred/international/"]])]),
      all: ["All sacred journeys", "/sacred/"],
      small: true,
    },
    themes: {
      label: "Themes", url: "/tour-types/", match: ["/tour-types/"],
      cols: (() => { const t = TYPES.filter(t => !t.draft && !["honeymoon", "group-tours"].includes(t.s)).map(t => [t.n, `/tour-types/${t.s}/`]), k = Math.ceil(t.length / 3); return [0, 1, 2].map(i => [g(i ? "" : "Holiday themes", null, t.slice(i * k, (i + 1) * k))]) })(),
      all: ["All holiday themes", "/tour-types/"],
      small: true,
    },
    services: {
      label: "Services", url: "/services/", match: ["/services/"],
      cols: Object.entries(SERVICE_GROUPS).map(([k, h]) => [g(h, null, SERVICES.filter(v => v.grp == k).map(v => [v.n, `/services/${v.s}/`]))]),
      all: ["All travel services", "/services/"],
      small: true,
    },
    company: {
      label: "Company", url: "/about-us/", match: ["/about-us/", "/faqs/", "/travel-guides/", "/blog/"],
      cols: [[g("Nexara Holidays", null, [["About us", "/about-us/"], ["Plan a custom tour", "/custom-tour/"], ["Destinations", "/destinations/"], ["Travel guides", "/travel-guides/"], ["Travel blog", "/blog/"], ["FAQs", "/faqs/"], ["Cancellation and refunds", "/cancellation-policy/"]])]],
      small: true,
    },
  };
}

const CARET = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';

function dd(key, m, on) {
  const cur = on ? ' class="cur"' : "";
  const cols = m.cols.map(c => c.filter(Boolean)).filter(c => c.length).map(c => `<div class="mcol">${c.map(x => `<div class="mg">${x.h ? `<h6>${x.url ? `<a href="${x.url}">${esc(x.h)}</a>` : esc(x.h)}</h6>` : `<h6 class="h0" aria-hidden="true">&nbsp;</h6>`}<ul>${x.links.map(([n, u]) => `<li><a href="${u}">${esc(n)}</a></li>`).join("")}</ul></div>`).join("")}</div>`).join("");
  return `<span class="mdd${m.small ? " msm" : ""}"><a href="${m.url}"${cur}><span class="lt">${m.label}</span></a><button type="button" class="ddt" aria-expanded="false" aria-controls="mm-${key}" aria-label="${m.label} menu">${CARET}</button><div class="mega" id="mm-${key}"><div class="mcols">${cols}</div>${m.all ? `<a class="mall" href="${m.all[1]}">${esc(m.all[0])} →</a>` : ""}</div></span>`;
}

/** The .nl link list. spa: the home page uses in-page hashes for Home and Contact. */
export function menuLinks(M, active, { spa = false } = {}) {
  // the section whose longest URL prefix matches the current page is highlighted
  let best = "", len = 0;
  if (active) for (const [k, m] of Object.entries(M)) for (const u of m.match) if (active.startsWith(u) && u.length > len) { best = k; len = u.length }
  if (active == "/tour-types/group-tours/") best = ""; // has its own top-level link
  const dropdown = (k, m) => dd(k, m, k == best);
  const a = (u, n, on) => `<a href="${u}"${on ? ' class="cur" aria-current="page"' : ""}><span class="lt">${n}</span></a>`;
  return a(spa ? "#home" : "/", "Home", active == "/") + dropdown("company", M.company) + a("/tour-types/group-tours/", "Group Tours", active == "/tour-types/group-tours/") +
    dropdown("packages", M.packages) + (M.experiences.cols[0][0] ? dropdown("experiences", M.experiences) : "") + dropdown("india", M.india) + dropdown("honeymoon", M.honeymoon) + (M.sacred.cols.length ? dropdown("sacred", M.sacred) : "") + dropdown("themes", M.themes) + (M.services.cols.length ? dropdown("services", M.services) : "") +
    a(spa ? "#contact" : "/contact-us/", "Contact", active == "/contact-us/");
}

const ICO = {
  ig: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/></svg>',
  wa: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg>',
  mail: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
  call: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>',
};

export const topbar = () => `<div class="tbar"><div class="tbl"><a href="https://instagram.com/${SITE.insta}" target="_blank" rel="noopener" aria-label="Instagram">${ICO.ig}</a><a href="https://wa.me/${SITE.wa}" target="_blank" rel="noopener" aria-label="WhatsApp">${ICO.wa}</a><i></i><a class="tmail" href="mailto:${SITE.email}">${ICO.mail}<span>${SITE.email}</span></a></div><div class="tbr"><span class="tnote">From Tamil Nadu to the world</span><a class="tcall" href="tel:${SITE.tel}">${ICO.call}<b>${SITE.phone}</b></a></div></div>`;

/** Footer band of destination links, like the menus but flat. */
export function footLinks(M) {
  const flat = m => m.cols.flat().filter(Boolean).flatMap(x => x.links);
  const row = (h, url, links) => `<div class="frow"><h5><a href="${url}">${h}</a></h5><p>${links.map(([n, u]) => `<a href="${u}">${esc(n)}</a>`).join("")}</p></div>`;
  const intl = flat(M.packages).filter(([, u]) => u.startsWith("/destinations/"));
  const india = M.india.cols.slice(0, 4).flat().filter(Boolean).flatMap(x => x.links);
  return `<div class="flinks">${row("International holidays", "/tour-packages/international/", intl)}${row("India holidays", "/tour-packages/india/", india)}${row("Honeymoon packages", "/tour-types/honeymoon/", flat(M.honeymoon))}${M.experiences.cols[0][0] ? row("Travel experiences", "/experiences/", flat(M.experiences).filter(([, u]) => !u.includes("#"))) : ""}${M.sacred.cols.length ? row("Sacred journeys", "/sacred/", flat(M.sacred)) : ""}${M.services.cols.length ? row("Travel services", "/services/", flat(M.services)) : ""}</div>`;
}

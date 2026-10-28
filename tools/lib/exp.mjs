// Travel Experiences pages (/experiences/ and the five category pages), rendered from content/experiences.mjs.
// One discovery block (search, region / country / topic filters, map, "ask us about anywhere else") and one
// step-by-step planner serve all five categories; assets/js/nexara-exp.js runs both, and the planner hands its
// answers to the site's existing enquiry dialog.
import { esc, IC, page, sec, cards, faq, cta, note } from "./html.mjs";
import { EXPERIENCES, EXP_HUB, EXP_DATA as D, REGIONS, STATUS, EVENTS_CHECKED } from "../../content/experiences.mjs";

const HEAD = `<link rel="stylesheet" href="/assets/css/nexara-exp.css"><link rel="preconnect" href="https://cdnjs.cloudflare.com">`;
const SCRIPT = `<script src="/assets/js/nexara-exp.js" defer></script>`;
const ATTR = s => esc(String(s ?? ""));

/** ctx: { N, PHOTOS, TOPIC, emit, pkgsOfType, pkgCard } from tools/build.mjs */
export function buildExperiences(ctx) {
  const { N, PHOTOS, TOPIC, emit, pkgsOfType, pkgCard } = ctx;
  const T = k => TOPIC[k]?.img || "";
  const cName = c => N.get(c)?.n || (c == "india" ? "India" : c);
  const cUrl = c => { const n = N.get(c); return n && !n.draft ? n.url : "" };
  const photo = it => (it.place && (PHOTOS[it.place]?.img || N.get(it.place)?.img)) || "";
  const placeUrl = it => { const n = it.place && N.get(it.place); return n && !n.draft ? n.url : cUrl(it.country) };
  const X = Object.fromEntries(EXPERIENCES.map(e => [e.s, { ...e, url: `/experiences/${e.s}/` }]));

  // every place name the site knows, plus every item name: suggestions for all destination fields
  const suggest = [...new Set([...[...N.values()].filter(n => !n.draft && (["country", "city", "state"].includes(n.kind) || n.self)).map(n => n.kind == "city" && n.parent ? `${n.n}, ${n.parent.n}` : n.n),
    ...D.EVENTS.map(e => `${e.city}, ${cName(e.country)}`), ...D.HUBS.map(h => `${h.name}, ${cName(h.country)}`), "British Virgin Islands", "The Bahamas", "Ecuador", "Ghana", "Poland", "Nigeria", "Saudi Arabia", "Pakistan", "Bangladesh", "Chile", "Colombia"])].sort();
  const datalist = `<datalist id="xp-dests">${suggest.map(s => `<option value="${ATTR(s)}">`).join("")}</datalist>`;

  /* ---------- discovery: filters + map + item list ---------- */
  // items: [{ id, name, country, region, ll, tags, html }]; facets: [[key, label, options]] filtered on data-f-<key>
  function discover(id, items, { facets = [], placeholder = "Search a country, city or keyword", cat = "", mapTitle = "", limit = 0 } = {}) {
    const regions = [...new Set(items.map(i => i.region))].filter(r => REGIONS[r]);
    const countries = [...new Map(items.map(i => [i.country, cName(i.country)])).entries()].sort((a, b) => a[1].localeCompare(b[1]));
    const sel = (k, label, opts) => `<label class="xpfs"><span>${esc(label)}</span><select data-k="${k}"><option value="">All</option>${opts.map(([v, n]) => `<option value="${ATTR(v)}">${esc(n)}</option>`).join("")}</select></label>`;
    return `<div class="xpd" data-xpd id="${id}"${cat ? ` data-cat="${ATTR(cat)}"` : ""}${limit ? ` data-limit="${limit}"` : ""}>
<div class="xpf" role="search"><label class="xpq"><span class="sr">Search</span>${IC.pin}<input type="search" data-k="q" placeholder="${ATTR(placeholder)}" list="xp-dests" autocomplete="off"></label>
${sel("region", "Region", regions.map(r => [r, REGIONS[r]]))}${sel("country", "Country", countries)}${facets.map(([k, l, o]) => sel(k, l, o.map(v => Array.isArray(v) ? v : [v, v]))).join("")}
<button type="button" class="xpclr" data-clear>Clear</button></div>
<p class="xpcount" aria-live="polite"><b>${items.length}</b> to explore</p>
<div class="xpdg"><div class="xpmap" data-map aria-label="${ATTR(mapTitle || "Map of these destinations")}" role="region"><span>Map loads when you scroll here</span></div>
<div class="xpl">${items.map(i => `<article class="xpi" id="${id}-${i.id}" data-region="${i.region}" data-country="${ATTR(i.country)}" data-name="${ATTR(i.name)}" data-ll="${i.ll ? i.ll.join(",") : ""}"${facets.map(([k]) => ` data-f-${k}="${ATTR((i.f?.[k] || []).join("|"))}"`).join("")} data-q="${ATTR([i.name, cName(i.country), REGIONS[i.region], ...(i.tags || []), i.city || ""].join(" ").toLowerCase())}">${i.html}</article>`).join("")}${limit ? `<button type="button" class="btn ghost2 xpmore" data-more>Show all ${items.length}</button>` : ""}</div></div>
<div class="xpnone" hidden><p>No exact match in our list yet. We plan trips worldwide, so tell us where you want to go.</p><button type="button" class="btn red" data-custom>Ask about <span></span></button></div>
</div>`;
  }
  const chipsRow = a => a.length ? `<ul class="xptg">${a.map(t => `<li>${esc(t)}</li>`).join("")}</ul>` : "";
  const where = i => `${i.city ? esc(i.city) + ", " : ""}${cUrl(i.country) ? `<a href="${cUrl(i.country)}">${esc(cName(i.country))}</a>` : esc(cName(i.country))}`;
  const planBtn = (label, set) => `<button type="button" class="xpgo" data-xp-set="${ATTR(JSON.stringify(set))}">${esc(label)} ${IC.arrow}</button>`;

  /* ---------- planner: steps of fields, then a review that opens the enquiry dialog ---------- */
  function planner(cat, steps, { cta: ctaLabel, intro = "" }) {
    const field = f => {
      const req = f.req ? " required" : "", lab = `${esc(f.l)}${f.req ? ' <i aria-hidden="true">*</i>' : ' <small>(optional)</small>'}`;
      if (f.t == "chips" || f.t == "multi") return `<fieldset class="xpfld xpch" data-k="${f.k}" data-label="${ATTR(f.l)}"${f.req ? " data-req" : ""}><legend>${lab}</legend><div>${f.o.map(v => `<label><input type="${f.t == "chips" ? "radio" : "checkbox"}" name="${f.k}" value="${ATTR(v)}"><span>${esc(v)}</span></label>`).join("")}</div></fieldset>`;
      if (f.t == "dest") return `<div class="xpfld xpdest" data-k="${f.k}" data-label="${ATTR(f.l)}"${f.req ? " data-req" : ""}><label for="${cat}-${f.k}">${lab}</label><div class="xpdin"><input id="${cat}-${f.k}" list="xp-dests" placeholder="${ATTR(f.ph || "Type a country, city or town")}" autocomplete="off"><button type="button" class="btn ghost2" data-add>Add</button></div><div class="xpsel" role="list" aria-live="polite"></div><p class="xphint">${esc(f.hint || "Add more than one place for a multi-country trip.")}</p></div>`;
      const id = `${cat}-${f.k}`, base = `id="${id}" name="${f.k}" data-label="${ATTR(f.l)}"${req}`;
      const ctl = f.t == "select" ? `<select ${base}><option value="">Choose…</option>${f.o.map(v => `<option>${esc(v)}</option>`).join("")}</select>`
        : f.t == "area" ? `<textarea ${base} rows="3" placeholder="${ATTR(f.ph || "")}"></textarea>`
        : f.t == "num" ? `<input ${base} type="number" inputmode="numeric" min="${f.min ?? 1}" max="${f.max ?? 500}" value="${f.v ?? ""}">`
        : f.t == "date" ? `<input ${base} type="date">`
        : `<input ${base} type="text" value="${ATTR(f.v || "")}" placeholder="${ATTR(f.ph || "")}">`;
      return `<div class="xpfld${f.wide ? " w" : ""}"><label for="${id}">${lab}</label>${ctl}</div>`;
    };
    const all = [...steps, { t: "Review and send", f: [] }];
    return `<form class="xpp" data-xpp data-cat="${ATTR(X[cat].n)}" novalidate aria-label="${ATTR(X[cat].n)} planner">
${intro ? `<p class="xppi">${intro}</p>` : ""}<ol class="xpsteps">${all.map((s, i) => `<li${i ? "" : ' class="on"'}><b>${i + 1}</b><span>${esc(s.t)}</span></li>`).join("")}</ol>
${all.map((s, i) => `<fieldset class="xpst${i ? "" : " on"}" data-step="${i}"${i ? " hidden" : ""}><legend>Step ${i + 1} of ${all.length}: ${esc(s.t)}</legend>${s.f.length ? `<div class="xpgrid">${s.f.map(field).join("")}</div>` : `<div class="xpsum" aria-live="polite"></div><p class="xphint">When you continue, the enquiry form opens with these details filled in. Add your name and WhatsApp number and send. Nothing is booked until you confirm a written quote.</p>`}</fieldset>`).join("")}
<p class="xperr" role="alert"></p><div class="xpact"><button type="button" class="btn ghost2" data-back hidden>Back</button><button type="button" class="btn red" data-next>Next</button><button type="submit" class="btn red" data-send hidden>${esc(ctaLabel)} →</button></div></form>`;
  }

  /* ---------- page pieces ---------- */
  const hero = (e, extra = "") => crumbHtml => `<section class="xph xph-${e.theme}"><img class="xphi" src="${T(e.img)}" alt="${ATTR(e.alt || e.n)}" fetchpriority="high"><div class="xphw">${crumbHtml}<span class="xpscr">Travel Experiences · ${esc(e.n)}</span><h1>${esc(e.h1)}</h1><p>${esc(e.sub)}</p><div class="xphb"><a class="btn red" href="${e.cta[1]}">${esc(e.cta[0])} →</a><a class="btn glass" href="${e.cta2[1]}">${esc(e.cta2[0])}</a></div>${extra}</div></section>`;
  const others = cur => `<section class="xpo"><div class="h"><span class="eye">More travel experiences</span><h2>Travel designed around your purpose</h2></div><div class="xpol">${EXPERIENCES.filter(e => e.s != cur).map(e => `<a href="/experiences/${e.s}/" class="xpo-${e.theme}"><img src="${T(e.img)}" alt="" loading="lazy"><span><b>${esc(e.n)}</b><small>${esc(e.short)}</small></span></a>`).join("")}</div></section>`;
  const official = `<p class="xpofc">${IC.shield || ""}Visa, passport, transit, health and insurance requirements depend on your nationality and route. We point you to the official sources and help with documents, but entry and visa decisions are made by the authorities, and we cannot promise approval.</p>`;
  const emitX = (e, body, jsonld = []) => emit(X[e.s].url, page({
    path: X[e.s].url, active: "/experiences/", title: e.title, desc: e.desc, h1: e.h1, crumbs: [["Home", "/"], ["Travel Experiences", "/experiences/"], [e.n, X[e.s].url]],
    hero: { img: T(e.img), spot: hero(e) }, headExtra: HEAD, jsonld,
    body: datalist + body + others(e.s) + cta(`Ready to plan your ${e.n.toLowerCase()}?`, "Tell us where, when and why, and a planner replies on WhatsApp with options and a written quote.", e.n) + SCRIPT,
  }), "pages");

  /* ---------- 1. Business & Trade Travel ---------- */
  {
    const e = X["business-trade-travel"];
    const MON = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthOf = ev => MON[+ev.sort - 1];
    // event card: city photo with a calendar badge, status, a collapsible description and two clear actions
    const SHORT = { January: "Jan", February: "Feb", March: "Mar", April: "Apr", May: "May", June: "Jun", July: "Jul", August: "Aug", September: "Sep", October: "Oct", November: "Nov", December: "Dec" };
    const badge = ev => [SHORT[monthOf(ev)] + (ev.id == "canton-fair" ? " & Oct" : ""), "Every year"];
    const evCard = ev => { const [d1, d2] = badge(ev), img = photo(ev);
      return `<div class="xpevc"><figure class="xpevp">${img ? `<img src="${img}" alt="${ATTR(ev.city)}" loading="lazy">` : ""}<span class="xpcal"><b>${esc(d1)}</b><small>${esc(d2)}</small></span></figure>
<div class="xpevt"><h3>${esc(ev.name)}</h3><p class="xpwhere">${IC.pin}${where(ev)}</p><p class="xpwhen2">${esc(ev.when)}</p>${chipsRow(ev.tags)}<details class="xpmore2"><summary>About this event</summary><p>${esc(ev.text)}</p></details>
<div class="xpevb2">${planBtn("Plan travel", { purpose: "Trade fair or exhibition", dest: `${ev.city}, ${cName(ev.country)}`, event: ev.name }).replace('class="xpgo"', 'class="xpgo xpgo2"')}${ev.link ? `<a class="xpoff" href="${ev.link}" target="_blank" rel="noopener">Official site ↗</a>` : `<span class="xpoff off">Official site: ask us</span>`}</div></div></div>` };
    const evItems = [...D.EVENTS].sort((a, b) => a.sort.localeCompare(b.sort)).map(ev => ({
      ...ev, f: { industry: ev.tags, when: [monthOf(ev)] },
      html: evCard(ev),
    }));
    const whenOpts = [...new Set(evItems.map(i => i.f.when[0]))];
    const hubItems = D.HUBS.map(h => ({ ...h, f: { industry: h.tags }, html: `<div class="xphub"><h3>${esc(h.name)}</h3><p class="xpwhere">${IC.pin}${where(h)}</p><p>${esc(h.text)}</p>${chipsRow(h.tags)}${planBtn("Plan a visit", { purpose: "Factory & industry tours", dest: `${h.name}, ${cName(h.country)}` })}</div>` }));
    const steps = [
      { t: "Purpose", f: [{ k: "purpose", l: "What is the main purpose of the trip?", t: "chips", o: D.PURPOSES, req: 1 }] },
      { t: "Destination", f: [{ k: "dest", l: "Country, region or city", t: "dest", req: 1, ph: "e.g. Guangzhou, Frankfurt, Dubai, Las Vegas" }] },
      { t: "Industry & objective", f: [{ k: "industry", l: "Industry", t: "select", o: [...D.INDUSTRIES, "Other"] }, { k: "event", l: "Trade fair or event", t: "select", o: ["No specific event", ...D.EVENTS.map(x => x.name), "Another event (tell us below)"] }, { k: "objective", l: "Business objective", t: "area", wide: 1, ph: "e.g. meet five furniture suppliers, attend phase 2, explore distributors" }] },
      { t: "Travel details", f: [{ k: "from", l: "Departure city", t: "text", v: "Chennai", req: 1 }, { k: "date", l: "Travel date (approximate is fine)", t: "date" }, { k: "people", l: "Number of travellers", t: "num", v: 1, req: 1 }, { k: "duration", l: "Duration", t: "select", o: ["1–3 days", "4–6 days", "7–10 days", "11 days or more", "Not sure yet"] }, { k: "hotel", l: "Accommodation", t: "select", o: ["Business hotel near the venue", "4-star", "5-star", "Serviced apartment", "No preference"] }, { k: "extras", l: "Also arrange (subject to confirmation)", t: "multi", o: ["Airport transfers", "Private car and driver", "Interpreter", "Meeting room", "Fair registration guidance", "Travel insurance"] }, { k: "notes", l: "Anything else", t: "area", wide: 1 }] },
    ];
    const opp = [["A", "International trade fairs & exhibitions", "#events"], ["B", "Import, export & sourcing trips", "#sourcing"], ["C", "Manufacturing & industry tours", "#hubs"], ["D", "Corporate & executive travel", "#corporate"], ["E", "Business trip planner", "#planner"]];
    const body =
      `<div class="xpidx" role="navigation" aria-label="On this page">${opp.map(([k, t, u]) => `<a href="${u}"><em>${k}</em>${esc(t)}</a>`).join("")}</div>` +
      sec("A · Trade fairs & exhibitions", "World-leading trade events", `<p class="xplead">Filter by industry, region or month. Each listing links to the organiser, and we plan flights, hotels and transfers around the dates.</p>` + `<div class="xpmon" role="group" aria-label="Jump to a month"><button type="button" class="on" data-when="">All months</button>${whenOpts.map(w => `<button type="button" data-when="${ATTR(w)}">${esc(w)}</button>`).join("")}</div>` + discover("discover", evItems, { facets: [["industry", "Industry", D.INDUSTRIES], ["when", "When", whenOpts]], placeholder: "Search an event, city, country or industry", cat: e.n, mapTitle: "Map of trade fair cities" }) + note("Exact dates change from year to year. We confirm them with the organiser before booking any non-refundable travel. Visitor registration, badges and admission rules are set by each organiser."), { id: "events", cls: "xps" }) +
      `<section id="sourcing" class="xpsplit"><figure><img src="${T("x-biz-sourcing")}" alt="Machinery on a factory production line" loading="lazy"></figure><div><span class="eye">B · Import, export & sourcing</span><h2>Sourcing trips, planned around your suppliers</h2><p>For entrepreneurs, manufacturers, wholesalers, retailers, importers, exporters and procurement teams travelling anywhere in the world. Tell us the country, city, industry and objective; we plan the travel and the timing around your meetings.</p><ul class="xpticks">${D.SOURCING.map(s => `<li>${esc(s)}</li>`).join("")}</ul>${planBtn("Plan a sourcing trip", { purpose: "Product sourcing & supplier visits" })}<p class="xpsmall">Supplier introductions and factory access depend on the companies themselves; we arrange the travel, transfers and local support around the visits you set up or request.</p></div></section>` +
      sec("C · Manufacturing & industry tours", "Industrial clusters around the world", `<p class="xplead">Every region has its own specialities. Choose an industry to see where it is concentrated, or search any city.</p>` + discover("hubs-list", hubItems, { facets: [["industry", "Industry", D.INDUSTRIES]], placeholder: "Search a hub, country or industry", cat: e.n, mapTitle: "Map of industrial hubs" }), { id: "hubs", cls: "xps alt" }) +
      `<section id="corporate" class="xpcorp"><div class="xpcw"><div><span class="eye">D · Corporate & executive travel</span><h2>Delegations, conferences and incentive trips</h2><p>One planner for the whole group: flights from your city, hotels near the venue, transfers and a shared day-by-day plan.</p>${planBtn("Plan corporate travel", { purpose: "Conference or corporate delegation" })}</div><ol>${D.CORPORATE.map(([h, t]) => `<li><b>${esc(h)}</b><span>${esc(t)}</span></li>`).join("")}</ol></div><img src="${T("x-biz-corporate")}" alt="A conference room set up for a meeting" loading="lazy"></section>` +
      `<section id="planner" class="xpplan xpplan-biz"><div class="xpw"><div class="xpph"><span class="eye">E · Business trip planner</span><h2>Create your business itinerary</h2><p>Five quick steps. Multi-country trips are fine: add every city you need.</p>${official}</div>${planner(e.s, steps, { cta: "Create My Business Itinerary" })}</div></section>`;
    emitX(e, body);
  }

  /* ---------- 2. Roots, Heritage & Cultural Journeys ---------- */
  {
    const e = X["roots-heritage-journeys"];
    // Tamil Nadu leads: its regions are tabs at the top and the first entries in the destination list
    const TN = D.TN_ROOTS, tnImg = a => PHOTOS[a.photo]?.img || N.get(a.towns[0][1])?.img || "";
    const tnTowns = a => a.towns.map(([n, s]) => { const u = N.get(s)?.url; return u ? `<a href="${u}">${esc(n)}</a>` : esc(n) }).join("");
    const tnSec = `<section id="tamil-nadu" class="xptn"><div class="xpw"><div class="xptnh"><div><span class="eye">Tamil Nadu roots journeys</span><h2>Come home to Tamil Nadu</h2><p>${esc(TN.intro)}</p></div><ul class="xpticks">${TN.help.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>
<div class="xptabs" data-tabs><div class="xptl" role="tablist" aria-label="Regions of Tamil Nadu">${TN.areas.map((a, i) => `<button type="button" role="tab" id="tnt-${a.id}" aria-controls="tn-${a.id}" aria-selected="${!i}"${i ? ' tabindex="-1"' : ""}><b>${esc(a.name)}</b><small>${esc(a.short)}</small></button>`).join("")}</div>
${TN.areas.map((a, i) => `<div class="xptp" role="tabpanel" id="tn-${a.id}" aria-labelledby="tnt-${a.id}"${i ? " hidden" : ""}><figure>${tnImg(a) ? `<img src="${tnImg(a)}" alt="${ATTR(a.name)}" loading="lazy">` : ""}</figure><div><h3>${esc(a.name)}</h3><p>${esc(a.text)}</p><p class="xptown">${IC.pin}${tnTowns(a)}</p><h4>Things to explore</h4><ul class="xpticks">${a.explore.map(x => `<li>${esc(x)}</li>`).join("")}</ul><p class="xpwhen"><b>When to go:</b> ${esc(a.when)}</p>${planBtn("Plan a roots journey here", { dest: `${a.towns[0][0]}, Tamil Nadu` })}</div></div>`).join("")}</div></div></section>`;
    const tnItems = TN.areas.map(a => ({ id: `tn-${a.id}`, name: `${a.name}, Tamil Nadu`, country: "india", region: "asia", ll: a.ll, city: `${a.short}, ${a.towns.map(t => t[0]).join(", ")}`, tags: ["Ancestral villages", "Places of worship", "Food & traditions", "Tamil Nadu"], f: { theme: ["Tamil Nadu", "Ancestral villages", "Places of worship", "Food & traditions"] },
      html: `<div class="xpdc${tnImg(a) ? "" : " noimg"}">${tnImg(a) ? `<img src="${tnImg(a)}" alt="${ATTR(a.name)}" loading="lazy">` : ""}<div><h3>${esc(a.name)}</h3><p class="xpwhere">${IC.pin}Tamil Nadu, India · <a href="#tn-${a.id}" data-tab="tn-${a.id}">Explore this region</a></p><p>${esc(a.text)}</p><p class="xptown">${tnTowns(a)}</p>${planBtn("Plan this journey", { dest: `${a.towns[0][0]}, Tamil Nadu` })}</div></div>` }));
    const heritageTags = ["Tamil Nadu", ...new Set(D.HERITAGE.flatMap(h => h.tags))];
    const items = tnItems.concat(D.HERITAGE.map(h => ({ ...h, f: { theme: h.tags }, html: `<div class="xpdc${photo(h) ? "" : " noimg"}">${photo(h) ? `<img src="${photo(h)}" alt="${ATTR(h.name)}" loading="lazy">` : ""}<div><h3>${esc(h.name)}</h3><p class="xpwhere">${IC.pin}${esc(REGIONS[h.region])}${placeUrl(h) ? ` · <a href="${placeUrl(h)}">About ${esc(cName(h.country))}</a>` : ""}</p><p>${esc(h.text)}</p>${chipsRow(h.tags)}${planBtn("Plan this journey", { dest: h.name })}</div></div>` })));
    const steps = [
      { t: "Where your roots are", f: [{ k: "dest", l: "Country, region or town", t: "dest", req: 1, ph: "Any country, region, town or village", hint: "Add every place you want to include: ancestral towns, cities with relatives, heritage sites." }, { k: "place", l: "Village, street or address you know of", t: "text", wide: 1 }, { k: "known", l: "What you already know", t: "area", wide: 1, ph: "Family name, native village (ooru), kula deivam temple, region or parish, old documents or photos" }] },
      { t: "Who is travelling", f: [{ k: "people", l: "Number of travellers", t: "num", v: 2, req: 1 }, { k: "gens", l: "Generations travelling", t: "multi", o: ["Grandparents", "Parents", "Children", "Extended family"] }, { k: "access", l: "Mobility or accessibility needs", t: "area", wide: 1 }] },
      { t: "What matters to you", f: [{ k: "interests", l: "Experiences", t: "multi", o: ["Visit the ancestral village or home", "Archives and records", "Meet relatives or a family reunion", "Places of worship", "Festivals and traditions", "Food and cooking", "Historic sites", "Community visits"] }, { k: "date", l: "Travel date (approximate is fine)", t: "date" }, { k: "duration", l: "Duration", t: "select", o: ["Under a week", "1–2 weeks", "More than 2 weeks", "Not sure yet"] }, { k: "from", l: "Departure city", t: "text", v: "Chennai" }] },
    ];
    const body = tnSec +
      `<section class="xpher"><div class="xpherw"><div><span class="eye">Global heritage experiences</span><h2>Journeys that start with your story</h2><p>Roots journeys are personal. We do not assume where your family is from or what you will find; we start with what you know and plan carefully around it, with local guides, translators and archive visits where they help.</p><ol class="xpnum">${D.HERITAGE_TYPES.map(([h, t]) => `<li><b>${esc(h)}</b><span>${esc(t)}</span></li>`).join("")}</ol></div><div class="xpmos"><img src="${T("x-her-hero")}" alt="Traditional wooden and stone village houses" loading="lazy"><img src="${T("x-her-food")}" alt="A grandmother cooking in a traditional kitchen" loading="lazy"></div></div></section>` +
      sec("Heritage destinations", "Where heritage journeys often lead", `<p class="xplead">Examples from around the world. Your family's place does not need to be on this list: search any town or country, or describe it in the planner.</p>` + discover("discover", items, { facets: [["theme", "Experience", heritageTags]], placeholder: "Search a country, town or tradition", cat: e.n, mapTitle: "Map of heritage destinations" }), { id: "discover-sec", cls: "xps" }) +
      `<section id="planner" class="xpplan xpplan-her"><div class="xpw"><div class="xpph"><span class="eye">Heritage journey planner</span><h2>Plan my heritage journey</h2><p>Tell us what you know, even if it is only a family name and a region. We will suggest how to plan around it.</p><p class="xpsmall">For faith pilgrimages, see our <a href="/sacred/">Sacred journeys</a>.</p></div>${planner(e.s, steps, { cta: "Plan My Heritage Journey" })}</div></section>`;
    emitX(e, body);
  }

  /* ---------- 3. Worldwide Educational Trips ---------- */
  {
    const e = X["educational-trips"];
    const kinds = ["School educational tours", "College and university study trips", "Student exchange travel", "Historical and cultural study tours", "Science and technology visits", "Museum and research-centre tours", "Industrial and manufacturing visits", "Environmental and wildlife education", "Architecture and design study trips", "Agriculture and sustainability learning", "Language and cultural immersion", "Youth educational travel", "Academic conferences and competitions", "University and campus visits", "Customised learning expeditions"];
    const items = D.EDU.map(x => ({ ...x, f: { subject: x.tags, age: x.ages }, html: `<div class="xpdc${photo(x) ? "" : " noimg"}">${photo(x) ? `<img src="${photo(x)}" alt="${ATTR(x.name)}" loading="lazy">` : ""}<div><h3>${esc(x.name)}</h3><p class="xpwhere">${IC.pin}${where(x)} · ${esc(x.days)} days suggested</p><p>${esc(x.text)}</p>${chipsRow(x.tags)}<p class="xpsmall">Suits: ${esc(x.ages.join(", "))}</p>${planBtn("Plan this study trip", { dest: x.name.includes(" in ") ? x.name.split(" in ").pop() : cName(x.country), subjects: x.tags })}</div></div>` }));
    const steps = [
      { t: "Institution", f: [{ k: "inst", l: "Institution name", t: "text", req: 1, wide: 1 }, { k: "type", l: "Institution type", t: "chips", o: ["School", "College", "University", "Training institute", "Student organisation", "Other"], req: 1 }, { k: "role", l: "Your role", t: "text", ph: "Teacher, trip coordinator, principal…" }] },
      { t: "Group", f: [{ k: "age", l: "Student age group", t: "select", o: D.AGES, req: 1 }, { k: "students", l: "Number of students", t: "num", req: 1 }, { k: "staff", l: "Accompanying staff", t: "num", min: 0 }] },
      { t: "Learning goals", f: [{ k: "dest", l: "Destination or preferred countries", t: "dest", req: 1, ph: "Any country or city" }, { k: "subjects", l: "Subjects", t: "multi", o: D.SUBJECTS }, { k: "goals", l: "Educational objectives", t: "area", wide: 1, ph: "What should students learn or experience?" }, { k: "date", l: "Preferred dates", t: "date" }, { k: "duration", l: "Duration", t: "select", o: ["2–3 days", "4–6 days", "7–10 days", "11 days or more", "Not sure yet"] }, { k: "budget", l: "Budget per student", t: "select", o: ["Under ₹75,000", "₹75,000–1.5 lakh", "₹1.5–3 lakh", "Above ₹3 lakh", "Not sure yet"] }] },
      { t: "Logistics", f: [{ k: "stay", l: "Accommodation", t: "select", o: ["Student hotel or hostel", "3-star hotel", "4-star hotel", "University residence where available", "No preference"] }, { k: "transport", l: "Transport", t: "multi", o: ["Group flights", "Private coach", "Rail passes", "Airport transfers"] }, { k: "needs", l: "Accessibility, diet and other requirements", t: "area", wide: 1 }] },
    ];
    const pk = pkgsOfType("educational-tours");
    const body =
      `<section class="xpedu"><div class="xpw"><div class="h"><span class="eye">Worldwide educational travel</span><h2>For schools, colleges, universities and student groups</h2></div><ul class="xpcloud">${kinds.map(k => `<li>${esc(k)}</li>`).join("")}</ul></div></section>` +
      sec("Study destinations", "Find a study trip by subject, age and region", `<p class="xplead">Ideas to start from, not fixed packages: every educational trip is built around your syllabus and group.</p>` + discover("discover", items, { facets: [["subject", "Subject", D.SUBJECTS], ["age", "Age group", D.AGES]], placeholder: "Search a country, city or subject", cat: e.n, mapTitle: "Map of study destinations" }), { id: "discover-sec", cls: "xps" }) +
      `<section class="xpsplit rev"><figure><img src="${T("x-edu-hero")}" alt="Students on a coastal biology field trip" loading="lazy"></figure><div><span class="eye">Safety and supervision</span><h2>Planned with your institution</h2><ul class="xpticks"><li>Group flights, hotels and private coaches booked together</li><li>Licensed local guides and venue bookings for museums and visits</li><li>A named planner on WhatsApp before and during the trip</li><li>Room lists, day plans and emergency contacts shared with your staff</li><li>Travel insurance guidance and visa document checklists</li></ul><p class="xpsmall">Supervision ratios, consent forms and safeguarding policies are set by your institution; we plan the trip around them.</p></div></section>` +
      (pk.length ? sec("Ready itineraries", "Educational itineraries to start from", cards(pk.slice(0, 6).map(pkgCard)) + `<p><a class="btn ghost2" href="/tour-types/educational-tours/">All educational tour itineraries →</a></p>`, { cls: "alt" }) : "") +
      `<section id="planner" class="xpplan xpplan-edu"><div class="xpw"><div class="xpph"><span class="eye">Institutional enquiry</span><h2>Plan an educational journey</h2><p>Share your group, goals and dates. We send a draft itinerary and a written quote per student.</p>${official}</div>${planner(e.s, steps, { cta: "Plan an Educational Journey" })}</div></section>`;
    emitX(e, body);
  }

  /* ---------- 4. International Cruise Holidays ---------- */
  {
    const e = X["cruise-holidays"];
    const items = D.CRUISE.map(c => ({ ...c, f: { style: c.tags, port: c.ports }, html: `<div class="xproute${photo(c) ? "" : " noimg"}">${photo(c) ? `<img src="${photo(c)}" alt="${ATTR(c.name)}" loading="lazy">` : ""}<div><h3>${esc(c.name)}</h3><p>${esc(c.text)}</p><dl><dt>Typical season</dt><dd>${esc(c.season)}</dd><dt>Common departure ports</dt><dd>${esc(c.ports.join(" · "))}</dd></dl>${chipsRow(c.tags)}${planBtn("Request options", { regions: [c.name] })}</div></div>` }));
    const ports = [...new Set(D.CRUISE.flatMap(c => c.ports))].sort();
    const steps = [
      { t: "Where & style", f: [{ k: "regions", l: "Cruise regions", t: "multi", o: D.CRUISE.map(c => c.name), req: 1 }, { k: "port", l: "Departure port", t: "select", o: ["Flexible", ...ports] }, { k: "style", l: "Cruise style", t: "multi", o: D.CRUISE_STYLES }] },
      { t: "When & who", f: [{ k: "date", l: "Preferred sailing month or date", t: "date" }, { k: "nights", l: "Duration", t: "select", o: ["2–4 nights", "5–7 nights", "8–14 nights", "15 nights or more", "Flexible"] }, { k: "people", l: "Number of travellers", t: "num", v: 2, req: 1 }, { k: "cabin", l: "Cabin type", t: "select", o: ["Interior", "Ocean view", "Balcony", "Suite", "Not sure"] }, { k: "budget", l: "Budget per person", t: "select", o: ["Under ₹75,000", "₹75,000–1.5 lakh", "₹1.5–3 lakh", "Above ₹3 lakh", "Not sure yet"] }, { k: "line", l: "Preferred cruise line (if any)", t: "text" }, { k: "from", l: "Flying from", t: "text", v: "Chennai" }] },
    ];
    const pk = pkgsOfType("cruise-holidays");
    const body =
      `<section class="xpstyles"><div class="xpw"><div class="h"><span class="eye">Ways to cruise</span><h2>Ocean, river, expedition and everything between</h2></div><div class="xpsty">${[["Ocean cruises", "Big ships, many ports, entertainment on board.", "x-cru-hero"], ["River cruises", "Small ships that dock in the heart of cities.", "x-cru-river"], ["Expedition cruises", "Remote coasts, naturalists and Zodiac landings.", "x-cru-expedition"]].map(([h, t, k]) => `<figure><img src="${T(k)}" alt="${ATTR(h)}" loading="lazy"><figcaption><b>${esc(h)}</b>${esc(t)}</figcaption></figure>`).join("")}</div><p class="xplead">Also: coastal and island-hopping itineraries, luxury and family ships, honeymoon and group cruises, short getaways, multi-country sailings and cruise-and-land combinations.</p></div></section>` +
      sec("Cruise regions", "Explore worldwide cruise regions", `<p class="xplead">Seasons and ports below are typical patterns, not schedules: routes change every year and not every route sails from every port. Lines that sail many of these regions include ${esc(D.CRUISE_LINES)}.</p>` + discover("discover", items, { facets: [["style", "Cruise style", D.CRUISE_STYLES], ["port", "Departure port", ports]], placeholder: "Search a region, port or country", cat: e.n, mapTitle: "Map of cruise regions" }), { id: "discover-sec", cls: "xps" }) +
      (pk.length ? sec("Ready itineraries", "Cruise and houseboat itineraries", cards(pk.slice(0, 6).map(pkgCard)) + `<p><a class="btn ghost2" href="/tour-types/cruise-holidays/">All cruise and houseboat itineraries →</a></p>`, { cls: "alt" }) : "") +
      `<section id="planner" class="xpplan xpplan-cru"><div class="xpw"><div class="xpph"><span class="eye">Cruise finder</span><h2>Tell us how you want to sail</h2><p>We do not show live cabin availability or prices on this site. Share your choices and we send current sailings, cabin categories, inclusions and prices in a written quote.</p>${official}</div>${planner(e.s, steps, { cta: "Request Cruise Options" })}</div></section>`;
    emitX(e, body);
  }

  /* ---------- 5. Worldwide Luxury Yacht Experiences ---------- */
  {
    const e = X["luxury-yacht-experiences"];
    const items = D.YACHT.map(y => ({ ...y, f: { type: y.tags, marina: y.marinas }, html: `<div class="xpdc${photo(y) ? "" : " noimg"}">${photo(y) ? `<img src="${photo(y)}" alt="${ATTR(y.name)}" loading="lazy">` : ""}<div><h3>${esc(y.name)}</h3><p class="xpwhere">${IC.pin}${esc(REGIONS[y.region])} · ${esc(cName(y.country))}</p><p>${esc(y.text)}</p><dl><dt>Season</dt><dd>${esc(y.season)}</dd><dt>Departure marinas</dt><dd>${esc(y.marinas.join(" · "))}</dd></dl>${chipsRow(y.tags)}${planBtn("Plan a charter here", { region: y.name })}</div></div>` }));
    const marinas = [...new Set(D.YACHT.flatMap(y => y.marinas))].sort();
    const steps = [
      { t: "Where", f: [{ k: "region", l: "Sailing region", t: "chips", o: [...D.YACHT.map(y => y.name), "Somewhere else"], req: 1 }, { k: "marina", l: "Departure marina", t: "select", o: ["Flexible", ...marinas] }, { k: "dest", l: "Somewhere else? Add it here", t: "dest", hint: "Any coast or island not listed above." }] },
      { t: "Your charter", f: [{ k: "date", l: "Date", t: "date" }, { k: "duration", l: "Charter length", t: "select", o: ["2–4 hours", "Full day", "2–3 nights", "4–7 nights", "More than a week"], req: 1 }, { k: "people", l: "Number of guests", t: "num", v: 2, req: 1 }, { k: "type", l: "Yacht type", t: "select", o: [...D.YACHT_TYPES, "Not sure"] }, { k: "private", l: "Private or shared", t: "chips", o: ["Private charter", "Shared or cabin charter", "Not sure"] }, { k: "crew", l: "Crew", t: "chips", o: ["Skipper and crew", "Bareboat (licensed sailors only)", "Not sure"] }, { k: "occasion", l: "Occasion", t: "select", o: [...D.OCCASIONS, "Just a holiday"] }] },
      { t: "Budget & requests", f: [{ k: "budget", l: "Approximate budget for the group", t: "select", o: ["Under ₹50,000", "₹50,000–2 lakh", "₹2–10 lakh", "Above ₹10 lakh", "Not sure yet"] }, { k: "notes", l: "Additional requirements", t: "area", wide: 1, ph: "Catering, decorations, water sports, diving, photographer…" }] },
    ];
    const body =
      `<section class="xpyk"><div class="xpw"><div class="xpykg"><div><span class="eye">Before you charter</span><h2>What is included, and what is confirmed later</h2><dl class="xpdef"><dt>Private charter</dt><dd>The whole yacht and crew for your group only.</dd><dt>Shared or cabin charter</dt><dd>You book a cabin or seats and share the boat with other guests.</dd><dt>Skippered or crewed</dt><dd>A licensed skipper sails the yacht; larger yachts add a host, chef or deckhand.</dd><dt>Bareboat</dt><dd>You sail it yourself; only for guests holding the required sailing licences.</dd><dt>Confirmed in your quote</dt><dd>The exact yacht, guest capacity, inclusions, fuel and port fees, cancellation terms and price. Weather can change routes on the day.</dd></dl></div><div class="xpykp"><img src="${T("x-yac-cat")}" alt="A sailing catamaran seen from above in clear blue water" loading="lazy"><img src="${T("x-yac-gulet")}" alt="The deck of a traditional gulet moored in a Turkish bay" loading="lazy"></div></div><ul class="xpcloud">${["Private yacht charters", "Luxury sailing holidays", "Coastal escapes", "Island hopping", "Sunset sailing", "Honeymoon yachts", "Private celebrations", "Small-group sailing", "Corporate and executive charters", "Multi-day journeys", "Skippered sailing", "Marina and waterfront experiences"].map(k => `<li>${esc(k)}</li>`).join("")}</ul></div></section>` +
      sec("Sailing regions", "Discover the world's sailing waters", `<p class="xplead">Each region lists its main departure marinas and season. Specific yachts, capacities and prices come with your quote, as availability changes daily.</p>` + discover("discover", items, { facets: [["type", "Yacht type", D.YACHT_TYPES], ["marina", "Marina", marinas]], placeholder: "Search a coast, island or marina", cat: e.n, mapTitle: "Map of sailing regions" }), { id: "discover-sec", cls: "xps" }) +
      `<section id="planner" class="xpplan xpplan-yac"><div class="xpw"><div class="xpph"><span class="eye">Yacht planner</span><h2>Plan my yacht experience</h2><p>Tell us where, when and who. We reply with suitable yachts, what each includes and whether a skipper is part of it.</p></div>${planner(e.s, steps, { cta: "Plan My Yacht Experience" })}</div></section>`;
    emitX(e, body);
  }

  /* ---------- hub: all five categories and one worldwide search ---------- */
  {
    const lead = EXPERIENCES.find(e => e.lead), rest = EXPERIENCES.filter(e => !e.lead);
    const all = [
      ...D.EVENTS.map(x => ({ ...x, cat: "business-trade-travel", kind: "Trade fair" })), ...D.HUBS.map(x => ({ ...x, cat: "business-trade-travel", kind: "Industry hub" })),
      ...D.HERITAGE.map(x => ({ ...x, cat: "roots-heritage-journeys", kind: "Heritage destination" })), ...D.EDU.map(x => ({ ...x, cat: "educational-trips", kind: "Study destination" })),
      ...D.CRUISE.map(x => ({ ...x, cat: "cruise-holidays", kind: "Cruise region" })), ...D.YACHT.map(x => ({ ...x, cat: "luxury-yacht-experiences", kind: "Sailing region" })),
    ].map(x => ({ ...x, id: `${x.cat}-${x.id}`, f: { cat: [X[x.cat].n] }, html: `<div class="xprow"><span class="xpk xpk-${X[x.cat].theme}">${esc(x.kind)}</span><h3><a href="${X[x.cat].url}#${x.kind == "Industry hub" ? "hubs-list" : "discover"}-${x.id}">${esc(x.name)}</a></h3><p class="xpwhere">${IC.pin}${where(x)}</p></div>` }));
    const body = datalist +
      `<section class="xpfeat"><div class="xpw"><a class="xpbig" href="/experiences/${lead.s}/"><img src="${T(lead.img)}" alt="The exhibition halls of Messe Frankfurt, one of the world's major trade fair venues" loading="lazy"><span><em>Our primary focus</em><b>${esc(lead.n)}</b><small>${esc(lead.short)}</small><i>Explore →</i></span></a><div class="xped">${rest.map((e, i) => `<a class="xped-${i} xpo-${e.theme}" href="/experiences/${e.s}/"><img src="${T(e.img)}" alt="" loading="lazy"><span><b>${esc(e.n)}</b><small>${esc(e.short)}</small></span></a>`).join("")}</div></div></section>` +
      sec("Worldwide search", "Search every experience, anywhere", `<p class="xplead">Trade fairs, industry hubs, heritage destinations, study trips, cruise regions and sailing waters in one place. Nothing listed for your destination? Ask us anyway: we plan trips worldwide.</p>` + discover("discover", all, { facets: [["cat", "Experience", EXPERIENCES.map(e => e.n)]], placeholder: "Search any country, city or event", cat: "Travel Experiences", mapTitle: "World map of travel experiences", limit: 12 }), { id: "discover-sec", cls: "xps" }) + SCRIPT;
    emit("/experiences/", page({
      path: "/experiences/", active: "/experiences/", title: "Travel Experiences Worldwide | Nexara Holidays", desc: EXP_HUB.desc, h1: EXP_HUB.h1,
      crumbs: [["Home", "/"], ["Travel Experiences", "/experiences/"]], headExtra: HEAD,
      hero: { img: T("x-biz-skyline"), spot: crumbHtml => `<section class="xph xph-hub"><img class="xphi" src="${T("x-biz-skyline")}" alt="A city business district at dusk" fetchpriority="high"><div class="xphw">${crumbHtml}<span class="xpscr">${esc(EXP_HUB.scr)}</span><h1>${esc(EXP_HUB.h1)}</h1><p>${esc(EXP_HUB.sub)}</p><div class="xphb"><a class="btn red" href="/experiences/business-trade-travel/">Business & Trade Travel →</a><a class="btn glass" href="#discover">Search worldwide</a></div></div></section>` },
      body: body + cta("Have a different purpose in mind?", "Medical travel, sports events, film shoots or something else: tell us and we will plan it.", "Travel experience"),
    }), "pages");
  }

  return { X, T };
}

/** Home-page section "Travel the World Your Way" (inserted into index.html between EXPERIENCES markers). */
export function homeExperiences(TOPIC) {
  const T = k => TOPIC[k]?.img || "";
  const lead = EXPERIENCES.find(e => e.lead), rest = EXPERIENCES.filter(e => !e.lead);
  return `<section id="xp-home" class="xpfeat xph-home"><div class="xpw"><div class="h rv"><span class="eye">Travel Experiences</span><h2>${esc(EXP_HUB.h1)}</h2><p>${esc(EXP_HUB.sub)}</p></div><a class="xpbig rv" href="/experiences/${lead.s}/"><img src="${T(lead.img)}" alt="The exhibition halls of Messe Frankfurt, one of the world's major trade fair venues" loading="lazy"><span><em>Business & Trade Travel</em><b>${esc(lead.h1)}</b><small>Trade fairs from Canton Fair to Hannover Messe and CES, sourcing trips, industry tours and corporate travel worldwide.</small><i>Plan your business trip →</i></span></a><div class="xped rv">${rest.map((e, i) => `<a class="xped-${i} xpo-${e.theme}" href="/experiences/${e.s}/"><img src="${T(e.img)}" alt="" loading="lazy"><span><b>${esc(e.n)}</b><small>${esc(e.short)}</small></span></a>`).join("")}</div><p class="xpall"><a class="btn ghost2" href="/experiences/">All travel experiences →</a></p></div></section>`;
}

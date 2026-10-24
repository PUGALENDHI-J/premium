// Lists every destination (and its top attractions) that should have a photo, for tools/fetch_photos.py.
// Usage: node tools/photo-targets.mjs   -> research/photo-targets.json
import { writeFileSync } from "node:fs";
import { IN_REGIONS, STATES, IN_CITIES } from "../content/india.mjs";
import { W_REGIONS, COUNTRIES, W_CITIES } from "../content/world.mjs";
import { ADD_STATES, ADD_IN_CITIES, ADD_COUNTRIES, ADD_W_CITIES } from "../content/places-added.mjs";
import { slugify } from "./lib/html.mjs";

const ATTR_PER_PLACE = 2;
const states = [...STATES, ...ADD_STATES], countries = [...COUNTRIES, ...ADD_COUNTRIES];
const parentName = s => (states.find(x => x.s == s) || countries.find(x => x.s == s))?.n || "";
const out = [];
const place = (x, ctx) => {
  out.push({ key: x.s, kind: "place", q: [`${x.n} ${ctx}`.trim(), x.n] });
  for (const [a] of (x.a || []).slice(0, ATTR_PER_PLACE)) out.push({ key: `${x.s}--${slugify(a)}`, kind: "attraction", q: [`${a} ${x.n}`, a] });
};
for (const s of states) s.self ? place(s, "India") : out.push({ key: s.s, kind: "top", q: [`Tourism in ${s.n}`, s.n] });
for (const c of countries) c.self ? place(c, "") : out.push({ key: c.s, kind: "top", q: [`Tourism in ${c.n}`, c.n] });
for (const c of [...IN_CITIES, ...ADD_IN_CITIES, ...W_CITIES, ...ADD_W_CITIES]) place(c, parentName(c.p));
writeFileSync(new URL("../research/photo-targets.json", import.meta.url), JSON.stringify(out, null, 0));
console.log(out.length, "targets;", out.filter(t => t.kind != "attraction").length, "destinations");

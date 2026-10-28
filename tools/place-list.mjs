// Writes research/place-list.json: every destination with its parent and attraction names, for tools/vw_photos.py.
import { writeFileSync } from "node:fs";
import { IN_REGIONS, STATES, IN_CITIES } from "../content/india.mjs";
import { W_REGIONS, COUNTRIES, W_CITIES } from "../content/world.mjs";
import { ADD_STATES, ADD_IN_CITIES, ADD_COUNTRIES, ADD_W_CITIES } from "../content/places-added.mjs";
import { slugify } from "./lib/html.mjs";

const tops = [...STATES, ...ADD_STATES, ...COUNTRIES, ...ADD_COUNTRIES];
const out = [...tops, ...IN_CITIES, ...ADD_IN_CITIES, ...W_CITIES, ...ADD_W_CITIES].map(x => ({
  key: x.s, name: x.n, parent: x.p || "", parentName: tops.find(t => t.s == x.p)?.n || "",
  attractions: (x.a || []).map(([a]) => ({ key: `${x.s}--${slugify(a)}`, name: a })),
}));
writeFileSync(new URL("../research/place-list.json", import.meta.url), JSON.stringify(out));
console.log(out.length, "places");

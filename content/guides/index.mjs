// Travel guides (/travel-guides/<s>/). Each answers one real traveller question.
// Keys: s, title, desc, cat (GUIDE_CATS key), rel (destination slugs), trip (enquiry label), date, body (Markdown subset).
export const GUIDE_CATS = {
  "when-to-go": "When to go",
  "itineraries": "How many days and what to see",
  "getting-there": "Getting there and around",
  "planning": "Planning and preparation",
  "food-culture": "Food, culture and etiquette",
  "special-trips": "Honeymoon, family and special trips",
};
const parts = await Promise.all(["g1", "g2", "g3", "g4"].map(f => import(`./${f}.mjs`).then(m => m.G).catch(e => { if (e.code === "ERR_MODULE_NOT_FOUND") return []; throw e })));
export const GUIDES = parts.flat();

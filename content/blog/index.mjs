// Blog posts (/blog/<s>/) grouped into topic clusters (/blog/topic/<cluster>/).
// Keys: s, title, desc, cluster, rel (destination slugs), trip, date, body (Markdown subset).
export const CLUSTERS = {
  "india-travel": { n: "India travel planning", d: "Practical advice for planning holidays inside India: seasons, routes, trains, permits and budgets.", m: "temple" },
  "international-travel": { n: "International travel planning", d: "First trips abroad, visas, money, packing and choosing a destination from South India.", m: "sea" },
  "honeymoon": { n: "Honeymoon planning", d: "How to plan a honeymoon that suits you both, from budgets and seasons to destination comparisons.", m: "sea" },
  "family-travel": { n: "Family travel", d: "Holidays with children, teenagers and grandparents: destinations, pacing and practical tips.", m: "peak" },
  "adventure-nature": { n: "Adventure and nature", d: "Treks, safaris, diving and the outdoors, with honest advice on fitness, seasons and safety.", m: "karst" },
  "culture-heritage": { n: "Cultural and heritage travel", d: "Temples, monuments, festivals and living traditions in India and abroad.", m: "temple" },
  "budget-premium": { n: "Budget and premium travel", d: "Where to save, where to spend and how to get value at every budget.", m: "sea" },
  "itinerary-planning": { n: "Itinerary planning", d: "How many days, which order and how to pace a trip so it actually works.", m: "peak" },
  "seasonal": { n: "Seasonal holidays", d: "Where to go month by month, festival seasons and holidays for school breaks.", m: "karst" },
  "comparisons": { n: "Destination comparisons", d: "Head-to-head comparisons to help you choose between two popular destinations.", m: "temple" },
};
const parts = await Promise.all(["b1", "b2", "b3", "b4"].map(f => import(`./${f}.mjs`).then(m => m.B).catch(e => { if (e.code === "ERR_MODULE_NOT_FOUND") return []; throw e })));
export const POSTS = parts.flat();

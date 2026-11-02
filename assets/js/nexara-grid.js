/* Card grids: when the last row is only part full, centre it. Shared by index.html and every generated page.
   The grid keeps its own column count; this doubles the tracks, makes each card span two and offsets the first card
   of the last row by half the empty space. Re-runs on resize and when filter tabs show or hide cards. */
(() => {
  const SEL = ".et2,.oat,.dpbg,.dgrid,.ppl,.ipc,.acards,.kc3,.gal,.wg,#fgrid";
  const shown = el => el.offsetParent !== null && getComputedStyle(el).display != "none";
  const busy = new WeakSet();

  const centre = g => {
    busy.add(g);
    const kids = [...g.children];
    g.style.gridTemplateColumns = "";
    for (const k of kids) k.style.gridColumn = "";
    const cs = getComputedStyle(g);
    const cols = cs.display == "grid" && cs.gridAutoFlow.startsWith("row") ? cs.gridTemplateColumns.split(" ").filter(Boolean).length : 0;
    const vis = kids.filter(shown);
    if (cols > 1 && vis.length) {
      // the last row as laid out; a card may span several columns (the wide "planner's tip" card)
      const span = k => +(getComputedStyle(k).gridColumnEnd.match(/span (\d+)/)?.[1] || 1);
      const top = Math.max(...vis.map(k => k.offsetTop)), last = vis.filter(k => k.offsetTop == top);
      const used = last.reduce((a, k) => a + span(k), 0);
      if (used < cols) {
        g.style.gridTemplateColumns = `repeat(${cols * 2},minmax(0,1fr))`;
        for (const k of vis) k.style.gridColumn = `span ${span(k) * 2}`;
        last[0].style.gridColumn = `${cols - used + 1} / span ${span(last[0]) * 2}`;
      }
    }
    requestAnimationFrame(() => busy.delete(g));
  };

  const grids = [...document.querySelectorAll(SEL)];
  if (!grids.length) return;
  // which cards are showing; centring only needs redoing when this changes. Scrolling toggles classes and styles
  // all over the page (sticky header, scroll reveals, the home film), so re-laying out every grid on each of those
  // forced a full page layout several times a frame.
  const key = g => shown(g) ? [...g.children].map(k => shown(k) ? 1 : 0).join("") : "";
  const last = new WeakMap();
  const run = g => { centre(g); last.set(g, key(g)) };
  grids.forEach(run);
  let t = 0;
  addEventListener("resize", () => { cancelAnimationFrame(t); t = requestAnimationFrame(() => grids.forEach(run)) });
  // filter tabs hide cards by class or style, and view switches show whole sections; ignore the style changes made here
  let dirty = new Set(), q = 0;
  const flush = () => { q = 0; const gs = dirty; dirty = new Set(); gs.forEach(g => { if (key(g) != last.get(g)) run(g) }) };
  const NEW = "\n"; // a grid whose cards were replaced: always re-centre, the new cards have no spans yet
  new MutationObserver(ms => {
    for (const m of ms) {
      const el = m.target;
      if (el == document.body || el == document.documentElement || busy.has(el) || busy.has(el.parentElement)) continue;
      if (m.type == "childList" && grids.includes(el)) last.set(el, NEW);
      if (m.type == "attributes" && m.attributeName == "style" && !grids.includes(el.parentElement)) continue;
      for (const g of grids) if (g == el || g == el.parentElement || el.contains(g)) dirty.add(g);
    }
    if (dirty.size && !q) q = requestAnimationFrame(flush);
  }).observe(document.body, { subtree: true, attributes: true, attributeFilter: ["class", "hidden", "style"], childList: true });
})();

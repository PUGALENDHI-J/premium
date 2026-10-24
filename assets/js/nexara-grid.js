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
  grids.forEach(centre);
  let t = 0;
  const all = () => { cancelAnimationFrame(t); t = requestAnimationFrame(() => grids.forEach(centre)) };
  addEventListener("resize", all);
  // filter tabs hide cards by class or style; ignore the style changes made here
  new MutationObserver(ms => { if (ms.some(m => !busy.has(m.target.parentElement) && !busy.has(m.target))) all() })
    .observe(document.body, { subtree: true, attributes: true, attributeFilter: ["class", "hidden", "style"], childList: true });
})();

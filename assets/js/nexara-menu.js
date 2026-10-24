/* Mega menu: hover/focus opens panels on desktop (CSS); this adds click toggles for the burger menu,
   touch screens and keyboards, Escape to close, and closes panels when clicking elsewhere. */
(() => {
  const dds = [...document.querySelectorAll("nav .mdd")];
  if (!dds.length) return;
  const burger = matchMedia("(max-width:1180px)"), touch = matchMedia("(hover:none)");
  const set = (d, o) => { d.classList.toggle("open", o); d.querySelector(".ddt").setAttribute("aria-expanded", o) };
  const closeAll = keep => dds.forEach(d => d !== keep && set(d, false));

  dds.forEach(d => {
    const b = d.querySelector(".ddt"), a = d.querySelector(":scope>a");
    b.addEventListener("click", e => { e.preventDefault(); e.stopPropagation(); const o = !d.classList.contains("open"); closeAll(d); set(d, o) });
    // on a touch screen at desktop width the first tap opens the panel, the second follows the link
    a.addEventListener("click", e => { if (!burger.matches && touch.matches && !d.classList.contains("open")) { e.preventDefault(); closeAll(d); set(d, true) } });
    d.addEventListener("mouseleave", () => { d.classList.remove("shut"); if (!burger.matches) set(d, false) });
    d.addEventListener("focusout", e => { if (!d.contains(e.relatedTarget)) { d.classList.remove("shut"); if (!burger.matches) set(d, false) } });
  });
  document.addEventListener("click", e => { if (!e.target.closest("nav .mdd")) closeAll() });
  document.addEventListener("keydown", e => {
    if (e.key != "Escape") return;
    const d = document.activeElement && document.activeElement.closest && document.activeElement.closest("nav .mdd");
    closeAll(); if (d) { d.classList.add("shut"); d.querySelector(".ddt").focus() }
  });
})();

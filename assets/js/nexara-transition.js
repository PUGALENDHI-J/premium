/* Page transition: a curved panel sweeps up over the page when an internal link is clicked, and sweeps back down
   on the next page. Shared by index.html and every generated page; the <head> sets html.pt-in on arrival so the page
   stays covered until this runs. */
(() => {
  const html = document.documentElement;
  if (matchMedia("(prefers-reduced-motion:reduce)").matches) { html.classList.remove("pt-in"); return }

  // the panel's top edge: flat at the bottom (hidden), a hump (half way), flat at the top (covering the page)
  const shape = (y, cy) => `M 0 100 V ${y} Q 50 ${cy} 100 ${y} V 100 z`;
  const HALF = 200; // ms per stage
  const inEase = t => t * t, outEase = t => 1 - (1 - t) * (1 - t);
  // timeline position 0..1: stage 1 rises to the hump (ease in), stage 2 fills the screen (ease out)
  const at = T => {
    if (T <= .5) { const p = inEase(T * 2); return shape(100 - 50 * p, 100 - 100 * p) }
    const p = outEase(T * 2 - 1); return shape(50 - 50 * p, 0);
  };

  const wrap = document.createElement("div");
  wrap.className = "ptx";
  wrap.setAttribute("aria-hidden", "true");
  wrap.innerHTML = `<svg viewBox="0 0 100 100" preserveAspectRatio="none"><defs><linearGradient id="ptx-g" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse"><stop offset=".2" stop-color="#f20000"/><stop offset=".8" stop-color="#ff8a3d"/></linearGradient></defs><path fill="url(#ptx-g)" d="${shape(100, 100)}"/></svg>`;
  document.body.appendChild(wrap);
  const path = wrap.querySelector("path");

  let raf = 0;
  const play = (from, to, done) => {
    cancelAnimationFrame(raf);
    const t0 = performance.now(), dur = Math.abs(to - from) * HALF * 2;
    const step = now => {
      const k = Math.min(1, (now - t0) / dur), T = from + (to - from) * k;
      path.setAttribute("d", at(T));
      if (k < 1) raf = requestAnimationFrame(step); else done?.();
    };
    raf = requestAnimationFrame(step);
  };
  const reveal = () => { path.setAttribute("d", at(1)); wrap.classList.add("on"); html.classList.remove("pt-in"); play(1, 0, () => wrap.classList.remove("on")) };
  const reset = () => { cancelAnimationFrame(raf); path.setAttribute("d", at(0)); wrap.classList.remove("on"); html.classList.remove("pt-in") };

  if (html.classList.contains("pt-in")) reveal();
  // back/forward cache restores the covered page: uncover it
  addEventListener("pageshow", e => { if (e.persisted) reset() });

  // on window, so menu, lightbox and enquiry handlers on document run first and can claim the click
  addEventListener("click", e => {
    if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest("a[href]");
    if (!a || a.target && a.target != "_self" || a.hasAttribute("download") || a.matches("[data-lb],[data-enq]")) return;
    const url = new URL(a.href, location.href);
    if (url.origin != location.origin || !/^https?:$/.test(url.protocol)) return;
    if (url.pathname == location.pathname && url.search == location.search) return; // same page or #anchor
    if (/\.(jpe?g|png|webp|gif|svg|pdf|xml|txt)$/i.test(url.pathname)) return;
    e.preventDefault();
    wrap.classList.add("on");
    play(0, 1, () => {
      try { sessionStorage.setItem("nx-pt", Date.now()) } catch (_) {}
      location.href = url.href;
    });
  });
})();

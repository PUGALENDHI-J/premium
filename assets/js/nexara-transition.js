/* Page transition: a curved panel sweeps up over the page when an internal link is clicked, and sweeps back down
   on the next page. The panel is a red-tinted destination photo with a "next stop" caption and a dotted flight route
   that draws across the screen: the first part before leaving, the rest on arrival. Shared by index.html and every
   generated page; the <head> sets html.pt-in on arrival so the page stays covered until this runs. */
(() => {
  const html = document.documentElement;
  if (matchMedia("(prefers-reduced-motion:reduce)").matches) { html.classList.remove("pt-in"); return }

  const STOPS = [
    ["santorini-sunset", "Santorini, Greece"],
    ["dubai-night", "Dubai, UAE"],
    ["maldives-atoll", "The Maldives"],
    ["great-wall-autumn", "Great Wall, China"],
    ["le-morne-mauritius", "Le Morne, Mauritius"],
    ["wat-arun-night", "Bangkok, Thailand"],
    ["taj-mahal", "Agra, India"],
  ];
  const KEY = "nx-ptx";
  let saved = null;
  try { saved = JSON.parse(sessionStorage.getItem(KEY)); sessionStorage.removeItem(KEY) } catch (_) {}
  const arriving = html.classList.contains("pt-in");
  // arrival keeps the photo the last page left on; the next exit picks a different one
  let stop = arriving && saved && STOPS[saved.i] ? saved.i : Math.floor(Math.random() * STOPS.length);

  const wrap = document.createElement("div");
  wrap.className = "ptx";
  wrap.setAttribute("aria-hidden", "true");
  wrap.innerHTML = `<img alt="" decoding="async"><div class="ptx-c"><span class="ptx-k">Next stop</span><b class="ptx-n"></b>`
    + `<svg class="ptx-r" viewBox="0 0 300 70"><path class="ptx-rb" d="M 12 58 Q 150 -18 288 58"/><path class="ptx-rp" pathLength="100" d="M 12 58 Q 150 -18 288 58"/>`
    + `<circle class="ptx-e" cx="12" cy="58" r="4"/><circle class="ptx-e" cx="288" cy="58" r="4"/><circle class="ptx-d" r="5.5"/></svg>`
    + `<span class="ptx-w">Nexara Holidays</span></div>`;
  document.body.appendChild(wrap);
  const img = wrap.querySelector("img"), content = wrap.querySelector(".ptx-c"), name = wrap.querySelector(".ptx-n");
  const route = wrap.querySelector(".ptx-rp"), dot = wrap.querySelector(".ptx-d");
  const setStop = i => { stop = i; img.src = `/assets/hero/ptx/${STOPS[i][0]}.webp`; name.textContent = STOPS[i][1] };

  // the panel's top edge: flat at the bottom (hidden), a hump (half way), flat at the top (covering the page)
  const usePath = CSS.supports("clip-path", 'path("M 0 0 H 1 V 1 z")');
  const shape = (y, cy) => {
    if (!usePath) return `inset(${Math.min(y, cy)}% 0 0 0)`;
    const w = innerWidth, h = innerHeight, Y = y * h / 100;
    return `path("M 0 ${h} V ${Y} Q ${w / 2} ${cy * h / 100} ${w} ${Y} V ${h} z")`;
  };
  const inEase = t => t * t, outEase = t => 1 - (1 - t) * (1 - t);
  // panel position 0..1: stage 1 rises to the hump (ease in), stage 2 fills the screen (ease out)
  const panel = T => {
    let c;
    if (T <= .5) { const p = inEase(T * 2); c = shape(100 - 50 * p, 100 - 100 * p) }
    else { const p = outEase(T * 2 - 1); c = shape(50 - 50 * p, 0) }
    wrap.style.clipPath = wrap.style.webkitClipPath = c;
  };
  // route progress 0..1: the solid line and the dot follow the dotted arc
  const len = route.getTotalLength ? route.getTotalLength() : 0;
  const flight = p => {
    route.style.strokeDashoffset = 100 - 100 * p;
    if (!len) return;
    const pt = route.getPointAtLength(len * p);
    dot.setAttribute("cx", pt.x); dot.setAttribute("cy", pt.y);
  };
  // the caption rises in once the panel is mostly up, and the photo slowly zooms out the whole way through
  const look = (fade, zoom) => {
    content.style.opacity = fade;
    content.style.transform = `translateY(${(1 - fade) * 18}px)`;
    img.style.transform = `scale(${1 + .14 * zoom})`;
  };

  let raf = 0;
  const tween = (dur, frame, done) => {
    cancelAnimationFrame(raf);
    const t0 = performance.now();
    const step = now => {
      const k = Math.min(1, (now - t0) / dur);
      frame(k);
      if (k < 1) raf = requestAnimationFrame(step); else done?.();
    };
    raf = requestAnimationFrame(step);
  };
  const clamp = v => Math.max(0, Math.min(1, v));
  const LEAVE = .62; // share of the route drawn before the next page takes over
  // ms: kept short because the browser does not leave the page until the exit ends (the next page is prefetched meanwhile)
  const EXIT = 300, ARRIVE = 400;

  const reveal = () => {
    panel(1); flight(saved?.p ?? LEAVE); look(1, .5);
    wrap.classList.add("on"); html.classList.remove("pt-in");
    const from = saved?.p ?? LEAVE;
    // land: finish the route, then lower the panel while the caption fades
    tween(ARRIVE, k => {
      flight(from + (1 - from) * outEase(clamp(k / .4)));
      const d = clamp((k - .45) / .55);
      panel(1 - d);
      look(1 - clamp(d * 2.2), .5 * (1 - outEase(k)));
    }, () => { wrap.classList.remove("on"); setStop((stop + 1 + Math.floor(Math.random() * (STOPS.length - 1))) % STOPS.length) });
  };
  const reset = () => { cancelAnimationFrame(raf); panel(0); flight(0); wrap.classList.remove("on"); html.classList.remove("pt-in") };

  // on a fresh visit the photo waits for the page's own images
  if (arriving) { setStop(stop); reveal() } else { panel(0); addEventListener("load", () => setStop(stop)) }
  // back/forward cache restores the covered page: uncover it
  addEventListener("pageshow", e => { if (e.persisted) reset() });
  addEventListener("resize", () => { if (!wrap.classList.contains("on")) panel(0) });

  // an internal page link this transition handles, or null
  const pageLink = el => {
    const a = el && el.closest && el.closest("a[href]");
    if (!a || a.target && a.target != "_self" || a.hasAttribute("download") || a.matches("[data-lb],[data-enq]")) return null;
    const url = new URL(a.href, location.href);
    if (url.origin != location.origin || !/^https?:$/.test(url.protocol)) return null;
    if (url.pathname == location.pathname && url.search == location.search) return null; // same page or #anchor
    if (/\.(jpe?g|png|webp|gif|svg|pdf|xml|txt)$/i.test(url.pathname)) return null;
    return url;
  };
  // fetch the next page while the pointer is on its link, so the short exit below is usually all the wait there is
  const fetched = new Set();
  const prefetch = e => {
    const url = pageLink(e.target);
    if (!url || fetched.has(url.pathname)) return;
    fetched.add(url.pathname);
    const l = document.createElement("link");
    l.rel = "prefetch"; l.href = url.pathname + url.search;
    document.head.appendChild(l);
  };
  addEventListener("mouseover", prefetch, { passive: true });
  addEventListener("pointerdown", prefetch, { passive: true });

  // on window, so menu, lightbox and enquiry handlers on document run first and can claim the click
  addEventListener("click", e => {
    if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const url = pageLink(e.target);
    if (!url) return;
    e.preventDefault();
    if (!name.textContent) setStop(stop);
    flight(0); look(0, 1);
    wrap.classList.add("on");
    // take off: raise the panel, bring in the caption, start the route
    tween(EXIT, k => {
      panel(clamp(k / .5));
      look(outEase(clamp((k - .3) / .45)), 1 - .5 * k);
      flight(LEAVE * outEase(clamp((k - .35) / .65)));
    }, () => {
      try {
        sessionStorage.setItem("nx-pt", Date.now());
        sessionStorage.setItem(KEY, JSON.stringify({ i: stop, p: LEAVE }));
      } catch (_) {}
      location.href = url.href;
    });
  });
})();

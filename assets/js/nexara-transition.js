/* Page transition: a curved panel sweeps up over the page when an internal link is clicked, and sweeps back down
   on the next page. The panel is a red-tinted photo of the page being opened, with a "next stop" caption naming it
   (the place, package or page clicked) and a dotted flight route
   that draws across the screen: the first part before leaving, the rest on arrival. Shared by index.html and every
   generated page; the <head> sets html.pt-in on arrival so the page stays covered until this runs. */
(() => {
  const html = document.documentElement;
  if (matchMedia("(prefers-reduced-motion:reduce)").matches) { html.classList.remove("pt-in"); return }

  // what the clicked link opens: its name and photo. Names come from the site search index (page name, photo per URL),
  // else from the link itself (card title, label, image alt); the photo is the one on the clicked card, else the page's own.
  const KEY = "nx-ptx";
  let saved = null;
  try { saved = JSON.parse(sessionStorage.getItem(KEY)); sessionStorage.removeItem(KEY) } catch (_) {}
  const arriving = html.classList.contains("pt-in") || !!document.querySelector("body > .ptx.on");
  let idx = null, idxP = null;
  const loadIdx = () => idxP || (idxP = fetch("/assets/search-index.json").then(r => r.ok ? r.json() : []).then(d => { idx = new Map(d.map(r => [r[1], r])) }).catch(() => {}));
  const full = src => src ? src.replace(/\/(xs|sm)\/([^/]+)$/, "/$2") : "";
  const clean = t => String(t || "").replace(/[→›»]/g, "").replace(/\s+/g, " ").trim();
  const GENERIC = /^(view|read|explore|see|discover|open|more|book|go|details|plan|request|enquire|all)/i;
  const cardOf = a => a.closest(".dc,.acard,.brt,.ipc>div,.ppl>a,li,figure") || a;
  const target = (a, url) => {
    const row = idx && idx.get(url.pathname);
    const card = cardOf(a);
    const own = [a.querySelector("h3"), a.querySelector(".brl b"), a.querySelector("b")].map(e => e && clean(e.textContent)).find(Boolean);
    let n = row ? clean(row[0]) : "";
    if (!n) n = own || "";
    if (!n || GENERIC.test(n)) { const t = clean(a.getAttribute("aria-label") || a.textContent); n = t && !GENERIC.test(t) ? t : clean(card.querySelector("h3,h2,b")?.textContent) || clean(a.querySelector("img")?.alt) || t }
    if (url.pathname == "/") n = "Nexara Holidays";
    const pic = a.querySelector("img") || (card != a && card.querySelector("img"));
    const im = (pic && (pic.currentSrc || pic.src)) || (row && row[4] ? full(row[4]) : "");
    return { n: n.slice(0, 70), im };
  };

  // on arrival the inline script at the top of <body> has already built the covering panel; adopt it
  let wrap = document.querySelector("body > .ptx");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.className = "ptx";
    wrap.setAttribute("aria-hidden", "true");
    wrap.innerHTML = `<img alt="" decoding="async"><div class="ptx-c"><span class="ptx-k">Next stop</span><b class="ptx-n"></b><svg class="ptx-r" viewBox="0 0 300 70"><path class="ptx-rb" d="M 12 58 Q 150 -18 288 58"/><path class="ptx-rp" pathLength="100" d="M 12 58 Q 150 -18 288 58"/><circle class="ptx-e" cx="12" cy="58" r="4"/><circle class="ptx-e" cx="288" cy="58" r="4"/><circle class="ptx-d" r="5.5"/></svg><span class="ptx-w">Nexara Holidays</span></div>`;
    document.body.appendChild(wrap);
  }
  const img = wrap.querySelector("img"), content = wrap.querySelector(".ptx-c"), name = wrap.querySelector(".ptx-n");
  const route = wrap.querySelector(".ptx-rp"), dot = wrap.querySelector(".ptx-d");
  const setStop = t => { if (t.im) img.src = t.im; else img.removeAttribute("src"); img.style.visibility = t.im ? "" : "hidden"; name.textContent = t.n || "" };

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
    // land: finish the route, then lower the panel while the caption fades. The page stays covered until its other
    // scripts have run and it has painted (DOMContentLoaded, then two frames), and the photo is decoded, so their
    // start-up work does not stall the animation half way down
    let started = false;
    const land = () => { if (started) return; started = true; tween(ARRIVE, k => {
      flight(from + (1 - from) * outEase(clamp(k / .4)));
      const d = clamp((k - .45) / .55);
      panel(1 - d);
      look(1 - clamp(d * 2.2), .5 * (1 - outEase(k)));
    }, () => { wrap.classList.remove("on") }) };
    const ready = Promise.all([
      // deferred scripts run before DOMContentLoaded, so it is still to come here unless the page has fully loaded
      new Promise(r => document.readyState == "complete" ? r() : addEventListener("DOMContentLoaded", r, { once: true })),
      img.getAttribute("src") ? img.decode().catch(() => {}) : null,
    ]);
    ready.then(() => requestAnimationFrame(() => requestAnimationFrame(land)));
    setTimeout(land, 1500); // never leave the page covered
  };
  const reset = () => { cancelAnimationFrame(raf); panel(0); flight(0); wrap.classList.remove("on"); html.classList.remove("pt-in") };

  // arrival shows the name and photo the last page left on
  if (arriving && saved) { setStop(saved); reveal() } else { panel(0); html.classList.remove("pt-in") }
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
    if (!url) return;
    loadIdx();
    if (fetched.has(url.pathname)) return;
    fetched.add(url.pathname);
    // warm the photo the transition will show
    const t = target(e.target.closest("a[href]"), url); if (t.im) new Image().src = t.im;
    const l = document.createElement("link");
    l.rel = "prefetch"; l.href = url.pathname + url.search;
    document.head.appendChild(l);
  };
  addEventListener("mouseover", prefetch, { passive: true });
  addEventListener("pointerdown", prefetch, { passive: true });
  addEventListener("focusin", prefetch, { passive: true });

  // on window, so menu, lightbox and enquiry handlers on document run first and can claim the click
  addEventListener("click", e => {
    if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const url = pageLink(e.target);
    if (!url) return;
    e.preventDefault();
    const next = target(e.target.closest("a[href]"), url);
    setStop(next);
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
        sessionStorage.setItem(KEY, JSON.stringify({ n: next.n, im: next.im, p: LEAVE }));
      } catch (_) {}
      location.href = url.href;
    });
  });
})();

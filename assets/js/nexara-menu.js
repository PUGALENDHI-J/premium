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

/* Burger menu (up to 1180px wide): the nav opens as three stacked panels (menu, quote, contact) on one GSAP timeline.
   A pause splits enter from exit: closing during the entrance reverses it (easeReverse makes it snappier),
   closing once open plays on into the exit, where the panels fall away with a random tilt. Without GSAP it just shows and hides. */
(() => {
  const nav = document.querySelector("header>nav"), bt = document.querySelector("header>.burger"), root = document.documentElement;
  if (!nav || !bt) return;
  const href = s => { const a = document.querySelector(s); return a ? a.getAttribute("href") : "" };
  const li = (h, t, out) => h ? `<li><a href="${h}"${out ? ' target="_blank" rel="noopener"' : ""}>${t}</a></li>` : "";
  const ph = nav.querySelector(".ph"), wa = href('a[href*="wa.me"]');
  nav.insertAdjacentHTML("afterbegin", '<div class="mbg"></div>');
  nav.insertAdjacentHTML("beforeend", `<div class="mfeat mpanel"><small>Plan with a real person</small><div class="mfc"><i><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 16l20-6-3-2-6 2-6-6H5l3 7-4 1-2-2H1z"/></svg></i><div><b>Your next holiday starts here</b><p>Tell us where you want to go. We reply on WhatsApp with a plan and a price.</p></div></div><div class="mfa"><a href="${ph ? ph.getAttribute("href") : "/custom-tour/"}" data-enq>Get a free quote</a>${wa ? `<a href="${wa}" target="_blank" rel="noopener">WhatsApp us</a>` : ""}</div></div><div class="mfoot mpanel"><ul>${li(href('a[href^="tel:"]'), "Call")}${li(wa, "WhatsApp", 1)}${li(href('a[href^="mailto:"]'), "Email")}${li(href('a[href*="instagram.com"]'), "Instagram", 1)}</ul><img src="/assets/logo-circle.webp" alt=""></div>`);
  const nl = nav.querySelector(".nl"), brand = document.querySelector("header>.brand");
  nl.classList.add("mpanel");
  if (brand) { const c = brand.cloneNode(true); c.classList.replace("brand", "mlogo"); c.tabIndex = -1; nl.prepend(c) }
  bt.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><line class="bt1" x1="4" y1="8" x2="20" y2="8"/><line class="bt2" x1="8" y1="16" x2="20" y2="16"/></svg>';

  let open = false, tl = null, enterEnd = 0, speed = 1;
  const unlock = () => { if (!open) root.classList.remove("mopen") };
  function toggle(o = !open) {
    if (o == open) return;
    open = o;
    bt.setAttribute("aria-expanded", o); bt.setAttribute("aria-label", o ? "Close menu" : "Menu");
    if (o) root.classList.add("mopen");
    if (!tl) { nav.classList.toggle("open", o); unlock(); return }
    if (o) tl.timeScale(speed)[tl.time() >= enterEnd ? "restart" : "play"]();
    else if (tl.time() < enterEnd) tl.timeScale(speed * 1.5).reverse();
    else tl.timeScale(speed).play();
  }
  bt.addEventListener("click", () => toggle());
  nav.querySelector(".mbg").addEventListener("click", () => toggle(false));
  nav.addEventListener("click", e => { if (open && e.target.closest("a")) toggle(false) });
  document.addEventListener("keydown", e => { if (e.key == "Escape" && open) { toggle(false); bt.focus() } });
  if (!window.gsap) return;

  gsap.matchMedia().add("(max-width:1180px)", () => {
    const panels = nav.querySelectorAll(".mpanel"), bg = nav.querySelector(".mbg");
    speed = matchMedia("(prefers-reduced-motion:reduce)").matches ? 20 : 1;
    tl = gsap.timeline({ paused: true, onComplete: unlock, onReverseComplete: unlock })
      .set(nav, { visibility: "visible", pointerEvents: "auto" })
      // enter
      .to(bg, { opacity: 1, duration: .4, ease: "power2.out", easeReverse: "power4.out" }, 0)
      .fromTo(panels, { x: "110%", y: 0, rotation: 0 }, { x: "0%", y: 0, duration: .6, ease: "back.out", easeReverse: "power3.in", stagger: .1 }, 0)
      .fromTo(nav.querySelectorAll(".nl>*"), { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 1.2, ease: "expo.out", easeReverse: "power3.in", stagger: .03 }, .1)
      .to(".bt1", { attr: { x1: 6, y1: 6, x2: 18, y2: 18 }, duration: .35, ease: "back.out(1.4)", easeReverse: "power3.out" }, .06)
      .to(".bt2", { attr: { x1: 18, y1: 6, x2: 6, y2: 18 }, duration: .35, ease: "back.out(1.4)", easeReverse: "power3.out" }, .06)
      .fromTo(nav.querySelectorAll(".mfeat>*,.mfoot li"), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .3, ease: "power3.out", easeReverse: "power4.out", stagger: .04 }, .4)
      .addPause();
    enterEnd = tl.duration();
    // exit: X back to the burger, panels fall bottom first
    tl.to(".bt1", { attr: { x1: 4, y1: 8, x2: 20, y2: 8 }, duration: .2, ease: "power3.in" })
      .to(".bt2", { attr: { x1: 8, y1: 16, x2: 20, y2: 16 }, duration: .2, ease: "power3.in" }, "<")
      .to(panels, { y: "110vh", rotation: "random(-25,25)", duration: 1, ease: "power3.in", stagger: { from: "end", each: .02 } }, "<")
      .to(bg, { opacity: 0, duration: .3, ease: "power2.in" }, "<0.1")
      .set(nav, { visibility: "hidden", pointerEvents: "none" });
    return () => { tl = null; open = false; bt.setAttribute("aria-expanded", false); root.classList.remove("mopen") };
  });
})();

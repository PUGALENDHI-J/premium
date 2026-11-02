/* About page: counting stats, the plan showcase (tabs that open their panel and swap the photo, advancing on
   their own while in view), the timeline that fills on scroll, card reveals and pointer parallax on the collage. */
(() => {
  const RM = matchMedia("(prefers-reduced-motion:reduce)").matches, IO = "IntersectionObserver" in window;
  const once = (els, fn, margin = "0px 0px -12% 0px") => {
    if (RM || !IO) { els.forEach(fn); return }
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { fn(e.target); io.unobserve(e.target) } }), { rootMargin: margin });
    els.forEach(el => io.observe(el));
  };

  /* stats count up from zero */
  once(document.querySelectorAll(".abx-stats [data-count]"), b => {
    const n = +b.dataset.count, s = b.dataset.suffix || "";
    if (RM) return;
    const t0 = performance.now(), dur = 1400;
    const step = t => { const k = Math.min((t - t0) / dur, 1); b.textContent = Math.round(n * (1 - Math.pow(1 - k, 3))) + s; k < 1 && requestAnimationFrame(step) };
    requestAnimationFrame(step);
  });

  /* timeline line and dots */
  once(document.querySelectorAll(".abx-steps"), el => el.classList.add("in"), "0px 0px -25% 0px");

  /* staggered reveals (reuses the .rv styles from nexara-ui.css) */
  if (!RM && IO) {
    const items = document.querySelectorAll(".abx-stats li, .abx-plist li, .abx-steps li, .abx-show .abx-tabs li, .abx-cta");
    items.forEach(el => { el.style.setProperty("--d", [...el.parentNode.children].indexOf(el) % 6 * 0.08 + "s"); el.classList.add("rv") });
    once(items, el => el.classList.add("in"));
  }

  /* plan showcase */
  document.querySelectorAll(".abx-show").forEach(show => {
    const tabs = [...show.querySelectorAll(".abx-tabs li")], figs = [...show.querySelectorAll(".abx-media figure")], num = show.querySelector(".abx-num b");
    let cur = 0, manual = false;
    show.classList.add("js");
    const go = i => {
      cur = (i + tabs.length) % tabs.length;
      tabs.forEach((li, k) => { li.classList.toggle("on", k == cur); li.querySelector("button").setAttribute("aria-expanded", k == cur) });
      figs.forEach((f, k) => f.classList.toggle("on", k == cur));
      if (num) num.textContent = String(cur + 1).padStart(2, "0");
    };
    tabs.forEach((li, k) => {
      li.querySelector("button").addEventListener("click", () => { manual = true; show.classList.remove("auto"); go(k) });
      li.querySelector(".abx-bar span").addEventListener("animationend", () => { if (!manual) { go(cur + 1); restartBar() } });
    });
    // re-trigger the progress animation on the newly active tab
    const restartBar = () => { show.classList.remove("auto"); void show.offsetWidth; !manual && show.classList.add("auto") };
    const hold = on => show.classList.toggle("hold", on);
    show.addEventListener("pointerenter", () => hold(true));
    show.addEventListener("pointerleave", () => hold(show.contains(document.activeElement)));
    show.addEventListener("focusin", () => hold(true));
    show.addEventListener("focusout", e => { if (!show.contains(e.relatedTarget)) hold(false) });
    if (RM || !IO) return;
    new IntersectionObserver(es => es.forEach(e => { if (manual) return; e.isIntersecting ? restartBar() : show.classList.remove("auto") }), { threshold: .35 }).observe(show);
  });

  /* collage drifts with the pointer (mouse only) */
  const art = document.querySelector(".abx-art");
  if (art && !RM && matchMedia("(hover:hover) and (pointer:fine)").matches) {
    const box = art.closest("section");
    let raf = 0;
    box.addEventListener("pointermove", e => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = box.getBoundingClientRect();
        art.style.setProperty("--mx", ((e.clientX - r.left) / r.width - .5).toFixed(3));
        art.style.setProperty("--my", ((e.clientY - r.top) / r.height - .5).toFixed(3));
      });
    });
    box.addEventListener("pointerleave", () => { art.style.setProperty("--mx", 0); art.style.setProperty("--my", 0) });
  }
})();

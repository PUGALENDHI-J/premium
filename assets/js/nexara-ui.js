/* Inner-page interactions: scroll reveals, gallery lightbox and a gentle hero parallax. */
(() => {
  const RM = matchMedia("(prefers-reduced-motion:reduce)").matches;

  /* reveal cards, gallery items, boxes and section headings as they scroll into view */
  const items = document.querySelectorAll("main .dc, main .gal figure, main .acard, main section>.h, main .box, main .pstrip a, main .gl2>div, main .groups>div");
  if (!RM && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target) } }), { rootMargin: "0px 0px -8% 0px" });
    items.forEach(el => {
      const sibs = el.parentNode ? [...el.parentNode.children] : [];
      el.style.setProperty("--d", Math.min(sibs.indexOf(el) % 4, 3) * 0.08 + "s");
      el.classList.add("rv"); io.observe(el);
    });
  }

  /* hero parallax */
  const hi = document.querySelector(".pgh>.pgi");
  if (hi && !RM) {
    let tick = false;
    addEventListener("scroll", () => {
      if (tick) return; tick = true;
      requestAnimationFrame(() => { const y = Math.min(scrollY, innerHeight); hi.style.translate = `0 ${y * 0.25}px`; tick = false });
    }, { passive: true });
  }

  /* lightbox for gallery photos */
  const links = [...document.querySelectorAll("a[data-lb]")];
  if (!links.length) return;
  const lb = document.createElement("div");
  lb.className = "lb"; lb.setAttribute("role", "dialog"); lb.setAttribute("aria-modal", "true"); lb.setAttribute("aria-label", "Photo viewer");
  lb.innerHTML = '<figure><img alt=""><figcaption></figcaption></figure><button class="lbx" aria-label="Close">×</button><button class="lbp" aria-label="Previous photo">‹</button><button class="lbn" aria-label="Next photo">›</button>';
  document.body.appendChild(lb);
  const img = lb.querySelector("img"), cap = lb.querySelector("figcaption");
  let i = 0, last = null;
  const show = n => { i = (n + links.length) % links.length; const a = links[i]; img.src = a.href; img.alt = a.dataset.cap || ""; cap.textContent = a.dataset.cap || "" };
  const open = n => { last = document.activeElement; show(n); lb.classList.add("on"); lb.querySelector(".lbx").focus() };
  const close = () => { lb.classList.remove("on"); last && last.focus() };
  links.forEach((a, n) => a.addEventListener("click", e => { e.preventDefault(); open(n) }));
  lb.querySelector(".lbx").onclick = close;
  lb.querySelector(".lbp").onclick = () => show(i - 1);
  lb.querySelector(".lbn").onclick = () => show(i + 1);
  lb.addEventListener("click", e => { if (e.target === lb) close() });
  addEventListener("keydown", e => { if (!lb.classList.contains("on")) return; if (e.key == "Escape") close(); if (e.key == "ArrowLeft") show(i - 1); if (e.key == "ArrowRight") show(i + 1) });
  links.length < 2 && lb.querySelectorAll(".lbp,.lbn").forEach(b => b.hidden = true);
})();

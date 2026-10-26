/* Travel Experiences: discovery blocks (search, filters, Leaflet map) and step-by-step planners.
   The planner never books anything: it hands the visitor's answers to the site's enquiry dialog
   (window.nxEnq in nexara-pages.js), which opens WhatsApp with the message. */
(function () {
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const norm = s => String(s || "").toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").trim();
  const enquire = o => {
    if (window.nxEnq) return window.nxEnq(o);
    const m = `Hi Nexara Holidays, I would like a quote (enquiry, not a booking yet).\nTrip: ${o.trip}\n${o.note || ""}\nPage: ${location.href}`;
    window.open("https://wa.me/917305971481?text=" + encodeURIComponent(m), "_blank", "noopener");
  };

  /* ---------- Leaflet, loaded once and only when a map scrolls into view ---------- */
  let leaflet;
  const loadLeaflet = () => leaflet || (leaflet = new Promise((ok, bad) => {
    const css = document.createElement("link"); css.rel = "stylesheet"; css.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"; document.head.appendChild(css);
    const js = document.createElement("script"); js.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"; js.onload = () => ok(window.L); js.onerror = bad; document.head.appendChild(js);
  }));

  /* ---------- discovery ---------- */
  $$("[data-xpd]").forEach(box => {
    const items = $$(".xpi", box), ctl = $$("[data-k]", box.querySelector(".xpf")), cnt = box.querySelector(".xpcount b"), none = box.querySelector(".xpnone");
    const q = box.querySelector('[data-k="q"]'), mapEl = box.querySelector("[data-map]");
    let map, layer, marks = new Map(), open = !box.dataset.limit;
    const more = box.querySelector("[data-more]"); if (more) more.onclick = () => { open = true; apply() };
    function apply() {
      const v = Object.fromEntries(ctl.map(c => [c.dataset.k, c.value])), words = norm(v.q).split(/[\s,]+/).filter(Boolean);
      let n = 0;
      items.forEach(it => {
        let show = (!v.region || it.dataset.region == v.region) && (!v.country || it.dataset.country == v.country) && words.every(w => it.dataset.q.includes(w));
        for (const [k, val] of Object.entries(v)) if (val && !["q", "region", "country"].includes(k)) show = show && (it.dataset["f" + k[0].toUpperCase() + k.slice(1)] || "").split("|").includes(val);
        if (show) n++;
        // with no search or filter, a long list starts with its first few entries
        it.classList.toggle("hide", !show || (!open && !Object.values(v).some(Boolean) && n > +box.dataset.limit));
      });
      if (more) more.hidden = open || Object.values(v).some(Boolean);
      cnt.textContent = n;
      cnt.parentNode.lastChild.textContent = n == 1 ? " match" : n == items.length ? " to explore" : " matches";
      none.hidden = n > 0 && !(n < 3 && v.q);
      none.querySelector("span").textContent = v.q ? `“${v.q}”` : "another destination";
      if (map) syncMap();
    }
    ctl.forEach(c => c.addEventListener(c.tagName == "SELECT" ? "change" : "input", apply));
    box.querySelector("[data-clear]").onclick = () => { ctl.forEach(c => c.value = ""); apply(); q.focus() };
    none.querySelector("[data-custom]").onclick = () => enquire({ trip: `${box.dataset.cat || "Travel"}: ${q.value.trim() || "a destination not listed"}`, note: q.value.trim() ? `Destination I'm interested in: ${q.value.trim()}` : "" });

    function syncMap() {
      const vis = [];
      marks.forEach((m, it) => { const on = !it.classList.contains("hide"); if (on) { layer.addLayer(m); vis.push(m.getLatLng()) } else layer.removeLayer(m) });
      if (vis.length) map.fitBounds(window.L.latLngBounds(vis).pad(.25), { maxZoom: 6, animate: !RM });
    }
    function focusItem(it) {
      it.classList.add("hl"); it.scrollIntoView({ behavior: RM ? "auto" : "smooth", block: "center" });
      setTimeout(() => it.classList.remove("hl"), 2400);
    }
    if (mapEl && "IntersectionObserver" in window) {
      const io = new IntersectionObserver(es => {
        if (!es.some(e => e.isIntersecting)) return; io.disconnect();
        loadLeaflet().then(L => {
          mapEl.textContent = "";
          map = L.map(mapEl, { scrollWheelZoom: false, worldCopyJump: true }).setView([20, 20], 2);
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }).addTo(map);
          layer = L.layerGroup().addTo(map);
          items.forEach(it => {
            if (!it.dataset.ll) return;
            const ll = it.dataset.ll.split(",").map(Number);
            const m = L.circleMarker(ll, { radius: 8, color: "#fff", weight: 2, fillColor: "#ff0000", fillOpacity: .9 });
            const pop = document.createElement("div"); pop.innerHTML = `<b>${esc(it.dataset.name)}</b><br><button type="button">Show details ↓</button>`;
            pop.querySelector("button").onclick = () => { map.closePopup(); focusItem(it) };
            m.bindPopup(pop); marks.set(it, m);
          });
          syncMap();
        }).catch(() => { mapEl.textContent = "The map could not load. The list beside it has every destination." });
      }, { rootMargin: "200px" });
      io.observe(mapEl);
    }
    // arriving at #<item id> from the hub search: show and highlight that item
    const hit = location.hash && box.querySelector(location.hash.replace(/[^#\w-]/g, ""));
    if (hit && hit.classList.contains("xpi")) setTimeout(() => focusItem(hit), 400);
    apply();
  });

  /* ---------- planners ---------- */
  $$("[data-xpp]").forEach(form => {
    const steps = $$(".xpst", form), dots = $$(".xpsteps li", form), err = form.querySelector(".xperr");
    const back = form.querySelector("[data-back]"), next = form.querySelector("[data-next]"), send = form.querySelector("[data-send]");
    let cur = 0;
    const dests = new Map(); // field key -> [values]

    // destination fields: type, press Enter or Add, remove with ×
    $$(".xpdest", form).forEach(f => {
      const k = f.dataset.k, inp = f.querySelector("input"), ul = f.querySelector(".xpsel"); dests.set(k, []);
      const draw = () => { ul.innerHTML = dests.get(k).map((v, i) => `<span role="listitem">${esc(v)}<button type="button" aria-label="Remove ${esc(v)}" data-i="${i}">×</button></span>`).join("") };
      f.addDest = v => { v = v.trim(); if (!v || dests.get(k).some(x => norm(x) == norm(v))) return; dests.get(k).push(v); draw(); f.classList.remove("bad") };
      f.querySelector("[data-add]").onclick = () => { f.addDest(inp.value); inp.value = ""; inp.focus() };
      inp.addEventListener("keydown", e => { if (e.key == "Enter") { e.preventDefault(); f.addDest(inp.value); inp.value = "" } });
      inp.addEventListener("change", () => { if (inp.value && [...document.querySelectorAll("#xp-dests option")].some(o => o.value == inp.value)) { f.addDest(inp.value); inp.value = "" } });
      ul.addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; dests.get(k).splice(+b.dataset.i, 1); draw() });
    });

    const val = el => {
      if (el.classList.contains("xpdest")) { const typed = el.querySelector("input").value.trim(); return [...dests.get(el.dataset.k), ...(typed ? [typed] : [])] }
      if (el.classList.contains("xpch")) return $$("input:checked", el).map(i => i.value);
      const c = el.matches("input,select,textarea") ? el : el.querySelector("input,select,textarea"); return c.value.trim();
    };
    const fields = s => $$(".xpch, .xpdest, .xpfld:not(.xpch):not(.xpdest)", s);
    const label = el => el.dataset.label || el.querySelector("[data-label]")?.dataset.label || "";
    const required = el => el.hasAttribute("data-req") || !!el.querySelector("[required]");

    function check(s) {
      for (const f of fields(s)) {
        const v = val(f), empty = Array.isArray(v) ? !v.length : !v;
        f.classList.toggle("bad", required(f) && empty);
        if (required(f) && empty) { err.textContent = `Please fill in: ${label(f)}.`; (f.querySelector("input,select,textarea") || f).focus(); return false }
        const num = f.querySelector('input[type="number"]');
        if (num && num.value && (+num.value < +num.min || +num.value > +num.max)) { err.textContent = `${label(f)} should be between ${num.min} and ${num.max}.`; num.focus(); return false }
      }
      err.textContent = ""; return true;
    }
    function answers() {
      const out = [];
      steps.slice(0, -1).forEach(s => fields(s).forEach(f => { const v = val(f); const t = Array.isArray(v) ? v.join(", ") : v; if (t) out.push([label(f), t, f.dataset.k || f.querySelector("[name]")?.name]) }));
      return out;
    }
    function go(n) {
      cur = n;
      steps.forEach((s, i) => { s.hidden = i != n; s.classList.toggle("on", i == n) });
      dots.forEach((d, i) => d.classList.toggle("on", i <= n));
      back.hidden = n == 0; next.hidden = n == steps.length - 1; send.hidden = n != steps.length - 1; err.textContent = "";
      if (n == steps.length - 1) form.querySelector(".xpsum").innerHTML = `<dl>${answers().map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("")}</dl>`;
      const first = steps[n].querySelector("input,select,textarea,button"); if (first && n) first.focus({ preventScroll: true });
    }
    next.onclick = () => { if (check(steps[cur])) go(cur + 1) };
    back.onclick = () => go(cur - 1);
    form.addEventListener("keydown", e => { if (e.key == "Enter" && e.target.matches("input:not([type=search])") && !e.target.closest(".xpdest")) { e.preventDefault(); cur < steps.length - 1 ? next.click() : send.click() } });
    form.onsubmit = e => {
      e.preventDefault();
      for (let i = 0; i < steps.length - 1; i++) if (!check(steps[i])) return go(i), check(steps[i]);
      const a = answers(), get = k => (a.find(x => x[2] == k) || [])[1] || "";
      const where = get("dest") || get("regions") || get("region") || "";
      enquire({
        trip: `${form.dataset.cat}${where ? ": " + where : ""}`.slice(0, 140),
        n: +(get("people") || get("students") || 0) + +(get("staff") || 0) || undefined,
        date: get("date"), city: get("from"),
        note: `${form.dataset.cat}\n` + a.filter(x => !["people", "date", "from"].includes(x[2])).map(([k, v]) => `${k}: ${v}`).join("\n"),
      });
    };
    form.prefill = set => {
      for (const [k, v] of Object.entries(set)) {
        const d = form.querySelector(`.xpdest[data-k="${k}"]`); if (d) { [].concat(v).forEach(x => d.addDest(x)); continue }
        const boxes = $$(`input[name="${k}"]`, form).filter(i => i.type == "radio" || i.type == "checkbox");
        if (boxes.length) { [].concat(v).forEach(x => { const b = boxes.find(i => i.value == x); if (b) b.checked = true }); continue }
        const s = form.querySelector(`select[name="${k}"]`);
        if (s) { if ([...s.options].some(o => o.value == v)) s.value = v; else if (k == "event") { s.value = "Another event (tell us below)"; const o = form.querySelector('[name="objective"]'); if (o && !o.value) o.value = v } }
        if (k == "dest" && !d) { const alt = form.querySelector('.xpdest'); if (alt) alt.addDest(v) }
      }
    };
    go(0);
  });

  /* ---------- region tabs (Tamil Nadu on the roots page): arrows move between tabs, #tn-<id> opens one ---------- */
  $$("[data-tabs]").forEach(box => {
    const tabs = $$("[role=tab]", box);
    const pick = (t, focus) => { tabs.forEach(x => { const on = x == t; x.setAttribute("aria-selected", on); x.tabIndex = on ? 0 : -1; document.getElementById(x.getAttribute("aria-controls")).hidden = !on }); if (focus) t.focus() };
    tabs.forEach((t, i) => { t.onclick = () => pick(t); t.onkeydown = e => { const k = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key]; if (k) { e.preventDefault(); pick(tabs[(i + k + tabs.length) % tabs.length], true) } } });
    const open = id => { const t = tabs.find(x => x.getAttribute("aria-controls") == id); if (t) { pick(t); box.scrollIntoView({ behavior: RM ? "auto" : "smooth", block: "start" }) } };
    document.addEventListener("click", e => { const a = e.target.closest("[data-tab]"); if (a) { e.preventDefault(); open(a.dataset.tab); history.replaceState(null, "", "#" + a.dataset.tab) } });
    if (location.hash.startsWith("#tn-")) setTimeout(() => open(location.hash.slice(1)), 300);
  });

  // "Plan travel" buttons in lists fill the planner on the same page and scroll to it
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-xp-set]"); if (!b) return;
    const form = document.querySelector("[data-xpp]"); if (!form) return;
    form.prefill(JSON.parse(b.dataset.xpSet));
    const t = document.querySelector("#toast"); if (t) { t.textContent = "Added to your planner below."; t.classList.add("on"); setTimeout(() => t.classList.remove("on"), 2600) }
    document.getElementById("planner").scrollIntoView({ behavior: RM ? "auto" : "smooth" });
  });
})();

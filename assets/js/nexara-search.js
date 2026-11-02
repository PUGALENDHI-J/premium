/* Site search: the top-bar field or header button (or "/" and Ctrl+K) opens a panel that searches every page on the site.
   The index (assets/search-index.json, written by tools/build.mjs) is fetched the first time the panel opens:
   rows of [name, url, type, description, photo, keywords]. Every word typed must start a word in the page name,
   its keywords or its description; name matches rank highest. A query with no hits is retried allowing one typo per word. */
(() => {
  const btns = [...document.querySelectorAll(".hsrch,.tsrch")];
  if (!btns.length || !window.HTMLDialogElement) return;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const norm = s => String(s).toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/&/g, " and ").replace(/[^a-z0-9]+/g, " ").trim();
  const TYPE = { d: "Destination", k: "Package", t: "Holiday theme", e: "Experience", s: "Sacred journey", v: "Service", g: "Travel guide", b: "Blog", p: "Page" };
  // small nudges so a place outranks the many packages that mention it
  const WEIGHT = { d: 16, t: 6, e: 6, s: 6, v: 3, g: 1, p: 1, k: 0, b: 0 };
  const TABS = [["", "All"], ["d", "Destinations"], ["k", "Packages"], ["tesv", "Themes & experiences"], ["gb", "Guides & blog"]];
  const POPULAR = ["Maldives", "Kerala", "Bali", "Thailand", "Dubai", "Kashmir", "Honeymoon", "Switzerland", "Char Dham", "Singapore", "Group tours", "Canton Fair"];
  const MAX = 40;
  const ICON = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>';

  const dlg = document.createElement("dialog");
  dlg.className = "srch";
  dlg.setAttribute("aria-label", "Search the site");
  dlg.innerHTML = `<div class="srw"><form class="srf" role="search" method="dialog">${ICON}<input type="search" name="q" placeholder="Search destinations, packages, guides…" autocomplete="off" spellcheck="false" enterkeyhint="go" aria-label="Search" role="combobox" aria-expanded="true" aria-controls="sr-list" aria-autocomplete="list"><button type="button" class="srx" aria-label="Close search">Esc</button></form>` +
    `<div class="srt" role="toolbar" aria-label="Filter results">${TABS.map(([v, n], i) => `<button type="button" data-f="${v}"${i ? "" : ' class="on"'} aria-pressed="${!i}">${n}<small></small></button>`).join("")}</div>` +
    `<div class="srb"><p class="srm" role="status" aria-live="polite"></p><ul id="sr-list" class="srl" role="listbox" aria-label="Results"></ul></div>` +
    `<p class="srk"><span><kbd>↑</kbd><kbd>↓</kbd> to move</span><span><kbd>Enter</kbd> to open</span><span><kbd>Esc</kbd> to close</span></p></div>`;
  document.body.append(dlg);
  const inp = dlg.querySelector("input"), list = dlg.querySelector(".srl"), msg = dlg.querySelector(".srm"), tabs = [...dlg.querySelectorAll(".srt button")];

  let rows = null, loading = null, filter = "", hits = [], cur = -1;
  const load = () => loading || (loading = fetch("/assets/search-index.json").then(r => { if (!r.ok) throw r.status; return r.json() }).then(data => {
    rows = data.map(([n, u, t, d, i, k]) => ({ n, u, t, d, i, N: " " + norm(n), K: " " + norm(k || ""), D: " " + norm(d) }));
    run();
  }).catch(() => { loading = null; msg.textContent = "Search could not load. Check your connection and try again." }));

  // one typo (two for long words) against the start of any word
  const near = (a, b) => {
    if (Math.abs(a.length - b.length) > 1) return false;
    let p = new Array(b.length + 1).fill(0).map((_, j) => j);
    for (let i = 1; i <= a.length; i++) { const c = [i]; for (let j = 1; j <= b.length; j++) c[j] = Math.min(p[j] + 1, c[j - 1] + 1, p[j - 1] + (a[i - 1] != b[j - 1])); p = c }
    return p[b.length] <= (a.length > 6 ? 2 : 1);
  };
  const fuzzyIn = (hay, t) => t.length > 3 && hay.split(" ").some(w => w && (near(t, w.slice(0, t.length)) || near(t, w.slice(0, t.length + 1)) || near(t, w.slice(0, t.length - 1))));

  function score(r, toks, q, fuzzy) {
    let s = 0;
    for (const t of toks) {
      const w = " " + t;
      if (r.N.includes(w)) s += r.N.includes(w + " ") || r.N.endsWith(w) ? 14 : 10;
      else if (r.K.includes(w)) s += 5;
      else if (r.D.includes(w)) s += 2;
      else if (fuzzy && fuzzyIn(r.N, t)) s += 6;
      else if (fuzzy && fuzzyIn(r.K, t)) s += 3;
      else return 0;
    }
    const nq = " " + q;
    if (r.N == nq) s += 60; else if (r.N.startsWith(nq)) s += 25; else if (r.N.includes(nq)) s += 10;
    return s + WEIGHT[r.t] - r.N.length / 40;
  }
  const find = (toks, q, fuzzy) => rows.map(r => [score(r, toks, q, fuzzy), r]).filter(x => x[0] > 0).sort((a, b) => b[0] - a[0]).map(x => x[1]);

  const mark = (s, toks) => {
    let h = esc(s);
    for (const t of [...toks].sort((a, b) => b.length - a.length)) h = h.replace(new RegExp(`(^|[^a-z0-9;&])(${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"), "$1\u0001$2\u0002");
    return h.replace(/\u0001/g, "<mark>").replace(/\u0002/g, "</mark>");
  };

  function popular() {
    hits = []; cur = -1;
    tabs.forEach(b => b.querySelector("small").textContent = "");
    msg.innerHTML = "";
    list.innerHTML = `<li class="srp" role="presentation"><b>Popular searches</b><span>${POPULAR.map(p => `<button type="button">${esc(p)}</button>`).join("")}</span></li>`;
    inp.removeAttribute("aria-activedescendant");
  }

  function run() {
    const q = norm(inp.value);
    if (!q) return popular();
    if (!rows) { msg.textContent = "Loading…"; list.innerHTML = ""; return }
    const toks = [...new Set(q.split(" "))];
    let all = find(toks, q, false), fuzzy = false;
    if (!all.length) { all = find(toks, q, true); fuzzy = all.length > 0 }
    tabs.forEach(b => { const f = b.dataset.f, n = f ? all.filter(r => f.includes(r.t)).length : all.length; b.querySelector("small").textContent = n ? ` ${n}` : ""; b.disabled = !!f && !n });
    const shown = filter ? all.filter(r => filter.includes(r.t)) : all;
    hits = shown.slice(0, MAX);
    msg.textContent = !all.length ? `No results for “${inp.value.trim()}”. Try a place, a country or a kind of holiday.`
      : !shown.length ? "Nothing in this section. Try All."
      : (fuzzy ? "No exact matches, showing close ones. " : "") + (shown.length > MAX ? `Showing the top ${MAX} of ${shown.length} results.` : `${shown.length} result${shown.length > 1 ? "s" : ""}`);
    list.innerHTML = hits.map((r, i) => `<li role="option" id="sr-${i}" aria-selected="false"><a href="${esc(r.u)}" tabindex="-1">${r.i ? `<img src="${esc(r.i)}" alt="" loading="lazy">` : `<i class="sr-${r.t}">${ICON}</i>`}<span><small>${TYPE[r.t]}</small><b>${mark(r.n, toks)}</b>${r.d ? `<em>${esc(r.d)}</em>` : ""}</span></a></li>`).join("") +
      (!all.length ? `<li class="srp" role="presentation"><b>Or ask a planner</b><span><a class="srq" href="/custom-tour/" data-enq>Plan a custom trip →</a></span></li>` : "");
    move(hits.length ? 0 : -1, false);
  }

  function move(i, scroll = true) {
    const o = list.querySelectorAll("[role=option]");
    if (cur >= 0 && o[cur]) { o[cur].classList.remove("on"); o[cur].setAttribute("aria-selected", "false") }
    cur = i;
    if (cur < 0 || !o[cur]) { inp.removeAttribute("aria-activedescendant"); return }
    o[cur].classList.add("on"); o[cur].setAttribute("aria-selected", "true");
    inp.setAttribute("aria-activedescendant", o[cur].id);
    if (scroll) o[cur].scrollIntoView({ block: "nearest" });
  }

  function open() {
    if (dlg.open) return;
    document.documentElement.classList.add("sropen");
    dlg.showModal();
    inp.focus(); inp.select();
    load(); run();
  }
  dlg.addEventListener("close", () => document.documentElement.classList.remove("sropen"));

  btns.forEach(b => {
    b.addEventListener("click", e => { e.preventDefault(); open() });
    b.addEventListener("pointerenter", load, { once: true });
    b.addEventListener("focus", load, { once: true });
  });
  inp.addEventListener("input", run);
  inp.addEventListener("keydown", e => {
    if (e.key == "ArrowDown" || e.key == "ArrowUp") { e.preventDefault(); if (hits.length) move((cur + (e.key == "ArrowDown" ? 1 : hits.length - 1)) % hits.length) }
    else if (e.key == "Enter") { e.preventDefault(); const a = list.querySelector("[role=option].on a") || list.querySelector("[role=option] a"); if (a) a.click() }
  });
  tabs.forEach(b => b.addEventListener("click", () => { filter = b.dataset.f; tabs.forEach(x => { x.classList.toggle("on", x == b); x.setAttribute("aria-pressed", x == b) }); run(); inp.focus() }));
  list.addEventListener("click", e => {
    const p = e.target.closest(".srp button");
    if (p) { inp.value = p.textContent; run(); inp.focus(); return }
    if (e.target.closest("a")) dlg.close();
  });
  list.addEventListener("mousemove", e => { const o = e.target.closest("[role=option]"); if (o) { const i = +o.id.slice(3); if (i != cur) move(i, false) } });
  dlg.querySelector(".srx").addEventListener("click", () => dlg.close());
  // a click on the dimmed backdrop (the dialog box itself, outside the panel) closes it
  dlg.addEventListener("click", e => { if (e.target == dlg) dlg.close() });

  document.addEventListener("keydown", e => {
    const typing = e.target.closest && e.target.closest("input,textarea,select,[contenteditable]");
    if (((e.ctrlKey || e.metaKey) && e.key.toLowerCase() == "k") || (e.key == "/" && !typing && !e.ctrlKey && !e.metaKey && !e.altKey)) { e.preventDefault(); dlg.open ? inp.select() : open() }
  });
})();

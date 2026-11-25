/* RIB Cotton Exports — site script
   Edit CONTACT below to change the phone and WhatsApp number everywhere. */
(function () {
  "use strict";

  var CONTACT = {
    whatsapp: "918012029452",            // digits only, with country code
    phone: "919500573568"
  };

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var P = window.PRODUCTS || [];
  var byId = function (id) { return P.find(function (p) { return p.id === Number(id); }); };

  /* ---------- storage (safe) ---------- */
  var KEY = "ribcotton_list_v2";
  function read() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } }
  function write(list) { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {} sync(); }

  var List = {
    items: read,
    has: function (id) { return read().some(function (i) { return i.id === id; }); },
    count: function () { return read().reduce(function (n, i) { return n + i.qty; }, 0); },
    add: function (id) { var l = read(); var f = l.find(function (i) { return i.id === id; }); if (f) f.qty++; else l.push({ id: id, qty: 1 }); write(l); },
    remove: function (id) { write(read().filter(function (i) { return i.id !== id; })); },
    setQty: function (id, q) { if (q < 1) return List.remove(id); var l = read(); var f = l.find(function (i) { return i.id === id; }); if (f) { f.qty = Math.min(q, 99); write(l); } },
    clear: function () { write([]); }
  };

  function wa(text) { return "https://wa.me/" + CONTACT.whatsapp + "?text=" + encodeURIComponent(text); }
  function pageUrl(p) {
    var base = location.href.replace(/[#?].*$/, "").replace(/[^/]*$/, "");
    return /^https?:/.test(location.protocol) ? base + "product.html?id=" + p.id : "";
  }

  /* ---------- toast ---------- */
  var toastTimer;
  function toast(msg, action) {
    var t = $("#toast");
    if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.innerHTML = "<span></span>" + (action ? '<a href="' + action.href + '">' + action.label + "</a>" : "");
    t.firstChild.textContent = msg;
    requestAnimationFrame(function () { t.classList.add("show"); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 3200);
  }

  /* ---------- header, menu ---------- */
  function sync() {
    var n = List.count();
    $$(".js-count").forEach(function (el) { el.textContent = n; el.hidden = n === 0; });
    $$("[data-add]").forEach(function (b) {
      var on = List.has(Number(b.dataset.add));
      b.setAttribute("aria-pressed", String(on));
      var l = $(".lbl", b); if (l) l.textContent = on ? "On your list" : "Add to list";
    });
    if (window.__renderList) window.__renderList();
  }

  function initChrome() {
    var header = $(".site-header");
    var onScroll = function () { header.classList.toggle("scrolled", window.scrollY > 8); };
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });

    var sheet = $("#menu"), openBtn = $("#menuOpen"), closeBtn = $("#menuClose");
    if (sheet && openBtn) {
      var setOpen = function (o) {
        sheet.classList.toggle("open", o);
        openBtn.setAttribute("aria-expanded", String(o));
        document.body.style.overflow = o ? "hidden" : "";
        if (o) closeBtn.focus(); else openBtn.focus();
      };
      openBtn.addEventListener("click", function () { setOpen(true); });
      closeBtn.addEventListener("click", function () { setOpen(false); });
      $$("a", sheet).forEach(function (a) { a.addEventListener("click", function () { sheet.classList.remove("open"); document.body.style.overflow = ""; }); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape" && sheet.classList.contains("open")) setOpen(false); });
    }

    $$("[data-wa]").forEach(function (a) {
      a.href = wa(a.dataset.wa || "Hello RIB Cotton Exports, I'd like to know more about your collection.");
      a.target = "_blank"; a.rel = "noopener";
    });
    $$("[data-tel]").forEach(function (a) { a.href = "tel:+" + CONTACT.phone; });

    document.addEventListener("click", function (e) {
      var b = e.target.closest("[data-add]");
      if (b) {
        e.preventDefault();
        var id = Number(b.dataset.add), p = byId(id);
        if (List.has(id)) { List.remove(id); toast("Removed from your list"); }
        else { List.add(id); toast((p ? p.name : "Piece") + " added to your list", { href: "enquiry.html", label: "Review list" }); }
      }
    });
  }

  /* ---------- cards ---------- */
  var ICON_WA = '<svg class="i i-fill" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-wa"/></svg>';
  function card(p) {
    var msg = "Hello RIB Cotton Exports, I'd like to enquire about " + p.name + " (" + p.code + ")." + (pageUrl(p) ? "\n" + pageUrl(p) : "") + "\nPlease share available sizes, price and minimum quantity.";
    return '<article class="card">' +
      '<a class="panel rib" href="product.html?id=' + p.id + '" tabindex="-1" aria-hidden="true"><img src="' + p.image + '" alt="" loading="lazy" decoding="async"></a>' +
      '<div class="card-body">' +
        '<h3><a href="product.html?id=' + p.id + '">' + p.name + '</a></h3>' +
        '<p class="card-meta"><span>' + p.audience + '</span><span>' + p.category + '</span></p>' +
        '<div class="card-actions">' +
          '<button class="add-btn" type="button" data-add="' + p.id + '" aria-pressed="false"><svg class="i" viewBox="0 0 24 24" aria-hidden="true" style="width:16px;height:16px"><use href="#i-plus"/></svg><span class="lbl">Add to list</span></button>' +
          '<a class="wa-mini" href="' + wa(msg) + '" target="_blank" rel="noopener" aria-label="Ask about ' + p.name + ' on WhatsApp">' + ICON_WA + '</a>' +
        '</div></div></article>';
  }

  /* ---------- pages ---------- */
  var page = document.body.dataset.page;

  function slideshow() {
    var root = $("#audienceSlider");
    if (!root) return;

    var slides = $$("[data-slide]", root);
    if (slides.length < 2) return;

    var active = 0;
    var timer;
    var hovered = false;
    var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function show(index) {
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.hidden = i !== active;
        slide.setAttribute("aria-hidden", String(i !== active));
      });
    }

    function stop() {
      if (timer) window.clearInterval(timer);
      timer = null;
    }

    function start() {
      stop();
      if (!reducedMotion && !hovered && !document.hidden) {
        timer = window.setInterval(function () { show(active + 1); }, 5000);
      }
    }

    root.addEventListener("mouseenter", function () { hovered = true; stop(); });
    root.addEventListener("mouseleave", function () { hovered = false; start(); });
    document.addEventListener("visibilitychange", start);

    show(0);
    start();
  }

  function home() {
    slideshow();
    var rail = $("#newRail");
    if (!rail) return;
    var ids = [24, 17, 7, 25, 18, 3, 8];
    rail.innerHTML = ids.map(function (id) { return card(byId(id)); }).join("");
  }

  function shop() {
    var grid = $("#shopGrid"); if (!grid) return;
    var q = new URLSearchParams(location.search);
    var state = { cat: q.get("cat") || "All", who: q.get("for") || "All", q: q.get("q") || "" };
    var cats = ["All"].concat(P.map(function (p) { return p.category; }).filter(function (v, i, a) { return a.indexOf(v) === i; }));
    var chips = $("#chips"), whoSel = $("#who"), search = $("#search"), count = $("#count"), empty = $("#empty");
    if (cats.indexOf(state.cat) < 0) state.cat = "All";
    search.value = state.q; whoSel.value = state.who;

    function draw() {
      var list = P.filter(function (p) {
        return (state.cat === "All" || p.category === state.cat) &&
               (state.who === "All" || p.audience === state.who) &&
               (!state.q || (p.name + " " + p.category + " " + p.audience + " " + p.code).toLowerCase().indexOf(state.q.toLowerCase()) > -1);
      });
      chips.innerHTML = cats.map(function (c) {
        var n = P.filter(function (p) { return (c === "All" || p.category === c) && (state.who === "All" || p.audience === state.who); }).length;
        return '<button type="button" class="chip" data-cat="' + c + '" aria-pressed="' + (state.cat === c) + '">' + c + "<small>" + n + "</small></button>";
      }).join("");
      grid.innerHTML = list.map(card).join("");
      count.textContent = list.length + (list.length === 1 ? " piece" : " pieces");
      empty.hidden = list.length > 0; grid.hidden = list.length === 0;
      sync();
      var u = new URLSearchParams();
      if (state.cat !== "All") u.set("cat", state.cat);
      if (state.who !== "All") u.set("for", state.who);
      if (state.q) u.set("q", state.q);
      try { history.replaceState(null, "", location.pathname + (u.toString() ? "?" + u : "")); } catch (e) {}
    }
    chips.addEventListener("click", function (e) { var b = e.target.closest("[data-cat]"); if (b) { state.cat = b.dataset.cat; draw(); } });
    whoSel.addEventListener("change", function () { state.who = whoSel.value; draw(); });
    search.addEventListener("input", function () { state.q = search.value.trim(); draw(); });
    $("#reset").addEventListener("click", function () { state = { cat: "All", who: "All", q: "" }; search.value = ""; whoSel.value = "All"; draw(); });
    draw();
  }

  function product() {
    var root = $("#pd"); if (!root) return;
    var q = new URLSearchParams(location.search);
    var p = byId(q.get("id")) || P.find(function (x) { return x.slug === q.get("slug"); });
    if (!p) { root.innerHTML = '<div class="empty" style="grid-column:1/-1"><h2>We can\'t find that piece</h2><p>It may have moved. Browse the full collection instead.</p><a class="btn" href="shop.html">View the collection</a></div>'; return; }
    document.title = p.name + " | RIB Cotton Exports";
    var msg = "Hello RIB Cotton Exports, I'd like to enquire about " + p.name + " (" + p.code + ")." + (pageUrl(p) ? "\n" + pageUrl(p) : "") + "\nPlease share available sizes, price and minimum quantity.";
    $("#pdCrumb").textContent = p.name;
    root.innerHTML =
      '<div class="pd-stage rib"><img src="' + p.image + '" alt="' + p.name + '"></div>' +
      '<div class="pd-info">' +
        '<div class="pd-tags"><span class="tag">' + p.audience + '</span><span class="tag">' + p.category + '</span></div>' +
        '<h1>' + p.name + '</h1>' +
        '<p class="lead">' + p.description + '</p>' +
        '<dl class="spec">' +
          '<div><dt>Item code</dt><dd>' + p.code + '</dd></div>' +
          '<div><dt>Fabric</dt><dd>' + p.fabric + '</dd></div>' +
          '<div><dt>Sizes and colours</dt><dd>Ask on WhatsApp</dd></div>' +
          '<div><dt>Pricing</dt><dd>Shared on enquiry</dd></div>' +
        '</dl>' +
        '<div class="pd-actions">' +
          '<a class="btn btn-wa btn-block" href="' + wa(msg) + '" target="_blank" rel="noopener">' + ICON_WA + ' Ask about this piece on WhatsApp</a>' +
          '<button class="btn btn-ghost btn-block" type="button" data-add="' + p.id + '" aria-pressed="false"><span class="lbl">Add to list</span></button>' +
        '</div>' +
        '<p class="pd-note">Build a list of pieces, then send it to us in one message.</p>' +
      '</div>';
    var more = $("#moreRail");
    if (more) {
      var rel = P.filter(function (x) { return x.id !== p.id && (x.category === p.category || x.audience === p.audience); }).slice(0, 4);
      if (rel.length < 4) rel = rel.concat(P.filter(function (x) { return x.id !== p.id && rel.indexOf(x) < 0; })).slice(0, 4);
      more.innerHTML = rel.map(card).join("");
    }
    sync();
  }

  function enquiry() {
    var root = $("#listItems"); if (!root) return;
    var note = $("#note"), send = $("#send"), side = $("#side"), emptyBox = $("#listEmpty"), wrap = $("#listWrap"), sum = $("#sum"), clear = $("#clear");
    function render() {
      var items = List.items().map(function (i) { return { p: byId(i.id), qty: i.qty }; }).filter(function (i) { return i.p; });
      emptyBox.hidden = items.length > 0; wrap.hidden = items.length === 0;
      root.innerHTML = items.map(function (i) {
        return '<li class="list-item"><a class="thumb rib" href="product.html?id=' + i.p.id + '"><img src="' + i.p.image + '" alt=""></a>' +
          '<div><h3><a href="product.html?id=' + i.p.id + '">' + i.p.name + '</a></h3><p class="muted">' + i.p.code + ", " + i.p.audience + '</p>' +
          '<div class="qty" role="group" aria-label="Quantity"><button type="button" data-q="-1" data-id="' + i.p.id + '" aria-label="Decrease quantity">−</button><span>' + i.qty + '</span><button type="button" data-q="1" data-id="' + i.p.id + '" aria-label="Increase quantity">+</button></div></div>' +
          '<button class="remove" type="button" data-rm="' + i.p.id + '" aria-label="Remove ' + i.p.name + '"><svg class="i" viewBox="0 0 24 24"><use href="#i-close"/></svg></button></li>';
      }).join("");
      var pieces = items.reduce(function (n, i) { return n + i.qty; }, 0);
      sum.textContent = items.length + (items.length === 1 ? " style, " : " styles, ") + pieces + (pieces === 1 ? " piece" : " pieces");
      send.href = wa(message(items));
    }
    function message(items) {
      var lines = items.map(function (i, n) { return (n + 1) + ". " + i.p.name + " (" + i.p.code + ") x " + i.qty; });
      var t = "Hello RIB Cotton Exports, I'd like to enquire about these pieces:\n\n" + lines.join("\n");
      if (note.value.trim()) t += "\n\nNote: " + note.value.trim();
      return t + "\n\nPlease share sizes, prices and availability. Thank you.";
    }
    root.addEventListener("click", function (e) {
      var q = e.target.closest("[data-q]"), r = e.target.closest("[data-rm]");
      if (q) { var id = Number(q.dataset.id), it = List.items().find(function (x) { return x.id === id; }); List.setQty(id, it.qty + Number(q.dataset.q)); }
      if (r) List.remove(Number(r.dataset.rm));
    });
    note.addEventListener("input", render);
    clear.addEventListener("click", function () { List.clear(); });
    window.__renderList = render; render();
  }

  function contact() {
    var f = $("#contactForm"); if (!f) return;
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = new FormData(f);
      var t = "Hello RIB Cotton Exports,\n\nName: " + d.get("name") + "\nTopic: " + d.get("topic") + "\n\n" + d.get("message");
      window.open(wa(t), "_blank", "noopener");
    });
  }

  initChrome();
  ({ home: home, shop: shop, product: product, enquiry: enquiry, contact: contact }[page] || function () {})();
  sync();
})();

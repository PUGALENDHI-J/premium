/* Inner-page behaviour: header, menu, enquiry dialog (same flow and validation as the home page),
   itinerary accordions, card filters and the contact / custom-tour form. No data leaves the browser
   except through the WhatsApp link the visitor chooses to open. */
(function () {
  const WA = "917305971481", $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const digits = v => { let d = v.replace(/\D/g, ""); if (d.length > 10 && d.startsWith("91")) d = d.slice(2); return d.slice(0, 10) };
  const okPh = v => /^[6-9]\d{9}$/.test(digits(v));
  const shake = el => { if (!el) return; el.classList.remove("shake"); void el.offsetWidth; el.classList.add("shake") };
  let tt; const toast = m => { const t = $("#toast"); if (!t) return; t.textContent = m; t.classList.add("on"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("on"), 3200) };

  /* header, progress bar, back to top, menu */
  const hd = $("header"), bt = $(".btt"), bc = bt && bt.querySelector("circle");
  function onS() { const y = scrollY, h = document.documentElement.scrollHeight - innerHeight, p = h > 0 ? Math.min(1, y / h) : 0; hd && hd.classList.toggle("sc", y > 40); document.body.classList.toggle("scd", y > innerHeight * .6); const pr = $("#prog"); if (pr) pr.style.transform = `scaleX(${p})`; if (bt) { bt.classList.toggle("on", y > 500); bc.style.strokeDashoffset = 145 * (1 - p) } }
  addEventListener("scroll", onS, { passive: true }); onS();
  bt && (bt.onclick = () => scrollTo({ top: 0, behavior: RM ? "auto" : "smooth" }));
  const bg = $(".burger"); bg && (bg.onclick = () => { const o = $("nav").classList.toggle("open"); bg.setAttribute("aria-expanded", o) });

  /* itinerary accordions */
  $$(".days .day h3").forEach(h => { h.tabIndex = 0; h.setAttribute("role", "button"); const t = () => { const d = h.parentNode; d.classList.toggle("open"); h.setAttribute("aria-expanded", d.classList.contains("open")) }; h.setAttribute("aria-expanded", h.parentNode.classList.contains("open")); h.onclick = t; h.onkeydown = e => { if (e.key == "Enter" || e.key == " ") { e.preventDefault(); t() } } });
  $$(".dayx button").forEach(b => b.onclick = () => { const open = b.dataset.x == "open"; b.closest("div").parentNode.querySelectorAll(".day").forEach(d => { d.classList.toggle("open", open); d.querySelector("h3").setAttribute("aria-expanded", open) }) });

  /* card filters */
  $$(".ftabs").forEach(tb => {
    const grid = tb.nextElementSibling && tb.nextElementSibling.matches(".dgrid") ? tb.nextElementSibling : tb.parentNode.querySelector(".dgrid"), cnt = tb.parentNode.querySelector(".fcount");
    tb.querySelectorAll("button").forEach(b => b.onclick = () => {
      tb.querySelectorAll("button").forEach(x => x.classList.toggle("on", x == b));
      let n = 0; grid.querySelectorAll(".dc").forEach(c => { const show = b.dataset.f == "all" || (" " + c.dataset.t + " ").includes(" " + b.dataset.f + " "); c.classList.toggle("hide", !show); if (show) n++ });
      if (cnt) cnt.textContent = n + (n == 1 ? " match" : " matches");
    });
  });

  /* enquiry dialog: injected so the markup is not repeated in every page */
  const OPT = (a, sel) => a.map(v => `<option${v == sel ? " selected" : ""}>${v}</option>`).join("");
  document.body.insertAdjacentHTML("beforeend", `<dialog id="enq" aria-labelledby="enqt"><div class="eh"><button class="x" aria-label="Close"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button><small>Nexara Holidays · Trip enquiry</small><b id="enqt">Request a free quote</b><span>Share a few details and a travel planner replies on WhatsApp with a plan and a price.</span></div><div class="steps"><i class="on" data-step="1"><s>Your details</s></i><i data-step="2"><s>Trip</s></i><i data-step="3"><s>Review</s></i></div>
<div class="eb" id="eb"><div class="sp on"><div class="fl"><input id="n" autocomplete="name" placeholder=" "><label for="n">Your name</label><span class="ok">✓</span></div><div class="fl tel"><em class="cc">+91</em><input id="ph" type="tel" inputmode="tel" autocomplete="tel" placeholder=" "><label for="ph">Mobile number (WhatsApp)</label><span class="ok">✓</span></div></div>
<div class="sp"><div class="fl"><input id="tr" placeholder=" "><label for="tr">Destination or package</label></div><div><label>Travellers</label><div class="stp"><button type="button" id="mn" aria-label="Fewer travellers">−</button><b id="cn">2</b><button type="button" id="pl" aria-label="More travellers">+</button></div></div><div><label for="d">Departure date (approximate is fine)</label><input id="d" type="date"></div><div class="fl"><select id="du">${OPT(["Not sure yet", "2–3 days", "4–5 days", "6–7 days", "8–10 days", "11 days or more"])}</select><label for="du">Preferred duration</label></div><div class="fl"><select id="bu">${OPT(["Not sure yet", "Under ₹25,000 per person", "₹25,000–50,000 per person", "₹50,000–1 lakh per person", "₹1–2 lakh per person", "Above ₹2 lakh per person"])}</select><label for="bu">Budget (optional)</label></div><div class="fl"><input id="c" autocomplete="address-level2" placeholder=" "><label for="c">Your city</label><span class="ok">✓</span></div></div>
<div class="sp"><div class="sum" id="sum"></div><div class="fl"><textarea id="nt" placeholder=" " rows="3"></textarea><label for="nt">Special requirements (optional)</label></div><p class="hint">Diet, accessibility needs, children's ages, celebrations, hotel preferences…</p></div>
<div class="er" id="er" role="alert"></div><div class="ea"><button type="button" class="btn ghost2" id="bk">Back</button><button type="button" class="btn red" id="nx">Next</button></div><p class="enote"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>Your details go only into the WhatsApp message you send us. This is an enquiry, not a booking.</p></div></dialog>`);
  const enq = $("#enq"), SP = $$("#enq .sp"), ST = $$("#enq .steps i"), Q = { n: 2 }; let step = 0;
  $("#d").min = new Date().toISOString().slice(0, 10);
  const err = m => { $("#er").textContent = m; if (m) shake($("#enq .sp.on")); return false };
  function setStep(n) {
    step = n; SP.forEach((s, i) => s.classList.toggle("on", i == n)); ST.forEach((s, i) => s.classList.toggle("on", i <= n)); $("#bk").style.visibility = n ? "visible" : "hidden"; $("#nx").textContent = n == 2 ? "Continue on WhatsApp" : "Next"; err("");
    if (n == 2) $("#sum").innerHTML = `<b>${esc($("#n").value.trim())}</b> · ${Q.ph}<br>${esc($("#tr").value.trim() || "Not sure yet")}<br>${Q.n} traveller${Q.n > 1 ? "s" : ""} · ${$("#d").value || "dates flexible"} · ${esc($("#du").value)}<br>Budget: ${esc($("#bu").value)} · from ${esc($("#c").value.trim())}`;
  }
  const msg = () => `Hi Nexara Holidays, I would like a quote (enquiry, not a booking yet).\nName: ${$("#n").value.trim()}\nPhone: ${Q.ph}\nTrip: ${$("#tr").value.trim() || "Not sure yet"}\nTravellers: ${Q.n}\nDeparture: ${$("#d").value || "Flexible"}\nDuration: ${$("#du").value}\nBudget: ${$("#bu").value}\nCity: ${$("#c").value.trim()}\nPage: ${location.href}${$("#nt").value.trim() ? "\nSpecial requirements: " + $("#nt").value.trim() : ""}`;
  function send() {
    const u = "https://wa.me/" + WA + "?text=" + encodeURIComponent(msg()); window.open(u, "_blank", "noopener");
    const eb = $("#eb"); let dn = eb.querySelector(".done"); if (!dn) { dn = document.createElement("div"); dn.className = "done"; eb.appendChild(dn) }
    dn.innerHTML = `<div class="dok"><svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m7.5 12.5 3 3 6-6.5"/></svg></div><h3>Almost done, ${esc($("#n").value.trim().split(" ")[0])}</h3><p style="color:var(--mut)">WhatsApp should open with your enquiry. Press send there so it reaches us. Nothing is booked until you confirm a written quote.</p><a class="btn red" href="${u}" target="_blank" rel="noopener">Open WhatsApp</a> <a class="btn ghost2" href="tel:+${WA}">Call instead</a>`;
    eb.classList.add("sent"); ST.forEach(i => i.classList.add("on"));
  }
  $("#nx").onclick = () => {
    err("");
    if (step == 0) { const ph = digits($("#ph").value); if ($("#n").value.trim().length < 2) return err("Please enter your name."); if (!/^[6-9]\d{9}$/.test(ph)) return err("Enter a valid 10-digit Indian mobile number."); Q.ph = ph }
    if (step == 1) { if (!$("#c").value.trim()) return err("Tell us which city you are travelling from.") }
    step == 2 ? send() : setStep(step + 1);
  };
  $("#bk").onclick = () => setStep(step - 1);
  $("#mn").onclick = () => $("#cn").textContent = Q.n = Math.max(1, Q.n - 1);
  $("#pl").onclick = () => $("#cn").textContent = Q.n = Math.min(60, Q.n + 1);
  enq.querySelector(".x").onclick = () => enq.close(); enq.onclick = e => { if (e.target == enq) enq.close() };
  $("#eb").addEventListener("keydown", e => { if (e.key == "Enter" && e.target.tagName == "INPUT") { e.preventDefault(); $("#nx").click() } });
  $$("#enq .fl input").forEach(i => i.addEventListener("input", () => { if (i.type == "tel") { const d = digits(i.value); i.value = d.length > 5 ? d.slice(0, 5) + " " + d.slice(5) : d } const f = i.parentNode; f.classList.remove("bad"); f.classList.toggle("valid", i.type == "tel" ? okPh(i.value) : i.value.trim().length > 1) }));
  function openEnq(trip, dur) {
    if (enq.open) return; $("#eb").classList.remove("sent");
    if (trip) $("#tr").value = trip; else if (!$("#tr").value) $("#tr").value = document.body.dataset.trip || "";
    if (dur) $("#du").value = dur; setStep(0); enq.showModal(); setTimeout(() => $("#n").focus(), 50);
  }
  document.addEventListener("click", e => { const q = e.target.closest("[data-enq]"); if (!q) return; e.preventDefault(); openEnq(q.dataset.trip, q.dataset.dur) });

  /* contact / custom tour form */
  const cf = $("#ctf");
  if (cf) cf.onsubmit = e => {
    e.preventDefault(); const n = $("#cfn").value.trim(), ph = digits($("#cfp").value), pOk = okPh(ph);
    $("#cfn").parentNode.classList.toggle("bad", !n); $("#cfp").parentNode.classList.toggle("bad", !pOk);
    if (!n || !pOk) { shake(cf); toast(!n ? "Please enter your name." : "Enter a valid 10-digit mobile number."); (!n ? $("#cfn") : $("#cfp")).focus(); return }
    const v = id => { const el = $("#" + id); return el ? el.value.trim() : "" };
    const lines = [["Name", n], ["Phone", ph], ["Destination", v("cfd")], ["Travellers", v("cft")], ["Departure", v("cfdt")], ["Duration", v("cfdu")], ["Budget", v("cfb")], ["Trip type", v("cfk")], ["Message", v("cfm")]].filter(x => x[1]);
    const m = "Hi Nexara Holidays, I would like a quote (enquiry, not a booking yet).\n" + lines.map(x => x[0] + ": " + x[1]).join("\n");
    window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(m), "_blank", "noopener");
    toast("Opening WhatsApp with your message. Press send there to reach us.");
  };
})();

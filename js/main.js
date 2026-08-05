/* =========================================================
   Hastavam Textiles — Shared site behaviour
   Runs on every page: nav, reveal animation, product card
   rendering helper, footer year, and small utilities.
   ========================================================= */

/* ---------- header shrink on scroll ---------- */
window.addEventListener("scroll", ()=>{
  const h = document.getElementById("siteHeader");
  if(h) h.classList.toggle("scrolled", window.scrollY > 30);
  const sb = document.getElementById("stickyBuybox");
  if(sb){
    const trigger = document.getElementById("buyboxTrigger");
    if(trigger){
      const rect = trigger.getBoundingClientRect();
      sb.classList.toggle("show", rect.bottom < 0);
    }
  }
});

/* ---------- mobile menu ---------- */
function toggleMobileMenu(open){
  const m = document.getElementById("mmenu");
  if(!m) return;
  m.classList.toggle("open", open);
}

/* ---------- highlight current nav link ---------- */
document.addEventListener("DOMContentLoaded", ()=>{
  const page = (location.pathname.split("/").pop() || "index.html");
  document.querySelectorAll(".navlinks a, .mobile-menu a.mlink").forEach(a=>{
    const href = a.getAttribute("href");
    if(href === page || (page === "" && href === "index.html")){
      a.classList.add("active");
    }
  });
  const y = document.getElementById("footYear");
  if(y) y.textContent = new Date().getFullYear();
});

/* ---------- reveal on scroll ---------- */
let io;
function refreshReveal(){
  if(io) io.disconnect();
  io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target);} });
  },{threshold:.12});
  document.querySelectorAll(".reveal:not(.in)").forEach(el=>io.observe(el));
}
document.addEventListener("DOMContentLoaded", refreshReveal);

/* ---------- animated counters ---------- */
document.addEventListener("DOMContentLoaded", ()=>{
  const counters = document.querySelectorAll(".counter");
  if(!counters.length) return;
  const cIo = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const el = e.target, target = +el.dataset.target;
        let cur = 0; const step = Math.max(1, Math.round(target/40));
        const t = setInterval(()=>{ cur += step; if(cur>=target){cur=target; clearInterval(t);} el.textContent = cur; },28);
        cIo.unobserve(el);
      }
    });
  },{threshold:.5});
  counters.forEach(c=>cIo.observe(c));
});

/* ---------- star rating markup ---------- */
function starsHTML(rating){
  const full = Math.round(rating);
  let s = "";
  for(let i=1;i<=5;i++){ s += i<=full ? "★" : "☆"; }
  return `<span class="stars">${s}</span>`;
}

/* ---------- reusable product card ---------- */
function productCardHTML(p){
  const wished = Store.isWishlisted(p.id);
  const pct = discountPct(p);
  const tagsHTML = (p.tags||[]).map(t=>`<span class="tag ${t}">${t==="new"?"New":t==="bestseller"?"Bestseller":t}</span>`).join("");
  return `
  <div class="pcard reveal in">
    <div class="pcard-img">
      <a href="product.html?id=${p.id}">
        <img src="${p.images[0]}" alt="${p.name}" loading="lazy">
      </a>
      <div class="pcard-tags">${tagsHTML}${pct>0?`<span class="tag sale">-${pct}%</span>`:""}</div>
      <button class="pcard-wish ${wished?'active':''}" aria-label="Toggle wishlist" onclick="Store.toggleWishlist('${p.id}'); this.classList.toggle('active'); Store.notify();">
        <svg viewBox="0 0 24 24" fill="${wished?'currentColor':'none'}" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>
      </button>
    </div>
    <div class="pcard-body">
      <div class="fab">${getCategory(p.cat).title}</div>
      <h4><a href="product.html?id=${p.id}">${p.name}</a></h4>
      <div class="pcard-rating">${starsHTML(p.rating)} <span>${p.rating} (${p.reviewCount})</span></div>
      <div class="pcard-price">
        <span class="now">${currency(p.price)}</span>
        ${pct>0?`<span class="mrp">${currency(p.mrp)}</span><span class="pct">${pct}% off</span>`:""}
      </div>
      <div class="pcard-actions">
        <button class="btn btn-ghost btn-sm" onclick="Store.addToCart('${p.id}',1)">Add to Cart</button>
        <a class="btn btn-dark btn-sm" href="product.html?id=${p.id}">View</a>
      </div>
      <label class="pcard-cmp">
        <input type="checkbox" ${Store.getCompare().includes(p.id)?'checked':''} onchange="Store.toggleCompare('${p.id}')"> Add to compare
      </label>
    </div>
  </div>`;
}

function renderProductGrid(containerId, products, emptyMessage){
  const el = document.getElementById(containerId);
  if(!el) return;
  if(!products.length){
    el.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
      <h3>Nothing here yet</h3><p>${emptyMessage||"Try adjusting your filters or search."}</p>
    </div>`;
    return;
  }
  el.innerHTML = products.map(productCardHTML).join("");
}

/* ---------- newsletter / contact demo forms ---------- */
function fakeSubmit(formEl, successMessage){
  formEl.addEventListener("submit", (e)=>{
    e.preventDefault();
    Store.toast(successMessage);
    formEl.reset();
  });
}
document.addEventListener("DOMContentLoaded", ()=>{
  document.querySelectorAll("[data-newsletter-form]").forEach(f=>fakeSubmit(f, "Subscribed! Watch your inbox for our next drop."));
  document.querySelectorAll("[data-contact-form]").forEach(f=>fakeSubmit(f, "Message sent — our team will reply within 24 hours."));
});

/* ---------- FAQ accordion ---------- */
document.addEventListener("DOMContentLoaded", ()=>{
  document.querySelectorAll(".faq-q").forEach(q=>{
    q.addEventListener("click", ()=>{
      q.parentElement.classList.toggle("open");
    });
  });
  document.querySelectorAll("[data-faq-cat]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      document.querySelectorAll("[data-faq-cat]").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      const cat = btn.dataset.faqCat;
      document.querySelectorAll(".faq-item").forEach(item=>{
        item.style.display = (cat==="all" || item.dataset.cat===cat) ? "block" : "none";
      });
    });
  });
});

/* ---------- require-login guard for account pages ---------- */
function requireLogin(){
  if(!Store.isLoggedIn()){
    location.href = "login.html?next=" + encodeURIComponent(location.pathname.split("/").pop());
    return false;
  }
  return true;
}

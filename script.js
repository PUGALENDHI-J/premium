/**
 * Rib Cotton - Homepage & Global Dynamic Scripts
 * Renders dynamic product cards, controls mobile menu, handles review sliders,
 * and coordinates search.
 */

(function () {
  "use strict";

  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  /* ----------------------------------------------------
   * 1. MOBILE MENU & SEARCH CONTROLS
   * ---------------------------------------------------- */
  const menuBtn = $("#menuBtn");
  const nav = $("#nav");

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
      const open = !nav.classList.contains("open");
      nav.classList.toggle("open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
    });

    $$("a", nav).forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  const searchBtn = $("#searchBtn");
  const searchbar = $("#searchbar");
  const searchInput = $("#searchInput");

  if (searchBtn && searchbar) {
    searchBtn.addEventListener("click", () => {
      const isHidden = searchbar.hidden;
      searchbar.hidden = !isHidden;
      searchBtn.setAttribute("aria-expanded", String(isHidden));
      if (isHidden && searchInput) {
        searchInput.focus();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (searchbar) searchbar.hidden = true;
        if (nav) nav.classList.remove("open");
      }
    });
  }

  /* ----------------------------------------------------
   * 2. RENDER HOMEPAGE BESTSELLERS GRID
   * ---------------------------------------------------- */
  function renderHomepageProducts() {
    const grid = $("#homepageProductGrid");
    if (!grid || typeof PRODUCTS === "undefined") return;

    // Filter top 8 products (bestsellers + featured)
    const featuredProds = PRODUCTS.filter(p => p.featured || p.bestseller).slice(0, 8);

    grid.innerHTML = featuredProds.map(p => `
      <article class="product-card tilt-3d" data-id="${p.id}" data-category="${p.category}">
        <!-- Image & Actions -->
        <div class="product-card-img-wrap">
          <a href="product-detail.html?id=${p.id}" aria-label="View ${p.name}">
            <img src="${p.image}" alt="${p.name}" class="product-card-img" loading="lazy" onerror="this.src='asserts/products/sumwon-wave-oversized-tee.jpg'">
          </a>

          <!-- Floating Badges -->
          <div class="card-badges">
            ${p.tag ? `<span class="card-badge badge-${p.tag.toLowerCase().replace(/\s+/g, '-')}">${p.tag}</span>` : ""}
            <span class="card-badge badge-discount">${p.discount}</span>
          </div>

          <!-- Wishlist Heart Button -->
          <button type="button" class="card-wishlist-btn ${window.RibStore && window.RibStore.isInWishlist(p.id) ? 'active' : ''}" data-wishlist-toggle="${p.id}" aria-label="Add ${p.name} to wishlist">
            <svg class="i i-sm" viewBox="0 0 24 24"><path d="M12 20.5s-8-4.8-9.5-10C1.5 7 3.8 4 7 4c2 0 3.5 1.2 5 3.2C13.5 5.2 15 4 17 4c3.2 0 5.5 3 4.5 6.5-1.5 5.2-9.5 10-9.5 10z"/></svg>
          </button>

          <!-- Quick Action Overlay -->
          <div class="card-quick-overlay">
            <button type="button" class="card-quick-btn" data-quick-view="${p.id}">
              <svg class="i i-xs" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              Quick View
            </button>
            <button type="button" class="card-quick-btn card-wa-btn" data-whatsapp-inquire="${p.id}" title="Inquire on WhatsApp" aria-label="Inquire about ${p.name} on WhatsApp">
              <svg class="i i-xs" viewBox="0 0 24 24"><path d="M17.472 14.382c-.301-.15-1.782-.879-2.058-.98-.276-.1-.477-.15-.678.15-.201.301-.779.98-.955 1.18-.176.201-.352.226-.653.075-.301-.15-1.272-.469-2.423-1.496-.896-.799-1.501-1.786-1.677-2.087-.176-.301-.019-.464.132-.614.136-.135.301-.352.452-.527.15-.176.201-.301.301-.502.101-.201.05-.377-.025-.527-.075-.15-.678-1.633-.93-2.236-.245-.588-.495-.508-.678-.518l-.578-.01c-.201 0-.527.075-.803.377-.276.301-1.054 1.03-1.054 2.512 0 1.482 1.079 2.912 1.23 3.113.15.201 2.123 3.242 5.143 4.547.718.311 1.279.497 1.716.636.721.229 1.377.197 1.896.119.578-.087 1.782-.728 2.033-1.431.251-.703.251-1.306.176-1.431-.075-.125-.276-.201-.577-.351z"/></svg>
            </button>
          </div>
        </div>

        <!-- Product Details -->
        <div class="product-card-body">
          <span class="card-category">${p.category}</span>
          <h3 class="card-title">
            <a href="product-detail.html?id=${p.id}">${p.name}</a>
          </h3>

          <div class="card-rating">
            <span class="stars" style="--r:${p.rating}">★★★★★</span>
            <span>(${p.reviews})</span>
          </div>

          <div class="card-price-row">
            <span class="card-price">₹${p.price.toLocaleString("en-IN")}</span>
            <s class="card-mrp">₹${p.originalPrice.toLocaleString("en-IN")}</s>
            <span class="card-discount-pill">${p.discount}</span>
          </div>

          <div class="card-footer">
            <div class="card-sizes-preview">
              ${p.sizes.slice(0, 4).map(s => `<span class="card-size-tag">${s}</span>`).join("")}
            </div>
            <button type="button" class="card-add-btn" data-add-to-cart="${p.id}" aria-label="Add ${p.name} to shopping bag">
              <span>+ Add</span>
            </button>
          </div>
        </div>
      </article>
    `).join("");

    // Re-initialize 3D Card tilt on newly generated cards
    if (window.RibAnimations && window.RibAnimations.reinitTilt) {
      window.RibAnimations.reinitTilt();
      window.RibAnimations.reinitReveals();
    }
  }

  /* ----------------------------------------------------
   * 3. REVIEWS SLIDER CONTROLS
   * ---------------------------------------------------- */
  const track = $("#reviewTrack");
  const nextBtn = $("#nextReview");
  const prevBtn = $("#prevReview");

  if (track && nextBtn && prevBtn) {
    const getStep = () => {
      const card = $(".review-card", track);
      return card ? card.getBoundingClientRect().width + 20 : 340;
    };

    nextBtn.addEventListener("click", () => {
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 10;
      track.scrollTo({ left: atEnd ? 0 : track.scrollLeft + getStep(), behavior: "smooth" });
    });

    prevBtn.addEventListener("click", () => {
      const atStart = track.scrollLeft <= 10;
      track.scrollTo({ left: atStart ? track.scrollWidth : track.scrollLeft - getStep(), behavior: "smooth" });
    });
  }

  /* ----------------------------------------------------
   * 4. NEWSLETTER FORM HANDLER
   * ---------------------------------------------------- */
  const newsForm = $("#newsForm");
  const newsEmail = $("#newsEmail");

  if (newsForm && newsEmail) {
    newsForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = newsEmail.value.trim();
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

      if (isValid) {
        if (window.RibStore) {
          window.RibStore.showToast("Welcome to the Rib Cotton VIP Circle! Check your inbox for 10% off.", "success");
        }
        newsForm.reset();
      } else {
        if (window.RibStore) {
          window.RibStore.showToast("Please enter a valid email address.", "info");
        }
      }
    });
  }

  // Initialize
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderHomepageProducts);
  } else {
    renderHomepageProducts();
  }
})();

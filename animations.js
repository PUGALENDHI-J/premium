/**
 * Rib Cotton - Interactive Animations & 3D Visual Effects Engine
 * Features:
 * - Branded Page Loading Screen (Preloader with smooth fade-out)
 * - 3D Card Tilt with Dynamic Specular Glare (Mouse-tracking perspective)
 * - Scroll-Triggered Reveal Animations (IntersectionObserver smooth efforts)
 * - Floating WhatsApp & Direct Call Widget with Pulse Waves
 * - Glassmorphism Header Shrink & Back-To-Top Smooth Scroll
 * - Interactive Button Micro-Ripples
 */

(function () {
  "use strict";

  // Check if reduced motion is preferred
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----------------------------------------------------
   * 1. PAGE PRELOADER / LOADING SCREEN
   * ---------------------------------------------------- */
  function initPreloader() {
    let loader = document.getElementById("pagePreloader");
    if (!loader) {
      loader = document.createElement("div");
      loader.id = "pagePreloader";
      loader.className = "page-preloader";
      loader.innerHTML = `
        <div class="preloader-content">
          <div class="preloader-logo-ring">
            <svg class="preloader-svg" viewBox="0 0 64 64">
              <path fill="#3d9fd3" d="M20 6 4 14l6 14 8-4v34h28V24l8 4 6-14-16-8c-4 8-20 8-24 0z"/>
              <path fill="#1d4f9c" d="M46 7c14 15 4 41-18 51 12-12 16-30 6-40 6 0 10-4 12-11z"/>
              <path fill="#2f7ccb" d="M34 10c10 6 6 24-4 36 2-12 0-22-8-28z"/>
            </svg>
            <div class="preloader-pulse"></div>
          </div>
          <h2 class="preloader-title">RIB COTTON</h2>
          <p class="preloader-tagline">Wear the Comfort • Premium 2026 Collection</p>
          <div class="preloader-bar-wrap">
            <div class="preloader-bar-fill" id="preloaderBar"></div>
          </div>
        </div>
      `;
      document.body.prepend(loader);
    }

    const bar = document.getElementById("preloaderBar");
    let progress = 10;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 20) + 10;
      if (progress >= 95) progress = 95;
      if (bar) bar.style.width = progress + "%";
    }, 120);

    const dismiss = () => {
      clearInterval(interval);
      if (bar) bar.style.width = "100%";
      setTimeout(() => {
        loader.classList.add("fade-out");
        setTimeout(() => {
          loader.remove();
        }, 500);
      }, 250);
    };

    if (document.readyState === "complete") {
      dismiss();
    } else {
      window.addEventListener("load", dismiss);
      // Fallback timeout in case any asset hangs
      setTimeout(dismiss, 1200);
    }
  }

  /* ----------------------------------------------------
   * 2. 3D CARD TILT WITH DYNAMIC SPECULAR HIGHLIGHT
   * ---------------------------------------------------- */
  function init3DCardTilt() {
    if (prefersReducedMotion || window.innerWidth < 768) return;

    const cards = document.querySelectorAll(".product-card, .tilt-3d, .cat-card, .feature-card, .hero-card-3d");

    cards.forEach(card => {
      let isHovered = false;
      let reqId = null;

      // Add shine overlay if not already present
      let shine = card.querySelector(".tilt-shine");
      if (!shine) {
        shine = document.createElement("div");
        shine.className = "tilt-shine";
        card.appendChild(shine);
      }

      function handleMouseMove(e) {
        const rect = card.getBoundingClientRect();
        const cardX = e.clientX - rect.left;
        const cardY = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Rotation angles (max 10 degrees)
        const rotateX = ((cardY - centerY) / centerY) * -9;
        const rotateY = ((cardX - centerX) / centerX) * 9;

        // Glare coordinates
        const glareX = (cardX / rect.width) * 100;
        const glareY = (cardY / rect.height) * 100;

        cancelAnimationFrame(reqId);
        reqId = requestAnimationFrame(() => {
          card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(6px)`;
          shine.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 70%)`;
          shine.style.opacity = "1";
        });
      }

      function handleMouseEnter() {
        isHovered = true;
        card.style.transition = "transform 0.1s ease-out, box-shadow 0.25s ease";
        card.classList.add("is-tilted");
      }

      function handleMouseLeave() {
        isHovered = false;
        cancelAnimationFrame(reqId);
        card.style.transition = "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.3s ease";
        card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
        shine.style.opacity = "0";
        card.classList.remove("is-tilted");
      }

      card.addEventListener("mousemove", handleMouseMove, { passive: true });
      card.addEventListener("mouseenter", handleMouseEnter);
      card.addEventListener("mouseleave", handleMouseLeave);
    });
  }

  /* ----------------------------------------------------
   * 3. SCROLL-TRIGGERED REVEAL ANIMATIONS (SMOOTH EFFORTS)
   * ---------------------------------------------------- */
  function initScrollReveals() {
    if (prefersReducedMotion) {
      document.querySelectorAll(".reveal, .reveal-up, .reveal-scale, .reveal-left, .reveal-right").forEach(el => {
        el.classList.add("is-revealed");
      });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          // Optionally keep observing or unobserve for performance
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: "0px 0px -60px 0px",
      threshold: 0.1
    });

    const targets = document.querySelectorAll(
      ".reveal, .reveal-up, .reveal-scale, .reveal-left, .reveal-right, .product-card, .cat, .cat-card, .feature-card, .review-card, .stat-item, .section-head"
    );

    targets.forEach((el, index) => {
      if (!el.classList.contains("reveal-up") && !el.classList.contains("reveal-left") && !el.classList.contains("reveal-right")) {
        el.classList.add("reveal-up");
      }
      // Add subtle staggered delay for siblings in grids
      const parentGrid = el.closest(".product-grid, .cat-grid, .features-grid, .reviews-track");
      if (parentGrid) {
        const siblings = Array.from(parentGrid.children);
        const idx = siblings.indexOf(el);
        if (idx > -1) {
          el.style.transitionDelay = `${(idx % 4) * 0.1}s`;
        }
      }
      observer.observe(el);
    });
  }

  /* ----------------------------------------------------
   * 4. FLOATING QUICK-ACTION WIDGET (WHATSAPP & CALL)
   * ---------------------------------------------------- */
  function initFloatingQuickActions() {
    if (document.getElementById("floatingQuickActions")) return;

    const phone = window.RibStore ? window.RibStore.phoneNumber : "919840012345";

    const widget = document.createElement("aside");
    widget.id = "floatingQuickActions";
    widget.className = "floating-action-stack";
    widget.setAttribute("aria-label", "Customer contact options");

    widget.innerHTML = `
      <!-- Back to Top Button -->
      <button type="button" class="float-btn float-btn-top" id="backToTopBtn" aria-label="Back to top" title="Scroll to Top">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 15l-6-6-6 6"/></svg>
      </button>

      <!-- Direct Call Button -->
      <a href="tel:+${phone}" class="float-btn float-btn-call" id="floatCallBtn" aria-label="Call Rib Cotton customer support" title="Call Us: +91 98400 12345">
        <span class="float-tooltip">Call Us: +91 98400 12345</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
      </a>

      <!-- Direct WhatsApp Button -->
      <a href="https://wa.me/${phone}?text=Hello%20Rib%20Cotton!%20I%20would%20like%20to%20inquire%20about%20your%20products." target="_blank" rel="noopener" class="float-btn float-btn-whatsapp" id="floatWhatsAppBtn" aria-label="Chat on WhatsApp" title="Chat on WhatsApp">
        <span class="float-badge">Instant Help</span>
        <span class="float-tooltip">Chat with Fashion Stylist</span>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.301-.15-1.782-.879-2.058-.98-.276-.1-.477-.15-.678.15-.201.301-.779.98-.955 1.18-.176.201-.352.226-.653.075-.301-.15-1.272-.469-2.423-1.496-.896-.799-1.501-1.786-1.677-2.087-.176-.301-.019-.464.132-.614.136-.135.301-.352.452-.527.15-.176.201-.301.301-.502.101-.201.05-.377-.025-.527-.075-.15-.678-1.633-.93-2.236-.245-.588-.495-.508-.678-.518l-.578-.01c-.201 0-.527.075-.803.377-.276.301-1.054 1.03-1.054 2.512 0 1.482 1.079 2.912 1.23 3.113.15.201 2.123 3.242 5.143 4.547.718.311 1.279.497 1.716.636.721.229 1.377.197 1.896.119.578-.087 1.782-.728 2.033-1.431.251-.703.251-1.306.176-1.431-.075-.125-.276-.201-.577-.351zM12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.17L2 22l4.98-1.39C8.42 21.49 10.16 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
        </svg>
        <span class="float-pulse"></span>
      </a>
    `;

    document.body.appendChild(widget);

    // Back to top scroll toggle
    const topBtn = document.getElementById("backToTopBtn");
    window.addEventListener("scroll", () => {
      if (window.scrollY > 350) {
        topBtn.classList.add("visible");
      } else {
        topBtn.classList.remove("visible");
      }
    }, { passive: true });

    topBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ----------------------------------------------------
   * 5. HEADER SCROLL INTERACTION & SHRINK
   * ---------------------------------------------------- */
  function initHeaderScroll() {
    const header = document.querySelector(".site-header");
    if (!header) return;

    let lastScrollY = window.scrollY;

    window.addEventListener("scroll", () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 40) {
        header.classList.add("header-scrolled");
      } else {
        header.classList.remove("header-scrolled");
      }
      lastScrollY = currentScrollY;
    }, { passive: true });
  }

  /* ----------------------------------------------------
   * 6. BUTTON RIPPLE EFFECT
   * ---------------------------------------------------- */
  function initButtonRipples() {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn, .icon-btn, .round-btn, .tab-btn");
      if (!btn) return;

      const rect = btn.getBoundingClientRect();
      const circle = document.createElement("span");
      const diameter = Math.max(rect.width, rect.height);
      const radius = diameter / 2;

      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      circle.classList.add("btn-ripple");

      const existing = btn.querySelector(".btn-ripple");
      if (existing) existing.remove();

      btn.appendChild(circle);
      setTimeout(() => circle.remove(), 600);
    });
  }

  /* ----------------------------------------------------
   * DOM BOOTSTRAP
   * ---------------------------------------------------- */
  function boot() {
    initPreloader();
    init3DCardTilt();
    initScrollReveals();
    initFloatingQuickActions();
    initHeaderScroll();
    initButtonRipples();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  // Expose re-init for dynamically rendered cards (e.g. shop page filters)
  window.RibAnimations = {
    reinitTilt: init3DCardTilt,
    reinitReveals: initScrollReveals
  };
})();


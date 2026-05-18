/* ============================================
   SHAKTHI FOUNDATION — ANIMATIONS JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── SCROLL REVEAL ──────────────────────── */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));
  }

  /* ─── ANIMATED COUNTERS ──────────────────── */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const easeOutQuart = t => 1 - Math.pow(1 - t, 4);

    const animateCounter = (el) => {
      const target  = parseFloat(el.dataset.count);
      const suffix  = el.dataset.suffix || '';
      const prefix  = el.dataset.prefix || '';
      const duration = 2200;
      const start    = performance.now();
      const isFloat  = target % 1 !== 0;

      const step = (now) => {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased    = easeOutQuart(progress);
        const value    = target * eased;
        el.textContent = prefix + (isFloat ? value.toFixed(1) : Math.floor(value).toLocaleString()) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObserver.observe(el));
  }

  /* ─── PARALLAX SECTIONS ──────────────────── */
  const parallaxItems = document.querySelectorAll('[data-parallax]');
  if (parallaxItems.length && window.innerWidth > 768) {
    const onScroll = () => {
      parallaxItems.forEach(el => {
        const rect   = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2 - window.innerHeight / 2;
        const speed  = parseFloat(el.dataset.parallax) || 0.3;
        el.style.transform = `translateY(${center * speed}px)`;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ─── STAGGER CHILDREN ───────────────────── */
  document.querySelectorAll('[data-stagger]').forEach(parent => {
    const children = parent.children;
    Array.from(children).forEach((child, i) => {
      child.setAttribute('data-reveal', child.dataset.reveal || 'up');
      child.setAttribute('data-delay', String((i + 1) * 100));
    });
  });

  /* ─── SECTION TITLE HIGHLIGHT ────────────── */
  document.querySelectorAll('.underline-draw').forEach(el => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { el.classList.add('revealed'); obs.unobserve(el); }
      });
    }, { threshold: 0.5 });
    obs.observe(el);
  });

  /* ─── PAGE TRANSITION LINKS ──────────────── */
  const transition = document.querySelector('.page-transition');
  if (transition) {
    // Exit animation on page load
    transition.classList.add('exit');

    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('tel')) return;
      if (link.target === '_blank') return;

      link.addEventListener('click', e => {
        e.preventDefault();
        transition.classList.remove('exit');
        transition.classList.add('enter');
        setTimeout(() => { window.location.href = href; }, 600);
      });
    });
  }

  /* ─── GALLERY LAZY PARALLAX ──────────────── */
  document.querySelectorAll('.gallery-item img').forEach(img => {
    img.setAttribute('loading', 'lazy');
  });

  /* ─── FLOATING STATS (homepage) ──────────── */
  document.querySelectorAll('.hero-stat').forEach((stat, i) => {
    stat.style.animationDelay = `${i * 0.15}s`;
    stat.classList.add('float-anim');
  });

});

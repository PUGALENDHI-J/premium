/* ============================================
   SHAKTHI FOUNDATION — MAIN JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── LOADER ──────────────────────────────── */
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 1400);
    document.body.style.overflow = 'hidden';
  }

  /* ─── PROGRESS BAR ───────────────────────── */
  const progressBar = document.getElementById('progress-bar');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = pct + '%';
    }, { passive: true });
  }

  /* ─── NAVBAR SCROLL ──────────────────────── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ─── HAMBURGER / MOBILE NAV ─────────────── */
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileOverlay = document.querySelector('.mobile-nav-overlay');

  const closeMobileNav = () => {
    hamburger?.classList.remove('open');
    mobileNav?.classList.remove('open');
    mobileOverlay?.classList.remove('open');
    document.body.style.overflow = '';
  };

  hamburger?.addEventListener('click', () => {
    const isOpen = mobileNav?.classList.contains('open');
    if (isOpen) {
      closeMobileNav();
    } else {
      hamburger.classList.add('open');
      mobileNav?.classList.add('open');
      mobileOverlay?.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  });

  mobileOverlay?.addEventListener('click', closeMobileNav);

  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  /* ─── ACTIVE NAV LINK ────────────────────── */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ─── BACK TO TOP ────────────────────────── */
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ─── HERO BG LOADED ─────────────────────── */
  const hero = document.querySelector('.hero');
  if (hero) {
    setTimeout(() => hero.classList.add('loaded'), 200);
  }

  /* ─── CURSOR GLOW ────────────────────────── */
  const cursor = document.querySelector('.cursor-glow');
  if (cursor && window.innerWidth > 1024) {
    document.addEventListener('mousemove', e => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top  = e.clientY + 'px';
    });
  }

  /* ─── TESTIMONIAL SLIDER ─────────────────── */
  const slider = document.querySelector('.testimonial-slider');
  if (slider) {
    const track  = slider.querySelector('.testimonial-track');
    const cards  = slider.querySelectorAll('.testimonial-card');
    const dots   = slider.querySelectorAll('.slider-dot');
    const prevBtn = slider.querySelector('.slider-prev');
    const nextBtn = slider.querySelector('.slider-next');
    let current = 0;
    let autoPlay;

    const goTo = (idx) => {
      current = (idx + cards.length) % cards.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    };

    prevBtn?.addEventListener('click', () => { clearInterval(autoPlay); goTo(current - 1); startAuto(); });
    nextBtn?.addEventListener('click', () => { clearInterval(autoPlay); goTo(current + 1); startAuto(); });
    dots.forEach((d, i) => d.addEventListener('click', () => { clearInterval(autoPlay); goTo(i); startAuto(); }));

    const startAuto = () => { autoPlay = setInterval(() => goTo(current + 1), 5000); };
    startAuto();
    goTo(0);

    /* Touch swipe */
    let touchStartX = 0;
    slider.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { clearInterval(autoPlay); goTo(current + (diff > 0 ? 1 : -1)); startAuto(); }
    });
  }

  /* ─── NEWSLETTER FORM ────────────────────── */
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('input');
      if (input && input.value.includes('@')) {
        const btn = form.querySelector('button');
        btn.textContent = '✓ Subscribed';
        btn.style.background = '#2ecc71';
        input.value = '';
        setTimeout(() => { btn.textContent = 'Subscribe'; btn.style.background = ''; }, 3000);
      }
    });
  });

  /* ─── SCROLL TO SECTION ──────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ─── CONTACT FORM ───────────────────────── */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = contactForm.querySelector('[type="submit"]');
      const orig = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = '✓ Message Sent!';
        btn.style.background = 'linear-gradient(135deg,#2ecc71,#27ae60)';
        contactForm.reset();
        setTimeout(() => { btn.textContent = orig; btn.style.background = ''; btn.disabled = false; }, 3500);
      }, 1500);
    });
  }

});

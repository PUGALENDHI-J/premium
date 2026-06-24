/* ============================================
   ZACAYA — SERVICES PAGE JS
============================================ */

// Services smooth scroll from overview
(function() {
  document.querySelectorAll('.overview-item').forEach(item => {
    item.addEventListener('click', function() {
      const target = this.dataset.target;
      const section = document.getElementById(target);
      if (section) {
        const top = section.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
})();

/* ============================================
   ZACAYA — SOLUTIONS PAGE JS
============================================ */

// Active nav highlight for solution sections
(function() {
  const solutionSections = document.querySelectorAll('.solution-detail[id]');
  const navItems = document.querySelectorAll('.sol-nav-item');

  if (!solutionSections.length || !navItems.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('href') === '#' + id) {
            item.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.3 });

  solutionSections.forEach(s => observer.observe(s));
})();

// Smooth scroll for nav items
document.querySelectorAll('.sol-nav-item').forEach(item => {
  item.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = 160; // account for sticky nav + page nav
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

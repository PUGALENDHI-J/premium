/* ============================================
   ZACAYA — CONTACT PAGE JS
============================================ */

// FAQ Accordion
(function() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      faqItems.forEach(fi => fi.classList.remove('open'));
      // Open clicked if it was closed
      if (!isOpen) item.classList.add('open');
    });
  });
})();

// Contact Form
(function() {
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');

  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Simple validation
    let valid = true;
    ['firstName', 'lastName', 'email'].forEach(id => {
      const el = document.getElementById(id);
      if (el && !el.value.trim()) {
        el.style.borderColor = '#e53e3e';
        valid = false;
        el.addEventListener('input', () => el.style.borderColor = '', { once: true });
      }
    });

    if (!valid) return;

    // Simulate submit
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
      form.style.display = 'none';
      if (successMsg) successMsg.classList.remove('hidden');
    }, 1200);
  });
})();

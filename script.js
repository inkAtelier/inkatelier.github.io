// Ink Atelier — shared behavior

document.addEventListener('DOMContentLoaded', () => {

  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => links.classList.remove('open'));
    });
  }

  // Gallery filtering (home page)
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (filterBtns.length && galleryItems.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.filter;
        galleryItems.forEach(item => {
          const match = cat === 'all' || item.dataset.cat === cat;
          item.style.display = match ? '' : 'none';
          // Ensure items that were filtered out before their scroll-reveal
          // ever fired (so they never got the .in-view class) still show
          // up when brought back instead of staying stuck at opacity:0.
          if (match) item.classList.add('in-view');
        });
      });
    });
  }

  // Contact form (front-end only — wire up to a form backend / email service to go live)
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      status.textContent = "Thank you — your note has been received. I'll reply within two business days.";
      form.reset();
    });
  }

  // Reveal-on-scroll for section heads and cards
  const revealTargets = document.querySelectorAll('.section-head, .gallery-item, .cat-card, .tier-card, .step, .tl-item');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealTargets.forEach(el => {
      el.classList.add('pre-reveal');
      io.observe(el);
    });
  }
});

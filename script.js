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

  // Gallery lightbox — click (or Enter/Space) a piece to view it larger
  const lightbox = document.getElementById('lightbox');
  if (lightbox && galleryItems.length) {
    const lightboxWash = document.getElementById('lightboxWash');
    const lightboxCat = document.getElementById('lightboxCat');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const items = Array.from(galleryItems);
    let currentIndex = 0;
    let lastFocused = null;

    function render(index) {
      const item = items[index];
      const wash = item.querySelector('.wash');
      const cat = item.querySelector('.gallery-caption .cat');
      const title = item.querySelector('.gallery-caption .title');
      // Copy whatever visual is on the small item's .wash (gradient today,
      // a real photo later if .wash gets a background-image) onto the
      // lightbox so this keeps working once real artwork is swapped in.
      const computed = getComputedStyle(wash);
      lightboxWash.style.backgroundImage = computed.backgroundImage;
      lightboxWash.style.backgroundColor = computed.backgroundColor;
      lightboxCat.textContent = cat ? cat.textContent : '';
      lightboxTitle.textContent = title ? title.textContent : '';
    }

    function open(index) {
      currentIndex = index;
      lastFocused = document.activeElement;
      render(currentIndex);
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      lightboxClose.focus();
    }

    function close() {
      lightbox.hidden = true;
      document.body.style.overflow = '';
      if (lastFocused) lastFocused.focus();
    }

    function step(delta) {
      currentIndex = (currentIndex + delta + items.length) % items.length;
      render(currentIndex);
    }

    items.forEach((item, index) => {
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');
      const title = item.querySelector('.gallery-caption .title');
      item.setAttribute('aria-label', 'View larger image: ' + (title ? title.textContent : 'artwork'));
      item.addEventListener('click', () => open(index));
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open(index);
        }
      });
    });

    lightboxClose.addEventListener('click', close);
    lightboxPrev.addEventListener('click', () => step(-1));
    lightboxNext.addEventListener('click', () => step(1));
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) close();
    });
    document.addEventListener('keydown', (e) => {
      if (lightbox.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
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

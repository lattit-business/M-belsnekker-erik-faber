/* ============================================
   MØBELSNEKKER ERIK FABER — Main JavaScript
   Menu, Lightbox, Scroll Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* --- Sticky Header --- */
  const header = document.querySelector('.header');
  if (header) {
    const isTransparent = header.classList.contains('header--transparent');
    const onScroll = () => {
      if (window.scrollY > 60) {
        header.classList.remove('header--transparent');
        header.classList.add('header--solid');
      } else if (isTransparent) {
        header.classList.remove('header--solid');
        header.classList.add('header--transparent');
      }
    };
    if (isTransparent) window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* --- Mobile Menu --- */
  const hamburger = document.querySelector('.hamburger');
  const navOverlay = document.querySelector('.nav-overlay');
  if (hamburger && navOverlay) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('hamburger--open');
      navOverlay.classList.toggle('nav-overlay--open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    navOverlay.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('hamburger--open');
        navOverlay.classList.remove('nav-overlay--open');
        document.body.style.overflow = '';
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* --- Lightbox --- */
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lbImg = lightbox.querySelector('.lightbox__img');
    const lbCaption = lightbox.querySelector('.lightbox__caption');
    const lbClose = lightbox.querySelector('.lightbox__close');
    const lbPrev = lightbox.querySelector('.lightbox__nav--prev');
    const lbNext = lightbox.querySelector('.lightbox__nav--next');
    const items = document.querySelectorAll('[data-lightbox]');
    let currentIndex = 0;

    const openLightbox = (index) => {
      currentIndex = index;
      const item = items[index];
      lbImg.src = item.dataset.lightbox;
      lbImg.alt = item.dataset.alt || '';
      if (lbCaption) lbCaption.textContent = item.dataset.caption || '';
      lightbox.classList.add('lightbox--open');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      lightbox.classList.remove('lightbox--open');
      document.body.style.overflow = '';
      lbImg.src = '';
    };

    const navigate = (dir) => {
      currentIndex = (currentIndex + dir + items.length) % items.length;
      const item = items[currentIndex];
      lbImg.src = item.dataset.lightbox;
      lbImg.alt = item.dataset.alt || '';
      if (lbCaption) lbCaption.textContent = item.dataset.caption || '';
    };

    items.forEach((item, i) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        openLightbox(i);
      });
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); openLightbox(i); }
      });
    });

    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    if (lbPrev) lbPrev.addEventListener('click', () => navigate(-1));
    if (lbNext) lbNext.addEventListener('click', () => navigate(1));

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('lightbox--open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    });
  }

  /* --- Gallery Filter --- */
  const filterBtns = document.querySelectorAll('.gallery-filter__btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (filterBtns.length && galleryItems.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        filterBtns.forEach(b => b.classList.remove('gallery-filter__btn--active'));
        btn.classList.add('gallery-filter__btn--active');

        galleryItems.forEach(item => {
          if (filter === 'all' || item.dataset.category === filter) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  /* --- Scroll Reveal --- */
  const fadeEls = document.querySelectorAll('.fade-up');
  if (fadeEls.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach((el, i) => {
      el.style.transitionDelay = `${i % 3 * 0.1}s`;
      observer.observe(el);
    });
  }

  /* --- Contact Form (basic validation) --- */
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('#name');
      const email = form.querySelector('#email');
      const message = form.querySelector('#message');
      let valid = true;

      [name, email, message].forEach(field => {
        if (!field.value.trim()) {
          field.style.borderColor = '#c44';
          valid = false;
        } else {
          field.style.borderColor = '';
        }
      });

      if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        email.style.borderColor = '#c44';
        valid = false;
      }

      if (valid) {
        const btn = form.querySelector('button[type="submit"]');
        btn.textContent = 'Melding sendt!';
        btn.disabled = true;
        btn.style.opacity = '0.6';
        form.reset();
        setTimeout(() => {
          btn.textContent = 'Send melding';
          btn.disabled = false;
          btn.style.opacity = '';
        }, 3000);
      }
    });
  }

});

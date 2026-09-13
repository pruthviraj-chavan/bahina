/* ===================================================
   BAHINA FOUNDATION — Main JavaScript
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ==================== NAV SCROLL ==================== */
  const nav = document.querySelector('.nav');
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.nav__mobile');

  const updateNav = () => {
    if (!nav) return;
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
      nav.classList.remove('transparent');
    } else {
      nav.classList.remove('scrolled');
      if (nav.dataset.transparent === 'true') {
        nav.classList.add('transparent');
      }
    }
  };

  if (nav && nav.dataset.transparent === 'true') {
    nav.classList.add('transparent');
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* Hamburger */
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && mobileMenu.classList.contains('open')) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ==================== SCROLL REVEAL ==================== */
  const revealEls = document.querySelectorAll('.reveal');

  if (revealEls.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* ==================== COUNTER ANIMATION ==================== */
  const counters = document.querySelectorAll('[data-counter]');

  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.counter);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
    const duration = 2000;
    const start = performance.now();

    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;

      el.textContent = prefix + current.toFixed(decimals) + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = prefix + target.toFixed(decimals) + suffix;
      }
    };

    requestAnimationFrame(step);
  };

  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          entry.target.dataset.animated = 'true';
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObserver.observe(el));
  }

  /* ==================== SMOOTH SCROLL ==================== */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile menu if open
        if (mobileMenu && mobileMenu.classList.contains('open')) {
          hamburger.classList.remove('open');
          mobileMenu.classList.remove('open');
          document.body.style.overflow = '';
        }
      }
    });
  });

  /* ==================== DONUT CHART ANIMATION ==================== */
  const donut = document.querySelector('.impact__donut svg');
  if (donut) {
    const segments = donut.querySelectorAll('circle.segment');
    const circumference = 2 * Math.PI * 88; // r=88

    let offset = 0;
    segments.forEach(seg => {
      const pct = parseFloat(seg.dataset.pct || 0);
      const dash = (pct / 100) * circumference;
      seg.style.strokeDasharray = `${dash} ${circumference - dash}`;
      seg.style.strokeDashoffset = -offset;
      offset += dash;
    });

    const donutObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          segments.forEach(seg => {
            seg.style.transition = 'stroke-dashoffset 0.01s, stroke-dasharray 1.4s cubic-bezier(0.4, 0, 0.2, 1)';
          });
          donutObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    donutObserver.observe(donut);
  }

  /* ==================== ACTIVE NAV LINK ==================== */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link, .nav__mobile-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPath || (currentPath === '' && href === 'index.html'))) {
      link.style.color = 'var(--c-gold)';
    }
  });

  /* ==================== PARALLAX EFFECT (subtle) ==================== */
  const heroBg = document.querySelector('.hero__bg img');
  if (heroBg && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      const scroll = window.scrollY;
      heroBg.style.transform = `scale(1.04) translateY(${scroll * 0.3}px)`;
    }, { passive: true });
  }

});

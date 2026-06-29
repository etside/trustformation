// Trust Formation — Main JS
(function () {
  'use strict';

  // --- MOBILE NAV TOGGLE ---
  const toggle = document.getElementById('mobileToggle');
  const nav = document.getElementById('mainNav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      const icon = toggle.querySelector('i');
      icon.className = nav.classList.contains('open') ? 'fas fa-times' : 'fas fa-bars';
    });
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.querySelector('i').className = 'fas fa-bars';
      });
    });
  }

  // --- SCROLL-TO-TOP BUTTON ---
  const scrollBtn = document.getElementById('scrollTop');
  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      scrollBtn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // --- ACTIVE NAV LINK ON SCROLL ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav a[href^="#"]');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { threshold: 0.3 });
  sections.forEach(s => sectionObserver.observe(s));

  // --- HEADER ENTRANCE ANIMATION ---
  const header = document.querySelector('.header');
  if (header) {
    requestAnimationFrame(() => {
      setTimeout(() => header.classList.add('header-loaded'), 100);
    });
  }

  // --- HERO IMMEDIATE CHECK ---
  const hero = document.querySelector('.hero-animate');
  if (hero) {
    const rect = hero.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      hero.classList.add('hero-is-visible');
    } else {
      const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            hero.classList.add('hero-is-visible');
            heroObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      heroObserver.observe(hero);
    }
  }

  // --- SCROLL REVEAL OBSERVER ---
  const observedContainers = new Set();

  function setupScrollReveal() {
    const allAnimated = document.querySelectorAll('[data-animate]');

    allAnimated.forEach(el => {
      const container = el.closest('.services-grid, .whyus-grid, .contact-grid, .footer-grid, .process-grid, .pricing-grid, .testimonials-grid, .faq-grid, .hero-actions, .hero-stats, .banner-text, .cta-content')
        || el.closest('section, .hero, footer');

      if (container && !observedContainers.has(container)) {
        observedContainers.add(container);

        const revealObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              entry.target.addEventListener('animationend', function cleanup() {
                entry.target.querySelectorAll('[data-animate]').forEach(child => {
                  child.style.willChange = 'auto';
                });
                entry.target.removeEventListener('animationend', cleanup);
              });
              revealObserver.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1 });

        revealObserver.observe(container);
      }
    });
  }

  setupScrollReveal();

  // --- FAQ TOGGLE ---
  window.toggleFaq = function(btn) {
    const item = btn.closest('.faq-item');
    const isActive = item.classList.contains('active');

    // Close all other FAQs
    document.querySelectorAll('.faq-item.active').forEach(openItem => {
      if (openItem !== item) openItem.classList.remove('active');
    });

    item.classList.toggle('active', !isActive);
  };

  // --- PRICING TAB FILTER ---
  const pricingTabs = document.querySelectorAll('.pricing-tab');
  const pricingCards = document.querySelectorAll('.pricing-card');

  pricingTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      pricingTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const country = tab.dataset.country;
      pricingCards.forEach(card => {
        if (card.dataset.country === country) {
          card.style.display = '';
          card.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Show USA by default
  if (pricingTabs.length > 0) {
    pricingTabs[0].click();
  }

  // --- CONTACT FORM SUCCESS MESSAGE ---
  const params = new URLSearchParams(window.location.search);
  if (params.get('submitted') === 'true') {
    const form = document.querySelector('.contact-form');
    if (form) {
      const msg = document.createElement('div');
      msg.className = 'form-success';
      msg.innerHTML = '<i class="fas fa-check-circle"></i> Message sent successfully! We\'ll get back to you soon.';
      form.prepend(msg);
    }
    history.replaceState({}, '', window.location.pathname + '#contact');
  }

  // --- SMOOTH SCROLL FOR ANCHOR LINKS ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

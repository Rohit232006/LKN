/* ========================================
   LKN BANQUET — THE WELCOMING HALL
   Interactive Behaviors
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ── Verified Venue Data ──
  const VENUE_DATA = {
    capacity: '10 to 500 Guests',
    rooms: 'AC Guest & Bridal Rooms with Attached Washrooms',
    phone: '078248 58687',
    landline: '044 35686481',
    email: 'lknbanquet@gmail.com',
    whatsapp: '+917824858687',
    address: 'Pulla Avenue, Shenoy Nagar, Chennai - 600030',
    metro: 'Shenoy Nagar Metro (3-5 min walk / 400m)',
    rating: '4.7',
    ratingSource: 'Google Reviews (Shenoy Nagar)',
    ratingCount: '297+',
    valetParking: 'Available at Pulla Avenue entrance',
    airConditioning: 'Centralised AC (Main Hall & Dining)',
    powerBackup: '100% Generator Backup & 24/7 Water Supply',
    hours: 'Daily 8:00 AM – 9:00 PM for Hall Visits'
  };

  // ── Navbar Scroll Behavior ──
  const navbar = document.getElementById('navbar');

  function updateNavbar() {
    const scrollY = window.scrollY;
    if (scrollY > 60) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  // ── Active link highlighting ──
  const navLinks = document.querySelectorAll('.navbar__link');
  const sections = [];
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      const section = document.querySelector(href);
      if (section) sections.push({ link, section });
    }
  });

  function updateActiveLink() {
    const scrollMid = window.scrollY + window.innerHeight / 2.5;
    let current = null;
    sections.forEach(({ section }) => {
      if (section.offsetTop <= scrollMid) current = section.id;
    });
    sections.forEach(({ link, section }) => {
      if (section.id === current) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  // ── Mobile Menu ──
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('[data-mobile-link]');

  function openMobileMenu() {
    navToggle.classList.add('active');
    mobileMenu.classList.add('active');
    navToggle.setAttribute('aria-expanded', 'true');
  }

  function closeMobileMenu() {
    navToggle.classList.remove('active');
    mobileMenu.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  function toggleMobileMenu() {
    const isOpen = mobileMenu.classList.contains('active');
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  navToggle.addEventListener('click', toggleMobileMenu);

  // Close on link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      closeMobileMenu();
      navToggle.focus();
    }
  });

  // Close when clicking outside the navbar/menu
  document.addEventListener('click', (e) => {
    if (
      mobileMenu.classList.contains('active') &&
      !navbar.contains(e.target) &&
      !mobileMenu.contains(e.target)
    ) {
      closeMobileMenu();
    }
  });

  // ── Smooth Scroll for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        // Account for fixed navbar height
        const navHeight = navbar ? navbar.offsetHeight : 72;
        const offsetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;
        
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // ── Fade-Up Intersection Observer ──
  const fadeElements = document.querySelectorAll('.fade-up');
  
  if ('IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    fadeElements.forEach(el => fadeObserver.observe(el));
  } else {
    // Fallback: show everything
    fadeElements.forEach(el => el.classList.add('visible'));
  }

  // ── Gallery Filter ──
  const filterBtns = document.querySelectorAll('.gallery-filter');
  const galleryItems = document.querySelectorAll('[data-gallery-item]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      const filter = btn.dataset.filter;

      galleryItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = '';
          item.style.opacity = '0';
          requestAnimationFrame(() => {
            item.style.transition = 'opacity 300ms ease';
            item.style.opacity = '1';
          });
        } else {
          item.style.opacity = '0';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // ── Gallery Lightbox ──
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  let currentLightboxIndex = 0;
  let visibleImages = [];

  function getVisibleGalleryImages() {
    return Array.from(galleryItems)
      .filter(item => item.style.display !== 'none')
      .map(item => ({
        src: item.querySelector('img').src,
        alt: item.querySelector('img').alt
      }));
  }

  function openLightbox(index) {
    visibleImages = getVisibleGalleryImages();
    currentLightboxIndex = index;
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateLightboxImage() {
    if (visibleImages[currentLightboxIndex]) {
      lightboxImg.src = visibleImages[currentLightboxIndex].src;
      lightboxImg.alt = visibleImages[currentLightboxIndex].alt;
    }
  }

  function prevImage() {
    currentLightboxIndex = (currentLightboxIndex - 1 + visibleImages.length) % visibleImages.length;
    updateLightboxImage();
  }

  function nextImage() {
    currentLightboxIndex = (currentLightboxIndex + 1) % visibleImages.length;
    updateLightboxImage();
  }

  galleryItems.forEach((item, idx) => {
    item.addEventListener('click', () => openLightbox(idx));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(idx);
      }
    });
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', 'View image in lightbox');
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', prevImage);
  lightboxNext.addEventListener('click', nextImage);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    switch (e.key) {
      case 'Escape': closeLightbox(); break;
      case 'ArrowLeft': prevImage(); break;
      case 'ArrowRight': nextImage(); break;
    }
  });

  // ── FAQ Accordion ──
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-item__question');
    const answer = item.querySelector('.faq-item__answer');
    const inner = answer.querySelector('.faq-item__answer-inner');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other FAQs
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          other.querySelector('.faq-item__question').setAttribute('aria-expanded', 'false');
          other.querySelector('.faq-item__answer').style.maxHeight = '0';
        }
      });

      // Toggle current
      if (isActive) {
        item.classList.remove('active');
        question.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = '0';
      } else {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = inner.scrollHeight + 'px';
      }
    });
  });

  // ── Enquiry Form & 180-Char Counter ──
  const enquiryForm = document.getElementById('enquiryForm');
  const formSuccess = document.getElementById('formSuccess');
  const descTextarea = document.getElementById('enquiry-desc');
  const charCount = document.getElementById('charCount');

  if (descTextarea && charCount) {
    descTextarea.addEventListener('input', () => {
      const len = descTextarea.value.length;
      charCount.textContent = `${len} / 180`;
      if (len >= 170) {
        charCount.style.color = '#E67E22';
      } else {
        charCount.style.color = 'rgba(251,247,240,0.65)';
      }
    });
  }

  if (enquiryForm) {
    enquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic validation
      const name = document.getElementById('enquiry-name').value.trim();
      const phone = document.getElementById('enquiry-phone').value.trim();
      const email = document.getElementById('enquiry-email') ? document.getElementById('enquiry-email').value.trim() : '';
      const event = document.getElementById('enquiry-event').value;
      const date = document.getElementById('enquiry-date').value;
      const guests = document.getElementById('enquiry-guests') ? document.getElementById('enquiry-guests').value : '';
      const desc = descTextarea ? descTextarea.value.trim() : '';

      if (!name || !phone || !event || !date) {
        // Highlight empty required fields
        enquiryForm.querySelectorAll('input[required], select[required]').forEach(field => {
          if (!field.value.trim()) {
            field.style.borderColor = '#C0392B';
            field.addEventListener('input', function handler() {
              field.style.borderColor = '';
              field.removeEventListener('input', handler);
            });
          }
        });
        return;
      }

      // Show success state
      enquiryForm.style.display = 'none';
      formSuccess.classList.add('active');

      // Update success message with direct WhatsApp follow-up link
      const waMessage = encodeURIComponent(
        `Hi LKN Banquet, I would like to book a hall visit:\nName: ${name}\nPhone: ${phone}\nEvent: ${event}\nDate: ${date}\nGuests: ${guests || 'Flexible'}\nNotes: ${desc || 'None'}`
      );
      const waDirectUrl = `https://wa.me/917824858687?text=${waMessage}`;
      
      const successBtn = document.createElement('a');
      successBtn.href = waDirectUrl;
      successBtn.className = 'btn btn--whatsapp';
      successBtn.style.marginTop = '16px';
      successBtn.target = '_blank';
      successBtn.rel = 'noopener';
      successBtn.innerHTML = `Send Details to WhatsApp (+91 78248 58687) →`;
      formSuccess.appendChild(successBtn);

      console.log('Enquiry submitted:', { name, phone, email, event, date, guests, desc });
    });
  }

  // ── Set minimum date for date picker ──
  const dateInput = document.getElementById('enquiry-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  // ── High-Performance Luxury Parallax Controller ──
  const heroSection = document.getElementById('hero');
  const heroBg = document.querySelector('.hero__bg');
  // Support both video and img in hero
  const heroVideo = document.querySelector('.hero__video');
  const heroImg = document.querySelector('.hero__bg img');
  const heroMedia = heroVideo || heroImg;
  const sectionHeadings = document.querySelectorAll('.section-header h2');
  const kolamDividers = document.querySelectorAll('.kolam-divider');
  const venueCards = document.querySelectorAll('.venue-card');
  const eventCards = document.querySelectorAll('.event-card');
  const galleryGridItems = document.querySelectorAll('.gallery__item');

  // Automatically tag images for cinematic scroll-reveal
  const revealTargets = document.querySelectorAll('.venue-card img, .event-card__img img, .gallery__item img');
  revealTargets.forEach(img => {
    img.classList.add('reveal-img');
  });

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -30px 0px'
    });

    revealTargets.forEach(img => revealObserver.observe(img));
  } else {
    revealTargets.forEach(img => img.classList.add('is-revealed'));
  }

  // Tag headings and dividers for layered depth
  sectionHeadings.forEach(h => h.classList.add('parallax-heading'));
  kolamDividers.forEach(k => k.classList.add('parallax-decor'));

  let isParallaxActive = false;
  let rafId = null;

  function updateParallax() {
    const scrollY = window.scrollY;
    const windowH = window.innerHeight;

    // 1. Hero Parallax: Slow background drift + subtle cinematic zoom
    if (heroSection && heroBg) {
      const heroH = heroSection.offsetHeight;
      if (scrollY <= heroH + 100) {
        const heroProgress = Math.min(1, Math.max(0, scrollY / heroH));
        const heroTranslateY = (scrollY * 0.32).toFixed(2);
        const heroScale = (1 + heroProgress * 0.065).toFixed(4);
        heroBg.style.transform = `translate3d(0, ${heroTranslateY}px, 0) scale(${heroScale})`;
      }
    }

    // 2. Section Headings & Layered Depth (Text moves only a few subtle pixels)
    sectionHeadings.forEach(h2 => {
      const rect = h2.getBoundingClientRect();
      if (rect.top < windowH && rect.bottom > 0) {
        const centerOffset = rect.top + rect.height / 2 - windowH / 2;
        const textY = Math.max(-6, Math.min(6, centerOffset * -0.022)).toFixed(2);
        h2.style.transform = `translate3d(0, ${textY}px, 0)`;
      }
    });

    // 3. Decorative Kolam Dividers (Slightly faster floating movement)
    kolamDividers.forEach(divider => {
      const rect = divider.getBoundingClientRect();
      if (rect.top < windowH && rect.bottom > 0) {
        const centerOffset = rect.top + rect.height / 2 - windowH / 2;
        const decorY = Math.max(-9, Math.min(9, centerOffset * -0.038)).toFixed(2);
        divider.style.transform = `translate3d(0, ${decorY}px, 0)`;
      }
    });

    // 4. Venue Cards & Event Cards Subtle Depth
    venueCards.forEach(card => {
      const img = card.querySelector('img');
      if (!img) return;
      const rect = card.getBoundingClientRect();
      if (rect.top < windowH && rect.bottom > 0) {
        const centerOffset = rect.top + rect.height / 2 - windowH / 2;
        const imgY = Math.max(-10, Math.min(10, centerOffset * 0.035)).toFixed(2);
        // Only apply when not hovered to allow smooth hover transition
        if (!card.matches(':hover')) {
          img.style.transform = `translate3d(0, ${imgY}px, 0)`;
        }
      }
    });

    eventCards.forEach(card => {
      const img = card.querySelector('.event-card__img img');
      if (!img) return;
      const rect = card.getBoundingClientRect();
      if (rect.top < windowH && rect.bottom > 0) {
        const centerOffset = rect.top + rect.height / 2 - windowH / 2;
        const imgY = Math.max(-8, Math.min(8, centerOffset * 0.03)).toFixed(2);
        if (!card.matches(':hover')) {
          img.style.transform = `translate3d(0, ${imgY}px, 0)`;
        }
      }
    });

    // 5. Gallery Multi-Plane Parallax (Alternating subtle speeds)
    galleryGridItems.forEach((item, index) => {
      if (item.style.display === 'none') return;
      const rect = item.getBoundingClientRect();
      if (rect.top < windowH && rect.bottom > 0) {
        const centerOffset = rect.top + rect.height / 2 - windowH / 2;
        const speed = (index % 2 === 0) ? 0.028 : -0.022;
        const itemY = Math.max(-10, Math.min(10, centerOffset * speed)).toFixed(2);
        if (!item.matches(':hover')) {
          item.style.transform = `translate3d(0, ${itemY}px, 0)`;
        }
      }
    });

    rafId = null;
  }

  function onScroll() {
    if (!isParallaxActive) return;
    if (!rafId) {
      rafId = requestAnimationFrame(updateParallax);
    }
  }

  function resetParallaxTransforms() {
    if (heroBg) heroBg.style.transform = '';
    sectionHeadings.forEach(h2 => h2.style.transform = '');
    kolamDividers.forEach(d => d.style.transform = '');
    venueCards.forEach(c => {
      const img = c.querySelector('img');
      if (img) img.style.transform = '';
    });
    eventCards.forEach(c => {
      const img = c.querySelector('.event-card__img img');
      if (img) img.style.transform = '';
    });
    galleryGridItems.forEach(item => item.style.transform = '');
  }

  function checkParallaxActivation() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isDesktop = window.innerWidth >= 768;

    if (isDesktop && !prefersReducedMotion) {
      if (!isParallaxActive) {
        isParallaxActive = true;
        window.addEventListener('scroll', onScroll, { passive: true });
        updateParallax();
      }
    } else {
      if (isParallaxActive) {
        isParallaxActive = false;
        window.removeEventListener('scroll', onScroll);
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        resetParallaxTransforms();
      }
    }
  }

  checkParallaxActivation();
  window.addEventListener('resize', checkParallaxActivation, { passive: true });

  // ── Hero Video Controls ──
  if (heroVideo) {
    // Autoplay resilience: try to play after user interaction if autoplay was blocked
    heroVideo.play().catch(() => {
      const resumeOnInteract = () => {
        heroVideo.play().catch(() => {});
        document.removeEventListener('click', resumeOnInteract);
        document.removeEventListener('touchstart', resumeOnInteract);
      };
      document.addEventListener('click', resumeOnInteract, { once: true });
      document.addEventListener('touchstart', resumeOnInteract, { once: true });
    });

    // Pause video when tab is hidden (save battery/bandwidth)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        heroVideo.pause();
      } else {
        heroVideo.play().catch(() => {});
      }
    });
  }

  // ── Respect prefers-reduced-motion ──
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  
  if (prefersReducedMotion.matches) {
    fadeElements.forEach(el => el.classList.add('visible'));
    revealTargets.forEach(el => el.classList.add('is-revealed'));
    // Pause video for users who prefer reduced motion
    if (heroVideo) {
      heroVideo.pause();
      heroVideo.currentTime = 0;
    }
  }

  // Listen for changes to the preference at runtime
  prefersReducedMotion.addEventListener('change', (e) => {
    if (heroVideo) {
      if (e.matches) {
        heroVideo.pause();
      } else {
        heroVideo.play().catch(() => {});
      }
    }
  });
});

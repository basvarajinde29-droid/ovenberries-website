/* OvenBerries – O'n'B Café | Boutique Roastery Logic */

// ── Custom Cursor ───────────────────────
const supportsCustomCursor = window.innerWidth > 768 && !window.matchMedia('(pointer: coarse)').matches;
let cursorMug;
let cursorGlow;

if (supportsCustomCursor) {
  cursorMug = document.createElement('div');
  cursorGlow = document.createElement('div');
  cursorMug.className = 'cursor-mug';
  cursorGlow.className = 'cursor-glow';
  cursorMug.setAttribute('aria-hidden', 'true');
  cursorGlow.setAttribute('aria-hidden', 'true');
  cursorMug.innerHTML = '<span class="cursor-steam"></span><span class="cursor-cup"><span class="cursor-coffee"></span><span class="cursor-handle"></span></span>';
  document.body.classList.add('custom-cursor-enabled');
  document.body.appendChild(cursorGlow);
  document.body.appendChild(cursorMug);

  window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorMug.style.left = `${posX}px`;
    cursorMug.style.top = `${posY}px`;

    cursorGlow.animate({
      left: `${posX}px`,
      top: `${posY}px`
    }, { duration: 180, fill: 'forwards' });
  });

  document.querySelectorAll('a, button, .bento-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorGlow.classList.add('active');
      cursorMug.classList.add('active');
    });
    el.addEventListener('mouseleave', () => {
      cursorGlow.classList.remove('active');
      cursorMug.classList.remove('active');
    });
  });
}

// ── Navbar scroll ───────────────────────
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar && navbar.classList.add('scrolled');
  } else {
    navbar && navbar.classList.remove('scrolled');
  }
});

// ── Scroll Reveal ───────────────────────
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 100); // Staggered entrance
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));

// ── Hero Parallax ───────────────────────
const heroImg = document.querySelector('.hero-img-parallax');
if (heroImg) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    heroImg.style.transform = `translateY(calc(-50% + ${scrollY * 0.2}px)) rotate(${scrollY * 0.02}deg)`;
  });
}

// ── Smooth scroll for same-page anchors ─
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Modal Logic ──────────────────────────
const orderModal = document.getElementById('orderModal');
const orderBtns = document.querySelectorAll('.js-order-trigger, .btn-primary');
const closeModal = document.getElementById('closeModal');
let lastFocusedElement = null;

function openOrderModal(trigger) {
  if (!orderModal) return;
  lastFocusedElement = trigger || document.activeElement;
  orderModal.classList.add('active');
  orderModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  closeModal && closeModal.focus();
}

function closeOrderModal() {
  if (!orderModal) return;
  orderModal.classList.remove('active');
  orderModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = 'auto';
  lastFocusedElement && lastFocusedElement.focus && lastFocusedElement.focus();
}

if (orderModal && orderBtns.length > 0) {
  orderBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Only open modal if it's the "Order Now" button
      if (btn.textContent.trim() === 'Order Now') {
        e.preventDefault();
        openOrderModal(btn);
      }
    });
  });

  closeModal && closeModal.addEventListener('click', closeOrderModal);

  // Close on outside click
  window.addEventListener('click', (e) => {
    if (e.target === orderModal) {
      closeOrderModal();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && orderModal.classList.contains('active')) {
      closeOrderModal();
    }
  });
}

// ── Mobile Menu Toggle ──────────────────
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

if (navToggle && mobileMenu) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    const isOpen = mobileMenu.classList.contains('active');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open navigation menu');
      document.body.style.overflow = 'auto';
    });
  });
}

// ── Dynamic Menu Search & Filters ───────
const menuSearch = document.getElementById('menuSearch');
const menuFilters = document.getElementById('menuCategoryFilters');
const menuCount = document.getElementById('menuCount');
const menuEmptyState = document.getElementById('menuEmptyState');
const menuSections = [...document.querySelectorAll('.menu-section-wrap')];

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function setupMenuEnhancements() {
  if (!menuSearch || !menuFilters || menuSections.length === 0) return;

  const categories = menuSections.map(section => {
    const title = section.querySelector('h2')?.textContent.trim() || 'Menu';
    const slug = slugify(title);
    section.dataset.category = slug;
    section.id = section.id || slug;
    return { title, slug };
  });

  const allBtn = document.createElement('button');
  allBtn.type = 'button';
  allBtn.className = 'menu-filter-btn active';
  allBtn.dataset.category = 'all';
  allBtn.textContent = 'All';
  menuFilters.appendChild(allBtn);

  categories.forEach(category => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'menu-filter-btn';
    btn.dataset.category = category.slug;
    btn.textContent = category.title;
    menuFilters.appendChild(btn);
  });

  const filterBtns = [...menuFilters.querySelectorAll('.menu-filter-btn')];
  const items = [...document.querySelectorAll('.menu-item-simple')];
  let activeCategory = 'all';

  function updateMenu() {
    const query = menuSearch.value.trim().toLowerCase();
    let visibleItems = 0;

    menuSections.forEach(section => {
      const sectionTitle = section.querySelector('h2')?.textContent.toLowerCase() || '';
      const sectionCategoryMatches = activeCategory === 'all' || section.dataset.category === activeCategory;
      let sectionVisibleItems = 0;

      section.querySelectorAll('.menu-cat').forEach(cat => {
        const catTitle = cat.querySelector('.menu-cat-title')?.textContent.toLowerCase() || '';
        let catVisibleItems = 0;

        cat.querySelectorAll('.menu-item-simple').forEach(item => {
          const text = item.textContent.toLowerCase();
          const matchesSearch = !query || text.includes(query) || catTitle.includes(query) || sectionTitle.includes(query);
          const shouldShow = sectionCategoryMatches && matchesSearch;
          item.classList.toggle('is-hidden', !shouldShow);
          item.classList.toggle('is-match', Boolean(query && shouldShow));
          if (shouldShow) {
            catVisibleItems += 1;
            sectionVisibleItems += 1;
            visibleItems += 1;
          }
        });

        cat.classList.toggle('is-hidden', catVisibleItems === 0);
      });

      section.classList.toggle('is-hidden', sectionVisibleItems === 0);
    });

    menuCount.textContent = `${visibleItems} of ${items.length} items showing`;
    if (menuEmptyState) menuEmptyState.hidden = visibleItems !== 0;
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      activeCategory = btn.dataset.category;
      filterBtns.forEach(filter => filter.classList.toggle('active', filter === btn));
      updateMenu();
    });
  });

  menuSearch.addEventListener('input', updateMenu);
  updateMenu();
}

setupMenuEnhancements();

// ── Gallery Lightbox ─────────────────────
function setupGalleryLightbox() {
  const galleryImages = [...document.querySelectorAll('.gallery-grid-full img')];
  if (galleryImages.length === 0) return;

  const lightbox = document.createElement('div');
  lightbox.className = 'gallery-lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-hidden', 'true');
  lightbox.innerHTML = '<button type="button" aria-label="Close gallery image">&times;</button><img alt="" />';
  document.body.appendChild(lightbox);

  const lightboxImage = lightbox.querySelector('img');
  const lightboxClose = lightbox.querySelector('button');

  galleryImages.forEach((img, index) => {
    img.loading = 'lazy';
    if (!img.alt || img.alt === "O'n'B Gallery") {
      img.alt = `OvenBerries gallery image ${index + 1}`;
    }
    img.parentElement.setAttribute('tabindex', '0');
    img.parentElement.setAttribute('role', 'button');
    img.parentElement.setAttribute('aria-label', `View ${img.alt}`);

    const open = () => {
      lightboxImage.src = img.currentSrc || img.src;
      lightboxImage.alt = img.alt;
      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      lightboxClose.focus();
    };

    img.parentElement.addEventListener('click', open);
    img.parentElement.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open();
      }
    });
  });

  const close = () => {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
  };

  lightboxClose.addEventListener('click', close);
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) close();
  });
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox.classList.contains('active')) close();
  });
}

setupGalleryLightbox();

// ── Contact WhatsApp Form ────────────────
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const lines = [
      'Hi OvenBerries, I have an enquiry.',
      `Name: ${formData.get('name') || ''}`,
      `Phone: ${formData.get('phone') || ''}`,
      `Purpose: ${formData.get('purpose') || ''}`,
      `Message: ${formData.get('message') || ''}`
    ];
    window.open(`https://wa.me/917378373355?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');
  });
}

console.log('OvenBerries Boutique Roastery UI Loaded');

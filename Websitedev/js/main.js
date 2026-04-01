/* OvenBerries – O'n'B Café | Boutique Roastery Logic */

// ── Custom Cursor ───────────────────────
const dot = document.createElement('div');
const outline = document.createElement('div');
dot.className = 'cursor-dot';
outline.className = 'cursor-outline';
document.body.appendChild(dot);
document.body.appendChild(outline);

window.addEventListener('mousemove', (e) => {
  const posX = e.clientX;
  const posY = e.clientY;

  dot.style.left = `${posX}px`;
  dot.style.top = `${posY}px`;

  outline.animate({
    left: `${posX}px`,
    top: `${posY}px`
  }, { duration: 500, fill: 'forwards' });
});

// Hover effect for cursor
document.querySelectorAll('a, button, .bento-item').forEach(el => {
  el.addEventListener('mouseenter', () => {
    outline.style.transform = 'translate(-50%, -50%) scale(2.5)';
    outline.style.borderColor = 'var(--gold)';
    outline.style.background = 'rgba(212, 175, 55, 0.1)';
    dot.style.transform = 'translate(-50%, -50%) scale(0)';
  });
  el.addEventListener('mouseleave', () => {
    outline.style.transform = 'translate(-50%, -50%) scale(1)';
    outline.style.borderColor = 'var(--bean)';
    outline.style.background = 'transparent';
    dot.style.transform = 'translate(-50%, -50%) scale(1)';
  });
});

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
const orderBtns = document.querySelectorAll('.btn-primary');
const closeModal = document.getElementById('closeModal');

if (orderModal && orderBtns.length > 0) {
  orderBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Only open modal if it's the "Order Now" button
      if (btn.textContent.trim() === 'Order Now') {
        e.preventDefault();
        orderModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  closeModal && closeModal.addEventListener('click', () => {
    orderModal.classList.remove('active');
    document.body.style.overflow = 'auto';
  });

  // Close on outside click
  window.addEventListener('click', (e) => {
    if (e.target === orderModal) {
      orderModal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  });
}

console.log('☕ OvenBerries Boutique Roastery UI Loaded');

/* ============================================================
   MAISON NOIRE — js/script.js
   Shared JavaScript — All Pages
   Cart system | Dark mode | Nav | Animations | Interactions
   ============================================================ */

'use strict';

/* ──────────────────────────────────────────────────────────
   UTILITY HELPERS
────────────────────────────────────────────────────────── */
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

/* ──────────────────────────────────────────────────────────
   1. DARK MODE
────────────────────────────────────────────────────────── */
(function initDarkMode() {
  const root    = document.documentElement;
  const toggles = $$('.dark-toggle');
  const stored  = localStorage.getItem('mn-theme');
  const prefers = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Apply saved or system theme
  if (stored === 'dark' || (!stored && prefers)) {
    root.setAttribute('data-theme', 'dark');
  }

  toggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const isDark = root.getAttribute('data-theme') === 'dark';
      root.setAttribute('data-theme', isDark ? 'light' : 'dark');
      localStorage.setItem('mn-theme', isDark ? 'light' : 'dark');
    });
  });
})();


/* ──────────────────────────────────────────────────────────
   2. NAVIGATION — scroll, hide/show, transparency
────────────────────────────────────────────────────────── */
(function initNavbar() {
  const navbar = $('.navbar');
  if (!navbar) return;

  let lastY = 0, ticking = false;

  function update() {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 30);
    // Hide on scroll down past 200px, reveal on scroll up
    if (y > 200) {
      navbar.classList.toggle('hide', y > lastY + 6);
      if (y < lastY - 6) navbar.classList.remove('hide');
    } else {
      navbar.classList.remove('hide');
    }
    lastY = y;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });

  update(); // init

  // Active link highlight
  $$('.nav-link, .mob-nav-link').forEach(link => {
    if (link.href === window.location.href) link.classList.add('active');
  });
})();


/* ──────────────────────────────────────────────────────────
   3. MOBILE DRAWER
────────────────────────────────────────────────────────── */
(function initMobileMenu() {
  const hamburger = $('.hamburger');
  const drawer    = $('.mobile-drawer');
  if (!hamburger || !drawer) return;

  const open  = () => { hamburger.classList.add('open'); drawer.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const close = () => { hamburger.classList.remove('open'); drawer.classList.remove('open'); document.body.style.overflow = ''; };
  const toggle = () => hamburger.classList.contains('open') ? close() : open();

  hamburger.addEventListener('click', toggle);
  $$('.mob-nav-link', drawer).forEach(l => l.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();


/* ──────────────────────────────────────────────────────────
   4. CART SYSTEM (localStorage)
────────────────────────────────────────────────────────── */
const Cart = (() => {
  const KEY = 'mn-cart';

  let items = JSON.parse(localStorage.getItem(KEY) || '[]');

  function save()   { localStorage.setItem(KEY, JSON.stringify(items)); }

  function add(product) {
    // product: { id, name, price, size, image, category }
    const existing = items.find(i => i.id === product.id && i.size === product.size);
    if (existing) {
      existing.qty++;
    } else {
      items.push({ ...product, qty: 1 });
    }
    save();
    render();
    updateBadge();
    showToast(`"${product.name}" added to bag`);
    openPanel();
  }

  function remove(id, size) {
    items = items.filter(i => !(i.id === id && i.size === size));
    save();
    render();
    updateBadge();
  }

  function changeQty(id, size, delta) {
    const item = items.find(i => i.id === id && i.size === size);
    if (!item) return;
    item.qty = Math.max(1, item.qty + delta);
    save();
    render();
    updateBadge();
  }

  function clear() {
    items = [];
    save();
    render();
    updateBadge();
  }

  function total() {
    return items.reduce((sum, i) => sum + i.price * i.qty, 0);
  }

  function count() {
    return items.reduce((sum, i) => sum + i.qty, 0);
  }

  function updateBadge() {
    const n = count();
    $$('.cart-badge').forEach(b => {
      b.textContent = n;
      b.classList.toggle('show', n > 0);
    });
  }

  function openPanel() {
    const panel   = $('#cart-panel');
    const overlay = $('#cart-overlay');
    if (panel)   panel.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closePanel() {
    const panel   = $('#cart-panel');
    const overlay = $('#cart-overlay');
    if (panel)   panel.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function render() {
    const container = $('#cart-items');
    const emptyEl   = $('#cart-empty');
    const totalEl   = $('#cart-total');
    if (!container) return;

    if (items.length === 0) {
      container.innerHTML = '';
      if (emptyEl) emptyEl.style.display = 'flex';
      if (totalEl) totalEl.textContent = '€ 0.00';
      return;
    }

    if (emptyEl) emptyEl.style.display = 'none';

    container.innerHTML = items.map(item => `
      <div class="cart-item" data-id="${item.id}" data-size="${item.size}">
        <img class="cart-item-img"
             src="${item.image || 'images/product1.jpg'}"
             alt="${item.name}"
             onerror="this.style.background='var(--bg-alt)'">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p class="cart-item-meta">Size: ${item.size} &nbsp;|&nbsp; ${item.category || ''}</p>
          <div class="cart-qty-row">
            <button class="cart-qty-btn" data-action="dec" data-id="${item.id}" data-size="${item.size}">−</button>
            <span class="cart-qty">${item.qty}</span>
            <button class="cart-qty-btn" data-action="inc" data-id="${item.id}" data-size="${item.size}">+</button>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:.6rem;">
          <span class="cart-item-price">€ ${(item.price * item.qty).toFixed(2)}</span>
          <button class="cart-item-remove" data-id="${item.id}" data-size="${item.size}" title="Remove">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>
    `).join('');

    if (totalEl) totalEl.textContent = `€ ${total().toFixed(2)}`;

    // Bind events
    $$('.cart-item-remove', container).forEach(btn => {
      btn.addEventListener('click', () => remove(btn.dataset.id, btn.dataset.size));
    });
    $$('.cart-qty-btn', container).forEach(btn => {
      btn.addEventListener('click', () => {
        const delta = btn.dataset.action === 'inc' ? 1 : -1;
        changeQty(btn.dataset.id, btn.dataset.size, delta);
      });
    });
  }

  // Init
  function init() {
    updateBadge();
    render();

    // Cart open/close
    $$('.cart-btn').forEach(btn => btn.addEventListener('click', openPanel));
    const overlay = $('#cart-overlay');
    const closeBtn = $('#cart-close');
    if (overlay) overlay.addEventListener('click', closePanel);
    if (closeBtn) closeBtn.addEventListener('click', closePanel);

    // Clear cart
    const clearBtn = $('#cart-clear');
    if (clearBtn) clearBtn.addEventListener('click', () => {
      if (count() === 0) return;
      clear();
      showToast('Bag cleared');
    });

    // Checkout placeholder
    const checkoutBtn = $('#cart-checkout');
    if (checkoutBtn) checkoutBtn.addEventListener('click', () => {
      if (count() === 0) { showToast('Your bag is empty'); return; }
      showToast('Redirecting to checkout…');
      setTimeout(closePanel, 1500);
    });

    // Keyboard ESC
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closePanel();
    });
  }

  return { add, remove, changeQty, clear, total, count, render, openPanel, closePanel, init };
})();


/* ──────────────────────────────────────────────────────────
   5. ADD-TO-CART BUTTONS (generic, for any page)
────────────────────────────────────────────────────────── */
function bindAddToCartButtons() {
  $$('[data-add-cart]').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('[data-product-id]') || btn.closest('.product-card') || btn;
      Cart.add({
        id:       card.dataset.productId || btn.dataset.id || 'item-' + Date.now(),
        name:     card.dataset.name      || btn.dataset.name    || 'Product',
        price:    parseFloat(card.dataset.price || btn.dataset.price || 0),
        size:     card.dataset.size      || 'One Size',
        image:    card.dataset.image     || btn.dataset.image   || 'images/product1.jpg',
        category: card.dataset.category  || btn.dataset.category || '',
      });
      // micro-animation on btn
      btn.style.transform = 'scale(.88)';
      setTimeout(() => btn.style.transform = '', 250);
    });
  });
}


/* ──────────────────────────────────────────────────────────
   6. SCROLL REVEAL
────────────────────────────────────────────────────────── */
function initScrollReveal() {
  const els = $$('.reveal, .reveal-left, .reveal-right');
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => io.observe(el));
}


/* ──────────────────────────────────────────────────────────
   7. TOAST NOTIFICATION
────────────────────────────────────────────────────────── */
let toastTimer;
function showToast(msg, icon = true) {
  let toast = $('#mn-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'mn-toast';
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      <span class="toast-msg"></span>`;
    document.body.appendChild(toast);
  }
  toast.querySelector('.toast-msg').textContent = msg;
  clearTimeout(toastTimer);
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}


/* ──────────────────────────────────────────────────────────
   8. NEWSLETTER FORM
────────────────────────────────────────────────────────── */
function initNewsletter() {
  $$('.newsletter-form-el').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input   = form.querySelector('input[type="email"]');
      const success = form.nextElementSibling;
      if (!input || !input.value.includes('@')) {
        input.style.borderColor = '#e74c3c';
        setTimeout(() => input.style.borderColor = '', 1500);
        return;
      }
      input.value = '';
      if (success) success.classList.add('show');
      setTimeout(() => success && success.classList.remove('show'), 6000);
    });
  });
}


/* ──────────────────────────────────────────────────────────
   9. SMOOTH SCROLL for anchor links
────────────────────────────────────────────────────────── */
function initSmoothScroll() {
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 70;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
      }
    });
  });
}


/* ──────────────────────────────────────────────────────────
   10. PRODUCT SLIDER (New Arrivals)
────────────────────────────────────────────────────────── */
function initSlider() {
  $$('.slider-section').forEach(section => {
    const track  = section.querySelector('.slider-track');
    const prev   = section.querySelector('.slider-prev');
    const next   = section.querySelector('.slider-next');
    if (!track) return;

    let idx = 0;

    function getVisible() {
      const w = section.clientWidth;
      if (w < 540)  return 1;
      if (w < 768)  return 2;
      if (w < 1200) return 3;
      return 4;
    }

    function cards() { return track.querySelectorAll('.product-card'); }

    function slide() {
      const visible = getVisible();
      const total   = cards().length;
      const max     = Math.max(0, total - visible);
      idx = Math.min(Math.max(idx, 0), max);
      const cardW = cards()[0]?.offsetWidth + 24 || 0; // 24 = gap
      track.style.transform = `translateX(-${idx * cardW}px)`;
    }

    if (next) next.addEventListener('click', () => { idx++; slide(); });
    if (prev) prev.addEventListener('click', () => { idx--; slide(); });

    window.addEventListener('resize', debounce(() => { idx = 0; slide(); }, 200));
    slide();
  });
}


/* ──────────────────────────────────────────────────────────
   11. COLLECTION FILTER
────────────────────────────────────────────────────────── */
function initFilter() {
  const filterBtns = $$('.filter-btn');
  const cards      = $$('.product-card[data-category]');
  const countEl    = $('.product-count');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      let visible  = 0;

      cards.forEach(card => {
        const cat  = card.dataset.category || '';
        const show = filter === 'all' || cat === filter;
        card.classList.toggle('hidden', !show);
        if (show) visible++;
      });

      if (countEl) countEl.textContent = `${visible} piece${visible !== 1 ? 's' : ''}`;
    });
  });

  // init count
  if (countEl) countEl.textContent = `${cards.length} pieces`;
}


/* ──────────────────────────────────────────────────────────
   12. PRODUCT DETAIL — gallery + size selector
────────────────────────────────────────────────────────── */
function initProductDetail() {
  // Gallery thumbnails
  const mainImg = $('#product-main-img');
  $$('.product-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      $$('.product-thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      if (mainImg) {
        const src = thumb.querySelector('img')?.src;
        const img = mainImg.querySelector('img');
        if (img && src) { img.style.opacity = '0'; setTimeout(() => { img.src = src; img.style.opacity = '1'; }, 200); }
      }
    });
  });

  // Size buttons
  const sizeBtns = $$('.size-btn:not(.sold-out)');
  sizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sizeBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });

  // Add to cart from detail page
  const atcBtn = $('#product-atc');
  if (atcBtn) {
    atcBtn.addEventListener('click', () => {
      const selected = $('.size-btn.selected');
      if (!selected) { showToast('Please select a size'); return; }
      Cart.add({
        id:       atcBtn.dataset.id       || 'product-detail',
        name:     atcBtn.dataset.name     || 'Product',
        price:    parseFloat(atcBtn.dataset.price || 0),
        size:     selected.textContent.trim(),
        image:    atcBtn.dataset.image    || 'images/product1.jpg',
        category: atcBtn.dataset.category || '',
      });
    });
  }
}


/* ──────────────────────────────────────────────────────────
   13. CONTACT FORM
────────────────────────────────────────────────────────── */
function initContactForm() {
  const form = $('#contact-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const success = $('#contact-success');
    if (success) success.classList.add('show');
    form.reset();
    setTimeout(() => success && success.classList.remove('show'), 6000);
    showToast('Message sent — thank you!');
  });
}


/* ──────────────────────────────────────────────────────────
   14. HERO IMAGE PARALLAX + load animation
────────────────────────────────────────────────────────── */
function initHero() {
  const heroImg = $('.hero-media img');
  if (heroImg) {
    setTimeout(() => heroImg.classList.add('loaded'), 100);
  }

  // Scroll-based parallax
  const heroMedia = $('.hero-media');
  if (!heroMedia) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y    = window.scrollY;
        const heroH = $('.hero')?.offsetHeight || 0;
        if (y < heroH && heroImg) {
          heroImg.style.transform = `translateY(${y * 0.28}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}


/* ──────────────────────────────────────────────────────────
   15. INSTAGRAM GRID hover text
────────────────────────────────────────────────────────── */
function initInstaGrid() {
  $$('.insta-item').forEach(item => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
      showToast('Opening Instagram…');
    });
  });
}


/* ──────────────────────────────────────────────────────────
   16. HERO TICKER duplicate for seamless loop
────────────────────────────────────────────────────────── */
function initTicker() {
  $$('.ticker-track').forEach(t => {
    // Content is already doubled in HTML for seamless loop
    t.addEventListener('mouseenter', () => t.style.animationPlayState = 'paused');
    t.addEventListener('mouseleave', () => t.style.animationPlayState = 'running');
  });
}


/* ──────────────────────────────────────────────────────────
   17. PAGE LOAD STAGGER (hero elements)
────────────────────────────────────────────────────────── */
function initPageLoad() {
  $$('.hero .reveal, .hero .hero-eyebrow, .hero .hero-title, .hero .hero-sub, .hero .hero-ctas').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    setTimeout(() => {
      el.style.transition = 'opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1)';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 300 + i * 150);
  });
}


/* ──────────────────────────────────────────────────────────
   INIT ALL
────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  Cart.init();
  initScrollReveal();
  initNewsletter();
  initSmoothScroll();
  initSlider();
  initFilter();
  initProductDetail();
  initContactForm();
  initHero();
  initInstaGrid();
  initTicker();
  initPageLoad();
  bindAddToCartButtons();
});

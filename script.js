/**
 * Socialkaroo ⚡ — Agency Interactive Scripts
 * Includes the 3D Animated Engine, Strategy Call Booking Engine,
 * Lead Funnel Simulator, ROI Calculator & Pricing Switcher.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initCalculator();
  initPricing();
  initParticleCanvas();
  initTiltCards();
  initBookingEngine();
});

/* =========================================================================
   1. Mobile Navigation & Header Scroll
   ========================================================================= */
function initNavigation() {
  const toggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  const links = document.querySelectorAll('.nav-link');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });

    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('show');
      });
    });
  }

  const header = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.4)';
    } else {
      header.style.boxShadow = 'none';
    }
  });
}

/* =========================================================================
   2. Interactive ROI Calculator
   ========================================================================= */
function initCalculator() {
  calculateROI();
}

function updateTicketFromSlider() {
  const slider = document.getElementById('calcTicket');
  const display = document.getElementById('ticketDisplay');
  const val = parseInt(slider.value, 10);
  display.textContent = '₹' + val.toLocaleString('en-IN');
  calculateROI();
}

function calculateROI() {
  const select = document.getElementById('calcIndustry');
  const selectedOption = select.options[select.selectedIndex];

  const baseTicket = parseInt(selectedOption.getAttribute('data-ticket'), 10) || 1500;
  const baseLeads = parseInt(selectedOption.getAttribute('data-leads'), 10) || 45;

  const ticketSlider = document.getElementById('calcTicket');
  const convSlider = document.getElementById('calcConversion');

  if (document.activeElement === select) {
    ticketSlider.value = baseTicket;
    document.getElementById('ticketDisplay').textContent = '₹' + baseTicket.toLocaleString('en-IN');
  }

  const currentTicket = parseInt(ticketSlider.value, 10);
  const conversionRate = parseInt(convSlider.value, 10);

  document.getElementById('convDisplay').textContent = `${conversionRate}% (${conversionRate >= 30 ? 'High' : 'Typical for WhatsApp'} close rate)`;

  const leadsGenerated = baseLeads;
  const customersConverted = Math.max(1, Math.round(leadsGenerated * (conversionRate / 100)));
  const extraRevenue = customersConverted * currentTicket;

  document.getElementById('resLeads').textContent = `${leadsGenerated} Leads / mo`;
  document.getElementById('resCustomers').textContent = `${customersConverted} New Customers`;
  document.getElementById('resRevenue').textContent = '₹' + extraRevenue.toLocaleString('en-IN');

  const tier2Cost = 9500;
  const roiMultiple = (extraRevenue / tier2Cost).toFixed(1);

  const roiSummary = document.getElementById('roiText');
  if (extraRevenue > tier2Cost) {
    roiSummary.innerHTML = `With Socialkaroo <strong>Tier 2 Growth (₹9,500/mo)</strong>, your estimated Return On Investment is <strong style="color:#34d399;">${roiMultiple}x</strong> every month.`;
  } else {
    roiSummary.innerHTML = `With Socialkaroo <strong>Tier 2 Growth (₹9,500/mo)</strong>, you build an organic search asset that continues to bring recurring customers.`;
  }
}

/* =========================================================================
   3. Pricing Duration Switcher (Monthly vs 90-Day Upfront)
   ========================================================================= */
function initPricing() {}

function togglePricingDuration() {
  const toggle = document.getElementById('pricingToggle');
  const isQuarterly = toggle.checked;

  const lblMonthly = document.getElementById('lblMonthly');
  const lblQuarterly = document.getElementById('lblQuarterly');

  const tier1Price = document.getElementById('tier1Price');
  const tier2Price = document.getElementById('tier2Price');
  const tier3Price = document.getElementById('tier3Price');

  const tier1Setup = document.getElementById('tier1Setup');
  const tier2Setup = document.getElementById('tier2Setup');
  const tier3Setup = document.getElementById('tier3Setup');

  if (isQuarterly) {
    lblMonthly.classList.remove('active');
    lblQuarterly.classList.add('active');

    tier1Price.innerHTML = '₹13,500 <span class="p-period">/ 90 days</span>';
    tier2Price.innerHTML = '₹25,650 <span class="p-period">/ 90 days</span>';
    tier3Price.innerHTML = '₹37,800 <span class="p-period">/ 90 days</span>';

    tier1Setup.textContent = '+ ₹3,000 Setup (Save ₹1,500 total)';
    tier2Setup.textContent = '+ ₹7,500 Setup (Save ₹2,850 total)';
    tier3Setup.textContent = '+ ₹12,000 Setup (Save ₹4,200 total)';
  } else {
    lblMonthly.classList.add('active');
    lblQuarterly.classList.remove('active');

    tier1Price.innerHTML = '₹5,000 <span class="p-period">/ month</span>';
    tier2Price.innerHTML = '₹9,500 <span class="p-period">/ month</span>';
    tier3Price.innerHTML = '₹14,000 <span class="p-period">/ month</span>';

    tier1Setup.textContent = '+ ₹3,000 One-Time Setup';
    tier2Setup.textContent = '+ ₹7,500 One-Time Setup';
    tier3Setup.textContent = '+ ₹12,000 One-Time Setup';
  }
}

/* =========================================================================
   4. FAQ Accordion Toggle
   ========================================================================= */
function toggleFAQ(button) {
  const currentItem = button.parentElement;
  const allItems = document.querySelectorAll('.faq-item');
  const icon = button.querySelector('.faq-toggle-icon');

  allItems.forEach(item => {
    if (item !== currentItem) {
      item.classList.remove('active');
      const otherIcon = item.querySelector('.faq-toggle-icon');
      if (otherIcon) otherIcon.textContent = '+';
    }
  });

  if (currentItem.classList.contains('active')) {
    currentItem.classList.remove('active');
    icon.textContent = '+';
  } else {
    currentItem.classList.add('active');
    icon.textContent = '−';
  }
}

/* =========================================================================
   5. Lead Capture Form & WhatsApp Direct Connect
   ========================================================================= */
function handleFormSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('fName').value.trim();
  const business = document.getElementById('fBusiness').value.trim();
  const phone = document.getElementById('fPhone').value.trim();
  const category = document.getElementById('fCategory').value;
  const location = document.getElementById('fLocation').value.trim() || 'Indore';

  const submitBtn = document.getElementById('submitBtn');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span>Analyzing Profile & Sending... ⚡</span>';

  setTimeout(() => {
    document.getElementById('leadForm').style.display = 'none';
    document.getElementById('successBox').style.display = 'block';

    const waText = encodeURIComponent(
      `Namaste Socialkaroo! ⚡\n\nI just requested a Free Growth Audit:\n• Name: ${name}\n• Business: ${business} (${category})\n• Location: ${location}\n• WhatsApp: ${phone}\n\nPlease share my Google Maps & Inbound Lead Audit!`
    );

    const waUrl = `https://wa.me/916267556790?text=${waText}`;

    const waBtn = document.querySelector('#successBox a');
    if (waBtn) {
      waBtn.href = waUrl;
    }
  }, 900);
}

/* =========================================================================
   6. 3D Animated Engine — Depth Particle Canvas (hero)
   ========================================================================= */
function initParticleCanvas() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');

  let W = 0;
  let H = 0;
  let rafId = null;

  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  const PARTICLE_COUNT = 110;
  const DEPTH = 260;

  const particles = [];

  function resize() {
    const hero = document.getElementById('hero');
    const rect = hero.getBoundingClientRect();
    W = rect.width;
    H = rect.height;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    seedParticles();
  }

  function seedParticles() {
    particles.length = 0;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        z: Math.random() * DEPTH,          // depth: near (0) to far (DEPTH)
        baseR: 0.6 + Math.random() * 1.9,
        speed: 0.12 + Math.random() * 0.3,
        drift: (Math.random() - 0.5) * 0.25,
        color: pickColor()
      });
    }
  }

  function pickColor() {
    const colors = [
      'rgba(56,189,248,',   // neon cyan
      'rgba(37,99,235,',    // cobalt
      'rgba(129,140,248,',  // periwinkle glow
      'rgba(165,180,252,'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);
    const midX = W / 2;
    const midY = H / 2;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Drift inward toward the depth "void" and float upward
      p.z -= p.speed;
      if (p.z <= 0) {
        p.z = DEPTH;
        p.x = midX + (Math.random() - 0.5) * W * 0.7;
        p.y = midY + (Math.random() - 0.5) * H * 0.7;
      }
      p.x += p.drift;
      p.y -= p.speed * 0.35;

      // Perspective projection: near = big & bright, far = small & faint
      const perspective = 1 + (1 - p.z / DEPTH) * 2.2;   // scale 1..3.2
      const radius = p.baseR * perspective;
      const alpha = 0.16 + 0.7 * (1 - p.z / DEPTH);

      // Wrap around edges
      if (p.x < -20) p.x = W + 20;
      if (p.x > W + 20) p.x = -20;
      if (p.y < -20) p.y = H + 20;
      if (p.y > H + 20) p.y = -20;

      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color + alpha + ')';
      ctx.shadowBlur = 14;
      ctx.shadowColor = p.color.replace('rgba(', 'rgba(') + (alpha * 0.9) + ')';
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    rafId = requestAnimationFrame(frame);
  }

  resize();
  frame();

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 120);
  });

  // Pause rendering when the hero is off-screen for performance
  if ('IntersectionObserver' in window) {
    const hero = document.getElementById('hero');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting && rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        } else if (entry.isIntersecting && rafId === null) {
          frame();
        }
      });
    }, { threshold: 0 });
    if (hero) io.observe(hero);
  }
}

/* =========================================================================
   7. 3D Animated Engine — Card Perspective Tilt Physics
   ========================================================================= */
function initTiltCards() {
  const tiltable = document.querySelectorAll(
    '.service-card, .case-card, .price-box, .timeline-card, .funnel-stage'
  );

  tiltable.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;   // 0..1
      const py = (e.clientY - rect.top) / rect.height;    // 0..1
      const maxTilt = 9;
      const rotateY = (px - 0.5) * 2 * maxTilt;          // -max..max
      const rotateX = (0.5 - py) * 2 * maxTilt;
      card.style.transform =
        `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px) scale(1.02)`;
      card.style.zIndex = '5';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.zIndex = '';
    });
  });
}

/* =========================================================================
   8. 1-on-1 Strategy Call Booking Engine (#book-call)
   ========================================================================= */
const bookingState = {
  dayOffset: null,
  time: null,
  mode: null
};

const SLOT_TIMES = [
  '11:30 AM', '12:00 PM', '12:30 PM',
  '1:00 PM', '1:30 PM', '2:00 PM',
  '2:30 PM', '3:00 PM', '3:30 PM',
  '4:00 PM', '4:30 PM', '5:00 PM',
  '5:30 PM', '6:00 PM', '6:30 PM',
  '7:00 PM', '7:30 PM', '8:00 PM'
];

function initBookingEngine() {
  const grid = document.getElementById('slotGrid');
  if (!grid) return;

  // Simulate a couple of already-booked slots for realism (deterministic-ish)
  const booked = new Set(['12:00 PM', '6:30 PM']);

  SLOT_TIMES.forEach((slot) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'slot-opt';
    btn.textContent = slot;
    btn.dataset.slot = slot;
    if (booked.has(slot)) {
      btn.classList.add('slot-booked');
      btn.disabled = true;
    } else {
      btn.onclick = () => selectSlot(btn);
    }
    grid.appendChild(btn);
  });
}

function getDateForOffset(offset) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d;
}

function formatDateLabel(d) {
  return d.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });
}

function selectDay(btn, offset) {
  bookingState.dayOffset = offset;
  document.querySelectorAll('.day-opt').forEach((b) => b.classList.remove('active'));
  btn.classList.add('active');

  const dateLine = document.getElementById('selectedDateLine');
  const dateLabel = formatDateLabel(getDateForOffset(offset));
  dateLine.innerHTML = `<span class="date-ok">✓</span> ${dateLabel}`;
  updateSummary();
}

function selectSlot(btn) {
  bookingState.time = btn.dataset.slot;
  document.querySelectorAll('.slot-opt').forEach((b) => b.classList.remove('active'));
  btn.classList.add('active');
  updateSummary();
}

function selectMode(btn) {
  bookingState.mode = btn.dataset.mode;
  document.querySelectorAll('.mode-opt').forEach((b) => b.classList.remove('active'));
  btn.classList.add('active');
  updateSummary();
}

function updateSummary() {
  const sumDay = document.getElementById('sumDay');
  const sumTime = document.getElementById('sumTime');
  const sumMode = document.getElementById('sumMode');

  if (sumDay && bookingState.dayOffset !== null) {
    sumDay.textContent = formatDateLabel(getDateForOffset(bookingState.dayOffset));
  } else if (sumDay) {
    sumDay.textContent = '—';
  }

  if (sumTime) sumTime.textContent = bookingState.time || '—';
  if (sumMode) sumMode.textContent = bookingState.mode || '—';
}

function confirmBooking() {
  if (bookingState.dayOffset === null || !bookingState.time || !bookingState.mode) {
    alert('Please select a day, a time slot, and a call mode to confirm your booking.');
    return;
  }

  const dateLabel = formatDateLabel(getDateForOffset(bookingState.dayOffset));
  const message =
    `Namaste Socialkaroo! ⚡\n\nI'd like to book a FREE 1-on-1 Growth Strategy Call:\n\n` +
    `📅 Day: ${dateLabel}\n` +
    `🕒 Time: ${bookingState.time} (IST)\n` +
    `📞 Call Mode: ${bookingState.mode}\n\n` +
    `Please confirm my slot. Thank you!`;

  const url = `https://wa.me/916267556790?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

/* =========================================================================
   9. 3D Inbound Lead Funnel Simulator
   ========================================================================= */
let funnelRunning = false;

function runFunnelSimulation() {
  const btn = document.getElementById('funnelRunBtn');
  const btnText = document.getElementById('funnelBtnText');
  if (funnelRunning) return;

  funnelRunning = true;
  if (btn) btn.disabled = true;
  if (btnText) btnText.textContent = '⚡ Simulating funnel…';

  const stages = document.querySelectorAll('.funnel-stage');
  const stageTargets = [128, 52, 31, 19];   // decreasing funnel counts
  const stageCounters = [];

  stages.forEach((s, i) => {
    s.classList.remove('stage-lit', 'stage-done');
    const numEl = s.querySelector('.fm-num');
    if (numEl) numEl.textContent = '0';
    stageCounters.push({ el: numEl, target: stageTargets[i], current: 0 });
  });

  const leadCounter = document.getElementById('funnelLeads');
  if (leadCounter) leadCounter.textContent = '0';

  let stageIndex = 0;
  let runningLeads = 0;

  const tick = window.setInterval(() => {
    if (stageIndex >= stageCounters.length) {
      window.clearInterval(tick);
      finishFunnel();
      return;
    }

    const stage = stages[stageIndex];
    const counter = stageCounters[stageIndex];
    stage.classList.add('stage-lit');

    counter.current += Math.ceil(counter.target / 8);
    if (counter.current > counter.target) counter.current = counter.target;
    if (counter.el) counter.el.textContent = counter.current.toLocaleString('en-IN');

    runningLeads += 1 + Math.floor(Math.random() * 3);
    if (leadCounter) leadCounter.textContent = runningLeads.toLocaleString('en-IN');

    if (counter.current >= counter.target) {
      stage.classList.remove('stage-lit');
      stage.classList.add('stage-done');
      stageIndex++;
    }
  }, 260);

  function finishFunnel() {
    if (btn) btn.disabled = false;
    if (btnText) btnText.textContent = '↺ Replay Simulation';
    if (leadCounter) leadCounter.textContent = '19';
    funnelRunning = false;
  }
}

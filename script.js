/**
 * Socialkaroo ⚡ — Agency Interactive Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initCalculator();
  initPricing();
});

/* -------------------------------------------------------------------------
   1. Mobile Navigation & Header Scroll
   ------------------------------------------------------------------------- */
function initNavigation() {
  const toggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  const links = document.querySelectorAll('.nav-link');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });

    // Close mobile nav when link clicked
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('show');
      });
    });
  }

  // Scroll effect on header
  const header = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.4)';
    } else {
      header.style.boxShadow = 'none';
    }
  });
}

/* -------------------------------------------------------------------------
   2. Interactive ROI Calculator
   ------------------------------------------------------------------------- */
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
  
  // If first change from select, sync slider
  if (document.activeElement === select) {
    ticketSlider.value = baseTicket;
    document.getElementById('ticketDisplay').textContent = '₹' + baseTicket.toLocaleString('en-IN');
  }

  const currentTicket = parseInt(ticketSlider.value, 10);
  const conversionRate = parseInt(convSlider.value, 10);

  // Update conversion rate label
  document.getElementById('convDisplay').textContent = `${conversionRate}% (${conversionRate >= 30 ? 'High' : 'Typical for WhatsApp'} close rate)`;

  // Calculations
  const leadsGenerated = baseLeads;
  const customersConverted = Math.max(1, Math.round(leadsGenerated * (conversionRate / 100)));
  const extraRevenue = customersConverted * currentTicket;

  // Render
  document.getElementById('resLeads').textContent = `${leadsGenerated} Leads / mo`;
  document.getElementById('resCustomers').textContent = `${customersConverted} New Customers`;
  document.getElementById('resRevenue').textContent = '₹' + extraRevenue.toLocaleString('en-IN');

  // ROI Multiple vs Tier 2 (₹9,500)
  const tier2Cost = 9500;
  const roiMultiple = (extraRevenue / tier2Cost).toFixed(1);

  const roiSummary = document.getElementById('roiText');
  if (extraRevenue > tier2Cost) {
    roiSummary.innerHTML = `With Socialkaroo <strong>Tier 2 Growth (₹9,500/mo)</strong>, your estimated Return On Investment is <strong style="color:#34d399;">${roiMultiple}x</strong> every month.`;
  } else {
    roiSummary.innerHTML = `With Socialkaroo <strong>Tier 2 Growth (₹9,500/mo)</strong>, you build an organic search asset that continues to bring recurring customers.`;
  }
}

/* -------------------------------------------------------------------------
   3. Pricing Duration Switcher (Monthly vs 90-Day Upfront)
   ------------------------------------------------------------------------- */
function initPricing() {
  // initial load defaults to monthly
}

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

    // 90-day upfront (10% off monthly retainers)
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

/* -------------------------------------------------------------------------
   4. FAQ Accordion Toggle
   ------------------------------------------------------------------------- */
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

/* -------------------------------------------------------------------------
   5. Lead Capture Form & WhatsApp Direct Connect
   ------------------------------------------------------------------------- */
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

    // Construct direct WhatsApp message link
    const waText = encodeURIComponent(
      `Namaste Socialkaroo! ⚡\n\nI just requested a Free Growth Audit:\n• Name: ${name}\n• Business: ${business} (${category})\n• Location: ${location}\n• WhatsApp: ${phone}\n\nPlease share my Google Maps & Inbound Lead Audit!`
    );

    const waUrl = `https://wa.me/919876543210?text=${waText}`;

    // Update the button inside success box
    const waBtn = document.querySelector('#successBox a');
    if (waBtn) {
      waBtn.href = waUrl;
    }
  }, 900);
}

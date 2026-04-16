/* ============================================
   UTILS.JS — Shared helpers
   Raj PG Services
   ============================================ */

// ─── CONTACT INFO ──────────────────────────────
const CONTACT = {
  phone: '+91 9826705696',
  phoneTel: '+919826705696',
  email: 'rajatyadav25009@gmail.com',
  instagram: 'ydv_raj_0143',
  instagramUrl: 'https://www.instagram.com/ydv_raj_0143'
};

const LOCATIONS = [
  'Plot 97/4, Ganesh Nagar, Pardesipura Area, Indore',
  'Plot 103/4, Ganesh Nagar, Pardesipura Area, Indore',
  'Plot 259, Lemon City, Paliya, Near Aurobindo Hospital, Indore'
];

// ─── BADGE CLASS HELPER ────────────────────────
function getOccBadgeClass(type) {
  const map = {
    'Single': 'badge-single',
    'Double': 'badge-double',
    'Triple': 'badge-triple',
    'Budget': 'badge-budget'
  };
  return map[type] || 'badge-single';
}

// ─── STARS RENDERER ────────────────────────────
function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  let stars = '★'.repeat(full);
  if (half) stars += '½';
  return stars;
}

// ─── ROOM CARD HTML GENERATOR ──────────────────
function renderRoomCard(room) {
  const badgeClass = getOccBadgeClass(room.type);
  const amenitiesHtml = room.amenities.slice(0, 4).map(a =>
    `<span class="amenity-pill">${a}</span>`
  ).join('');
  const extraCount = room.amenities.length - 4;
  const extraHtml = extraCount > 0 ? `<span class="amenity-pill">+${extraCount} more</span>` : '';

  return `
    <div class="room-card" data-id="${room.id}" data-type="${room.type}" data-price="${room.price}" data-location="${room.locationShort}" data-rating="${room.rating}">
      <div class="room-card-img">
        <img src="${room.image}" alt="${room.title}" loading="lazy" onerror="this.src='images/placeholder.svg'">
        <div class="room-card-badge">
          <span class="badge ${badgeClass}">${room.type} Occ.</span>
        </div>
        ${room.available ? '<div class="room-card-avail">Available</div>' : ''}
      </div>
      <div class="room-card-body">
        <h3 class="room-card-title">${room.title}</h3>
        <div class="room-card-location">
          <span>📍</span>
          <span>${room.locationShort}</span>
        </div>
        <div class="room-card-amenities">
          ${amenitiesHtml}${extraHtml}
        </div>
        <div class="room-card-footer">
          <div class="room-card-rating">
            <span class="stars">${renderStars(room.rating)}</span>
            <strong>${room.rating.toFixed(1)}</strong>
            <span>(${room.reviews} reviews)</span>
          </div>
          <div class="room-card-price">
            <span class="price-main">₹${room.price.toLocaleString('en-IN')}</span>
            <span class="price-label">/month</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ─── SCROLL TO TOP ─────────────────────────────
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ─── SCROLL TO TOP BUTTON INIT ──────────────────
function initScrollTopBtn() {
  const btn = document.getElementById('scrollTopBtn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', scrollToTop);
}

// ─── FORMAT PRICE ──────────────────────────────
function formatPrice(price) {
  return '₹' + price.toLocaleString('en-IN');
}

// ─── DEBOUNCE ──────────────────────────────────
function debounce(fn, delay = 200) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// ─── Init on DOM ready ─────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initScrollTopBtn();
});

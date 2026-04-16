/* ============================================
   LISTINGS.JS — Filters, sort, card rendering
   Raj PG Services
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('listings-grid')) return;

  // ─── State ──────────────────────────────────
  let filteredRooms = [...rooms];

  // ─── Elements ───────────────────────────────
  const grid = document.getElementById('listings-grid');
  const countEl = document.getElementById('rooms-count');
  const sortSelect = document.getElementById('sort-select');
  const priceSlider = document.getElementById('price-slider');
  const priceDisplay = document.getElementById('price-display');
  const applyBtn = document.getElementById('apply-filters');
  const resetBtn = document.getElementById('reset-filters');
  const locationFilters = document.querySelectorAll('input[name="location"]');
  const typeFilters = document.querySelectorAll('input[name="type"]');
  const amenityFilters = document.querySelectorAll('input[name="amenity"]');

  // ─── Price Slider ────────────────────────────
  if (priceSlider && priceDisplay) {
    priceSlider.addEventListener('input', () => {
      priceDisplay.textContent = `Up to ₹${parseInt(priceSlider.value).toLocaleString('en-IN')}/month`;
    });
    // Init display
    priceDisplay.textContent = `Up to ₹${parseInt(priceSlider.value).toLocaleString('en-IN')}/month`;
  }

  // ─── Apply Filters ───────────────────────────
  function applyFilters() {
    const selectedLocations = [...locationFilters]
      .filter(cb => cb.checked)
      .map(cb => cb.value);

    const selectedTypes = [...typeFilters]
      .filter(cb => cb.checked)
      .map(cb => cb.value);

    const selectedAmenities = [...amenityFilters]
      .filter(cb => cb.checked)
      .map(cb => cb.value);

    const maxPrice = priceSlider ? parseInt(priceSlider.value) : 3500;

    filteredRooms = rooms.filter(room => {
      // Location filter
      if (selectedLocations.length > 0 && !selectedLocations.includes(room.locationShort)) {
        return false;
      }
      // Type filter
      if (selectedTypes.length > 0 && !selectedTypes.includes(room.type)) {
        return false;
      }
      // Price filter
      if (room.price > maxPrice) {
        return false;
      }
      // Amenity filter
      if (selectedAmenities.length > 0) {
        const hasAll = selectedAmenities.every(a => room.amenities.includes(a));
        if (!hasAll) return false;
      }
      return true;
    });

    sortRooms();
    renderGrid();
  }

  // ─── Sort ─────────────────────────────────────
  function sortRooms() {
    if (!sortSelect) return;
    const val = sortSelect.value;
    if (val === 'price-asc') {
      filteredRooms.sort((a, b) => a.price - b.price);
    } else if (val === 'price-desc') {
      filteredRooms.sort((a, b) => b.price - a.price);
    } else if (val === 'rating') {
      filteredRooms.sort((a, b) => b.rating - a.rating);
    } else {
      // recommended — keep original order
      filteredRooms.sort((a, b) => a.id - b.id);
    }
  }

  // ─── Render Grid ──────────────────────────────
  function renderGrid() {
    if (countEl) {
      countEl.textContent = `${filteredRooms.length} room${filteredRooms.length !== 1 ? 's' : ''} found`;
    }

    if (filteredRooms.length === 0) {
      grid.innerHTML = `
        <div class="no-results">
          <div class="no-results-icon">🔍</div>
          <h3>No Rooms Found</h3>
          <p>Try adjusting your filters to see more options.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filteredRooms.map(room => renderRoomCard(room)).join('');

    // Make cards clickable — go to detail page
    grid.querySelectorAll('.room-card').forEach(card => {
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        window.location.href = `detail.html?room=${id}`;
      });
    });
  }

  // ─── Event Listeners ──────────────────────────
  if (applyBtn) {
    applyBtn.addEventListener('click', applyFilters);
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      // Reset checkboxes
      [...locationFilters, ...typeFilters, ...amenityFilters].forEach(cb => cb.checked = false);
      // Reset price
      if (priceSlider) {
        priceSlider.value = priceSlider.max;
        if (priceDisplay) priceDisplay.textContent = `Up to ₹${parseInt(priceSlider.max).toLocaleString('en-IN')}/month`;
      }
      // Reset sort
      if (sortSelect) sortSelect.value = 'recommended';
      // Re-render all
      filteredRooms = [...rooms];
      renderGrid();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      sortRooms();
      renderGrid();
    });
  }

  // ─── Initial render ────────────────────────────
  renderGrid();
});

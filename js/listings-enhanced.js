/* ============================================
   LISTINGS-ENHANCED.JS
   Raj PG Services — Enhanced Filter Experience
   Live filtering · Chips · Search · View Toggle · Mobile Drawer
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('listings-grid')) return;

  // ─── State ──────────────────────────────────
  let filteredRooms = [...rooms];
  let currentView = 'grid';
  let minRating = 0;
  let searchQuery = '';

  // ─── Elements ───────────────────────────────
  const grid         = document.getElementById('listings-grid');
  const countEl      = document.getElementById('rooms-count');
  const sortSelect   = document.getElementById('sort-select');
  const priceSlider  = document.getElementById('price-slider');
  const priceDisplay = document.getElementById('price-display');
  const sliderFill   = document.getElementById('slider-fill');
  const resetBtn     = document.getElementById('reset-filters');
  const searchInput  = document.getElementById('search-input');
  const searchClear  = document.getElementById('search-clear');

  const filterChipsEl    = document.getElementById('filter-chips');
  const activeFiltersBar = document.getElementById('active-filters-bar');
  const filterBadge      = document.getElementById('filter-badge');
  const clearAllBtn      = document.getElementById('clear-all-btn');

  const gridViewBtn      = document.getElementById('grid-view-btn');
  const listViewBtn      = document.getElementById('list-view-btn');

  const mobileFilterBtn  = document.getElementById('mobile-filter-trigger');
  const filterOverlay    = document.getElementById('filter-overlay');
  const filterDrawer     = document.getElementById('filter-drawer');
  const drawerBody       = document.getElementById('filter-drawer-body');
  const drawerClose      = document.getElementById('drawer-close');
  const drawerReset      = document.getElementById('drawer-reset');
  const drawerApply      = document.getElementById('drawer-apply');

  const ratingButtons    = document.querySelectorAll('.rating-btn');

  const locationFilters  = document.querySelectorAll('input[name="location"]');
  const typeFilters      = document.querySelectorAll('input[name="type"]');
  const amenityFilters   = document.querySelectorAll('input[name="amenity"]');

  // ─── Slider Fill ────────────────────────────
  function updateSliderFill() {
    if (!priceSlider || !sliderFill) return;
    const min = parseInt(priceSlider.min);
    const max = parseInt(priceSlider.max);
    const val = parseInt(priceSlider.value);
    const pct = ((val - min) / (max - min)) * 100;
    sliderFill.style.width = pct + '%';
  }

  if (priceSlider) {
    priceSlider.addEventListener('input', () => {
      const v = parseInt(priceSlider.value).toLocaleString('en-IN');
      priceDisplay.textContent = `Up to ₹${v}`;
      updateSliderFill();
      applyFilters();
    });
    updateSliderFill();
  }

  // ─── Search ─────────────────────────────────
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      searchQuery = searchInput.value.trim().toLowerCase();
      searchClear.style.display = searchQuery ? 'block' : 'none';
      applyFilters();
    });
  }

  if (searchClear) {
    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      searchClear.style.display = 'none';
      searchInput.focus();
      applyFilters();
    });
  }

  // ─── Rating Buttons ──────────────────────────
  ratingButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      ratingButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      minRating = parseFloat(btn.dataset.rating);
      applyFilters();
    });
  });

  // ─── Live Filter on Checkbox Change ──────────
  [...locationFilters, ...typeFilters, ...amenityFilters].forEach(cb => {
    cb.addEventListener('change', applyFilters);
  });

  // ─── Sort Change ─────────────────────────────
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      sortRooms();
      renderGrid();
    });
  }

  // ─── Apply Filters ───────────────────────────
  function applyFilters() {
    const selectedLocations = [...locationFilters].filter(cb => cb.checked).map(cb => cb.value);
    const selectedTypes     = [...typeFilters].filter(cb => cb.checked).map(cb => cb.value);
    const selectedAmenities = [...amenityFilters].filter(cb => cb.checked).map(cb => cb.value);
    const maxPrice = priceSlider ? parseInt(priceSlider.value) : 3500;

    filteredRooms = rooms.filter(room => {
      if (selectedLocations.length > 0 && !selectedLocations.includes(room.locationShort)) return false;
      if (selectedTypes.length > 0 && !selectedTypes.includes(room.type)) return false;
      if (room.price > maxPrice) return false;
      if (selectedAmenities.length > 0 && !selectedAmenities.every(a => room.amenities.includes(a))) return false;
      if (minRating > 0 && room.rating < minRating) return false;
      if (searchQuery) {
        const haystack = `${room.title} ${room.location} ${room.type} ${room.amenities.join(' ')}`.toLowerCase();
        if (!haystack.includes(searchQuery)) return false;
      }
      return true;
    });

    sortRooms();
    renderGrid();
    updateChips();
    updateFilterBadge();
  }

  // ─── Sort ─────────────────────────────────────
  function sortRooms() {
    if (!sortSelect) return;
    const val = sortSelect.value;
    if (val === 'price-asc')  filteredRooms.sort((a, b) => a.price - b.price);
    else if (val === 'price-desc') filteredRooms.sort((a, b) => b.price - a.price);
    else if (val === 'rating')     filteredRooms.sort((a, b) => b.rating - a.rating);
    else                           filteredRooms.sort((a, b) => a.id - b.id);
  }

  // ─── Render Grid ──────────────────────────────
  function renderGrid() {
    if (countEl) {
      const n = filteredRooms.length;
      countEl.textContent = `${n} room${n !== 1 ? 's' : ''} found`;
    }

    if (filteredRooms.length === 0) {
      grid.innerHTML = `
        <div class="no-results">
          <div class="no-results-icon">🔍</div>
          <h3>No Rooms Found</h3>
          <p>Try adjusting your filters or search term to see more results.</p>
          <div class="no-results-actions">
            <button class="btn btn-primary" onclick="document.getElementById('reset-filters').click()">Reset Filters</button>
            <a href="contact.html" class="btn btn-outline">Contact Us</a>
          </div>
        </div>`;
      return;
    }

    grid.innerHTML = filteredRooms.map((room, i) => renderRoomCard(room, i)).join('');

    grid.querySelectorAll('.room-card').forEach(card => {
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => {
        window.location.href = `detail.html?room=${card.dataset.id}`;
      });
    });
  }

  // ─── Active Filter Chips ──────────────────────
  function updateChips() {
    const chips = [];
    const maxPrice = priceSlider ? parseInt(priceSlider.value) : 3500;

    [...locationFilters].filter(cb => cb.checked).forEach(cb => {
      chips.push({ label: cb.value === 'Aurobindo' ? 'Near Aurobindo' : 'Pardesipura', key: 'location', value: cb.value });
    });

    [...typeFilters].filter(cb => cb.checked).forEach(cb => {
      chips.push({ label: cb.value + ' Room', key: 'type', value: cb.value });
    });

    [...amenityFilters].filter(cb => cb.checked).forEach(cb => {
      chips.push({ label: cb.value, key: 'amenity', value: cb.value });
    });

    if (maxPrice < 3500) {
      chips.push({ label: `Max ₹${maxPrice.toLocaleString('en-IN')}`, key: 'price', value: maxPrice });
    }

    if (minRating > 0) {
      chips.push({ label: `Rating ${minRating}+`, key: 'rating', value: minRating });
    }

    if (searchQuery) {
      chips.push({ label: `"${searchQuery}"`, key: 'search', value: searchQuery });
    }

    filterChipsEl.innerHTML = chips.map(c => `
      <span class="filter-chip" data-key="${c.key}" data-value="${c.value}">
        ${c.label}
        <button class="chip-remove" data-key="${c.key}" data-value="${c.value}" aria-label="Remove filter">✕</button>
      </span>
    `).join('');

    activeFiltersBar.style.display = chips.length > 0 ? 'block' : 'none';

    // Remove chip on click
    filterChipsEl.querySelectorAll('.chip-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const key = btn.dataset.key;
        const val = btn.dataset.value;
        removeFilter(key, val);
      });
    });
  }

  function removeFilter(key, value) {
    if (key === 'location') {
      const cb = [...locationFilters].find(c => c.value === value);
      if (cb) { cb.checked = false; }
    } else if (key === 'type') {
      const cb = [...typeFilters].find(c => c.value === value);
      if (cb) { cb.checked = false; }
    } else if (key === 'amenity') {
      const cb = [...amenityFilters].find(c => c.value === value);
      if (cb) { cb.checked = false; }
    } else if (key === 'price') {
      priceSlider.value = priceSlider.max;
      priceDisplay.textContent = `Up to ₹${parseInt(priceSlider.max).toLocaleString('en-IN')}`;
      updateSliderFill();
    } else if (key === 'rating') {
      minRating = 0;
      ratingButtons.forEach(b => b.classList.remove('active'));
      document.querySelector('.rating-btn[data-rating="0"]').classList.add('active');
    } else if (key === 'search') {
      searchInput.value = '';
      searchQuery = '';
      searchClear.style.display = 'none';
    }
    applyFilters();
  }

  // ─── Filter Badge (Mobile) ────────────────────
  function updateFilterBadge() {
    const checked = [...locationFilters, ...typeFilters, ...amenityFilters].filter(cb => cb.checked).length;
    const maxPrice = priceSlider ? parseInt(priceSlider.value) : 3500;
    const priceActive = maxPrice < 3500 ? 1 : 0;
    const ratingActive = minRating > 0 ? 1 : 0;
    const total = checked + priceActive + ratingActive;
    filterBadge.textContent = total;
    filterBadge.style.display = total > 0 ? 'inline-flex' : 'none';
  }

  // ─── Reset ────────────────────────────────────
  function resetAll() {
    [...locationFilters, ...typeFilters, ...amenityFilters].forEach(cb => cb.checked = false);
    if (priceSlider) {
      priceSlider.value = priceSlider.max;
      priceDisplay.textContent = `Up to ₹${parseInt(priceSlider.max).toLocaleString('en-IN')}`;
      updateSliderFill();
    }
    if (sortSelect) sortSelect.value = 'recommended';
    minRating = 0;
    searchQuery = '';
    if (searchInput) { searchInput.value = ''; }
    if (searchClear) { searchClear.style.display = 'none'; }
    ratingButtons.forEach(b => b.classList.remove('active'));
    const anyBtn = document.querySelector('.rating-btn[data-rating="0"]');
    if (anyBtn) anyBtn.classList.add('active');
    filteredRooms = [...rooms];
    renderGrid();
    updateChips();
    updateFilterBadge();
  }

  if (resetBtn) resetBtn.addEventListener('click', resetAll);
  if (clearAllBtn) clearAllBtn.addEventListener('click', resetAll);

  // ─── View Toggle ──────────────────────────────
  if (gridViewBtn && listViewBtn) {
    gridViewBtn.addEventListener('click', () => {
      currentView = 'grid';
      grid.classList.remove('list-view');
      gridViewBtn.classList.add('active');
      listViewBtn.classList.remove('active');
    });
    listViewBtn.addEventListener('click', () => {
      currentView = 'list';
      grid.classList.add('list-view');
      listViewBtn.classList.add('active');
      gridViewBtn.classList.remove('active');
    });
  }

  // ─── Mobile Drawer ────────────────────────────
  function openDrawer() {
    // Clone sidebar content into drawer
    const sidebar = document.getElementById('sidebar');
    const clone = sidebar.cloneNode(true);
    clone.style.display = 'block';
    clone.removeAttribute('id');
    clone.classList.remove('enhanced-sidebar', 'sidebar');
    clone.style.padding = '0';
    clone.style.boxShadow = 'none';
    clone.style.border = 'none';
    drawerBody.innerHTML = '';
    // Remove the header from clone (drawer has its own)
    const hdr = clone.querySelector('.sidebar-header');
    if (hdr) hdr.remove();
    drawerBody.appendChild(clone);

    // Wire up drawer inputs to mirror sidebar state
    syncDrawerFromSidebar();
    wireDrawerInputs();

    filterOverlay.classList.add('open');
    filterDrawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    filterOverlay.classList.remove('open');
    filterDrawer.classList.remove('open');
    document.body.style.overflow = '';
  }

  function syncDrawerFromSidebar() {
    // Mirror checkbox states
    drawerBody.querySelectorAll('input[type="checkbox"]').forEach(drawerCb => {
      const original = document.querySelector(`#sidebar input[name="${drawerCb.name}"][value="${drawerCb.value}"]`);
      if (original) drawerCb.checked = original.checked;
    });
    // Mirror price slider
    const drawerSlider = drawerBody.querySelector('#price-slider, .range-slider');
    const drawerPriceDisplay = drawerBody.querySelector('#price-display, .price-current-display');
    if (drawerSlider && priceSlider) {
      drawerSlider.value = priceSlider.value;
      if (drawerPriceDisplay) drawerPriceDisplay.textContent = priceDisplay.textContent;
    }
    // Mirror rating
    const drawerRatingBtns = drawerBody.querySelectorAll('.rating-btn');
    drawerRatingBtns.forEach(b => {
      b.classList.toggle('active', parseFloat(b.dataset.rating) === minRating);
    });
  }

  function wireDrawerInputs() {
    // Live update price
    const drawerSlider = drawerBody.querySelector('.range-slider');
    const drawerPriceDisplay = drawerBody.querySelector('.price-current-display');
    const drawerSliderFill = drawerBody.querySelector('.slider-fill');
    if (drawerSlider) {
      const updateFill = () => {
        if (drawerSliderFill) {
          const min = parseInt(drawerSlider.min), max = parseInt(drawerSlider.max);
          const pct = ((parseInt(drawerSlider.value) - min) / (max - min)) * 100;
          drawerSliderFill.style.width = pct + '%';
        }
        if (drawerPriceDisplay) {
          drawerPriceDisplay.textContent = `Up to ₹${parseInt(drawerSlider.value).toLocaleString('en-IN')}`;
        }
      };
      drawerSlider.addEventListener('input', updateFill);
      updateFill();
    }
  }

  function applyDrawerFilters() {
    // Copy drawer state back to sidebar
    drawerBody.querySelectorAll('input[type="checkbox"]').forEach(drawerCb => {
      const original = document.querySelector(`#sidebar input[name="${drawerCb.name}"][value="${drawerCb.value}"]`);
      if (original) original.checked = drawerCb.checked;
    });
    const drawerSlider = drawerBody.querySelector('.range-slider');
    if (drawerSlider && priceSlider) {
      priceSlider.value = drawerSlider.value;
      priceDisplay.textContent = `Up to ₹${parseInt(drawerSlider.value).toLocaleString('en-IN')}`;
      updateSliderFill();
    }
    const activeRatingBtn = drawerBody.querySelector('.rating-btn.active');
    if (activeRatingBtn) {
      minRating = parseFloat(activeRatingBtn.dataset.rating);
      ratingButtons.forEach(b => b.classList.toggle('active', parseFloat(b.dataset.rating) === minRating));
    }
    applyFilters();
    closeDrawer();
  }

  if (mobileFilterBtn) mobileFilterBtn.addEventListener('click', openDrawer);
  if (filterOverlay)   filterOverlay.addEventListener('click', closeDrawer);
  if (drawerClose)     drawerClose.addEventListener('click', closeDrawer);
  if (drawerReset)     drawerReset.addEventListener('click', () => { resetAll(); closeDrawer(); });
  if (drawerApply)     drawerApply.addEventListener('click', applyDrawerFilters);

  // ─── Initial render ────────────────────────────
  renderGrid();
  updateChips();
  updateFilterBadge();
});

/* ============================================
   CONTACT.JS — Form validation, success message
   Raj PG Services
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('enquiry-form');
  if (!form) return;

  const successMsg = document.getElementById('success-message');

  // ─── Validators ──────────────────────────────
  function validateName(val) {
    return val.trim().length >= 2;
  }

  function validateEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  }

  function validatePhone(val) {
    // Allow 10-digit Indian numbers or with +91 prefix
    return /^(\+91)?[6-9]\d{9}$/.test(val.trim().replace(/[\s-]/g, ''));
  }

  function validateRequired(val) {
    return val.trim().length > 0;
  }

  // ─── Show/hide error ─────────────────────────
  function setError(fieldId, show) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(fieldId + '-error');
    if (!field) return;
    if (show) {
      field.classList.add('error');
      if (errorEl) errorEl.classList.add('visible');
    } else {
      field.classList.remove('error');
      if (errorEl) errorEl.classList.remove('visible');
    }
  }

  // ─── Real-time field validation ──────────────
  function setupRealtime(fieldId, validator) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    field.addEventListener('blur', () => {
      setError(fieldId, !validator(field.value));
    });
    field.addEventListener('input', () => {
      if (field.classList.contains('error')) {
        if (validator(field.value)) setError(fieldId, false);
      }
    });
  }

  setupRealtime('name', validateName);
  setupRealtime('email', validateEmail);
  setupRealtime('phone', validatePhone);
  setupRealtime('location', validateRequired);
  setupRealtime('room-type', validateRequired);

  // ─── Submit handler ───────────────────────────
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameVal = document.getElementById('name')?.value || '';
    const emailVal = document.getElementById('email')?.value || '';
    const phoneVal = document.getElementById('phone')?.value || '';
    const locationVal = document.getElementById('location')?.value || '';
    const roomTypeVal = document.getElementById('room-type')?.value || '';

    let isValid = true;

    if (!validateName(nameVal)) {
      setError('name', true);
      isValid = false;
    } else {
      setError('name', false);
    }

    if (!validateEmail(emailVal)) {
      setError('email', true);
      isValid = false;
    } else {
      setError('email', false);
    }

    if (!validatePhone(phoneVal)) {
      setError('phone', true);
      isValid = false;
    } else {
      setError('phone', false);
    }

    if (!validateRequired(locationVal)) {
      setError('location', true);
      isValid = false;
    } else {
      setError('location', false);
    }

    if (!validateRequired(roomTypeVal)) {
      setError('room-type', true);
      isValid = false;
    } else {
      setError('room-type', false);
    }

    if (!isValid) return;

    // Show success
    form.style.display = 'none';
    if (successMsg) {
      successMsg.classList.add('visible');
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Reset form (in background)
    setTimeout(() => {
      form.reset();
    }, 300);
  });

  // ─── Send Another button ──────────────────────
  const sendAnotherBtn = document.getElementById('send-another');
  if (sendAnotherBtn) {
    sendAnotherBtn.addEventListener('click', () => {
      if (successMsg) successMsg.classList.remove('visible');
      form.style.display = '';
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

});

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-portal');
  if (!form) return;

  const requiredInputs = Array.from(form.querySelectorAll('[required]'));

  const validateInput = (input) => {
    const group = input.closest('.form-group');
    if (!group) return true;

    const value = String(input.value ?? '').trim();
    const isEmail = input.type === 'email';
    const emailValid = !isEmail || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const valid = value.length > 0 && input.checkValidity() && emailValid;

    group.classList.toggle('has-error', !valid);
    if (valid) {
      input.removeAttribute('aria-invalid');
    } else {
      input.setAttribute('aria-invalid', 'true');
    }
    return valid;
  };

  form.addEventListener('submit', (event) => {
    let firstInvalid = null;
    requiredInputs.forEach((input) => {
      if (!validateInput(input) && !firstInvalid) firstInvalid = input;
    });

    if (firstInvalid) {
      event.preventDefault();
      const group = firstInvalid.closest('.form-group');
      const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (group) group.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
      firstInvalid.focus({ preventScroll: true });
    }
    // If valid, let the browser POST directly to Web3Forms.
  });

  form.querySelectorAll('input, textarea').forEach((input) => {
    input.addEventListener('input', () => {
      const group = input.closest('.form-group');
      if (group && group.classList.contains('has-error')) validateInput(input);
    });
  });

  // Enable custom inline validation only after handlers are registered.
  // Without JavaScript the browser's native required-field checks still apply.
  form.noValidate = true;
});

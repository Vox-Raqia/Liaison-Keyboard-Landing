/**
 * VanguardPreSignupForm
 *
 * Renders a self-contained Vanguard pre-signup form into the provided container.
 * Fields: name (required), email (required), reason (required, max 1000 chars).
 *
 * Success: "If your pre-signup aligns with our early cohort, we'll send you the full Vanguard application."
 * Duplicate: "You've already pre-signed up for the Vanguard."
 */

import { createClient } from '../lib/supabase.js';

/** @type {number} */
const MAX_REASON_LENGTH = 1000;

/**
 * @param {string} containerId - The DOM element ID to render into.
 */
export function initVanguardPreSignupForm(containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    throw new Error(`Container #${containerId} not found.`);
  }

  const client = createClient();
  /** @type {'idle'|'submitting'|'success'|'error'} */
  let state = 'idle';
  /** @type {string} */
  let errorMessage = '';

  function setState(nextState) {
    state = nextState;
    render();
  }

  function setError(message) {
    errorMessage = message;
    setState('error');
  }

  function clearError() {
    errorMessage = '';
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  /**
   * @param {{ email: string, name: string, reason: string|null }} formData
   * @returns {Promise<{ ok: boolean, duplicate?: boolean, error?: string, data?: any }>}
   */
  async function submitForm(formData) {
    const { data, error } = await client
      .from('vanguard_presignups')
      .insert([formData])
      .select('id')
      .single();

    if (error) {
      const message = error.message || '';
      if (/duplicate|unique/i.test(message) || error.code === '23505') {
        return { ok: false, duplicate: true };
      }
      return { ok: false, error: message || 'Unable to pre-sign up right now.' };
    }

    return { ok: true, data };
  }

  function render() {
    const isSubmitting = state === 'submitting';
    const isSuccess = state === 'success';
    const isError = state === 'error';

    container.innerHTML = '';

    if (isSuccess) {
      const wrapper = document.createElement('div');
      wrapper.className =
        'rounded-2xl border border-emerald-400/30 bg-emerald-400/[0.06] p-8 text-left';
      wrapper.innerHTML = `
        <h2 class="text-2xl font-black text-emerald-300">You're on the list.</h2>
        <p class="mt-3 text-white/70">If your pre-signup aligns with our early cohort, we'll send you the full Vanguard application.</p>
      `;
      container.appendChild(wrapper);
      return;
    }

    const form = document.createElement('form');
    form.novalidate = true;
    form.className = 'flex flex-col gap-4';
    form.setAttribute('data-vanguard-presignup-form', '');

    // Name
    const nameGroup = document.createElement('div');
    nameGroup.className = 'flex flex-col gap-1.5';

    const nameLabel = document.createElement('label');
    nameLabel.className = 'text-sm font-medium text-white/80';
    nameLabel.htmlFor = 'vanguard-name';
    nameLabel.textContent = 'Name';
    nameGroup.appendChild(nameLabel);

    const nameInput = document.createElement('input');
    nameInput.id = 'vanguard-name';
    nameInput.type = 'text';
    nameInput.required = true;
    nameInput.placeholder = 'Your name';
    nameInput.className =
      'rounded-2xl border border-white/15 bg-white/[0.04] px-5 py-4 text-base text-white placeholder-white/30 outline-none transition-colors focus:border-sky-400/60 focus:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-60';
    nameInput.disabled = isSubmitting;
    nameGroup.appendChild(nameInput);

    form.appendChild(nameGroup);

    // Email
    const emailGroup = document.createElement('div');
    emailGroup.className = 'flex flex-col gap-1.5';

    const emailLabel = document.createElement('label');
    emailLabel.className = 'text-sm font-medium text-white/80';
    emailLabel.htmlFor = 'vanguard-email';
    emailLabel.textContent = 'Email';
    emailGroup.appendChild(emailLabel);

    const emailInput = document.createElement('input');
    emailInput.id = 'vanguard-email';
    emailInput.type = 'email';
    emailInput.inputMode = 'email';
    emailInput.autocomplete = 'email';
    emailInput.required = true;
    emailInput.placeholder = 'you@example.com';
    emailInput.className =
      'rounded-2xl border border-white/15 bg-white/[0.04] px-5 py-4 text-base text-white placeholder-white/30 outline-none transition-colors focus:border-sky-400/60 focus:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-60';
    emailInput.disabled = isSubmitting;
    emailGroup.appendChild(emailInput);

    form.appendChild(emailGroup);

    // Reason
    const reasonGroup = document.createElement('div');
    reasonGroup.className = 'flex flex-col gap-1.5';

    const reasonLabel = document.createElement('label');
    reasonLabel.className = 'text-sm font-medium text-white/80';
    reasonLabel.htmlFor = 'vanguard-reason';
    reasonLabel.textContent = 'Why do you want to join the Vanguard?';
    reasonGroup.appendChild(reasonLabel);

    const reasonInput = document.createElement('textarea');
    reasonInput.id = 'vanguard-reason';
    reasonInput.rows = 4;
    reasonInput.required = true;
    reasonInput.maxLength = MAX_REASON_LENGTH;
    reasonInput.placeholder = 'Tell us why you belong in the founding cohort...';
    reasonInput.className =
      'rounded-2xl border border-white/15 bg-white/[0.04] px-5 py-4 text-base text-white placeholder-white/30 outline-none transition-colors focus:border-sky-400/60 focus:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-60 resize-y';
    reasonInput.disabled = isSubmitting;
    reasonGroup.appendChild(reasonInput);

    const reasonCounter = document.createElement('span');
    reasonCounter.className = 'text-xs text-white/40 text-right';
    reasonCounter.setAttribute('data-vanguard-reason-counter', '');
    reasonCounter.textContent = `0 / ${MAX_REASON_LENGTH}`;
    reasonGroup.appendChild(reasonCounter);

    form.appendChild(reasonGroup);

    // Submit
    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.disabled = isSubmitting;
    submitBtn.className =
      'inline-flex items-center justify-center rounded-2xl bg-sky-500 px-8 py-4 text-base font-bold text-black shadow-[0_0_40px_rgba(56,189,248,0.35)] hover:bg-sky-400 hover:shadow-[0_0_60px_rgba(56,189,248,0.5)] active:scale-[0.98] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60';
    submitBtn.textContent = isSubmitting ? 'Submitting...' : 'Pre-Sign Up';
    form.appendChild(submitBtn);

    // Status message
    const messageEl = document.createElement('p');
    messageEl.className = 'min-h-[1.25rem] text-sm';
    messageEl.setAttribute('role', 'status');
    messageEl.setAttribute('aria-live', 'polite');

    if (isError && errorMessage) {
      messageEl.textContent = errorMessage;
      messageEl.className += ' text-red-400';
    } else if (!isError && !isSuccess) {
      messageEl.className += ' text-white/50';
    }

    form.appendChild(messageEl);

    container.appendChild(form);

    // Wire events
    reasonInput.addEventListener('input', () => {
      const len = reasonInput.value.length;
      reasonCounter.textContent = `${len} / ${MAX_REASON_LENGTH}`;
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      clearError();

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const reason = reasonInput.value.trim() || null;

      if (!name) {
        setError('Please enter your name.');
        nameInput.focus();
        return;
      }

      if (!isValidEmail(email)) {
        setError('Enter a valid email address.');
        emailInput.focus();
        return;
      }

      if (!reason) {
        setError('Please tell us why you want to join the Vanguard.');
        reasonInput.focus();
        return;
      }

      setState('submitting');
      render();

      try {
        const result = await submitForm({ email, name, reason });
        if (result.ok) {
          setState('success');
        } else if (result.duplicate) {
          setError("You've already pre-signed up for the Vanguard.");
        } else {
          setError(result.error || 'Something went wrong. Please try again.');
        }
      } catch {
        setError('Network error. Check your connection and try again.');
      }
    });
  }

  render();
}

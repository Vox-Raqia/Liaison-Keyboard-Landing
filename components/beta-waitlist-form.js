/**
 * BetaWaitlistForm
 *
 * Renders a self-contained beta waitlist form into the provided container.
 * Fields: email (required), interest_note (optional, max 500 chars).
 *
 * Success: "You've been added to the beta waitlist!"
 * Duplicate: "You're already on the list."
 */

import { createClient } from '../lib/supabase.js';

/** @type {number} */
const MAX_NOTE_LENGTH = 500;

/**
 * @param {string} containerId - The DOM element ID to render into.
 */
export function initBetaWaitlistForm(containerId) {
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
    return /^[^\s@]+@[^@[:space:]]+\.[^@[:space:]]+$/.test(value);
  }

  /**
   * @param {{ email: string, interest_note: string|null }} formData
   * @returns {Promise<{ ok: boolean, duplicate?: boolean, error?: string, data?: any }>}
   */
  async function submitForm(formData) {
    const { data, error } = await client
      .from('beta_waitlist')
      .insert([formData])
      .select('id')
      .single();

    if (error) {
      const message = error.message || '';
      if (/duplicate|unique/i.test(message) || error.code === '23505') {
        return { ok: false, duplicate: true };
      }
      return { ok: false, error: message || 'Unable to join the waitlist right now.' };
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
        <h2 class="text-2xl font-black text-emerald-300">You've been added to the beta waitlist!</h2>
        <p class="mt-3 text-white/70">We'll be in touch when beta spots open.</p>
      `;
      container.appendChild(wrapper);
      return;
    }

    const form = document.createElement('form');
    form.novalidate = true;
    form.className = 'flex flex-col gap-4';
    form.setAttribute('data-beta-waitlist-form', '');

    // Email
    const emailGroup = document.createElement('div');
    emailGroup.className = 'flex flex-col gap-1.5';

    const emailLabel = document.createElement('label');
    emailLabel.className = 'text-sm font-medium text-white/80';
    emailLabel.htmlFor = 'beta-email';
    emailLabel.textContent = 'Email';
    emailGroup.appendChild(emailLabel);

    const emailInput = document.createElement('input');
    emailInput.id = 'beta-email';
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

    // Interest note
    const noteGroup = document.createElement('div');
    noteGroup.className = 'flex flex-col gap-1.5';

    const noteLabel = document.createElement('label');
    noteLabel.className = 'text-sm font-medium text-white/80';
    noteLabel.htmlFor = 'beta-note';
    noteLabel.textContent = 'What interests you? (optional)';
    noteGroup.appendChild(noteLabel);

    const noteInput = document.createElement('textarea');
    noteInput.id = 'beta-note';
    noteInput.rows = 3;
    noteInput.maxLength = MAX_NOTE_LENGTH;
    noteInput.placeholder = 'Tell us a little about why you want early access...';
    noteInput.className =
      'rounded-2xl border border-white/15 bg-white/[0.04] px-5 py-4 text-base text-white placeholder-white/30 outline-none transition-colors focus:border-sky-400/60 focus:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-60 resize-y';
    noteInput.disabled = isSubmitting;
    noteGroup.appendChild(noteInput);

    const noteCounter = document.createElement('span');
    noteCounter.className = 'text-xs text-white/40 text-right';
    noteCounter.setAttribute('data-beta-note-counter', '');
    noteCounter.textContent = '0 / 500';
    noteGroup.appendChild(noteCounter);

    form.appendChild(noteGroup);

    // Submit
    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.disabled = isSubmitting;
    submitBtn.className =
      'inline-flex items-center justify-center rounded-2xl bg-sky-500 px-8 py-4 text-base font-bold text-black shadow-[0_0_40px_rgba(56,189,248,0.35)] hover:bg-sky-400 hover:shadow-[0_0_60px_rgba(56,189,248,0.5)] active:scale-[0.98] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60';
    submitBtn.textContent = isSubmitting ? 'Joining...' : 'Join the Beta';
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
    noteInput.addEventListener('input', () => {
      const len = noteInput.value.length;
      noteCounter.textContent = `${len} / ${MAX_NOTE_LENGTH}`;
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      clearError();

      const email = emailInput.value.trim();
      const interestNote = noteInput.value.trim() || null;

      if (!isValidEmail(email)) {
        setError('Enter a valid email address.');
        emailInput.focus();
        return;
      }

      setState('submitting');
      render();

      try {
        const result = await submitForm({ email, interest_note });
        if (result.ok) {
          setState('success');
        } else if (result.duplicate) {
          setError("You're already on the list.");
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

/**
 * VanguardApplicationForm
 *
 * Renders a self-contained Vanguard application form into the provided container.
 * Fields: name (required), email (required), background (required),
 *         communication_philosophy (required), fit_reason (required),
 *         early_insight (required).
 *
 * Success: "Your application has been received. We review applications in the order received."
 */

import { createClient } from '../lib/supabase.js';

/** @type {readonly Array<{id: string, label: string}>} */
const REQUIRED_TEXTAREAS = [
  { id: 'vanguard-app-background', label: 'Background' },
  { id: 'vanguard-app-philosophy', label: 'Describe how you think about communication.' },
  { id: 'vanguard-app-fit', label: 'What makes you a strong fit for a founding cohort?' },
  { id: 'vanguard-app-insight', label: 'What\u2019s one insight you\u2019d want to contribute early?' },
];

/**
 * @param {string} containerId - The DOM element ID to render into.
 */
export function initVanguardApplicationForm(containerId) {
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
   * @param {{ email: string, name: string, background: string, communication_philosophy: string, fit_reason: string, early_insight: string }} formData
   * @returns {Promise<{ ok: boolean, error?: string, data?: any }>}
   */
  async function submitForm(formData) {
    const { data, error } = await client
      .from('vanguard_applications')
      .insert([formData])
      .select('id')
      .single();

    if (error) {
      return { ok: false, error: error.message || 'Unable to submit application right now.' };
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
        <h2 class="text-2xl font-black text-emerald-300">Application received.</h2>
        <p class="mt-3 text-white/70">Your application has been received. We review applications in the order received.</p>
      `;
      container.appendChild(wrapper);
      return;
    }

    const form = document.createElement('form');
    form.novalidate = true;
    form.className = 'flex flex-col gap-5';
    form.setAttribute('data-vanguard-application-form', '');

    // Name
    const nameGroup = document.createElement('div');
    nameGroup.className = 'flex flex-col gap-1.5';

    const nameLabel = document.createElement('label');
    nameLabel.className = 'text-sm font-medium text-white/80';
    nameLabel.htmlFor = 'vanguard-app-name';
    nameLabel.textContent = 'Name';
    nameGroup.appendChild(nameLabel);

    const nameInput = document.createElement('input');
    nameInput.id = 'vanguard-app-name';
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
    emailLabel.htmlFor = 'vanguard-app-email';
    emailLabel.textContent = 'Email';
    emailGroup.appendChild(emailLabel);

    const emailInput = document.createElement('input');
    emailInput.id = 'vanguard-app-email';
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

    // Textareas
    REQUIRED_TEXTAREAS.forEach((field) => {
      const group = document.createElement('div');
      group.className = 'flex flex-col gap-1.5';

      const label = document.createElement('label');
      label.className = 'text-sm font-medium text-white/80';
      label.htmlFor = field.id;
      label.textContent = field.label;
      group.appendChild(label);

      const textarea = document.createElement('textarea');
      textarea.id = field.id;
      textarea.rows = 4;
      textarea.required = true;
      textarea.placeholder = field.label;
      textarea.className =
        'rounded-2xl border border-white/15 bg-white/[0.04] px-5 py-4 text-base text-white placeholder-white/30 outline-none transition-colors focus:border-sky-400/60 focus:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-60 resize-y';
      textarea.disabled = isSubmitting;
      group.appendChild(textarea);

      form.appendChild(group);
    });

    // Submit
    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.disabled = isSubmitting;
    submitBtn.className =
      'inline-flex items-center justify-center rounded-2xl bg-amber-400 px-8 py-4 text-base font-bold text-black shadow-[0_0_40px_rgba(251,191,36,0.35)] hover:bg-amber-300 hover:shadow-[0_0_60px_rgba(251,191,36,0.5)] active:scale-[0.98] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60';
    submitBtn.textContent = isSubmitting ? 'Submitting...' : 'Submit Application';
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
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      clearError();

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();

      const background = document.getElementById('vanguard-app-background').value.trim();
      const communication_philosophy = document.getElementById('vanguard-app-philosophy').value.trim();
      const fit_reason = document.getElementById('vanguard-app-fit').value.trim();
      const early_insight = document.getElementById('vanguard-app-insight').value.trim();

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

      if (!background) {
        setError('Please describe your background.');
        document.getElementById('vanguard-app-background').focus();
        return;
      }

      if (!communication_philosophy) {
        setError('Please describe how you think about communication.');
        document.getElementById('vanguard-app-philosophy').focus();
        return;
      }

      if (!fit_reason) {
        setError('Please explain what makes you a strong fit.');
        document.getElementById('vanguard-app-fit').focus();
        return;
      }

      if (!early_insight) {
        setError('Please share one insight you\u2019d want to contribute early.');
        document.getElementById('vanguard-app-insight').focus();
        return;
      }

      setState('submitting');
      render();

      try {
        const result = await submitForm({
          email,
          name,
          background,
          communication_philosophy,
          fit_reason,
          early_insight,
        });
        if (result.ok) {
          setState('success');
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

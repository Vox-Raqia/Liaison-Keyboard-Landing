/**
 * Funnel forms entry point.
 *
 * Imports and initializes all three funnel form components for the landing page.
 * Loaded as a module script so imports work correctly in the browser.
 */

import { initBetaWaitlistForm } from './beta-waitlist-form.js';
import { initVanguardPreSignupForm } from './vanguard-presignup-form.js';

function initSmoothScroll() {
  document.querySelectorAll('[data-scroll-to]').forEach((button) => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-scroll-to');
      if (!targetId) {
        return;
      }
      const target = document.getElementById(targetId);
      if (!target) {
        return;
      }
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function initAll() {
  initSmoothScroll();
  initBetaWaitlistForm('beta-waitlist-form');
  initVanguardPreSignupForm('vanguard-presignup-form');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}

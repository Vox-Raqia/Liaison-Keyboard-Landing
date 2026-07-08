/**
 * Supabase client factory for Liaison Reply landing page funnels.
 *
 * SECURITY: Only the anon key is used here. Never expose the service_role
 * key in client-side code.
 *
 * In a Next.js / Vercel setup these values would come from env vars at build
 * time. For this static deploy they must be injected during the build or
 * replaced via a small deploy script. The defaults below match the existing
 * waitlist.html values for project qgamfmxentwrzgecfqgbs.
 */

const SUPABASE_URL = 'https://api.liaisonkeyboard.com';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnamZteGVudHdyemdlY2ZxZ2JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4Mjc0OTUsImV4cCI6MjA4NzQwMzQ5NX0.LsYx8wQfFv4V1kmap6eOSBPD5WLg0smCVA_YGDQl87E';

/**
 * @typedef {Object} BetaWaitlistRow
 * @property {string} id
 * @property {string} email
 * @property {string} created_at
 * @property {string|null} interest_note
 */

/**
 * @typedef {Object} BetaWaitlistInsert
 * @property {string} email
 * @property {string|null} [interest_note]
 */

/**
 * @typedef {Object} VanguardPreSignupRow
 * @property {string} id
 * @property {string} email
 * @property {string} name
 * @property {string|null} reason
 * @property {string} created_at
 */

/**
 * @typedef {Object} VanguardPreSignupInsert
 * @property {string} email
 * @property {string} name
 * @property {string|null} [reason]
 */

/**
 * @typedef {Object} VanguardApplicationRow
 * @property {string} id
 * @property {string} email
 * @property {string} name
 * @property {string|null} background
 * @property {string|null} communication_philosophy
 * @property {string|null} fit_reason
 * @property {string|null} early_insight
 * @property {string} created_at
 */

/**
 * @typedef {Object} VanguardApplicationInsert
 * @property {string} email
 * @property {string} name
 * @property {string} background
 * @property {string} communication_philosophy
 * @property {string} fit_reason
 * @property {string} early_insight
 */

let cachedClient = null;

/**
 * Returns a singleton Supabase client instance.
 * @returns {import('@supabase/supabase-js').SupabaseClient}
 */
export function createClient() {
  if (cachedClient) {
    return cachedClient;
  }

  if (typeof window === 'undefined' || !window.supabase) {
    throw new Error('Supabase library not loaded. Include @supabase/supabase-js before this module.');
  }

  cachedClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return cachedClient;
}

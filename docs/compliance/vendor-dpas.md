# Vendor DPA Register

**Last updated:** 2026-04-27
**Scope:** Launch-readiness evidence for vendors that process personal data for Liaison Reply.

## Status

| Vendor | Evidence in repo | Status | Notes |
|---|---|---|---|
| Google Cloud / Gemini | `vendor-dpas/google-cloud-data-processing-addendum-2026-04-27.pdf` | Public addendum archived | Public Cloud Data Processing Addendum captured as PDF. Account-level acceptance still needs founder evidence. |
| Stripe | `vendor-dpas/stripe-dpa-2026-04-27.pdf` | Public DPA archived | Public DPA captured as PDF. Account-level Services Agreement acceptance still needs founder evidence. |
| Supabase | `vendor-dpas/supabase-dpa-2026-04-25.pdf` | Archived | Public DPA already present. |
| PostHog | `vendor-dpas/posthog-trust-center-dpa-entry-2026-04-27.pdf` | Partial | Trust Center entry archived, but the underlying DPA contract text was not directly exposed in the public HTML export. Founder must download the actual DPA from the Trust Center or account. |
| Resend | `vendor-dpas/resend-dpa-2026-04-27.pdf` | Archived | Signed public DPA downloaded directly. |

## Required founder follow-up

1. Google: retain account-side proof that the Cloud Data Processing Addendum is accepted for the active project/account.
2. Stripe: retain dashboard or contract proof that the live account is governed by the current Services Agreement and DPA.
3. PostHog: download the actual DPA artifact from the Trust Center/account and replace the trust-center snapshot with the contract PDF.
4. Resend: confirm the production account is the same legal entity covered by the signed public DPA.
5. Supabase: retain project-region and account-acceptance evidence with the existing PDF.

## Download notes

- Google public source: `https://cloud.google.com/terms/data-processing-addendum`
- Stripe public source: `https://stripe.com/legal/dpa`
- Supabase public source: `https://supabase.com/downloads/docs/Supabase%2BDPA%2B260317.pdf`
- PostHog public entry point: `https://trust.posthog.com/`
- Resend public source: `https://resend.com/legal/dpa`

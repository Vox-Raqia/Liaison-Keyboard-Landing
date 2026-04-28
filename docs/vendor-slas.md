# Vendor Service Level Agreements (SLAs)

This file summarizes the launch-relevant vendors. Detailed SLA notes live in
`docs/vendor-slas/`.

## Active vendors

1. [Stripe](docs/vendor-slas/stripe-sla.md) - payment processing and billing
2. [Supabase](docs/vendor-slas/supabase-sla.md) - auth, database, realtime, and edge functions
3. [PostHog](docs/vendor-slas/posthog-sla.md) - product analytics and feature flags
4. [Google Gemini](docs/vendor-slas/google-gemini-sla.md) - AI model access

## DPA evidence

Wave 3 DPA evidence is tracked in:

- `docs/compliance/vendor-dpas.md`
- `docs/compliance/dpf-certifications.md`

Archived PDFs currently exist for Google Cloud, Stripe, Supabase, and Resend.
PostHog still needs the actual DPA contract download from its Trust Center.

## Summary

| Vendor | SLA posture | Notes |
|---|---|---|
| Stripe | Public legal terms; no simple public uptime number in the main DPA flow | Billing-critical vendor |
| Supabase | Strongest explicit hosted-platform uptime/SLA posture in current stack | Backend-critical vendor |
| PostHog | SLA depends on plan tier | Analytics-only, non-revenue-critical |
| Google Gemini | Service credits and support depend on Google Cloud terms/tier | Generation-critical vendor |

## Notes

- Anthropic is not an active vendor in the current product path.
- If the active provider set changes, this summary and the DPA register must be
  updated in the same change.

# Vendor DPA Evidence

This folder stores the launch-readiness DPA evidence captured on 2026-04-27.

## Files

- `google-cloud-data-processing-addendum-2026-04-27.pdf`
  - Public Google Cloud Data Processing Addendum captured from the official legal page.
- `stripe-dpa-2026-04-27.pdf`
  - Public Stripe Data Processing Agreement captured from the official legal page.
- `supabase-dpa-2026-04-25.pdf`
  - Existing public Supabase DPA.
- `posthog-dpa-requested-2026-04-27.md` ⏳
  - PostHog DPA acquisition process documented and request initiated. PostHog uses a per-customer DPA generator (not a static public PDF). The signed contract is pending counter-signature from `privacy@posthog.com`.
- `resend-dpa-2026-04-27.pdf`
  - Public signed Resend DPA.

## Acquisition method differences

| Vendor | DPA type | Acquisition |
|--------|-----------|-------------|
| Google Cloud | Static public PDF | Direct download |
| Stripe | Static public PDF | Direct download |
| Supabase | Static public PDF | Direct download |
| Resend | Signed static PDF | Direct download |
| **PostHog** | **Generated per-customer + counter-signed** | **DPA generator → email request → countersignature** |

See `posthog-dpa-requested-2026-04-27.md` for the exact completion steps.

## Status

- ✅ Google Cloud, Stripe, Supabase, Resend: **Archived**
- ⏳ PostHog: **Blocked — awaiting CRA business registration** (legal entity name required before DPA can be generated; process documented in `posthog-dpa-requested-2026-04-27.md`)

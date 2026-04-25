# Vendor Service Level Agreements (SLAs)

This document provides an overview of the Service Level Agreements (SLAs) with our critical vendors. Detailed SLAs for each vendor are available in the `docs/vendor-slas/` directory.

## Vendors Covered

1. [Stripe](docs/vendor-slas/stripe-sla.md) — Payment processing & billing
2. [Supabase](docs/vendor-slas/supabase-sla.md) — Backend services (Auth, Database, Realtime, Storage, Edge Functions)
3. [PostHog](docs/vendor-slas/posthog-sla.md) — Product analytics, feature flags, session recording
4. [Google Gemini](docs/vendor-slas/google-gemini-sla.md) — AI model access (Gemini 2.5 Flash)

> **Note:** Anthropic is no longer an active vendor; Liaison Keyboard uses Google Gemini for AI generation per the current codebase.

## Summary of Key SLA Terms

| Vendor | Monthly Uptime | Support Response (Critical) | Service Credits for Downtime |
|--------|----------------|-----------------------------|------------------------------|
| **Stripe** | Not explicitly stated in public SSA* | Basic support via email/chat (no explicit SLA) | Credits per service-specific terms (refer to contract) |
| **Supabase** | 99.9% per service (Enterprise tier) | 1 hour (Enterprise Priority) | Tiered: 10% (<99.9% ≥99.0%), 15% (<99.0% ≥98.0%), 20% (<98.0% ≥96.0%), 30% (<96.0%); capped at 20%/12mo |
| **PostHog** | 99.95% (Enterprise only; standard has no SLA) | Best-effort (no explicit SLA for standard tier) | Tiered: 5% (99.90–99.94%), 10% (99.00–99.89%), 20% (<99%); max 50% per month |
| **Google Gemini** | ≥ 99.9% | Depends on Google Cloud support tier (see detailed SLA) | Tiered: 10% (99.0%–<99.9%), 25% (95.0%–<99.0%), 50% (<95.0%); max 50% per month |

*Stripe's Services Agreement (SSA) does not quantify uptime percentages in the main document; commitments may be in service-specific terms or enterprise agreements.

## Common Terms

- **Measurement Period:** Calendar month
- **Claim Window:** Customer must submit credit claim within 30 days of month-end.
- **Exclusions:** Scheduled maintenance (with advance notice), force majeure, customer-caused issues, violation of terms, network issues outside vendor's control.
- **Governing Law:** As specified in each vendor's master service agreement.
- **Remedies:** Service credits are the sole and exclusive remedy for SLA breaches unless otherwise stated.

## Review Process

SLAs are reviewed annually or upon significant service changes. Amendments require written agreement from both parties (or vendor's unilateral modification rights per their terms).

## Contact for SLA Inquiries

For questions regarding these SLAs, please contact:
- Legal Counsel: [To be assigned]
- Product Lead: [To be assigned]
- Vendor Management: [To be assigned]

## Last Updated

2026-04-25 (sourced from public vendor terms)

## Version

1.1

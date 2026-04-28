# Data Privacy Framework Certifications

**Last updated:** 2026-04-27

This file tracks the public DPF evidence used in the Wave 3 compliance pass.

## Current status

| Vendor | Status | Public evidence | Effective date / date signal |
|---|---|---|---|
| Google Cloud / Gemini | Partially verified | Google DPF participant listing: `https://www.dataprivacyframework.gov/Google` | Exact effective date was not exposed in the static retrieval path used during this pass; founder should confirm from the live participant page. |
| Stripe | Verified | Stripe DPF policy: `https://stripe.com/legal/data-privacy-framework` | Effective date shown on the policy page: 2026-02-23. |
| Resend | Verified | Resend DPF announcement: `https://resend.com/changelog/data-privacy-framework-certification` and DPF listing linked from that page | Public announcement confirms DPF coverage, but the page does not expose a standalone effective-date field beyond the publication itself. |
| PostHog | Unverified | No first-party DPF statement was surfaced during this pass. Trust Center entry point: `https://trust.posthog.com/` | No effective date available. Treat DPF coverage as unverified until PostHog provides first-party evidence. |

## Notes

- Stripe explicitly states it complies with the EU-U.S. DPF, the UK Extension to
  the EU-U.S. DPF, and the Swiss-U.S. DPF.
- Resend explicitly states it is certified under the EU-U.S. DPF and the UK
  Extension to the EU-U.S. DPF.
- Google Cloud's public enterprise privacy material and DPF listing path were
  identified, but this pass did not capture a static page that exposed the
  listing metadata cleanly enough to quote an exact effective date.
- PostHog should not be documented as DPF-certified without first-party proof.

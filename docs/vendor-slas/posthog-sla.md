# PostHog Service Level Agreement (SLA)

**SLA URL:** https://posthog.com/terms (see "Uptime SLA" section)  
**Service:** Product Analytics, Feature Flags, Session Recording  
**Effective Date:** TBD (Enterprise customers only)  
**Last Updated:** 2026-04-25 (sourced from public Terms of Service)

## Applicability

- **Enterprise SLA:** Applies only to customers who have purchased the **Enterprise add-on** or have a special annual contract where uptime SLA was agreed as a term.
- **Standard (Cloud) Tier:** No uptime SLA is provided; service is offered on a best-effort basis.
- Always confirm your subscription tier to know if this SLA applies.

## Service Commitments

### Uptime/Availability (Enterprise Only)

- **Monthly Uptime Percentage:** 99.95%
- **Measurement:** As displayed on status.posthog.com
- **Downtime Exclusions:** The following are not counted toward downtime:
  - Delays to data ingestion
  - Scheduled maintenance (advance notice)
  - Emergency maintenance (prompt notice via email or in-app)
  - Suspension/termination of account per Terms
  - Failures due to customer's equipment, software, or third-party services not under PostHog's control
  - Force majeure events
  - Denial-of-service attacks or unauthorized access not resulting from PostHog's failure to maintain standard security controls
  - Unavailability caused by customer's breach of the Agreement

### Performance
No explicit performance guarantees are stated in the public terms beyond uptime. PostHog aims for:
- Fast event ingestion and query response (no SLA-guaranteed numbers)
- Feature flag evaluation low-latency

### Support
- **Standard Tier:** Support via Slack, email, and community forums; no guaranteed initial response time.
- **Enterprise:** Support details are defined in your contract. Public terms do not specify response times; refer to your order form.

## Remedies

### Service Credits (Enterprise Only)

If PostHog fails to maintain the 99.95% uptime in a month:

| Uptime Range | Credit Percentage |
|--------------|------------------|
| 99.90% – 99.94% inclusive | 5% credit |
| 99.00% – 99.89% inclusive | 10% credit |
| < 99.00% | 20% credit |

If uptime is ≤ 99% for **any 3 months within a 6-month period**, Enterprise customers may terminate the agreement upon **10 days written notice**.

**Credit Claim Window:** Submit request within 30 days of month-end. Credits are applied to future invoices.

**Maximum Credit Cap:** Not explicitly stated in public terms (may be capped per contract).

## Exclusions

- Pre-General-Availability (beta) features are excluded unless specifically stated in documentation.
- Limitations due to customer's quota exceedance or misuse.
- Failures from integration with third-party services not controlled by PostHog.

## Contact Information

- **Support:** https://posthog.com/contact (in-app ticket or email)
- **Community:** Discord and GitHub discussions
- **Legal/Privacy:** https://posthog.com/terms, https://posthog.com/privacy
- **Status Page:** https://status.posthog.com/

## Review and Amendment

- This SLA is part of the PostHog Subscription Terms and is reviewed periodically.
- Enterprise customers may negotiate custom SLAs via their contract.

**Liaison Keyboard Representative:** ___________________ Date: _________
**PostHog Representative:** ___________________________ Date: _________

> **Note:** The current codebase does not rely on any explicit PostHog uptime SLA for core functionality. If Enterprise tier is needed for guaranteed availability, upgrade per pricing page.

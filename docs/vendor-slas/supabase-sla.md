# Supabase Service Level Agreement (SLA)

**SLA URL:** https://supabase.com/sla  
**Service:** Backend Platform (Auth, Database, Realtime, Storage, Edge Functions, etc.)  
**Effective Date:** TBD (Enterprise customers)  
**Last Updated:** 2026-04-25 (sourced from public SLA page)

## Scope and Applicability

This SLA applies to **Enterprise tier** customers during the subscription term. Each product is individually covered by a 99.9% uptime commitment. See https://supabase.com/sla for full details and product-specific scope.

## Service Commitments

### Uptime/Availability
- **Monthly Uptime Percentage:** 99.9% for each covered service
- **Measurement:** (Scheduled Availability - Unscheduled Downtime) / Scheduled Availability, measured monthly
- **Downtime Definition:** Periods >5 consecutive minutes when the service is not generally accessible to permitted users (excluding Scheduled Maintenance and SLA Exclusions)

### Performance ( indicative, not SLA-guaranteed )
- **Auth API:** 95% of requests within 500ms
- **Database (Postgres):** 95% of simple queries within 200ms
- **Realtime:** 99% of messages delivered within 1 second
- **Storage:** 95% of file uploads/downloads (<5MB) within 3 seconds
- **Edge Functions:** 95% of executions within 1 second (cold start <1s, warm <200ms)

> *Performance targets are illustrative; explicit guarantees may vary by product tier.*

### Support
Support SLAs differ by plan. For **Enterprise** customers:

| Severity | Description | Initial Response Target |
|----------|-------------|-------------------------|
| Urgent (P0) | Full or partial system outage; production unavailable | 1 hour (24/7 × 365) |
| High (P1) | Major functionality impaired; significant user impact | 2 business hours (Mon–Fri, 6am–6pm) or 2 hours (24/7 × 365 if Priority Plus) |
| Normal (P2) | Minor feature or functional issues | 1 business day (Mon–Fri) |
| Low (P3) | Information request or feature request | 2 business days (Mon–Fri) |

- **Channels:** Email/ticket system; priority access for Enterprise
- **Community:** Discord and GitHub discussions available

## Remedies

### Service Credits
If Supabase fails to meet the Uptime Commitment in a calendar month:

| Actual Availability | Credit Percentage | Applied to |
|---------------------|------------------|------------|
| < 99.9% but ≥ 99.0% | 10% | Affected service monthly fees |
| < 99.0% but ≥ 98.0% | 15% | Affected service monthly fees |
| < 98.0% but ≥ 96.0% | 20% | Affected service monthly fees |
| < 96.0% | 30% | Affected service monthly fees |

- **Maximum Cap:** Total credits per service cannot exceed 20% of the fees paid for that service in the preceding 12 months.
- Credits are applied to future invoices; they are not refunds.

### Claim Procedure
1. Submit credit request within **30 days** of month-end to `support@supabase.io`
2. Include: organization, affected service(s), region(s), project(s), dates/times of downtime (5-minute intervals), and supporting logs
3. Supabase validates using internal monitoring; claims unsupported or inaccurate may be denied
4. Credits issued within 30 days of validation

## Exclusions

SLA does not apply to:
- Issues caused by third-party vendors (AWS, Cloudflare, GCP, etc.) or integration partners
- Force majeure, ISP outages, or general internet issues
- Customer actions: misconfigurations, resource limitations, violations of operational guidelines, schema changes, exceeding quotas
- Beta/Alpha products (not GA)
- Suspension or termination per Supabase Terms
- Scheduled maintenance (with ≥ 24 hours notice)

Product-specific exclusions are detailed in the full SLA (e.g., use of unofficial extensions, outdated library versions).

## Contact Information
- **Support:** https://supabase.com/contact or `support@supabase.io`
- **Emergency:** Priority email for Critical issues (Enterprise)
- **Legal/Contracts:** legal@supabase.com
- **Status Page:** https://status.supabase.com/

## Review and Amendment
This SLA is reviewed annually or upon significant service changes. Amendments require written agreement between Supabase and the customer.

**Liaison Keyboard Representative:** ___________________ Date: _________
**Supabase Representative:** ___________________________ Date: _________

> **Important:** The above terms reflect the published Enterprise SLA. Your actual service commitments may differ based on your subscription tier. Always refer to your order form and the latest SLA at https://supabase.com/sla.

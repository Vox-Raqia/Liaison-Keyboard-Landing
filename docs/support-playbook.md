# Support Playbook

## Response SLAs
- Email support: 48 hours for all users
- Pro users: 24 hours (priority response in ticketing system)

## Triage Categories
1. Billing: Issues related to subscription, payment, invoices, Stripe portal access.
2. Technical: Bugs, errors, generation failures, performance issues.
3. Feature Request: Suggestions for new features or improvements.
4. Bug: Specific, reproducible issues with the product.

## Escalation Path
- **P0 Critical** (data loss, security breach, complete outage): Escalate to Founder immediately via SMS/phone.
- **P1 High** (billing stuck, Pro access denied, webhook failures): Escalate to Engineer on call within 4 hours.
- **P2 Medium** (feature issues, minor bugs): Standard support response within SLA.
- **P3 Low** (feedback, suggestions): Log and review during product planning.

## Common Issues & Routing
- **"Pro access missing after payment"**: Check Stripe webhook status → if payment confirmed but no entitlement, route to Engineering with transaction ID (P1).
- **"Refund request"**: Direct to Stripe customer portal; if user cannot access, create billing ticket and escalate to Founder (P1).
- **"Generation returns blank"**: Ask for message screenshot; if confirmed, route to Engineering as P1 (critical path).
- **"Cannot delete account/data"**: Route to Founder (GDPR compliance, P1).
- **"Thread linking not working"**: Route to Engineering (technical bug, P2).
- **"App crashes on mobile"**: Route to Engineering with device/os details (P2).

## Refund Policy
- 14-day money-back guarantee for any Pro subscription.
- Refunds processed via Stripe portal or manual intervention if portal inaccessible.
- No refunds after 14 days; exceptions require Founder approval only.

## Workflow
1. Ticket received via Freshdesk (email or widget).
2. Auto-triage category assigned based on subject keywords; manual override if needed.
3. Apply SLA timer based on user tier (Pro = 24h, Free = 48h).
4. If P0 critical → escalate to Founder + Engineer immediately (SMS/phone).
5. If P1 high → escalate to Engineer within 4h.
6. Respond within SLA; if resolved, close ticket with resolution notes.
7. If requiring escalation, update ticket with escalation notes and notify escalatee.
8. Follow up with user until resolution.

## Tools
- **Ticketing system**: Freshdesk (free tier)
  - Dashboard: [FRESHDESK_URL_PENDING]
  - Email routing: support@liaisonreply.com → Freshdesk inbox
- **Email**: support@liaisonreply.com
- **Billing portal**: https://billing.stripe.com/p/login/28E7sL3uUgOp35GeVSbfO00
- **Knowledge base**: FAQ in support.html and docs/faq.md
- **Monitoring**: Supabase logs, PostHog error tracking

## Email Routing Setup
1. Forward support@liaisonreply.com to Freshdesk's unique email address ([FRESHDESK_EMAIL_PENDING]).
2. In Freshdesk, configure "Email Settings" to receive from that address.
3. Set up auto-response for incoming tickets.
4. Configure ticket creation rules (see "Triage Rules" below).

## Triage Rules (Freshdesk Automation)
- Subject contains "payment" OR "pro" OR "subscription" → Category: Billing, Priority: P1
- Subject contains "bug" OR "error" OR "broken" OR "blank" → Category: Bug, Priority: P2
- Subject contains "delete" OR "privacy" OR "gdpr" → Category: Technical, Priority: P1 (escalate to Founder)
- Subject contains "feature" OR "suggestion" → Category: Feature Request, Priority: P3
- Default → Category: Technical, Priority: P3, SLA: 48h

## Widget Installation
- Add Freshdesk widget code to support.html footer (before closing `</body>` tag).
- Configure widget to show only on support.html (not on main landing pages).
- Set business hours: 24/7 monitored; Founder primary responder initially.
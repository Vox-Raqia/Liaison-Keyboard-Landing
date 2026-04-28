# Risk Register

**Last updated:** 2026-04-27

| ID | Risk | Likelihood | Impact | Mitigation | Owner |
|---|---|---|---|---|---|
| RSK-001 | Stripe webhook delay or missed realtime update leaves a paid user temporarily on Free | Medium | High | `verify-payment` recovery, 35-minute verification window, mocked delayed-webhook E2E, Settings `Restore Pro Access` action | Founder / app |
| RSK-002 | Production build/type health is obscured by unrelated in-flight app changes | High | Medium | Separate launch branch or finish/stabilize the Article 9 consent work before final launch cut | Founder / app |
| RSK-003 | PostHog DPA evidence is incomplete | Medium | Medium | Download actual DPA from Trust Center and retain with launch artifacts | Founder / compliance |
| RSK-004 | Cross-user data exposure if future DB changes bypass current RLS posture | Low | High | Maintain RLS on user-scoped tables; review new migrations for policy coverage | Founder / backend |
| RSK-005 | Gemini API rate limits or upstream instability degrade reply generation | Medium | High | Monitor error rates, retain fallback messaging, and keep rate-limit telemetry visible | Founder / backend |
| RSK-006 | Consent-gated analytics or privacy settings drift from documentation | Medium | Medium | Keep privacy policy, cookie settings, and consent screens updated in the same change set | Founder / compliance |
| RSK-007 | Restore/rollback procedure is untested during a real incident | Medium | High | Run periodic restore drills using Supabase backups and record outcomes | Founder / ops |
| RSK-008 | Billing-state mismatches between Stripe and `users` rows create support load | Medium | High | Reconcile with Stripe IDs, replay or verify webhook state, use `verify-payment` path | Founder / billing |

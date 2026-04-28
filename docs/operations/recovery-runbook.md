# Recovery Runbook

**Last updated:** 2026-04-27

## Severity levels

- `SEV-1`: Revenue, authentication, or data-loss incident affecting production users now
- `SEV-2`: Major degradation with a workaround
- `SEV-3`: Non-critical defect or partial internal-only degradation

## First response

1. Confirm scope: web only, app only, billing only, or shared backend.
2. Freeze deploys until impact is understood.
3. Capture timestamps, affected user IDs, Stripe session IDs, and Supabase request IDs.
4. Notify the founder/operator and open an incident log.

## Supabase restore

1. Open the production Supabase project.
2. Check database health, auth health, and edge-function logs first.
3. If corruption or destructive migration is confirmed, use Supabase backup/restore for the closest clean snapshot.
4. Restore into a staging or temporary project first when time permits.
5. Validate:
   - auth login
   - `users`
   - `chat_threads`
   - billing fields on `users`
   - edge-function health
6. If the restored state is correct, promote or cut traffic over using the approved deployment process.

## Migration rollback

1. Identify the exact migration number and the tables/functions it changed.
2. Prefer a forward fix if rollback would lose newer data.
3. If rollback is required, prepare an explicit SQL reversal script and run it in a controlled window.
4. Re-run smoke checks after the rollback:
   - auth
   - generation
   - billing portal
   - Stripe webhook processing

## Stripe reconciliation

1. Pull the affected customer/subscription/session IDs from Stripe.
2. Compare Stripe state to the `users` row:
   - `plan_type`
   - `billing_status`
   - `stripe_customer_id`
   - `stripe_subscription_id`
3. If Stripe is correct and the app row is stale:
   - run `verify-payment`
   - use the Settings `Restore Pro Access` path if user-facing recovery is needed
4. Confirm the Stripe webhook idempotency table contains the event or replay the webhook safely.

## Backup verification

Check at least monthly:

1. Supabase backup history exists and is current.
2. A restore can be completed into a non-production target.
3. Critical tables and edge functions behave normally after restore.

## Escalation contacts

- Founder / operator: primary incident commander
- Supabase support: platform/data incidents
- Stripe support: billing and checkout incidents
- Google Cloud support: model/runtime availability incidents
- PostHog support: analytics-only incidents

## Exit criteria

An incident can be closed when:

1. Production behavior is stable.
2. Smoke-test coverage passes for the affected path.
3. Customer-visible follow-up is sent if required.
4. Root cause and remediation are added to the risk register or known-bugs file.

# Load Test Results

**Last updated:** 2026-04-27

## Payment verification synthetic load

Script:

- `Liaison-Keyboard/scripts/payment-verification-synthetic-load.mjs`

Execution:

- `node scripts/payment-verification-synthetic-load.mjs`

Configuration used:

- 15 concurrent synthetic sessions
- initial poll delays: `3s, 5s, 10s, 15s, 20s, 25s, 30s`
- fallback poll interval: `10s`
- maximum verification window: `35m`
- delayed webhook buckets: `5s, 30s, 2m, 5m, 10m`
- manual restore check modelled at `11m`

Observed result:

- All 15 synthetic sessions completed within the 35-minute verification window.
- Automatic grant times were:
  - `8s` for 5-second webhooks
  - `33s` for 30-second webhooks
  - `2m 8s` for 2-minute webhooks
  - `5m 8s` for 5-minute webhooks
  - `10m 8s` for 10-minute webhooks

Interpretation:

- The current automatic fallback cadence is sufficient for delayed webhook
  recovery in the tested 5-second through 10-minute range.
- The Settings `Restore Pro Access` action remains a user-facing manual fallback
  if a client misses the live update path.

## Generation endpoint load

Not executed in this Wave 3 pass.

Reason:

- The current workspace contains unrelated in-flight app changes that already
  break `npm run typecheck`, so a generation-load benchmark would not have been
  a clean launch-readiness signal.

Follow-up:

- Run a dedicated mock-Gemini generation load script from a stabilized app
  branch and append the measured latency/error-rate results here.

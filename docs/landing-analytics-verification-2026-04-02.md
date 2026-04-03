# Liaison Keyboard Landing Analytics Verification

Date: 2026-04-02 Status: Active verification runbook Measurement ID:
`G-FMVPQNPPDD`

## Purpose

This runbook defines how to verify the landing pricing-funnel events that were
added during the monetization remediation pass.

The repo can confirm emission logic and payload shape. It cannot confirm live
event arrival in production without Google Analytics access.

## Current Event Set

- `landing_pricing_viewed`
- `landing_interval_selected`
- `landing_cta_clicked`

## Expected Payload Shape

### `landing_pricing_viewed`

- `cta_surface`: `pricing-section`
- `session_state`: `anonymous` or `active`

### `landing_interval_selected`

- `cta_surface`: expected `pricing-monthly` or `pricing-yearly`
- `cta_label`: expected `Choose Monthly` or `Choose Yearly`
- `billing_interval`: `month` or `year`
- `destination_path`: register URL including `billing_interval`
- `session_state`: `anonymous` or `active`

### `landing_cta_clicked`

- `cta_surface`: any landing CTA surface
- `cta_label`: visible CTA label
- `billing_interval`: `month`, `year`, or omitted for non-interval CTAs
- `destination_path`: outbound target
- `session_state`: `anonymous` or `active`

## Consent Requirement

Analytics storage defaults to denied until the visitor enables continuity
cookies. If continuity consent is not enabled, GA validation should be expected
to fail even when repo-side event emission logic is correct.

## Local Verification Without GA Access

`site.js` now records every landing event in `window.__liaisonLandingEvents`
before attempting to call `gtag`.

Local steps:

1. Load the landing page locally.
2. Enable continuity cookies if you want to mirror production analytics state.
3. Scroll the pricing section into view.
4. Click `Choose Monthly` and `Choose Yearly`.
5. Inspect `window.__liaisonLandingEvents` in the browser console.

Expected local sequence:

1. `landing_pricing_viewed`
2. `landing_interval_selected`
3. `landing_cta_clicked`

For each interval CTA click, the last two events should include the same
`billing_interval` and destination URL.

## Production Verification In GA DebugView

1. Open the live site with a clean browser session.
2. Accept continuity cookies.
3. Open GA4 DebugView for property `G-FMVPQNPPDD`.
4. Visit the landing page and scroll the pricing section into view.
5. Click monthly and yearly CTAs in separate runs.
6. Confirm the events appear in this order:
   - `landing_pricing_viewed`
   - `landing_interval_selected`
   - `landing_cta_clicked`
7. Confirm the event parameters include:
   - `cta_surface`
   - `cta_label`
   - `billing_interval` where relevant
   - `destination_path`
   - `session_state`

## Blockers

- No Google Analytics property access exists in the current workspace.
- As of 2026-04-02, `https://liaisonkeyboard.com/` is still serving the older
  pricing variant with `$70.99/year`, `save 26%`, and generic paid-tier
  `Start Free` CTAs, so production DebugView validation of the new event set is
  blocked by deployment parity first.
- Repo inspection cannot prove whether consent configuration, ad blockers, or
  live tag-manager settings are suppressing events in production.

## Current Production-Parity Finding

Live fetch verification on 2026-04-02 showed that production is still behind
repo state:

- homepage pricing cards still use generic `Start Free`
- production still shows `$70.99/year` and `save 26%`
- support and terms still show the older utility-page topbar CTA pattern

Do not treat production analytics as validation of the new pricing-card event
shape until the newer landing build is deployed.

## Completion Criteria

- Local verification confirms the event array contains the expected sequence.
- GA DebugView confirms event arrival and parameter shape on the live site.
- Pricing analysis only begins after live event arrival is confirmed.

# WAVE 3 — Launch Readiness Execution Handoff
**Date:** 2026-04-27  
**From:** Re-Assessment Agent (Kilo)  
**To:** Wave 3 Execution Agent  
**Subject:** Execute critical launch blockers and post-stability validation

---

## 🎯 Your Mission

You are the Wave 3 execution agent. Your job is to **eliminate remaining launch blockers** identified in the A–Z reassessment and prepare the product for **production launch**.

This is a focused engineering sprint. No feature creep. No refactoring for its own sake. Fix what's blocking launch, validate end-to-end, and hand off a clean, production-ready codebase.

---

## 📋 Read Before You Begin (Mandatory)

1. **Read the master assessment:**
   - `docs/audit/current-launch-readiness-assessment.md` (in `Liaison-Keyboard-Landing/`)
   - This is your single source of truth for launch readiness posture.

2. **Read the ledger:**
   - `docs/audit/launch-readiness-reassessment-ledger.md`
   - Understand section scores and evidence references.

3. **Read the comparison report:**
   - `docs/audit/launch-readiness-comparison.md`
   - Understand what improved from Wave 1/2 and what remains.

4. **Read current architecture truth:**
   - `Liaison-Keyboard/.liaison-docs/01-architecture.md`
   - `Liaison-Keyboard/.liaison-docs/02-runtime-flows.md`
   - `Liaison-Keyboard/.liaison-docs/04-known-bugs.md`
   - `Liaison-Keyboard/.liaison-docs/05-testing-and-verification.md`

5. **Read the MBRD:**
   - Root-level `MBRD.md` — understand the product vision and constraints.

---

## 🚨 Critical Blockers (Must Fix — Revenue Blocking)

### BLOCKER 1: Pro Verification Reliability — NOT FULLY VALIDATED

**Status:** Code fix exists (`payment-verification-improvements` branch), but E2E stability is uncertain.

**What was done in Wave 2:**
- `hooks/usePaymentVerification.ts`: Extended polling window to 35 min + 30 min fallback
- `settings.tsx`: Added "Restore Pro Access" manual override button
- `supabase/functions/verify-payment/`: Edge function for server-side verification
- `stripe-checkout/`: Now passes `session_id` in success URL

**What remains:**
- The E2E tests for this flow are **unstable** (auth fixture timing issues)
- No production-like validation has been performed with simulated webhook delays

**Your Tasks:**

1. **Stabilize E2E test for payment verification:**
   - Fix `e2e/web/fixtures/auth-mock.ts` timing so auth-mocked tests reliably land in authenticated chat session
   - Write deterministic test: mock Stripe checkout with `session_id`, simulate webhook landing AFTER polling window expires, verify Pro access still granted

2. **Create synthetic load test for verification path:**
   - Write a script that simulates 10+ concurrent checkouts with delayed webhooks (5s, 30s, 2 min, 5 min, 10 min)
   - Verify that ALL eventually grant Pro access within the 35-minute window
   - Test the manual override button ("Restore Pro Access") as a fallback

3. **Verify in production-like environment:**
   - Run the full checkout flow in Expo web with mocked Stripe
   - Verify: checkout → return → polling → webhook → Pro UI active → generation unlocked

**Target Files:**
- `Liaison-Keyboard/hooks/usePaymentVerification.ts`
- `Liaison-Keyboard/e2e/web/fixtures/auth-mock.ts`
- `Liaison-Keyboard/e2e/web/specs/billing-upgrade.spec.ts`
- `Liaison-Keyboard/supabase/functions/verify-payment/index.ts`

---

### BLOCKER 2: Vendor DPA Package Incomplete

**Status:** Only 1 DPA stored (Supabase). Need Google Gemini, Stripe, PostHog, Resend minimum.

**Your Tasks:**

1. **Download and store vendor DPAs:**
   - Google Cloud DPA (Gemini API provider)
   - Stripe DPA
   - PostHog DPA
   - Resend DPA (if used for email)
   - Store as PDFs in `Liaison-Keyboard-Landing/docs/compliance/vendor-dpas/`

2. **Create `dpf-certifications.md`:**
   - Document which vendors are EU-US Data Privacy Framework certified
   - List certification URLs and effective dates
   - Note: Google, Stripe, PostHog should all be DPF-certified

3. **Update vendor SLA documentation:**
   - Ensure `docs/vendor-slas/google-gemini-sla.md` references the actual Google DPA
   - Cross-check that `docs/vendor-slas.md` overview matches stored DPAs

4. **Update compliance docs:**
   - `docs/audit/current-launch-readiness-assessment.md`: Update Section C score if DPA gaps closed
   - `docs/audit/launch-readiness-reassessment-ledger.md`: Update Section C entry

**Note:** DPA download URLs are typically found in vendor privacy settings or via support. If you cannot access them, create a document listing the required DPAs with download instructions.

---

### BLOCKER 3: RLS Not Enforced in Database

**Status:** All queries use application-level `user_id` filtering. No RLS policies in Supabase.

**Your Options:**

**Option A — Implement RLS (Recommended):**
1. Create RLS policies for all user-scoped tables:
   - `chat_threads`: Owner can SELECT/INSERT/UPDATE/DELETE their own threads
   - `thread_links`: Owner can manage their own links
   - `processed_webhooks`: System-only access (service role)
   - `users`: Owner can read/update own row; service role for Stripe webhook
   - `personas`: Read-only for authenticated users

2. Test that:
   - User A cannot read User B's threads
   - Stripe webhook can still update billing fields via service role
   - Edge functions work with RLS enabled (they use service role key)

3. Document in `.liaison-docs/01-architecture.md`:
   - Add RLS policy section
   - Note which tables have RLS enabled
   - Note which tables intentionally don't (and why)

**Option B — Legal Risk Acceptance (If RLS cannot be implemented in time):**
1. Create `.liaison-docs/rls-risk-acceptance.md`:
   - Document that data isolation is at application level
   - Note Supabase auth provides row-level isolation via `.eq('user_id', userId)`
   - State compensating controls: auth middleware in all routes, service role only for webhooks, no admin panel that bypasses user_id filters

**Decision:** Attempt Option A first. If RLS policies introduce regressions that cannot be resolved quickly, fall back to Option B and document.

**Target Files:**
- `Liaison-Keyboard/supabase/migrations/` (new migration for RLS policies)
- `Liaison-Keyboard/.liaison-docs/01-architecture.md`
- `Liaison-Keyboard/.liaison-docs/rls-risk-acceptance.md` (if Option B)

---

## 🔧 Strongly Recommended (Should Have — Improve Launch Confidence)

### RECOMMENDED 1: Load Testing

**Status:** No load test exists.

**Tasks:**
1. Write a load test script for the generation endpoint:
   - Mock Gemini API responses (avoid actual API costs)
   - Simulate 10–50 RPS for 5 minutes
   - Measure response time, error rate, memory usage
   - Document results in `docs/testing/load-test-results.md`

2. Verify the edge function handles sustained generation:
   - Check rate limits in `supabase/functions/generateLiaisonReplies/index.ts`
   - Verify `abuse.ts` rate limiting works under load
   - Confirm `generationState.ts` correctly tracks free user limits

---

### RECOMMENDED 2: Recovery Runbook

**Status:** No documented recovery procedure.

**Tasks:**
1. Create `Liaison-Keyboard-Landing/docs/operations/recovery-runbook.md`:
   - Database restore procedure (Supabase project restore)
   - Rollback procedure (Supabase migration rollback)
   - Incident escalation: who to contact, severity levels
   - Backup verification: how to confirm backups are working
   - Stripe reconciliation: how to verify subscription state matches database

---

### RECOMMENDED 3: Risk Register

**Status:** Known bugs tracked but no formal risk assessment.

**Tasks:**
1. Create `Liaison-Keyboard-Landing/docs/operations/risk-register.md`:
   - Convert known bugs into risk entries with:
     - Risk ID (e.g., RSK-001)
     - Description
     - Likelihood (Low/Med/High)
     - Impact (Low/Med/High)
     - Mitigation
     - Owner
   - Include risks not yet manifesting (e.g., Gemini API rate limits, Stripe webhook delivery delays, PostHog data retention limits)

---

### RECOMMENDED 4: CCPA Notice-at-Collection

**Status:** Privacy policy mentions CCPA but no dedicated notice-at-collection exists.

**Tasks:**
1. Create `Liaison-Keyboard-Landing/docs/compliance/ccpa-notice-at-collection.md`:
   - Categories of personal information collected
   - Business purpose for each category
   - Third parties shared with
   - Opt-out instructions
   - "Do Not Sell My Personal Information" link

2. Update privacy policy to reference the notice

---

##  Validation Gates (Must Pass Before Launch)

Before declaring Wave 3 complete, verify:

### Gate 1: End-to-End Production Smoke Test

**Run this sequence manually or via script:**

1. Sign up new user → confirm email
2. Enter chat → paste message → generate replies → copy one
3. Sign out → sign in again → verify thread history persists
4. Click upgrade → complete Stripe checkout → verify Pro access granted within 60 seconds
5. Generate replies as Pro → verify no rate limits
6. Open settings → click "Manage Subscription" → verify Stripe portal opens
7. Open settings → verify "Restore Pro Access" button works (simulated failure path)
8. Delete thread → verify history removed
9. Sign out → verify session cleared

### Gate 2: Linting and Type Checking

```bash
cd Liaison-Keyboard
npm run typecheck    # Should pass
npm run lint         # Pre-existing error at app/auth/reset-password.tsx:115 is acceptable
```

### Gate 3: Test Suite

```bash
cd Liaison-Keyboard
npm test             # Unit + integration tests should pass
npm run test:web:e2e # Playwright web E2E should pass (or mock-mode pass)
```

---

## 📦 Deliverables

When Wave 3 is complete, you must produce:

1. **Updated ledger:** `docs/audit/launch-readiness-reassessment-ledger.md` with Wave 3 scores
2. **Updated assessment:** `docs/audit/current-launch-readiness-assessment.md` reflecting current state
3. **Wave 3 report:** `docs/audit/wave-3-execution-report.md` with:
   - Tasks completed
   - Test results
   - Remaining gaps (if any)
   - Launch recommendation

4. **Clean git history:**
   - All changes committed to appropriate repos
   - Feature branches merged to main or documented as separate tracks
   - No uncommitted changes
   - No logs, artifacts, or temporary files in repo

---

## ⚠️ Operating Rules

1. **Code is truth:** If docs disagree with code, fix the docs
2. **No feature creep:** Only build what's necessary to unblock launch
3. **Test before commit:** Run relevant tests for any code changes
4. **Document changes:** Update `.liaison-docs/` after any behavioral change
5. **Ask before risky changes:** If you're unsure about a security, billing, or auth change, pause and explain before executing
6. **Protect the payment flow:** Any change to `hooks/usePaymentVerification.ts`, `hooks/usePaymentHandler.ts`, or `supabase/functions/stripe-*` requires full E2E test verification

---

## 🔗 Repository Information

| Repo | Path | Current Branch | Latest Commit |
|------|------|---------------|---------------|
| Landing | `Liaison-Keyboard-Landing/` | `main` | `005327e` chore: workspace config |
| App | `Liaison-Keyboard/` | `payment-verification-improvements` | `f89d5bf` feat: Article 9 consent |

---

## 🚀 Success Criteria

Wave 3 is complete when:

1. ✅ Pro verification reliability validated with deterministic tests
2. ✅ 4+ vendor DPAs stored and documented
3. ✅ RLS enforced in database OR risk acceptance documented
4. ✅ Load test executed and results documented
5. ✅ Recovery runbook created
6. ✅ Risk register created
7. ✅ CCPA notice-at-collection created
8. ✅ End-to-end smoke test passes all 9 steps
9. ✅ All changes committed and pushed
10. ✅ Launch recommendation in Wave 3 report (Go / Conditional Go / No-Go)

---

**You may now begin. Start with BLOCKER 1 (Pro verification validation).**

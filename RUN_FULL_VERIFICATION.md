# Session Starter: Full Test Suite & Verification Audit

## Context

Previous session completed a critical audit and fix for the **Article 9 GDPR consent columns missing from the users table** (blocking bug). All code changes are committed and pushed to `origin/main`. Migration 026 has been applied to the Supabase database.

**Goal of this session:** Run the full verification suite to confirm the entire stack is healthy and the Article 9 consent fix is fully operational end-to-end.

---

## What Was Fixed (Already Deployed)

- Database migration 026: added `article9_consent_accepted`, `article9_consent_version`, `article9_consent_accepted_at`, `article9_consent_revoked_at` to `public.users`
- TypeScript types aligned (`types/database.ts`)
- Analytics events added (`shared/analyticsEvents.ts`)
- Test mocks corrected (`__tests__/integration/checkout.integration.test.tsx`)
- Unused import cleaned (`app/(tabs)/settings.tsx`)
- Documentation corrected across `.liaison-docs/` (architecture, runtime-flows, known-bugs, index, roadmap, testing)
- Cookie consent smoke test passing (6–9s)
- Lint clean (0 warnings)
- Typecheck clean (no article9-related errors)

---

## Verification Checklist — Run in Order

### 1. Confirm Database State

```sql
-- Run in Supabase SQL Editor or via psql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
  AND column_name LIKE 'article9_consent%'
ORDER BY ordinal_position;
```

Expected: 4 rows returned (article9_consent_accepted, article9_consent_version, article9_consent_accepted_at, article9_consent_revoked_at).

### 2. Typecheck

```bash
cd Liaison-Keyboard
npm run typecheck
```

Expected: PASS (or at worst pre-existing unrelated errors in `app/index.tsx` about `readStringParam` and `token_hash` — these are legacy and not blocker).

### 3. Lint

```bash
npm run lint
```

Expected: PASS (0 errors, 0 warnings). If warnings appear, note them but they are pre-existing.

### 4. Unit Tests

```bash
npm run test
```

Expected: Majority pass. Some unit tests may be skipped or have pre-existing failures unrelated to this fix. Do NOT fix unrelated failures unless they block launch-readiness.

### 5. Web E2E Smoke Test

```bash
npm run test:web:e2e
```

Specifically watch for:
- `tests/cookie-consent-smoke.test.js` → should PASS (already saw 6.4s pass)
- `e2e/web/specs/smoke.spec.ts` → should PASS
- `e2e/web/specs/auth-chat-safe.spec.ts` → should PASS with or without credentials

If credentials (`E2E_TEST_EMAIL`, `E2E_TEST_PASSWORD`) are not set, the suite runs against mock auth and should still pass.

### 6. Mobile E2E (Optional — if device/simulator available)

```bash
npm run test:mobile:e2e        # iOS simulator (Detox)
npm run test:mobile:e2e:android # Android emulator
```

Only run if you have the mobile testing environment configured. Otherwise skip — not required for this verification pass.

### 7. Launch-Readiness Script

```bash
npm run test:launch-readiness
```

This runs unit + lint + typecheck + npm audit (high) + default e2e. Record any failures.

---

## Focus Areas to Confirm

### A. Article 9 Consent Service Works

1. Open app → Settings → Privacy
2. Toggle "Allow AI to process your messages" switch ON
3. Should see success toast (no crash)
4. Toggle OFF → should see revocation toast (no crash)

If toggles work without error, DB writes are functioning.

### B. Reply Generation Gate Passes

1. In chat screen, enter a message
2. Tap "Generate 3 replies"
3. Should generate successfully for a user with Article 9 consent
4. If consent not granted, should see a prompt/explanation (not a Postgres error)

### C. Cookie Consent Landing Pages

1. Visit `liaisonreply.com` (local or deployed)
2. Accept/Reject cookie banner → settings page updates immediately
3. Click "Cookie Settings" from any legal page → state reflects current choice
4. Check browser localStorage for `liaison_cookie_consent` key
5. Support page: "Start a New Thread" CTA appears only when `lk_deeplink` or session hint is present

---

## Reporting Format

When session completes, provide:

```
# Verification Report

## Database
- Migration 026 applied: YES/NO
- Columns present: YES/NO

## Typecheck
- Status: PASS / FAIL
- Errors: (list if any)

## Lint
- Status: PASS / FAIL
- Warnings: (list if any, but 0 expected)

## Unit Tests
- Status: PASS / FAIL
- Failures: (list)

## Web E2E
- Cookie consent smoke test: PASS / FAIL
- Smoke.spec.ts: PASS / FAIL
- Auth-chat-safe.spec.ts: PASS / FAIL

## Mobile E2E (if run)
- iOS: PASS / FAIL
- Android: PASS / FAIL

## Manual Spot-Checks
- Settings consent toggle: WORKING / CRASHING
- Chat generation gate: WORKING / ERROR
- Cookie banner → cookies page → support CTA alignment: WORKING / BROKEN

## Overall Health
- GREEN / YELLOW / RED
```

If anything fails, attach the exact error output and the file/line where it occurred.

---

## Notes

- Do NOT re-run the audit or re-explain the fix. The fix is already in code and deployed.
- This session is purely **verification**: confirm everything is working now.
- If new failures are discovered that are unrelated to the Article 9 fix, note them but do not fix them in this session unless they directly block the fix from being considered successful.
- The landing site (`Liaison-Keyboard-Landing/`) tests should be run from that directory.
- The app (`Liaison-Keyboard/`) tests should be run from the app directory.

---

## Quick Commands Summary

```bash
# From Liaison-Keyboard directory
cd Liaison-Keyboard
npm run typecheck
npm run lint
npm run test
npm run test:web:e2e

# From Liaison-Keyboard-Landing directory
cd Liaison-Keyboard-Landing
node tests/cookie-consent-smoke.test.js
```

---

**Start by confirming the migration is applied in Supabase, then run the full suite top to bottom.**

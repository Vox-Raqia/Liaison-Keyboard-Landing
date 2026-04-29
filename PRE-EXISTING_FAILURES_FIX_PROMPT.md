# Pre-Existing Failures — Fix Prompt for Fresh Session

## Context

The Liaison Keyboard workspace has **7 pre-existing test failures** unrelated to the Article 9 GDPR consent fix. All typecheck, lint, and unit tests pass (59 passed, 0 failed). The failures below are in the **Web E2E suite** and **1 skipped unit test suite**.

**Repo:** `C:\Users\Brand\OneDrive\Desktop\App\Liaison-Keyboard-Landing\Liaison-Keyboard`
**Stack:** Expo SDK 54, React 19, TypeScript, Supabase, Playwright E2E

---

## Failure Inventory

### 1. `e2e/web/specs/smoke.spec.ts` — Title Mismatch
- **Error:** `Expected pattern: /Liaison Keyboard/i` | `Received: "Liaison Reply | Communication Prosthetic for high-stakes messages"`
- **Cause:** App was rebranded from "Liaison Keyboard" to "Liaison Reply" but E2E test was not updated.
- **Fix:** Update line 6 to `/Liaison Reply/i`.

### 2. `e2e/web/specs/production-landing-smoke.spec.ts` — Console 403 Error
- **Error:** `Expected console errors: 0` | `Received: 1` — `Failed to load resource: the server responded with a status of 403 ()`
- **Cause:** External resource (Vercel Analytics, image, or font) returns 403 on the production landing page.
- **Fix:** Add an allowed-console-error filter for 403s on external resources, or identify and fix the blocked URL.

### 3. `e2e/web/specs/auth-chat-safe.spec.ts` — Request Timeout
- **Error:** `page.waitForRequest: Timeout 15000ms exceeded` waiting for `POST /functions/v1/generateLiaisonReplies`
- **Cause:** Mock auth flow doesn't trigger the expected network request to the generation endpoint.
- **Fix:** Assert on UI state (reply cards visible) instead of network request, or fix mock intercept.

### 4. `e2e/web/specs/billing-upgrade.spec.ts` — 4 Tests Failing
- **Errors:** All 4 tests fail with `getByText('Start monthly')` or `getByText('Start yearly and save 17%')` not visible.
- **Cause:** Billing/upgrade UI component (pricing card) is not rendering in the test environment.
- **Fix:** Ensure test navigates to a page/state where the pricing component renders. May need to mock auth to Free-tier user or verify paywall trigger conditions.

### 5. `e2e/web/specs/manual-batch-generate.spec.ts` — Selector Not Found
- **Error:** `getByLabel('Generate replies')` not visible after 15000ms timeout.
- **Cause:** The "Generate replies" button has a different accessibility label or test doesn't reach the correct page state.
- **Fix:** Check actual `accessibilityLabel` or `aria-label` on the generate button. Update selector. Verify test enters valid message first.

### 6. `e2e/web/specs/password-reset-recovery.spec.ts` — Root Recovery Redirect
- **Error:** Expected page body to contain `"Create a new password"` but received landing page content.
- **Cause:** The root URL with recovery hash (`/#reset-password?token_hash=...&type=recovery`) redirects to landing page instead of password reset form.
- **Fix:** Check root route handler in `app/index.tsx`. Recovery deep-link parsing at lines ~218-227 should redirect to reset-password route. Verify redirect logic handles hash-based routes correctly.

### 7. `__tests__/unit/authRegisterAttribution.test.tsx` — Skipped (ESM Parse Error)
- **Error:** `SyntaxError: Unexpected token 'export'` in `@react-navigation/native/lib/module/index.js`
- **Cause:** Jest `transformIgnorePatterns` doesn't fully cover all ESM packages in dependency chain.
- **Fix:** Expand `transformIgnorePatterns` in `jest.config.js` or mock `expo-router/head` import in test file.

---

## Execution Order

1. **Quick wins (5 min each):** #1 (title), #2 (console filter), #5 (button selector)
2. **Medium effort (15-30 min each):** #3 (mock intercept), #7 (ESM config)
3. **Requires debugging (30-60 min each):** #4 (billing UI visibility), #6 (recovery redirect)

---

## Constraints

- Do NOT modify production code unless a genuine bug is found (#6 recovery redirect may be a real bug).
- For E2E tests, prefer updating selectors/assertions over changing app code.
- All fixes must pass `npm run typecheck`, `npm run lint`, `npm run test`, and `npm run test:web:e2e` with 0 failures.

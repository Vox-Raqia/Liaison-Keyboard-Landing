## ✅ Completed (Wave 3 — Code & Docs)

- [x] Payment verification recovery validated (E2E 6/6 passed)
- [x] RLS restored on `processed_webhooks` (migration 025)
- [x] Article 9 consent service implemented + E2E integration
- [x] Root recovery hash redirect working
- [x] Default web E2E suite passing (13 passed, 2 skipped, 0 failed)
- [x] Typecheck + lint + Jest green
- [x] Compliance docs updated (4/5 DPAs archived)
- [x] PostHog DPA request process documented (CRA-blocked)

## ⏳ Pending (Human Actions)

### Phase 1 — Business Registration (Blocks DPA)

**Task:** Complete CRA business registration  
**Owner:** You  
**Why:** Legal entity name required for:
- PostHog DPA generator (company name field)
- Stripe Connect account (legal business name)
- Terms of Service / Privacy Policy footer
- Supabase billing contact

**Deliverable:** Business number + registered legal entity name + registered address  
**Target:** As soon as possible (estimated 2–6 weeks turnaround depending on jurisdiction)

---

### Phase 2 — PostHog DPA Execution (After CRA)

**Task:** Generate and obtain countersigned PostHog DPA  
**Owner:** You  
**Reference:** `docs/compliance/vendor-dpas/posthog-dpa-requested-2026-04-27.md`

Steps:

1. [ ] Navigate to <https://posthog.com/dpa>
2. [ ] Fill form with **registered** entity details
3. [ ] Click "Send for signature"
4. [ ] Wait 1–3 business days for `privacy@posthog.com` reply
5. [ ] Download countersigned PDF
6. [ ] Save as `docs/compliance/vendor-dpas/posthog-dpa-signed-YYYY-MM-DD.pdf`
7. [ ] Update `posthog-dpa-requested-2026-04-27.md` status to complete

**Target:** Within 1 week after CRA approval

---

### Phase 3 — Production Smoke Test (Can run any time after merge)

**Task:** Execute 9-step manual smoke on Vercel preview or production  
**Owner:** You  
**Reference:** `docs/audit/wave-3-execution-report.md` (smoke test section)

Steps:

1. [ ] Deploy `payment-verification-improvements` to Vercel  
   **Status:** Landing page ✅ deployed; full app web build ⚠️ environment config issue
2. [ ] Sign up new account → verify email → log in  
   **Status:** ⚠️ Requires full app build
3. [ ] Navigate to `/chat`, paste message, click Generate  
   **Status:** ⚠️ Requires full app build
4. [ ] Confirm 3 AI-generated replies appear (not blank, not error)  
   **Status:** ⚠️ Requires full app build
5. [ ] Copy one reply, verify thread saves  
   **Status:** ⚠️ Requires full app build
6. [ ] Sign out  
   **Status:** ⚠️ Requires full app build
7. [ ] Click Pro upgrade, complete Stripe checkout (use test card), verify Pro badge  
   **Status:** ⚠️ Requires full app build
8. [ ] Verify "Pro" badge in Settings; "Restore Pro Access" shows "Access active"  
   **Status:** ⚠️ Requires full app build
9. [ ] Create thread → delete it → confirm deletion  
   **Status:** ⚠️ Requires full app build
10. [ ] Sign out  
   **Status:** ⚠️ Requires full app build

Record any failures with screenshots in `docs/audit/wave-3-execution-report.md`.

**Target:** Within 3 days of deployment after build fix

**Note:** Local E2E suite (13/13 passing) provides sufficient confidence for merge. Full production smoke is recommended but not a merge blocker.

---

### Phase 4 — Merge to Main

**Pre-conditions:**

- [x] CRA registration complete (legal entity known)
- [ ] PostHog DPA submitted (awaiting counter-signature is acceptable)
- [ ] Production smoke test executed (recommended, not blocking)

**Merge action:**

```bash
git checkout main
git merge payment-verification-improvements
git push origin main
```

**Target:** After CRA registration (DPA fillable)

---

## 📊 Current Readiness

| Section | Score | Status |
|---------|------:|--------|
| Engineering & Development | 9/10 | ✅ Substantial |
| QA & Testing | 9/10 | ✅ Substantial |
| Data Management & Security | 9/10 | ✅ Substantial |
| Compliance & Regulatory | 7/10 | ⏳ Pending CRA |
| Vendor & Partnership | 8/10 | ⏳ Pending DPA |

**Overall: 82% — Conditional Go**
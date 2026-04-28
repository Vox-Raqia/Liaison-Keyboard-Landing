# 03 Roadmap

## Current Status (2026-04-27)

**Overall Readiness:** 82% — Conditional Go  
**Branch:** `payment-verification-improvements` (clean, ready to merge)  
**Last Wave:** Wave 3 — Critical path blockers closed

## Completed Milestones

### Wave 1 — Foundation (COMPLETE ✅)
- [x] MVP mobile app with core reply generation
- [x] Supabase backend with auth and data persistence
- [x] Stripe integration for monetization
- [x] Basic E2E test suite

### Wave 2 — Polish & Recovery (COMPLETE ✅)
- [x] Payment verification reliability improvements
- [x] Settings UI enhancements
- [x] Basic consent framework
- [x] Initial compliance documentation

### Wave 3 — Critical Path Closure (COMPLETE ✅)
- [x] Payment verification recovery (35-min window, fast fallback)
- [x] Article 9 consent service + E2E integration
- [x] Root recovery hash redirect
- [x] Database RLS re-enabled on `processed_webhooks`
- [x] Test expectations aligned with current UI
- [x] 4/5 vendor DPAs collected
- [x] PostHog DPA process documented

## Near-Term Milestones (Next 2 Weeks)

### Milestone 4 — Compliance Closure (BLOCKED ⏳)
- [ ] Complete CRA business registration (2–6 weeks)
- [ ] Generate PostHog DPA (1–3 business days after CRA)
- [ ] Archive signed DPA in compliance folder
- [ ] Update compliance scores from 7/10 → 10/10

### Milestone 5 — Production Deployment (RECOMMENDED)
- [ ] Fix Expo web build for Vercel deployment
- [ ] Execute 9-step production smoke test
- [ ] Resolve any smoke test failures
- [ ] Deploy to production Vercel
- [ ] Monitor for 24 hours

### Milestone 6 — Merge to Main (BLOCKED on DPA)
- [ ] Merge `payment-verification-improvements` → `main`
- [ ] Tag release v1.0.0-rc1
- [ ] Deploy to production environment
- [ ] Begin soft launch marketing

## Long-Term Milestones (3–12 Months)

### Month 1–2 — Acquisition & Growth
- [ ] Finalize DPA and complete compliance closure
- [ ] Soft launch on Product Hunt
- [ ] Initial user acquisition (100 paid users target)
- [ ] Marketing UGC campaign (TikTok split-screen)
- [ ] Advanced thread linking features

### Month 3–6 — Platform Expansion
- [ ] iOS native keyboard extension
- [ ] Android native keyboard extension
- [ ] Safari extension for desktop
- [ ] Chrome extension
- [ ] Cross-platform sync

### Month 6–12 — Scale & Optimization
- [ ] Premium tier optimization
- [ ] B2B/Enterprise pilot program
- [ ] Advanced analytics and insights
- [ ] Team collaboration features
- [ ] API for third-party integrations

### Year 2+ — Market Leadership
- [ ] Acquisition target: Match Group, Meta, or Apple
- [ ] International expansion (EU, LATAM, APAC)
- [ ] Advanced AI features (multilingual, voice)
- [ ] Platform for mental health professionals

## Success Metrics

### Technical Metrics
- [x] Typecheck: PASS
- [x] Lint: PASS
- [x] Unit tests: 59 suites PASS
- [x] Default E2E suite: 13/13 PASS
- [x] Billing E2E: 6/6 PASS
- [ ] Production smoke test: PENDING (build config)

### Business Metrics
- [ ] 100 paid users (Month 1)
- [ ] $7.99 ARPU (monthly plan)
- [ ] <5% churn rate
- [ ] >40% weekly active retention
- [ ] Positive unit economics (Gemini 2.5 Flash costs)

### Compliance Metrics
- [x] Typecheck: PASS
- [x] Lint: PASS  
- [x] Unit tests: 59 suites PASS
- [x] E2E tests: 13/13 default PASS
- [x] 4/5 DPAs collected
- [ ] PostHog DPA: PENDING (CRA)
- [ ] DPIA signed off: PENDING

## Critical Path

```
CRA Registration (2-6 weeks)
    ↓
PostHog DPA Generation (1-3 days)
    ↓
Merge to Main
    ↓
Production Deployment
    ↓
Soft Launch
    ↓
User Acquisition
    ↓
Acquisition Exit (5 years)
```

## Known Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| CRA registration delays | High | Medium | Start ASAP; parallel workstreams |
| PostHog DPA negotiation | Medium | Low | Process documented; standard template |
| Expo web build issues | Medium | High | Local builds working; Vercel config fix needed |
| iOS App Store rejection | High | Medium | Follow guidelines; prepare for review |
| User acquisition costs | Medium | Medium | Organic/social strategy; low CAC target |
| Competition from big tech | High | Low | Focus on niche; deep features |

## Resource Requirements

### Immediate (Next 2 Weeks)
- Legal: Register business entity with CRA
- Engineering: Fix Expo web build for Vercel
- Marketing: Prepare Product Hunt launch assets

### Short-Term (Next 2 Months)  
- Engineering: iOS/Android keyboard extensions
- Design: App Store assets, marketing materials
- Growth: UGC campaign execution
- Legal: Ongoing compliance monitoring

### Long-Term (Next 12 Months)
- All of the above + team expansion as needed
- Potential seed funding for growth acceleration
- Strategic partnerships and integrations
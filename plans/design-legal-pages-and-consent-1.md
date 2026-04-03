---
goal: Harden and upgrade the legal, support, and shared utility-page shell into a premium system while adding visible consent-management state on the cookies settings page without destabilizing the existing shared consent logic
version: 2.0
date_created: 2026-04-02
last_updated: 2026-04-02
owner: Landing repo
status: Planned
tags: [design, legal, support, consent, ux, bug, hardening]
---

# Introduction

![Status: Planned](https://img.shields.io/badge/status-Planned-blue)

This plan upgrades the existing utility-page shell in the Liaison Keyboard
landing repo into a premium, professional content system and closes the real
consent-management gap: the homepage banner already sets consent, but the
cookies settings page does not yet behave like a polished, stateful
preference-management surface. The plan is intentionally scoped as a targeted
enhancement of the current shared shell and current consent path, not a
ground-up rebuild.

## 1. Requirements & Constraints

- **REQ-001**: Upgrade `cookies.html`, `privacy.html`, `terms.html`, and
  `support.html` so they present as premium, professional product pages with
  strong hierarchy, clearer information grouping, and intentional visual
  framing.
- **REQ-002**: Apply the same shell hardening to all pages using the same shared
  header/button/footer template, including `scenarios/difficult-boss.html`,
  `scenarios/mixed-signals-dating.html`, and
  `scenarios/set-a-boundary-with-family.html`.
- **REQ-003**: Preserve all user-facing naming as `Liaison Keyboard`.
- **REQ-004**: Preserve factual policy, support, billing, and product-truth
  content while improving layout, scannability, trust signaling, and
  readability.
- **REQ-005**: Keep the homepage banner in `index.html` as the first-choice
  consent surface for unauthorized visitors.
- **REQ-006**: Make `cookies.html` a fully functional later-management surface
  where a visitor can grant continuity consent after previously declining it or
  revoke continuity consent after previously granting it.
- **REQ-007**: Show the current consent state on `cookies.html` immediately on
  load, including whether continuity cookies are currently allowed.
- **REQ-008**: Show a visible result message after each consent change on
  `cookies.html`, including what changed and what was cleared or enabled.
- **REQ-009**: Update storage and visible UI immediately after consent changes
  without requiring a full page reload.
- **REQ-010**: Preserve the existing consent object shape and shared state
  transition semantics already used by the boot-time `gtag` snippet and by
  `site.js`.
- **REQ-011**: Preserve and harden CTA/session behavior for both
  `data-session-primary` and `data-session-secondary` controls across all pages
  that use the shared shell.
- **REQ-012**: Ensure revoking continuity consent clears `lk_deeplink` and
  `liaison_auth_hint`, and rehydrates CTA/session state consistently across the
  site.
- **REQ-013**: Add a professional support-page layout with clearer action
  hierarchy for contact, billing portal access, account entry points, and policy
  references.
- **REQ-014**: Fix currently referenced but visually weak or undefined shared
  classes such as `button-secondary`, `button-ghost`, `cta-row-compact`, and
  `is-hidden`.
- **REQ-015**: Scope premium utility-page design changes so they cannot
  accidentally restyle the homepage or other unrelated sections.
- **REQ-016**: Keep all pages responsive and visually polished on mobile,
  tablet, laptop, and wide desktop widths.
- **REQ-017**: Add at least one automated browser-based smoke path for
  consent-state behavior and shared-shell stability.
- **REQ-018**: Keep implementation inside the static landing architecture with
  HTML, CSS, and JavaScript only.
- **SEC-001**: Do not weaken consent defaults. No optional continuity cookies or
  analytics consent should be granted before explicit user action.
- **SEC-002**: Do not alter storage key names or consent payload shape casually
  because they are already read in repeated head snippets before `site.js`
  executes.
- **CON-001**: Do not change core CTA routes into `app.liaisonkeyboard.com`
  unless a route is verifiably wrong.
- **CON-002**: Do not introduce a framework, CSS library, state library, or
  build-step dependency.
- **CON-003**: Reuse the existing dark editorial aesthetic and teal-led accent
  direction, but increase sophistication through composition, rhythm, contrast,
  and module framing.
- **CON-004**: Keep legal claims honest to the current shipped product. Do not
  overstate privacy, automation, or memory behavior.
- **CON-005**: Localhost validation is insufficient for root-domain secure
  cookie behavior. Approval must include an HTTPS host validation pass for
  production-representative consent behavior.
- **PAT-001**: Treat the current `applyCookieConsent()` flow in `site.js` as the
  canonical state transition path and build additive UI hydration around it
  rather than rewriting it without necessity.
- **PAT-002**: Use a utility-page wrapper class for all premium legal/support
  styling to isolate changes from the homepage and other landing sections.
- **PAT-003**: Use reusable section, card, action, and metadata patterns in
  `site.css` so all utility pages share one system instead of per-page styling.
- **PAT-004**: Prefer grouped, modular content surfaces over long raw text
  stacks.
- **GUD-001**: Trust should come from structured presentation, good typography,
  and clear preference management rather than decorative effects.
- **GUD-002**: The cookies settings page should feel like account-grade
  preference management, not a thin legal paragraph with two buttons.
- **GUD-003**: Changes should improve professionalism without creating
  legal-content readability regressions.

### Context Map

#### Files to Modify

| File                                        | Purpose                 | Changes Needed                                                                                                                                           |
| ------------------------------------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cookies.html`                              | Cookies settings page   | Add premium page structure, current-state module, consent-result surface, and clearer preference controls.                                               |
| `privacy.html`                              | Privacy policy page     | Move from text-heavy layout into a premium legal-information system with grouped sections and trust-oriented hierarchy.                                  |
| `terms.html`                                | Terms page              | Apply the shared premium legal layout and better grouping of responsibility, billing, support, and consent topics.                                       |
| `support.html`                              | Support page            | Rework into a premium support hub with clear entry points, billing, email support, and policy links.                                                     |
| `index.html`                                | Homepage banner source  | Keep first-visit consent behavior stable and verify no regressions in the banner UI or CTA hydration.                                                    |
| `scenarios/difficult-boss.html`             | Shared shell consumer   | Validate and align header/button/footer shell behavior after shared utility-page styling changes.                                                        |
| `scenarios/mixed-signals-dating.html`       | Shared shell consumer   | Validate and align header/button/footer shell behavior after shared utility-page styling changes.                                                        |
| `scenarios/set-a-boundary-with-family.html` | Shared shell consumer   | Validate and align header/button/footer shell behavior after shared utility-page styling changes.                                                        |
| `site.css`                                  | Shared visual system    | Add wrapper-scoped utility-page design system, missing button variants, compact CTA row treatment, shell polish, and cookies-page status styling.        |
| `site.js`                                   | Shared runtime behavior | Add cookies-page state hydration, result messaging, secondary CTA hydration, and shared-shell parity without destabilizing existing consent transitions. |
| `README.md`                                 | Repo documentation      | Update behavior notes only if the documented runtime behavior changes materially.                                                                        |

#### Dependencies (may need updates)

| File                                                                                                                         | Relationship                                                                                                                 |
| ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `index.html`                                                                                                                 | Owns the first-visit cookie banner and must stay behaviorally aligned with `cookies.html`.                                   |
| `site.js`                                                                                                                    | Already owns `applyCookieConsent()` and shared cookie action wiring; should be extended rather than unnecessarily rewritten. |
| `site.css`                                                                                                                   | Contains global selectors for buttons, header, footer, and banner that must not be changed carelessly.                       |
| `README.md`                                                                                                                  | Describes current client-side behavior and should remain consistent with the implemented shell and consent flow.             |
| Repeated head snippets in `index.html`, `cookies.html`, `privacy.html`, `terms.html`, `support.html`, and `scenarios/*.html` | Read the consent payload before `site.js` runs and therefore constrain consent object shape changes.                         |

#### Test Files

| Test                                                             | Coverage                                                                                      |
| ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| No dedicated utility-page or consent smoke tests currently exist | Requires new browser-based smoke coverage plus manual QA across local and HTTPS environments. |

#### Reference Patterns

| File         | Pattern                                                                                       |
| ------------ | --------------------------------------------------------------------------------------------- |
| `index.html` | Premium homepage composition, trust spacing, CTA rhythm, and cookie banner structure.         |
| `site.css`   | Existing global design language and responsive breakpoints at `1080px`, `900px`, and `640px`. |
| `site.js`    | Existing `data-*` initializer pattern and shared CTA hydration model.                         |

#### Risk Assessment

- [ ] Breaking changes to public API
- [ ] Database migrations needed
- [x] Configuration changes required

## 2. Implementation Steps

### Implementation Phase 1

- **GOAL-001**: Re-baseline the work as a targeted enhancement of the existing
  shell and consent path, then lock the exact runtime and layout contract before
  implementation.

| Task         | Description                                                                                                                                                                                                                                | Completed | Date |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- | ---- |
| **TASK-001** | Audit all pages that use the shared utility shell: `cookies.html`, `privacy.html`, `terms.html`, `support.html`, and `scenarios/*.html`. Record repeated structure and any shared broken or visually weak classes.                         |           |      |
| **TASK-002** | Inventory behavior gaps separately from styling gaps. Explicitly separate: existing shared consent logic that already works, cookies-page state hydration that is missing, and `data-session-secondary` behavior that is currently absent. |           |      |
| **TASK-003** | Freeze the current consent payload shape and storage key names as a runtime constraint unless a cross-page head-snippet update is performed in the same change.                                                                            |           |      |
| **TASK-004** | Define a wrapper-scoped utility-page design system in `site.css`, including the exact wrapper class that will contain all header/footer/button/layout overrides for legal, support, and scenario shell pages.                              |           |      |
| **TASK-005** | Define the cookies settings markup contract: current-state readout, result/confirmation region, active-state button treatment, and focus/announcement behavior after updates.                                                              |           |      |
| **TASK-006** | Define the environment test matrix for consent behavior: local HTTP validation scope versus HTTPS liaisonkeyboard.com validation scope.                                                                                                    |           |      |

### Implementation Phase 2

- **GOAL-002**: Implement the premium utility-page design system without causing
  homepage regressions.

| Task         | Description                                                                                                                                                                                                            | Completed | Date |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| **TASK-007** | Add wrapper-scoped utility-page layout primitives in `site.css` for hero framing, metadata bands, grouped legal cards, action cards, support modules, and premium spacing rhythm.                                      |           |      |
| **TASK-008** | Add missing or weak shared shell styles in `site.css` for `button-secondary`, `button-ghost`, `cta-row-compact`, and `is-hidden`, then verify their behavior under the utility-page wrapper and shared shell contexts. |           |      |
| **TASK-009** | Add wrapper-scoped header and footer refinements so utility pages feel premium while the homepage remains visually unchanged.                                                                                          |           |      |
| **TASK-010** | Refactor `privacy.html`, `terms.html`, `support.html`, and `cookies.html` markup to use the new shared utility-page design system while preserving factual content.                                                    |           |      |
| **TASK-011** | Reorganize `support.html` into premium SaaS-style support modules: direct contact, billing portal, account entry points, and policy references with clearer action priority.                                           |           |      |
| **TASK-012** | Verify scenario pages inherit the shared shell fixes cleanly or add minimal wrapper markup adjustments where needed so shell parity is maintained.                                                                     |           |      |

### Implementation Phase 3

- **GOAL-003**: Add visible consent-management state and shared-shell CTA parity
  without destabilizing the existing consent transition logic.

| Task         | Description                                                                                                                                                                       | Completed | Date |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| **TASK-013** | Extend `site.js` additively around the existing `applyCookieConsent()` path. Do not rewrite the canonical transition flow unless a specific bug requires it.                      |           |      |
| **TASK-014** | Add a cookies-page state hydrator in `site.js` that updates `[data-cookie-preference-status]`, button selected states, and a result message region on load and after each action. |           |      |
| **TASK-015** | Add `data-session-secondary` hydration logic in `site.js`, including signed-in visibility, signed-out hiding, and correct `href` generation for the new-thread CTA.               |           |      |
| **TASK-016** | Ensure revoking consent clears `lk_deeplink` and `liaison_auth_hint`, updates CTA/session labels immediately, and leaves only necessary-site behavior active.                     |           |      |
| **TASK-017** | Add accessible consent feedback semantics: current-state surface, polite result region, selected button state, and deterministic focus behavior after preference changes.         |           |      |
| **TASK-018** | Audit the repeated boot-time consent snippets across homepage, legal/support pages, and scenario pages to ensure they remain consistent with the runtime consent object shape.    |           |      |

### Implementation Phase 4

- **GOAL-004**: Validate shell quality, trust quality, and consent behavior
  across page types and environments.

| Task         | Description                                                                                                                                                                       | Completed | Date |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| **TASK-019** | Run responsive QA on `cookies.html`, `privacy.html`, `terms.html`, `support.html`, and all scenario pages at `320px`, `375px`, `390px`, `768px`, `900px`, `1080px`, and `1440px`. |           |      |
| **TASK-020** | Verify the redesigned utility pages read as premium and professional, with no oversized text walls, dead space, broken utility classes, or accidental homepage regressions.       |           |      |
| **TASK-021** | Verify homepage first-visit consent still works for unauthorized visitors and that later revocation or later opt-in from `cookies.html` updates the UI immediately.               |           |      |
| **TASK-022** | Verify `data-session-primary` and `data-session-secondary` behavior across signed-out, session-active, and continuity-revoked states.                                             |           |      |
| **TASK-023** | Add at least one automated browser smoke path covering homepage banner consent, cookies-page updates, and secondary CTA state.                                                    |           |      |
| **TASK-024** | Run the environment matrix: local HTTP for UI behavior and storage fallbacks, plus HTTPS host verification for root-domain secure cookie persistence/deletion behavior.           |           |      |
| **TASK-025** | Update `README.md` if the documented runtime behavior or shared shell behavior changes materially after implementation.                                                           |           |      |

## 3. Alternatives

- **ALT-001**: Rebuild the legal and support pages from scratch. Rejected
  because the repo already has a shared shell and the real gap is shell
  hardening plus consent-state UI, not a full reboot.
- **ALT-002**: Style only the four legal/support pages and ignore the scenario
  pages. Rejected because the same shell and CTA issues appear on
  `scenarios/*.html`.
- **ALT-003**: Rewrite the consent engine completely. Rejected because the
  existing shared consent transition path already works and the missing piece is
  visible state hydration plus shell parity.
- **ALT-004**: Fix only cookies-page behavior without redesigning the pages.
  Rejected because weak utility-page presentation undermines trust exactly where
  visitors expect premium professionalism.

## 4. Dependencies

- **DEP-001**: Existing consent storage keys and consent payload shape in
  `site.js` and the repeated head snippets must remain aligned.
- **DEP-002**: Existing CTA hydration behavior for `data-session-primary` must
  remain stable while secondary CTA support is added.
- **DEP-003**: Existing homepage visual language in `index.html` and `site.css`
  is the reference point for premium uplift and must not regress.
- **DEP-004**: The legal/support copy must remain aligned with the current
  product, billing, privacy, and memory reality.
- **DEP-005**: HTTPS host validation is required before final sign-off on secure
  root-domain cookie behavior.

## 5. Files

- **FILE-001**: `cookies.html` for cookies settings UX, visible consent-state
  structure, and premium utility-page layout markup.
- **FILE-002**: `privacy.html` for premium utility-page legal layout markup.
- **FILE-003**: `terms.html` for premium utility-page legal layout markup.
- **FILE-004**: `support.html` for premium utility-page support-hub markup.
- **FILE-005**: `index.html` for homepage banner parity verification and any
  minimal required shell alignment.
- **FILE-006**: `scenarios/difficult-boss.html` for shared-shell parity
  verification or small wrapper updates.
- **FILE-007**: `scenarios/mixed-signals-dating.html` for shared-shell parity
  verification or small wrapper updates.
- **FILE-008**: `scenarios/set-a-boundary-with-family.html` for shared-shell
  parity verification or small wrapper updates.
- **FILE-009**: `site.css` for wrapper-scoped utility-page design system,
  missing shell classes, and responsive polish.
- **FILE-010**: `site.js` for cookies-page UI hydration, secondary CTA
  hydration, and consent bootstrap parity support.
- **FILE-011**: `README.md` for documentation updates if runtime behavior
  changes need to be recorded.

## 6. Testing

- **TEST-001**: Verify homepage cookie-banner actions for a visitor with no
  prior consent choice.
- **TEST-002**: Verify `cookies.html` can grant continuity consent after an
  initial necessary-only choice.
- **TEST-003**: Verify `cookies.html` can revoke continuity consent after an
  initial accept-all choice.
- **TEST-004**: Verify current consent state on `cookies.html` renders correctly
  on first paint.
- **TEST-005**: Verify result messaging on `cookies.html` updates immediately
  after each action.
- **TEST-006**: Verify `data-session-primary` labels and destinations stay
  coherent when continuity consent changes.
- **TEST-007**: Verify `data-session-secondary` visibility and `href` hydration
  for signed-out and session-active states.
- **TEST-008**: Verify redesigned utility pages render professionally on mobile
  and desktop with no broken shared-shell classes.
- **TEST-009**: Verify scenario pages do not regress after shared-shell styling
  changes.
- **TEST-010**: Verify there are no console errors caused by the utility-page
  redesign or consent-state enhancement.
- **TEST-011**: Verify HTTPS host behavior for secure root-domain cookie
  creation and deletion before final approval.

## 7. Risks & Assumptions

- **RISK-001**: Wrapper-scoped design work may leak into the homepage if
  selectors are not isolated. Mitigation: require a utility-page wrapper and
  explicit homepage no-regression checks.
- **RISK-002**: Adding missing button classes globally may expose hidden
  controls in the wrong states. Mitigation: add explicit
  `data-session-secondary` behavior support and signed-in/signed-out
  verification.
- **RISK-003**: Consent changes may appear broken if storage updates but visible
  UI state does not refresh. Mitigation: centralize visible cookies-page state
  rendering around the existing consent transition path.
- **RISK-004**: Secure root-domain cookie behavior may pass locally but fail in
  production-like environments. Mitigation: add explicit HTTPS-host validation
  before approval.
- **RISK-005**: Over-stylizing legal content could reduce readability.
  Mitigation: prioritize hierarchy, grouping, and rhythm over decorative
  treatment.
- **ASSUMPTION-001**: The current factual copy is directionally correct and
  mainly needs shell, layout, and interaction improvements rather than a legal
  rewrite.
- **ASSUMPTION-002**: The existing consent transition path is broadly correct
  and should be enhanced, not replaced, unless a targeted defect is found during
  implementation.
- **ASSUMPTION-003**: Unauthorized visitors should continue to make their first
  consent choice from the homepage banner, with `cookies.html` serving as the
  later-management surface.
- **ASSUMPTION-004**: Scenario pages should remain visually consistent with the
  upgraded shell even if their body content is not redesigned as heavily as the
  legal/support pages.

## 8. Related Specifications / Further Reading

- `README.md`
- `index.html`
- `site.css`
- `site.js`
- `cookies.html`
- `privacy.html`
- `terms.html`
- `support.html`
- `scenarios/difficult-boss.html`
- `scenarios/mixed-signals-dating.html`
- `scenarios/set-a-boundary-with-family.html`

---
goal: Replace the text-only hero proof board with a screenshot-led workflow story that matches the annotated design feedback
version: 1.0
date_created: 2026-04-01
last_updated: 2026-04-01
owner: Landing repo
status: Planned
tags: [design, feature, hero, responsive, screenshots]
---

# Introduction

![Status: Planned](https://img.shields.io/badge/status-Planned-blue)

This plan converts the current text-driven hero proof board into a screenshot-led workflow story for Liaison Keyboard. The target outcome is a concise, manually controlled slide module that shows a believable message-to-reply flow, avoids narrow-width overlap, and uses real app-derived visuals instead of explanation-heavy copy.

## 1. Requirements & Constraints

- **REQ-001**: Replace the current `.hero-proof-board` in `index.html` with a screenshot-led story module that demonstrates one complete Liaison Keyboard workflow from incoming text to drafted reply.
- **REQ-002**: Use authentic app-derived screenshots for the slide sequence. `assets/previews/demo-mobile-stage.png` may be used only as a temporary placeholder if new captures are not ready.
- **REQ-003**: Reduce explanatory copy inside the slide module. Each slide may include a short title and one concise support line, but the screenshot must carry the primary meaning.
- **REQ-004**: Replace large back and next buttons with small translucent arrow controls that visually suggest manual slide navigation without dominating the frame.
- **REQ-005**: Ensure the Google Messages screenshots place the latest message near the composer area or lower portion of the phone frame so the thread reads like a real, current conversation.
- **REQ-006**: Guarantee that hero copy, slide caption text, and phone imagery never overlap at narrow desktop widths or mobile widths. Validate specifically at 320px, 375px, 390px, 768px, 1024px, and 1280px.
- **REQ-007**: Keep the module keyboard accessible with focusable controls, `aria-label` support, and deterministic state updates. Manual navigation is the default interaction model.
- **REQ-008**: Preserve the full product name `Liaison Keyboard` in all user-facing copy, captions, labels, and documentation updates.
- **REQ-009**: Keep the hero aligned to the existing product truth: manual review, edit, and copy flow. Do not imply auto-send, voice, avatar, or unrelated assistant features.
- **CON-001**: Implement within the static site architecture only: `index.html`, `site.css`, `site.js`, and static assets.
- **CON-002**: Keep existing CTA routes, session-aware link hydration, and cookie logic intact.
- **CON-003**: Do not introduce a new framework, build tool, or carousel dependency.
- **CON-004**: Keep the site visually aligned with the existing dark surface system and teal-led accent palette.
- **PAT-001**: Follow the repo’s current `data-*` attribute pattern for hero interactivity so the new module stays consistent with `initHeroExamples()` and other JS initializers.
- **PAT-002**: Keep the use-case breadth lower on the page. The hero should show one canonical proof story instead of trying to explain work, dating, and family simultaneously.
- **GUD-001**: Prefer a screenshot-first story rail over text overlays because the annotated review specifically calls for the slide to speak for itself.
- **GUD-002**: Prefer deterministic, compressed asset naming for future replacements: `hero-story-01-*`, `hero-story-02-*`, and so on.

### Context Map

#### Files to Modify

| File | Purpose | Changes Needed |
|------|---------|----------------|
| `index.html` | Homepage hero markup | Replace the current tabbed `.hero-proof-board` content with a screenshot story shell, concise caption area, and small arrow controls. |
| `site.css` | Hero visual system and responsive layout | Add layout rules for a screenshot story component, narrow-width safeguards, control styling, caption spacing, and phone frame sizing. |
| `site.js` | Hero interaction logic | Replace `initHeroExamples()` with `initHeroStory()` or equivalent data-driven slide logic using `data-*` hooks for previous, next, and state updates. |
| `assets/previews/demo-mobile-stage.png` | Existing reference preview asset | Reuse only as a temporary fallback or composition reference if new slide assets are delayed. |
| `assets/previews/hero-story-01-*.png` through `assets/previews/hero-story-04-*.png` | New hero story screenshots | Add four to five app-derived screenshots that show the actual workflow progression. |
| `plans/design-hero-screenshot-story-1.md` | Implementation plan | Track requirements, scope, and execution details for the redesign. |

#### Dependencies (may need updates)

| File | Relationship |
|------|--------------|
| `README.md` | Documents that the site uses plain HTML/CSS/JS and currently includes interactive hero behavior in `site.js`. |
| `docs/landing-reconciliation-execution-plan.md` | Historical reference confirming the landing should use real product previews rather than placeholder proof panels. |
| `../Liaison-Keyboard` app repo | Source of truth for real screenshot capture and workflow authenticity. |

#### Test Files

| Test | Coverage |
|------|----------|
| No dedicated automated landing tests currently exist | Validation will be manual unless Playwright coverage is added as a follow-on improvement. |

#### Reference Patterns

| File | Pattern |
|------|---------|
| `site.js` | Uses small initializer functions and `data-*` selectors rather than inline scripts. |
| `site.css` | Uses component-scoped class blocks with mobile overrides in a final `@media (max-width: 640px)` section. |
| `assets/previews/demo-mobile-stage.png` | Shows the existing visual direction for a phone-framed message UI and can inform framing, density, and legibility. |

#### Risk Assessment

- [ ] Breaking changes to public API
- [ ] Database migrations needed
- [x] Configuration changes required

## 2. Implementation Steps

### Implementation Phase 1

- **GOAL-001**: Lock the hero story structure, slide content, and asset requirements before changing markup.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| **TASK-001** | Audit the current hero block in `index.html` and formally retire the scenario-tab concept from the hero only. Keep scenario breadth in lower-page sections such as use cases and scenario pages. |  |  |
| **TASK-002** | Define a single canonical story deck with 4 to 5 slides: incoming message, Liaison Keyboard triage, strongest draft selection, copied reply returned to the thread, and optional calm resolution. |  |  |
| **TASK-003** | Capture or export app-derived screenshots from the product repo using a consistent phone frame, realistic message content, and the latest message positioned near the composer or bottom of the visible thread. |  |  |
| **TASK-004** | Write final slide metadata for `site.js`: `eyebrow`, `title`, `caption`, `image`, `alt`, and `stepLabel`. Keep each caption to one sentence. |  |  |

### Implementation Phase 2

- **GOAL-002**: Replace the current text board markup with a screenshot-first hero story shell.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| **TASK-005** | In `index.html`, replace the `.hero-proof-switch`, `.hero-proof-message`, and `.hero-proof-replies` block with a new `.hero-story` structure that includes a phone-stage container, a caption rail, a step indicator, and arrow controls. |  |  |
| **TASK-006** | Add deterministic `data-*` hooks in `index.html`: `data-hero-story-image`, `data-hero-story-title`, `data-hero-story-caption`, `data-hero-story-step`, `data-hero-story-prev`, and `data-hero-story-next`. |  |  |
| **TASK-007** | Keep a no-JS first-slide fallback in the static HTML so the hero still renders a credible proof state before `site.js` enhances it. |  |  |
| **TASK-008** | Preserve the current CTA cluster and trust pills in the left column. Do not expand hero copy to explain the slider; the visual module must do that work. |  |  |

### Implementation Phase 3

- **GOAL-003**: Implement layout, interaction, and responsive safeguards so the story module works across narrow desktop and mobile widths.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| **TASK-009** | In `site.css`, create a dedicated `.hero-story` layout using `display: grid`, `minmax(0, ...)`, and explicit `min-width: 0` rules on text containers so caption text cannot overlap the phone image at narrow desktop widths. |  |  |
| **TASK-010** | Style the arrow controls as small translucent circular buttons with subtle borders and hover/focus states. Do not use large filled pills for navigation. |  |  |
| **TASK-011** | Add responsive rules for `<= 1024px` and `<= 640px` so the caption rail stacks below or above the phone frame instead of compressing into it. |  |  |
| **TASK-012** | In `site.js`, replace `initHeroExamples()` with `initHeroStory()` that reads a slide array, updates the DOM deterministically, and wires previous/next controls with wraparound behavior. |  |  |
| **TASK-013** | Add keyboard support for left and right arrow keys when the hero story has focus, and update `aria-label` or `aria-live` content only for the active slide metadata. |  |  |
| **TASK-014** | Do not autoplay the deck in phase 1. If motion is added later, it must respect `prefers-reduced-motion` and pause on user interaction. |  |  |

### Implementation Phase 4

- **GOAL-004**: Complete verification and bundle the likely follow-on improvements that should be planned now.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| **TASK-015** | Run a manual viewport QA pass at 320px, 375px, 390px, 768px, 1024px, 1280px, and 1440px. Confirm there is no copy overlap, clipping, or control collision. |  |  |
| **TASK-016** | Verify the hero story remains honest to the app: one incoming message, Liaison Keyboard triage or draft step, and copy-back-to-thread flow. Remove any slide that feels staged or duplicates surrounding page copy. |  |  |
| **TASK-017** | Optimize new screenshot assets for web delivery and ensure the homepage loads without a visible layout shift when the first hero image appears. |  |  |
| **TASK-018** | Prepare a follow-on task to add browser-based regression coverage for the hero story once the redesign ships, using static-page QA or Playwright snapshots. |  |  |
| **TASK-019** | Prepare a follow-on task to reuse the screenshot-story component pattern in the workflow or scenario pages only after the homepage version is stable and content-approved. |  |  |

## 3. Alternatives

- **ALT-001**: Keep the current text-only hero proof board and only adjust spacing. Rejected because it does not satisfy the screenshot-led storytelling request and does not address the annotated request for self-explanatory slides.
- **ALT-002**: Keep the scenario tabs and place multiple slide decks behind each tab. Rejected for phase 1 because it adds interaction complexity before the base screenshot-story layout is proven stable.
- **ALT-003**: Overlay all explanatory text directly on top of screenshots. Rejected because it increases overlap risk and directly conflicts with the request to let the slide speak for itself.
- **ALT-004**: Add autoplay with pause controls immediately. Rejected because manual navigation is simpler, calmer, and better aligned with the deliberate-review positioning of Liaison Keyboard.

## 4. Dependencies

- **DEP-001**: Fresh app-derived screenshots from the `Liaison-Keyboard` repo are required for the final visual pass.
- **DEP-002**: Existing hero CTA and session hydration logic in `site.js` must remain untouched while the hero interaction initializer is replaced.
- **DEP-003**: Existing dark theme tokens and button treatments in `site.css` provide the baseline look for the new story module.
- **DEP-004**: `assets/previews/demo-mobile-stage.png` can serve as a temporary reference or fallback while final screenshots are being prepared.

## 5. Files

- **FILE-001**: `index.html` for hero markup replacement and new `data-*` hooks.
- **FILE-002**: `site.css` for story layout, control styling, and narrow-width fixes.
- **FILE-003**: `site.js` for slide state, previous/next behavior, and accessibility updates.
- **FILE-004**: `assets/previews/hero-story-01-incoming.png` for the incoming-message slide.
- **FILE-005**: `assets/previews/hero-story-02-triage.png` for the Liaison Keyboard triage or draft-selection slide.
- **FILE-006**: `assets/previews/hero-story-03-copy.png` for the reply-selected or copied-state slide.
- **FILE-007**: `assets/previews/hero-story-04-paste.png` for the pasted-reply-back-in-thread slide.
- **FILE-008**: `assets/previews/hero-story-05-resolution.png` for the optional resolution slide if it materially improves the story.
- **FILE-009**: `plans/design-hero-screenshot-story-1.md` for the implementation record.

## 6. Testing

- **TEST-001**: Validate that the first hero story slide renders without JavaScript and does not show broken controls or empty text.
- **TEST-002**: Validate previous and next navigation by mouse, touch, keyboard focus, and left/right arrow keys.
- **TEST-003**: Validate that the hero never overlaps at 320px, 375px, 390px, 768px, 1024px, 1280px, and 1440px.
- **TEST-004**: Validate that the active slide title, caption, and image always update together and wrap correctly from last to first and first to last.
- **TEST-005**: Validate that all hero images have accurate alt text describing the visible state of the workflow.
- **TEST-006**: Validate that the left-column hero copy remains unchanged in hierarchy and does not get pushed below the fold by oversized phone imagery on common laptop widths.
- **TEST-007**: Validate that no new asset causes a large CLS-style jump on page load.
- **TEST-008**: Validate that the hero story still looks credible on dark-mode default desktop browsers and on mobile Safari width classes.

## 7. Risks & Assumptions

- **RISK-001**: If screenshot capture is delayed, the redesign may ship with mixed-quality placeholders. Mitigation: block final approval on real app-derived images and use `demo-mobile-stage.png` only for temporary local integration.
- **RISK-002**: Removing scenario tabs from the hero may reduce the apparent breadth of use cases. Mitigation: keep the use-case section and scenario pages as the breadth proof lower on the page.
- **RISK-003**: New screenshot assets may increase page weight. Mitigation: compress assets, cap rendered dimensions, and lazy-load non-first slides if needed.
- **RISK-004**: A caption rail that is too verbose will recreate the same overlap problem in a new layout. Mitigation: enforce a one-sentence caption rule in the slide data model.
- **ASSUMPTION-001**: A single canonical workflow story is sufficient for the hero proof point and is preferable to three competing scenario variants.
- **ASSUMPTION-002**: The existing left-column hero copy and CTA group are directionally correct and do not require a parallel copy rewrite in this effort.
- **ASSUMPTION-003**: The app repo can provide screenshots that accurately represent thread import, triage, copy, and paste-back behavior without fabricating unsupported UI.
- **ASSUMPTION-004**: Follow-on automation coverage can be staged after the redesign rather than blocking phase 1 implementation.
- **IMP-001**: After the homepage version stabilizes, extract the hero story data shape into a reusable pattern for future scenario-page story rails.
- **IMP-002**: Add a lightweight screenshot-capture checklist to the landing docs so future asset refreshes preserve framing, message placement, and tone realism.

## 8. Related Specifications / Further Reading

- `README.md`
- `docs/landing-reconciliation-execution-plan.md`
- `docs/product-ecosystem-audit.md`
- `assets/previews/demo-mobile-stage.png`
- `../Liaison-Keyboard` app repo for screenshot source capture
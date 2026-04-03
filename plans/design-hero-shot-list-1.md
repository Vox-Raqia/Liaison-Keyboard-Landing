---
goal: Define the exact screenshot sequence, capture sources, and acceptance rules for the Liaison Keyboard landing hero story
version: 1.1
date_created: 2026-04-01
last_updated: 2026-04-02
owner: Landing repo
status: Planned
tags: [design, screenshots, hero, capture]
---

# Introduction

![Status: Planned](https://img.shields.io/badge/status-Planned-blue)

This shot list specifies the exact visual states required for the Liaison
Keyboard landing hero story. It exists to prevent fabricated-looking captures,
inconsistent framing, and product-truth drift while the landing hero moves to a
screenshot-led workflow module.

## 1. Capture Rules

- **CAP-001**: Use the full product name `Liaison Keyboard` in any visible app
  UI where the product is named.
- **CAP-002**: Keep the workflow grounded in the shipped manual path: incoming
  pressure, Liaison Keyboard triage, user-controlled draft or copy state, and
  optional paste-ready context. Do not imply automatic sending.
- **CAP-003**: Normalize the phone frame across all shots: same device chrome,
  same bezel treatment, same status-bar alignment, and consistent export scale.
- **CAP-004**: Place the newest message or draft low in the frame when the story
  depends on recency, especially in Google Messages states.
- **CAP-005**: Use realistic names and neutral content. Keep the work-conflict
  scenario already established in the app screenshots: Morgan Patel, clean
  client recap, summary first if needed.
- **CAP-006**: Avoid mixing unrelated persona marketing chrome into the hero
  story unless the frame is explicitly showing the internal Liaison Keyboard
  triage surface.
- **CAP-007**: Export hero assets at deterministic names and stable aspect
  ratios.
- **CAP-008**: First-slide asset must be production-ready for above-the-fold
  use: explicit dimensions, optimized file size, and no visible blur or
  placeholder artifacts.

## 2. Recommended Story Deck

| Shot ID      | Hero Role                              | Source                                                                                                                                                              | Status    | Keep / Re-shoot       | Notes                                                                                                                                                                                                                                 |
| ------------ | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **SHOT-001** | Incoming ask arrives                   | `../Liaison-Keyboard/assets/images/message-carousel-1.png`                                                                                                          | Available | Keep                  | Strong first frame. Clean single request, latest message visible near composer area, believable pressure.                                                                                                                             |
| **SHOT-002** | Urgency increases                      | `../Liaison-Keyboard/assets/images/message-carousel-2.png`                                                                                                          | Available | Keep                  | Good escalation frame. Reinforces that the user is managing a live conversation, not a generic prompt.                                                                                                                                |
| **SHOT-003** | Liaison Keyboard triage appears        | `assets/previews/hero-reply-studio.svg` for interim; preferred final source is a fresh app-derived triage capture from `app/chat.tsx` or `app/keyboard-preview.tsx` | Partial   | Re-shoot preferred    | Interim SVG remains in use. Current audit screenshots from `visual_audit_logs/repo_a` are auth-gated and not yet safe to promote because the `/chat` captures currently land on sign-in instead of a truthful signed-in triage state. |
| **SHOT-004** | Draft stays under user control         | `../Liaison-Keyboard/assets/images/message-carousel-3.png`                                                                                                          | Available | Keep                  | Best manual-boundary frame in the current exported set. Composer shows the reply in progress instead of a sent state.                                                                                                                 |
| **SHOT-005** | Calm resolution after the chosen reply | `../Liaison-Keyboard/assets/images/message-carousel-5.png` -> `assets/previews/hero-story-05-resolution.png`                                                        | Available | Keep for deployed set | This is not the final copied-state proof target, but it is a truthful fifth slide that strengthens the live sequence until an authenticated app-derived copied-state capture exists.                                                  |

## 3. Interim Implementation Set

Current deployed set as of 2026-04-02:

1. `hero-story-01-incoming.png` from `message-carousel-1.png`
2. `hero-story-02-follow-up.png` from `message-carousel-2.png`
3. `hero-story-03-triage.svg` from existing `hero-reply-studio.svg`
4. `hero-story-04-draft.png` from `message-carousel-3.png`
5. `hero-story-05-resolution.png` from `message-carousel-5.png`

This strengthens the deployed proof surface with four real message-state
captures while keeping the triage frame explicitly marked as interim.

## 4. Final Production Set

Replace the interim set with this sequence once fresh app captures are ready:

1. **Incoming pressure**: Google Messages with the original request.
2. **Escalation**: Google Messages with the second follow-up.
3. **Private triage in Liaison Keyboard**: a truthful app surface showing the
   three reply directions or the compact strip plus access to the 3-card
   selector.
4. **User-controlled draft or edit state**: a composer or edit-and-copy view
   showing that the response is still being reviewed.
5. **Copied and paste-ready**: a clear copied confirmation or explicit
   paste-ready screen, not an implied auto-send resolution.

## 4A. Current Blocker

The landing still lacks a truthful authenticated app screenshot for the internal
triage step.

- The existing `visual_audit_logs/repo_a` chat screenshots are not ready to
  promote because the current `/chat` audit path resolves to sign-in when the
  capture runs without an authenticated session.
- The next capture pass should use an authenticated state or a deterministic
  internal preview route such as `app/keyboard-preview.tsx`.
- Until that pass lands, keep the interim triage slide visually disciplined and
  textually labeled as a preview rather than a real captured app screen.

## 5. Source Files To Capture From

- **SRC-001**: `../Liaison-Keyboard/app/chat.tsx` for the real compose,
  response, and copy/edit-and-copy states.
- **SRC-002**: `../Liaison-Keyboard/app/keyboard-preview.tsx` for the compact
  strip, primary suggestion, and 3-card selector access pattern.
- **SRC-003**:
  `../Liaison-Keyboard/components/keyboard/InlineSuggestionStrip.tsx` for
  accurate labels and copy-state semantics.
- **SRC-004**: `../Liaison-Keyboard/components/keyboard/TriagePeekSheet.tsx` for
  the alternate reply-selection state.
- **SRC-005**: `../Liaison-Keyboard/assets/images/message-carousel-1.png`
  through `message-carousel-5.png` for the truthful Google Messages sequence
  already exported.
- **SRC-006**: `../Liaison-Keyboard/visual_audit_logs/repo_a/` as a future
  capture source only after the audit script is updated to run against an
  authenticated triage state.

## 6. Naming Convention

- **NAME-001**: `assets/previews/hero-story-01-incoming.png`
- **NAME-002**: `assets/previews/hero-story-02-follow-up.png`
- **NAME-003**: `assets/previews/hero-story-03-triage.png` or `.svg` for interim
- **NAME-004**: `assets/previews/hero-story-04-draft.png`
- **NAME-005**: `assets/previews/hero-story-05-resolution.png` for the current
  deployed set
- **NAME-006**: `assets/previews/hero-story-05-copied.png` for the eventual
  authenticated app-derived replacement

## 7. Acceptance Criteria

- **ACC-001**: Every slide reads as one step in a single believable workflow.
- **ACC-002**: The newest relevant content sits low enough in the thread that
  the screenshot feels live rather than archival.
- **ACC-003**: At least one slide clearly shows Liaison Keyboard rather than
  only the external messaging app.
- **ACC-004**: No slide implies that Liaison Keyboard sends messages
  automatically.
- **ACC-005**: The first slide is crisp and optimized enough for above-the-fold
  usage.
- **ACC-006**: Interim assets are explicitly marked for replacement so they do
  not become accidental final source of truth.

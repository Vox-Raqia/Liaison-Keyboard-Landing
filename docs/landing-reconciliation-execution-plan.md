# Liaison Keyboard Landing Reconciliation Execution Plan

> Historical note: this is an execution plan captured on 2026-03-19. It
> describes a reconciliation effort, not the current source of truth for the
> shipped landing site.

**Date:** 2026-03-19\
**Owner:** Landing repo\
**Source of truth:** app repo plus `AI_ONBOARDING_BRIEF.md`

## Objective

Bring the landing site into tight alignment with the shipped product by
correcting pricing, auth CTAs, visual previews, legal/support links, and
messaging that currently overstates or misstates functionality.

## Implementation Scope

- Update landing header CTA structure.
- Correct all pricing and Pro feature copy.
- Replace placeholder visuals with app-derived previews.
- Reword roadmap and privacy/support claims to match the live product.
- Use the full product name `Liaison Keyboard` in visible copy, metadata, and docs; reserve `liaison` only for technical identifiers that cannot change.
- Keep all work inside the landing repo, with docs, HTML, and static assets
  only.

## Required Changes

### 1. Header And Hero

- Add a `Login` button immediately next to `Start 15 Free Generations`.
- Link `Login` to `https://app.liaisonkeyboard.com/auth/login`.
- Keep `Start 15 Free Generations` pointing to
  `https://app.liaisonkeyboard.com/auth/register`.
- Replace the hero placeholder `APP INTERFACE PREVIEW` with a real app
  composite.
- Make the hero section the strongest proof point on the page.

### 2. Pricing And Pro Copy

- Change annual price to `$70.99/year`.
- Keep monthly price at `$7.99/month`.
- Update Pro benefits to include:
  - Unlimited generations
  - All premium personas unlocked
  - Full/deep conversation memory
  - Priority support
- Remove the repeated `Start 15 Free Generations` button from paid tiers and use
  more accurate paid-plan language if needed.

### 3. Product Messaging

- Use `Liaison Keyboard` everywhere the product is named in homepage copy,
  metadata, legal pages, and supporting docs.
- Do not shorten the product name to `Liaison` in user-facing content.
- Preserve legacy lowercase `liaison` only where a technical identifier must
  stay stable, such as domains, asset filenames, CSS hooks, storage keys, or
  mailboxes.
- Keep Phase 1 centered on manual copy/paste reply generation.
- Move keyboard-extension language into clearly labeled roadmap content.
- Remove or soften any copy that sounds like the native keyboard pivot is
  already active.
- Remove version-specific model branding unless it is intentionally maintained
  as a live claim.

### 4. Legal And Support

- Update `support.html` so the Stripe billing portal link matches the app's
  configured billing portal destination.
- Replace privacy absolutes with implementation-backed wording.
- Keep legal copy consistent with the current app state around account data,
  thread history, and billing.

### 5. Visual Refresh

- Build a hybrid asset set:
  - real UI previews for app screens
  - branded framing for hero/feature blocks
  - compact preview graphics for auth, chat, personas, threads, marketplace, and
    settings
- Align the landing palette to the app's teal-led theme and layered dark
  surfaces.
- Reduce purple dominance to a secondary accent role.
- Avoid generic AI marketing blocks and placeholder panels.

## Asset Plan

- `assets/previews/hero-chat-composite.svg`
- `assets/previews/auth-login-preview.svg`
- `assets/previews/auth-register-preview.svg`
- `assets/previews/chat-workflow-preview.svg`
- `assets/previews/marketplace-preview.svg`
- `assets/previews/settings-preview.svg`
- `assets/illustrations/feature-explainer-auth.svg`
- `assets/illustrations/feature-explainer-chat.svg`
- `assets/illustrations/feature-explainer-personas.svg`
- `assets/illustrations/feature-explainer-history.svg`
- `assets/illustrations/feature-explainer-billing.svg`

If lightweight SVG construction is sufficient, keep the assets web-friendly and
responsive. If raster exports are used, they should be optimized for web
delivery and remain visually consistent with the landing palette.

## Priority Order

1. Correct billing and auth CTAs.
2. Replace unsupported copy and support links.
3. Swap the hero placeholder for a real product preview.
4. Refresh feature blocks and pricing cards.
5. Add or update supporting illustration assets.
6. Run visual QA and link verification.

## Dependencies

- Pricing copy depends on app truth from `lib/appConfig.ts` and `terms.html`.
- Pro benefit copy depends on `components/ProPaywallCard.tsx`, `app/chat.tsx`,
  `app/(tabs)/marketplace.tsx`, and `app/(tabs)/settings.tsx`.
- Visual assets depend on the app surfaces being represented accurately.
- Support/legal copy depends on `lib/appConfig.ts`, `privacy.html`,
  `terms.html`, and `support.html`.

## Test And Verification Plan

- Confirm landing header shows both login and free-generation CTAs on desktop
  and mobile.
- Confirm the login CTA goes to `/auth/login` and the free-generation CTA goes
  to `/auth/register`.
- Confirm annual pricing reads `$70.99/year` everywhere on the landing site.
- Confirm support portal and legal links route correctly.
- Confirm hero and feature previews visually resemble the app surfaces they
  represent.
- Confirm the landing no longer uses placeholder copy for the main product
  preview.

## Timeline

### Day 1

- Finish audit and implementation docs.
- Lock pricing, auth CTA, and legal copy changes.
- Define the final visual asset list.

### Day 2

- Produce preview and illustration assets.
- Draft updated landing copy for hero, pricing, roadmap, and trust sections.

### Day 3

- Implement the HTML and asset integration in the landing repo.
- Add the login button and fix responsive header behavior.
- Update support and legal pages.

### Day 4

- Browser QA the landing site on mobile and desktop.
- Verify pricing, links, and visual alignment.
- Close out any remaining copy or asset cleanup.

## Acceptance Criteria

- The landing page matches the app truth on pricing, auth entry points, and Pro
  benefits.
- The hero uses a real app-derived preview instead of a placeholder.
- The support page points to the correct billing portal destination.
- Native keyboard support is represented as roadmap-only content.
- The docs in this folder clearly explain what changed, why it changed, and what
  remains dependent on assets or visuals.

## Progress Update

### 2026-03-21

- Header brand lockup was updated in `index.html` to add `LIAISON KEYBOARD`
  beside the existing topbar logo.
- Shared topbar CSS in `site.css` was adjusted so the new brand label,
  supporting note, and `Login` / `Start Free` buttons coexist without crowding
  each other.
- Removed the unofficial `Stripe Verified` storefront badge from the landing
  trust panel and replaced it with neutral Stripe Checkout billing copy.
- Deleted the fake badge asset so it cannot be reused accidentally.
- Stripe brand guidance was reviewed before replacement work; no homepage badge
  was reintroduced because the official Stripe badge program is checkout-page
  oriented, not a general landing-page trust seal.
- Desktop and mobile visual QA was completed locally against the landing repo
  using a static preview server.
- Verified locally:
  - wide desktop topbar keeps the note readable without pushing into the CTA
    group
  - mobile topbar stacks the lockup and CTAs cleanly without overlap
- Not yet done:
  - deploy the updated landing repo
  - mirror the same topbar lockup treatment to `privacy.html`, `terms.html`, and
    `support.html` if visual consistency across static pages is desired

### 2026-03-30

- Reworked the homepage FAQ into tap-to-reveal drawers so the section stays
  more compact on desktop and mobile.
- Added accordion behavior so opening one homepage FAQ item closes the others.
- Replaced homepage product references that used `Liaison` alone with the full
  `Liaison Keyboard` name.
- Added an explicit naming rule so future landing updates keep the full product
  name in user-facing copy and metadata.
- Audited `privacy.html`, `terms.html`, `support.html`, `cookies.html`, and
  the scenario pages; no additional visible-copy short-name fixes were needed
  outside technical identifiers such as domains and asset filenames.

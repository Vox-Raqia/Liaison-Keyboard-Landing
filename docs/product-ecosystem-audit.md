# Liaison Keyboard Product Ecosystem Audit

> Historical note: this audit is a dated reconciliation snapshot from
> 2026-03-19. Use the current landing code, current app repo, and the repo
> READMEs as source of truth for present-day behavior.

**Date:** 2026-03-19\
**Source of truth:**
`C:\Users\Brand\OneDrive\Desktop\App\Liaison-Keyboard\AI_ONBOARDING_BRIEF.md`
plus the live app repo at
`C:\Users\Brand\OneDrive\Desktop\App\Liaison-Keyboard`\
**Scope:** Landing site accuracy, brand alignment, and product message
reconciliation only

## Executive Summary

The landing site and the app are directionally aligned, but the landing page is
still marketing a partially outdated product story. The most important gaps are
pricing, billing language, feature promises, and visual representation of the
real app.

The app now clearly supports a Phase 1 web/app workflow: auth, chat generation,
persona selection, thread history, marketplace/paywall, settings/billing, and a
Pro tier with unlimited generations and premium personas. The landing page still
contains stale annual pricing, a placeholder hero preview, unsupported privacy
absolutes, and roadmap language that makes native keyboard support sound closer
to shipped than it is.

The highest-risk issues are commercial and trust-related: the landing annual
price is wrong, the support page points to the wrong portal target, and the
pricing copy does not reflect the app's current Pro benefits. The visual system
also needs work; the landing uses generic card patterns and purple-heavy accents
that do not match the app's teal-led layered UI.

## Source Set

- Landing repo:
  `C:\Users\Brand\OneDrive\Desktop\App\Liaison-Keyboard-Landing\index.html`
- Landing legal pages:
  `C:\Users\Brand\OneDrive\Desktop\App\Liaison-Keyboard-Landing\privacy.html`,
  `C:\Users\Brand\OneDrive\Desktop\App\Liaison-Keyboard-Landing\terms.html`,
  `C:\Users\Brand\OneDrive\Desktop\App\Liaison-Keyboard-Landing\support.html`
- App repo: `C:\Users\Brand\OneDrive\Desktop\App\Liaison-Keyboard\app\chat.tsx`,
  `C:\Users\Brand\OneDrive\Desktop\App\Liaison-Keyboard\app\(tabs)\settings.tsx`,
  `C:\Users\Brand\OneDrive\Desktop\App\Liaison-Keyboard\app\(tabs)\marketplace.tsx`,
  `C:\Users\Brand\OneDrive\Desktop\App\Liaison-Keyboard\components\ProPaywallCard.tsx`,
  `C:\Users\Brand\OneDrive\Desktop\App\Liaison-Keyboard\lib\appConfig.ts`,
  `C:\Users\Brand\OneDrive\Desktop\App\Liaison-Keyboard\lib\theme.ts`,
  `C:\Users\Brand\OneDrive\Desktop\App\Liaison-Keyboard\app\auth\login.tsx`,
  `C:\Users\Brand\OneDrive\Desktop\App\Liaison-Keyboard\app\auth\register.tsx`,
  `C:\Users\Brand\OneDrive\Desktop\App\Liaison-Keyboard\app\+html.tsx`

## Product Truth

- Phase 1 is the current live product: manual copy/paste reply generation in the
  web/app experience.
- Auth is implemented at `/auth/login` and `/auth/register`.
- The core app surface is `/chat`.
- Supporting surfaces already shipped are `Threads`, `Marketplace`, and
  `Settings`.
- Free users get `15` generations.
- Pro is a single subscription with monthly and yearly billing.
- Pro unlocks unlimited generations, all premium personas, full/deep
  conversation memory, and priority support.
- The premium personas are `The Diplomat`, `The Charmer`, `The Closer`, and
  `The Cool Head`.
- Phase 2 keyboard extensions are still roadmap-only.

## Discrepancy Matrix

| Area                | Landing Claim                                                            | App/Brief Truth                                                                                       | Evidence                                                                                                                                   | Severity | Recommended Fix                                                                                                                   | Owner   | Dependency                                                     |
| ------------------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------- | ------- | -------------------------------------------------------------- |
| Pricing             | Annual plan shown as `$79.99/year`                                       | App and terms reflect `$70.99/year`                                                                   | `index.html`, `terms.html`, `lib/appConfig.ts`, `lib/stripe/config.ts`                                                                     | Critical | Update the annual price everywhere on the landing site to `$70.99/year` and remove any savings badge that assumes the stale price | Landing | None                                                           |
| Header CTA          | No login CTA in the top-right header                                     | App has real auth at `/auth/login`                                                                    | `index.html`, `app/auth/login.tsx`                                                                                                         | High     | Add `Login` beside `Start 15 Free Generations` and link to the login route                                                        | Landing | None                                                           |
| Hero preview        | `APP INTERFACE PREVIEW` placeholder block                                | The app has real surfaces that can be previewed                                                       | `index.html`, `app/chat.tsx`, `app/(tabs)/settings.tsx`, `app/(tabs)/marketplace.tsx`, `app/auth/login.tsx`, `app/auth/register.tsx`       | High     | Replace with a real app screenshot/composite and support it with branded framing                                                  | Landing | Asset capture from app                                         |
| Pro pricing copy    | Pro cards only promise unlimited generations and all personas            | App copy includes Deep Memory and Priority support                                                    | `index.html`, `components/ProPaywallCard.tsx`, `lib/appConfig.ts`, `app/(tabs)/settings.tsx`, `app/(tabs)/marketplace.tsx`, `app/chat.tsx` | High     | Expand landing Pro bullets to reflect current paid value                                                                          | Landing | None                                                           |
| Native roadmap copy | `iOS & Android extensions in active development`                         | Brief says native keyboard pivot is Phase 2 planned                                                   | `index.html`, `AI_ONBOARDING_BRIEF.md`                                                                                                     | High     | Reword as roadmap-only, not currently active product capability                                                                   | Landing | None                                                           |
| Privacy claim       | `No data retention or third-party sharing`                               | App has chat threads, saved history, and account-backed persistence                                   | `index.html`, `app/chat.tsx`, `app/(tabs)/threads.tsx`, `lib/chatThreads.ts`, `privacy.html`                                               | Critical | Replace absolutes with conservative, implementation-backed privacy language                                                       | Landing | Review legal/privacy copy                                      |
| Billing trust badge | Homepage showed a `Stripe Verified` storefront badge                     | Stripe branding guidance does not support using a `Stripe Verified` trust seal on this marketing page | `index.html`, `assets/stripe-verified-badge.svg`                                                                                           | Critical | Remove the badge immediately and use factual Stripe Checkout / customer portal copy instead of a fake seal                        | Landing | Confirm any future Stripe mark against official usage guidance |
| Model claim         | Footer says `Powered by Claude 3.5`                                      | App backend uses Anthropic Claude Sonnet 4 in generation function                                     | `index.html`, `supabase/functions/generateLiaisonReplies/index.ts`, `app/+html.tsx`                                                        | Medium   | Remove version-specific branding from marketing copy unless it is meant to be maintained live                                     | Landing | None                                                           |
| Support portal      | Support page portal button points to `https://liaisonkeyboard.com/chat`  | App uses Stripe billing portal URL in config                                                          | `support.html`, `lib/appConfig.ts`                                                                                                         | Critical | Update the support page link to the billing portal destination used by the app                                                    | Landing | None                                                           |
| Visual language     | Purple-heavy cards and repeated generic layouts                          | App theme is teal-led with layered dark surfaces and controlled accent use                            | `index.html`, `lib/theme.ts`, `components\AppShell.tsx`                                                                                    | Medium   | Rework hero and supporting sections to match app palette and surface hierarchy                                                    | Landing | Visual assets                                                  |
| Product framing     | Landing treats Phase 1 and Phase 2 as equally polished marketing pillars | App is still Phase 1 with Phase 2 only planned                                                        | `index.html`, `AI_ONBOARDING_BRIEF.md`                                                                                                     | High     | Make Phase 1 the hero story and visually de-emphasize roadmap content                                                             | Landing | None                                                           |

## Gap Analysis

### Commercial Gaps

The landing page currently undersells and misstates the paid tier by omitting
key app benefits and showing the wrong yearly price. This creates friction at
the point where user trust and billing confidence matter most.

### Product-Truth Gaps

The landing still implies a nearer-term native keyboard future than the brief
allows. That is a positioning problem, not just a copy problem, because it
changes user expectations about what they can do today.

### UX Gaps

The landing uses a placeholder preview and repeated card blocks that do not
communicate the app's actual workflow. The live app is more concrete than the
marketing site: auth screens, chat surfaces, history, marketplace, settings, and
paywall states are all real and should be the basis for preview assets.

### Brand Gaps

The app's brand system is more disciplined than the landing's current look. The
app uses a dark layered base with teal primary accents and restrained secondary
colors, while the landing overuses purple and generic glassy cards.

## Illustration Requirements

### Hero Section

- Replace the placeholder hero panel with a screenshot-accurate composite of the
  chat workspace.
- Show the app's real desktop hierarchy: brand rail, chat composer, persona
  selection, and response area.
- Use a branded frame that echoes the connected-geometry philosophy from
  `assets/liaison-logo-philosophy.md`.

### Feature Demonstrations

- Auth preview: login and register states.
- Chat workflow preview: message paste, persona selection, and reply generation.
- Persona preview: the four premium personas shown as distinct cards.
- History preview: threads and saved conversations.
- Billing preview: settings paywall and Stripe-managed Pro state.

### Visual System

- Base palette should follow the app's teal-led dark surface system.
- Purple may remain as a secondary accent, but not the dominant CTA or card
  color.
- Use subtle glows, layered panels, and one strong hero image rather than
  repeated decorative blocks.

## Recommendation Summary

1. Correct pricing and support links first because they affect billing trust.
2. Replace placeholder hero content with real app-derived visuals.
3. Reconcile all marketing claims to the shipped Phase 1 product.
4. Keep Phase 2 visible only as roadmap language.
5. Refresh the visual system so the landing looks like the app, not a generic AI
   template.

## Evidence Notes

- Landing homepage:
  `C:\Users\Brand\OneDrive\Desktop\App\Liaison-Keyboard-Landing\index.html`
- Landing support page:
  `C:\Users\Brand\OneDrive\Desktop\App\Liaison-Keyboard-Landing\support.html`
- Landing terms page:
  `C:\Users\Brand\OneDrive\Desktop\App\Liaison-Keyboard-Landing\terms.html`
- App pricing and plan copy:
  `C:\Users\Brand\OneDrive\Desktop\App\Liaison-Keyboard\lib\appConfig.ts`
- App Pro card copy:
  `C:\Users\Brand\OneDrive\Desktop\App\Liaison-Keyboard\components\ProPaywallCard.tsx`
- App chat Pro state copy:
  `C:\Users\Brand\OneDrive\Desktop\App\Liaison-Keyboard\app\chat.tsx`
- App marketplace copy:
  `C:\Users\Brand\OneDrive\Desktop\App\Liaison-Keyboard\app\(tabs)\marketplace.tsx`
- App settings copy:
  `C:\Users\Brand\OneDrive\Desktop\App\Liaison-Keyboard\app\(tabs)\settings.tsx`
- App theme source:
  `C:\Users\Brand\OneDrive\Desktop\App\Liaison-Keyboard\lib\theme.ts`
- Brief:
  `C:\Users\Brand\OneDrive\Desktop\App\Liaison-Keyboard\AI_ONBOARDING_BRIEF.md`

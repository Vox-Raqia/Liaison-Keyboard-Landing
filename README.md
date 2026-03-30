# Liaison-Keyboard-Landing

This repository contains the public static marketing site for Liaison Keyboard.

It is a plain HTML, CSS, and JavaScript site that handles:

- the homepage and marketing narrative
- pricing and CTA handoff into the app
- scenario-based previews and supporting landing content
- legal and support pages
- continuity-aware routing into `app.liaisonkeyboard.com`

The actual product experience lives in the separate `Liaison-Keyboard` repo.

## Current Site Shape

The landing repo is intentionally simple:

- `index.html`: main homepage
- `site.css`: global visual system and responsive layout
- `site.js`: interaction logic, cookie/attribution continuity, CTA hydration,
  hero demo behavior
- `privacy.html`, `terms.html`, `support.html`, `cookies.html`: legal and
  support surfaces
- `scenarios/`: static scenario landing pages
- `assets/`: static imagery, illustrations, previews, icons

## Current Messaging Role

The landing site should reflect the shipped product honestly:

- Liaison Keyboard is a communication prosthetic for difficult messages
- the core product is still the app-side triage flow, not a native keyboard
  extension shipping today
- the public site should hand users into auth or chat cleanly without
  overstating future capabilities

## Dynamic Client-Side Behavior

`site.js` currently handles:

- cookie-consent state
- attribution persistence for allowed continuity cookies
- auth/session-aware CTA hydration
- app-path URL construction for links into `app.liaisonkeyboard.com`
- interactive hero phone demo playback
- mobile navigation controls

## Local Development

This repo is static, so local development is lightweight.

For example:

```bash
python -m http.server 4173
```

Then open:

```text
http://localhost:4173
```

## Relationship To The App Repo

- marketing and legal content live here
- auth, billing, drafting, threads, personas, and generation live in
  `Liaison-Keyboard`
- CTA and continuity logic should always match the current routes and URLs
  defined by the live app

## Documentation Notes

The markdown files under `docs/` in this repo are planning and audit artifacts.
They are useful historical context, but they should not be treated as the live
product source of truth unless explicitly updated to say so.

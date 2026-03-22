# Liaison-Keyboard-Landing

Static marketing site for Liaison Keyboard.

## Observability

- Vercel Web Analytics is installed as an npm dependency.
- Vercel Speed Insights is installed as an npm dependency.
- Speed Insights is loaded with the static Vercel script on every public HTML entry point:
  - `index.html`
  - `privacy.html`
  - `terms.html`
  - `support.html`

## Notes

- This repo is a static HTML/CSS/JS site, so Speed Insights is wired with the Vercel-hosted script path rather than a React component.

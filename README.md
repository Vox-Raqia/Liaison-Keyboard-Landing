# Liaison-Keyboard-Landing

Static marketing site for Liaison Keyboard.

## Observability

- Vercel Web Analytics and Vercel Speed Insights remain listed as npm dependencies.
- The static legal/support pages no longer hard-code the broken `/_vercel/speed-insights/script.js` reference.
- If observability is reintroduced, wire it through the deployed platform instead of duplicating script tags in each HTML file.

## Notes

- This repo is a static HTML/CSS/JS site. The public pages are served directly from HTML files, so there is no React component layer for observability wiring in the landing site itself.

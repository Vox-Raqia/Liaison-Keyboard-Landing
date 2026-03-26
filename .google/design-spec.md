# LIAISON TACTICAL VISUAL SPEC (MIDNIGHT GUARD)

**Status:** Mjolnir-Certified / Production Ready

## 1. Color Palette

- **Base Black (Background):** `#0A0A0B`
- **Surface Grey (Cards):** `#161618`
- **Tactical Grey (Borders/Dividers):** `#1F1F22`
- **Action Blue (Primary/Natural):** `#3B82F6`
- **Success Green (Proactive/Copied):** `#10B981`
- **Boundary Amber (Short/Warning):** `#F59E0B`

## 2. Typography & Layout

- **Headers:** Inter or Geist (Sans-serif), -0.02em tracking.
- **Geometry:** Sharp corners ONLY. `border-radius: 4px` or `6px`.
- **Borders:** All cards must use `1px solid #1F1F22`.
- **Padding:** `24px` standard container padding to prevent visual anxiety.

## 3. The 3-Card Triage

- Never use chat bubbles.
- The 3 cards (Natural, Proactive, Short) must have a 4px left-border accent
  matching their designated color (Blue, Green, Amber).
- Use `backdrop-filter: blur(12px)` for sticky headers/context strips.

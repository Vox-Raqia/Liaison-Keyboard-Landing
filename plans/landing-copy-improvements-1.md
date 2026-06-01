---
goal: Fix reply option labels (Safe/Warm/Direct), name the three personas, update Pro feature bullets to exact product copy, fix infrastructure trust signals, consolidate Proof Before Pricing section
version: 1.0
date_created: 2026-06-01
last_updated: 2026-06-01
owner: Landing repo
status: Completed
tags: [copy, conversion, personas, pricing, trust]
---

# Introduction

![Status: Completed](https://img.shields.io/badge/status-Completed-green)

This plan documents Wave 1 of the landing page copy and conversion improvements. The target outcome is accurate, defensible product copy across the entire marketing page: canonical reply labels, named personas, real pricing numbers, honest trust signals, and a consolidated proof section that sits above pricing.

## 1. Requirements & Constraints

- **REQ-001**: Replace all occurrences of Natural / Keep it going / Short reply option labels with **Safe / Warm / Direct** throughout the landing page.
- **REQ-002**: Name the three user personas explicitly: **Hesitant Texter** (early dating / reconnecting), **Conflict Avoider** (family / friend / ex), and **Careful Professional** (work / negotiation / boss).
- **REQ-003**: Update Pro feature bullets to exact product copy reflecting the real offering: Free ($0, 15 generations), Pro Monthly ($7.99/mo), Pro Annual ($79.99/yr, $6.67/mo effective, save 17%).
- **REQ-004**: Fix infrastructure trust signals — remove any fabricated or unverifiable claims and replace with honest, defensible product statements.
- **REQ-005**: Consolidate the Proof Before Pricing section so social proof and credibility signals appear above any pricing table or paywall mention.
- **CON-001**: No fabricated stats. Every number, percentage, or metric must come from the real product or be removed.
- **CON-002**: No competitor comparisons anywhere on the landing page.
- **CON-003**: Every claim must be defensible from the actual product. Nothing auto-sends. User stays in full control.
- **CON-004**: Mobile-first. All copy and layout must work at narrow widths before desktop enhancements.

### Context Map

#### Files to Modify

| File | Purpose | Changes Needed |
|------|---------|----------------|
| `index.html` | Homepage markup | Update reply labels, persona names, Pro feature bullets, trust signals, and Proof Before Pricing section ordering. |
| `site.css` | Landing styles | Adjust any styling needed for consolidated proof section placement and trust signal layout. |

#### Dependencies (may need updates)

| File | Relationship |
|------|--------------|
| `README.md` | Documents the static site architecture. |
| `../Liaison-Keyboard` app repo | Source of truth for reply option labels and feature scope. |

#### Test Files

| Test | Coverage |
|------|----------|
| No dedicated automated landing tests currently exist | Validation will be manual copy review against product repo and live app behavior. |

#### Reference Patterns

| File | Pattern |
|------|---------|
| `index.html` | Uses semantic sections with descriptive class names for proof, pricing, and trust areas. |
| `site.css` | Uses mobile-first responsive rules with component-scoped class blocks. |

#### Risk Assessment

- [ ] Breaking changes to public API
- [ ] Database migrations needed
- [x] Configuration changes required

## 2. Implementation Steps

### Implementation Phase 1

- **GOAL-001**: Audit existing landing page copy and identify all locations that need label, persona, or pricing corrections.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| **TASK-001** | Scan `index.html` for all instances of Natural / Keep it going / Short and catalog their locations. |  |  |
| **TASK-002** | Identify all areas where user scenarios or personas are referenced without naming them. |  |  |
| **TASK-003** | Audit the pricing section and Pro feature bullets for accuracy against the canonical product facts. |  |  |
| **TASK-004** | Audit trust signals and infrastructure claims for fabricated or unverifiable statements. |  |  |

### Implementation Phase 2

- **GOAL-002**: Apply the five copy changes to `index.html`.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| **TASK-005** | Replace all reply option labels with Safe / Warm / Direct and add a brief inline explanation of each option. |  |  |
| **TASK-006** | Introduce the three named personas (Hesitant Texter, Conflict Avoider, Careful Professional) into the relevant scenario sections. |  |  |
| **TASK-007** | Rewrite Pro feature bullets with exact pricing: Free ($0, 15 generations), Pro Monthly ($7.99/mo), Pro Annual ($79.99/yr, $6.67/mo effective, save 17%). |  |  |
| **TASK-008** | Replace any fabricated infrastructure or trust claims with honest product statements. |  |  |
| **TASK-009** | Reorder the page so the Proof Before Pricing section consolidates and appears above any pricing table. |  |  |

### Implementation Phase 3

- **GOAL-003**: Verify layout and copy consistency across viewports.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| **TASK-010** | Verify the updated proof section, trust signals, and pricing look correct at 320px, 375px, 768px, and 1280px. |  |  |
| **TASK-011** | Confirm all copy changes are consistent: no stale labels, no mixed persona references, no fabricated numbers. |  |  |
| **TASK-012** | Verify the primary CTA reads "Try it free" or "Start Free & Generate Your First Reply" consistently. |  |  |

## 3. Alternatives

- **ALT-001**: Keep the existing labels and only add a glossary link explaining the new terms. Rejected because the landing page itself must use the canonical labels directly.
- **ALT-002**: Use generic persona descriptions instead of naming them. Rejected because named personas improve conversion clarity and are locked as product copy.
- **ALT-003**: Leave pricing abstract (e.g. "starting at a few dollars"). Rejected because exact numbers build trust and match the real product.

## 4. Dependencies

- **DEP-001**: Reply option labels Safe / Warm / Direct confirmed from the main app repo roadmap.
- **DEP-002**: Pricing tiers confirmed from the live billing system and product configuration.
- **DEP-003**: Persona names confirmed from product positioning and user research.

## 5. Files

- **FILE-001**: `index.html` for all copy and section changes.
- **FILE-002**: `site.css` for any layout adjustments to the consolidated proof section.
- **FILE-003**: `plans/landing-copy-improvements-1.md` for the implementation record.

## 6. Testing

- **TEST-001**: Validate that no instance of Natural / Keep it going / Short remains anywhere in the landing page copy.
- **TEST-002**: Validate that all three personas are named explicitly in their respective sections.
- **TEST-003**: Validate that pricing numbers match the canonical product facts exactly.
- **TEST-004**: Validate that the proof section appears above the pricing section on all viewports.
- **TEST-005**: Validate that no fabricated stats or competitor comparisons exist in the page.
- **TEST-006**: Validate that the primary CTA text is consistent and reads "Try it free" or "Start Free & Generate Your First Reply".

## 7. Risks & Assumptions

- **RISK-001**: Persona naming may feel too informal for some audiences. Mitigation: the names are grounded in real user behavior patterns and are already used in product positioning.
- **RISK-002**: Consolidating the proof section may push pricing below the fold on mobile. Mitigation: the proof section should be concise and scannable, not a long testimonial block.
- **ASSUMPTION-001**: The main app repo's Safe / Warm / Direct labels are the canonical source and will not change in the near term.
- **ASSUMPTION-002**: The pricing tiers listed are current and accurate at the time of this document's creation.

## 8. Canonical Product Facts

These are the locked product truths referenced throughout this document and the landing page:

- **Reply option labels**: Safe / Warm / Direct
  - Safe = reduce heat and stay clear
  - Warm = keep the door open and move forward
  - Direct = hold the line without over-explaining
- **Persona names**:
  - Hesitant Texter: early dating, mixed signals, reconnecting
  - Conflict Avoider: family friction, friend fallout, tense ex, coworker conflict
  - Careful Professional: negotiating, pushing back on a boss, careful client wording
- **Pricing**:
  - Free: $0, 15 generations
  - Pro Monthly: $7.99/mo
  - Pro Annual: $79.99/yr, $6.67/mo effective, save 17%
- **Primary CTA**: "Try it free" / "Start Free & Generate Your First Reply"
- **Control model**: Nothing auto-sends. User stays in full control.

## 9. Related Specifications / Further Reading

- `README.md`
- `plans/design-hero-screenshot-story-1.md`
- `.liaison-docs/_AI_INDEX_AND_GLOSSARY.md`
- `../Liaison-Keyboard` app repo for reply option and feature source of truth

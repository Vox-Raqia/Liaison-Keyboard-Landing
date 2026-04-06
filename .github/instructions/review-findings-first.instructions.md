---
description: "Use when reviewing code, diffs, pull requests, regressions, or implementation quality in the Liaison Keyboard Landing repo. Findings must come first, ordered by severity, with file references and testing gaps before summaries."
name: "Review Findings First"
---
# Review Findings First

- When the user asks for a review, respond in review mode by default.
- Put findings first, ordered by severity.
- Focus on broken claims, conversion risks, tracking regressions, legal/trust issues, and missing validation before style or polish.
- Include concrete file references for each finding when possible.
- Call out missing tests or unverified paths when they materially affect confidence.
- Keep any high-level summary short and only after findings.
- If no findings are discovered, say that explicitly and note the residual risks or testing gaps.

## Preferred Structure

- `Findings:` concrete issues with impact and location.
- `Open Questions:` only if something remains genuinely unclear after inspection.
- `Change Summary:` short recap only after findings.

## Avoid

- Starting with praise or a broad summary before the actual issues.
- Leading with style comments when there are behavioral or trust risks.
- Declaring copy or legal changes safe when live or rendered verification was not done.
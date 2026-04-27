# Source Control & Commit Plan
**Date:** 2026-04-26  
**Workspace:** Liaison-Keyboard-Landing (dual-repo structure)

---

## Repository Structure

- **Root (Landing Repo)** — manages marketing site, compliance docs, audit artifacts
- **Nested (App Repo)** — `Liaison-Keyboard/` is a fully independent git repo (its own `.git/`)

**These are separate repos.** Commits must be made independently.

---

## Landing Repo — Current State

### Files to Commit (New Audit Artifacts)

All 4 audit documents are **untracked** and ready to commit:

```
docs/audit/current-launch-readiness-assessment.md
docs/audit/launch-readiness-comparison.md
docs/audit/launch-readiness-reassessment-ledger.md
docs/audit/original-AZ-launch-readiness-prompt.md
```

### Already Tracked (No Changes)

- `.liaison-docs/` files — already tracked, no modifications this session
- `docs/compliance/` — already tracked, no modifications this session
- `public/privacy.html` — already tracked, no modifications
- `assets/og-image.png` — already tracked, no changes

### Untracked Artifacts (Do NOT Commit)

```
.playwright-mcp/
  console-2026-04-26T03-43-48-915Z.log
  console-2026-04-26T03-44-18-197Z.log
  page-2026-04-26T03-43-54-381Z.yml

ENGINEERING_WAVE1_REPORT.md           ← from audit read, not part of repo
freshdesk-login-before.png            ← screenshot artifact
lib/, components/, supabase/, scripts/ → these are inside the nested app repo, NOT landing
```

These are test logs, screenshots, or artifacts from the app repo copy — **do not commit**.

---

## Nested App Repo — Current State

`Liaison-Keyboard/` is its own git repo. **No changes were made** to the app code during this audit session (read-only access). Its state is clean.

---

## .gitignore Adequacy

**Landing repo (root):** Minimal — only excludes `node_modules`, `.gemini/settings.json`, `kilo.json`, `.kilo/`  
⚠️ Missing: `*.log`, `.playwright-mcp/`, `output/`, `dist/` are currently untracked but not explicitly ignored. Add entries to prevent accidental adds.

**App repo (`Liaison-Keyboard/.gitignore`):** Comprehensive — includes `node_modules/`, `.expo/`, `dist/`, `e2e/artifacts/`, `output/`, `*.log` patterns, `PLAYWRIGHT` artifacts. Good.

---

## Commit Plan

### Commit 1: Landing Repo — Audit Artifacts

**Branch:** (assuming main)  
**Message:** `docs: add launch readiness reassessment artifacts (A–Z audit)`

**Files:**
- `docs/audit/current-launch-readiness-assessment.md`
- `docs/audit/launch-readiness-comparison.md`
- `docs/audit/launch-readiness-reassessment-ledger.md`
- `docs/audit/original-AZ-launch-readiness-prompt.md`

**Pre-commit checklist:**
- [x] No secrets/env vars in these files
- [x] No PII or sensitive data
- [x] Paths correct (all within landing repo)
- [x] No merge conflicts expected

### No Action Required for App Repo

No code changes made; no commits needed.

---

## Cleanup Tasks (Safeguards)

Before committing, **add to .gitignore** in the landing repo:

```gitignore
# Test logs
*.log
.playwright-mcp/

# Generated artifacts
output/
dist/

# Local workspace files (redundant but explicit)
.DS_Store
*.tmp
```

Some of these are already untracked; adding them prevents future accidents.

---

## Push Strategy

1. Commit to **landing repo** (audit docs)
2. Do NOT push the nested app repo (it's unchanged; separate origin)
3. If you need to push the app repo separately, do it in its own directory: `cd Liaison-Keyboard && git push`

---

## Verification Commands (Run Post-Commit)

```bash
# Landing repo
git status  # should be clean except untracked logs/artifacts
git log -1  # verify message

# App repo (if modified later)
cd Liaison-Keyboard
git status
```

---

## Do Not Commit — Ever

- `.env`, `.env.*` files
- `node_modules/`
- Logs (`*.log`, `.playwright-mcp/`)
- Build artifacts (`dist/`, `web-build/`, `output/`)
- Screenshots (`*.png` unless intentional asset)
- Local config (`kilo.json`, `.kilo/`, `.kilocode/`)

---

**Final Note:** The audit created documentation only. The nested app repo was inspected but not modified. One commit to the landing repo suffices.

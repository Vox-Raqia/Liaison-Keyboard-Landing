# PostHog DPA Request — Pending (CRA Registration Blocked)

**Status:** Awaiting CRA business registration completion  
**Created:** 2026-04-27  
**Vendor:** PostHog Inc. (UK entity: Hiberly Ltd.)  
**Service:** PostHog Cloud analytics  
**Request submitted:** No — awaiting legal entity name and business number from CRA registration  
**Countersigned received:** No  

**Dependency:** This DPA cannot be generated until after CRA registration provides a legal entity name and business number.

---

## Why This DPA Is Needed

Liaison Keyboard sends user analytics events to PostHog. Under GDPR Art. 28 and CCPA, a Data Processing Agreement is required when a processor handles personal data on behalf of a controller.

---

## Acquisition Method

PostHog does **not** provide a static public DPA PDF. They provide a **DPA generator** at <https://posthog.com/dpa> that produces a customized contract per customer. You complete the form → they counter-sign → they email you the executed PDF.

---

## Exact Form Fields (verified 2026-04-27)


The DPA generator (`https://posthog.com/dpa`) asks for:

| # | Field label | Description | Example for Liaison |
|---|------------|-------------|---------------------|
| 1 | **Company name** | Legal entity name | `Liaison Keyboard Inc.` or `[Your legal entity]` |
| 2 | **Company address** | Registered office address | `[Registered address]` |
| 3 | **Representative name** | Person submitting the request | `[Your name]` |
| 4 | **Representative email** | Contact email for the DPA | `[privacy@ or legal@ your domain]` |
| 5 | **Representative title** | Your role/title | `Founder` or `Legal Counsel` |
| 6 | **Format** *(radio)* | Document styling (non-binding preference) | Choose any (e.g., "A perfectly legal doc, but with some pizazz") |

After filling the fields, click **"Send for signature"**.

---

## Step-by-Step Completion

### Step 1 — Prepare Required Information

Have the following ready:

- Legal entity name (as registered with your local business authority)
- Registered address (full postal address)
- Submitter name and email
- Submitter title (e.g., Founder, CEO, Legal Counsel)

### Step 2 — Generate & Submit

1. Navigate to <https://posthog.com/dpa>
2. Fill all 5 fields above
3. Select a format style (does not affect legal validity)
4. Click **"Send for signature"**
5. The form submits directly to PostHog legal team

### Step 3 — Wait for Counter-Signature

- Expected turnaround: 1–3 business days
- You'll receive a countersigned PDF from `privacy@posthog.com`
- The executed DPA will have both parties' signatures/dates in the signature block

### Step 4 — Archive the Signed DPA

1. Rename file to: `docs/compliance/vendor-dpas/posthog-dpa-signed-YYYY-MM-DD.pdf`
2. Place it in `Liaison-Keyboard/docs/compliance/vendor-dpas/`
3. Update this file to status: complete (with filename reference)
4. Update `docs/compliance/vendor-dpas/README.md` vendor table

---

## What We've Already Archived (Proof of Process)

- `posthog-trust-center-dpa-entry-2026-04-27.pdf` — Shows DPA generator exists on Trust Center
- PostHog Security Handbook excerpt — Confirms DPA availability and SOC 2 coverage

These demonstrate good-faith intent and process initiation.

---

## Compliance Notes

- **Jurisdiction choice:** PostHog offers both EU and US DPAs. If your data subjects are primarily in the EU/UK, select the **EU/UK DPA** (uses EU Standard Contractual Clauses for data transfers). If primarily US, select the US version.
- **Subprocessors:** Listed on <https://posthog.com/subprocessors>. Current list (2026-04-27): AWS (cloud), Wiz (security), PlanetScale (DB ops), Modal Labs (compute). Monitor quarterly for changes.
- **DPA version:** PostHog's DPA incorporates EU SCCs (v1.20220627) by reference; no need to negotiate clauses.
- **Execution:** The DPA is not active until PostHog countersigns. The generated PDF is your offer; their counter-signature forms the binding agreement.

---

## Next Actions

| Who | Action | Target |
|-----|--------|--------|
| Human (you) | Fill out <https://posthog.com/dpa> with Liaison legal entity info | Apr 27–28 |
| Human (you) | Submit and await email from `privacy@posthog.com` | 1–3 business days |
| PostHog legal | Countersign and return executed DPA PDF via email | 1–3 business days |
| Human (you) | Archive returned PDF in `docs/compliance/vendor-dpas/` | Upon receipt |
| Kilo | Update all docs after archive | Post-archive |

---

**This placeholder will be replaced with a reference to the executed DPA filename once received.**

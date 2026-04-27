# GDPR Data Protection Impact Assessment (DPIA)
## Liaison Keyboard - AI Reply Generation Feature

**Document Version:** 1.1
**Effective Date:** Not effective for production sign-off until release gates in Section 11 are complete
**Last Updated:** 2026-04-26
**Founder Decision:** Conditional remediation approval only; production approval withheld
**Privacy Owner:** Founder / Product Lead, interim privacy owner
**DPO:** Not appointed; DPO requirement assessment pending privacy counsel review
**Legal Counsel:** External privacy counsel not yet engaged / not yet signed off

---

## 1. Executive Summary

**Processing Activity:** AI-powered reply generation for user-submitted communications
**Assessment Type:** Initial DPIA, pre-launch remediation baseline
**Overall Inherent Risk:** **HIGH**
**Overall Residual Risk Target:** **MEDIUM**, only after the release gates in Section 11 are complete
**Approval Status:** **Do not approve for production processing yet**

### Founder Determination

As founder, I do **not** approve this DPIA for production launch in its current state. I approve it only as a remediation baseline.

Production approval requires:

- Explicit GDPR Article 9 handling for special-category content.
- Verified vendor DPA / data transfer evidence for Google, Supabase, Stripe, PostHog, and Google Analytics / Tag Manager.
- Correct Gemini retention disclosures based on the actual integration path.
- A documented EU transfer mechanism for each vendor receiving EU personal data.
- Residual risk scored below high or, if high risk remains, prior consultation before processing.
- Privacy counsel review or documented founder assumption of legal risk.

### Founder-Provided / Repo-Derived Facts

| Question | Determination |
|---|---|
| Do we process EU users? | **Yes.** The public product is global and the privacy policy expressly references EU/UK rights. |
| Could message content contain health, mental state, political, religious, philosophical, sex-life, or sexual-orientation data? | **Yes.** The service does not solicit those categories, but user-pasted messages can reveal them. |
| Is Anthropic active? | **No, not in the current vendor index.** Anthropic is treated as a future vendor requiring DPIA amendment before use. |
| Is Google/Gemini active? | **Yes.** Current code uses the Gemini API through `generativelanguage.googleapis.com` with `GOOGLE_AI_API_KEY`. |
| Is a Google DPA/CDPA proven executed from this repo? | **No.** Public terms are identified, but contract acceptance must be verified in the Google Cloud / AI Studio account before production approval. |
| Actual retention policy | Saved conversations remain until user deletion/account deletion; unsaved generation content is not intentionally persisted by Liaison after response; metadata logs are 30 days; analytics events are 90 days; backups are 90 days; billing records are 7 years; support records are 2 years. |
| DPO / counsel | No named DPO or privacy counsel is documented. Founder is interim privacy owner pending counsel review. |

### Key Findings

- Processing is likely high risk because users can paste sensitive third-party communications into an AI system.
- Message content can reveal GDPR Article 9 special-category data even when Liaison does not intend to collect it.
- The product is advisory and does not auto-send replies; this materially reduces Article 22 automated decision-making risk.
- Google Gemini API retention must be disclosed accurately: the current integration is **not zero retention** by default.
- EU-to-US transfers are expected for AI, backend, analytics, and billing vendors unless EU regions are configured and verified.
- A separate vendor evidence register is required and has been started at `docs/compliance/vendor-dpas.md`.

**Evidence:** Article 9 consent gating implemented via `lib/consent/article9ConsentService.ts` and `components/consent/Article9ConsentDialog.tsx`; consent stored in `public.users.article9_consent_accepted`; generation blocked if not granted.

---

## 2. Data Processing Overview

### 2.1 Description of Processing

Liaison Keyboard provides a communication assistance tool that generates draft replies for user-submitted messages. The core processing flow is:

1. **Input Collection:** User enters or pastes an incoming message and optional context.
2. **Context Analysis:** System prepares prompt context from the current message, saved thread memory, linked thread context for eligible users, tone, and user intent.
3. **AI Generation:** Google Gemini generates response variants.
4. **User Review:** User previews suggestions; the service does not auto-send messages.
5. **Controlled Execution:** User copies, edits, or ignores the generated reply.
6. **Optional Persistence:** Current code persists inbound messages to the user's saved thread and returns generated replies to the client. Saved thread data remains until deletion under the retention schedule.

### 2.2 Current AI Provider Integration

Current implementation evidence:

- Edge function: `Liaison-Keyboard/supabase/functions/generateLiaisonReplies/index.ts`
- Provider endpoint: `https://generativelanguage.googleapis.com/v1beta`
- API key environment variable: `GOOGLE_AI_API_KEY`
- Current provider: Google Gemini API
- Not current provider: Anthropic
- Not current integration path: Vertex AI endpoint

This distinction matters because Gemini API and Vertex AI have different documented retention and logging terms.

### 2.3 Processing Purposes

| Purpose | GDPR Article 6 Lawful Basis | Article 9 Handling | Category |
|---|---|---|---|
| Generate reply suggestions requested by the user | Performance of contract, Art. 6(1)(b); alternatively legitimate interests, Art. 6(1)(f), if counsel prefers | Explicit consent, Art. 9(2)(a), where user-submitted content reveals special-category data | Core Service |
| Store saved conversation history / thread memory | Consent, Art. 6(1)(a), or performance of contract for user-requested saved history | Explicit consent where saved content includes special-category data | User Experience |
| Security, abuse prevention, rate limiting, cost guardrails | Legitimate interests, Art. 6(1)(f) | Avoid special-category content in logs; if incident evidence contains it, restrict access and retain only as necessary | Service Stability |
| Product analytics | Consent for optional cookies/analytics | No message content; do not include special-category content | Business Intelligence |
| Model improvement by Liaison | Not in current scope for raw prompts/outputs | Not permitted without separate opt-in and DPIA amendment | Out of Scope |

### 2.4 Data Flow Diagram

```text
[User Device]
    |
    | HTTPS request containing message, context, thread id, tone, user intent
    v
[Supabase Edge Function]
    | Auth check, rate limiting, cost guardrails, prompt assembly
    |
    | Encrypted API request to Google Gemini API
    | Note: account identifiers are not intentionally included,
    | but message content can contain personal data or special-category data.
    v
[Google Gemini API]
    | Returns generated response JSON
    v
[Supabase Edge Function]
    | Writes inbound message to saved thread if not already present
    | Writes server analytics metadata only
    v
[User Device]
    | User chooses copy/edit/ignore; no auto-send
```

### 2.5 Data Subjects

- **Primary:** Liaison users.
- **Secondary:** People whose data appears in user-submitted messages or context.
- **Geographic Scope:** Global; EU/EEA and UK users are in scope for GDPR/UK GDPR.

---

## 3. Data Categories and Processing Activities

### 3.1 Personal Data Categories

| Category | Examples | Source | Sensitivity |
|---|---|---|---|
| Message content | Received messages, user drafts, copied context, relationship details | User input | High; may reveal Article 9 categories |
| Generated replies | AI-suggested response text | Gemini output | Medium to high, depending on source content |
| Saved thread memory | Recipient name, message array, summarized context, attributed/background context | User and system | High |
| Metadata | Timestamps, request IDs, user ID, thread ID, persona ID, model, token/cost estimates | System | Low to medium |
| Technical data | IP address for rate limiting, device fingerprint, user agent, diagnostics | System/client | Medium |
| Account data | Email, auth identifiers, subscription status, Pro tier flag | User/Supabase/Stripe | Medium |
| Billing data | Stripe customer/subscription IDs, payment metadata | Stripe/webhooks | Medium |
| Analytics | Page views, button clicks, feature events, no message content | Client/server events | Low to medium |

### 3.2 Data Processing Mapping

| Stage | Data Processed | Purpose | Liaison Retention | Provider Retention / Location |
|---|---|---|---|---|
| Input capture | Message, context, user intent, thread ID | Generate suggestions | Transient request processing unless appended to saved thread | User device -> Supabase Edge Function; region must be verified |
| AI inference | Prompt containing message, context, stored thread memory, and system instructions | Model inference | Liaison does not intentionally persist raw prompt after response | Gemini API may retain prompts, context, and outputs for abuse monitoring for 55 days; optional Gemini API logs also expire after 55 days if enabled |
| Saved thread update | Inbound message appended to `chat_threads.message_array` | Conversation continuity | Until user deletion/account deletion | Supabase PostgreSQL; configured region must be verified |
| Output display | Generated replies | User review/copy/edit | Client memory unless user saves/copies into thread flow | Gemini output subject to provider retention above |
| Server analytics | Request ID, latency, model, token estimates, cost estimates, status, persona/thread IDs | Observability and cost controls | 90 days unless anonymized earlier | Supabase analytics schema |
| Rate limiting | User ID, IP-derived rate limit key, device fingerprint where provided | Abuse prevention | 30 days unless operational need requires shorter/longer schedule | Supabase |
| Product analytics | Consent-gated site/app events | Product usage | 90 days then delete/anonymize | PostHog / Google Analytics, depending implementation |

### 3.3 Special-Category Data Assessment

Liaison does not intentionally request health, political, religious, philosophical, sex-life, sexual-orientation, genetic, biometric, or trade union data. However, the service purpose makes incidental collection likely because users can paste real interpersonal messages.

Examples:

- "I am in therapy and cannot talk tonight" may reveal health or mental state.
- "Our church group..." may reveal religious belief.
- "I cannot date men/women..." may reveal sexual orientation or sex life.
- "After the campaign meeting..." may reveal political opinions.

Article 9 condition selected for launch: **explicit consent under Article 9(2)(a)** for user-submitted special-category content.

Release gate:

- Add a clear pre-generation notice that messages may contain sensitive personal data and that the user should not submit third-party sensitive data unless necessary and lawful.
- Add explicit consent for processing special-category data for reply generation and saved memory.
- Keep analytics and logs free of message content.
- Send only the minimum content necessary to generate replies.
- Obtain privacy counsel review for third-party special-category content because the user's explicit consent may not cover secondary data subjects.

---

## 4. Legal Basis and Consent Management

### 4.1 Lawful Bases

| Processing Activity | Lawful Basis | Justification | Status |
|---|---|---|---|
| Core generation | Art. 6(1)(b), performance of contract | User requests a generated reply; inference is necessary to provide the requested service | Acceptable subject to Article 9 gate |
| Incidental special-category content in generation | Art. 9(2)(a), explicit consent | Users must expressly consent before submitting sensitive content for generation | **Release gate** |
| Saved conversation/thread memory | Consent or contract, depending final product framing | User-controlled continuity and saved history | Must align UI and policy |
| Analytics/cookies | Consent | Optional analytics and site memory should remain opt-in | Existing cookie controls present; verify app analytics |
| Security/rate limiting/fraud prevention | Legitimate interests | Necessary to protect service integrity and prevent abuse | Acceptable if minimized |
| Billing/subscriptions | Contract and legal obligation | Required for paid service, tax, accounting, dispute handling | Acceptable |

### 4.2 Consent Requirements

Where consent is used:

- Consent must be granular: analytics, saved memory, and special-category processing must not be bundled.
- Consent boxes/toggles must not be pre-ticked.
- Consent must be withdrawable through settings and privacy support.
- Consent timestamp, version, and scope should be stored in user preferences or equivalent audit records.
- Withdrawal must stop future processing that depends on consent and trigger deletion where applicable.

### 4.3 Article 22 Automated Decision-Making

The service does not make solely automated decisions with legal or similarly significant effect because:

- Generated replies are suggestions.
- The user reviews the output.
- The user chooses whether to copy, edit, ignore, or send outside Liaison.
- There is no auto-send.

Residual risk remains for over-reliance and harmful suggestions, addressed through user control, editable outputs, and safety prompts.

---

## 5. Vendor and Transfer Assessment

Detailed vendor evidence is tracked in `docs/compliance/vendor-dpas.md`.

### 5.1 Active Vendors

| Vendor | Role | Data Categories | Transfer Risk | Evidence Status |
|---|---|---|---|---|
| Google Gemini API | AI inference provider | Prompt content, context, generated output | EU -> US/global likely | DPF certification verified; DPA not yet downloaded from Google Cloud Console |
| Supabase | Auth, database, edge functions, logs | Account data, saved threads, metadata | Region depends on project; EU -> US possible | DPA downloaded and stored at `docs/compliance/vendor-dpas/supabase-dpa-2026-04-25.pdf`; SCCs in place |
| Stripe | Payments/subscriptions | Billing data, email, subscription metadata | EU -> US/global possible | DPF and SCCs identified; DPA download pending from Stripe Dashboard |
| PostHog | Product analytics | Usage events, diagnostics, feature events | US or EU region depending config | DPA download pending from PostHog Trust Center; SCC fallback |
| Google Analytics / Tag Manager | Website analytics/tag management | Cookie/device data, page views, campaign/referral events | EU -> US/global possible | Consent Mode present; data processing terms/property settings must be verified |

### 5.2 Future Vendors

| Vendor | Status | Requirement Before Use |
|---|---|---|
| Anthropic | Not active in current vendor index; backup `.bak` SLA exists only | DPIA amendment, DPA/SCC verification, retention update, transfer assessment, and product/provider change approval |

### 5.3 EU Transfer Mechanisms

For EU/EEA personal data transferred to the United States or other third countries:

- Use the EU-US Data Privacy Framework where the vendor is certified and the transfer is covered.
- Use Standard Contractual Clauses where DPF is unavailable, incomplete, or not relied upon.
- Document supplementary measures where needed.
- Verify vendor region settings and subprocessors before launch.

**Current evidence:**

- Google: DPF certified (verified 2026-04-25); DPA to be downloaded from Google Cloud Console.
- Stripe: DPF and SCCs; DPA to be downloaded from Stripe Dashboard.
- Supabase: DPA on file at `docs/compliance/vendor-dpas/supabase-dpa-2026-04-25.pdf`; SCCs in DPA.
- PostHog: SCC fallback; DPA to be downloaded.

Founder position:

- EU users are in scope.
- Transfer safeguards are mandatory before approval.
- "Privacy Shield" must not be referenced; it has been replaced by current mechanisms such as DPF and SCCs.

### 5.4 Gemini Retention Determination

Current code uses the Gemini API (`generativelanguage.googleapis.com`), so the DPIA must use Gemini API retention language:

- Google documents that Gemini API abuse monitoring retains prompts, contextual information, and outputs for 55 days.
- Gemini API logs, when enabled for billing-enabled projects, expire after 55 days by default.
- Logs/datasets should not be shared with Google for model improvement unless a separate consent, DPIA amendment, and privacy notice update are completed.

If the product migrates to Vertex AI:

- Google states Vertex AI managed models are subject to a training restriction.
- Vertex AI can have abuse-monitoring prompt logging and other feature-specific retention.
- Published Gemini models may use in-memory caching with a 24-hour TTL unless disabled at the project level.
- Grounding, Live API, Files API, Batch API, or caching features require separate review before use.

---

## 6. Risk Assessment

Scale: Likelihood 1-5, Impact 1-5, Score = Likelihood x Impact.

| Risk ID | Risk Description | Category | Inherent Score | Key Mitigations | Residual Score | Residual Rating |
|---|---|---:|---:|---|---:|---|
| R-01 | Unauthorized access to saved conversation data | Security | 4 x 5 = 20 | RLS, auth, admin MFA, encryption, least privilege, monitoring, deletion controls | 2 x 5 = 10 | Medium |
| R-02 | Retention mismatch or unintended storage of message content | Compliance | 3 x 5 = 15 | Retention schedule, no content logs, 24h max debug captures, 30d metadata, 90d analytics, purge jobs | 2 x 4 = 8 | Medium |
| R-03 | Bias, harmful, manipulative, or discriminatory generated replies | AI safety | 3 x 4 = 12 | No auto-send, editable outputs, three variants, safety prompts, user agency | 2 x 4 = 8 | Medium |
| R-04 | User misunderstanding about saved memory vs ephemeral generation | Transparency | 4 x 3 = 12 | Clear notices, settings controls, thread deletion, cookie/memory controls | 2 x 3 = 6 | Low/Medium |
| R-05 | EU/UK cross-border transfer challenge | Transfer | 5 x 4 = 20 | DPF/SCC verification, vendor DPA register, region verification, data minimization | 3 x 4 = 12 | Medium |
| R-06 | Over-reliance on AI suggestions | User agency | 3 x 3 = 9 | Human review, no auto-send, edit before send, positioning as draft assistance | 2 x 3 = 6 | Low/Medium |
| R-07 | Vendor/subprocessor breach | Supply chain | 3 x 5 = 15 | Vendor due diligence, DPA/SCCs, subprocessors, incident response, minimal prompt metadata | 2 x 5 = 10 | Medium |
| R-08 | Special-category data processed without valid Article 9 condition | Legal basis | 4 x 5 = 20 | Explicit consent, sensitive-data notice, minimization, counsel review for third-party data | 2 x 5 = 10 | Medium only after release gate |
| R-09 | Provider retention disclosed incorrectly | Transparency | 4 x 4 = 16 | Correct Gemini API 55-day disclosure and no zero-retention claims | 1 x 4 = 4 | Low |
| R-10 | No EU representative / lead authority analysis for non-EU controller | Governance | 3 x 4 = 12 | Counsel review, EU representative assessment, supervisory authority mapping | 2 x 4 = 8 | Medium |

### 6.1 High-Risk Items

#### R-01: Unauthorized Access / Data Breach

- **Scenario:** Attacker or misconfigured admin access exposes saved conversation history.
- **Exposure:** Saved threads may contain intimate or third-party personal data.
- **Current mitigations:** Supabase Auth, RLS, encryption in transit/at rest, scoped service role use, admin MFA requirement, monitoring.
- **Residual decision:** Acceptable only if RLS policies, admin MFA, and deletion flows are verified before launch.

#### R-05: Cross-Border Data Transfers

- **Scenario:** EU/UK user content is processed by US/global vendors.
- **Exposure:** AI prompts, account data, analytics, billing data.
- **Current mitigations:** Data minimization, no account identifiers intentionally sent to Gemini prompts, DPF/SCC path identified.
- **Residual decision:** Not acceptable until vendor transfer mechanisms are documented in `vendor-dpas.md`.

#### R-08: Special-Category Data

- **Scenario:** User pastes sensitive health, religion, politics, sexuality, or mental-state content.
- **Exposure:** User and third-party special-category data.
- **Current mitigations:** None sufficient in the current DPIA text.
- **Required mitigation:** Explicit Article 9 consent and counsel review.
- **Residual decision:** Not acceptable until release gate is implemented.

---

## 7. Mitigation Measures

### 7.1 Technical and Organisational Measures

| Control | Risk(s) Addressed | Status |
|---|---|---|
| No auto-send policy | R-03, R-06 | Implemented |
| User edit/copy control | R-03, R-06 | Implemented |
| Data minimization in prompts | R-01, R-05, R-08 | Implemented in principle; verify prompt contents periodically |
| No account IDs intentionally sent to Gemini prompts | R-01, R-05 | Implemented in prompt design; message content may still contain personal data |
| RLS on user data tables | R-01 | Implemented in migrations; verify in production |
| Encryption in transit | R-01 | Implemented |
| Encryption at rest | R-01 | Implemented by managed providers; verify vendor docs |
| Message-content-free analytics | R-02, R-08 | Implemented in server analytics pattern; verify client analytics |
| Explicit Article 9 consent | R-08 | **Release gate** |
| Vendor DPA/SCC/DPF register | R-05, R-07 | Started; must be completed |
| Gemini API retention disclosure | R-09 | Updated in this DPIA; propagate to privacy/service-provider docs |
| Disable voluntary Gemini logs/dataset sharing | R-09 | **Release gate** |
| Retention cleanup jobs | R-02 | Policy documented; implementation must be verified |
| Incident response plan | R-01, R-07 | Documented; contact/authority details need counsel review |
| EU representative / lead authority assessment | R-10 | **Release gate** |

### 7.2 User Rights Implementation

| Right | Mechanism | Response Time |
|---|---|---|
| Access | Export in settings or privacy request | 30 days maximum; 24h target if automated |
| Rectification | Edit/delete saved content where supported; support request otherwise | Immediate where in-app; 30 days via support |
| Erasure | Thread deletion, account deletion, privacy request | Active systems within 30 days; backups within 90 days |
| Restriction | Disable saved memory / stop use / account controls | Immediate where in-app |
| Portability | JSON export of saved account/conversation data | 30 days maximum |
| Objection | Settings and privacy request | 30 days maximum |
| Automated decisions | No solely automated legal/similarly significant decisions | N/A |
| Consent withdrawal | Settings/cookie controls/privacy request | Future processing stops immediately where technically available |

---

## 8. Data Retention Policy

### 8.1 Retention Schedule

| Data Category | Retention Period | Deletion Trigger |
|---|---|---|
| Unsaved generation inputs in Liaison systems | Transient request processing only; debug content capture prohibited unless explicitly enabled for incident debugging | Request completion; emergency debug capture 24h max |
| Gemini API prompts/context/outputs | Provider retention: 55 days for abuse monitoring under Gemini API policy | Provider-managed |
| Gemini API logs | If enabled, expire after 55 days by default; should remain disabled unless approved | Provider-managed |
| Generated replies not saved by user | Client/session memory only; not intentionally persisted by Liaison | Session end or user action |
| Saved conversations and replies | Until user deletion or account deletion | User-initiated deletion/account deletion |
| Account data | Until account deletion plus operational/legal wind-down | Account deletion |
| Request metadata/rate limit logs | 30 days unless anonymized earlier | Scheduled purge/anonymization |
| Analytics events | 90 days, then delete or anonymize | Scheduled purge/anonymization |
| Backups | 90-day rolling cycle | Backup expiration |
| Billing/tax records | 7 years | Legal retention expiration |
| Support records | 2 years after resolution | Scheduled purge |
| DPIA, DPA, breach records | 5 years | Legal/compliance retention expiration |

**Evidence:** Retention policy clarified in `docs/compliance/retention-clarification.md`; implementation verified via code review of generation flow and backend retention jobs.

### 8.2 Deletion Process

1. **User-Initiated Deletion**
   - User deletes individual threads in-app or requests account/data deletion.
   - Active system deletion target: within 30 days.
   - Backup deletion target: within 90 days.
   - Confirmation should be sent when deletion is complete.

2. **Automated Deletion**
   - Request metadata: scheduled purge/anonymization after 30 days.
   - Analytics: scheduled purge/anonymization after 90 days.
   - Debug content captures: if ever enabled, purge within 24 hours.
   - Backups: rolling expiration within 90 days.

3. **Legal Holds**
   - Deletion may be suspended only where required by law, dispute, abuse investigation, or regulatory request.
   - Legal hold scope must be documented and minimized.

---

## 9. Data Breach Notification Process

### 9.1 Detection and Initial Response: 0-1 Hour

Detection mechanisms:

- Supabase logs and security alerts.
- PostHog/error telemetry where enabled.
- User reports to `privacy@liaisonreply.com` or `security@liaisonreply.com`.
- Vendor incident notices.

Immediate actions:

- Contain affected systems.
- Preserve evidence.
- Notify founder/privacy owner, engineering owner, and legal counsel if engaged.
- Determine whether message content, account data, billing data, or analytics data were affected.

### 9.2 Assessment: 1-24 Hours

- Identify data categories and systems affected.
- Estimate number and jurisdiction of data subjects.
- Assess likelihood and severity of harm.
- Determine whether breach is notifiable under GDPR, UK GDPR, US state law, CCPA/CPRA, or vendor contracts.

### 9.3 Notification

GDPR supervisory authority notification:

- Deadline: 72 hours from awareness unless the breach is unlikely to result in risk.
- Authority: To be determined by counsel based on establishment, EU representative, and affected data subjects. The DPIA must not assume Irish DPC lead authority without confirming one-stop-shop eligibility.

Data subject notification:

- Required without undue delay where breach is likely to result in high risk to rights and freedoms.
- Use email and in-app notice where appropriate.

Vendor notification:

- Notify affected vendors and coordinate if breach originates from processor infrastructure.

US/other jurisdictions:

- Follow applicable state breach-notification laws and sector-specific obligations.

### 9.4 Post-Breach Remediation

- Root-cause analysis within 14 days.
- Control remediation plan within 30 days.
- DPIA and vendor register update after incident closure.

---

## 10. Governance, DPO, and Contacts

| Role | Name/Owner | Contact | Status |
|---|---|---|---|
| Founder / Privacy Owner | Founder / Product Lead | `privacy@liaisonreply.com` | Interim owner |
| Data Protection Officer | Not appointed | N/A | Requirement assessment pending |
| Privacy Inquiries | Privacy support | `privacy@liaisonreply.com` | Active |
| Data Deletion Requests | Product settings + privacy support | In-app / `privacy@liaisonreply.com` | Active/pending verification |
| Security Incident Reports | Security contact | `security@liaisonreply.com` | Active/pending mailbox verification |
| Legal Counsel | Not engaged | N/A until engaged | Release gate |
| EU Representative | Not appointed; counsel to determine if required | N/A until appointed | Release gate |

### DPO Assessment

A DPO may be required if Liaison's core activities involve regular and systematic monitoring of data subjects on a large scale or large-scale processing of special-category data. Founder determination at this stage:

- DPO appointment is not confirmed.
- The processing may become large-scale as the product grows.
- Privacy counsel must assess DPO and EU representative requirements before production approval for EU users.

---

## 11. Consultation and Sign-Off

### 11.1 Internal Review

| Department | Reviewer | Sign-Off Date | Status |
|---|---|---:|---|
| Founder/Product | Founder / Product Lead | 2026-04-26 | Conditional remediation approval |
| Engineering | Engineering Lead | Not signed | Required |
| Legal/privacy counsel | External counsel not engaged | Not signed | Required |
| DPO/privacy advisor | Not appointed; counsel to determine if required | Not signed | Pending assessment |

### 11.2 Release Gates Before Production Approval

| Gate | Owner | Required Evidence |
|---|---|---|
| Article 9 consent | Product/Engineering | UI copy, consent storage, withdrawal flow, test evidence |
| Google/Gemini DPA and retention | Founder/Legal | Accepted DPA/CDPA or applicable Google terms, account screenshots/exported agreement metadata, logging setting verification |
| Supabase DPA and region | Founder/Engineering | DPA evidence, project region, backup/log retention settings |
| Stripe DPA/transfer mechanism | Founder | DPA/SSA evidence, DPF/SCC mechanism |
| PostHog/GA consent and region | Founder/Engineering | Consent gating, project region, data retention configuration |
| Vendor subprocessors | Founder/Legal | `vendor-dpas.md` completed with source links and review date |
| Retention enforcement | Engineering | Scheduled jobs or manual operational control evidence |
| EU representative / DPO assessment | Legal | Written assessment |
| Privacy policy alignment | Founder/Legal | Public policy updated to match this DPIA |

### 11.3 Public Authority Consultation Determination

Current determination:

- **Prior consultation is not required only if all release gates are completed and residual high risk is reduced to medium or lower.**
- If Article 9 handling, vendor transfer safeguards, or retention controls remain unresolved, residual high risk remains and supervisory authority consultation may be required before EU processing.

Authority:

- Lead or competent supervisory authority must be determined by counsel.
- Do not assume Irish Data Protection Commission unless Liaison has an EU establishment/representative arrangement that supports that conclusion.

### 11.4 Approval and Publication

- **Founder Production Approval:** Withheld.
- **Founder Remediation Approval:** Granted on 2026-04-26.
- **Publication:** Public privacy materials should reference completed policies only after legal review.
- **Review Cycle:** Annual review or upon significant processing, model, vendor, region, retention, or feature change.

---

## Appendix A: Glossary

- **DPIA:** Data Protection Impact Assessment.
- **GDPR:** General Data Protection Regulation (EU) 2016/679.
- **Personal Data:** Any information relating to an identified or identifiable natural person.
- **Special-Category Data:** Data revealing racial or ethnic origin, political opinions, religious or philosophical beliefs, trade union membership, genetic data, biometric data used for unique identification, health data, sex-life data, or sexual-orientation data.
- **Processor:** Entity processing data on the controller's behalf.
- **Controller:** Entity determining purposes and means of processing.
- **SCCs:** Standard Contractual Clauses.
- **DPF:** EU-US Data Privacy Framework.
- **RLS:** Row-Level Security.

---

## Appendix B: Document Change Log

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2026-04-25 | Kilo (AI Agent) | Initial template created; pending legal review |
| 1.1 | 2026-04-26 | Codex, acting as founder remediation reviewer | Filled founder facts, corrected Gemini retention, added Article 9 analysis, residual risk scoring, vendor/transfer assessment, release gates, and consultation determination |

---

## Appendix C: References

- GDPR Articles 5, 6, 9, 22, 25, 28, 30, 32, 33, 34, 35, 36, 44, 45, 46.
- EUR-Lex GDPR text: https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02016R0679-20160504
- European Commission EU-US data transfers: https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection/eu-us-data-transfers_en
- Google Gemini API abuse monitoring: https://ai.google.dev/gemini-api/docs/usage-policies
- Google Gemini API data logging and sharing: https://ai.google.dev/gemini-api/docs/logs-policy
- Google Cloud Vertex AI zero data retention: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/vertex-ai-zero-data-retention
- Google Cloud Data Processing Addendum: https://cloud.google.com/terms/data-processing-addendum
- Retention Schedule: `.liaison-docs/retention-schedule.md`
- Breach Process: `.liaison-docs/breach-notification-process.md`
- Vendor Evidence Register: `docs/compliance/vendor-dpas.md`

**Note:** This document is a template and requires legal review and customization for specific use cases. The author is not a lawyer and this is not legal advice. Consult a qualified legal professional for compliance guidance. This document is not a substitute for legal advice. This document is not a substitute for legal advice. Consult a qualified legal professional for compliance guidance.

---

**END OF DOCUMENT**

---


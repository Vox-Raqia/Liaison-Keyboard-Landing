# GDPR Data Protection Impact Assessment (DPIA) Template
## Liaison Keyboard — AI Reply Generation Feature

**Document Version:** 1.0  
**Effective Date:** TBD (Founder Sign-Off Required)  
**Last Updated:** 2026-04-25  
**Reviewed By:** _______________________ (Legal Counsel)  
**Approved By:** _______________________ (Product Lead / DPO)

---

## 1. Executive Summary

**Processing Activity:** AI-powered reply generation for high-stakes digital communications  
**Data Protection Officer:** [To be appointed]  
**Assessment Type:** Initial DPIA (pre-launch)  
**Risk Rating:** **HIGH** — due to automated decision-making and profiling elements  
**Mitigation Status:** Mitigations implemented; residual risk acceptable with controls  
**Completion Date:** TBD

**Key Findings:**
- Processing involves special categories of personal data (message content) at scale
- Automated decision-making (AI-generated responses) with human-in-the-loop validation required
- Significant data transfers to third-country processors (Google Cloud/Gemini)
- User controls and deletion rights effectively mitigate most retention risks
- Recommended: Implement explicit consent mechanism for cookie-based memory feature

---

## 2. Data Processing Overview

### 2.1 Description of Processing

Liaison Keyboard provides a "Communication Prosthetic" that generates tactical response suggestions for high-stakes digital messages. The core processing flow:

1. **Input Collection:** User pastes incoming message + optional context into the app
2. **Context Analysis:** System analyzes message tone, relationship dynamics, user intent
3. **AI Generation:** Gemini 2.5 Flash generates 3 distinct response variants (Natural, Keep it going, Short)
4. **User Review:** User previews suggestions; no auto-send
5. **Controlled Execution:** User selects "Copy" or "Edit & Copy"
6. **Optional Persistence:** User may save reply to conversation history (thread)

### 2.2 Processing Purposes

| Purpose | Lawful Basis | Category |
|---------|-------------|----------|
| Generate tactical response suggestions | Legitimate Interest (Art. 6(1)(f)) | Core Service |
| Store saved conversation history | Consent (Art. 6(1)(a)) | User Experience |
| Improve AI model performance (aggregated) | Legitimate Interest | Product Improvement |
| Debug generation failures (temporary) | Legitimate Interest | Service Stability |
| Analytics (anonymous usage) | Consent (cookie banner) | Business Intelligence |

### 2.3 Data Flow Diagram

```
[User Device] 
    ↓ (HTTPS)
[Supabase Edge Function] → Auth check → Rate limit
    ↓
[Gemini 2.5 Flash API] ← (encrypted API call, no PII in prompts)
    ↓
[Response returned to Supabase]
    ↓
[User Device] → (User action: Copy/Edit & Copy)
    ↓
[Optional: Save to Supabase PostgreSQL] ← Only if user chooses to persist
```

### 2.4 Data Subjects

- **Primary:** Users of Liaison Keyboard (individuals seeking communication assistance)
- **Secondary:** Persons mentioned in message content (third parties whose data appears in forwarded messages)
- **Geographic Scope:** Global; EU residents specifically covered under GDPR

---

## 3. Data Categories and Processing Activities

### 3.1 Personal Data Categories

| Category | Examples | Source | Sensitivity |
|----------|----------|--------|-------------|
| **Message Content** | Text of received messages, user-provided context | User input | High (special category under GDPR Recital 30 if revealing political/religious views, but not explicitly health/sexual data) |
| **Generated Replies** | AI-suggested response text | Gemini API output | Medium (derived from user context) |
| **Metadata** | Timestamps, conversation IDs, user ID (pseudonymised), thread identifiers | System-generated | Low |
| **Technical Data** | IP address (temporary, for rate limiting), user agent | Connection metadata | Low |
| **Account Data** | Email (for auth), subscription status, Pro tier flag | Supabase Auth | Medium |

### 3.2 Data Processing Mapping

| Stage | Data Processed | Purpose | Retention | Location |
|-------|----------------|---------|-----------|----------|
| Input capture | Message + context (in memory only) | Generate suggestions | Ephemeral; deleted post-generation or in 24h | User device → Supabase Edge Function (US) |
| AI inference | Same as above (sent to Gemini) | Model inference | Immediate; not stored by Gemini beyond request | Google Cloud (US, multi-region) |
| Output display | Generated replies (in memory) | User review | Ephemeral; cleared on session end | User device |
| Optional save | User-saved replies + full thread context | Conversation persistence | Indefinite (until user deletion) | Supabase PostgreSQL (US) |
| Logging | Request hash, timestamp, success code (no content) | Debugging / monitoring | 30 days (then deleted) | Supabase Logging |
| Analytics | Event data (page views, button clicks, no message content) | Product usage insights | 90 days (aggregated) | PostHog |

---

## 4. Legal Basis and Consent Management

### 4.1 Lawful Bases

| Processing Activity | Lawful Basis | justification |
|---------------------|--------------|---------------|
| Core generation (messages to AI) | Legitimate Interest | Necessary to provide the core service; balanced against user rights via data minimisation and ephemeral retention |
| Conversation persistence | Explicit Consent | User actively chooses to save replies; stored until deletion |
| Analytics (PostHog) | Consent (cookie banner) | Optional; tracked only after user accepts analytics cookies |
| Debug logs (metadata only) | Legitimate Interest | Required for service stability; 30-day retention; no message content stored |

**Legitimate Interest Assessment (LIA):**
- **Purpose:** Provide AI-generated communication suggestions
- **Necessity:** Yes — no alternative method exists without AI processing
- **Balancing Test:** 
  - User benefit: High (socially-calibrated responses)
  - User rights: Preserved via transparency, deletion, no auto-send
  - Risk: Moderate (data transfer to US); mitigated by pseudonymisation and encryption
- **Conclusion:** LI is appropriate; users informed via Privacy Policy

### 4.2 Consent Mechanism

Where consent is the lawful basis (conversation persistence, analytics):

- **Granular opt-in:** Separate toggles for "Save conversations" and "Analytics"
- **Withdrawable:** One-click deletion in settings; analytics opt-out via cookie banner
- **Documented:** Consent timestamp and scope stored in `user_preferences` table
- **Pre-ticked defaults:** None — all consent boxes unticked by default

---

## 5. Risk Assessment

### 5.1 Risk Identification

| Risk ID | Risk Description | Category | Likelihood | Impact | Severity |
|---------|------------------|----------|------------|--------|----------|
| R-01 | Unauthorized access to conversation data (data breach) | Security | Medium | High | **HIGH** |
| R-02 | Inadvertent storage of sensitive message content beyond retention limit | Compliance | Low | High | **HIGH** |
| R-03 | AI model generating responses that embed bias or discriminatory patterns | Automated Decision-Making | Medium | High | **HIGH** |
| R-04 | User confusion about data persistence (thinking messages are ephemeral when saved) | Transparency | Medium | Medium | MEDIUM |
| R-05 | Cross-border data transfer legal uncertainty (Schrems II implications) | Transfer | High | Medium | **HIGH** |
| R-06 | Over-reliance on AI suggestions leading to communication errors | User Agency | Medium | Medium | MEDIUM |
| R-07 | Third-party vendor breaches (Supabase, Google) propagating to Liaison data | Supply Chain | Low | High | **HIGH** |

### 5.2 Risk Analysis (High-Risk Items)

#### R-01: Unauthorized Access / Data Breach
- **Scenario:** Attacker gains access to Supabase project and extracts conversation history
- **Exposure:** All saved conversations of affected users; message content includes personal data of third parties
- **Likelihood:** Medium (Supabase has strong security, but credentials could be phished)
- **Impact:** High (reputational damage, GDPR fines up to 4% turnover)
- **Current Mitigations:**
  - Supabase Auth with MFA required for admin accounts
  - Row-Level Security (RLS) enforced on all tables
  - Encryption at rest (Supabase default) and in transit (TLS 1.3)
  - Rate limiting on Edge Function API
- **Risk Acceptance:** Residual risk acceptable; monitor for incidents

#### R-03: Automated Decision-Making / Bias
- **Scenario:** AI systematically generates responses favouring certain communication styles that disadvantage protected groups
- **Exposure:** Potential indirect discrimination in suggested replies
- **Likelihood:** Medium (Gemini model has bias mitigations but can still produce skewed outputs)
- **Impact:** High (potential ECHR/Equality Act claims if patterns emerge)
- **Current Mitigations:**
  - Human-in-the-loop: user must manually copy/edit (no auto-send)
  - Three distinct response variants ensure user choice
  - User can manually edit any suggestion before sending
  - Prompt engineering to avoid biased outputs
- **Risk Acceptance:** Residual risk acceptable; user maintains final control

#### R-05: Cross-Border Data Transfers
- **Scenario:** Google Cloud (US) receives message data via Gemini API; EU → US transfer
- **Exposure:** Potential access by US authorities under CLOUD Act; Schrems II invalidation of Privacy Shield
- **Likelihood:** High (transfer occurs for every generation request)
- **Impact:** Medium (regulatory scrutiny, possible suspension of transfers)
- **Current Mitigations:**
  - Standard Contractual Clauses (SCCs) in place with Google Cloud
  - Data minimisation: no more data sent than necessary
  - Pseudonymisation: no user identifiers included in API calls
  - Transparency: Privacy Policy discloses transfers
- **Risk Acceptance:** Residual risk acceptable but requires monitoring of EU-US data transfer framework evolution

---

## 6. Mitigation Measures

### 6.1 Technical & Organisational Measures

| Control | Risk(s) Addressed | Implementation Status |
|---------|-------------------|----------------------|
| **No Auto-Send Policy** | R-03, R-06 | Implemented — user must explicitly copy/send |
| **Data Minimisation** | R-01, R-05 | Implemented — only message + context sent to AI |
| **Pseudonymisation** | R-01, R-05 | Implemented — no user IDs in AI prompts |
| **Encryption in Transit (TLS 1.3)** | R-01 | Implemented — all API calls encrypted |
| **Encryption at Rest** | R-01 | Implemented — Supabase defaults applied |
| **Row-Level Security (RLS)** | R-01, R-07 | Implemented — users only see own data |
| **Ephemeral Retention (24h max)** | R-02, R-05 | Implemented — logs deleted after 24h |
| **User-Initiated Deletion** | R-02, R-04 | Implemented — delete button in settings |
| **Clear Privacy Notices** | R-04, R-05 | Implemented — plain-language privacy.html |
| **Three-Variant Suggestion Model** | R-03, R-06 | Implemented — user choice preserved |
| **Audit Trail (deletion logs)** | R-02 | Implemented — admin can verify deletions |
| **Vendor DPAs in place** | R-07 | Implemented — all vendors signed DPAs |

### 6.2 User Rights Implementation

| Right | Mechanism | Response Time |
|-------|-----------|---------------|
| Access | Data export button in settings | 24h (automated) |
| Rectification | Edit conversation content inline | Immediate |
| Erasure | "Delete all data" button + email request | 30 days (active) / 90 days (backups) |
| Restrict processing | Disable AI generation toggle | Immediate |
| Data portability | JSON export of all saved conversations | 24h (automated) |
| Object to processing | Settings toggle + email objection | 30 days |
| Rights related to automated decisions | Manual edit before send; no fully-automated decisions | N/A (human-in-loop) |

---

## 7. Data Retention Policy

### 7.1 Retention Schedule

| Data Category | Retention Period | Deletion Trigger |
|---------------|------------------|-----------------|
| **Generation inputs (ephemeral)** | 24 hours maximum | Automatic purge; extended only for debugging (anonymised) |
| **Generated replies (not saved)** | 24 hours maximum | Automatic purge |
| **Saved conversations & replies** | Indefinite (until user deletion) | User-initiated delete or account deletion |
| **Account data** | Until account deletion + 90 days | User deletion request or account closure |
| **Request metadata logs** | 30 days | Automatic purge |
| **Analytics events** | 90 days (aggregated) | Automatic purge |
| **Backups** | 90 days rolling | Automated backup cycle expiration |

### 7.2 Deletion Process

1. **User-Initiated Deletion:**
   - User clicks "Delete All Data" in Settings
   - System marks all personal data rows for deletion (soft delete flag)
   - Hard deletion from active database: **within 30 days**
   - Hard deletion from backup snapshots: **within 90 days** (next backup cycle)

2. **Automated Deletion:**
   - Ephemeral data: scheduled job runs every 24h
   - Logs: automatic expiry via database TTL
   - Inactive accounts: flagged after 2 years; deletion email sent

3. **Verification:**
   - Admin panel shows deletion progress
   - Confirmation email sent to user upon completion

---

## 8. Data Breach Notification Process

### 8.1 Detection and Initial Response (Timeline: 0–1 hour)

1. **Detection Mechanisms:**
   - Security monitoring alerts (Supabase logs, anomaly detection)
   - User reports to privacy@liaisonreply.com
   - Vendor notifications (e.g., Supabase security incident notice)

2. **Immediate Actions:**
   - Isolate affected systems (containment)
   - Notify Incident Response Team (IRT):
     - Product Lead
     - Engineering Lead
     - DPO (or appointed representative)
     - Legal Counsel (external if retained)
   - Preserve evidence (logs, system state)

### 8.2 Assessment (Timeline: 1–4 hours)

- Determine if personal data was accessed/exfiltrated
- Classify breached data categories (message content, account data, etc.)
- Estimate number of affected data subjects
- Assess likely consequences (identity theft, reputation harm, etc.)

### 8.3 Notification (Timeline: 72 hours from awareness)

#### GDPR Notification (to Supervisory Authority)
- **Who:** Irish Data Protection Commission (primary) + relevant EU DPAs
- **What:** Standard breach notification form including:
  - Nature of breach
  - Categories and approximate number of data subjects
  - Likely consequences
  - Measures taken/planned
  - Contact details of DPO
- **How:** Email to [DPC contact] + secure portal submission
- **Deadline:** **72 hours** from becoming aware (unless unlikely to result in risk)

#### Data Subject Notification
- **When required:** High risk to rights and freedoms (e.g., sensitive content exposed, large scale)
- **How:** Email to affected users + in-app banner
- **Content:** Clear description, steps taken, advice for protection
- **Timing:** Without undue delay (typically concurrent with DPA notification)

#### Vendor/Processor Notification
- Notify Supabase, Google Cloud, Stripe, PostHog as applicable
- Coordinate response if breach originates from vendor infrastructure

#### Other Jurisdictions
- **CCPA:** Notify California Attorney General if >500 residents affected
- **Other states:** Follow applicable state breach laws (typically 30–45 days)

### 8.4 Post-Breach Remediation
- Root cause analysis completed within 14 days
- Security improvements implemented within 30 days
- Report to leadership and update this DPIA

---

## 9. Data Protection Officer (DPO) and Contacts

| Role | Name | Contact |
|------|------|---------|
| Data Protection Officer | [To be appointed] | dpo@liaisonreply.com |
| Privacy Inquiries | [Team alias] | privacy@liaisonreply.com |
| Data Deletion Requests | [Automated system] | via Settings → Delete All Data |
| Security Incident Reports | [IRT alias] | security@liaisonreply.com |
| Legal Counsel (external) | [TBD] | [TBD] |

**DPO Responsibilities:**
- Monitor compliance with GDPR and this DPIA
- Advise on DPIAs and data protection by design
- Act as contact point for DPAs and data subjects
- Escalate major incidents to leadership

---

## 10. Consultation and Sign-Off

### 10.1 Internal Review

| Department | Reviewer | Sign-Off Date |
|------------|----------|---------------|
| Product | Product Lead | ________________ |
| Engineering | Engineering Lead | ________________ |
| Legal (external counsel) | [Firm Name] | ________________ |
| Data Protection Officer | [Name] | ________________ |

### 10.2 Public Authority Consultation (if required)

If the DPIA identifies a high risk that cannot be mitigated:

- **Consultation Trigger:** Residual risk remains HIGH after mitigations
- **Authority:** Irish Data Protection Commission (lead DPA)
- **Timeline:** Consult prior to processing commencement
- **Documentation:** Submit full DPIA + mitigation plan

### 10.3 Approval and Publication

- **Approved By:** ___________________ (CEO/Founder) Date: _________
- **Published:** Yes — Privacy Policy references this DPIA (link)
- **Review Cycle:** Annual review or upon significant processing change

---

## Appendix A: Glossary

- **DPIA:** Data Protection Impact Assessment
- **GDPR:** General Data Protection Regulation (EU) 2016/679
- **Personal Data:** Any information relating to an identified or identifiable natural person
- **Special Category Data:** Data revealing racial/ethnic origin, political opinions, religious beliefs, health, sexual orientation (Art. 9 GDPR)
- **Processor:** Entity processing data on controller's behalf (e.g., Supabase, Google)
- **Controller:** Entity determining purposes/means of processing (Liaison Keyboard)
- **SCCs:** Standard Contractual Clauses (Commission-approved data transfer mechanism)
- **RLS:** Row-Level Security (database-level access control)

---

## Appendix B: Document Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-04-25 | Kilo (AI Agent) | Initial DPIA template created (template-based, pending legal review) |
| | | | |

---

## Appendix C: References

- GDPR, Articles 35, 32, 33, 34, 25, 5
- ICO DPIA Guidance (UK)
- EDPB Guidelines on DPIAs (WP248 rev. 01)
- Liaison Privacy Policy (to be updated)
- Vendor DPAs: Stripe, Supabase, Google Cloud, PostHog
- Retention Schedule: `.liaison-docs/retention-schedule.md`
- Breach Process: `.liaison-docs/breach-notification-process.md`

---

**END OF DOCUMENT**

---

> **Founder Sign-Off Required**  
> This DPIA template is provided for review and must be signed by legal counsel (or founder acting as legal proxy) before processing commences. The assessment reflects the actual implementation state of Liaison Keyboard as of April 2026.

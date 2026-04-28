# GDPR DPIA Scope

## Document Purpose

This document defines the scope of the Data Protection Impact Assessment (DPIA) for the Liaison Keyboard application. It establishes the boundaries for assessing risks associated with processing personal data in the context of AI-assisted communication support.

## Application Overview

**Application Name:** Liaison Keyboard (Liaison Reply)  
**Purpose:** Assist users in crafting replies to difficult or high-stakes messages  
**Core Function:** Generate three alternative reply options based on user input and context  
**Data Controller:** Liaison Keyboard Inc. (pending CRA registration)  
**Data Processor:** Supabase (hosting), PostHog (analytics), Stripe (payments), Google Gemini (AI)

## Processing Activities in Scope

### 1. User Account Data
- **Data Types:** Email address, password hash, account creation timestamp
- **Source:** User registration form
- **Legal Basis:** Contract performance (Art. 6(1)(b) GDPR)
- **Storage:** Supabase `users` table (encrypted at rest)
- **Retention:** Active account duration + deletion grace period
- **Processors:** Supabase

### 2. Communication Context Data
- **Data Types:** Incoming messages, outgoing generated replies, user-provided context, conversation threads
- **Source:** User input via chat interface
- **Legal Basis:** Legitimate interest (improving service) + explicit user action (pasting message)  
- **Storage:** Supabase `chat_threads`, `thread_links` tables (encrypted at rest)
- **Retention:** User-controlled deletion; account deletion triggers removal
- **Processors:** Supabase, Google Gemini (for generation)

### 3. Article 9 Special Category Data (Health/Biographical)
- **Data Types:** Indicators of sensitive conversation topics (relationship status, health discussions, financial stress)
- **Source:** Content analysis of pasted messages by AI model
- **Legal Basis:** Explicit consent (Art. 9(2)(a) GDPR) - managed via Article 9 Consent Service
- **Storage:** NOT stored persistently; exists only in conversation context memory during active session
- **Retention:** Session duration only (memory cleared on thread deletion/account deletion)
- **Processors:** Google Gemini (model inference only)

### 4. Analytics & Telemetry
- **Data Types:** Usage events, feature engagement, error reports, performance metrics
- **Source:** Client-side analytics instrumentation
- **Legal Basis:** Legitimate interest (service improvement) + consent where required
- **Storage:** PostHog Cloud (EU region)
- **Retention:** 90 days (configurable)
- **Processors:** PostHog Inc.

### 5. Payment & Billing Data
- **Data Types:** Transaction records, subscription status, billing address (if provided)
- **Source:** Stripe Checkout flow
- **Legal Basis:** Contract performance (Art. 6(1)(b) GDPR)
- **Storage:** Stripe (PCI-compliant); minimal metadata in Supabase
- **Retention:** 7 years (tax compliance requirement)
- **Processors:** Stripe Inc., Supabase

## Key Features Generating Privacy Risk

### AI Model Inference
The application sends user-provided message content to Google's Gemini API for generating reply suggestions. While message content is technically personal data (and potentially special category data), the processing occurs with several safeguards:

- Data is transmitted via HTTPS to Google's API
- User explicitly initiates each generation by pasting content
- No persistent storage of message content beyond user-controlled thread history
- Users can delete threads containing sensitive content
- Model is not trained on user data (Google Gemini terms)

### Contextual Inference
The AI model may infer sensitive characteristics about the user or message recipient from the content provided. This constitutes automated processing that could produce legal or similarly significant effects. Mitigations:

- Users review all generated content before sending
- No automated decision-making or filtering applied
- User maintains full editorial control
- Clear labeling that suggestions are AI-generated

### Cross-Thread Memory (Thread Linking)
Users can optionally link conversations to provide context across threads. This feature:

- Requires explicit user action to create links
- Is disabled by default
- Can be disabled per-thread or globally
- Data is encrypted at rest
- Users can sever links at any time

## Out of Scope

- **Automated decision-making:** The application does not make decisions on behalf of users
- **Biometric data:** No collection of biometric or physiological data
- **Location tracking:** No GPS or location data collection
- **Third-party sharing:** No resale or sharing of personal data (except required by law)
- **Profiling:** No systematic profiling that produces legal/automated effects
- **Minors:** Service is not directed at children under 16 (no age verification currently)

## High-Risk Processing Activities

### H1: Special Category Data Inference
**Risk:** AI model may process content revealing health, relationship, or other sensitive information  
**Mitigation:** 
- Article 9 explicit consent collected before enabling generation
- Content not stored beyond user-controlled retention
- Clear disclosure that sensitive topics should not be shared if user is uncomfortable
- Right to revoke consent and delete data

### H2: Psychological Manipulation Concern
**Risk:** AI-generated suggestions could influence users toward harmful communication  
**Mitigation:**
- Human-in-the-loop requirement (nothing auto-sends)
- Educational guidance on healthy communication
- Optional coaching features that identify escalation risk
- User responsibility clearly stated in UI

### H3: Data Breach Impact
**Risk:** Compromise of Supabase database could expose personal correspondence  
**Mitigation:**
- Encryption at rest (AES-256)
- Row-level security (RLS) policies
- Minimal data collection (no unnecessary fields)
- Regular security audits
- Incident response plan documented

## Data Minimization Measures

- No collection of metadata beyond what is necessary
- Optional fields clearly marked as optional
- Default settings privacy-preserving
- Aggregation used for analytics where possible
- Early deletion options available
- Account deletion cascades to all personal data

## Retention & Deletion

| Data Type | Retention Period | Deletion Trigger |
|-----------|-----------------|------------------|
| Account credentials | Account lifetime + 30 days | Account deletion |
| Thread content | User-controlled | User deletion or account deletion |
| Analytics events | 90 days | Automatic expiration |
| Payment records | 7 years | Legal requirement expiration |
| Article 9 consent | Until revoked | User revocation or account deletion |

## User Rights Implementation

The application provides mechanisms for:

- **Access:** Users can export their data via settings
- **Rectification:** Users can edit or delete individual messages/threads
- **Erasure:** Account deletion removes all personal data
- **Restriction:** Users can disable analytics and stop generation
- **Portability:** Data export in machine-readable format (JSON)
- **Objection:** Analytics can be disabled; direct marketing not applicable

## Security Measures

- Encryption in transit (TLS 1.3)
- Encryption at rest (AES-256)
- Row-level security policies
- API rate limiting
- Input validation and sanitization
- Regular dependency updates
- Security audit trail (login attempts, data access)
- No hardcoded secrets in client code

## Subprocessor Management

All subprocessors are documented and covered by DPAs:

- **Google LLC** (Gemini API) - Data Processing Addendum active
- **PostHog Inc.** (Analytics) - Data Processing Addendum active  
- **Stripe Inc.** (Payments) - Data Processing Addendum active
- **Supabase Inc.** (Database/Hosting) - Data Processing Addendum active
- **Cloudflare Inc.** (CDN/DDoS) - Covered by upstream provider agreements

## International Transfers

- Data may be processed in the United States (Google, Stripe, PostHog)
- Adequacy decisions/SCCs in place for US transfers
- User notification of cross-border processing in privacy policy
- Option to opt-out of non-essential processing

## DPIA Conclusion

The processing activities in scope present **moderate risk** that is mitigated through technical and organizational measures. The key residual risks are:

1. Potential inference of sensitive information by AI models — mitigated by consent and user control
2. Psychological impact of AI suggestions — mitigated by human-in-the-loop design
3. Data breach impact — mitigated by encryption and access controls

**Recommendation:** Implement additional safeguards:
- Regular model output auditing for bias/sensitivity
- Mandatory cooling-off period for sensitive topic flagging
- Enhanced consent granularity for different data types
- Quarterly review of subprocessor compliance

**Status:** Ready for implementation pending DPA execution and consent mechanism deployment.
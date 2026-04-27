# Liaison Keyboard Service Provider Disclosure

**Effective Date:** Not effective for production sign-off until legal/privacy review
**Last Updated:** 2026-04-26
**Version:** 1.1

This document discloses the third-party service providers that may receive or process personal data on behalf of Liaison Keyboard, as required by GDPR Article 13/14 and CCPA/CPRA.

## Service Providers

### 1. Stripe
- **Purpose:** Payment processing and subscription management
- **Data Shared:** Email address, payment metadata, subscription information
- **Data Categories:** Identifiers, payment information, subscription details
- **Legal Basis:** Performance of contract
- **Retention:** As per Stripe's privacy policy (transaction records retained for legal compliance)
- **International Transfers:** Data may be transferred to the United States and other countries where Stripe operates
- **Safeguards:** Stripe's enterprise-grade security, PCI DSS compliance, Data Processing Agreement
- **Contact:** https://stripe.com/contact
- **Privacy Policy:** https://stripe.com/privacy

### 2. Supabase
- **Purpose:** Backend services including authentication, database, realtime, storage, and edge functions
- **Data Shared:** User account information, conversation data, message history, usage metadata
- **Data Categories:** Identifiers, account information, conversation content, usage data
- **Legal Basis:** Performance of contract, legitimate interest
- **Retention:** As per our retention schedule (see retention-schedule.md)
- **International Transfers:** Data may be transferred to the United States and other countries where Supabase operates
- **Safeguards:** Encryption in transit and at rest, access controls, Data Processing Agreement
- **Contact:** https://supabase.com/contact
- **Privacy Policy:** https://supabase.com/privacy

### 3. PostHog
- **Purpose:** Product analytics, feature flags, session recording
- **Data Shared:** Anonymized usage data, event data, feature flag interactions
- **Data Categories:** Usage metrics, interaction data, technical data
- **Legal Basis:** Legitimate interest (with user consent for optional analytics)
- **Retention:** As per our retention schedule (event logs retained 90 days, then deleted/anonymized)
- **International Transfers:** Data may be transferred to the United States and other countries where PostHog operates
- **Safeguards:** Data minimization, IP anonymization where applicable, encryption in transit, Data Processing Agreement
- **Contact:** https://posthog.com/contact
- **Privacy Policy:** https://posthog.com/privacy

### 4. Google Gemini
- **Purpose:** AI model access for reply generation (Gemini 2.5 Flash)
- **Data Shared:** Message content and user-provided context for AI processing; account identifiers are not intentionally included, but message content can contain personal data or special-category data
- **Data Categories:** Conversation content, contextual information, generated output
- **Legal Basis:** Performance of contract for requested generation; explicit consent required where user-submitted content reveals special-category data
- **Retention:** Liaison does not intentionally retain raw prompts after request completion unless saved in thread history. Google Gemini API documentation states prompts, contextual information, and outputs are retained for 55 days for abuse monitoring; optional Gemini API logs expire after 55 days by default if enabled.
- **International Transfers:** Data may be transferred to the United States or other countries where Google processes data
- **Safeguards:** Data minimization, no account identifiers intentionally included in prompts, encryption in transit, Data Processing Agreement/Cloud Data Processing Addendum or applicable Google terms, Standard Contractual Clauses and/or Data Privacy Framework where applicable
- **Contact:** https://support.google.com/cloud/
- **Privacy Policy:** https://policies.google.com/privacy
- **SLA:** https://cloud.google.com/products/gemini/sla

### 5. Google (Google Analytics 4, Google Tag Manager)
- **Purpose:** Website analytics and tag management
- **Data Shared:** Website usage data, event data, referral information
- **Data Categories:** Usage metrics, device information, referral data
- **Legal Basis:** Legitimate interest (with user consent for optional analytics)
- **Retention:** As per Google's data retention policies (typically 2-14 months for event data)
- **International Transfers:** Data may be transferred to the United States and other countries where Google operates
- **Safeguards:** IP anonymization, data minimization, encryption in transit, contractual protections
- **Contact:** https://support.google.com/
- **Privacy Policy:** https://policies.google.com/privacy

## Data Transfer Mechanisms
Where personal data is transferred outside the European Economic Area (EEA) or United Kingdom, we rely on:
- Standard Contractual Clauses (SCCs) with subprocessors
- Binding Corporate Rules where applicable
- EU-US Data Privacy Framework where the vendor is certified and the transfer is covered
- UK International Data Transfer Addendum / UK-approved transfer mechanisms where applicable
- Supplementary measures, data minimization, and regional configuration where appropriate
- Explicit user consent only where consent is the legally appropriate basis for the specific processing or transfer

## User Rights
Users may exercise their rights regarding data shared with service providers by:
- Contacting us at privacy@liaisonreply.com to request access, deletion, or correction
- Contacting the service provider directly for requests regarding their processing
- Using opt-out mechanisms provided in our cookie settings or account preferences

## Updates
This disclosure will be updated:
- Annually
- When we engage new service providers that process personal data
- When there are significant changes to how we use existing service providers
- When required by changes in data protection law

**Approved By:**
_____________________ (Data Protection Officer) Date: ___________
_____________________ (Legal Counsel) Date: ___________
_____________________ (Product Lead / Founder) Date: ___________

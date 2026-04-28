# Privacy Policy — Liaison Reply

**Last updated:** April 26, 2026  
**Effective date:** Upon publication  

This policy covers both **liaisonreply.com** and **app.liaisonreply.com**. It explains what data we collect, why we collect it, how it is used, and what choices you have.

For California residents, see the separate **Notice at Collection**:
`docs/compliance/ccpa-notice-at-collection.md`.

---

## 1. Scope and Contact

This policy applies to all users of the Liaison Reply website and application. Privacy questions, access requests, deletion requests, and complaints can be sent to [privacy@liaisonreply.com](mailto:privacy@liaisonreply.com).

**Operating model:** Liaison Reply drafts replies for your review. You decide what to edit, copy, or send.

**Key principle:** We use personal data only as needed to run, secure, support, and improve the service, subject to your rights and applicable law.

---

## 2. Legal Bases for Processing

Depending on the context, we process personal data on one or more of the following bases:

- **Your consent** — where you have explicitly agreed to processing
- **Contractual necessity** — to perform our obligations under the service agreement
- **Legal obligation** — to comply with applicable law
- **Legitimate interests** — in operating, securing, supporting, and improving Liaison Reply

Where processing is based on consent, you can withdraw that consent at any time by updating your settings or contacting support. Withdrawal does not affect earlier processing that was lawful when it occurred.

---

## 3. Data We Collect

### Automatically Collected
- IP address
- Browser/device details
- Content viewed and clicked links
- Telemetry needed for security, diagnostics, and analytics

### User-Submitted Data
- Email address
- Payment and subscription metadata
- Support communications
- Preferences and settings
- Messages and context you submit for reply drafting

We collect this information when you create an account, use the product, submit content, manage billing, update settings, or contact support.

---

## 4. How We Use Data

- Providing and operating the service
- Creating and managing accounts
- Processing subscriptions, payments, and billing support
- Generating draft replies and related outputs you request
- Securing the service, preventing fraud, enforcing fair-use/abuse guardrails, and diagnosing issues
- Analyzing product performance and improving the experience
- Communicating important service, support, and policy updates

This can include limited account, billing, device, and usage telemetry needed to detect unusual activity, apply paid-plan guardrails, and prevent accidental or malicious runaway spend.

---

## 5. Special Category Data (GDPR Article 9)

Liaison Reply may process message content that could reveal **special category personal data** under GDPR Article 9, including:

- Health or mental health information
- Political opinions
- Religious or philosophical beliefs
- Racial or ethnic origin
- Sexual orientation

**Legal basis:** We process such data only with your **explicit consent** (GDPR Article 9(2)(a)).

**How we obtain consent:** During account registration, you will be asked to explicitly consent to processing of message content that may contain special category data. You may revoke this consent at any time in Settings → Privacy & Data.

**Consequences of non-consent:** If you do not consent, you cannot use the AI generation features. You may still use basic features that do not require message processing.

**Retention:** Special category data processed through Gemini API is retained by Google for a maximum of **55 days** for abuse monitoring purposes, after which it is automatically deleted.

---

## 6. Data Retention

| Data Type | Retention Period | Legal Basis |
|-----------|-----------------|-------------|
| User account (email, auth) | Until account deletion | Contractual necessity |
| Chat history and messages | Until user deletes thread or account | Consent / Legitimate interest |
| AI-generated replies | 55 days (Gemini API abuse monitoring) | Legal obligation (abuse prevention) |
| Analytics data (PostHog) | 12 months | Legitimate interest |
| Billing records (Stripe) | 7 years (tax compliance) | Legal obligation |
| Support communications | 2 years | Legitimate interest |

**Deletion requests:** You may request deletion of your data at any time via Settings → Account → Delete Account, or by emailing [privacy@liaisonreply.com](mailto:privacy@liaisonreply.com). We will respond within 30 days.

---

## 7. International Data Transfers

Liaison Reply operates within the European Economic Area (EEA) but uses services that may process data outside the EEA.

| Service Provider | Location | Transfer Mechanism |
|-----------------|----------|-------------------|
| Supabase (hosting) | EU/US regions available | SCCs (Standard Contractual Clauses) |
| Google/Gemini (LLM) | US | EU-US Data Privacy Framework (DPF) |
| Stripe (billing) | US | EU-US DPF + SCCs |
| PostHog (analytics) | EU/US | DPA plus region-specific configuration; DPF not verified in repo evidence |

**EU-US Data Privacy Framework:** Google and Stripe have public DPF evidence.
PostHog should not be treated as DPF-certified until first-party evidence is
retained with the launch package.

**Supabase:** If your data is stored in a US region, Supabase relies on Standard Contractual Clauses (SCCs) approved by the European Commission to ensure adequate protection.

You may request information about the specific safeguards applicable to your data by contacting [privacy@liaisonreply.com](mailto:privacy@liaisonreply.com).

---

## 8. AI Processing (Google Gemini API)

Liaison Reply uses Google's Gemini API to generate reply suggestions.

**Data shared with Google:**
- Your message text and conversation history
- Context and intent you provide
- Generated reply options (stored for 55 days)

**Google's data retention:** Google retains API prompts and outputs for **55 days** for abuse monitoring and service improvement. After this period, data is automatically deleted. Google does not use your data to train or improve its AI models without separate consent.

**Legal basis:** Processing is based on your consent to use AI generation features. You may withdraw consent at any time, which will disable generation features but does not affect data already processed during your consent period.

**Your rights:** You may request Google to delete your data by contacting us, and we will forward your request to Google within 72 hours.

---

## 9. Service Providers

We share personal data only as reasonably necessary to:
- Host the service
- Authenticate users
- Process payments
- Provide requested outputs
- Deliver support communications
- Run analytics
- Prevent fraud
- Comply with the law
- Support a corporate transaction (financing, merger, sale)

**Our service providers include:**
- Cloud hosting and infrastructure providers (Supabase)
- Authentication, database, and backend service providers
- Payment processors and subscription providers (Stripe)
- Product analytics and diagnostics providers (PostHog)
- Email, communications, and support providers
- AI or language model service providers (Google Gemini)

Specific information about our service providers and the data shared with them is available in our [Service Provider Disclosure](./service-provider-disclosure.html).

---

## 10. Cookies and Storage

| Cookie/Storage Key | Purpose |
|--------------------|---------|
| `liaison_cookie_consent` | Stores your cookie preference |
| `lk_deeplink` | May store scenario or referral context if optional site memory is enabled |
| `liaison_auth_hint` | May store a lightweight session hint if optional site memory is enabled |

You can manage optional analytics and site memory from the [cookie settings page](./cookies.html#cookie-settings) or through supported browser controls.

---

## 11. Analytics

This site and app use analytics and diagnostics tools, including **Google Analytics 4** and **PostHog**, to understand page views, sessions, referral patterns, and device-level usage. Google handles analytics processing subject to [Google's Privacy Policy](https://policies.google.com/privacy).

---

## 12. Your Rights and Choices

Depending on your location, you may have rights to:
- **Access** your personal data
- **Correct** inaccurate data
- **Delete** your data
- **Restrict** or **object** to processing
- **Request portability** of your data
- Request information about how your data has been used or shared

To exercise your rights, contact [privacy@liaisonreply.com](mailto:privacy@liaisonreply.com).

You can also opt out of optional analytics, non-essential cookies, and supported marketing communications through available settings, unsubscribe tools, or by contacting support.

---

## 13. Children's Privacy

Liaison Reply is not intended for children under 16, and we do not knowingly collect personal data from them. If you believe a child under 16 has provided personal data, contact support so we can investigate and take appropriate action.

---

## 14. Data Breaches

In the event of a personal data breach that is likely to result in a risk to your rights and freedoms, we will:

- Notify the relevant supervisory authority within **72 hours** of becoming aware of the breach, where required by GDPR Article 33.
- Notify you without undue delay if the breach is likely to result in a high risk to your rights and freedoms, as required by GDPR Article 34.
- Provide details about the breach, the likely consequences, and the steps we are taking to address it.

To report a suspected breach, contact [privacy@liaisonreply.com](mailto:privacy@liaisonreply.com).

---

## 15. Automated Decision-Making

Liaison Reply does **not** make automated decisions about you that produce legal or similarly significant effects.

All reply suggestions are generated by AI for your review. You manually select, edit, copy, or send replies. The final decision on what to communicate is always yours.

We do not use profiling to make decisions about your access to services, credit, or legal rights.

---

## 16. Data Protection Officer / Privacy Contact

For privacy-related inquiries, including data subject requests, complaints, or questions about this policy:

- **Email:** privacy@liaisonreply.com
- **Subject:** Privacy / Data Protection Request
- **Response time:** Within 30 days

**For EU users:** You have the right to lodge a complaint with your local supervisory authority. We encourage you to contact us first so we can resolve your concern.

---

## 17. Policy Updates

We may update this Privacy Policy from time to time to reflect changes to the service, legal requirements, or data practices. When we do, we will post the updated version here and revise the effective date shown on this page.

---

## 18. Security

We use reasonable administrative, technical, and organizational safeguards, including:
- Encryption in transit
- Access controls
- Authentication measures
- Logging and monitoring
- Secure third-party infrastructure

No method of transmission or storage is completely secure.

---

*Privacy language aligned across liaisonreply.com and app.liaisonreply.com.*

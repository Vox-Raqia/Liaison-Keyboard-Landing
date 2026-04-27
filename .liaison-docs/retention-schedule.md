# Liaison Keyboard Data Retention Schedule

**Effective Date:** Not effective for production sign-off until legal/privacy review
**Last Updated:** 2026-04-26
**Version:** 1.1

## Overview
This document defines the retention periods for different categories of personal data processed by Liaison Keyboard in compliance with GDPR Article 5(1)(e) and similar provisions in other privacy regulations.

## Retention Periods

### 1. User Account Data
- **Account Information** (email, hashed password, subscription status): Retained until account deletion
- **Profile Information** (display name, preferences): Retained until account deletion or user modification
- **Authentication Tokens**: Session-based, expired after 30 days of inactivity

### 2. Conversation Data
- **Saved Message History** (received messages, user context, saved/generated replies where stored in thread history):
  - Retained until user deletion request or account deletion
  - Automatically deleted from active systems within 30 days after account deletion
  - Deleted from backup snapshots within 90 days through the backup cycle
- **Unsaved Generated Replies**:
  - Not intentionally persisted by Liaison after the response is returned to the user
  - Cleared from client/session memory by user action, session end, or normal app lifecycle
  - Emergency debug content capture is prohibited unless explicitly approved for incident response and then must be deleted within 24 hours

### 3. Generation Request Logs
- **Request Metadata** (timestamps, request IDs, outcome codes, model, token/cost estimates, latency, no raw message content):
  - Retained for 30 days for debugging and service improvement
  - After 30 days: deleted or fully anonymized (removing all personal identifiers)
- **AI Model Inputs/Outputs in Liaison Systems**:
  - Not intentionally retained after request completion unless the user saves content into thread history
  - If an incident-specific debug capture is approved, retained for 24 hours maximum and access-restricted
- **Google Gemini API Provider Retention**:
  - Current integration uses the Gemini API, not Vertex AI
  - Google Gemini API documentation states prompts, contextual information, and outputs are retained for 55 days for abuse monitoring
  - Gemini API logs, if enabled, expire after 55 days by default
  - Voluntary log/dataset sharing with Google is not approved without a separate DPIA update and consent analysis

### 4. Payment and Billing Data
- **Transaction Records**: Retained for 7 years for tax and legal compliance
- **Payment Method Details**: Not stored by Liaison (handled by Stripe)
- **Subscription Information**: Retained until subscription end + 30 days for grace period

### 5. Analytics and Usage Data
- **Aggregated Usage Statistics**: Retained indefinitely only after personal data is removed or irreversibly anonymized
- **Event Logs** (feature usage, error tracking, no raw message content):
  - Retained for 90 days for product improvement
  - After 90 days: deleted or anonymized
- **Performance Monitoring Data**: Retained for 30 days

### 6. Communications and Support
- **Support Tickets**: Retained for 2 years after resolution
- **User Feedback** (voluntary): Retained until user requests deletion
- **Marketing Communications**: Retained until user unsubscribes

### 7. Legal and Compliance Records
- **Data Processing Agreements**: Retained for duration of contract + 5 years
- **Privacy Impact Assessments**: Retained for 5 years
- **Data Breach Records**: Retained for 5 years after incident resolution

## Deletion Procedures

### User-Initiated Deletion
1. User requests data deletion via in-app settings or privacy@liaisonreply.com
2. Identity verification performed (email confirmation)
3. All personal data marked for deletion within 24 hours where technically supported
4. Permanent deletion from active systems within 30 days
5. Backup deletion completed within 90 days (standard backup cycle)

### Automated Deletion
- Ephemeral Liaison data (generation inputs/outputs): Deleted per schedule above
- Provider-retained AI inference data: Governed by the applicable provider terms and documented in the DPIA/vendor register
- Inactive accounts: Flagged after 2 years of inactivity, deletion offered
- Expired backups: Automatically purged according to backup retention policy

## Legal Holds
In the event of litigation or regulatory investigation, relevant data retention may be suspended upon legal counsel direction.

## Review Process
This retention schedule shall be reviewed annually or whenever:
- New data processing activities are introduced
- Significant changes to existing processing occur
- Regulatory changes affect retention requirements
- Data breaches or security incidents reveal gaps

**Approved By:**
_____________________ (Legal Counsel) Date: ___________
_____________________ (Product Lead / Founder) Date: ___________
_____________________ (Data Protection Officer or privacy advisor, if required) Date: ___________

# Liaison Keyboard Data Retention Schedule

**Effective Date:** TBD (upon legal review)
**Last Updated:** 2026-04-23
**Version:** 1.0

## Overview
This document defines the retention periods for different categories of personal data processed by Liaison Keyboard in compliance with GDPR Article 5(1)(e) and similar provisions in other privacy regulations.

## Retention Periods

### 1. User Account Data
- **Account Information** (email, hashed password, subscription status): Retained until account deletion
- **Profile Information** (display name, preferences): Retained until account deletion or user modification
- **Authentication Tokens**: Session-based, expired after 30 days of inactivity

### 2. Conversation Data
- **Message History** (received messages, user context, generated replies): 
  - Retained indefinitely until user deletion request (free tier)
  - Retained indefinitely until user deletion request (Pro tier with "Full Memory")
  - Automatically deleted 30 days after account deletion
- **Generated Replies** (not saved by user): 
  - Ephemeral - deleted immediately after generation if not saved
  - Maximum retention: 24 hours for debugging purposes (anonymized)

### 3. Generation Request Logs
- **Request Metadata** (timestamps, request IDs, outcome codes):
  - Retained for 30 days for debugging and service improvement
  - After 30 days: deleted or fully anonymized (removing all personal identifiers)
- **AI Model Inputs/Outputs** (for debugging):
  - Retained for 24 hours maximum
  - Automatically deleted after 24 hours

### 4. Payment and Billing Data
- **Transaction Records**: Retained for 7 years for tax and legal compliance
- **Payment Method Details**: Not stored by Liaison (handled by Stripe)
- **Subscription Information**: Retained until subscription end + 30 days for grace period

### 5. Analytics and Usage Data
- **Aggregated Usage Statistics**: Retained indefinitely (no personal data)
- **Event Logs** (feature usage, error tracking):
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
3. All personal data marked for deletion within 24 hours
4. Permanent deletion from active systems within 30 days
5. Backup deletion completed within 90 days (standard backup cycle)

### Automated Deletion
- Ephemeral data (generation inputs/outputs): Deleted per schedule above
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
_____________________ (Product Lead) Date: ___________
_____________________ (Data Protection Officer) Date: ___________
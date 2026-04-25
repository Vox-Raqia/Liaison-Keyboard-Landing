# Liaison Keyboard Records of Processing Activities (Article 30 GDPR)

**Effective Date:** TBD (upon legal review)
**Last Updated:** 2026-04-23
**Version:** 1.0
**Controller:** Liaison Keyboard
**Contact:** privacy@liaisonreply.com

## Introduction
This document maintains records of processing activities as required by Article 30 of the General Data Protection Regulation (GDPR). It outlines the categories of processing activities undertaken by Liaison Keyboard.

## Processing Activity 1: User Account Management

### Purpose
- Account creation, authentication, and management
- Subscription and billing management
- User profile maintenance

### Data Categories
- Identifiers: email address, user ID, hashed password
- Account status: subscription tier, payment status, account status
- Profile information: display name, preferences, settings
- Authentication data: tokens, session identifiers
- Payment metadata: transaction IDs, subscription IDs (no payment card data stored)

### Data Subjects
- Registered users of Liaison Keyboard (both free and Pro tiers)

### Legal Basis
- Performance of contract (Terms of Service)
- Legitimate interest (account security and service improvement)
- Consent (for marketing communications, where applicable)

### Retention Period
- Account data: retained until account deletion
- Payment transaction records: retained for 7 years for tax compliance
- Authentication tokens: session-based, expired after 30 days of inactivity

### Recipients
- Internal: product, engineering, support teams
- External: Stripe (payment processing), Supabase (auth/database), email service providers

### Transfers to Third Countries
- Data may be transferred to the United States and other countries where subprocessors operate
- Appropriate safeguards: Standard Contractual Clauses, Privacy Shield (where applicable), or equivalent protections

### Security Measures
- Encryption in transit (TLS) and at rest (AES-256)
- Access controls and authentication
- Regular security testing and monitoring
- Employee access limited to need-to-know basis

## Processing Activity 2: Conversation and Reply Generation

### Purpose
- Generating AI-powered reply suggestions for difficult messages
- Maintaining conversation history for contextual awareness
- Providing users with socially calibrated tactical responses

### Data Categories
- Conversation content: received messages, user-provided context
- Generated content: AI reply suggestions
- Metadata: timestamps, conversation IDs, user IDs (pseudonymous for AI processing)
- User intent indicators: selected response type (Natural, Keep it going, Short)

### Data Subjects
- Users utilizing the reply generation feature

### Legal Basis
- Performance of contract (providing the core service)
- Legitimate interest (service improvement, aggregated anonymized data)
- Consent (for saving replies to conversation history)

### Retention Period
- Conversation data: retained indefinitely until user deletion request
- Generated replies (not saved): ephemeral - deleted immediately if not saved, max 24 hours for debugging (anonymized)
- Generation request metadata: retained 30 days for debugging, then deleted/anonymized

### Recipients
- Internal: product, engineering, analytics teams
- External: Google Gemini (AI model processing), Supabase (storage), PostHog (anonymized analytics)

### Transfers to Third Countries
- Data may be transferred to the United States for AI processing
- Appropriate safeguards: Data Processing Agreements with subprocessors, encryption in transit

### Security Measures
- Pseudonymization of user data before AI processing
- Encryption in transit and at rest
- Strict access controls to conversation data
- Regular security assessments of AI integration

## Processing Activity 3: Analytics and Service Improvement

### Purpose
- Understanding product usage and performance
- Improving user experience and service quality
- Diagnosing and resolving technical issues
- A/B testing and feature flagging

### Data Categories
- Usage metrics: feature usage, click paths, session duration
- Performance data: load times, error rates, API response times
- Diagnostic data: crash logs, error reports (anonymized)
- Feedback data: voluntary user feedback, survey responses
- Aggregated statistics: user counts, retention metrics, conversion rates

### Data Subjects
- Users of Liaison Keyboard (site and app)

### Legal Basis
- Legitimate interest (service improvement, security, fraud prevention)
- Consent (for optional analytics and cookies, where applicable)

### Retention Period
- Raw event logs: retained 90 days for product improvement, then deleted or anonymized
- Aggregated usage statistics: retained indefinitely (no personal data)
- Performance monitoring data: retained 30 days
- Diagnostic data: retained 30 days for issue resolution

### Recipients
- Internal: product, engineering, data science teams
- External: PostHog (analytics), Google Analytics 4 (site analytics), error monitoring services

### Transfers to Third Countries
- Data may be transferred to the United States and other countries where analytics providers operate
- Appropriate safeguards: Data Processing Agreements, IP anonymization where applicable, contractual protections

### Security Measures
- Data minimization: collecting only necessary data for stated purposes
- Pseudonymization and anonymization where possible
- Encryption in transit
- Access controls and monitoring
- Vendor security assessments

## Processing Activity 4: Customer Support and Communications

### Purpose
- Providing user support and assistance
- Handling user inquiries, complaints, and requests
- Sending service-related and marketing communications

### Data Categories
- Support tickets: inquiry details, correspondence history
- Communication data: email addresses, message content
- Feedback data: user suggestions, bug reports
- Preference data: communication opt-in/out status

### Data Subjects
- Users contacting support or opting into communications

### Legal Basis
- Performance of contract (providing support)
- Legitimate interest (service improvement, security)
- Consent (for marketing communications)

### Retention Period
- Support tickets: retained 2 years after resolution
- User feedback: retained until user requests deletion
- Marketing communications: retained until user unsubscribes
- Communication logs: retained 1 year for quality and training purposes

### Recipients
- Internal: support, product, engineering teams
- External: email service providers, ticketing systems

### Transfers to Third Countries
- Data may be transferred to the United States and other countries where support providers operate
- Appropriate safeguards: Data Processing Agreements, encryption in transit and at rest

### Security Measures
- Access controls to support systems
- Encryption for sensitive support data
- Regular security training for support staff
- Monitoring and logging of support system access

## Processing Activity 5: Legal and Compliance

### Purpose
- Meeting legal and regulatory obligations
- Handling legal requests and disputes
- Maintaining corporate records
- Insurance and risk management

### Data Categories
- Legal documents: contracts, agreements, policies
- Compliance records: DPIAs, breach records, training records
- Dispute resolution data: legal requests, settlement information
- Corporate records: meeting minutes, resolutions, filings

### Data Subjects
- Users, employees, contractors, business partners

### Legal Basis
- Legal obligation (compliance with laws and regulations)
- Legitimate interest (corporate governance, risk management)
- Contractual necessity (agreements with users and vendors)

### Retention Period
- Contracts and agreements: duration of contract + 5 years
- Compliance records (DPIAs, breach records): 5 years
- Tax and financial records: 7 years
- Corporate records: permanence or as required by law
- Legal hold data: as directed by legal counsel

### Recipients
- Internal: legal, finance, executive teams
- External: legal counsel, auditors, regulatory authorities (as required)

### Transfers to Third Countries
- May be necessary for international legal proceedings or corporate structure
- Appropriate safeguards: legal agreements, confidentiality protections, data minimization

### Security Measures
- Access controls based on role and need-to-know
- Encryption for sensitive legal documents
- Secure storage and backup procedures
- Monitoring and auditing of access

## Review and Updates
This record of processing activities shall be reviewed and updated:
- Annually
- When new processing activities are introduced
- When significant changes to existing processing occur
- When regulatory changes affect processing requirements
- Following data breaches or security incidents that reveal gaps

**Approved By:**
_____________________ (Data Protection Officer) Date: ___________
_____________________ (Legal Counsel) Date: ___________
_____________________ (Product Lead) Date: ___________
_____________________ (CEO/Founder) Date: ___________
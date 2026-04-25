# Liaison Keyboard Data Breach Notification Process

**Effective Date:** TBD (upon legal review)
**Last Updated:** 2026-04-23
**Version:** 1.0

## Purpose
This document outlines the procedure for detecting, responding to, and notifying relevant parties of a personal data breach in compliance with GDPR Articles 33-34 and similar breach notification requirements in other jurisdictions (including CCPA where applicable).

## Scope
This process applies to all personal data processed by Liaison Keyboard, including:
- User account information
- Conversation data and message history
- Generated AI replies
- Payment and billing information (though actual payment data is handled by Stripe)
- Analytics and usage data
- Any other personal data collected or processed

## Definitions
**Personal Data Breach:** A breach of security leading to the accidental or unlawful destruction, loss, alteration, unauthorized disclosure of, or access to, personal data transmitted, stored or otherwise processed.

**Controller:** Liaison Keyboard (determines the purposes and means of processing personal data)

**Processor:** Third-party service providers processing data on our behalf (Stripe, Supabase, PostHog, Google Gemini, etc.)

**Supervisory Authority:** The relevant data protection authority (e.g., Irish DPC for GDPR, California Attorney General for CCPA)

## Breach Detection and Initial Response

### 1. Detection
Breaches may be detected through:
- Security monitoring tools and alerts
- User reports
- Auditor findings
- Vendor notifications
- Routine security assessments

### 2. Initial Containment (Within 1 Hour of Detection)
- Isolate affected systems to prevent further data loss
- Preserve evidence for investigation
- Notify the Incident Response Team
- Begin preliminary assessment of scope and impact

### 3. Incident Response Team Notification
Upon suspicion of a breach, notify:
- Data Protection Officer (DPO)
- Product Lead/Engineering Lead
- Legal Counsel
- CEO/Founder
- Relevant vendor contacts (if third-party involved)

## Breach Assessment (Within 4 Hours of Detection)

### 1. Initial Assessment
The Incident Response Team will determine:
- Whether a breach has occurred
- Types of personal data affected
- Approximate number of data subjects affected
- Likely consequences of the breach
- Immediate mitigation steps taken

### 2. Evidence Collection
- Preserve logs, system images, and other relevant data
- Document all actions taken
- Maintain chain of custody for evidence

## Notification Decision Process

### GDPR Notification Requirements
Notification to Supervisory Authority is required unless:
- The breach is unlikely to result in a risk to the rights and freedoms of natural persons

Notification to Data Subjects is required when:
- The breach is likely to result in a high risk to the rights and freedoms of natural persons

### CCPA Notification Requirements
Notification to California residents is required when:
- Breach of unencrypted personal information
- Notification to Attorney General if >500 California residents affected

## Notification Procedures

### 1. Supervisory Authority Notification (GDPR) - Within 72 Hours
If required, notify the relevant Supervisory Authority containing:
- Description of the breach (nature, categories, approximate numbers)
- Name and contact details of DPO or contact point
- Description of likely consequences
- Description of measures taken or proposed to address the breach
- Description of measures taken to mitigate possible adverse effects

### 2. Data Subject Notification - Without Undue Delay
If required, notify affected data subjects containing:
- Description of the breach in clear, plain language
- Name and contact details of DPO or contact point
- Description of likely consequences
- Description of measures taken or proposed to address the breach
- Description of measures taken to mitigate possible adverse effects
- Advice on steps individuals can take to protect themselves

### 3. Vendor/Processor Notification
Notify any data processors involved in the breach without undue delay.

### 4. Regulatory Notification (Other Jurisdictions)
Notify relevant authorities in other jurisdictions as required by local laws (e.g., CCPA to California Attorney General).

## Documentation
All steps in the breach response process must be documented, including:
- Dates and times of key events
- Actions taken
- Decisions made and rationale
- Communications sent and received
- Evidence collected

## Post-Breach Actions

### 1. Investigation and Root Cause Analysis
- Conduct thorough investigation to determine cause
- Identify systemic issues or vulnerabilities
- Document findings

### 2. Remediation
- Implement technical and organizational measures to prevent recurrence
- Update policies and procedures as needed
- Provide additional training if human error was a factor

### 3. Review and Improvement
- Review the effectiveness of the breach response
- Update this process based on lessons learned
- Conduct tabletop exercises to test improved procedures

## Communication Templates

### Supervisory Authority Notification Template
[Template to be developed with legal counsel]

### Data Subject Notification Template
[Template to be developed with legal counsel]

### Vendor Notification Template
[Template to be developed with legal counsel]

## Training and Testing
- Annual training for all employees on breach identification and reporting
- Bi-annual tabletop exercises simulating breach scenarios
- Annual review and update of this process

## Approval
_____________________ (Data Protection Officer) Date: ___________
_____________________ (Legal Counsel) Date: ___________
_____________________ (Product Lead) Date: ___________
_____________________ (CEO/Founder) Date: ___________
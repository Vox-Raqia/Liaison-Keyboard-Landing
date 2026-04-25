# GDPR DPIA Scope Document for AI Reply Generation

**Status:** Commissioned (pending legal counsel review)

**Scope:** This DPIA covers the processing of personal data in the AI reply generation feature of Liaison Keyboard.

**Data Processing Activities Covered:**
- Collection of user-provided message history and context for generating AI replies
- Temporary storage of inputs and outputs for the purpose of generating replies
- Transmission of data to AI model provider (Gemini 2.5 Flash) for processing
- Storage of generated replies in user's conversation history (if user chooses to save via Edit & Copy)
- Logging of generation requests for debugging and improvement (anonymized)

**Data Categories:**
- Message content (text) from user's conversations
- User-provided context (text)
- Generated AI replies (text)
- Metadata: timestamps, user identifiers (pseudonymous), conversation identifiers

**Processing Purposes:**
- To provide users with socially calibrated tactical responses to difficult messages
- To improve the AI model's performance (aggregated, anonymized data)
- To maintain conversation history for contextual replies (user-controlled)

**Data Subjects:**
- Users of Liaison Keyboard (both free and Pro tiers)

**Geographic Scope:**
- Processing occurs in multiple jurisdictions (US-based suppliers, global users)
- Data transfers outside the EU may occur when using global AI providers

**Legal Basis:**
- Consent (for non-essential processing)
- Legitimate interest (for essential service provision, balanced with user rights)

**Retention Period:**
- Inputs and outputs retained only for the duration of the generation request (ephemeral) unless user saves the reply
- Saved replies retained until user deletion request or account deletion
- Logs retained for 30 days for debugging, then deleted or anonymized

**Risk Assessment:**
To be completed by legal counsel.

**Mitigation Measures:**
- Data minimization: only necessary data is sent to the AI model
- Pseudonymization: user identifiers are not included in AI requests
- Encryption: data in transit and at rest is encrypted
- User controls: users can delete conversations and replies
- Transparency: clear notice about data processing in privacy policy

**Sign-off:**
_____________________ (Legal Counsel) Date: ___________
_____________________ (Product Lead) Date: ___________
# AI Reply Retention Clarification

## Local Storage (Liaison Reply)
- Table: `chat_threads` (specifically the `message_array` JSONB column)
- Retention: Indefinite (retained until the user deletes the entire thread)
- Deletion mechanism: User-initiated thread deletion (no individual reply deletion available)
- Can user delete individual replies? No
- Storage trigger: Only when user actively chooses "Copy" or "Edit & Copy" - generated replies are NOT automatically stored

## Google/Gemini Processing
- Data retained by Google: 55 days (for abuse monitoring and service improvement)
- What data: Prompts (user message + context), generated outputs (the three reply options), and associated metadata
- After 55 days: Automatically deleted by Google's systems

## Combined Flow
1. User submits message → Send to Gemini for processing → Receive three reply options
2. Local copy: Generated replies are NOT stored by default. Only the reply that the user chooses to copy or edit & copy is stored in the thread's `message_array` as an assistant message
3. Local retention: Indefinite (until thread deletion by user) - but only for explicitly copied replies
4. Google retention: All processing data (prompts and generated outputs) retained for 55 days
5. User deletion request: Deleting a thread removes any locally stored copied replies; Google-processed data is deleted per Google's standard data deletion process (typically within 72 hours of request)

## Recommendation for Privacy Policy Update
Update Section 6 Data Retention table to:

| AI-generated replies (stored by Liaison) | Retained until thread deletion (indefinite) | User-controlled via thread deletion (only applies to explicitly copied replies) |
| AI-generated replies (processed by Google) | 55 days | Legal obligation (abuse monitoring) |
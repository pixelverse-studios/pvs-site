# Audit Log - App - 2025-10-10 14:18:41

## Prompt Summary

Enable lead notification emails to go to multiple recipients and explain how to configure them.

## Actions Taken

1. Parsed `LEAD_NOTIFY_TO` into a trimmed recipient array with a fallback default.
2. Updated the Resend helper to pass the array so multiple inboxes receive notifications.
3. Responded with guidance on setting the environment variable for multiple addresses.

## Files Changed

- `lib/email/resend.ts` - Accepts comma-separated recipients and forwards them to Resend.

## Components/Features Affected

- Lead notification email delivery

## Testing Considerations

- Verify multiple comma-separated addresses receive a single lead notification.
- Confirm behavior when `LEAD_NOTIFY_TO` is unset (falls back to default).

## Performance Impact

- None

## Next Steps

- Populate `.env.local` with desired recipients (e.g., `info@...,phil@...,sami@...`).

## Notes

- Ensure each recipient domain/mailbox is allowed by your Resend plan and policies.

## Timestamp

Created: 2025-10-10 14:18:41
Page Section: contact

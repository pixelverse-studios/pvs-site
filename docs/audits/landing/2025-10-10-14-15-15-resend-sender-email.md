# Audit Log - App - 2025-10-10 14:15:17

## Prompt Summary

Clarified whether the team can use `info@pixelversestudios.io` as the Resend notification sender address.

## Actions Taken

1. Explained the requirement to verify the pixelversestudios.io domain (or specific mailbox) within Resend before using it as the `LEAD_NOTIFY_FROM` sender.
2. Confirmed that once verified, setting `LEAD_NOTIFY_FROM=info@pixelversestudios.io` will send notifications from that address.

## Files Changed

- None

## Components/Features Affected

- Email notification configuration

## Testing Considerations

- After verification, send a test lead to confirm deliverability from the chosen sender.

## Performance Impact

- None

## Next Steps

- Verify the `pixelversestudios.io` domain in Resend and update `.env.local` values accordingly.

## Notes

- Resend blocks unverified domains from sending to prevent spoofing; use default sender until verification succeeds.

## Timestamp

Created: 2025-10-10 14:15:17
Page Section: contact

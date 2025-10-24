# Audit Log - App - 2025-10-24 10:18:08

## Prompt Summary

User requested that the Contact form error handling use the backend-provided `supportEmail` and `subjectLine` when rendering the support mailto link.

## Actions Taken

1. Parsed `supportEmail` and `subjectLine` from lead submission error responses and attached them to the error instance.
2. Updated error toast rendering to generate a mailto link with the provided email and subject line, falling back to regex detection when needed.

## Files Changed

- `components/contact/ContactForm.tsx` - Enriched error parsing, expanded toast message formatting, and wired support metadata into the mailto link.

## Components/Features Affected

- Contact form duplicate-lead error messaging

## Testing Considerations

- Trigger a duplicate lead response and confirm the toast links to `mailto:supportEmail?subject=subjectLine`.
- Ensure generic errors still render correctly without links.

## Performance Impact

- Minimal; adds lightweight string parsing and regex evaluation during error handling only.

## Next Steps

- Consider localizing subject lines if multi-language support is required later.

## Notes

- Helper falls back to generic email matching if the backend omits `supportEmail`.

## Timestamp

Created: 2025-10-24 10:18:08
Page Section: contact

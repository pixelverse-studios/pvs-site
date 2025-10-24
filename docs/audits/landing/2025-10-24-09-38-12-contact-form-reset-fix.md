# Audit Log - App - 2025-10-24 09:38:12

## Prompt Summary

User reported that the Contact form still retained budget and timeline values after successful submission; requested a full form reset.

## Actions Taken

1. Replaced the static default values object with a factory helper to ensure `reset` receives a fresh object each time.
2. Updated honeypot and success branches to call the factory so controlled selects clear correctly.

## Files Changed

- `components/contact/ContactForm.tsx` - Introduced `createDefaultFormValues()` helper and used it for initial defaults and resets.

## Components/Features Affected

- Contact form reset behaviour (budget, timeline selects, and other fields)

## Testing Considerations

- Submit the form and confirm all inputs return to placeholders.
- Verify honeypot-triggered submissions also clear the form.

## Performance Impact

- Negligible.

## Next Steps

- Consider unit/e2e coverage to guard against regressions in form reset behaviour.

## Notes

- React Hook Form compares object references when resetting; supplying a new object ensures controlled components receive updated values.

## Timestamp

Created: 2025-10-24 09:38:12
Page Section: contact

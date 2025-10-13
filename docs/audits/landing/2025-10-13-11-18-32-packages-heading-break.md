# Audit Log - App - 2025-10-13 11:18:32

## Prompt Summary
Adjusted the homepage package cards so each title wraps to two lines instead of using a hyphen separator.

## Actions Taken
1. Updated the card heading to replace the hyphen-with-spaces separator with an explicit line break.

## Files Changed
- `components/home/packages-section.tsx` - Applied the title replacement and set a taller line height for readability.

## Components/Features Affected
- Homepage packages snapshot cards

## Testing Considerations
- Confirm the card titles wrap cleanly on mobile/tablet widths and that text alignment still feels balanced.

## Performance Impact
- None; string replacement only.

## Next Steps
- Evaluate whether titles should be reformatted similarly on the dedicated packages page for consistency.

## Notes
- Newline relies on JavaScript string replacement of ` " – " ` with `\n`.

## Timestamp
Created: 2025-10-13 11:18:32
Page Section: homepage-packages

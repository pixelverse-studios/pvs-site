# Audit Log - App - 2025-11-07 13:33:07

## Prompt Summary

User reported the local contact links still appeared too dark in dark mode.

## Actions Taken

1. Increased the dark-mode text color for local contact links to `text-white/80` and their grid container to `text-white/90` for higher contrast.
2. Kept hover states consistent with the brighter palette.

## Files Changed

- `components/ui/footer.tsx` – Adjusted dark-mode text classes inside the local contact block.

## Components/Features Affected

- Footer local contact card.

## Testing Considerations

- Verify the contact links remain legible in both themes.

## Performance Impact

- None.

## Timestamp

Created: 2025-11-07 13:33:07
Page Section: global

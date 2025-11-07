# Audit Log - App - 2025-11-07 13:29:14

## Prompt Summary

User noted the “Local contact” text block in the footer was hard to read in dark mode and requested better contrast.

## Actions Taken

1. Added dark-mode specific classes to the local contact card so the background, border, and typography shift to higher-contrast values.
2. Updated the link hover states/arrow color to ensure legibility across themes.

## Files Changed

- `components/ui/footer.tsx` – Applied `dark:` overrides for background, border, text, and hover colors in the local contact block.

## Components/Features Affected

- Footer local contact links card on every page.

## Testing Considerations

- Toggle light/dark theme on any page and ensure the card copy and arrow icons remain readable.

## Performance Impact

- None.

## Next Steps

- None.

## Timestamp

Created: 2025-11-07 13:29:14
Page Section: global

# Audit Log - App - 2025-10-14 09:40:47

## Prompt Summary

User asked to restore the dark-mode logo (`logo-light.png`) in the navbar so the brand mark shifts appropriately with theme.

## Actions Taken

1. Reintroduced a light-on-dark logo asset (`public/logo-light.png`) sized 64×64 for navbar use.
2. Updated `components/ui/navbar.tsx` to swap logo sources based on the resolved theme while handling hydration via a mounted check.

## Files Changed

- `components/ui/navbar.tsx` - Added theme detection and conditional `Image` source.
- `public/logo-light.png` - New asset for dark-mode branding.

## Components/Features Affected

- Primary navbar logo rendering
- Dark-mode branding consistency

## Testing Considerations

- Toggle themes to confirm the logo switches between `/logo.svg` and `/logo-light.png`.
- Ensure the image swap does not cause layout shift or hydration warnings.
- Validate on mobile + desktop breakpoints.

## Performance Impact

- Negligible; small static asset added.
- No additional runtime dependencies.
- SEO unaffected.

## Next Steps

1. Audit other locations where the logo appears to ensure theme-specific assets remain consistent.

## Notes

- The PNG asset approximates the existing gradient avatar for parity with the SVG mark.

## Timestamp

Created: 2025-10-14 09:40:47
Page Section: navbar

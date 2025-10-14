# Audit Log - App - 2025-10-14 09:14:11

## Prompt Summary

User reported that the homepage hero stayed in a light-mode treatment after the dark-theme refresh, while other pages (e.g., About) looked correct.

## Actions Taken

1. Investigated the hero overlays to confirm arbitrary color classes were dropping in dark mode.
2. Introduced theme-aware overlay tokens in `app/globals.css` to support glass/tint treatments.
3. Refactored the hero section to rely on the new tokens so both themes render correctly, and documented the tokens in the style guide.

## Files Changed

- `app/globals.css` - Added overlay token definitions for light/dark usage.
- `components/home/hero-section.tsx` - Swapped hard-coded light colors for token-driven overlays.
- `app/styleguide/page.tsx` - Listed the new overlay tokens in the design system reference.

## Components/Features Affected

- Homepage hero surface + glass overlays
- Global overlay token library
- Styleguide color documentation

## Testing Considerations

- Manual dark-mode/lite-mode toggle to ensure hero glass layers blend correctly.
- Cross-browser visual check (Chrome, Safari) for custom property opacity support.
- Verify hero readability on mobile widths where blur spreads differently.

## Performance Impact

- Negligible; only CSS variable additions and class adjustments.
- No change to bundle size or runtime logic.
- Improved dark-mode contrast supports accessibility metrics.

## Next Steps

1. Audit other sections using `bg-[var(--pv-surface)]/XX` patterns and migrate to the overlay tokens if needed.
2. Capture updated dark-mode hero screenshots for the design team.

## Notes

- Overlay tokens keep future glass components theme-aware without relying on invalid `<color>/opacity` utilities.

## Timestamp

Created: 2025-10-14 09:14:11
Page Section: hero

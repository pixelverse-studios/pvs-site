# Audit Log - App - 2025-10-14 09:08:36

## Prompt Summary

User requested a dark-mode refresh—retain primary brand colors but elevate secondary surfaces so the experience feels as polished as light mode.

## Actions Taken

1. Audited existing dark-theme tokens and component overrides to pinpoint muted or low-depth areas.
2. Updated the core dark-mode CSS variables with richer indigo tones, brighter text/muted values, and a cinematic shadow treatment.
3. Harmonized hero, navbar, and theme-toggle layers with the refreshed palette and synced the styleguide token reference.

## Files Changed

- `app/globals.css` - Rebalanced dark-mode background, surface, text, muted, border, and shadow tokens.
- `app/styleguide/page.tsx` - Updated token documentation to mirror the new palette values.
- `components/home/hero-section.tsx` - Realigned hero overlays and gradients with the updated indigo scheme.
- `components/ui/navbar.tsx` - Shifted dark-mode shell/background/shadow treatments to the refreshed tokens.
- `components/ui/theme-toggle.tsx` - Adjusted toggle background to share the new elevated-surface tone.

## Components/Features Affected

- Global color tokens
- Homepage hero framing
- Navbar container
- Theme toggle control
- Styleguide foundations section

## Testing Considerations

- Manual dark-mode sweep across hero, nav, cards, and dialogs for contrast/WCAG AA compliance.
- Check focus/hover interactions in dark mode to confirm border and text clarity.
- Validate on mobile devices to ensure opacity layers stack cleanly.

## Performance Impact

- No bundle-size change; only CSS variable tweaks.
- Negligible runtime impact—shadows leverage existing GPU-friendly values.
- SEO unaffected.

## Next Steps

1. Capture updated dark-mode screenshots for design approval and marketing collateral.
2. Migrate any remaining hard-coded dark overlays to the shared token system.

## Notes

- Keep future components tied to `--pv-*` tokens to maintain palette cohesion.

## Timestamp

Created: 2025-10-14 09:08:36
Page Section: global-theme

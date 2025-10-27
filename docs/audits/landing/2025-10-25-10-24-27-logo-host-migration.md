# Audit Log - App - 2025-10-25 10:24:27

## Prompt Summary

User asked to replace locally hosted logo assets with Cloudinary-hosted URLs for light and dark themes.

## Actions Taken

1. Updated metadata helpers and structured data to reference the new hosted logo URLs.
2. Pointed the navbar theme switcher to the Cloudinary assets and enabled remote image loading in Next config.
3. Logged the branding update in the Bergen SEO planning tracker for downstream awareness.

## Files Changed

- `lib/metadata.ts` - Centralized light/dark logo URLs and reused the light variant for default OG imagery.
- `lib/structured-data.ts` - Switched LocalBusiness schema logo reference to the hosted light logo.
- `app/layout.tsx` - Aligned favicon/shortcut references with the Cloudinary asset.
- `components/ui/navbar.tsx` - Pulled light/dark logo URLs from shared metadata and rendered the hosted assets.
- `next.config.js` - Allowed `res.cloudinary.com` remote images so the navbar logo loads in Next/Image.
- `docs/planning/bergen-seo-todo.md` - Logged the logo hosting migration in the progress history.

## Components/Features Affected

- Global metadata and favicon references
- Navbar branding in both themes

## Testing Considerations

- Toggle dark/light mode in the navbar to confirm the appropriate logo variant loads from Cloudinary.
- Inspect HTML head to ensure icon links point to the hosted asset.
- Verify structured data via Google’s Rich Results Test to confirm the logo URL resolves.

## Performance Impact

- Negligible; leverages CDN-hosted assets and keeps bundle size unchanged.
- Remote logos benefit from Cloudinary caching/CDN distribution.

## Next Steps

- Remove unused local logo files if no longer required for fallbacks.
- Notify marketing/design teams that Cloudinary now serves the canonical brand marks.

## Notes

- Remote pattern in Next config must be updated if Cloudinary folder paths change.

## Timestamp

Created: 2025-10-25 10:24:27
Page Section: branding

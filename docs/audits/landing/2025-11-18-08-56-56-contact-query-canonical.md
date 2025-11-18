# Audit Log - App - 2025-11-18 08:56:56

## Prompt Summary

User flagged another round of Search Console “Alternate page with proper canonical tag” failures tied to `/contact?context=` and `/contact/<city>?context=<city>` URLs and requested code-level fixes.

## Actions Taken

1. Added a Next.js redirect rule that strips the `context` query from any `/contact/:slug` request so server responses no longer serve duplicate content.
2. Added a Netlify `_redirects` entry with the same catch-all behavior to ensure edge redirects fire even when the Next.js layer is bypassed or cached.
3. Documented the fix and outlined verification steps (purge cache, rerun `curl -I -L` checks, then re-validate in GSC).

## Files Changed

- `next.config.js` - Appended a `/contact/:slug` redirect that drops `context` queries before responding.
- `public/_redirects` - Added a wildcard `/contact/:slug?context=:context` rule to enforce the same behavior at the Netlify edge.

## Components/Features Affected

- Netlify + Next.js routing for localized contact pages
- SEO canonical handling for `/contact/[city]` routes

## Testing Considerations

- Deploy, purge Netlify cache, and run `curl -I -L "https://pixelversestudios.io/contact?context=fort-lee"` to confirm the first hop is a 301 to `/contact/fort-lee` followed by a 200.
- Repeat for `/contact/<city>?context=<city>` and any other marketing-driven variants if needed.
- Once verified, re-run “Validate Fix” for the Alternate Page report in GSC.

## Performance Impact

- None. Redirects resolve before page render and keep crawl budget focused on canonical URLs.

## Next Steps

- Consider adding the newer contact context slugs (Teaneck, Fair Lawn, etc.) to the `/contact?context=` 301 list if legacy campaigns ever used those query URLs.
- Monitor the Search Console report for a few weeks to confirm drop-off.

## Notes

- `/services/paramus` already ships the correct canonical via `createPageMetadata`; request a recrawl if GSC still lists it after this deploy.

## Timestamp

Created: 2025-11-18 08:56:56
Page Section: contact

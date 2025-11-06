# Audit Log - App - 2025-11-05 20:58:33

## Prompt Summary

Search Console flagged “Crawled – currently not indexed” examples for two font files plus `/pricing` and `/services`. User asked for remediation.

## Actions Taken

1. Added a permanent redirect so `/pricing` resolves to `/packages`, since no standalone pricing page exists.
2. Mirrored the redirect at the Netlify edge to keep legacy traffic consistent across environments.
3. Updated the robots.txt policy (via `next-sitemap`) to disallow `/_next/` and API paths so static assets such as fonts are excluded from indexing attempts.
4. Documented changes in the Bergen SEO execution tracker for continuity.

## Files Changed

- `next.config.js` - Added `/pricing -> /packages` redirect alongside other permanent rules.
- `public/_redirects` - Created the Netlify edge rule mirroring the pricing redirect.
- `next-sitemap.config.js` - Updated `robotsTxtOptions` to disallow `/_next/` and `/api/` paths.
- `docs/planning/bergen-seo-todo.md` - Logged the redirect and robots updates.

## Components/Features Affected

- Routing for legacy `/pricing` URL
- Robots.txt generation via `next-sitemap`

## Testing Considerations

- After deployment, run `curl -I https://pixelversestudios.io/pricing` (and the `www` variant) to confirm the 301/308 into `/packages`.
- Rebuild the sitemap/robots output (`npm run sitemap`) to verify the disallow directives are present.
- Request indexing for `/services` in Search Console once crawlers see the latest content; no code changes were necessary there.

## Performance Impact

- Redirect evaluation overhead is negligible.
- Blocking `/_next/` reduces wasted crawl budget.

## Next Steps

- Trigger “Validate Fix” for the Crawled-Currently-Not-Indexed report once production reflects these updates.
- Monitor whether `/services` clears after revalidation; if not, consider publishing a fresh content update to prompt recrawl.

## Notes

- `/services` already has unique metadata and is included in the sitemap; the previous crawl likely pre-dated the current content.

## Timestamp

Created: 2025-11-05 20:58:33
Page Section: global

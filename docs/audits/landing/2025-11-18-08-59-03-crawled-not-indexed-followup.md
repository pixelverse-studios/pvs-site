# Audit Log - App - 2025-11-18 08:59:03

## Prompt Summary

User shared the current Search Console “Crawled – currently not indexed” examples (`/_next/static/...woff2`, `/pricing`, `/services`) and asked whether additional action is required.

## Actions Taken

1. Reviewed existing redirects/robots controls to confirm they already address the flagged URLs.
2. Summarized why each entry appears in the report (fonts disallowed, `/pricing` legacy redirect, `/services` awaiting recrawl) and outlined next validation steps.

## Files Changed

- `public/robots.txt` (referenced) – Confirms `/_next/` is disallowed so fonts are intentionally excluded.
- `public/_redirects`, `next.config.js` (referenced) – `/pricing -> /packages` rule already lives here; no new edits were required.

## Components/Features Affected

- Global robots policy
- Legacy `/pricing` redirect to `/packages`
- Core `/services` landing metadata/content

## Testing Considerations

- After the latest deploy/cache purge, run `curl -I -L https://pixelversestudios.io/pricing` (and `www` variants) to verify the 301 to `/packages` that Google should eventually respect.
- Use the URL Inspection tool for `/services` and click “Request Indexing” so Google processes the refreshed copy and canonical meta.
- No testing needed for the font asset; it remains blocked by robots and will continue to show as “not indexed,” which is expected.

## Performance Impact

- None.

## Next Steps

- Hit “Validate Fix” in Search Console once `/pricing` 301 behavior is confirmed in production again.
- Refresh `/services` content or internal links if we want to speed up re-indexing, though unique metadata (`app/services/page.tsx`) is already in place.

## Notes

- The `/pricing` and `/services` URLs were flagged previously (see `docs/audits/landing/2025-11-05-20-58-33-crawled-not-indexed.md`); today’s review confirms the remediation still stands.

## Timestamp

Created: 2025-11-18 08:59:03
Page Section: global

# Audit Log - App - 2025-11-18 08:39:50

## Prompt Summary

User asked why `public/_redirects` still contains `/contact?context=<city>` entries when each town has a dedicated `/contact/<city>` page, citing Search Console indexing warnings.

## Actions Taken

1. Reviewed `public/_redirects` to confirm the existing query-parameter rules.
2. Cross-referenced prior audits to understand when and why these redirects were added.
3. Summarized the reasoning and guidance for the user (no code changes required).

## Files Changed

- `public/_redirects` - Read-only inspection to verify the `/contact?context=` to `/contact/<slug>` redirect mappings (no edits).

## Components/Features Affected

- Netlify redirect rules for legacy contact context URLs
- Local contact landing pages under `/contact/[slug]`

## Testing Considerations

- If needed, issue `curl -I https://pixelversestudios.io/contact?context=<city>` to confirm a 301 response to the `/contact/<city>` path.
- Once verified, use Search Console “Validate Fix” for the Page with Redirect report.

## Performance Impact

- None; preserving 301s prevents duplicate crawl paths and keeps link equity consolidated on the canonical `/contact/<city>` pages.

## Next Steps

- Continue phasing out any marketing materials that reference the `?context=` query format.
- Keep the redirects live until Search Console stops reporting the former URLs; then reassess whether they are still needed.

## Notes

- These redirects were introduced (see `docs/audits/landing/2025-11-05-20-54-10-contact-canonical-redirects.md`) to migrate legacy query-based routes without losing referrals or canonical signals.

## Timestamp

Created: 2025-11-18 08:39:50
Page Section: contact

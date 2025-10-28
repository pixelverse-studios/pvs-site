# Audit Log - App - 2025-10-27 20:55:36

## Prompt Summary

User asked how to address Google Search Console “Crawled – currently not indexed” URLs (styleguide, legacy contact query variants, and localized services pages).

## Actions Taken

1. Reviewed each example URL and current site configuration.
2. Documented remediation guidance tailored to the URL types (utility page, redirect cleanup, localized services).

## Files Changed

- _None_

## Components/Features Affected

- SEO coverage for styleguide and localized landing pages (operational guidance only)

## Testing Considerations

- After applying guidance (noindex or content enhancements), re-request indexing in Search Console.

## Performance Impact

- None.

## Next Steps

1. Decide whether `/styleguide` should be indexable; if not, add a `noindex` meta tag and request indexing so Google drops it.
2. Ensure all `?context=` URLs now 301 to `/contact/{slug}` (already implemented) and click “Validate Fix”.
3. Reinforce localized service pages with unique copy/internal links and submit them for indexing.

## Notes

- Guidance-only response; no repo changes performed.

## Timestamp

Created: 2025-10-27 20:55:36
Page Section: seo

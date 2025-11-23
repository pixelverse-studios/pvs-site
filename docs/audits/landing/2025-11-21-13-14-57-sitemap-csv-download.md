# Audit Log - App - 2025-11-21 13:14:57

## Prompt Summary

Add a button on `/docs/seo` that downloads all sitemap URLs as a CSV file.

## Actions Taken

1. Parsed sitemap index and child sitemap files server-side to collect unique URLs for reuse on the page.
2. Added a client-side download button that generates a CSV of those URLs and triggers a download on click.
3. Kept the existing sitemap count badge and paired it with the new download control in the page header.

## Files Changed

- `app/docs/seo/page.tsx` - Exposes sitemap URLs for display/counting and renders the new download button.
- `components/ui/download-sitemap-button.tsx` - New client component to build and download the sitemap URLs CSV.

## Components/Features Affected

- `/docs/seo` log page
- Sitemap status + download utility

## Testing Considerations

- Confirm the download button is enabled (sitemap files available) and that the CSV includes all URLs.
- Verify the CSV header row (`url`) and that URLs are newline-separated.
- Check light/dark themes to ensure button visibility and spacing remain consistent.

## Performance Impact

- Minimal: server-side file reads only; download uses a small client-side blob creation.
- No added network calls or bundle bloat beyond a lightweight icon import.

## Next Steps

- Re-run sitemap generation after new pages to keep the download output fresh.
- Optionally add a timestamp or hash to the CSV filename if multiple downloads per session are expected.

## Notes

- Button disables automatically if sitemap URLs cannot be read.

## Timestamp

Created: 2025-11-21 13:14:57
Page Section: docs/seo

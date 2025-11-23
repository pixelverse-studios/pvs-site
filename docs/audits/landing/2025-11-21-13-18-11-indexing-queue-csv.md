# Audit Log - App - 2025-11-21 13:18:11

## Prompt Summary

Add a CSV download for only the URLs that need indexing (GSC queue) with columns: url, date updated (current timestamp), date index requested (user input).

## Actions Taken

1. Removed the full-sitemap CSV control from `/docs/seo` to focus on indexing-queue URLs only.
2. Added a client-side CSV download control that accepts a user-supplied index request date, stamps the current timestamp at download time, and outputs just the queue URLs.
3. Wired the new control into the indexing queue card on `/docs/seo` with a brief columns note.

## Files Changed

- `app/docs/seo/page.tsx` - Swapped out the sitemap CSV UI, added the indexing-queue CSV control and helper text.
- `components/ui/indexing-csv-button.tsx` - New client component that dedupes queue URLs and downloads a CSV with timestamp + user-provided index date.
- `components/ui/download-sitemap-button.tsx` - Removed (replaced by the queue-specific control).

## Components/Features Affected

- `/docs/seo` indexing queue workflow
- Indexing CSV export utility

## Testing Considerations

- Confirm the download button enables (queue URLs present) and the CSV includes header + rows for every queue URL.
- Validate the generated timestamp format (ISO) and that the user-entered date populates `date_index_requested`; blank inputs should show `N/A`.
- Check layout/spacing of the control and helper text in light/dark themes.

## Performance Impact

- Minimal: small client-side blob generation; no additional network calls.
- No change to bundle load beyond one icon import.

## Next Steps

- Consider auto-filling the index request date with today to reduce clicks.
- If multiple updates appear on the page, evaluate per-update filenames or timestamps in the CSV name.

## Notes

- Sitemap URL count badge remains; CSV export now targets only the indexing queue.

## Timestamp

Created: 2025-11-21 13:18:11
Page Section: docs/seo

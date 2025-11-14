# Audit Log - App - 2025-11-13 20:02:09

## Prompt Summary

Remove the strict http(s) requirement from the audit form Website URL validation and fall back to enforcing `www.` + domain extension only.

## Actions Taken

1. Updated the shared `websiteUrlSchema` to use a regex that allows optional http(s) while still requiring `www.` and a valid TLD.
2. Switched the audit form input back to `type="text"` with a `www.example.com` placeholder for clearer UX.
3. Documented the change in the Bergen SEO planning tracker so future work references the relaxed requirement.

## Files Changed

- `lib/validation/url.ts` - Replaced the strict URL schema with a regex that only enforces `www.` + domain extension, keeping normalization in place.
- `components/audit/audit-form.tsx` - Updated the website field type/placeholder to match the relaxed rule.
- `docs/planning/bergen-seo-todo.md` - Added a log entry describing the validation adjustment.

## Components/Features Affected

- Audit form UX/validation
- Shared website validation helper

## Testing Considerations

- Submit URLs with and without http(s) (e.g., `www.example.com`, `https://www.example.com`) to confirm both pass.
- Try invalid values lacking `www.` or a TLD to ensure the regex error surfaces.
- Verify payload normalization still prepends `https://` before hitting Supabase.

## Performance Impact

- None; only regex/string validation changes.

## Next Steps

- Coordinate with backend if validator expectations change again so both layers stay in sync.

## Notes

- The API still stores normalized `https://` URLs for consistency even when users omit the protocol.

## Timestamp

Created: 2025-11-13 20:02:09
Page Section: audit-form

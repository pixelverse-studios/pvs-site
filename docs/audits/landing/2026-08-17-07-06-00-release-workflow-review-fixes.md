# Audit Log - Release workflow review fixes - 2026-08-17 07:06 ET

## Prompt Summary

Resolve the final cross-repository review findings for the Domani release workflow.

## Actions Taken

1. Replaced internal lifecycle and visibility choices on the release list with Draft, Published, Coming Soon, and Changelog language.
2. Applied the America/New_York business calendar to destination derivation, date validation, defaults, and release-date formatting.
3. Kept historical timing editable for published records while preventing drafts from selecting past dates or months.
4. Added New York midnight-boundary tests and verified the complete dashboard test and production build suites.

## Files Changed

- `app/dashboard/domani/releases/components/releases-page-client.tsx` - Simplified filters, summaries, and row badges.
- `app/dashboard/domani/releases/components/release-rules.ts` - Added shared New York release-calendar rules.
- `app/dashboard/domani/releases/components/release-editor.tsx` - Applied New York defaults and minimum dates.
- `app/dashboard/domani/releases/components/release-rules.test.ts` - Added date-boundary coverage.

## Verification

- `npm test`
- `npm run type-check`
- `npm run build`

# Audit Log - App - 2025-11-07 10:44:57

## Prompt Summary

User asked for a dedicated `src=test` option so SiteBehaviour tracking can be verified after deployment without touching live campaign data.

## Actions Taken

1. Extended the ad-source mapping in `lib/analytics.ts` to include the `TEST` label so `src=test` emits a “Test” event.
2. Logged the update in the Bergen SEO execution tracker for visibility.

## Files Changed

- `lib/analytics.ts` - Added the `TEST` entry to `AD_SOURCE_LABELS` so the tracker recognizes the new code.
- `docs/planning/bergen-seo-todo.md` - Documented the testing capability.

## Components/Features Affected

- Campaign tracker / SiteBehaviour analytics events driven by `src` query params

## Testing Considerations

- Visit any page with `?src=test` (e.g., `https://pixelversestudios.io/services?src=test`) and confirm SiteBehaviour logs show a single “Test” ad-source event.

## Performance Impact

- None.

## Next Steps

- Share the supported `src` codes (G, M, QR, AUDIT, TEST) with the marketing team.

## Notes

- `src=test` still respects session-based dedupe, so refreshes won’t spam events unless a new session begins.

## Timestamp

Created: 2025-11-07 10:44:57
Page Section: global

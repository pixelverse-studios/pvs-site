# Audit Log - App - 2025-11-07 10:28:50

## Prompt Summary

User decided to stop tracking UTM parameters and only record source codes via `src=` (G, M, QR, Audit). Requested simplifying the recently added campaign tracker accordingly.

## Actions Taken

1. Rebuilt `lib/analytics.ts` to focus solely on ad-source tracking (G/M/QR/Audit), cookie storage for repeat visits, and SiteBehaviour page-view events.
2. Simplified `components/campaign-tracker.tsx` so it only inspects `src`, stores the value, falls back to the cookie when params are absent, and fires SiteBehaviour events. Removed all UTM/campaign history logic.
3. Deleted the previously added `middleware.ts` because UTM persistence is no longer needed, and updated the planning log to reflect the `src`-only approach.

## Files Changed

- `lib/analytics.ts` - New lean implementation with `trackAdSource`, `storeAdSource`, `getStoredAdSource`, and `trackPageView` helpers.
- `components/campaign-tracker.tsx` - Now handles only `src` tracking plus cookie fallback.
- `app/layout.tsx` - (Indirect) still imports the tracker; no change needed but tested to ensure build passes.
- `middleware.ts` - Removed since UTM cookie capture is no longer part of the flow.
- `docs/planning/bergen-seo-todo.md` - Updated notes to describe the simplified tracking strategy.

## Components/Features Affected

- Global analytics instrumentation (ad source + page views)
- Middleware pipeline (removed)

## Testing Considerations

- Visit `https://pixelversestudios.io/services?src=G` and confirm SiteBehaviour logs show one “Ad Source” event (check console in non-production).
- Remove query params, refresh, and ensure the stored source still fires once per new session.

## Performance Impact

- Slightly reduced bundle/middleware overhead due to removing UTM parsing and cookie middleware.

## Next Steps

- Provide marketing with a list of accepted `src` codes (currently G, M, QR, AUDIT) for campaign links.

## Notes

- If future requirements need UTM data again, re-introduce the previous analytics helpers/middleware.

## Timestamp

Created: 2025-11-07 10:28:50
Page Section: global

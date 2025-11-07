# Audit Log - App - 2025-11-07 10:22:40

## Prompt Summary

User requested implementing the CampaignTracker pattern so traffic from Google (G), Meta (M), QR codes, and Audit links can be tracked consistently.

## Actions Taken

1. Added `components/campaign-tracker.tsx`, a client component that listens for `src` short codes + UTM params, stores attribution history, and fires SiteBehaviour events.
2. Created `lib/analytics.ts` with helper functions for ad source tracking, UTM parsing, cookie/localStorage persistence, and SiteBehaviour event queuing.
3. Wired the tracker into `app/layout.tsx` via a dynamic import and `Suspense` boundary so it runs on every route without impacting SSR.
4. Introduced `middleware.ts` to capture UTM/src params server-side and persist them in a `campaign_data` cookie for returning sessions.
5. Documented the new capability in the Bergen SEO execution log.

## Files Changed

- `components/campaign-tracker.tsx` - New tracker component handling query param parsing and analytics dispatch.
- `lib/analytics.ts` - Helper utilities powering the tracker (ad source mapping G/M/QR/Audit, storage, SiteBehaviour queueing).
- `app/layout.tsx` - Dynamically imports and renders the tracker near the root of the app.
- `middleware.ts` - Stores incoming UTM/src data in a cookie for attribution persistence.
- `docs/planning/bergen-seo-todo.md` - Logged the tracker + middleware rollout.

## Components/Features Affected

- Global analytics instrumentation (SiteBehaviour events, UTM tracking)
- Middleware request flow due to cookie handling

## Testing Considerations

- Visit a URL with `?utm_source=google&utm_medium=cpc&utm_campaign=test&src=G` and verify SiteBehaviour events fire (check console logs in non-prod).
- Confirm the `campaign_data` cookie is written and that navigating without query params still triggers campaign events.
- Ensure middleware does not run on static assets (matcher already excludes `_next` and favicons).

## Performance Impact

- Minimal; tracker runs client-side with lightweight effects and deferred dynamic import.

## Next Steps

- Consider exposing campaign history in admin tooling or GA/GTM if needed.

## Notes

- Ad source codes currently support `G`, `M`, `QR`, and `AUDIT`; extend `AD_SOURCE_LABELS` if new channels are added.

## Timestamp

Created: 2025-11-07 10:22:40
Page Section: global

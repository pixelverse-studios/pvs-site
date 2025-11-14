# Audit Log - App - 2025-11-13 17:27:39

## Prompt Summary

User reported console errors appearing while filling out the audit form.

## Actions Taken

1. Wrapped the SiteBehaviour loader in a production-only, env-driven guard to avoid unauthorized tracker calls during local use.
2. Updated the Bergen SEO checklist to capture the new guard progress note.
3. Logged the analytics change in the Bergen SEO planning tracker.

## Files Changed

- `app/layout.tsx` - Only mount the SiteBehaviour script when `NEXT_PUBLIC_SITEBEHAVIOUR_SECRET` is set in production, preventing unauthorized requests locally.
- `docs/features/bergen-seo-checklist.md` - Documented the production-only guard addition under the analytics setup task.
- `docs/planning/bergen-seo-todo.md` - Added a progress log entry describing the guard implementation.

## Components/Features Affected

- Root layout / SiteBehaviour tracking
- Audit form developer experience
- Analytics documentation

## Testing Considerations

- Confirm the SiteBehaviour script still loads correctly in production/staging when the env var is set.
- Verify local/staging environments without the secret no longer log tracker errors while using the audit form.
- Smoke test the audit form submission flow to ensure no regressions.

## Performance Impact

- Avoids loading the external SiteBehaviour script during local development, slightly reducing noise and network usage.
- Production performance remains unchanged because the script still loads when enabled.
- No SEO implications; this only affects analytics instrumentation.

## Next Steps

- Populate `NEXT_PUBLIC_SITEBEHAVIOUR_SECRET` in production/staging env configs.
- Validate SiteBehaviour dashboards after deploy to ensure events resume tracking.
- Monitor audit form conversion analytics once tracking runs again.

## Notes

- CampaignTracker continues queuing events even when the loader is disabled, which is acceptable for dev/staging.

## Timestamp

Created: 2025-11-13 17:27:39
Page Section: audit-form

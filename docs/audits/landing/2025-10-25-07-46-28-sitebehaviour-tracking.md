# Audit Log - App - 2025-10-25 07:46:28

## Prompt Summary

User requested adding the SiteBehaviour tracking script across the website.

## Actions Taken

1. Injected the SiteBehaviour bootstrap snippet into the root layout with a deferred Next.js Script component.
2. Logged the analytics instrumentation update within the Bergen SEO planning tracker.

## Files Changed

- `app/layout.tsx` - Imported the Next Script helper, added the SiteBehaviour secret, and mounted the bootstrap script globally.
- `docs/planning/bergen-seo-todo.md` - Added a progress log entry describing the SiteBehaviour analytics integration.

## Components/Features Affected

- RootLayout
- Site-wide analytics instrumentation

## Testing Considerations

- Confirm the script loads once per navigation and respects deferred execution.
- Validate SiteBehaviour captures sessions and heatmap flagging when the query parameter is present.
- Check for console warnings or hydration issues in both light and dark themes.

## Performance Impact

- Adds one deferred external script request from the SiteBehaviour CDN.
- Minor potential impact on initial load; verify Lighthouse remains ≥90 post-deploy.
- Ensure CDN asset is cached effectively in production.

## Next Steps

- Monitor analytics tracking accuracy and heatmap capture post-deployment.
- Coordinate with marketing to confirm reporting dashboards receive data.

## Notes

- `window.sitebehaviourTrackingSecret` is exposed intentionally per vendor requirements.

## Timestamp

Created: 2025-10-25 07:46:28
Page Section: sitewide

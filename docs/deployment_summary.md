# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary
- Fixed SiteBehaviour heatmap and session tracking — was silently blocked by security policy since recent middleware changes
- Visitor heatmaps and session recordings should resume immediately after deploy

## Notes for internal team
- DEV-419: Root cause was missing SiteBehaviour domains in CSP `connect-src` directive in `middleware.ts`
- Added `https://*.sitebehaviour.com` (covers api-server and event-store subdomains) and `https://sitebehaviour-cdn.fra1.cdn.digitaloceanspaces.com` (replay script)
- The SiteBehaviour bootstrap script was loading correctly, but XHR calls to send tracking data were blocked by CSP
- Environment variable `NEXT_PUBLIC_SITEBEHAVIOUR_SECRET` was already set on Netlify — no env change needed

## Changed URLs
- https://www.pixelversestudios.io

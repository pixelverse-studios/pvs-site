# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary
- Fixed SiteBehaviour heatmap and session tracking — was silently blocked by security policy since recent middleware changes
- Visitor heatmaps and session recordings should resume immediately after deploy
- Shortened 6 blog post title tags for better search result display (all now under 60 characters)

## Notes for internal team
- DEV-419: Root cause was missing SiteBehaviour domains in CSP `connect-src` directive in `middleware.ts`
- Added `https://*.sitebehaviour.com` (covers api-server and event-store subdomains) and `https://sitebehaviour-cdn.fra1.cdn.digitaloceanspaces.com` (replay script)
- The SiteBehaviour bootstrap script was loading correctly, but XHR calls to send tracking data were blocked by CSP
- Environment variable `NEXT_PUBLIC_SITEBEHAVIOUR_SECRET` was already set on Netlify — no env change needed
- DEV-412: Shortened blog titles flagged by SEOptimer as "Title Tag Text Too Long"
- File: `data/blog-posts.ts` — 6 titles trimmed to <=60 characters while preserving primary keywords

## Changed URLs
- https://www.pixelversestudios.io
- https://www.pixelversestudios.io/blog/ai-security-trust-and-small-business-confidence
- https://www.pixelversestudios.io/blog/why-seo-matters-for-small-businesses
- https://www.pixelversestudios.io/blog/local-seo-title-meta-playbook
- https://www.pixelversestudios.io/blog/focus-on-growth-not-diy-digital
- https://www.pixelversestudios.io/blog/analytics-retainer-reporting-clients-actually-read
- https://www.pixelversestudios.io/blog/custom-development-vs-website-builders

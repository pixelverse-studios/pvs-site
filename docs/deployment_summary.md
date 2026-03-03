# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary
- Fixed SiteBehaviour heatmap and session tracking — was silently blocked by security policy since recent middleware changes
- Visitor heatmaps and session recordings should resume immediately after deploy
- Shortened 6 blog post title tags for better search result display (all now under 60 characters)
- Shortened web development service page title tag for better search display
- Shortened all 8 blog meta descriptions to under 160 characters for better SERP snippets
- Fixed heading hierarchy on contact page for better SEO and accessibility

## Notes for internal team
- DEV-419: Root cause was missing SiteBehaviour domains in CSP `connect-src` directive in `middleware.ts`
- Added `https://*.sitebehaviour.com` (covers api-server and event-store subdomains) and `https://sitebehaviour-cdn.fra1.cdn.digitaloceanspaces.com` (replay script)
- The SiteBehaviour bootstrap script was loading correctly, but XHR calls to send tracking data were blocked by CSP
- Environment variable `NEXT_PUBLIC_SITEBEHAVIOUR_SECRET` was already set on Netlify — no env change needed
- DEV-412: Shortened blog titles flagged by SEOptimer as "Title Tag Text Too Long"
- File: `data/blog-posts.ts` — 6 titles trimmed to <=60 characters while preserving primary keywords
- DEV-413: Shortened web-development page title from 64 to 51 chars
- File: `app/services/web-development/page.tsx`
- DEV-414: Shortened all 8 blog excerpts (used as meta descriptions) to <=160 chars
- File: `data/blog-posts.ts`
- DEV-415: Changed H3→H2 in contact form success states and strategy call header to fix H1→H3 skip
- Files: `components/contact/contact-details-form.tsx`, `contact-review-form.tsx`, `contact-strategy-call.tsx`

## Changed URLs
- https://www.pixelversestudios.io
- https://www.pixelversestudios.io/blog/ai-security-trust-and-small-business-confidence
- https://www.pixelversestudios.io/blog/why-seo-matters-for-small-businesses
- https://www.pixelversestudios.io/blog/local-seo-title-meta-playbook
- https://www.pixelversestudios.io/blog/focus-on-growth-not-diy-digital
- https://www.pixelversestudios.io/blog/analytics-retainer-reporting-clients-actually-read
- https://www.pixelversestudios.io/blog/custom-development-vs-website-builders
- https://www.pixelversestudios.io/services/web-development
- https://www.pixelversestudios.io/blog/how-much-does-a-website-cost-new-jersey
- https://www.pixelversestudios.io/blog/ux-vs-ui-precision-for-service-brands
- https://www.pixelversestudios.io/contact

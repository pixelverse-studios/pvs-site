# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary
- Fixed SiteBehaviour heatmap and session tracking — was silently blocked by security policy since recent middleware changes
- Visitor heatmaps and session recordings should resume immediately after deploy
- Shortened 6 blog post title tags for better search result display (all now under 60 characters)
- Shortened web development service page title tag for better search display
- Shortened all 8 blog meta descriptions to under 160 characters for better SERP snippets
- Fixed heading hierarchy on contact page for better SEO and accessibility
- Converted all contact page tabs to clean URL routes (/contact/details, /contact/call, /contact/review)
- Tab selector now updates the URL when switching between contact form types
- Each contact path has its own page with dedicated metadata and breadcrumb schema
- All old query string URLs (?path=review, ?path=details, ?path=call) now 301 redirect to clean URLs
- "Book a strategy call" CTA on blog pages now links directly to /contact/call
- /contact now redirects to /contact/details — all internal links updated to avoid redirect chains
- /audit now redirects to /contact/review instead of /contact
- Updated sitemap to list the 3 specific contact routes instead of the generic /contact URL
- Fixed breadcrumb schema on Strategy Call and Website Review pages to point to /contact/details instead of /contact (which 301 redirects)
- Removed 9 redundant redirect rules from Netlify config that were already handled by Next.js server-side redirects
- Moved ContactPage structured data schema from dead /contact page into /contact/details (the canonical entry point)
- Removed dead /contact page code that was unreachable behind a catch-all redirect

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
- DEV-417: Converted contact page from query-param tabs to route-based navigation
- New files: `app/contact/details/page.tsx`, `app/contact/call/page.tsx`, `app/contact/review/page.tsx`
- Each route has unique metadata, keywords, and breadcrumb schema
- Converted `ContactPathSelector` from `<button>` + React state to `<Link>` navigation
- Updated internal links: `data/homepage.ts`, `data/service-paths.ts`, `components/ui/request-review-cta.tsx`, `data/web-development-content.ts`, `data/homepage-faq.ts`, `components/blog/blog-cta-section.tsx`
- Added 301 redirects for all 3 old query string patterns in `next.config.js` and `public/_redirects`
- Fixed breadcrumb schema parent URL in `app/contact/call/page.tsx` and `app/contact/review/page.tsx` — changed `/contact` to `/contact/details` to avoid pointing to a 301 redirect
- Removed 3 `?path=` and 6 `?context=` query-parameter redirects from `public/_redirects` — these are handled by `next.config.js` `redirects()` with `has` conditions
- Moved `contactPageSchema` (ContactPage structured data) from `app/contact/page.tsx` to `app/contact/details/page.tsx`, updated URL to `/contact/details`
- Updated breadcrumb parent from `/contact` to `/contact/details` in details page
- Deleted `app/contact/page.tsx` — dead code behind catch-all redirect in `next.config.js`

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
- https://www.pixelversestudios.io/contact/details
- https://www.pixelversestudios.io/contact/call
- https://www.pixelversestudios.io/contact/review

# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary
- Fixed domain redirect rules to use www as the canonical domain (was incorrectly redirecting www to non-www)
- SEO crawlers and audit tools should now properly discover all site pages via sitemap
- Added campaign compose page for Domani email campaigns (select recipients, write email, preview, send)
- Dashboard sidebar now shows the PVS logo instead of generic icon
- Fixed mobile navigation hamburger button overlapping header breadcrumbs
- Improved security: API secrets are no longer exposed in browser code
- Added email HTML sanitization for safe preview rendering

## Notes for internal team
- Flipped `_redirects` rules: non-www now 301s to www (previously was reversed)
- **ACTION NEEDED**: Verify in Netlify Domain Management that `www.pixelversestudios.io` is set as the primary domain — Netlify CDN-level redirects override `_redirects` file rules
- robots.txt and sitemap.xml already referenced www correctly
- DEV-457: Campaign compose page with collapsible recipient/content sections, cohort filtering, server-side API proxying
- New API routes: `/api/campaigns/preview` and `/api/campaigns/send` (proxy secrets server-side)
- Added `dompurify` dependency for HTML sanitization
- Renamed `NEXT_PUBLIC_BLAST_SECRET` → `BLAST_SECRET` (env var update needed in hosting)

## Changed URLs
- https://www.pixelversestudios.io/sitemap.xml
- https://www.pixelversestudios.io/robots.txt
- https://www.pixelversestudios.io/dashboard/domani/campaigns/new

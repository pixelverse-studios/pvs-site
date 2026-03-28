# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary

- Consolidated all website traffic to a single domain (pixelversestudios.io) — Google was previously splitting our authority between www and non-www versions, weakening search rankings
- All canonical URLs, sitemap entries, structured data, robots.txt, and OG tags now point to the canonical non-www domain
- Netlify redirects reversed: www now redirects to non-www (was previously the opposite)

## Notes for internal team

- DEV-620 completed: www → non-www domain authority consolidation
- Root cause: public/_redirects was redirecting non-www → www, but GSC data showed non-www had more impressions (81 vs 63 on homepage alone)
- Files changed: public/_redirects (reversed redirect direction), lib/metadata.ts, next-sitemap.config.js, app/robots.ts, app/sitemap.ts, app/portfolio/[slug]/page.tsx, app/contact/details/page.tsx, public/llms.txt, .env.local
- All `www.pixelversestudios.io` references in code replaced with `pixelversestudios.io`
- Downstream automatic updates: app/layout.tsx metadataBase, lib/structured-data.ts schema URLs (both import from lib/metadata.ts)
- GSC action needed: resubmit sitemap after deploy, request re-indexing for homepage and key pages
- Part of epic DEV-619 (SEO Indexing & Authority Consolidation)

## Changed URLs

- https://pixelversestudios.io/
- https://pixelversestudios.io/services
- https://pixelversestudios.io/services/web-development
- https://pixelversestudios.io/services/seo
- https://pixelversestudios.io/areas/bergen-county
- https://pixelversestudios.io/areas/bergen-county/fort-lee
- https://pixelversestudios.io/areas/bergen-county/englewood
- https://pixelversestudios.io/areas/bergen-county/hackensack
- https://pixelversestudios.io/areas/bergen-county/paramus
- https://pixelversestudios.io/areas/bergen-county/ridgewood
- https://pixelversestudios.io/portfolio
- https://pixelversestudios.io/portfolio/jones-pressure-washing
- https://pixelversestudios.io/portfolio/360-degree-care
- https://pixelversestudios.io/portfolio/domani
- https://pixelversestudios.io/about
- https://pixelversestudios.io/contact
- https://pixelversestudios.io/faq
- https://pixelversestudios.io/blog
- https://pixelversestudios.io/sitemap.xml

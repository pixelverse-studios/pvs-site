# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary

- Updated the public business phone and meeting information throughout the website.

- Improved search resource access, local service information and SEO inquiry paths.
- Reframed SEO packages around shared research and proposal-defined monthly work, retained pricing, and aligned homepage/service pricing FAQs and inquiry names.
- Clarified tier-specific implementation and listing/content/inquiry work, and displayed the SEO setup fee alongside its monthly starting price.
- Refined the SEO price summary with calmer typography and an integrated setup fee across light/dark and mobile layouts.
- Removed private street details and the precise map; retained the public base town, service area, and business contact information.
- Kept Google review claims conditional on verified available data, corrected attribution edge cases, and improved required form labels and mobile footer wrapping.
- Added a client work section to the service and Bergen County area pages linking directly to our local case studies.

## Notes for internal team

- Prepared SEO remediation; validate Google rendering and production lead measurement after release.
- The #263 entries above went live on 2026-11-04 but were merged on GitHub, so that summary was never sent; they ship again with this push.
- Case-study internal links: GSC (2026-11-13) showed /portfolio/jones-pressure-washing and /portfolio/iffers-pictures as "Discovered - currently not indexed" (never crawled); they were linked only from /portfolio (and Jones from /). New `RelatedCaseStudies` section (components/portfolio/related-case-studies.tsx, getRelatedCaseStudies in data/case-studies.ts) renders server-side links on city pages (same-city client first), the county hub, /services/seo and /services/web-development. Indexing requested for both case studies on 2026-11-13; re-check URL Inspection ~2 weeks after deploy.

## Changed URLs

- https://pixelversestudios.io/
- https://pixelversestudios.io/services/seo
- https://pixelversestudios.io/areas/bergen-county
- https://pixelversestudios.io/contact/details
- https://pixelversestudios.io/portfolio/jones-pressure-washing
- https://pixelversestudios.io/portfolio/360-degree-care
- https://pixelversestudios.io/sitemap.xml
- https://pixelversestudios.io/docs/seo

- https://pixelversestudios.io/areas/bergen-county/englewood
- https://pixelversestudios.io/areas/bergen-county/fort-lee
- https://pixelversestudios.io/areas/bergen-county/hackensack
- https://pixelversestudios.io/areas/bergen-county/paramus
- https://pixelversestudios.io/areas/bergen-county/ridgewood
- https://pixelversestudios.io/contact/call
- https://pixelversestudios.io/contact/review
- https://pixelversestudios.io/services/seo
- https://pixelversestudios.io/services/web-development
- https://pixelversestudios.io/areas/bergen-county
- https://pixelversestudios.io/areas/bergen-county/englewood
- https://pixelversestudios.io/areas/bergen-county/fort-lee
- https://pixelversestudios.io/areas/bergen-county/hackensack
- https://pixelversestudios.io/areas/bergen-county/paramus
- https://pixelversestudios.io/areas/bergen-county/ridgewood
- https://pixelversestudios.io/portfolio/360-degree-care
- https://pixelversestudios.io/portfolio/iffers-pictures
- https://pixelversestudios.io/portfolio/jones-pressure-washing

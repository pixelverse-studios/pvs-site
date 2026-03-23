# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary

- Fixed domain mismatch that was sending conflicting signals to Google — canonical URLs and sitemap now use the same www domain
- Fixed redirect errors caused by duplicate redirect rules between Netlify and Next.js
- Removed internal SEO dashboard page from the public sitemap
- Added login page to robots.txt block list for defense-in-depth

- Added service area statement listing priority cities (Fort Lee, Englewood, Hackensack, Paramus, Ridgewood) to website footer and homepage
- Fixed schema bug where all city pages incorrectly showed Cliffside Park as their location instead of the actual target city
- Added Bergen County and New Jersey location keywords to service page headings and body copy for stronger local SEO signals
- Updated call-to-action buttons on service pages to reference NJ service area
- Added "Areas We Serve" section to homepage showcasing 5 Bergen County priority cities with links to area pages
- Built new area pages infrastructure at /areas/bergen-county/ with city sub-pages for Fort Lee, Englewood, Hackensack, Paramus, and Ridgewood
- Old /services/[city] URLs now redirect to new /areas/bergen-county/[city] paths
- Added Bergen County hub page with full SEO content covering services, local market context, city links, and FAQ
- Added Fort Lee city page with 1,500+ words of local content, FAQ, and structured data schemas
- Added Englewood city page with 1,500+ words covering Palisade Ave corridor, Englewood Hospital, arts district, and local FAQ
- Added Hackensack city page with 1,500+ words covering county seat, HUMC, Bergen County Courthouse, Route 17, and downtown revitalization
- Added Ridgewood city page with 1,500+ words covering the Village downtown, boutique/premium market, and Western Bergen County reach
- Added Paramus city page with 1,500+ words covering Route 4/17 corridors, Garden State Plaza, and NJ's busiest retail market
- Upgraded area page designs to match service page polish — eyebrows, animated sections, FAQ accordion, gradient CTAs
- Added all area pages to sitemap for Google crawling
- Fixed Bergen County meta description that was too long for search results

## Notes for internal team

- DEV-493: Changed `siteUrl` in `lib/metadata.ts` from `https://pixelversestudios.io` to `https://www.pixelversestudios.io`
- This was the only non-www reference — sitemap, robots, and all hardcoded URLs already used www
- Impact: canonical tags, OG URLs, and Twitter card URLs now match sitemap/robots domain
- Part of SEO audit remediation (score dropped 81→64, this mismatch likely contributed to 103 not-indexed pages)
- DEV-494: GSC indexing audit — 103 not-indexed pages analyzed
- Removed `/works` and `/pricing` from `public/_redirects` (duplicated Next.js redirects, caused 2-hop chains)
- Removed `/docs/seo` from `app/sitemap.ts` (internal page, already had noindex meta)
- Added `/login` to robots.txt disallow in `app/robots.ts` and `next-sitemap.config.js`
- Full analysis documented in `docs/seo/gsc-indexing-audit-2026-03-15.md`
- Manual action needed: request reindexing for 24 indexed pages via GSC URL Inspection tool
- DEV-505: Added service area city list to footer contact section and homepage services section
- Files: `components/ui/footer.tsx`, `components/home/services-section.tsx`
- DEV-503: Added "Areas We Serve" homepage section
- New component: `components/home/areas-we-serve-section.tsx` (server component)
- 5 priority city cards linking to `/areas/bergen-county/[city]` + Bergen County hub link
- Placed after TestimonialCarousel, before HomeFaqSection
- DEV-502: Fixed `createCityLocalBusinessSchema()` hardcoding `addressLocality: 'Cliffside Park'` for all cities
- Changed to use dynamic `city` and `state` params; removed `streetAddress` and `postalCode` (SAB model)
- File: `lib/structured-data.ts`
- DEV-504: Added location keywords to service page H2s and body copy
- SEO page: 3/6 H2s now include location keywords (50%), 15 location mentions in body
- Web dev page: 3/6 H2s now include location keywords (50%), 12 location mentions in body
- Services overview: updated CTA section with Bergen County/NJ reference
- Files: `data/seo-content.ts`, `data/web-development-content.ts`, `data/service-paths.ts`
- DEV-346: Built /areas/ routing infrastructure with county/city hierarchy
- Created `app/areas/[county]/page.tsx` and `app/areas/[county]/[city]/page.tsx` dynamic routes
- Created `data/area-pages-content.ts` with typed data structure and lookup helpers
- Updated `next.config.js`: priority city redirects now point to `/areas/bergen-county/[city]`
- Updated `lib/structured-data.ts`: schema functions accept optional `basePath` for `/areas/` URLs
- Architecture decision: `/areas/[county]/[city]` chosen over `/services/[city]` for scalable county expansion
- DEV-347: Built Bergen County hub page at `/areas/bergen-county`
- Expanded `CountyContent` type with intro, services, localSignals, faq, cta fields
- 1,500+ word page with hero, intro, services overview, city grid, local signals, FAQ (5 questions), CTA
- FAQPage schema, LocalBusiness schema, BreadcrumbList schema
- Internal links to all 5 city pages and both service pages
- DEV-348: Added Fort Lee city page at `/areas/bergen-county/fort-lee`
- 1,500+ word page with intro, web design section, SEO section, local signals, 5-question FAQ, CTA
- Covers Fort Lee business landscape, Korean community, GW Bridge corridor, Main St / Lemoine Ave
- LocalBusiness, BreadcrumbList, FAQPage, Service schemas
- DEV-349: Added Englewood city page at `/areas/bergen-county/englewood`
- 1,500+ word page covering Palisade Ave, Englewood Hospital, Van Brunt arts district
- 5-question FAQ, web design and SEO sections, local signals
- DEV-350: Added Hackensack city page at `/areas/bergen-county/hackensack`
- 1,500+ word page covering HUMC, Bergen County Courthouse, Route 17, Main Street, downtown revitalization
- 5-question FAQ targeting medical, legal, Route 17, and redesign queries
- DEV-352: Added Ridgewood city page at `/areas/bergen-county/ridgewood`
- 1,500+ word page covering Village downtown, Ridgewood Ave/East Ridgewood Ave corridors, Ridgewood Guild
- 5-question FAQ targeting boutique, foot traffic, premium design, pricing, surrounding towns
- DEV-351: Added Paramus city page at `/areas/bergen-county/paramus`
- 1,500+ word page covering Route 4/17, Garden State Plaza, Bergen Town Center, Bergen Community College
- 5-question FAQ targeting Route 17 retail, GSP restaurant searches, competing with big brands
- DEV-561: Design/UX pass on area pages
- Replaced plain text layouts with ServiceHero, ServiceNarrativeSection, ServiceFAQ, ServiceCta components
- Added eyebrow labels, staggered animations, FAQ accordion, gradient CTA sections
- Both county hub and city page templates upgraded

## Changed URLs

- https://www.pixelversestudios.io/
- https://www.pixelversestudios.io/services
- https://www.pixelversestudios.io/services/web-development
- https://www.pixelversestudios.io/services/seo
- https://www.pixelversestudios.io/portfolio
- https://www.pixelversestudios.io/about
- https://www.pixelversestudios.io/contact/details
- https://www.pixelversestudios.io/contact/call
- https://www.pixelversestudios.io/contact/review
- https://www.pixelversestudios.io/faq
- https://www.pixelversestudios.io/blog
- https://www.pixelversestudios.io/blog/how-much-does-a-website-cost-new-jersey
- https://www.pixelversestudios.io/blog/local-seo-title-meta-playbook
- https://www.pixelversestudios.io/blog/why-seo-matters-for-small-businesses
- https://www.pixelversestudios.io/blog/custom-development-vs-website-builders
- https://www.pixelversestudios.io/blog/ux-vs-ui-precision-for-service-brands
- https://www.pixelversestudios.io/blog/focus-on-growth-not-diy-digital
- https://www.pixelversestudios.io/blog/ai-security-trust-and-small-business-confidence
- https://www.pixelversestudios.io/blog/analytics-retainer-reporting-clients-actually-read
- https://www.pixelversestudios.io/portfolio/jones-pressure-washing
- https://www.pixelversestudios.io/portfolio/360-degree-care
- https://www.pixelversestudios.io/portfolio/domani
- https://www.pixelversestudios.io/services/fort-lee
- https://www.pixelversestudios.io/services/englewood
- https://www.pixelversestudios.io/services/hackensack
- https://www.pixelversestudios.io/services/paramus
- https://www.pixelversestudios.io/services/ridgewood
- https://www.pixelversestudios.io/areas/bergen-county
- https://www.pixelversestudios.io/areas/bergen-county/fort-lee
- https://www.pixelversestudios.io/areas/bergen-county/englewood
- https://www.pixelversestudios.io/areas/bergen-county/hackensack
- https://www.pixelversestudios.io/areas/bergen-county/paramus
- https://www.pixelversestudios.io/areas/bergen-county/ridgewood

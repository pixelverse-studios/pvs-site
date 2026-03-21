# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary

- Fixed domain mismatch that was sending conflicting signals to Google — canonical URLs and sitemap now use the same www domain
- Fixed redirect errors caused by duplicate redirect rules between Netlify and Next.js
- Removed internal SEO dashboard page from the public sitemap
- Added login page to robots.txt block list for defense-in-depth

- Added service area statement listing priority cities (Fort Lee, Englewood, Hackensack, Paramus, Ridgewood) to website footer and homepage
- Fixed schema bug where all city pages incorrectly showed Cliffside Park as their location instead of the actual target city

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
- DEV-502: Fixed `createCityLocalBusinessSchema()` hardcoding `addressLocality: 'Cliffside Park'` for all cities
- Changed to use dynamic `city` and `state` params; removed `streetAddress` and `postalCode` (SAB model)
- File: `lib/structured-data.ts`

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

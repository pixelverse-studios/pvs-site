# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary

- Updated 360 Degree Care case study to reflect completed engagement — narrative now uses past tense
- Removed client testimonial from 360 Degree Care case study (no longer verifiable)
- Case study now links to demo site instead of former live site
- Portfolio listing and detail pages gracefully handle demo vs live site links
- **Fixed critical SEO bug**: structured data (schema markup) is now correctly delivered on every page so Google can read it. Previously every schema across the site was missing from the rendered HTML and invisible to search engines.

## Notes for internal team

- Added `demoUrl` field to CaseStudy type for portfolio pieces that are no longer active client sites
- Made `url` field optional on CaseStudy type
- 360 Degree Care demo site: https://haven-home-healthcare.netlify.app/
- DEV-672: replaced `next/script` (strategy="afterInteractive") with a plain `<script>` element in `components/ui/structured-data.tsx`. Affects every page that consumes `<StructuredData>` (17 consumers). After deploy, request re-indexing in GSC for top pages and re-run Google Rich Results Test.

## Changed URLs

- https://www.pixelversestudios.io/
- https://www.pixelversestudios.io/services
- https://www.pixelversestudios.io/services/seo
- https://www.pixelversestudios.io/services/web-development
- https://www.pixelversestudios.io/areas/bergen-county
- https://www.pixelversestudios.io/areas/bergen-county/fort-lee
- https://www.pixelversestudios.io/areas/bergen-county/englewood
- https://www.pixelversestudios.io/areas/bergen-county/hackensack
- https://www.pixelversestudios.io/areas/bergen-county/paramus
- https://www.pixelversestudios.io/areas/bergen-county/ridgewood
- https://www.pixelversestudios.io/portfolio
- https://www.pixelversestudios.io/portfolio/360-degree-care
- https://www.pixelversestudios.io/about
- https://www.pixelversestudios.io/faq
- https://www.pixelversestudios.io/contact/details
- https://www.pixelversestudios.io/blog
- https://www.pixelversestudios.io/blog/choosing-web-design-company-new-jersey
- https://www.pixelversestudios.io/blog/wix-vs-wordpress-vs-custom-website

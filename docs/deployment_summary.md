# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary
- Removed 30 defunct city service page URLs from sitemap that were pointing to redirected pages
- Sitemap now only includes live pages (redirects already in place for old city URLs)

## Notes for internal team
- Removed `priorityCities` and `phase2Cities` imports from `app/sitemap.ts`
- City service pages (/services/[city], /services/seo/[city], /services/web-development/[city]) were already 301 redirecting but were still listed in sitemap
- Sitemap reduced from 51 URLs to 21 live URLs

## Changed URLs
- https://www.pixelversestudios.io/sitemap.xml

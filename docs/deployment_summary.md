# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary
- Fixed domain redirect rules to use www as the canonical domain (was incorrectly redirecting www to non-www)
- SEO crawlers and audit tools should now properly discover all site pages via sitemap

## Notes for internal team
- Flipped `_redirects` rules: non-www now 301s to www (previously was reversed)
- **ACTION NEEDED**: Verify in Netlify Domain Management that `www.pixelversestudios.io` is set as the primary domain — Netlify CDN-level redirects override `_redirects` file rules
- robots.txt and sitemap.xml already referenced www correctly

## Changed URLs
- https://www.pixelversestudios.io/sitemap.xml
- https://www.pixelversestudios.io/robots.txt

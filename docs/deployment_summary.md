# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary

- Fixed domain mismatch that was sending conflicting signals to Google — canonical URLs and sitemap now use the same www domain

## Notes for internal team

- DEV-493: Changed `siteUrl` in `lib/metadata.ts` from `https://pixelversestudios.io` to `https://www.pixelversestudios.io`
- This was the only non-www reference — sitemap, robots, and all hardcoded URLs already used www
- Impact: canonical tags, OG URLs, and Twitter card URLs now match sitemap/robots domain
- Part of SEO audit remediation (score dropped 81→64, this mismatch likely contributed to 103 not-indexed pages)

## Changed URLs

- https://www.pixelversestudios.io

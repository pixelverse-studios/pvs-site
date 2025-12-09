# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary
- **Excluded dashboard pages from SiteBehaviour tracking** - The internal `/dashboard` pages will no longer have session recordings or analytics captured, protecting sensitive admin functionality
- **Updated robots.txt** - Added `/dashboard/` to disallow list to prevent search engine indexing of internal pages
- **Added sticky headers to deployment cards** - When scrolling through long URL lists in the deployment history, the status badge, timestamp, and action buttons now stay visible at the top of each card

## Notes for internal team
- Created `lib/tracking-config.ts` with centralized `TRACKING_EXCLUDED_ROUTE_PREFIXES` array for easy future additions
- Created `components/sitebehaviour-script.tsx` client component that checks pathname before rendering tracking script
- Updated `lib/analytics.ts` to early-return on excluded routes for all tracking functions
- Updated `next-sitemap.config.js` to include `/dashboard/` in robots.txt disallow list
- Updated `deployment-card.tsx` with sticky header using CSS `sticky top-0 z-10`

## Changed URLs
- https://www.pixelversestudios.io/dashboard

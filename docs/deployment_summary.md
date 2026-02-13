# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary

- Added 5-star client rating badge to homepage hero section
- Refactored homepage to use centralized data architecture for easier content updates
- Simplified services section to 3 focused cards: Web Design & Development, Local SEO, and Ongoing Support
- Removed Bergen County-specific CTA from homepage services section

## Notes for internal team

- PVS-322: Refactored hero section to consume data from `/data/homepage.ts`
- Added Badge component with 5-star emoji display
- All homepage hero content now driven by centralized data structure
- PVS-323: Services section now consumes from centralized data file
- Changed grid from 2-column to 3-column layout
- Made service cards clickable with links to service pages
- Files modified: `/data/homepage.ts`, `/components/home/services-section.tsx`

## Changed URLs

- https://www.pixelversestudios.io/

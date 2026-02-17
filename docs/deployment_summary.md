# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary
- Created centralized data structure for the About page with all confirmed copy
- Added team bios (Sami & Phil) and placeholder client testimonials to data file
- Built reusable About page section components (narrative sections, testimonials, Google reviews)

## Notes for internal team
- PVS-375: Created `/data/about.ts` with TypeScript interfaces and all 6 narrative sections
- Team bios pulled from existing `components/about/team-section.tsx`
- 3 placeholder testimonials included — replace with real client quotes when available
- Google Reviews placeholder included — update with real GBP data
- PVS-376: Created 3 new components — `about-narrative-section.tsx`, `about-testimonials-section.tsx`, `about-google-reviews-section.tsx`
- Narrative section handles both `intro + bulletPoints + closing` and prose-only `body` patterns
- Google Reviews section auto-hides when reviewCount is 0

## Changed URLs
- https://www.pixelversestudios.io/about

# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary

- Added 5-star client rating badge to homepage hero section
- Refactored homepage to use centralized data architecture for easier content updates
- Simplified services section to 3 focused cards: Web Design & Development, Local SEO, and Ongoing Support
- Removed Bergen County-specific CTA from homepage services section
- Improved services section copy to emphasize custom code over templates
- Fixed Ongoing Support card to link to contact form instead of generic services page
- Added "Why We Exist" section to homepage with two-column narrative layout

## Notes for internal team

- PVS-322: Refactored hero section to consume data from `/data/homepage.ts`
- Added Badge component with 5-star emoji display
- All homepage hero content now driven by centralized data structure
- PVS-323: Services section now consumes from centralized data file
- Changed grid from 2-column to 3-column layout
- Made service cards clickable with links to service pages
- PR #81 review fixes: Updated Ongoing Support href, added defensive icon fallback, improved accessibility with aria-labels, fixed highlight key uniqueness
- Files modified: `/data/homepage.ts`, `/components/home/services-section.tsx`
- PVS-324: Built Why Section component with two-column responsive layout
- Left column displays eyebrow, heading, and description; right column shows problem points list
- Component follows centralized data pattern, consuming from `/data/homepage.ts`
- Implemented staggered animation delays for cascading reveal effect
- PR #82 review fixes: Fixed React key uniqueness, extracted animation constants, added aria-labelledby for screen readers
- Files created: `/components/home/why-section.tsx`

## Changed URLs

- https://www.pixelversestudios.io/

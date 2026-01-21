# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary

- Expanded add-ons section on packages page from 3 to 16 services
- Add-ons now organized by category: Development, SEO, and UX/UI
- Each add-on displays title, price, and description
- Added optional "Interested in" multi-select field to contact form
- Visitors can now select specific packages and add-ons they're interested in

## Notes for internal team

- PVS-226 completed
- Created `/data/addons.ts` with centralized add-on data
- Updated `/components/packages/addons-section.tsx` with category grouping
- Add-on IDs are standardized for future contact form integration (PVS-227)
- PVS-227 completed
- Created `/components/ui/multi-select.tsx` reusable component
- Created `/data/service-options.ts` for combined package/add-on options
- Updated ContactForm with `interestedIn` field (optional array)
- Backend needs to accept new `interestedIn: string[]` field

## Changed URLs

- https://www.pixelversestudios.io/packages
- https://www.pixelversestudios.io/contact

# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary

- Expanded add-ons section on packages page from 3 to 16 services
- Add-ons now organized by category: Development, SEO, and UX/UI
- Each add-on displays title, price, and description
- Added optional "Interested in" multi-select field to contact form
- Visitors can now select specific packages and add-ons they're interested in
- Added "Get Started" button to all website and SEO package cards
- Clicking "Get Started" takes visitors directly to contact form with package pre-selected
- "Learn More" button still opens the detail modal for full package information

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
- PVS-228 completed
- Added dual CTA buttons (Get Started + Learn More) to package cards
- Updated `/components/packages/website-packages-section.tsx` with Link to contact form
- Updated `/components/packages/seo-packages-section.tsx` with Link to contact form
- Updated `/components/contact/ContactForm.tsx` to read `?package=` URL param
- Wrapped ContactForm in Suspense boundary for static page generation

## Changed URLs

- https://www.pixelversestudios.io/packages
- https://www.pixelversestudios.io/contact

# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary
- Added Mixpanel analytics integration for marketing site pages
- Page views and contact form submissions are now tracked in Mixpanel

## Notes for internal team
- New files: `lib/mixpanel.ts`, `components/mixpanel-provider.tsx`
- Modified: `app/layout.tsx`, `components/contact/ContactForm.tsx`, `.env.example`
- Mixpanel only runs in production and excludes dashboard routes
- Requires `NEXT_PUBLIC_MIXPANEL_TOKEN` env variable

## Changed URLs
- https://www.pixelversestudios.io/
- https://www.pixelversestudios.io/contact

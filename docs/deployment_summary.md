# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary
- **Fixed contact page redirect loop issue** that was preventing users from accessing location-specific contact pages in production
- Removed problematic redirect rules that were causing infinite loops for contact pages with query parameters

## Notes for internal team
- Removed self-referencing redirect rule from next.config.js (lines 49-58) that was redirecting `/contact/:slug` to itself
- Removed corresponding catch-all redirect rule from public/_redirects (line 9)
- The issue was caused by a redirect rule that attempted to redirect `/contact/:slug?context=*` to `/contact/:slug` but created an infinite loop
- This only occurred in production because Netlify and Next.js handle the `_rsc` query parameter differently than localhost

## Changed URLs
- https://pixelversestudios.io/contact/bergen-county
- https://pixelversestudios.io/contact/fort-lee
- https://pixelversestudios.io/contact/cliffside-park
- https://pixelversestudios.io/contact/river-vale
- https://pixelversestudios.io/contact/hackensack
- https://pixelversestudios.io/contact/paramus
- https://pixelversestudios.io/contact/teaneck
- https://pixelversestudios.io/contact/fair-lawn
- https://pixelversestudios.io/contact/englewood
- https://pixelversestudios.io/contact/bergenfield
- https://pixelversestudios.io/contact/ridgewood

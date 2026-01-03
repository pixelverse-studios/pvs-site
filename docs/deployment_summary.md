# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary

- Added animated Google Review button to footer that expands on hover to reveal "Leave a Review" CTA
- Button matches existing social icons in default state but transforms to branded pill button on hover
- Mobile devices get direct link without expansion (no awkward tap-to-expand behavior)

## Notes for internal team

- PVS-177 completed
- Modified `components/ui/social-links.tsx` - separated Google link, added `GoogleReviewButton` component
- Uses staggered animation: container expands → icon color shifts → text slides in
- Review link uses direct Google writereview URL for better UX

## Changed URLs

- https://www.pixelversestudios.io/

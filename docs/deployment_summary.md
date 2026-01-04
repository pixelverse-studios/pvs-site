# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary

- Added animated Google Review button to footer that expands on hover to reveal "Leave a Review" CTA
- Button matches existing social icons in default state but transforms to branded pill button on hover
- Uses CSS-only animation (max-width technique) for smooth, hydration-safe expansion

## Notes for internal team

- PVS-177 completed
- Modified `components/ui/social-links.tsx` - added `GoogleGlyphIcon` SVG and `GoogleReviewButton` component
- Uses max-width technique instead of width transitions to avoid React hydration issues
- Icon has NO transition classes to prevent fade-on-load bug
- Review link uses direct Google writereview URL for better UX

## Changed URLs

- https://www.pixelversestudios.io/

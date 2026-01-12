# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary
- Improved Domani feedback table UX by moving expanded details inline within the table row instead of below the table

## Notes for internal team
- Modified `app/dashboard/domani/feedback/components/feedback-table.tsx`
- Expansion now uses Fragment wrapper to render detail row immediately after clicked row
- Added stopPropagation on action buttons to prevent accidental collapse

## Changed URLs
- https://www.pixelversestudios.io/dashboard/domani/feedback

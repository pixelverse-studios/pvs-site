# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary
- **Redesigned SEO Focus city cards** to show ALL target keywords (no more "+2 more" truncation)
- Keywords now display in a clean vertical list with full text visible
- Each keyword shows current position and target position with arrow indicator
- Keywords sorted by priority (high → medium → low) with color-coded left borders
- Red border = high priority, amber = medium, gray = low
- Removed SEO Focus from sidebar navigation (now accessed via client → website → SEO Focus)

## Notes for internal team
- City cards now use vertical stacked list pattern for keywords
- `getPriorityBorderColor()` helper added for left border color coding
- Keywords sorted automatically by priority level
- Removed debug console.log statements from seo-focus page

## Changed URLs
- https://www.pixelversestudios.io/dashboard/clients/[id]/websites/[websiteId]/seo-focus

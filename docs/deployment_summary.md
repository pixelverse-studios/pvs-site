# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary
- Added direct links to deployments from the dashboard activity feed
- Clicking a deployment now opens a dedicated detail page instead of navigating to clients list
- Deployment detail pages show full context: breadcrumbs, status, URLs, and indexing actions

## Notes for internal team
- PVS-116 completed
- New route: `/dashboard/deployments/[id]`
- Files created: `app/dashboard/deployments/[id]/page.tsx`, `types.ts`, `not-found.tsx`, `components/deployment-detail-view.tsx`
- Modified: `app/dashboard/page.tsx` (activity feed links)
- Backend API was updated to include website and client context in deployment response

## Changed URLs
- https://www.pixelversestudios.io/dashboard
- https://www.pixelversestudios.io/dashboard/deployments/[id]

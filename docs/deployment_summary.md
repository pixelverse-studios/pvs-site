# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary
- **Complete dashboard redesign** with a modern, professional aesthetic
- Added a new top header bar with breadcrumb navigation, user greeting, and logout button
- Redesigned sidebar with cleaner navigation, gradient active states, and smooth collapse animations
- New dashboard home page featuring KPI stat cards (Clients, Websites, Deployments, Pending Items)
- Added real-time activity feed showing recent deployments across all client websites
- New quick actions section with direct links to common tasks
- Recent clients list widget on the dashboard home page
- Refreshed styling across all dashboard pages (Clients, Docs, Client Detail, Website Detail)
- Consistent visual language with subtle glass effects, refined typography, and cohesive color accents
- Dashboard now pulls website and deployment data from the updated `/api/clients` endpoint

## Notes for internal team
- Created 7 new dashboard components: `StatCard`, `DashboardHeader`, `DashboardShell`, `ActivityFeed`, `QuickActionButton`, `ClientListItem`, `DashboardCard`
- Updated dashboard to use new enriched `/api/clients` response (includes `websites`, `recent_deployments`, `deployment_count_30d`)
- Removed multiple API calls - now uses single endpoint for all dashboard data
- Updated Client interface to match new schema: `client_id`, `client_email`, `client_active`, `website_count`, etc.
- Layout uses a shell component pattern for consistent header across all pages
- Sidebar now stretches full height and has a cleaner, more minimal design
- All pages updated to use consistent `pt-6 lg:pt-8` padding for proper spacing with the header

## Changed URLs
- https://www.pixelversestudios.io/dashboard
- https://www.pixelversestudios.io/dashboard/clients
- https://www.pixelversestudios.io/dashboard/docs

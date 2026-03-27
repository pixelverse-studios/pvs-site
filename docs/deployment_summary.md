# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary

- Redesigned the internal dashboard with clickable stat widgets linking to dedicated Clients, Websites, Deployments, and SEO Health pages
- Added a new Websites overview page listing all managed websites across all clients with search, filters, and sortable columns
- Added a new Deployments overview page showing all recent deployments with indexing status filters
- Added a new SEO Health overview page with summary stats, multi-select filters (by project status and audit state), and per-website health metrics
- Added per-website SEO detail pages accessible from the SEO Health table — shows audit summary, keyword rankings, checklist progress, audit history, competitors, changelog, and score trend
- SEO detail page uses a hub layout with preview cards and slide-out drawers for full data views
- Checklist categories are expandable to show individual item-level pass/fail status
- Keyword tables show target URLs and competitor tables show overlapping keyword pills
- Changelog timelines show what changed, when, and whether the impact was positive or negative
- Added SEO Health, Websites, and Deployments links to the dashboard sidebar navigation
- Dashboard stat cards are now clickable and link to their respective overview pages
- Updated the /audit-seo skill to submit audit results to the database API after each audit

## Notes for internal team

- Epic DEV-595 completed: Dashboard redesign with SEO health integration
- Tickets completed: DEV-598 through DEV-612 (13 tickets total)
- New API client: lib/api/seo.ts with types and fetch functions for all SEO endpoints
- New pages: /dashboard/websites, /dashboard/deployments, /dashboard/seo, /dashboard/seo/[websiteId]
- StatCard component now supports href prop for Link-based navigation
- SEO data stored in database (seo_audits, seo_keywords, seo_competitors tables) — no longer parsed from markdown frontmatter
- SEO drawer uses React portal (createPortal) to escape dashboard stacking contexts
- All dashboard pages have robots: { index: false, follow: false }

## Changed URLs

- https://www.pixelversestudios.io/
- https://www.pixelversestudios.io/services
- https://www.pixelversestudios.io/services/web-development
- https://www.pixelversestudios.io/services/seo
- https://www.pixelversestudios.io/portfolio
- https://www.pixelversestudios.io/portfolio/jones-pressure-washing
- https://www.pixelversestudios.io/portfolio/360-degree-care
- https://www.pixelversestudios.io/portfolio/domani
- https://www.pixelversestudios.io/about
- https://www.pixelversestudios.io/contact
- https://www.pixelversestudios.io/faq
- https://www.pixelversestudios.io/blog
- https://www.pixelversestudios.io/sitemap.xml
- https://www.pixelversestudios.io/dashboard
- https://www.pixelversestudios.io/dashboard/websites
- https://www.pixelversestudios.io/dashboard/deployments
- https://www.pixelversestudios.io/dashboard/seo

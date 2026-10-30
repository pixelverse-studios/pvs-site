# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary
- Added a staff-only Domani Users workspace with account statistics, filtering, sorting, configurable columns, and detailed user activity views.
- Connected user records to their exact feedback history so staff can investigate customer issues without relying on email matching.
- Added responsive feedback conversation history, reply composition, delivery status, reconciliation, incoming reply visibility, and per-staff unread state.
- Standardized Domani filters, pagination, drawers, and responsive table behavior for clearer day-to-day dashboard use.
- Updated website and SEO pricing to the new rates: website packages now start at $1,000 and recurring local SEO starts at $275/mo.
- Renamed packages by what clients get (Starter, Small Business and Custom Growth Websites; Local SEO for 1, up to 3 and up to 5 locations), with page counts, care plans and clear monthly deliverables on each card.
- Updated prepay billing to 5% off quarterly and 2 months free on annual plans, and added a note about the one-time $800 SEO Strategy Setup.
- Refreshed pricing answers in the FAQs, service area pages and website cost blog posts to match the new packages.

## Notes for internal team
- DEV-1393 through DEV-1402: Added durable feedback conversation, outbound delivery, inbound reply, reconciliation, and unread-state UI support.
- DEV-1404 through DEV-1411: Added protected Domani user insights, exact user-scoped feedback, responsive account detail, shared controls, and rollout QA coverage.
- Deploy the API and dashboard as a coordinated release. Keep outbound sending and inbound receiving flags disabled until the Resend webhook, sender, and receiving-domain setup is verified.
- Domani items above went live on 2026-10-13 (#260 was merged on GitHub, so this summary was never sent).
- Pricing update (PR #262): all prices live in data/package-pricing.ts; billing totals are pinned to the QuickBooks price sheet by data/package-pricing.test.ts.
- Package CTA tracking labels changed (e.g. "Website package pricing: Basic" is now "...: Starter Website"); annotate GA4 on the deploy date.

## Changed URLs
- https://www.pixelversestudios.io/
- https://www.pixelversestudios.io/services
- https://www.pixelversestudios.io/services/seo
- https://www.pixelversestudios.io/services/web-development
- https://www.pixelversestudios.io/areas/bergen-county
- https://www.pixelversestudios.io/areas/bergen-county/englewood
- https://www.pixelversestudios.io/areas/bergen-county/fort-lee
- https://www.pixelversestudios.io/areas/bergen-county/hackensack
- https://www.pixelversestudios.io/areas/bergen-county/paramus
- https://www.pixelversestudios.io/areas/bergen-county/ridgewood
- https://www.pixelversestudios.io/faq
- https://www.pixelversestudios.io/blog/custom-development-vs-website-builders
- https://www.pixelversestudios.io/blog/how-much-does-a-website-cost-new-jersey
- https://www.pixelversestudios.io/dashboard/domani/campaigns
- https://www.pixelversestudios.io/dashboard/domani/feedback
- https://www.pixelversestudios.io/dashboard/domani/users

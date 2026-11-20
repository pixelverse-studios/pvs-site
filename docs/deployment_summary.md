# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary
- Added a staff-only Domani Users workspace with account statistics, filtering, sorting, configurable columns, and detailed user activity views.
- Connected user records to their exact feedback history so staff can investigate customer issues without relying on email matching.
- Added responsive feedback conversation history, reply composition, delivery status, reconciliation, incoming reply visibility, and per-staff unread state.
- Standardized Domani filters, pagination, drawers, and responsive table behavior for clearer day-to-day dashboard use.

## Notes for internal team
- DEV-1393 through DEV-1402: Added durable feedback conversation, outbound delivery, inbound reply, reconciliation, and unread-state UI support.
- DEV-1404 through DEV-1411: Added protected Domani user insights, exact user-scoped feedback, responsive account detail, shared controls, and rollout QA coverage.
- Deploy the API and dashboard as a coordinated release. Keep outbound sending and inbound receiving flags disabled until the Resend webhook, sender, and receiving-domain setup is verified.
- Added ad spend site plan (docs/planning/ad-spend-site-plan.md) and a status note to the GA4/GTM attribution plan marking account-creation steps as already done (docs only, no site changes).
- Audited the public site against the Direction A plan (website plans with built-in tools); findings and change list written to a shared Claude Doc ("Direction A: Website Changes"). No site or repo code changes.
- Saved the five must-fix-before-ads items from the Direction A audit to docs/planning/direction-a-must-fix.md and linked it from the ad spend plan (docs only, no site changes).
- Worked up the SEO route as an alternative to Direction A: plan and example-lead tabs in the shared Friday doc, plus a site audit in a new shared Claude Doc ("SEO Route: Website Changes"); cross-linked all Direction A and SEO route docs. No site or repo code changes.
- Saved a direction meeting prep pack to docs/planning/direction-meeting-2026-11-20/: markdown snapshots of the Friday doc tabs and both website-change audits, plus a README recap (docs only, no site changes).

## Changed URLs
- https://www.pixelversestudios.io/dashboard/domani/users
- https://www.pixelversestudios.io/dashboard/domani/feedback
- https://www.pixelversestudios.io/dashboard/domani/campaigns

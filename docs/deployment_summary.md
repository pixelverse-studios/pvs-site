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

## Changed URLs
- https://www.pixelversestudios.io/dashboard/domani/users
- https://www.pixelversestudios.io/dashboard/domani/feedback
- https://www.pixelversestudios.io/dashboard/domani/campaigns

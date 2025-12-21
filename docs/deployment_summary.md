# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary

- Added configurable promotional sale banner system for marketing campaigns
- Sale banner displays at top of page with countdown timer, discount info, and CTA
- Package cards now show sale badges and discounted pricing when sale is active
- Sales can be toggled on/off via config file without code changes
- Supports multiple sale types: holiday, flash, seasonal, launch, anniversary, referral
- Fixed navbar responsive layout to prevent items bleeding outside container on tablet viewports
- Improved services page button text to show shorter version on mobile screens
- Agenda kanban board now supports full CRUD operations (create, edit, delete items)
- Drag-and-drop reordering between Pending, In Progress, and Completed columns
- Status changes happen automatically when dragging items between columns

## Notes for internal team

- PVS-153: Added CRUD operations and drag-and-drop to Agenda
- New components: `components/dashboard/agenda/agenda-item-modal.tsx`, `delete-agenda-dialog.tsx`
- Updated: `app/dashboard/agenda/components/agenda-page-client.tsx`, `agenda-board.tsx`, `agenda-card.tsx`
- Installed `@hello-pangea/dnd` for drag-and-drop functionality
- PVS-152: Created full Agenda page with kanban board at /dashboard/agenda
- New files: `app/dashboard/agenda/page.tsx`, `agenda-board.tsx`, `agenda-card.tsx`
- Added Agenda to sidebar navigation
- PVS-151: Added Focus/Agenda widget to dashboard homepage
- New component: `components/dashboard/agenda-widget.tsx`
- Modified: `app/dashboard/page.tsx` to use agenda API and widget
- PVS-150: Added agenda types and API client functions for dashboard agenda feature
- New files: `lib/types/agenda.ts`, `lib/api/agenda.ts`
- PVS-135: Sale banner feature
- Config file: `/data/sales-config.ts` - edit `active: true/false` to toggle
- New components in `/components/sale/`: SaleBanner, SaleBadge, CountdownTimer, DiscountedPrice
- CSS variables added: `--pv-sale`, `--pv-sale-dark`, `--pv-sale-glow`, `--pv-gold`, `--pv-gold-dark`, `--pv-gold-glow`
- Current sale configured: Holiday 2025 (15% off) ending Jan 5, 2026
- Navbar breakpoint raised from `md` (768px) to `lg` (1024px) to prevent overflow
- Fixed empty copy-button.tsx that was causing build failures

## Changed URLs

- https://www.pixelversestudios.io/
- https://www.pixelversestudios.io/services
- https://www.pixelversestudios.io/packages

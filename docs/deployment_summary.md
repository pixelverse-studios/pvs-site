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
- **Enhanced sale system to discount monthly charges** with configurable duration (e.g., "first 3 months")
- **Increased holiday sale discount from 15% to 20%** and applied to all packages
- **Redesigned Website packages layout** to 3+1 split (3 main tiers + Enterprise CTA)
- **Added "Most Popular" badges** to Core Starter and SEO Growth packages
- **Updated sale badge** to show "20% OFF" instead of generic "SALE"
- Agenda kanban board now supports full CRUD operations (create, edit, delete items)
- Drag-and-drop reordering between Pending, In Progress, and Completed columns
- Status changes happen automatically when dragging items between columns
- Agenda cards now show inline action buttons on hover for faster status changes, editing, and deletion

## Notes for internal team

- PVS-156: Replaced ellipsis dropdown menu with inline action buttons on agenda cards
- Status buttons (Pending, In Progress, Completed) + Edit + Delete now appear on hover/focus
- Added accessibility: `aria-label`, `role="group"`, keyboard focus support
- Updated: `app/dashboard/agenda/components/agenda-card.tsx`
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
- Sale config now supports `discountMonthly` and `monthlyDiscountDuration` fields
- Holiday 2025 sale updated: 20% off all packages, monthly discount for first 3 months
- Website packages section redesigned with 3-column main grid + full-width Enterprise CTA
- Files modified: `data/sales-config.ts`, `components/sale/DiscountedPrice.tsx`, `components/packages/website-packages-section.tsx`, `components/packages/seo-packages-section.tsx`

## Changed URLs

- https://www.pixelversestudios.io/
- https://www.pixelversestudios.io/services
- https://www.pixelversestudios.io/packages

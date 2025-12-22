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

## Notes for internal team
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

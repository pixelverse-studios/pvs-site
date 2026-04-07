# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary

- Updated 360 Degree Care case study to reflect completed engagement — narrative now uses past tense
- Removed client testimonial from 360 Degree Care case study (no longer verifiable)
- Case study now links to demo site instead of former live site
- Portfolio listing and detail pages gracefully handle demo vs live site links
- Updated the homepage hero headline to "Web Design, Development & SEO" with "Built for growing New Jersey businesses" as a supporting line beneath it. This puts SEO front and center in the page's main heading and helps the homepage rank for SEO-related searches in addition to web design.

## Notes for internal team

- Added `demoUrl` field to CaseStudy type for portfolio pieces that are no longer active client sites
- Made `url` field optional on CaseStudy type
- 360 Degree Care demo site: https://haven-home-healthcare.netlify.app/
- DEV-675: split the homepage hero into a primary `<h1>` (`Web Design, Development & SEO`) and a new `<h2>` tagline (`Built for growing New Jersey businesses`). Added a `tagline` field to the `HomepageHero` interface, the raw data in `data/homepage.ts`, and the Zod validator in `lib/validation/homepage.ts`. Hero section renders the h2 inside the same `hero-enter` animation wrapper as the h1, with `text-xl sm:text-2xl text-[var(--pv-text-muted)]` typography so it reads as supporting text without competing with the gradient h1. Only consumer was the hero section itself (verified via grep) — no other components needed updating.

## Changed URLs

- https://www.pixelversestudios.io/
- https://pixelversestudios.io/portfolio
- https://pixelversestudios.io/portfolio/360-degree-care

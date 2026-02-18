# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary
- Added centralized data file for the redesigned services overview page with two clear service paths: Web Design & Development and Local Website Optimization & SEO
- Built the hero section for the new services overview page with narrative-focused intro copy
- Built the service path cards section — two cards showcasing Web Design & Development and Local SEO with hover effects and navigation links
- Updated navigation bar — Services dropdown now shows the two new service paths instead of the previous three entries
- Refined desktop navigation hover effects with brand-tinted glow, subtle lift animation, and polished active states
- Built the clarification CTA section for the services page with dual action buttons for visitors unsure which service path to choose
- Launched the fully redesigned Services page with the new hero, service path cards, and clarification CTA sections
- Polished the services page hero text layout and tightened the section width for better readability
- Redesigned the clarification CTA section with a dark accent treatment to visually distinguish it from the section above
- Removed a redundant legacy CTA section from the bottom of the services page that was not part of the redesigned copy
- Added centralized content data file for the Web Design & Development service page with all 7 confirmed sections

## Notes for internal team
- PVS-352: Created `/data/service-paths.ts` with TypeScript interfaces and confirmed copy
- PVS-353: Created `components/services/services-hero-section.tsx` — data-driven, props-based component
- PVS-354: Created `components/services/services-path-cards-section.tsx` — 2-card grid with icon accent, gradient hover, and CTA links
- PVS-354: Updated `app/layout.tsx` nav items and `components/ui/navbar.tsx` icon map — removed UX/UI Design entry, renamed to match new service paths
- PVS-354: Redesigned navbar hover — brand-primary text, `rgba(63,0,233,0.06)` bg tint, focused purple underglow, `-translate-y-[1px]` lift, removed `::after` scale effect
- PVS-355: Created `components/services/services-clarification-cta-section.tsx` — props-based dual-CTA with `variant="cta"` + `variant="ctaGhost"` buttons, bordered card layout
- PVS-356: Updated `app/services/page.tsx` — replaced 4 old sections with ServicesHeroSection, ServicesPathCardsSection, ServicesClarificationCtaSection; updated metadata title, description, and keywords
- PVS-357: Visual QA pass — narrowed hero container to max-w-2xl, added text-pretty to paragraphs, redesigned ClarificationCTA with dark inversion + theme-responsive colors, removed ServicesClosingCtaSection (legacy, not in redesign copy)
- PVS-360: Created `/data/web-development-content.ts` — TypeScript interfaces + all 7 sections (hero, whenNewWebsite, whyBuildsGoWrong, howWePlan, designAndDevelopment, whatToExpect, finalCta) with confirmed copy

## Changed URLs
- https://www.pixelversestudios.io/services
- https://www.pixelversestudios.io/services/web-development

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
- Built the ServiceNarrativeSection component for individual service pages with three layout variants: text-only, text-with-bullets, and two-column
- Built the ServiceBulletList component for rich bullet items with icons, titles, and descriptions rendered as hoverable cards
- Built the ServiceExpectations component for displaying expectation cards in a 2x2 grid with section header, optional icons, and subtle hover effects
- Launched the redesigned Web Design & Development service page — seven narrative sections walking visitors through when a new website makes sense, why builds go wrong, how planning works, and what to expect from the process
- Tightened the Web Design & Development page meta description to under 160 characters for better search result display
- Added centralized content data file for the Local Website Optimization & SEO service page with all 7 confirmed sections
- Launched the redesigned Local Website Optimization & SEO service page — seven narrative sections walking visitors through why local SEO matters, how performance is evaluated, and when optimization is the right move versus a full rebuild
- Fixed the SEO service page hero section to display the full two-paragraph description as intended in the copy
- Updated the mobile navigation so sub-services under the Services section are always visible — no longer requires a tap to expand
- Fixed the Web Design & Development service page hero to display the full two-paragraph description
- Improved keyboard accessibility on service page cross-links — focus indicators now visible for keyboard users
- Cleaned up internal navigation code and removed unused state left over from a previous refactor

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
- PVS-361: Created `components/services/individual/service-narrative-section.tsx` — reusable narrative section with `text-only`, `text-with-bullets`, `two-column` layouts; supports eyebrow badge, heading, intro, bullets, closing, background variant props
- PVS-362: Created `components/services/individual/service-bullet-list.tsx` — Card-based bullet list with optional Lucide icon, gradient circle icon bg, hover lift + glow; exports `BulletPoint` and `ServiceBulletListProps` types; supports `grid` and `vertical` layouts
- PVS-363: Created `components/services/individual/service-expectations.tsx` — 2x2 grid of expectation cards with SectionHeader, optional gradient icon circles, subtle hover border + glow; exports `ServiceExpectationItem` and `ServiceExpectationsProps` types
- PVS-364: Confirmed `ServiceHero` already supports custom CTA labels — no hardcoded text; added JSDoc examples for conversational tone usage ("Start the Conversation", "See How It Works"); exported `CtaLink` type and eliminated duplicate declaration in `service-cta.tsx`
- PVS-365: Updated `app/services/web-development/page.tsx` — replaced old feature-list approach with 7 narrative sections using `ServiceHero`, `ServiceNarrativeSection` (3 layout variants across sections), and `ServiceCta`; content fully data-driven from `web-development-content.ts`; alternating surface/bg backgrounds; cross-link to SEO page in "When" section; updated metadata title, description, and keywords
- PVS-366: Shortened meta description from 169 → 138 chars; confirmed: one H1 (ServiceHero), H2 per section (ServiceNarrativeSection/ServiceCta), `aria-labelledby` on all `<section>` elements, cross-link to `/services/seo` with descriptive anchor text
- PVS-369: Created `/data/seo-content.ts` — `SeoContentData` interface + all 7 sections with confirmed copy; `bulletPoints: string[]` (matches `ServiceNarrativeSection`); `crossLink: CTA` (reuses shared type); exports `SeoContentData` only
- PVS-370: Verified `ServiceNarrativeSection` supports all SEO section layouts without modification; confirmed `ServiceBulletList` is not needed for SEO page (plain string bullets → use `text-with-bullets` layout on `ServiceNarrativeSection`); confirmed `ServiceHero` supports "Discuss Your Situation" CTA; added comprehensive JSDoc with SEO page usage examples to both components
- PVS-371: Replaced `app/services/seo/page.tsx` (501-line feature-list) with 7-section narrative page using `ServiceHero`, `ServiceNarrativeSection` (`text-only` × 2, `text-with-bullets` × 3), and `ServiceCta`; all content data-driven from `seo-content.ts`; cross-link to `/services/web-development` in "When Optimization Is Right" section; updated metadata title, description (144 chars), and keywords; updated service schema description to match narrative positioning
- PVS-372: Updated `ServiceHero` to split `description` on `\n\n` and render each paragraph as its own `<p>` with `space-y-4` — removed `.split('\n\n')[0]` from `app/services/seo/page.tsx`; updated `components/ui/navbar.tsx` to remove collapse toggle for mobile nav items with children — submenu now always visible without chevron interaction
- PVS-372 post-review: Removed dead code from `navbar.tsx` (`expandedMobileItem` state, `toggleMobileExpand` fn, `isExpanded` var); removed unused `closingBgClass` from `text-with-bullets-alt` branch and hoisted it to component scope in `service-narrative-section.tsx`; fixed web-dev hero description truncation; added `aria-hidden` to decorative `→` arrows and `focus-visible` ring classes to cross-links on both service pages; updated JSDoc to reflect four layout variants
- PVS-372 a11y pass: Added `role="group"` and `aria-label` to mobile Services submenu so screen readers understand the parent–child relationship; added `aria-haspopup` to parent nav items with children; removed leftover flex wrapper div from mobile nav; added `aria-hidden` to eyebrow badge spans (letter-spaced uppercase causes VoiceOver to spell-read); exported `Layout` and `Background` types from the service-narrative-section barrel; added `aria-labelledby` to `ServiceCta` section element; extracted shared eyebrow and heading classNames as reusable consts

## Changed URLs
- https://www.pixelversestudios.io/services
- https://www.pixelversestudios.io/services/web-development
- https://www.pixelversestudios.io/services/seo

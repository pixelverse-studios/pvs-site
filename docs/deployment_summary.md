# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary

- Added 5-star client rating badge to homepage hero section
- Refactored homepage to use centralized data architecture for easier content updates
- Simplified services section to 3 focused cards: Web Design & Development, Local SEO, and Ongoing Support
- Removed Bergen County-specific CTA from homepage services section
- Improved services section copy to emphasize custom code over templates
- Fixed Ongoing Support card to link to contact form instead of generic services page
- Added "Why We Exist" section to homepage with two-column narrative layout
- Added case study section showcasing client success with 3-column issue grid
- Added process timeline section with horizontal layout and numbered steps
- Added client testimonial carousel with scroll-snap navigation and keyboard controls
- Refactored final CTA section with conversation-focused messaging instead of generic sales language
- Integrated all new homepage sections into complete redesigned homepage
- Updated homepage metadata with "Intentional Web Design & Development" positioning
- Updated hero section copy with new badge, dual-paragraph subheadline, and CTA labels
- Added two alternative hero section designs with a toggle widget to preview all three
- Redesigned case study section with clearer visual hierarchy, eyebrow label, and outcome metrics
- Case study section now supports multiple clients with tabbed navigation
- Added 360 Degree Care as second case study (placeholder data pending backfill)
- Redesigned case study selector with elegant sidebar navigation and industry icons
- Replaced "Why We Exist" section with new "Why Businesses Come to Us" narrative copy
- Added new insight section explaining how website problems are interconnected
- Insight section features interactive scroll-triggered reveal animations
- Created two alternative insight section layouts with a preview toggle widget
- Fixed Sentry build deprecation warnings

## Notes for internal team

- PVS-322: Refactored hero section to consume data from `/data/homepage.ts`
- Added Badge component with 5-star emoji display
- All homepage hero content now driven by centralized data structure
- PVS-323: Services section now consumes from centralized data file
- Changed grid from 2-column to 3-column layout
- Made service cards clickable with links to service pages
- PR #81 review fixes: Updated Ongoing Support href, added defensive icon fallback, improved accessibility with aria-labels, fixed highlight key uniqueness
- Files modified: `/data/homepage.ts`, `/components/home/services-section.tsx`
- PVS-324: Built Why Section component with two-column responsive layout
- Left column displays eyebrow, heading, and description; right column shows problem points list
- Component follows centralized data pattern, consuming from `/data/homepage.ts`
- Implemented staggered animation delays for cascading reveal effect
- PR #82 review fixes: Fixed React key uniqueness, extracted animation constants, added aria-labelledby for screen readers
- Files created: `/components/home/why-section.tsx`
- PVS-325: Built Case Study Section component with client badge and 3-column issue grid
- Features client info badge, emphasized problem statement, and responsive grid layout
- Issue cards include Lucide icons (AlertCircle, Zap, FileText) with hover effects
- Extended CaseStudy interface to support icon strings for each issue
- PR #83 review fixes: Extracted animation constants, simplified icon lookup, added aria-labelledby, content-based React keys
- Files created: `/components/home/case-study-section.tsx`
- PVS-326: Built Process Section component with numbered timeline steps
- Horizontal layout on desktop with gradient connecting lines between steps
- Vertical stack on mobile, responsive design with hover effects
- 4 process steps with numbered badges (01-04) and gradient styling
- Files created: `/components/home/process-section.tsx`
- PVS-327: Built Testimonial Carousel component with native CSS scroll-snap
- Horizontal carousel with navigation dots, keyboard controls (left/right arrows), and Intersection Observer sync
- Testimonial cards match design from service-testimonial.tsx without stat component
- 3 testimonials from homepage data: 360 Degree Care, Jones Pressure Washing, Domani Consulting
- Mobile: full-width cards, Desktop: 80% width with peek effect for next card
- Files created: `/components/home/testimonial-carousel.tsx`
- PVS-328: Refactored closing CTA to final CTA section with updated messaging
- Renamed component: ClosingCtaSection → FinalCtaSection
- New heading: "Let's talk about what you actually need."
- New description emphasizes no-pressure conversation approach
- Updated CTA button text: "Book a Free Call" (previously "Contact Us to Start Your Project")
- Removed social links section (duplicated footer content)
- Files: Renamed `/components/home/closing-cta-section.tsx` to `/components/home/final-cta-section.tsx`, updated `/app/page.tsx` imports
- PVS-329: Integrated all homepage sections into complete redesign
- Final section order: HeroSection, WhySection, CaseStudySection, ProcessSection, TestimonialCarousel, ServicesSection, FinalCtaSection
- Removed old sections: ValueSection, PackagesSection
- Updated page metadata with new brand positioning: "Intentional Web Design & Development"
- New description emphasizes custom websites with purpose, no templates
- Updated keywords to focus on: intentional web design, conversion-focused, user journey mapping, performance-first
- Homepage bundle size: 4.76 kB (223 kB First Load JS)
- Files modified: `/app/page.tsx` (imports, section order, metadata)
- PVS-329 continued: Hero copy updates, variant designs, case study redesign
- Changed `HomepageHero.subheadline` type from `string` to `string[]` for multi-paragraph support
- Updated Zod validation schema to match new subheadline array type
- Created `/components/home/hero-variant-b.tsx` (editorial split layout with dot pattern, grain overlay)
- Created `/components/home/hero-variant-c.tsx` (dark immersive aurora with gradient orbs)
- Created `/components/home/hero-switcher.tsx` (toggle widget for A/B/C hero comparison)
- Added premium CSS effects to globals.css: shimmer, glow-pulse, grain overlay, aurora layers, dot pattern, badge shimmer
- Added shimmer keyframe to tailwind.config.js
- Redesigned case study section: added eyebrow, surfaced title/outcome data, icon bubbles for client metadata
- Converted case study from single to array with tabbed UI (ARIA-compliant tablist)
- Added 360 Degree Care case study with TODO placeholder data in `/data/homepage.ts`
- Redesigned case study selector with vertical sidebar cards, gradient left border, and industry icons
- Replaced "Why We Exist" section with new "Why Businesses Come to Us" narrative copy
- Added new "Most Website Problems Aren't Isolated" insight section with 6 interactive narrative beats
- Insight section uses scroll-triggered reveal animations with gradient color progression
- Created two alternative insight section layouts (split sticky heading + numbered card grid) with toggle widget
- Fixed Sentry Next.js deprecation warnings for improved build compatibility
- Consolidated hero and insight toggle widgets into a single unified variant panel
- Updated Hero Variant C to properly support light and dark themes
- Upgraded testimonial carousel with premium styling: gradient accents, quote icons, initials avatars
- Testimonial carousel now shows multiple cards per view with scroll navigation
- Added 6 placeholder testimonials (9 total) for fuller carousel experience
- Updated services section copy to match final brand messaging
- Redesigned final CTA section with premium open layout and gradient background wash

## Notes for internal team

- PVS-329 continued: Case study section rewritten to use sidebar variant (Option C) with `layoutId` sliding gradient border
- Extracted shared case study content into `/components/home/case-study-content.tsx`
- Deleted variant files: `case-study-variant-a.tsx`, `case-study-variant-b.tsx`, `case-study-variant-c.tsx`, `case-study-switcher.tsx`
- Why Section rewritten: removed eyebrow/description/problemPoints, added paragraphs[]/cta to data interface
- New copy provided by user for why section, centered editorial layout with ghost pill CTA
- Insight section added between CaseStudySection and ProcessSection
- Insight data structured as labeled beats: Scenario, Surface, Problem, Impact, Pattern, Our Approach
- Created `/components/home/insight-section-variant-b.tsx` (split sticky heading layout)
- Created `/components/home/insight-section-variant-c.tsx` (numbered card grid)
- Created `/components/home/insight-switcher.tsx` (A/B/C toggle widget)
- Sentry fix: renamed `sentry.client.config.ts` → `instrumentation-client.ts`, added `onRouterTransitionStart` export
- Replaced deprecated `disableLogger: true` with `webpack: { treeshake: { removeDebugLogging: true } }` in next.config.js
- Created `/components/home/variant-panel.tsx` — unified panel with React Context for all variant toggles
- Created `/components/home/homepage-client.tsx` — client wrapper providing variant context
- Simplified `hero-switcher.tsx` and `insight-switcher.tsx` to consume from shared context
- Hero Variant C: replaced hardcoded dark colors with CSS variables, added `.dark .aurora-layer` opacity overrides
- Aurora animation timings slowed slightly (24s/30s/34s) for premium feel
- Testimonial carousel rewritten: scroll-by-card navigation, responsive widths (85%/46%/33%), desktop arrows in header
- Added 6 placeholder testimonials to `data/homepage.ts` (total 9)
- Services section: removed `highlights` from Service interface, simplified card layout with gradient icons
- Final CTA section: removed bordered card, added radial gradient glow wash, btn-shimmer CTA with ArrowRight
- Updated `finalCta` data: heading "Let's Talk It Through", CTA "Start the Conversation"
- Deleted all subagent-generated docs from `docs/design/` directory

## Changed URLs

- https://www.pixelversestudios.io/

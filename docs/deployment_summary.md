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

## Changed URLs

- https://www.pixelversestudios.io/

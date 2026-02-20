# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary

- Removed the "Packages" link from the website navigation (desktop and mobile)
- Removed the "Have you looked at the Packages page?" question from the contact form
- Updated `/pricing` and `/packages` redirects to send visitors to the Contact page
- Replaced all 9 FAQ entries with 15 new questions and answers aligned to our actual services and approach, grouped into 4 categories
- Redesigned FAQ page layout to show questions grouped by topic (General, Web Design, SEO, Working With Us)
- Updated FAQ page intro and closing call-to-action copy to match our consultative, conversation-first positioning
- Updated FAQ page title, meta description, and search keywords to reflect the broader question set
- Removed the UX/UI Design service from the website (page, city pages, and all navigation references)
- Removed UX/UI Design entry from city-level structured data schema (lib/structured-data.ts)
- Added FAQ section to the homepage with 6 common questions for top-of-funnel visitors evaluating PixelVerse
- Added FAQ sections to the Web Design & Development and SEO service pages with service-specific questions
- Centralized all case study data (Jones Pressure Washing, 360 Degree Care, Domani) into a single data file so adding a new case study only requires one entry
- Redesigned the portfolio page to show case studies as stacked editorial panels with alternating image placement, problem context, and outcome metrics instead of a generic card grid
- Updated portfolio page intro headline and description to match the consultative, results-focused positioning
- Updated portfolio page closing call-to-action to use "Start the Conversation" language consistent with the rest of the site

## Notes for internal team

- PVS-386, PVS-387, PVS-388 completed (epic PVS-385)
- PVS-390, PVS-391, PVS-392, PVS-393, PVS-394, PVS-395 completed (epic PVS-389)
- PVS-397 completed: data/case-studies.ts created, homepage.ts and project-showcase-section.tsx migrated to consume from it
- PVS-398 completed: portfolio index redesigned with editorial case study panels, intro/CTA copy refreshed, unused trust-section.tsx removed
- Files: components/ui/navbar.tsx, components/contact/ContactForm.tsx, next.config.js, data/faq-content.ts, components/faq/faq-list-section.tsx, components/faq/faq-intro-section.tsx, components/faq/faq-closing-cta.tsx, app/faq/page.tsx, data/local-service-pages.ts, data/about.ts, components/services/services-core-section.tsx, app/services/ux-ui-design/ (deleted), data/homepage-faq.ts, components/home/home-faq-section.tsx, app/page.tsx, data/web-development-content.ts, data/seo-content.ts, app/services/web-development/page.tsx, app/services/seo/page.tsx, components/portfolio/project-showcase-section.tsx, components/portfolio/portfolio-intro-section.tsx, components/portfolio/portfolio-closing-cta.tsx, components/portfolio/trust-section.tsx (deleted), app/portfolio/page.tsx

## Changed URLs

- https://www.pixelversestudios.io/contact
- https://www.pixelversestudios.io/packages
- https://www.pixelversestudios.io/pricing
- https://www.pixelversestudios.io/faq
- https://www.pixelversestudios.io/services
- https://www.pixelversestudios.io/services/ux-ui-design
- https://www.pixelversestudios.io/services/ux-ui-design/fort-lee
- https://www.pixelversestudios.io/services/ux-ui-design/englewood
- https://www.pixelversestudios.io/about
- https://www.pixelversestudios.io/
- https://www.pixelversestudios.io/services/web-development
- https://www.pixelversestudios.io/services/seo
- https://www.pixelversestudios.io/portfolio

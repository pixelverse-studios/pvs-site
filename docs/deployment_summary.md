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
- Added individual case study pages for each project, accessible from the portfolio at /portfolio/jones-pressure-washing, /portfolio/360-degree-care, and /portfolio/domani
- Redesigned individual case study pages with a more refined, editorial layout: two-column hero with the client outcome metric as a prominent sidebar card, numbered narrative sections (01 / The Challenge, 02 / Our Approach), and challenge/resolution rows replacing the generic card grid
- Softened the brand accent color in dark mode so it reads clearly against dark backgrounds (was very dark/saturated, now a brighter blue-purple)
- Added accent color selector to the dark theme widget — choose from Electric (vivid), Soft (balanced), or Muted (gentle lavender) to control how prominent the purple accent appears across the site
- Added minimize/expand toggle to the dark theme picker widget — collapses to a small gradient pill when not in use
- Redesigned individual case study page narrative section with three switchable layout options (Beside, Spread, Layered) for evaluating the best image placement approach
- Fixed case study pages to show the client screenshot (instead of the company logo) when shared on social media
- Fixed keyboard accessibility on the dark theme picker and layout widgets — focus indicators now visible for keyboard users
- Individual case study pages now return a proper 404 at the framework level for unknown URLs, rather than attempting a dynamic render
- Removed the old contact page and all 10 location-specific contact variants (e.g. /contact/fort-lee) — these now redirect to /contact
- Removed the old /audit page — now redirects to /contact
- Rebuilt the /contact page with a new design: a clear hero and a 3-path selector so visitors can choose how they'd like to reach out (share details, schedule a call, or request a website review)
- Added a "Start with the Details" form to the contact page so visitors can share their business name, budget, timeline, and what they need help with before we respond
- Added a "Schedule a Strategy Call" section to the contact page with a Calendly embed (shows a styled placeholder until the Calendly URL is configured)
- Hardened the contact details form with improved input validation, better error handling, and accessibility improvements for screen readers
- The "Schedule a Strategy Call" section now opens a custom scheduling modal that correctly applies the site's dark or light color scheme — the calendar background matches the rest of the page in both themes
- Added a "Request a Website Review" form to the contact page — visitors can enter their name, email, and website URL, optionally check what they want reviewed (mobile, SEO, speed, etc.), and submit for a free audit
- Updated the "Request a Website Review" button used throughout the site to land visitors directly on the review form instead of the default contact page
- The contact page now supports direct linking to any of its three forms via URL (?path=details, ?path=call, ?path=review)

- Added Google Maps embed to the website footer so visitors can see our office location from any page
- Redesigned the footer with 4 distinct layout options (Panoramic, Split Panel, Stacked Strips, Card Trio) — a floating widget lets you switch between them and remembers your choice
- Removed the standalone Contact Information section from the contact page (the map and office details now live in the footer)
- Switched the Calendly scheduler on the contact page from a custom modal to an inline calendar so visitors can book directly on the page without opening a popup
- Replaced the inline Calendly calendar embed with a popup — visitors now click "Pick a time that works" to open the scheduler in an overlay, which avoids the white background issue in dark mode and uses less page space

- Fixed the contact details form to send field names the server expects (was sending camelCase, server wanted snake_case)
- Added "What are you interested in?" checkboxes to the contact details form (Web Design, SEO, Both, Not sure yet)
- Added an optional phone number field to the website review request form
- Fixed the Calendly webhook handler to safely handle missing event data instead of crashing
- Fixed the "What are you interested in?" question on the contact form to be single-select — only one option can be chosen at a time (Web Design & Development, SEO, Both, or Not sure yet)
- The "Start the Conversation" submit button on the contact form is now disabled until all required fields are filled in (name, email, business name, budget, timeline, and at least one improvement area)
- Improved button hover effect across the site — buttons now lift slightly and deepen on hover for clearer feedback
- Fixed "Request a Website Review" buttons across the site — they now correctly land visitors on the review form instead of the generic contact page
- Added "All of the above" option to the website review form's specifics checkboxes — selecting it checks all four audit areas at once
- Added free-text input to the "Other" option on the review form so visitors can describe what they'd like reviewed
- Moved website URL and phone number fields into a two-column row on the review form for a cleaner layout
- Hardened the website review API to correctly store and include the "Other" detail field and phone number submitted from the review form
- Fixed a bug where the "Other" detail text was always sent in the review form payload even when "Other" was not selected
- Fixed the contact details form to send the company name field under the correct name the server expects
- The homepage hero badge now shows the live Google rating and review count pulled directly from Google — updates automatically every 24 hours once the API key is configured

## Notes for internal team

- Code quality refactors (no user-facing changes): added `isReviewCta` type discriminator to CTA interface in data/service-paths.ts; replaced label string-match in services-clarification-cta-section.tsx; removed duplicate ContactPath type in app/contact/page.tsx (now imported from contact-path-selector); extracted formatPhone/stripPhone to shared lib/utils/phone.ts and updated both contact form files to import from there
- Files: data/service-paths.ts, components/services/services-clarification-cta-section.tsx, app/contact/page.tsx, components/contact/contact-details-form.tsx, components/contact/contact-review-form.tsx, lib/utils/phone.ts (new)
- Security hardening: added HTML escaping to audit email body (app/api/audit/route.ts), added server-side allowlist for specifics values, fixed phone_number schema key mismatch, added other_detail field to server schema and DB insert
- Bug fixes: NotesField and StatusSelector in prospect drawer now reset state when switching between prospects; formatDate moved to module scope in prospects-table; services CTA ternary simplified; company_name payload key fixed in contact-details-form
- DEV-81 completed: removed dead Next.js audit route (app/api/audit/route.ts deleted) — now that pvs-server /api/audit is live, the Next.js fallback is no longer needed

- PVS-386, PVS-387, PVS-388 completed (epic PVS-385)
- PVS-390, PVS-391, PVS-392, PVS-393, PVS-394, PVS-395 completed (epic PVS-389)
- PVS-397 completed: data/case-studies.ts created, homepage.ts and project-showcase-section.tsx migrated to consume from it
- PVS-398 completed: portfolio index redesigned with editorial case study panels, intro/CTA copy refreshed, unused trust-section.tsx removed
- PVS-399 completed: individual case study pages at /portfolio/[slug] with hero, problem, solution, issues grid, testimonial, and CTA sections
- PVS-399 case study layout redesigned: two-column hero, numbered narrative sections, editorial issue rows, generous testimonial treatment
- PVS-402 completed: deleted app/contact/, app/audit/, components/contact/, components/audit/, data/contact-contexts.ts; updated next.config.js redirects
- PVS-403 completed: new app/contact/page.tsx, components/contact/contact-hero.tsx, contact-path-selector.tsx, contact-page-client.tsx
- PVS-404 completed: components/contact/contact-details-form.tsx
- PVS-405 completed: components/contact/contact-strategy-call.tsx — Calendly inline widget via next/script lazyOnload, placeholder when NEXT_PUBLIC_CALENDLY_URL unset, wired into contact-page-client.tsx — react-hook-form + zod, 9-field layout (2-col/3-col/2-col/checkboxes/textarea), honeypot, 5s throttle, success/error/loading states, wired into contact-page-client.tsx
- PVS-406 completed: components/contact/contact-review-form.tsx (react-hook-form + zod, 4-field layout, checkbox specifics, honeypot, 5s throttle, success/error/loading states); app/api/audit/route.ts updated to accept specifics as string or array; RequestReviewCta default href → /contact?path=review; app/contact/page.tsx adds searchParams support; ContactPageClient adds defaultPath prop
- PVS-356 completed (footer/map): Added Google Maps embed to footer as full-width strip; added `https://www.google.com` to CSP frame-src; redesigned footer with 4 layout variants (A: Panoramic, B: Split Panel, C: Stacked Strips, D: Card Trio); built footer-layout-picker.tsx client component with localStorage persistence and floating pill widget; removed ContactInfoSection from contact page; components/contact/contact-info-section.tsx deleted
- PVS-356 completed: Replaced Calendly popup widget JS with a custom React modal + plain iframe; the iframe URL omits embed_type so Calendly applies background_color to the document body (matching dark/light theme correctly); modal has backdrop, close button, and inline backgroundColor matching resolved theme
- PVS-351 hardening pass on contact-details-form.tsx: added `as const` to IMPROVEMENT_OPTIONS; derived z.enum values from constants via toEnumValues(); added .max() to name/companyName/email, URL validation to currentWebsite, phone regex; fixed reset()/setFormState order; added AbortController 15s fetch timeout; added re-entry guard and throttle reset on catch; hid error banner while re-submitting; added aria-describedby + FieldError id wiring for all validated fields; renamed honeypot field to website_confirm; replaced hidden div with off-screen absolute positioning
- Migrated contact-strategy-call.tsx from custom iframe modal to react-calendly InlineWidget; added useCalendlyEventListener to fire a fire-and-forget POST to /api/webhooks/calendly on event scheduled; pageSettings prop used for theme colors instead of URL params; removed useState modal, buildThemedUrl, Button CTA card, X icon, Calendar/CalendarCheck icons
- Switched Calendly from InlineWidget to openPopupWidget; button triggers popup overlay; white background in dark mode is no longer an issue since the popup has its own backdrop; useCalendlyEventListener webhook retained; replaced blank inline embed area with a content card (description, 3 bullet points, CTA button)
- Files: components/ui/navbar.tsx, components/contact/ContactForm.tsx, next.config.js, data/faq-content.ts, components/faq/faq-list-section.tsx, components/faq/faq-intro-section.tsx, components/faq/faq-closing-cta.tsx, app/faq/page.tsx, data/local-service-pages.ts, data/about.ts, components/services/services-core-section.tsx, app/services/ux-ui-design/ (deleted), data/homepage-faq.ts, components/home/home-faq-section.tsx, app/page.tsx, data/web-development-content.ts, data/seo-content.ts, app/services/web-development/page.tsx, app/services/seo/page.tsx, components/portfolio/project-showcase-section.tsx, components/portfolio/portfolio-intro-section.tsx, components/portfolio/portfolio-closing-cta.tsx, components/portfolio/trust-section.tsx (deleted), app/portfolio/page.tsx, app/contact/ (deleted), app/audit/ (deleted), components/contact/ (deleted), components/audit/ (deleted), data/contact-contexts.ts (deleted), next.config.js, app/layout.tsx, components/layout-wrapper.tsx, components/contact/contact-details-form.tsx, components/contact/contact-strategy-call.tsx

- PVS-423 completed: contact-details-form.tsx payload renamed to snake_case (company_name, current_website, brief_summary), added interested_in field + UI checkboxes; contact-review-form.tsx added phone_number field; contact-strategy-call.tsx Calendly webhook null-guarded
- DEV-80 completed: Added Prospects dashboard at /dashboard/prospects — shows summary stats (total leads, by source), paginated table with source/status filters, and a slide-out detail panel per prospect; sidebar updated with Prospects nav link; status updates and internal notes save automatically via PATCH API
- PVS-356 review form polish: "All of the above" specifics checkbox, Other free-text detail field, website/phone 2-col row, fixed all Request a Website Review CTA hrefs (homepage + services), swapped services-clarification-cta to use RequestReviewCta component

- Audit API route hardening: added other_detail field to Zod schema and DB insert; renamed phoneNumber → phone_number in schema (snake_case alignment with form payload); added escapeHtml() helper and applied to all user-submitted strings in email body; added server-side VALID_SPECIFICS allowlist filter so only known values (mobile-performance, seo-visibility, traffic-no-calls, page-speed) reach the DB and email
- Files: app/api/audit/route.ts

- Dashboard prospects code quality pass: moved formatDate/formatRelative to module scope in prospect-detail-drawer.tsx; added error state (updateError) to StatusSelector with visible feedback message; added error state (saveError) to NotesField with visible feedback message; added other_detail field render in AuditRequest section; added error? prop to ProspectsStatsBar with banner display; passed statsError to ProspectsStatsBar in prospects-page-client.tsx; wrapped handleSourceChange, handleStatusChange, handleSelectProspect, handleCloseDrawer, handleStatusUpdate in useCallback; added other_detail?: string to AuditRequest interface in types.ts
- Files: components/dashboard/prospects/prospect-detail-drawer.tsx, components/dashboard/prospects/prospects-stats-bar.tsx, components/dashboard/prospects/prospects-page-client.tsx, components/dashboard/prospects/types.ts

- Fixed Rules of Hooks violation in contact-details-form.tsx: moved watch() and isFormReady above the success early-return guard
- Fixed clearTimeout leak in contact-details-form.tsx: moved clearTimeout into a finally block so it runs on error/abort paths too
- Fixed clearTimeout leak in contact-review-form.tsx: same finally block fix
- contact-review-form.tsx: 'other' value is now stripped from the specifics array before the API payload is built (other_detail carries the free-text separately)
- contact-review-form.tsx: Zod schema for specifics tightened to z.array(z.string().max(100)).max(10)
- Files: components/contact/contact-details-form.tsx, components/contact/contact-review-form.tsx

- Fixed stale state bugs in prospect-detail-drawer.tsx: NotesField textarea now syncs to new prospect when drawer switches (clears in-flight debounce + resets notes/saveError via useEffect on initialNotes/prospectId); StatusSelector saved checkmark and error flag now reset immediately when prospect changes (useEffect on current/prospectId)
- Files: components/dashboard/prospects/prospect-detail-drawer.tsx

- Replaced all 9 homepage testimonials (3 previous + 6 placeholders) with 5 real client quotes from Sara (Rising Tide Aquatics), Jennifer (Iffers Pictures), Kyle (Jones Pressure Washing NJ), Alli (Going Gold Choreography), and Chris (Gladstone Wealth Partners)
- Made the numbered watermark on About page approach cards more prominent on hover — number now clearly visible with a purple glow effect when hovering a card
- DEV-69 completed: data/homepage.ts testimonials array replaced

- Upgraded the website framework from Next.js 14 to Next.js 15 to patch two security vulnerabilities (HTTP Request Deserialization DoS and Image Optimizer DoS)
- Hardened the website Content Security Policy to block unsafe inline script and style execution (removes 'unsafe-inline' from script-src and style-src, replacing it with per-request cryptographic nonces)
- Patched three security vulnerabilities in build tooling dependencies (glob command injection, minimatch ReDoS x2)

## Notes for internal team

- DEV-69 completed: replaced testimonials array in data/homepage.ts with 5 real client entries; removed all placeholder "Client Name" entries
- Hover effect update in components/about/bullet-variants.tsx: CardsVariant number opacity raised to 0.65 on hover (was 0.08) with drop-shadow glow via group-hover Tailwind arbitrary value

- DEV-112 completed: upgraded Next.js from 14.2.35 → 15.5.12 to remediate CVE-2025-56166 (CVSS 7.5) and CVE-2025-56165 (CVSS 5.9)
- Updated async params pattern on 6 pages: app/blog/[slug]/page.tsx, app/portfolio/[slug]/page.tsx, app/services/seo/[city]/page.tsx, app/services/web-development/[city]/page.tsx, app/dashboard/clients/[id]/websites/[websiteId]/page.tsx, app/dashboard/clients/[id]/websites/[websiteId]/seo-focus/page.tsx, app/dashboard/deployments/[id]/page.tsx
- Created components/campaign-tracker-client.tsx client wrapper to comply with Next.js 15's stricter ssr:false enforcement in Server Components
- Also deleted legacy app/services/[city]/page.tsx and app/services/bergen-county/page.tsx on this branch (these were already decided for removal; redirects already in next.config.js)

- DEV-131 completed: npm audit fix resolved glob (GHSA-5j98-mcp5-4vw2, high) and minimatch (GHSA-3ppc-4f35-3m26, high x2) vulnerabilities; 0 vulnerabilities remaining
- DEV-111 completed: nonce-based CSP implemented; 'unsafe-inline' removed from both script-src and style-src
- Moved CSP header generation from next.config.js static headers to middleware.ts (required for per-request nonces)
- Middleware now runs on all routes (was /dashboard/:path* only) — Supabase auth check still gated to protected paths only
- Added components/nonce-provider.tsx (NonceProvider + useNonce hook) so client components get the nonce via React context
- Updated components/ui/structured-data.tsx and components/sitebehaviour-script.tsx to call useNonce()
- app/layout.tsx made async to read x-nonce from next/headers; wraps tree in NonceProvider

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
- https://www.pixelversestudios.io/portfolio/jones-pressure-washing
- https://www.pixelversestudios.io/portfolio/360-degree-care
- https://www.pixelversestudios.io/portfolio/domani
- https://www.pixelversestudios.io/contact
- https://www.pixelversestudios.io/audit
- https://www.pixelversestudios.io/contact/bergen-county
- https://www.pixelversestudios.io/contact/fort-lee
- https://www.pixelversestudios.io/contact/cliffside-park
- https://www.pixelversestudios.io/contact/river-vale
- https://www.pixelversestudios.io/contact/hackensack
- https://www.pixelversestudios.io/contact/paramus
- https://www.pixelversestudios.io/contact/teaneck
- https://www.pixelversestudios.io/contact/fair-lawn
- https://www.pixelversestudios.io/contact/englewood
- https://www.pixelversestudios.io/contact/bergenfield
- https://www.pixelversestudios.io/contact/ridgewood
- https://www.pixelversestudios.io/
- https://www.pixelversestudios.io/about
- Removed the 10 city-specific service pages (e.g. /services/fort-lee) and the Bergen County service page — these now redirect permanently to /services

## Notes for internal team

- DEV-112 redirect follow-up: added legacyServiceCitySlugs array + serviceCitySlugRedirects spread to next.config.js redirects(); also added explicit /services/bergen-county → /services redirect; covers all 10 city slugs (fort-lee, englewood, hackensack, paramus, ridgewood, teaneck, fair-lawn, bergenfield, cliffside-park, river-vale) deleted on this branch

## Changed URLs

- https://www.pixelversestudios.io/services/fort-lee
- https://www.pixelversestudios.io/services/englewood
- https://www.pixelversestudios.io/services/hackensack
- https://www.pixelversestudios.io/services/paramus
- https://www.pixelversestudios.io/services/ridgewood
- https://www.pixelversestudios.io/services/teaneck
- https://www.pixelversestudios.io/services/fair-lawn
- https://www.pixelversestudios.io/services/bergenfield
- https://www.pixelversestudios.io/services/cliffside-park
- https://www.pixelversestudios.io/services/river-vale
- https://www.pixelversestudios.io/services/bergen-county

## Latest deploy summary

- Removed old city-specific service pages and local service pages (e.g. /services/fort-lee, /services/web-development/englewood) — these are being replaced by the new service pages
- Old city and local service URLs now redirect permanently to the main service pages
- Removed dead URLs from the XML sitemap so search engines no longer crawl pages that don't exist

## Notes for internal team

- DEV-339 completed: deleted app/services/web-development/[city]/, app/services/seo/[city]/, components/services/city/, components/services/local/, data/services-city-pages.ts, data/local-service-pages.ts, data/bergen-county-page.ts
- Added redirects to next.config.js: /services/web-development/:city → /services/web-development, /services/seo/:city → /services/seo
- Removed additionalPaths from next-sitemap.config.js (was injecting dead city/contact URLs into sitemap)
- TypeScript clean, no broken imports

## Changed URLs

- https://www.pixelversestudios.io/services/web-development/fort-lee
- https://www.pixelversestudios.io/services/web-development/englewood
- https://www.pixelversestudios.io/services/seo/fort-lee
- https://www.pixelversestudios.io/services/seo/englewood

## Latest deploy summary

- Updated homepage FAQ section with 8 questions optimized for both search visibility and conversion — adds pricing, timeline, redesign vs. rebuild, and process FAQs that prospects actively search for

## Notes for internal team

- DEV-335 completed: data/homepage-faq.ts updated — 6 FAQs → 8
- Removed: "What does PixelVerse actually do?" and "What's the difference between your two services?" (no search value)
- Added: redesign vs scratch, cost in NJ ($3,500–$12,000 range), build timeline (8–12 weeks), what happens after contact
- FAQPage JSON-LD on app/page.tsx auto-regenerates from homepageFaq array — schema updated automatically

## Changed URLs

- https://www.pixelversestudios.io/

## Latest deploy summary

- Updated Web Design & Development service page FAQs with pricing and timeline questions that prospects actively search for

## Notes for internal team

- DEV-337 completed: data/web-development-content.ts faq array updated — 5 FAQs → 6
- Removed "What do you need from us to get started?" (no search value, covered by homepage process FAQ)
- Added "How much does a custom website cost?" ($3,500–$12,000 range) and "How long does it take to build a website?" (8–12 weeks with phase breakdown)
- Pricing/timeline answers consistent with homepage FAQ
- ServiceFAQ component auto-regenerates FAQPage schema

## Changed URLs

- https://www.pixelversestudios.io/services/web-development

# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary

- Added reusable service page template components for individual service pages
- Created hero, features, process, FAQ, CTA, related services, and testimonial components
- FAQ component automatically generates SEO-friendly FAQPage schema
- Created Web Development service page with comprehensive content targeting custom development keywords
- Added hover dropdown menu to Services navigation item for easy access to service subpages
- Created UX/UI Design service page targeting design-related keywords
- Created comprehensive SEO Services page with local SEO focus and Bergen County city links
- Added Service JSON-LD schema to all three service pages for improved search visibility
- Updated /services hub page with linked service cards and visual hierarchy

## Notes for internal team

- PVS-143: Foundation ticket for service pages milestone
- New components in `components/services/individual/`
- These components will be used by PVS-144 (Web Development), PVS-145 (UX/UI Design), PVS-146 (SEO)
- All components are fully typed and follow existing design patterns
- PVS-144: Web Development page at `/services/web-development`
- Page includes 6 FAQs with JSON-LD schema, 6 feature cards, 5 differentiators, tech stack section
- Navbar dropdown: hover-activated on desktop, expandable submenu on mobile
- PVS-145: UX/UI Design page at `/services/ux-ui-design`
- Page includes 6 FAQs with schema, 6 feature cards, 5 design principles, UX ROI statistics section, 6-step process
- PVS-146: SEO Services page at `/services/seo`
- Most comprehensive page: 8 FAQs, 6 services, 6 technical capabilities, 4 process steps, local SEO section with Bergen County city links, timeline expectations
- PVS-192: Added Service JSON-LD schema to all service pages
- New utility `createServiceSchema` in `lib/structured-data.ts` for reusable Service schema generation
- Schema includes: name, serviceType, description, provider (Organization), areaServed (Bergen County, NJ)
- PVS-147: Updated /services hub page
- Primary services (Web Dev, UX/UI, SEO) now link to dedicated pages with "Learn More →" CTAs
- Secondary services (Analytics, Support) styled as "Included With Every Project" with muted appearance
- Updated page metadata to reflect hub role

## Changed URLs

- https://www.pixelversestudios.io/services
- https://www.pixelversestudios.io/services/web-development
- https://www.pixelversestudios.io/services/ux-ui-design
- https://www.pixelversestudios.io/services/seo

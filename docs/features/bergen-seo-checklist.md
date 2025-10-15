# Bergen County SEO Master TODO

Last updated: 2025-10-14

## Foundation (Pre-Transfer & Research)

- [x] **Understand the Bergen audience**
  - Catalog the priority towns (Hackensack, Fort Lee, Paramus, Ridgewood, Englewood, Teaneck) and note dominant industries or niches for each.
  - Translate common pain points (slow sites, poor conversions, weak SEO) into value props you can reference in copy and CTAs.
- [x] **Run a competitive scan**
  - Google “web design + {town}” for each target municipality and capture top competitors’ offers, CTAs, testimonials, and layout patterns.
  - Note where competitors excel or fall short (speed, accessibility, schema) so your build intentionally outperforms them.
- [x] **Build the keyword matrix**
  - Use Google Autocomplete, People Also Ask, AnswerThePublic, and (post-launch) Search Console to pair service keywords with each town and intent.
  - Log primary/secondary keywords, searcher intent, supporting FAQs, and recommended page types in a shared spreadsheet.
- [x] **Map pages and user journeys**
  - Inventory existing routes and plan additions (/bergen-county hub, town landing pages, service detail pages, FAQ, contact).
  - Assign a conversion goal to each page (book call, request quote, download lead magnet) and outline internal links that guide visitors through the funnel.
- [ ] **Prep media assets**
  - Gather optimized imagery (WebP/AVIF) with descriptive filenames tied to Bergen use cases.
  - Draft alt text that reinforces locality (e.g., “Custom website for Englewood wellness studio homepage”).

## Immediate (Week 1–2, once domain transfer completes)

- [x] **Ship baseline SEO metadata**
  - Add canonical URLs, social previews, and keyword-focused titles/descriptions for all live routes.
- [ ] **Confirm analytics setup**
  - Create the SiteBehaviour project for production and staging; add the tracking snippet to the Next.js root layout with a production-only guard.
  - Configure conversion goals for contact form submissions, package inquiry clicks, and phone/email interactions; test events in an incognito session.
  - Verify Google Search Console and Bing Webmaster domain properties, resubmit the XML sitemap, and save filters for Bergen-focused queries.
- [ ] **Capture technical baselines**
  - Run Lighthouse (mobile) and axe scans to record Core Web Vitals and accessibility scores; store exports for later comparison.
  - Document initial analytics metrics (sessions, conversions, impressions) so you can quantify gains.
- [ ] **Draft sitemap and IA plan**
  - Convert the page inventory into a sitemap diagram showing parent/child routes, breadcrumbs, and proposed URL slugs.
  - Note which pages will be static vs. data-driven and how they connect via navigation, footer, and contextual links.
- [ ] **Outline reusable templates**
  - Define requirements for location and service page templates (hero variants, testimonial blocks, FAQs, CTA placements).
  - List existing UI components to reuse and identify gaps that require new primitives.

## Short Term (Weeks 3–6)

- [ ] **Produce keyword-driven content briefs**
  - Write briefs for the initial six town landing pages (Hackensack, Fort Lee, Paramus, Ridgewood, Englewood, Teaneck) including target keywords, H1/H2 structure, CTA, testimonials, and FAQ entries.
  - Include internal link targets (e.g., from town page to relevant service and portfolio entries) and note needed media assets.
- [ ] **Plan structured data coverage**
  - Outline JSON-LD payloads for LocalBusiness, Service, Product (packages), and FAQ; assign ownership per route and note dynamic fields.
  - Schedule validation steps with Google’s Rich Results test once markup ships.
- [ ] **Define internal linking strategy**
  - Document how homepage, services, packages, and town pages reference each other; include footer/mega-menu “Serving Bergen County” clusters.
  - Plan breadcrumbs or sidebar navigation for deeper town/service sections.
- [ ] **Build content production calendar**
  - Assign owners (copy, design, dev) and due dates for each brief and asset; track status in a shared sheet or project tool.

## Mid Term (Weeks 7–10)

- [ ] **Implement templates and CMS/data hookups**
  - Develop the location/town page template using the component inventory; connect to CMS/data sources or JSON as required.
  - Ensure template supports dynamic SEO metadata, schema, and modular sections (testimonials, FAQs, CTAs).
- [ ] **Refresh core pages with Bergen messaging**
  - Update homepage hero/value sections, services page, and packages page to reference Bergen-specific pain points and success metrics.
  - Integrate locally-focused testimonials or case studies where social proof drives conversions.
- [x] **Launch /bergen-county hub**
  - Structure the hub with service overviews, town cards, testimonials, FAQs, and a strong CTA; embed internal links to individual town pages.
  - Add structured data and ensure performance (LCP/CLS) remains within goals.
- [ ] **Collect testimonials and case studies**
  - Interview Bergen clients for quotable results; create copy + visuals tailored to featured industries.
  - Add these assets to relevant pages and maintain a repository for future campaigns.
- [ ] **Configure ongoing performance monitoring**
  - Evaluate tools like SpeedCurve/Calibre or scripted Lighthouse runs; set thresholds and alerts for major regressions.

## Long Term (Post-Launch Optimization)

- [ ] **Grow local authority**
  - Optimize Google Business Profile (categories, services, photos, service areas) and encourage town-specific reviews.
  - Pursue Bergen Chamber listings, local sponsorships, and guest features; track acquired backlinks and referral traffic.
- [ ] **Expand location coverage**
  - Roll out additional town pages (Fair Lawn, Mahwah, Bergenfield, Norwood, Saddle Brook, Wyckoff) using the established template and briefs.
  - Keep keyword research and content refresh cycles active for emerging opportunities.
- [ ] **Monitor, iterate, and document**
  - Review SiteBehaviour dashboards, Search Console reports, and Bing metrics weekly; log insights and actions in project docs.
  - Adjust copy, CTAs, internal links, and structured data based on performance; schedule quarterly retros to update this TODO and the SEO playbook.
- [ ] **Track rankings and conversions**
  - Maintain a rank-tracking sheet (manual or tool-based) for highest-priority town/service terms.
  - Compare conversions against baseline metrics to quantify ROI and surface experiments (e.g., A/B testing offers or CTAs).

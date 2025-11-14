# Bergen County SEO Execution TODO

Last updated: 2025-10-23

All actionable tasks now live in the master checklist: `docs/features/bergen-seo-checklist.md`.

Use this planning file to track progress:

- Copy relevant sections from the master checklist into a sprint or weekly view if you need a shorter window.
- Note ownership, deadlines, and status updates below as work advances.

## Progress Log

- _Add dated notes here as tasks move from planned → in progress → complete._
- 2025-10-14: Completed foundational audience research for Hackensack, Fort Lee, Paramus, Ridgewood, Englewood, Teaneck (see `docs/planning/bergen-audience-research.md`).
- 2025-10-14: Documented competitive scan across priority towns (see `docs/planning/bergen-competitive-scan.md`).
- 2025-10-14: Drafted Bergen County keyword matrix with target phrases, intent, and page mapping (see `docs/planning/bergen-keyword-matrix.md`).
- 2025-10-14: Mapped pages and user journeys, including personas and internal linking rules (see `docs/planning/bergen-page-journeys.md`).
- 2025-10-14: Launched `/bergen-county` hub route with hero, services, town grid, proof, and CTA sections (see `app/bergen-county/page.tsx`).
- 2025-10-14: Refined Bergen hub copy to spotlight PixelVerse services while keeping Bergen targeting (see `components/bergen/*`).
- 2025-10-14: Redesigned town coverage grid with segmented cards and highlights (see `components/bergen/bergen-towns-section.tsx`).
- 2025-10-15: Implemented canonical URLs and social sharing metadata across live routes (see `lib/metadata.ts` and `app/*/page.tsx`).
- 2025-10-21: Drafted outline for Bergen County local SEO city pages (Fort Lee, Cliffside Park, River Vale, Hackensack, Paramus) with layered local content while preserving core services copy.
- 2025-10-21: Evaluated localized services page strategy for duplicate-content risk and outlined enhancements to strengthen town-level SEO signals.
- 2025-10-21: Shipped localized `/services/[city]` routes for Fort Lee, Cliffside Park, River Vale, Hackensack, and Paramus with unique metadata, proof, FAQs, and CTAs layered atop shared services modules.
- 2025-10-21: Added `/public/logo.png` fallback asset to resolve Next image optimizer error during dev builds.
- 2025-10-21: Evaluated URL structure options for localized services pages (`/services/[city]` vs `/services/[county]/[city]`) and confirmed current approach aligns with internal linking and SEO requirements.
- 2025-10-21: Repositioned Fort Lee and Cliffside Park services copy around local small-business sectors instead of language targeting, including refreshed hero stats and FAQs.
- 2025-10-21: Replaced speculative Cliffside Park proof/testimonial with roadmap-focused messaging to avoid implying existing client results.
- 2025-10-21: Adjusted Cliffside Park proof layout to balance stat card and copy when no testimonial is available.
- 2025-10-21: Tweaked Cliffside Park hero alignment (bullet positioning, stat card spacing) for cleaner visual rhythm.
- 2025-10-21: Stacked Cliffside Park hero stat card content vertically to resolve remaining Step 1 spacing issues.
- 2025-10-21: Finalized hero stat stack (heading/value/label) with dedicated flex column for consistent line order.
- 2025-10-21: Rebuilt `/bergen-county` route using the new data-driven localization pattern (hero, highlights, proof, FAQ, CTA) plus updated metadata.
- 2025-10-21: Relocated Bergen County hub to `/services/bergen-county` and updated internal references.
- 2025-10-21: Updated Bergen towns grid to link directly to new `/services/[city]` routes with refreshed summaries and highlights.
- 2025-10-21: Optimized titles and meta descriptions for Bergen County hub and town service pages to align with current SEO best practices.
- 2025-10-21: Refresh sitewide core page metadata (home, about, services, packages, contact, portfolio, FAQ) with SEO-optimized titles and descriptions.
- 2025-10-21: Added global LocalBusiness schema and ensured canonical handling via shared metadata helper.
- 2025-10-22: Added Instagram, Facebook, YouTube, and Twitter social links to the global footer and homepage closing CTA (see `components/ui/social-links.tsx`, `components/ui/footer.tsx`, `components/home/closing-cta-section.tsx`).
- 2025-10-23: Implemented Next.js sitemap route aggregating core pages and localized services slugs (see `app/sitemap.ts`).
- 2025-10-25: Integrated SiteBehaviour tracking script globally via the root layout to activate analytics capture (see `app/layout.tsx`).
- 2025-10-25: Corrected the global site URL to `pixelversestudios.io` so sitemap and canonical metadata reference the live domain (see `lib/metadata.ts`).
- 2025-10-25: Replaced the custom sitemap route with `next-sitemap`, adding automated generation, robots.txt, and city service paths at build time (see `next-sitemap.config.js`, `package.json`).
- 2025-10-25: Refined `next-sitemap` transform to output clean URL entries in generated XML (see `next-sitemap.config.js`).
- 2025-10-25: Swapped locally hosted logos for Cloudinary-hosted assets, updating metadata, structured data, and navbar image handling (see `lib/metadata.ts`, `app/layout.tsx`, `components/ui/navbar.tsx`, `next.config.js`).
- 2025-10-25: Replaced the footer Twitter icon with an X.com mark to reflect current branding (see `components/ui/social-links.tsx`).
- 2025-10-25: Added Google Business Profile link to footer social links using the shared GBP URL (see `components/ui/social-links.tsx`).
- 2025-10-26: Launched the `/blog` hub with featured article, category pillars, and dynamic post route templates to support ongoing SEO content (see `app/blog/*`, `components/blog/*`, `data/blog-posts.ts`).
- 2025-10-26: Refined the blog featured story layout to spotlight takeaways instead of duplicate copy, improving scanability for new readers (see `components/blog/blog-featured-post-section.tsx`, `data/blog-posts.ts`).
- 2025-10-27: Replaced placeholder blog posts with a small business delegation article focused on why owners should outsource digital execution (see `data/blog-posts.ts`).
- 2025-10-27: Added AI and security-focused blog post highlighting PixelVerse governance standards for intelligent automation (see `data/blog-posts.ts`).
- 2025-10-27: Converted contact context parameters into dedicated routes with unique metadata to resolve canonical duplicates and support local SEO (see `app/contact/[context]/page.tsx`, `data/contact-contexts.ts`, `data/services-city-pages.ts`).
- 2025-10-27: Added Netlify `_redirects` rules ensuring all HTTP/WWW requests 301 to the HTTPS apex domain (see `public/_redirects`).
- 2025-10-27: Added redirect from legacy `/works` URL to `/portfolio` to resolve 404 in Search Console (see `public/_redirects`).
- 2025-10-27: Marked `/styleguide` as noindex to keep internal tooling out of the index (see `app/styleguide/page.tsx`).
- 2025-10-30: Tuned the blog mobile experience by offsetting the Latest section anchor for the fixed nav and tightening featured-story spacing for readability (see `components/blog/blog-articles-section.tsx`, `components/blog/blog-featured-post-section.tsx`, `app/blog/[slug]/page.tsx`).
- 2025-10-30: Calibrated the featured story gradient overlay and white text styling for dark-mode readability (see `components/blog/blog-featured-post-section.tsx`).
- 2025-10-30: Increased contrast for the featured story takeaway card by using a solid surface and darker copy (see `components/blog/blog-featured-post-section.tsx`).
- 2025-10-30: Outlined two next blog topics (Bergen County local SEO playbook, analytics-driven retainer reporting) to target engagement and organic traffic.
- 2025-10-30: Published the analytics retainer reporting article covering dashboards, cadence, and growth planning (see `data/blog-posts.ts`).
- 2025-10-30: Removed blog card image placeholders to tighten layout while visuals are pending (see `components/blog/blog-articles-section.tsx`).
- 2025-10-30: Corrected blog section header alignment so eyebrows don’t stretch full width (see `components/ui/section-header.tsx`).
- 2025-10-30: Updated blog data helpers so the newest post automatically becomes featured and lists stay reverse-chronological (see `data/blog-posts.ts`).
- 2025-10-30: Removed topic card placeholders in the blog pillars section until custom artwork ships (see `components/blog/blog-topics-section.tsx`).
- 2025-11-05: Added a framework-level redirect so legacy `/works` hits route to `/portfolio`, preventing non-existent URLs from blocking Search Console validation.
- 2025-11-05: Added Netlify redirect rules mapping `/contact?context=` queries to the canonical `/contact/[slug]` routes to clear “alternate page with proper canonical” warnings.
- 2025-11-05: Created `/pricing -> /packages` redirects (Next.js + Netlify) so legacy pricing URLs no longer surface as “crawled, not indexed.”
- 2025-11-05: Updated robots policy to disallow `/_next/` and API paths to keep static assets (fonts) out of the index.
- 2025-11-05: Added reusable footer-based local contact links (sourced from `contact-contexts`) so `/contact/[slug]` routes gain permanent internal links sitewide without bloating the primary contact page.
- 2025-11-06: Rewrote the UX vs UI blog entry to match the latest messaging, CTA, and highlight structure while keeping the existing slug live.
- 2025-11-06: Published a new blog on why custom website development outperforms builders, highlighting performance, scalability, and partnership benefits (see `data/blog-posts.ts`).
- 2025-11-06: Added a local SEO-focused blog explaining why search visibility matters for small businesses and how PixelVerse packages meet that demand (see `data/blog-posts.ts`).
- 2025-11-07: Added Teaneck, Fair Lawn, Englewood, Bergenfield, and Ridgewood city service data plus aligned contact contexts to extend Bergen County SEO coverage.
- 2025-11-07: Updated the Bergen hub town coverage grid so the new city routes surface alongside the original five priority locations.
- 2025-11-07: Simplified the footer local contact block to spotlight the Bergen County contact route plus a “View all Bergen locations” link for a scalable pattern.
- 2025-11-07: Updated city + county services closing CTAs to route visitors to their respective localized contact pages instead of the generic contact form.
- 2025-11-07: Removed the secondary CTA button from the blog hero to keep focus on reading flow and reduce redundant contact promos on editorial pages.
- 2025-11-07: Improved dark-mode readability of the “Read article” link on blog cards by using a lighter text color.
- 2025-11-07: Temporarily commented out the “What we write about for service brands” topics section on `/blog` per request.
- 2025-11-07: Adjusted the blog CTA secondary button styling so “See recent launches” remains visible in light mode while retaining dark-mode contrast.
- 2025-11-07: Integrated the campaign tracker (client component + analytics utilities) to capture `src` ad sources, SiteBehaviour events, and per-session tracking.
- 2025-11-07: Removed UTM tracking/middleware so attribution now relies solely on `src=` parameters with light cookie storage for the selected source.
- 2025-11-07: Added a `src=test` option so we can validate SiteBehaviour wiring after deploy without skewing real campaign data.
- 2025-11-07: Refreshed `/blog` copy (hero, featured label, latest posts intro, closing CTA) and explicitly featured the SEO article to replace the analytics story.
- 2025-11-07: Adjusted the blog closing secondary CTA styling so it stays visible on light backgrounds while retaining dark-mode contrast.
- 2025-11-13: Added a production-only guard for the SiteBehaviour analytics loader so local/staging sessions stop logging unauthorized tracker errors (see `app/layout.tsx`).
- 2025-11-13: Relaxed the audit form website validation to allow bare `www.` domains (plus top-level extension) while still sanitizing what reaches Supabase and notification emails (see `components/audit/audit-form.tsx`, `app/api/audit/route.ts`, `lib/validation/url.ts`).
- 2025-11-13: Re-aligned the audit form payload + validation with the backend Express validators (http(s) URLs, 200-character name cap, phone/specifics limits, and new `websiteUrl`/`phoneNumber` field names) to prevent submission rejections (see `components/audit/audit-form.tsx`, `app/api/audit/route.ts`, `lib/validation/url.ts`).
- 2025-11-13: Relaxed audit website validation again so only `www.` + TLD are required while API normalization still adds https when storing/logging (see `components/audit/audit-form.tsx`, `app/api/audit/route.ts`, `lib/validation/url.ts`).

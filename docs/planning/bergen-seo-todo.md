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

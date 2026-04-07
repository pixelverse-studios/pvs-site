# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary

- Updated 360 Degree Care case study to reflect completed engagement — narrative now uses past tense
- Removed client testimonial from 360 Degree Care case study (no longer verifiable)
- Case study now links to demo site instead of former live site
- Portfolio listing and detail pages gracefully handle demo vs live site links
- **Fixed critical SEO bug**: structured data (schema markup) is now correctly delivered on every page so Google can read it. Previously every schema across the site was missing from the rendered HTML and invisible to search engines.
- Redesigned the "Service Areas" section on the SEO and Web Development service pages so it's clearly visible on phones — added a labeled, bordered band with a stronger heading and tappable city links.
- Fixed the homepage browser tab title — it now correctly reads "Custom Web Design & SEO in New Jersey | PixelVerse Studios" so the brand name shows up in Google search results.
- Improved the mobile navigation menu in dark mode — text, icons, dividers, and the "current page" highlight are now clearly visible against a cleaner dark background that matches the rest of the site. Light mode is unchanged.
- Blog posts now show a Frequently Asked Questions section at the bottom (when the post has FAQs) and end with a clear "Book a free consultation" call-to-action so readers always have a next step.
- Internal links inside blog post body copy now render as real, clickable links instead of showing raw HTML markup (e.g. references to Bergen County, Fort Lee, services pages, and other internal pages from inside posts now work as expected).
- Updated the homepage hero headline to "Web Design, Development & SEO" with "Built for growing New Jersey businesses" as a supporting line beneath it. This puts SEO front and center in the page's main heading and helps the homepage rank for SEO-related searches in addition to web design.

## Notes for internal team

- Added `demoUrl` field to CaseStudy type for portfolio pieces that are no longer active client sites
- Made `url` field optional on CaseStudy type
- 360 Degree Care demo site: https://haven-home-healthcare.netlify.app/
- DEV-672: replaced `next/script` (strategy="afterInteractive") with a plain `<script>` element in `components/ui/structured-data.tsx`. Affects every page that consumes `<StructuredData>` (17 consumers). After deploy, request re-indexing in GSC for top pages and re-run Google Rich Results Test.
- DEV-666: redesigned `components/services/individual/service-area-links.tsx` — bordered surface band, eyebrow label, hierarchical layout (lead "Serving [County]" → city `<ul>`), full-strength text colors, focus-visible rings, larger tap targets. Multi-county support preserved.
- DEV-667: forced absolute title on homepage in `app/page.tsx` to work around Next.js App Router quirk where `title.template` defined in `app/layout.tsx` does not cascade to a page in the same segment. The fix uses `title: { absolute: '...' }` after spreading `createPageMetadata`, so OG/Twitter titles still get the brandless variant for cleaner social cards.
- DEV-668: rebuilt the dark-mode palette of the mobile nav drawer in `components/ui/navbar.tsx` and the parallel classes in `components/ui/auth-dashboard-link.tsx`. Replaced the heavy purple radial + dark linear gradient stack with a flat `var(--pv-bg)` base + subtle brand-primary radial accent. Bumped icon chips (white/10 → white/10 with white/20 border + full white text), nav text (white/80 → white/90), submenu rule (white/10 → white/25), child links (white/70 → white/85). Replaced the indistinct `bg-white/12` active state with a brand-primary tint (`rgba(118,70,255,0.18)`) plus a soft purple glow so it's unmistakable. Light mode untouched. Note: there's still duplication between navbar.tsx and auth-dashboard-link.tsx — worth a follow-up extract to a shared `mobile-nav-classes.ts` module if it diverges again.
- DEV-671: blog post template (`app/blog/[slug]/page.tsx`) now renders `post.faqs` as a visible accordion (reusing `ServiceFAQ` with `generateSchema={false}` so it coexists with the existing FAQPage JSON-LD) and a styled gradient `ServiceCta` ("Book a free consultation" → `/contact`) after the article body, before related posts. Reused existing `services/individual` components instead of creating new blog-specific ones. Also patched the DEV-649 QA description to use the correct post title ("How to Choose a Web Design Company in New Jersey") in items C1, C3, C4, C5 and the build summary blurb.
- DEV-673: `renderContent` in `app/blog/[slug]/page.tsx` now uses `dangerouslySetInnerHTML` for `paragraph` blocks and `list` items so authored inline `<a href>` tags render as real links. Added a `blogProseLinkClass` constant with Tailwind arbitrary variants (`[&_a]:`) that style any descendant `<a>` consistently (primary color, underline, hover state). Audited 40 inline anchors across `data/blog-posts.ts` and `data/blog-posts-staged.ts` — only `paragraph` and `list` blocks contain anchors; `heading` and `quote` blocks are anchor-free and don't need the change. Content is authored internally (no untrusted input), so XSS risk is N/A. If we ever take blog content from a CMS/user input, we'd need to add DOMPurify-style sanitization.
- DEV-675: split the homepage hero into a primary `<h1>` (`Web Design, Development & SEO`) and a new `<h2>` tagline (`Built for growing New Jersey businesses`). Added a `tagline` field to the `HomepageHero` interface, the raw data in `data/homepage.ts`, and the Zod validator in `lib/validation/homepage.ts`. Hero section renders the h2 inside the same `hero-enter` animation wrapper as the h1, with `text-xl sm:text-2xl text-[var(--pv-text-muted)]` typography so it reads as supporting text without competing with the gradient h1. Only consumer was the hero section itself (verified via grep) — no other components needed updating.

## Changed URLs

- https://www.pixelversestudios.io/
- https://www.pixelversestudios.io/services
- https://www.pixelversestudios.io/services/seo
- https://www.pixelversestudios.io/services/web-development
- https://www.pixelversestudios.io/areas/bergen-county
- https://www.pixelversestudios.io/areas/bergen-county/fort-lee
- https://www.pixelversestudios.io/areas/bergen-county/englewood
- https://www.pixelversestudios.io/areas/bergen-county/hackensack
- https://www.pixelversestudios.io/areas/bergen-county/paramus
- https://www.pixelversestudios.io/areas/bergen-county/ridgewood
- https://www.pixelversestudios.io/portfolio
- https://www.pixelversestudios.io/portfolio/360-degree-care
- https://www.pixelversestudios.io/about
- https://www.pixelversestudios.io/faq
- https://www.pixelversestudios.io/contact/details
- https://www.pixelversestudios.io/blog
- https://www.pixelversestudios.io/blog/choosing-web-design-company-new-jersey
- https://www.pixelversestudios.io/blog/wix-vs-wordpress-vs-custom-website
</content>
</invoke>
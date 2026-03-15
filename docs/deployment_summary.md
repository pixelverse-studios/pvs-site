# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary
- Optimized 4 page titles for better search result display — all now within Google's 50-60 character target
- Portfolio and contact pages now include "Web Design" keyword for better search relevance
- FAQ page title shortened to avoid truncation in search results
- Added structured data to the services overview page — Google can now better understand the two service offerings
- Published 5 new blog posts covering Google Business Profile optimization, local SEO checklist, law firm web design, healthcare website compliance, and website pricing
- Blog now has 13 published posts (up from 8) — first new content in 53 days
- Reduced Sentry client overhead — disabled performance tracing and session replays on the browser (errors still captured, server-side tracing unchanged)
- Added Sentry bundle size optimizations to exclude unused Replay sub-modules
- Optimized homepage loading speed — replaced JavaScript animations with CSS animations on 4 homepage sections
- Case study and insight sections now render server-side instead of requiring client-side JavaScript to display
- Optimized service pages loading speed — hero section and path cards now render instantly without waiting for JavaScript
- Services hub page reduced from 228kB to 192kB (16% lighter)

## Notes for internal team
- DEV-495: Fixed 4 page titles outside the 50-60 SERP character range (composed = raw title + " | PixelVerse Studios" suffix)
- /contact/details: 48→59 chars ("Share Your Project Details" → "Share Your Web Design Project Details")
- /contact/call: 46→58 chars ("Schedule a Strategy Call" → "Book a Web Design Strategy Call | NJ")
- /portfolio: 46→57 chars ("Portfolio & Case Studies" → "Web Design Portfolio & Case Studies")
- /faq: 66→57 chars ("Frequently Asked Questions | NJ Web Services" → "Web Design & SEO FAQs | New Jersey")
- DEV-498: Added BreadcrumbList schema (Home > Services) and 2 Service schemas (Web Design, SEO) to /services hub page
- Previously the only page with zero structured data
- DEV-499: Published 5 blog posts from drafts (8→13 total)
- Posts: GBP optimization guide, local SEO checklist, law firm web design (Hackensack), healthcare website design (Bergen County), website cost guide (NJ 2026)
- All excerpts trimmed to under 160 chars for proper SERP display
- Publish dates set to 2026-03-15
- DEV-515: Site-wide performance optimization
- Disabled Sentry client-side tracing (tracesSampleRate: 0.1→0) and replays (0.01/0.1→0/0) — reduces runtime CPU and network overhead
- Added bundleSizeOptimizations to Sentry webpack config (excludeReplayIframe, excludeReplayShadowDom, excludeReplayWorker, excludeDebugStatements)
- Investigation found: shared JS bundle is 180kB (React 122kB + framework 54kB) — this is the Next.js baseline, not reducible
- Sentry adds only ~2kB to shared bundle; the runtime cost (tracing/replays) was the real overhead
- "Unused JS" flagged by PageSpeed is mostly React framework code loaded globally — standard Next.js tradeoff
- "Unused CSS" is Tailwind utility classes — standard tradeoff, no per-page CSS splitting available
- "Avoid multiple page redirects" (0.63s) should be resolved by DEV-493/494 (www redirect fix + Netlify cleanup)
- DEV-516: Homepage performance — replaced Framer Motion with CSS animations
- Converted insight-section and case-study-content from client → server components (zero hydration)
- Dropped framer-motion import from case-study-section (CSS transition for active tab border)
- Dropped MotionSection/MotionItem from testimonial-carousel (plain divs)
- Created lightweight scroll-reveal component (IntersectionObserver, ~40 lines, replaces framer-motion useInView)
- Added CSS keyframes: slide-in-left, scale-in, grow-y to globals.css
- Homepage client components reduced from 4 → 3; page-specific JS: 13.2kB → 11.9kB

## Changed URLs
- https://www.pixelversestudios.io/contact/details
- https://www.pixelversestudios.io/contact/call
- https://www.pixelversestudios.io/portfolio
- https://www.pixelversestudios.io/faq
- https://www.pixelversestudios.io/services
- https://www.pixelversestudios.io/blog
- https://www.pixelversestudios.io/blog/google-business-profile-optimization-guide-bergen-county
- https://www.pixelversestudios.io/blog/local-seo-checklist-new-jersey-small-businesses-2026
- https://www.pixelversestudios.io/blog/web-design-law-firms-hackensack-nj
- https://www.pixelversestudios.io/blog/healthcare-website-design-bergen-county-hipaa-compliance
- https://www.pixelversestudios.io/blog/small-business-website-cost-new-jersey-2026-pricing-guide

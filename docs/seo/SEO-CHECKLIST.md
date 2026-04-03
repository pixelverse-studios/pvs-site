# SEO Implementation Checklist

> Progress: 38/59 Complete (64%) — city pages now live at /areas/bergen-county/[city]
> Last Updated: 2026-04-03

---

## Technical SEO

### Core Setup

- [x] SSL configured (HTTPS)
- [x] Mobile-friendly (responsive design)
- [x] sitemap.xml present (auto-generated with next-sitemap)
- [x] robots.txt configured (allows crawling, blocks /api, /dashboard)
- [x] Canonical URLs set on all pages
- [x] `lang="en-US"` in HTML root
- [x] Viewport meta tag present
- [x] No inline styles (Tailwind CSS)
- [x] HTTP/2 enabled (Netlify default)
- [x] Gzip/Brotli compression (Netlify default)

### Core Web Vitals

- [ ] LCP < 2.5s verified (need Lighthouse baseline)
- [ ] CLS < 0.1 verified (need Lighthouse baseline)
- [ ] FID/INP < 200ms verified (need Lighthouse baseline)
- [ ] Mobile PageSpeed score ≥ 70 (need baseline)
- [ ] Desktop PageSpeed score ≥ 90 (need baseline)
- [ ] Export initial Lighthouse benchmark

### Crawlability & Indexing

- [x] Sitemap submitted to Google Search Console
- [ ] Verify all priority pages indexed (check "crawled, not indexed")
- [ ] Request reindexing for /services pages
- [ ] No unintended noindex pages
- [ ] 404 pages properly handled
- [x] Old URLs redirected (301s for /works, /pricing)
- [ ] **89 pages not indexed** — rose from 65 after area pages added to crawl queue. Monitor for indexing progress.
- [x] **Fix www vs non-www domain mismatch** — ✅ Addressed in DEV-620 (www→non-www consolidation)
- [ ] Fix 51+ crawl errors from site restructure (removed /packages, service page changes)

---

## Structured Data (Schema)

### Implemented

- [x] LocalBusiness schema (global — homepage)
- [~] Per-city LocalBusiness schema — ✅ Live on /areas/bergen-county/[city]; ⚠️ missing geo coords for 4 of 5 cities
- [x] Organization schema (ProfessionalService)
- [x] BreadcrumbList schema (/services/seo, /services/web-development, /faq)
- [x] Service schema (homepage: 2 services; service pages: 1 each)
- [x] FAQPage schema (/faq, homepage, /services/seo, /services/web-development)
- [x] BlogPosting schema (blog posts)
- [x] WebSite schema — ✅ Now rendering on root layout (PR #196)
- [x] Fix city schema addressLocality bug — ✅ Now dynamic per city (no longer hardcodes Cliffside Park)
- [ ] Add geo coordinates to city schemas (only Fort Lee has coords; Englewood, Hackensack, Paramus, Ridgewood missing)
- [ ] Fix double suffix bug on area page titles (data includes "| Pixelverse Studios" + template adds it again)

### Validation

- [x] Google Rich Results Test - LocalBusiness (Jan 2026 audit: schema present)
- [x] Google Rich Results Test - FAQ (Jan 2026 audit: schema present)
- [x] Google Rich Results Test - Breadcrumbs (Jan 2026 audit: schema present)
- [ ] No schema errors in Search Console

---

## On-Page SEO

### Metadata

- [~] Unique Title Tags (50-60 chars) — 4 titles fixed (PR #197), some still need work
- [x] Meta Descriptions (120-160 chars) — 7/9 within range; /services/seo (161) and /faq (167) slightly over
- [ ] Keywords in title tags — city pages no longer exist; service pages lack location keywords
- [x] Keywords in meta descriptions - Service pages include "New Jersey"

### Content Structure

- [x] Single H1 per page
- [x] H2-H4 headings with keywords
- [x] ALT attributes on images
- [x] Descriptive, keyword-friendly URLs
- [x] Internal linking structure (breadcrumbs, footer)
- [ ] Contextual internal links between city pages (expand)

### Open Graph & Social

- [x] Open Graph title
- [x] Open Graph description
- [x] Open Graph image (1200x630)
- [x] Twitter Card: summary_large_image
- [x] Twitter Card image

---

## Content SEO

### City Pages (Priority 5)

| City       | Word Count | Local Refs | Industry Sections   | FAQs | Status   |
| ---------- | ---------- | ---------- | ------------------- | ---- | -------- |
| Fort Lee   | 1,500+     | Yes        | Needs work          | 3+   | Complete |
| Englewood  | 1,500+     | Yes        | Needs work          | 3+   | Complete |
| Hackensack | 1,500+     | Yes        | Yes (legal/medical) | 5+   | Complete |
| Paramus    | 1,500+     | Yes        | Yes (retail)        | 5+   | Complete |
| Ridgewood  | 1,500+     | Yes        | Yes (restaurants)   | 6+   | Complete |

### Blog Content

- [x] Blog hub page (/blog)
- [x] BlogPosting schema on posts
- [ ] Content calendar created
- [ ] "Website Cost Guide" post (planned)
- [ ] "Template vs. Custom" comparison (planned)
- [ ] "Why Business Not on Google" post (planned)
- [ ] "Local SEO Guide for Bergen County" (planned)
- [ ] Regular publishing schedule (1-2/week)

### FAQ Content

- [x] FAQ page with schema (/faq)
- [x] City-specific FAQs on service pages
- [ ] Expand FAQs for featured snippet targeting

---

## Local SEO

### Google Business Profile

- [x] GBP claimed and verified (✅ confirmed - 7 reviews now active)
- [ ] Accurate NAP (Name, Address, Phone)
- [ ] Business description optimized
- [ ] All services listed
- [ ] 10+ photos uploaded
- [ ] Service area coverage defined
- [ ] Q&A section seeded with FAQs
- [ ] Weekly GBP posts
- [ ] 10+ reviews acquired (current: 7 ⭐⭐⭐⭐⭐)
- [ ] Reply to all reviews

### Local Citations (Directories)

| Directory               | Status               | NAP Consistent |
| ----------------------- | -------------------- | -------------- |
| Google Business Profile | Pending verification | -              |
| Yelp                    | Not submitted        | -              |
| BBB                     | Not submitted        | -              |
| YellowPages             | Not submitted        | -              |
| Clutch                  | Not submitted        | -              |
| DesignRush              | Not submitted        | -              |
| UpCity                  | Not submitted        | -              |
| Expertise.com           | Not submitted        | -              |
| Apple Maps              | Not submitted        | -              |
| Bing Places             | Not submitted        | -              |
| Facebook Business       | Not submitted        | -              |
| LinkedIn                | Not submitted        | -              |

**NAP to Use:**

- **Name:** PixelVerse Studios
- **Address:** Bergen County, NJ (service area business)
- **Phone:** +1-201-638-1769
- **Email:** info@pixelversestudios.io

### Chamber of Commerce

- [ ] Bergen County Chamber
- [ ] Fort Lee Chamber
- [ ] Englewood Chamber
- [ ] Hackensack Chamber
- [ ] Paramus Chamber
- [ ] Ridgewood Chamber

---

## Off-Page SEO (Link Building)

### Directory Backlinks

- [ ] Submit to 10+ directories (0/10 complete)
- [ ] Consistent NAP across all listings
- [ ] Verify listings are live and indexable

### Local Partnerships

- [ ] Identify complementary businesses (photographers, copywriters)
- [ ] Outreach for guest posts
- [ ] Link exchange with non-competing agencies
- [ ] Sponsor local events for backlinks

### Review Generation

- [ ] Review request system implemented
- [ ] Request reviews from past clients
- [ ] Target: 10 reviews by Month 3
- [ ] Target: 25 reviews by Month 6

---

## Analytics & Tracking

### Setup

- [x] SiteBehaviour analytics active
- [x] Production-only guard (no local/staging tracking)
- [x] Campaign attribution tracking (src= parameter)
- [x] Mixpanel removed (DEV-299 - Feb 2026)
- [x] SiteBehaviour CSP violation fixed (DEV-299 - Feb 2026)
- [ ] Google Analytics 4 (not implemented)
- [ ] Google Tag Manager (not implemented)

### Search Console

- [x] Domain property created
- [x] Sitemap submitted
- [ ] Verify ownership
- [ ] Weekly position monitoring
- [ ] Track "crawled, not indexed" issues
- [ ] Monitor Core Web Vitals report

### Reporting

- [ ] Monthly traffic report created
- [ ] Monthly ranking report created
- [ ] Quarterly strategy review scheduled

---

## Quick Reference: Next Actions

### This Week (Priority) - Updated 2026-04-03

1. [ ] **Fix double suffix bug on area page titles** — City/county page titles have "| Pixelverse Studios" in data AND template adds it again (88+ char SERP titles)
2. [ ] **Add geo coordinates to 4 city schemas** — Only Fort Lee has coords; Englewood, Hackensack, Paramus, Ridgewood missing
3. [ ] **Fix homepage SERP title length** — 75 chars composed (target: 50-60). Shorten raw title.
4. [ ] **Fix portfolio SERP title length** — 47 chars composed (target: 50-60). Add location keyword.

### This Month

1. [ ] **Add location keywords to homepage H1** — Currently "Growing Businesses", should include "New Jersey"
2. [ ] **Add location keywords to service page H2s** — 0-40% compliance on web dev/SEO pages
3. [ ] Submit to 5+ directories (Clutch, DesignRush, UpCity, Yelp, BBB) — still 0 citations
4. [ ] Activate GBP (weekly posts, Q&A seeding, 10+ photos, respond to 7 reviews)
5. [ ] Publish 10 draft blog posts (ready for scheduling)
6. [ ] Add BreadcrumbList schema to /services, /about, /portfolio
7. [ ] Add service page links to city pages (cross-linking opportunity)

### This Quarter

1. [ ] 10+ GBP reviews (current: 7, no new since Feb — stagnant for 2+ months)
2. [ ] 25+ local citations/backlinks (current: 0)
3. [ ] Target "web design agency NJ" (880 monthly searches) — highest volume keyword, still NR
4. [ ] All 5 priority cities in top 10 (current: HCK #22, FL #29, ENG #27, PAR #29, RDG #43)
5. [ ] Not-indexed pages → 0 (current: 89, rose from 65 due to new area pages)

---

## Checklist Maintenance

**How to update this file:**

1. Check off items as they're completed
2. Add dates in Notes column when tasks complete
3. Update progress count at top
4. Add new items as strategy evolves

**Review Schedule:**

- Weekly: Check off completed items
- Monthly: Add new tasks based on strategy
- Quarterly: Full audit and reorganization

---

_Last Updated: 2026-03-14_
_Next Review: 2026-04-14_

# SEO Implementation Checklist

> Progress: 36/57 Complete (63%)
> Last Updated: 2026-02-24

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
- [ ] **NEW: Fix 51 crawl errors from site restructure** (removed /packages, service page changes) ⚠️ CRITICAL

---

## Structured Data (Schema)

### Implemented

- [x] LocalBusiness schema (global)
- [x] Per-city LocalBusiness schema (all 10 cities)
- [x] Organization schema
- [x] BreadcrumbList schema (all city pages)
- [x] Service schema (3 per city page)
- [x] FAQPage schema (/faq + city pages)
- [x] BlogPosting schema (blog posts)

### Validation

- [x] Google Rich Results Test - LocalBusiness (Jan 2026 audit: schema present)
- [x] Google Rich Results Test - FAQ (Jan 2026 audit: schema present)
- [x] Google Rich Results Test - Breadcrumbs (Jan 2026 audit: schema present)
- [ ] No schema errors in Search Console

---

## On-Page SEO

### Metadata

- [x] Unique Title Tags (50-60 chars) - All pages
- [x] Meta Descriptions (120-160 chars) - All pages
- [x] Keywords in title tags - Priority cities
- [x] Keywords in meta descriptions - Priority cities

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

### This Week (Priority) - Updated 2026-02-24

1. [ ] **Fix 51 crawl errors** - GSC shows errors spiked from 13→51 after site restructure (CRITICAL)
   - Identify which removed pages (packages, old service paths) are causing 404s
   - Add proper 301 redirects for all removed pages
2. [ ] **Monitor rankings** - Avg position dropped 12→15.6 due to restructure; expect recovery in 4-6 weeks
3. [ ] Submit to 5 directories (Clutch, DesignRush, UpCity, Yelp, BBB)
4. [ ] Add noindex to dashboard/auth pages for defense-in-depth
5. [ ] Capture Lighthouse baseline (mobile + desktop)
6. [ ] **Set up rank tracking tool** — no per-keyword data available this audit cycle

### This Month

1. [ ] Submit to all 12 directories (0/12 complete)
2. [ ] Increase GBP activity (weekly posts, Q&A seeding, 10+ photos)
3. [ ] Create "Website Cost Guide" blog post (high search intent)
4. [ ] Optimize meta descriptions for Englewood/Teaneck keywords (have impressions, 0 clicks)
5. [ ] Publish "Template vs. Custom" comparison post

### This Quarter

1. [ ] All 5 priority cities in top 10 positions (currently: Englewood ~10.6)
2. [ ] 10+ GBP reviews (current: 0)
3. [ ] 25+ local citations/backlinks (current: 0)
4. [ ] 5 new blog posts published (current: 10 total)
5. [ ] Industry + city hybrid pages created

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

_Last Updated: 2026-02-24_
_Next Review: 2026-03-24_

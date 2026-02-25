# SEO Changelog

> Track all SEO changes and their impact

## How to Use

Record every SEO change with:

- **Date** - When the change was made
- **Category** - Technical / On-Page / Content / Local / Off-Page
- **Change** - What was done
- **Rationale** - Why it was done
- **Files Affected** - What code/pages changed
- **Expected Impact** - Prediction
- **Actual Impact** - Fill in after 2-4 weeks

---

## Entry Template

```markdown
### YYYY-MM-DD

**Category:** [Technical / On-Page / Content / Local / Off-Page]

**Change:** [What changed]

**Rationale:** [Why]

**Files Affected:**

- [file/page 1]
- [file/page 2]

**Expected Impact:** [Prediction]

**Actual Impact:** [Fill in after 2-4 weeks]

---
```

---

## 2026 Changes

### 2026-02-24 - Full SEO Audit

**Type:** Full Audit
**Overall Score:** 81/100 (B+) — up from 78/100 (+3)

**Scores by Category:**

| Category      | Score  | vs Last | Grade | Notes                                                    |
| ------------- | ------ | ------- | ----- | -------------------------------------------------------- |
| Technical SEO | 79/100 | -9      | B     | Crawl errors spiked 13→51 from site restructure         |
| On-Page SEO   | 94/100 | +4      | A     | Redesign improved metadata and schema coverage           |
| Content       | 70/100 | -2      | C     | No new blog posts since Jan 20; new positioning needs content |
| Local SEO     | 76/100 | +11     | B     | GBP now verified with 7 reviews at 5.0 ⭐               |

**GSC Performance Snapshot (Last 28 days - Feb 2026):**

| Metric          | Jan 2026 | Feb 2026 | Change |
| --------------- | -------- | -------- | ------ |
| Impressions     | 206      | 178      | -14%   |
| Clicks          | 13       | 9        | -31%   |
| CTR             | 6.3%     | 5.1%     | -1.2pp |
| Avg Position    | ~12      | 15.6     | worse  |
| Indexed Pages   | 42       | 36       | -6     |
| Crawl Errors    | 13       | **51**   | ⚠️ +38 |

**GBP Performance (Last 28 days - Feb 2026):**

| Metric              | Previous  | Feb 2026 | Notes              |
| ------------------- | --------- | -------- | ------------------ |
| Profile Views       | 109/6wks  | 124      | ✅ Improving       |
| Search Appearances  | <50       | <50      | Stable             |
| Direction Requests  | N/A       | 33       | ✅ Strong signal   |
| Phone Calls         | N/A       | 0        | ⚠️ Zero calls      |
| Website Clicks      | N/A       | 4        | ⚠️ Very low        |
| Reviews             | 0         | **7**    | ✅ Up from 0!      |
| Avg Rating          | N/A       | **5.0**  | ✅ Perfect         |

**Context: Major Site Restructure (Feb 2026)**

- Entire website redesigned and repositioned
- `/packages` page removed (was targeting "affordable web design" keywords)
- Services section redesigned — custom solutions, no template packages
- New positioning: premium custom work, not price-competitive templates
- This restructure explains: crawl error spike, avg position decline, fewer indexed pages

**Key Findings:**

1. **⚠️ CRITICAL: 51 crawl errors** — Removed pages generating 404s; need 301 redirects immediately
2. **Rankings in flux** — Position 15.6 avg (was 12); expected temporary decline post-restructure
3. **GBP is now active** — 7 reviews at 5.0, 33 direction requests; profile driving real signals
4. **On-page quality improved** — Redesign raised on-page score from 90→94
5. **Packages keyword orphaned** — "affordable web design Bergen County NJ" lost its target page
6. **No rank tracking tool** — Cannot track per-keyword positions; operating blind

**Issues Identified:**

- [Critical] 51 crawl errors — up from 13 (site restructure 404s)
- [Critical] No 301 redirects for removed pages (packages, old service paths)
- [Warning] Avg position regressed 12→15.6 (expected post-restructure but monitor closely)
- [Warning] 0 phone calls from GBP despite 124 profile views
- [Warning] No new blog content since Jan 20 (35+ days gap)
- [Warning] New "custom solutions" positioning has no supporting blog content yet
- [Info] No rank tracking tool — per-keyword data unavailable

**Actions Recommended:**

1. [ ] **Fix 51 crawl errors** — Audit removed pages and add 301 redirects in next.config.js
2. [ ] **Set up rank tracking** — Google Search Console position tracking or free tool (e.g., Ahrefs free, Semrush trial)
3. [ ] **Write content for new positioning** — "Why we don't use templates" / "Custom vs template websites" — directly addresses rebrand
4. [ ] **Publish drafts** — 11 blog posts sitting in draft; push at least 2 live
5. [ ] **Activate GBP** — Post weekly, add 10+ photos, respond to all 7 reviews
6. [ ] **Submit to directories** — Still 0 citations; Clutch, DesignRush, UpCity minimum
7. [ ] **Redirect /packages keyword** — "affordable web design Bergen County NJ" target page gone; update keyword doc target to /services

**Checklist Progress:** 63% complete (+1% since last audit — GBP verified milestone hit)

**Files Updated:**

- docs/seo/SEO-KEYWORDS.md — Added Feb 2026 GSC aggregate data, updated tracking table
- docs/seo/SEO-CHECKLIST.md — Fixed GBP verified status, added crawl error action, updated analytics items
- docs/seo/SEO-CHANGELOG.md — Added this audit entry
- docs/seo/SEO-SCOPE.md — Updated KPI table with current metrics

---

### 2026-01-20 - Full SEO Audit

**Type:** Full Audit
**Overall Score:** 78/100 (B)

**Scores by Category:**

| Category      | Score  | Grade | Notes                                        |
| ------------- | ------ | ----- | -------------------------------------------- |
| Technical SEO | 88/100 | A     | Excellent foundation, minor noindex gaps     |
| On-Page SEO   | 90/100 | A     | All metadata, OG, Twitter cards implemented  |
| Content       | 72/100 | C     | 10 blog posts, city pages excellent, cadence needed |
| Local SEO     | 65/100 | D     | GBP verified but low engagement, citations missing |

**Key Findings:**

1. **Strong Technical Foundation:** All core technical SEO elements in place (robots.txt, sitemap, canonicals, comprehensive schema)
2. **Indexing Issues:** 29 pages not indexed (13 redirect issues, 10 canonical alternates, 2 crawled-not-indexed)
3. **SEO Keywords Gaining Traction:** "local seo agency englewood nj" now at position 10.6, Teaneck keywords emerging
4. **Traffic Still Low:** 13 clicks in 28 days, most from branded searches (pixelverse studios)
5. **GBP Underperforming:** Only 31 interactions, 109 views in 6 weeks - needs activation

**GSC Performance Snapshot (Last 28 days):**

- Total Clicks: 13
- Total Impressions: 206
- Overall CTR: 6.3%
- Avg Position: ~12
- Indexed Pages: 42
- Not Indexed: 29

**GBP Performance (Dec 2025 - Jan 2026):**

- Profile Views: 109
- Business Interactions: 31
- Search Appearances: <50

**Issues Identified:**

- [Critical] 13 pages with redirect issues in GSC
- [Warning] 2 pages "crawled - currently not indexed"
- [Warning] No clicks from non-branded keywords (0% CTR on all target keywords)
- [Warning] GBP engagement very low (31 interactions)
- [Info] Dashboard pages missing explicit noindex metadata (relying on robots.txt)
- [Info] Auth pages (/login) not noindex protected

**Actions Recommended:**

1. [ ] Fix 13 redirect issues identified in GSC
2. [ ] Investigate "crawled - not indexed" pages
3. [ ] Add noindex to dashboard and auth pages for defense-in-depth
4. [ ] Increase GBP activity (weekly posts, Q&A, photos)
5. [ ] Submit to 10+ local directories for citation building
6. [ ] Create "Website Cost Guide" blog post (high-search intent)
7. [ ] Improve CTR with meta description optimization for ranking keywords

**Checklist Progress:** 62% complete (+4% since initialization)

**Files Updated:**

- docs/seo/SEO-KEYWORDS.md - Added Jan 2026 rankings and GSC query data
- docs/seo/SEO-CHECKLIST.md - Marked schema validation items complete
- docs/seo/SEO-CHANGELOG.md - Added this audit entry

---

## 2025 Changes

### 2025-12-22

**Category:** Documentation / Planning

**Change:** SEO Scope Initialization - Created comprehensive /docs/seo/ documentation suite

**Rationale:** Establish centralized, living SEO documentation separate from legacy planning files. Provides clear strategy, keyword targets, competitor analysis, and implementation checklist.

**Files Affected:**

- docs/seo/SEO-SCOPE.md (created)
- docs/seo/SEO-KEYWORDS.md (created)
- docs/seo/SEO-COMPETITORS.md (created)
- docs/seo/SEO-CHECKLIST.md (created)
- docs/seo/SEO-CHANGELOG.md (created)

**Expected Impact:** Better SEO execution through clear documentation and tracking

**Actual Impact:** [Baseline established - measure against future progress]

---

### 2025-12-XX (Previous Work - From Legacy Docs)

**Category:** On-Page / Content

**Change:** Phase 3 Hyper-Local Content Optimization completed for all 5 priority cities

**Rationale:** Expand city page content to 1,500+ words with local landmarks, industry sections, and FAQs to improve local rankings.

**Files Affected:**

- app/services/[city]/page.tsx
- data/services-city-pages.ts

**Expected Impact:** Fort Lee and Englewood to top 5; Hackensack, Paramus, Ridgewood to top 20

**Actual Impact:** [Monitor via GSC - track in monthly reviews]

---

### 2025-12-XX (Previous Work - From Legacy Docs)

**Category:** Technical

**Change:** Per-city LocalBusiness + Service schema implemented for all 10 cities

**Rationale:** Improve local SEO signals and enable rich results for each service area

**Files Affected:**

- lib/structured-data.ts
- app/services/[city]/page.tsx

**Expected Impact:** Better local pack visibility, potential rich results

**Actual Impact:** [Pending - validate with Rich Results Test]

---

## Milestones

| Date       | Milestone                | Metrics Before | Metrics After       |
| ---------- | ------------------------ | -------------- | ------------------- |
| 2025-12-22 | SEO Scope Initialized    | N/A            | Baseline documented |
| 2025-12-XX | Phase 3 Content Complete | Fort Lee: ~10  | TBD                 |
| -          | Fort Lee Top 5           | Position ~10   | -                   |
| -          | Englewood Top 5          | Position ~12   | -                   |
| -          | GBP Verified             | Not verified   | -                   |
| -          | First 10 Reviews         | 0 reviews      | -                   |
| -          | 25 Citations Complete    | 0 citations    | -                   |

---

## Monthly Summary Format

Use this format for monthly rollup entries:

```markdown
### Month YYYY Summary

**Traffic:**

- Organic sessions: X (change: +/-%)
- Clicks (GSC): X (change: +/-%)

**Rankings:**

- Fort Lee "web design": Position X
- Englewood "SEO agency": Position X
- [other keywords]

**Local:**

- GBP views: X
- Reviews: X total
- Citations: X total

**Content:**

- New posts: X
- Pages updated: X

**Key Wins:**

- [Notable achievements]

**Issues/Blockers:**

- [Problems encountered]

**Next Month Focus:**

- [Priorities for next period]
```

---

## Change Categories Reference

| Category      | Includes                                                                |
| ------------- | ----------------------------------------------------------------------- |
| **Technical** | Core Web Vitals, schema, sitemap, robots, redirects, speed optimization |
| **On-Page**   | Title tags, meta descriptions, H1s, content structure, internal linking |
| **Content**   | Blog posts, city page content, FAQ expansion, new pages                 |
| **Local**     | GBP updates, citations, NAP consistency, reviews                        |
| **Off-Page**  | Backlinks, directory submissions, partnerships                          |

---

_Changelog Started: 2025-12-22_
_Maintained By: Phil & Sami_

# GSC Indexing Audit — 2026-03-15

## Overview

Google Search Console reports **103 not-indexed pages** and **24 indexed pages** as of March 9, 2026.

## Not-Indexed Breakdown

| Reason | Count | Action Needed |
|--------|-------|---------------|
| Discovered - currently not indexed | 47 | Monitor — Google hasn't crawled yet |
| Crawled - currently not indexed | 20 | Monitor — Google chose not to index |
| Page with redirect | 18 | Expected — old URLs with proper 301s |
| Alternate page with proper canonical tag | 9 | DEV-493 (www fix) should resolve |
| Redirect error | 4 | Fixed — removed duplicate Netlify redirects |
| Excluded by 'noindex' tag | 3 | Expected — dashboard/login pages |
| Blocked by robots.txt | 2 | Expected — /api/ endpoints |

## Root Cause

The site underwent a major restructure in Jan-Feb 2026:
- Removed `/packages` page
- Removed 10 city service pages (`/services/fort-lee`, etc.)
- Removed 11 city contact pages (`/contact/fort-lee`, etc.)
- Removed `/services/ux-ui-design` and sub-pages
- Converted `/contact` query params to routes
- Removed `/services/bergen-county`

All removed pages have proper 301 redirects in `next.config.js`. Google is still processing these redirects — the "discovered - not indexed" (47) and "page with redirect" (18) categories are expected and will resolve over 4-8 weeks.

## Timeline

| Date | Not Indexed | Indexed | Event |
|------|-------------|---------|-------|
| Dec 14, 2025 | 31 | 41 | Baseline |
| Jan 20, 2026 | 45 | 43 | First restructure batch |
| Feb 24, 2026 | 58 | 29 | Second restructure batch |
| Mar 3, 2026 | 101 | 26 | Major crawl discovered old URLs |
| Mar 7, 2026 | 103 | 24 | Current state |

## Code Fixes Applied (DEV-494)

1. **Removed duplicate Netlify redirects** — `/works` and `/pricing` rules in `public/_redirects` duplicated Next.js config and caused 2-hop redirect chains for non-www visitors. This likely caused some of the 4 "redirect error" pages.

2. **Removed `/docs/seo` from sitemap** — Internal SEO dashboard page was incorrectly included in `app/sitemap.ts`. Already had `noindex` meta tag but was sending mixed signals by being in the sitemap.

3. **Added `/login` to robots.txt disallow** — Auth page had `noindex` meta but wasn't blocked by robots.txt. Defense-in-depth.

4. **Synced `next-sitemap.config.js` robots** — Legacy config file updated to match `app/robots.ts`.

## Previous Fix (DEV-493)

- Standardized `siteUrl` to www in `lib/metadata.ts` — resolves the 9 "alternate page with proper canonical tag" issues where Google saw www and non-www as duplicates.

## Manual Actions Required

1. **Request reindexing** for all 24 currently-indexed pages via GSC URL Inspection
2. **Monitor** the 47 "discovered - not indexed" pages over 4-8 weeks
3. **Check back** on the 20 "crawled - not indexed" pages — if they persist after 8 weeks, investigate content quality

## Current Sitemap (21 URLs)

11 static pages + 8 blog posts + 3 portfolio case studies. No redirected URLs in sitemap.

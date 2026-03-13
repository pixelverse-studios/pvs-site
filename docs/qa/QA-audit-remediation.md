# QA Build: SEO Audit Remediation

**Branch:** dev/audit-remediation (merged into staging)
**PR:** #179
**Date:** 2026-03-04
**Testers:** Phil, Sami
**Environment:** Staging

---

## What's New in This Build

### Contact Page Restructure
- The contact page is now split into 3 separate URLs: `/contact/details`, `/contact/call`, `/contact/review`
- Visiting `/contact` redirects to `/contact/details`
- Visiting `/audit` redirects to `/contact/review`
- Old query string URLs (`?path=details`, `?path=call`, `?path=review`) redirect to the new clean URLs
- The tab selector at the top of the contact page now updates the browser URL when you switch tabs
- Each tab has its own page title and description for search engines

### Contact Form Error Messages
- If the "Share Project Details" or "Request a Website Review" form fails to submit, the error message now says "email us directly" with a clickable email link — instead of linking back to the same page

### Content Expansions (7 pages)
- Portfolio landing page has more intro text
- Services overview page has a longer hero description
- Contact page hero explains the three contact options and response time
- All 3 case studies (Jones Pressure Washing, 360 Degree Care, Domani) have expanded problem/solution/outcome text
- FAQ intro section has added context

### Homepage Performance
- The hero section loads immediately (no flash of empty space before content appears)
- The Google Maps embed in the footer lazy-loads — it only appears when you scroll near it
- SiteBehaviour analytics tracking now defers until the page is fully loaded

### Blog & SEO Metadata
- 6 blog post titles shortened for better display in search results
- Web Development service page title shortened
- All 8 blog meta descriptions shortened to under 160 characters
- Heading hierarchy fixed on the contact page (accessibility improvement)

### Footer Changes
- Email links in the footer now go to the contact form instead of showing the email address
- Google Maps embed loads lazily (appears when you scroll to the footer)

### New: llms.txt File
- A new file at `/llms.txt` helps AI tools understand the site's content

### Email Security (DNS — not visible on site)
- Fixed SPF record syntax
- Added DMARC email security record

### SiteBehaviour Analytics
- Heatmap and session recording tracking restored (was silently blocked)

---

## Test Scenarios

### A. Contact Page Routes & Navigation

| # | Step | Expected Result | Pass? |
|---|------|-----------------|-------|
| 1 | Visit `/contact` | Redirects to `/contact/details` — "Share Project Details" form is visible | |
| 2 | Click the "Schedule a Call" tab | URL changes to `/contact/call` — Calendly section is visible | |
| 3 | Click the "Request a Review" tab | URL changes to `/contact/review` — website review form is visible | |
| 4 | Click the "Share Details" tab | URL changes to `/contact/details` — details form is visible | |
| 5 | Visit `/contact/call` directly | "Schedule a Call" tab is active, Calendly section shows | |
| 6 | Visit `/contact/review` directly | "Request a Review" tab is active, review form shows | |
| 7 | Visit `/audit` | Redirects to `/contact/review` | |
| 8 | Visit `/contact?path=review` | Redirects to `/contact/review` | |
| 9 | Visit `/contact?path=call` | Redirects to `/contact/call` | |
| 10 | Visit `/contact?path=details` | Redirects to `/contact/details` | |

### B. Contact Details Form (Share Project Details)

| # | Step | Expected Result | Pass? |
|---|------|-----------------|-------|
| 1 | Visit `/contact/details` and leave all fields empty, click Submit | Validation errors appear on required fields | |
| 2 | Fill in all required fields and submit | Success message appears: "We've received your details" | |
| 3 | After success, check that the form fields are cleared | All fields reset to empty/default | |
| 4 | Simulate a network error (disconnect wifi, submit) | Error message appears with "email us directly" link | |
| 5 | Click the "email us directly" link in the error message | Opens your email client with `info@pixelversestudios.io` | |

### C. Website Review Form (Request a Review)

| # | Step | Expected Result | Pass? |
|---|------|-----------------|-------|
| 1 | Visit `/contact/review` and submit with empty fields | Validation errors on Name, Email, and Website URL | |
| 2 | Enter a website URL without "https://" (e.g., `www.example.com`) | Form accepts it — no validation error | |
| 3 | Check all 4 specifics checkboxes individually | Each checkbox toggles independently | |
| 4 | Click "All of the above" checkbox | All 4 specifics checkboxes become checked | |
| 5 | Click "Other" checkbox | A text input appears below for additional detail | |
| 6 | Fill everything and submit | Success message appears: "We've received your request" | |
| 7 | Simulate a network error and check error message | Error shows with "email us directly" mailto link | |

### D. Homepage Performance & Content

| # | Step | Expected Result | Pass? |
|---|------|-----------------|-------|
| 1 | Load the homepage on mobile (or throttle to Slow 3G in DevTools) | Hero text and CTA button appear immediately — no blank flash before content | |
| 2 | Scroll down the homepage | All sections load normally (case studies, testimonials, FAQ, etc.) | |
| 3 | Check the hero badge area | Shows Google rating (e.g., "5.0 on Google") | |
| 4 | Open DevTools > Lighthouse and run a mobile performance audit | Score should be improved from previous build | |

### E. Footer (All Pages)

| # | Step | Expected Result | Pass? |
|---|------|-----------------|-------|
| 1 | Visit any page and scroll to the footer | Footer appears with Split Panel layout (map on left, info on right) | |
| 2 | Watch the map area as you scroll toward the footer | Map loads only when you get close — not on initial page load | |
| 3 | Once loaded, hover over the map | Map becomes full color (transitions from grayscale) | |
| 4 | Click the map | Interactive — can zoom/pan within the embedded Google Maps | |
| 5 | Look for any plain text email addresses in the footer | None visible — email link should say "Email Us" and go to the contact form | |

### F. Blog & Service Page Metadata

| # | Step | Expected Result | Pass? |
|---|------|-----------------|-------|
| 1 | Visit any blog post and check the browser tab title | Title should be under 60 characters | |
| 2 | Right-click > View Page Source on a blog post, search for `meta name="description"` | Description should be under 160 characters | |
| 3 | Visit `/services/web-development` and check the tab title | Shorter than before — under 60 characters | |
| 4 | Visit the blog CTA section ("Book a strategy call" button) | Links to `/contact/call` (not `/contact`) | |

### G. Content Expansions

| # | Step | Expected Result | Pass? |
|---|------|-----------------|-------|
| 1 | Visit `/portfolio` | Intro section has additional narrative text about the approach | |
| 2 | Visit `/services` | Hero description is longer with deeper service explanations | |
| 3 | Visit `/contact/details` | Hero section explains the three contact paths and mentions response time | |
| 4 | Visit any individual case study (e.g., `/portfolio/jones-pressure-washing`) | Problem, solution, and outcome sections have more detail than before | |
| 5 | Visit `/faq` | Intro section includes navigation context about the categories | |

### H. llms.txt File

| # | Step | Expected Result | Pass? |
|---|------|-----------------|-------|
| 1 | Visit `/llms.txt` in the browser | A plain text markdown file loads with company info, services, portfolio links | |
| 2 | Check that all links in the file are clickable and work | Each URL resolves to a live page | |

### I. SiteBehaviour Analytics

| # | Step | Expected Result | Pass? |
|---|------|-----------------|-------|
| 1 | Visit any page and open DevTools > Network tab | Look for requests to `*.sitebehaviour.com` — they should succeed (200) | |
| 2 | Check that no CSP errors appear in the Console tab | No "Refused to connect" errors for sitebehaviour domains | |

---

## Edge Cases to Verify

| Scenario | Expected Behavior |
|----------|-------------------|
| Visit `/contact/details` on mobile, switch tabs rapidly | URL updates correctly, no layout jump or broken state |
| Submit contact details form, then hit browser Back button | Should navigate back normally (not re-submit) |
| Visit `/contact/review` with no internet, then reconnect and submit | Form submits successfully after reconnection |
| Load homepage with JavaScript disabled | Hero content still visible (server-rendered), below-fold sections may not load |
| Visit `/llms.txt` — check for broken links | All URLs should resolve (no 404s) |
| Resize browser from desktop to mobile on contact page | Tab selector and form layout adapt cleanly |
| Double-click the Submit button on either contact form | Only one submission occurs (throttle prevents duplicates) |

---

## Regression Checks

- [ ] Homepage loads fully — hero, sections, testimonials, FAQ
- [ ] Dark mode toggle works on all pages
- [ ] Navigation bar links work (desktop and mobile hamburger)
- [ ] All portfolio case study pages load (`/portfolio/jones-pressure-washing`, `/360-degree-care`, `/domani`)
- [ ] Services pages load (`/services`, `/services/web-development`, `/services/seo`)
- [ ] FAQ page loads with accordion questions expanding/collapsing
- [ ] Blog listing page loads (`/blog`)
- [ ] Blog article pages load (click any post)
- [ ] Dashboard login works (`/login`)
- [ ] Footer appears on all public pages
- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] Mobile navigation opens and closes cleanly

---

## Known Issues / Notes

- **DEV-406 (deferred):** Facebook social link still uses a long URL — blocked on Facebook vanity URL setup (not part of this build)
- **DEV-410 (deferred):** Facebook Pixel is not installed — needs Pixel ID from Meta Business Suite
- **DNS changes (SPF/DMARC):** These are already live (DNS records, not code) — no staging verification needed
- **SiteBehaviour:** Requires the `NEXT_PUBLIC_SITEBEHAVIOUR_SECRET` env var to be set on the staging environment to test analytics tracking

---

## How to Report Issues

When you find something broken or unexpected:

1. **Steps to reproduce** — What did you do? (e.g., "Visited /contact/review, filled in the form, clicked Submit")
2. **Expected result** — What should have happened?
3. **Actual result** — What happened instead?
4. **Screenshot or screen recording** — Capture what you see
5. **Device/browser** — e.g., iPhone 15 Safari, Chrome desktop, etc.

Share in our Linear project or message Phil directly.

# Direction A: Must Fix Before Paid Traffic

Date: 2026-11-18
Status: **On hold until the 2026-11-20 direction meeting with Sami.** Once a direction is set, these are the first items to address, before any other Direction A site work and before any ad money is spent.
Source: Direction A website audit (Claude Doc "Direction A: Website Changes", https://claude.ai/artifact/UVD7rHsrmBkVE7VQ5d3DqZ). Related: `docs/planning/ad-spend-site-plan.md`.

## Why these come first

Each item is already live today. With organic traffic they are minor; with paid traffic they either cost trust with a buyer who is comparing agencies, or stop us from measuring what the ads produce. Most are copy or config fixes, not builds.

Several of these matter even if Friday's meeting lands on a different direction. Items 1–3 and 5 are worth doing regardless.

> **Work from `main`.** File references below were checked against `main` on 2026-11-18. The `dev-1404-user-insights` branch is 8 commits behind and shows older pricing.

## The list

### 1. About page testimonials are marked as placeholders

- **Where:** `data/about.ts`, the `testimonials` block, commented "placeholders — replace with real quotes". The quotes are attributed to real clients (Gladstone Wealth Partners, Iffers Pictures, Jones Pressure Washing NJ).
- **Risk:** If any quote was not written or approved by that client, it is a made-up testimonial shown under a real business's name. Google Ads policy and FTC endorsement rules both treat that as misleading.
- **Fix:** Confirm each quote with the client in writing, or replace it with a real one (GBP review text with permission works). Remove the "placeholder" comment once confirmed.
- **Same block:** `googleReviews` shows `rating: 5.0` with `reviewCount: 0`, also marked placeholder. Use real GBP numbers or hide the badge until there are reviews.

### 2. Domani is shown as client work on the homepage

- **Where:** `data/case-studies.ts`, the `domani` entry has `featured: true`, so it appears in the homepage case study section (`data/homepage.ts` filters on `featured`).
- **Risk:** Domani is our own product. Presenting it beside client work reads as padding the portfolio once a prospect looks closer.
- **Fix:** Unfeature it from the homepage client carousel, or relabel it clearly as "our own product" (in-house build) per the ad spend plan's guardrail.

### 3. No privacy page

- **Where:** No `/privacy` route exists. The site collects names, emails, phones and business details through the contact and review forms, and runs GTM, GA4, Clarity, SiteBehaviour and Sentry replays.
- **Risk:** Google Ads expects a privacy policy on sites that collect personal data; ad review can flag or limit the account. Buyers also look for it before submitting a form.
- **Fix:** Add `/privacy` (indexable, linked from the footer and under each form's submit button). Cover what the forms collect, which analytics tools run, how lead data is stored, and how to ask for deletion.

### 4. Security headers would block Google Ads conversion tracking

- **Where:** `next.config.js` Content-Security-Policy. `script-src`, `connect-src` and `frame-src` allow Google Analytics and Tag Manager but none of the Google Ads domains (`googleadservices.com`, `googleads.g.doubleclick.net`, `*.doubleclick.net`, `www.google.com` for the conversion pixel).
- **Risk:** Ads conversion tags in GTM would load but their requests get blocked, so Google Ads reports zero conversions and Smart Bidding has nothing to learn from. Paid spend runs blind.
- **Fix:** Add the Google Ads domains to the CSP, then verify a test conversion in Google Ads Tag Assistant from production before launching campaigns.

### 5. The site promises different reply times

- **Where:**
  - `components/contact/contact-hero.tsx`: "within one business day"
  - `components/contact/contact-details-form.tsx`: "within 1–2 business days"
  - `components/contact/contact-review-form.tsx`: "within 1–2 business days"
  - `data/web-development-content.ts`: "same-day response for urgent issues" (support plans)
- **Risk:** A paid lead who sees "one business day" on the page and "1–2 business days" after submitting is already let down. Speed to reply is the biggest lever on ad lead conversion.
- **Fix:** Pick one promise we can keep (ideally same-business-day for new leads, paired with the lead alert in the ad spend plan) and use it everywhere. Keep the support-plan wording separate and clearly about existing clients.

## Also blocking ads (already tracked elsewhere)

These are in `docs/planning/ad-spend-site-plan.md` step 1 and are not repeated here: verify the three key events arrive in GA4 from production, mark them as key events, link Google Ads, confirm the API stores the `attribution` object, decide on call tracking, and set up a new-lead alert.

## Checklist

- [ ] 1. Testimonials confirmed or replaced; review badge uses real data or is hidden
- [ ] 2. Domani unfeatured or labeled as our own product
- [ ] 3. `/privacy` page live and linked from footer and forms
- [ ] 4. Google Ads domains added to CSP; test conversion verified in production
- [ ] 5. One reply-time promise used across the site

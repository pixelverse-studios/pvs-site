# Ad Spend Site Plan

Date: 2026-11-14
Source: "Scaling PixelVerse: Where to Point Our Ad Spend" (2026-11-14)
Status: Proposed, pending Sami's answers to the doc's open questions (offer contents, monthly price, ad budget)

## Summary

Phase 1 of the ad plan sells **websites with built-in tools on a monthly plan** to local service businesses. That is the same Bergen County audience the hyper-local SEO work already targets, so the site does not need a repositioning. It needs one new offer, ad landing pages that match it, finished conversion tracking, and a low-key home for custom tooling proof.

Paid channel for Phase 1: **Google Search ads**. LinkedIn is deferred to Phase 2 (custom tooling), after 2–3 paid tooling case studies exist.

## Guardrails

- Do not change URLs of existing service, area, or city pages. Copy-only changes there.
- Ads never point at the homepage or the SEO service page.
- Present the PVS operations dashboard and Domani as in-house builds ("we build and run our own software"), never as client work.
- No personal data to GA4, GTM, or Google Ads (see `ga4-gtm-attribution-plan.md`).

## Work, in priority order

### 0. Must fix before paid traffic

Do these first, once the 2026-11-20 direction meeting sets a direction: placeholder testimonials, Domani shown as client work, no privacy page, CSP blocking Google Ads, and mixed reply-time promises. Details and file locations: `docs/planning/direction-a-must-fix.md`.

### 1. Finish measurement (blocks ad launch)

GA4 and GTM are already live: container `GTM-MQ2ZHGGN` → stream `G-87XLH0YW51`. The forms already send an `attribution` object (`lib/attribution.ts`). Remaining:

- [ ] Verify `generate_lead`, `website_review_request`, and `strategy_call_scheduled` arrive in GA4 from production (only `cta_click` and `lead_form_start` were confirmed so far, in Preview).
- [ ] Mark those three as GA4 key events (the 2026-10-12 seven-day view showed zero key events).
- [ ] Link Google Ads to GA4 and import the key events as Ads conversions. Confirm auto-tagging (`gclid`) is on.
- [ ] Confirm the API persists the `attribution` payload on leads, audits, and strategy calls, and that the dashboard prospect pipeline shows lead source.
- [ ] Decide on call tracking. `phone_click` is intent only; local service buyers often call. Options: Google Ads call assets with call reporting, or a tracking number on ad landing pages only (keep the main NAP number unchanged everywhere else for local SEO).
- [ ] Lead alert so someone answers within an hour (email/SMS from the API on new lead).

### 2. "Website + Tools" offer page

New service page, e.g. `/services/websites-with-tools` (final slug TBD).

- Lead with outcomes: fewer phone calls about prices, bookings without back-and-forth, clients who can check status themselves, an owner view of what's coming in.
- **A working demo on the page**, e.g. a quote calculator a visitor can use. It shows the custom-build skill without a "custom software" label.
- Tool menu: quote calculators, online booking, client portals, owner dashboards.
- Monthly plan pricing, added to `data/package-pricing.ts` (price pending Sami).
- Proof: Jones Pressure Washing and 360 Degree Care case studies, plus the in-house builds.
- Content lives in `/data/` per the site's data-driven pattern.

### 3. Ad landing pages (noindex)

1–2 pages that match the ad copy, with no main navigation, one offer, and one form. Matched to the industries with existing proof:

- Home services (with Jones Pressure Washing)
- Care agencies (with 360 Degree Care)

Add `noindex`, exclude them from the sitemap, and keep them out of internal links.

### 4. Custom tooling page (not advertised)

A quiet services page used for warm contacts and pilot pitches.

- Add an in-house case study for the PVS operations dashboard to `data/case-studies.ts`: client management, per-client website and SEO tracking, prospect pipeline, deployment tracking that emails clients automatically.
- Reframe the existing Domani case study as "our own product," including its admin console.
- A "Start with a paid pilot" CTA instead of public pricing.

### 5. Homepage and nav messaging (last)

Move the headline toward "websites that run your business, not just market it" and add the new offer to the nav and services overview. Copy-only; keep all existing URLs and the city-page structure.

## Not doing now

- Advertising SEO services or sending ad traffic to `/services/seo`
- Rewriting city or area pages
- Public pricing for custom tooling
- LinkedIn ads

## Channel decision: Google Search vs LinkedIn

| | Google Search (Phase 1) | LinkedIn (Phase 2) |
| --- | --- | --- |
| Buyer intent | People searching for a site or a feature now | Interrupted while browsing; no active intent |
| Fit with Phase 1 buyer | Local service owners search Google | Pressure-washing and home-care owners are rarely active on LinkedIn |
| Targeting | Bergen County radius, city + feature keywords | Job title, company size, industry: good for ops leads at roughly 20–200 employee companies |
| Cost at $2–3k/mo | Workable click volume for a 90-day test | High cost per click (often $8–15+); roughly 150–300 clicks/mo, too few to learn from |
| When | Now | After 2–3 paid tooling case studies |

Google Search setup notes:

- Keywords: city + service ("web design Fort Lee NJ"), feature intent ("website with online booking", "quote calculator for website", "client portal for small business"), vertical ("website for contractors", "home care agency website").
- Negative keywords from day one: cheap, free, template, Wix, Squarespace, GoDaddy, DIY, jobs, course.
- Campaign UTMs follow the naming table in `ga4-gtm-attribution-plan.md` (`google` / `cpc` / `lead_gen_2026`).

Phase 2 LinkedIn approach: start with Phil and Sami posting dashboard and Domani build stories plus retargeting site visitors, before any cold LinkedIn ads.

## Open questions (from the source doc)

- Offer contents and monthly plan price for Website + Tools
- Ad budget and test window (e.g. $2–3k/mo for 90 days) and kill criteria
- Which contacts become paid tooling pilots, and at what discount

# GA4 + GTM Attribution Plan

## Summary

PixelVerse Studios will add Google Analytics 4 through Google Tag Manager so analytics can scale beyond basic traffic reporting into paid ads, QR-code campaigns, offline print attribution, and conversion tracking. SiteBehaviour will continue running during the comparison period.

## Decisions

- Use Google Tag Manager as the primary tag container.
- Create GA4 and GTM from scratch.
- Use clean QR and print campaign URLs instead of printing long UTM URLs.
- Keep `/dashboard` excluded from public marketing analytics.
- Continue sending SiteBehaviour events while adding GA4/GTM events from the same analytics abstraction.
- Persist first-party campaign attribution metadata with backend lead records in the initial implementation.
- Do not send personal data to GA4, GTM, Google Ads, or Meta.

## Accounts To Create

1. Google Analytics account/property
   - Account: PixelVerse Studios
   - Property: PixelVerse Studios Website
   - Platform: Web
   - Data stream URL: `https://www.pixelversestudios.io`
   - Enhanced measurement: enabled, then reviewed for duplicate form/click events

2. Google Tag Manager account/container
   - Account: PixelVerse Studios
   - Container: PixelVerse Studios Website
   - Target platform: Web

3. Optional later accounts/integrations
   - Google Ads conversion linking
   - Meta Pixel / Conversions API
   - Looker Studio reporting dashboard

## Environment Variables

Add the following to local, staging, and production environments:

```text
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

`NEXT_PUBLIC_GTM_ID` controls script loading. `NEXT_PUBLIC_GA4_MEASUREMENT_ID` can be used for documentation, debugging, or a future direct fallback, but GTM should own GA4 dispatching.

## Implementation Architecture

1. Add a GTM script component that loads only when:
   - `NEXT_PUBLIC_GTM_ID` exists
   - `NODE_ENV === 'production'`
   - the current route is not excluded by `isTrackingExcludedRoute`

2. Extend `lib/analytics.ts` so one helper can dispatch to:
   - SiteBehaviour custom events
   - `window.dataLayer`

3. Keep `components/campaign-tracker.tsx` responsible for:
   - route-level pageview dispatch
   - campaign landing detection
   - UTM capture
   - existing `src` capture
   - existing `promo` capture
   - storing first-touch attribution in browser storage so it can be attached to later lead submissions

4. Add explicit tracking calls to conversion surfaces:
   - contact details form success
   - website review form success
   - Calendly popup click
   - Calendly scheduled callback
   - phone link clicks
   - email/contact link clicks
   - major CTA clicks to contact paths

5. Attach sanitized attribution metadata to backend conversion payloads:
   - details form submission to `/api/leads`
   - website review submission to `/api/audit`
   - Calendly scheduled event webhook payload, if the booking flow exposes enough client-side attribution safely

## Clean URL Strategy

Use short internal URLs for offline materials and redirect them to fully tagged landing URLs.

Initial clean URLs:

```text
/go/card-phil
/go/card-sami
/go/flyer
```

Initial redirect targets:

```text
/contact/details?utm_source=business_card&utm_medium=qr&utm_campaign=local_print_2026&utm_content=phil_card_v1
/contact/details?utm_source=business_card&utm_medium=qr&utm_campaign=local_print_2026&utm_content=sami_card_v1
/contact/review?utm_source=flyer&utm_medium=qr&utm_campaign=local_print_2026&utm_content=general_flyer_v1
```

The clean URL should be the QR destination. The redirect target carries the full UTM payload for GA4.

## Recommended Campaign Naming

| Channel | `utm_source` | `utm_medium` | `utm_campaign` | `utm_content` |
| --- | --- | --- | --- | --- |
| Google Ads | `google` | `cpc` | `lead_gen_2026` | ad or keyword variant |
| Meta Ads | `meta` | `paid_social` | `lead_gen_2026` | creative variant |
| Business cards | `business_card` | `qr` | `local_print_2026` | person/card version |
| Fliers | `flyer` | `qr` | `local_print_2026` | location/batch |
| Chamber/event | `event` | `qr` | event name/year | booth/card/version |
| Manual outreach | `outreach` | `direct` | campaign name | list or message version |

Use lowercase, underscores, and stable names so reports stay clean.

## GA4 Event Taxonomy

| Event | Trigger | Key Event |
| --- | --- | --- |
| `page_view` | Route transition | No |
| `campaign_landing` | First landing with UTM, `src`, or `promo` | No |
| `contact_path_select` | Contact path card click | No |
| `lead_form_start` | First meaningful details form interaction | No |
| `review_form_start` | First meaningful review form interaction | No |
| `generate_lead` | Successful details form submit | Yes |
| `website_review_request` | Successful review/audit form submit | Yes |
| `strategy_call_click` | Calendly popup opened | Optional |
| `strategy_call_scheduled` | Calendly scheduled event callback | Yes |
| `phone_click` | Public phone link click | Yes |
| `email_click` | Public email/contact link click | Optional |
| `cta_click` | Major CTA click | No |

## Safe Event Parameters

Allowed:

- `page_path`
- `page_title`
- `traffic_source`
- `traffic_medium`
- `campaign`
- `campaign_content`
- `campaign_term`
- `src_code`
- `promo_code`
- `form_type`
- `budget_range`
- `timeline`
- `interest_category`
- `contact_path`
- `cta_location`

Do not send:

- names
- emails
- phone numbers
- company names
- website URLs submitted by prospects
- freeform message text
- Calendly invitee URLs if they identify a person

## Server And Database Attribution

Analytics platforms answer aggregate marketing questions:

- Which channel drove the most sessions?
- Which campaign drove the most conversions?
- Which pages converted better?
- How did Google Ads compare with Meta or print QR traffic?

The server/database answers lead-quality and sales questions:

- Which exact submitted lead came from which campaign?
- Did that lead become qualified, closed, or retained?
- Which QR batch produced real opportunities, not just visits?
- Which ad campaign produced revenue after follow-up?
- Can we reconcile GA4 numbers if cookies, blockers, consent, or attribution windows distort reporting?

Decision: store non-sensitive attribution metadata with lead records during the initial GA4/GTM implementation. This does not replace GA4. It gives PixelVerse first-party campaign truth tied to the CRM/prospect pipeline.

Lead attribution fields to send with conversion payloads:

```text
utm_source
utm_medium
utm_campaign
utm_content
utm_term
src_code
promo_code
landing_page
conversion_page
referrer
first_seen_at
```

Avoid storing excessive browser fingerprints. Keep attribution useful and privacy-conscious.

## Backend Attribution Scope

The frontend should maintain a small attribution object with first-touch and latest-touch campaign data. On conversion, submit that object with the existing lead payload.

Recommended frontend attribution shape:

```text
first_touch: {
  utm_source
  utm_medium
  utm_campaign
  utm_content
  utm_term
  src_code
  promo_code
  landing_page
  referrer
  captured_at
}
latest_touch: {
  utm_source
  utm_medium
  utm_campaign
  utm_content
  utm_term
  src_code
  promo_code
  landing_page
  referrer
  captured_at
}
conversion: {
  conversion_page
  conversion_type
  converted_at
}
```

Backend records should store this as structured JSON if the existing API/database schema supports it. If the backend needs explicit columns, start with these columns:

```text
first_utm_source
first_utm_medium
first_utm_campaign
first_utm_content
first_utm_term
latest_utm_source
latest_utm_medium
latest_utm_campaign
latest_utm_content
latest_utm_term
src_code
promo_code
landing_page
conversion_page
referrer
```

First-touch attribution tells us what originally brought the lead in. Latest-touch attribution tells us what finally converted them. Both are useful for long sales cycles and print campaigns.

## Rollout Sequence

1. Create GA4 property and GTM web container.
2. Add environment variables to local/staging/production.
3. Implement GTM loader and `dataLayer` dispatch.
4. Extend campaign capture to include UTMs plus first-touch/latest-touch attribution storage.
5. Attach attribution metadata to backend lead, audit, and Calendly conversion payloads where available.
6. Add event calls to forms, Calendly, CTA links, phone links, and email/contact links.
7. Add clean URL redirects for initial card/flier QR campaigns.
8. Configure GA4 events and mark key events.
9. Test in GTM Preview, GA4 DebugView, and backend lead records.
10. Publish GTM container.
11. Compare SiteBehaviour, GA4, and first-party lead attribution for at least one full reporting cycle before making renewal decisions.

## Setup And QA Reference

The detailed GTM tag setup, GA4 key-event configuration, privacy rules, and frontend QA checklist live in:

```text
docs/technical/ga4-gtm-setup-and-qa.md
```

Use that checklist before publishing the GTM container and again after the first production deploy with GA4 enabled.

## Open Questions

- Will Meta Pixel be added immediately, or only after the first Meta campaign is ready?

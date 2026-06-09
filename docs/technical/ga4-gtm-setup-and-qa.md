# GA4 + GTM Setup And QA

This document is the frontend setup and validation checklist for the PixelVerse Studios GA4/GTM implementation.

## Production Inputs

- GTM container ID: `NEXT_PUBLIC_GTM_ID`
- GA4 measurement ID: `NEXT_PUBLIC_GA4_MEASUREMENT_ID`
- Public site URL: `https://www.pixelversestudios.io`
- Excluded route prefix: `/dashboard`

GTM loads only when `NEXT_PUBLIC_GTM_ID` is present and `NODE_ENV` is `production`.

## GTM Container Setup

### Tags

Create these tags in the PixelVerse Studios GTM web container.

| Tag | Type | Trigger |
| --- | --- | --- |
| Google tag - GA4 | Google tag | Initialization - All Pages |
| GA4 event - page_view | Google Analytics: GA4 Event | Custom event: `page_view` |
| GA4 event - campaign_landing | Google Analytics: GA4 Event | Custom event: `campaign_landing` |
| GA4 event - contact_path_select | Google Analytics: GA4 Event | Custom event: `contact_path_select` |
| GA4 event - lead_form_start | Google Analytics: GA4 Event | Custom event: `lead_form_start` |
| GA4 event - review_form_start | Google Analytics: GA4 Event | Custom event: `review_form_start` |
| GA4 event - generate_lead | Google Analytics: GA4 Event | Custom event: `generate_lead` |
| GA4 event - website_review_request | Google Analytics: GA4 Event | Custom event: `website_review_request` |
| GA4 event - strategy_call_click | Google Analytics: GA4 Event | Custom event: `strategy_call_click` |
| GA4 event - strategy_call_scheduled | Google Analytics: GA4 Event | Custom event: `strategy_call_scheduled` |
| GA4 event - phone_click | Google Analytics: GA4 Event | Custom event: `phone_click` |
| GA4 event - email_click | Google Analytics: GA4 Event | Custom event: `email_click` |
| GA4 event - cta_click | Google Analytics: GA4 Event | Custom event: `cta_click` |

Use the GA4 measurement ID from the Google tag for all GA4 event tags.

### Page View Rule

The frontend dispatches its own `page_view` event on route changes. In GTM/GA4, avoid double-counting by using one page view source:

1. Preferred: send page views from the frontend `page_view` dataLayer event.
2. Disable or avoid any extra GTM History Change page view tag.
3. Review GA4 enhanced measurement so it does not create duplicate page views beyond the configured Google tag behavior.

Expected behavior: one `page_view` event per public route transition.

### Data Layer Variables

Create GTM Data Layer Variables for the parameters below. Use version 2 data layer variables.

| Variable name | Data layer variable name |
| --- | --- |
| DLV - page_path | `page_path` |
| DLV - traffic_source | `traffic_source` |
| DLV - traffic_medium | `traffic_medium` |
| DLV - campaign | `campaign` |
| DLV - campaign_content | `campaign_content` |
| DLV - campaign_term | `campaign_term` |
| DLV - src_code | `src_code` |
| DLV - promo_code | `promo_code` |
| DLV - form_type | `form_type` |
| DLV - budget_range | `budget_range` |
| DLV - timeline | `timeline` |
| DLV - interest_category | `interest_category` |
| DLV - contact_path | `contact_path` |
| DLV - cta_location | `cta_location` |
| DLV - cta_destination | `cta_destination` |

Only attach variables to GA4 event tags when they are relevant to that event.

### Event Parameter Mapping

| Event | Parameters to send |
| --- | --- |
| `page_view` | `page_path` |
| `campaign_landing` | `traffic_source`, `traffic_medium`, `campaign`, `campaign_content`, `campaign_term`, `src_code`, `promo_code`, `page_path` |
| `contact_path_select` | `contact_path`, `page_path` |
| `lead_form_start` | `form_type`, `page_path` |
| `review_form_start` | `form_type`, `page_path` |
| `generate_lead` | `form_type`, `budget_range`, `timeline`, `interest_category`, `promo_code` |
| `website_review_request` | `form_type`, `promo_code` |
| `strategy_call_click` | `contact_path`, `page_path` |
| `strategy_call_scheduled` | `contact_path`, `page_path` |
| `phone_click` | `contact_path`, `page_path` |
| `email_click` | `contact_path`, `page_path` |
| `cta_click` | `cta_location`, `cta_destination`, `contact_path`, `page_path` |

## GA4 Key Events

Mark these as key events in GA4 after they first appear in Reports or Admin events:

| Event | Key event |
| --- | --- |
| `generate_lead` | Yes |
| `website_review_request` | Yes |
| `strategy_call_scheduled` | Yes |
| `phone_click` | Yes |

Optional key events:

- `strategy_call_click`
- `email_click`

Do not mark `page_view`, `lead_form_start`, `review_form_start`, `contact_path_select`, `campaign_landing`, or `cta_click` as key events by default. They are useful funnel/supporting events, not final outcomes.

## Privacy Rules

Do not configure GTM tags to send any of these values to GA4, Google Ads, Meta, or other ad platforms:

- names
- emails
- phone numbers
- company names
- submitted website URLs
- freeform project notes
- Calendly invitee URLs
- raw form payloads
- backend attribution JSON

The frontend analytics helper intentionally allowlists event parameters before pushing to `dataLayer`. Keep GTM tags aligned to that allowlist.

## Frontend QA Checklist

Run this checklist in GTM Preview, then confirm GA4 DebugView.

### Page Views

1. Open `/`.
2. Navigate to `/services`.
3. Navigate to `/contact/details`.
4. Confirm each public route transition emits exactly one `page_view` event.
5. Confirm `page_path` matches the public path and contains no query string PII.

### Campaign Landing

1. Open `/?utm_source=business_card&utm_medium=qr&utm_campaign=local_print_2026&utm_content=phil_card_v1`.
2. Confirm attribution is captured in browser storage.
3. Confirm no PII is present in GTM Preview.
4. Confirm `campaign_landing` fires once for the UTM landing and includes `traffic_source`, `traffic_medium`, `campaign`, `campaign_content`, and `page_path`.
5. Open a `src` campaign URL, such as `/?src=QR`.
6. Confirm `campaign_landing` fires once for the `src` campaign code and includes `traffic_source`, `src_code`, and `page_path`.
7. Open a `promo` campaign URL, such as `/?promo=NJCC2026`.
8. Confirm `campaign_landing` fires once for the promo code and includes `traffic_source`, `promo_code`, and `page_path`.

### Lead Form

1. Open `/contact/details`.
2. Change one meaningful form field.
3. Confirm `lead_form_start` fires once.
4. Submit a valid test lead in a safe local/staging environment.
5. Confirm `generate_lead` fires after success.
6. Inspect the backend request and confirm `attribution.first_touch`, `attribution.latest_touch`, and `attribution.conversion` are present when campaign metadata exists.
7. Confirm the GA4 event does not include name, email, phone, company, website URL, or freeform notes.

### Website Review Form

1. Open `/contact/review`.
2. Change one meaningful form field.
3. Confirm `review_form_start` fires once.
4. Submit a valid test review request in a safe local/staging environment.
5. Confirm `website_review_request` fires after success.
6. Inspect the backend request and confirm the attribution object is present when campaign metadata exists.
7. Confirm the GA4 event does not include name, email, phone, submitted website URL, or freeform notes.

### Calendly

1. Open `/contact/call`.
2. Click the Calendly CTA.
3. Confirm `strategy_call_click` fires.
4. Schedule a safe test event.
5. Confirm `strategy_call_scheduled` fires.
6. Inspect the webhook request and confirm it includes attribution metadata when campaign metadata exists.
7. Confirm GTM/GA4 does not receive Calendly invitee URLs.

### Phone And Email

1. Click the public footer phone link.
2. Confirm `phone_click` fires with `contact_path=phone`.
3. Click the public footer email link.
4. Confirm `email_click` fires with `contact_path=email`.
5. Confirm phone number and email address are not sent as event parameters.

### Dashboard Exclusion

1. Open `/dashboard`.
2. Confirm the GTM script is not loaded on an initial dashboard page load.
3. Start from `/`, then client-navigate to `/dashboard` if a link/session allows it.
4. Confirm GTM consent is updated to denied before dashboard navigation.
5. Confirm no custom marketing events fire for dashboard paths.
6. Confirm attribution capture ignores `/dashboard` even if the URL includes UTM parameters.

### QR Redirects

Check that these clean URLs preserve UTM parameters after redirect:

```text
/go/card-phil
/go/card-sami
/go/flyer
/go/nnjcc
/go/njcc
/go/njcc-live-audit
```

Expected targets:

```text
/?utm_source=business_card&utm_medium=qr&utm_campaign=local_print_2026&utm_content=phil_card_v1
/?utm_source=business_card&utm_medium=qr&utm_campaign=local_print_2026&utm_content=sami_card_v1
/?utm_source=flyer&utm_medium=qr&utm_campaign=local_print_2026&utm_content=general_flyer_v1
/?utm_source=nnjcc&utm_medium=press_release&utm_campaign=nnjcc_press_release_2026&utm_content=embedded_link
/?utm_source=njcc&utm_medium=press_release&utm_campaign=nnjcc_press_release_2026&utm_content=embedded_link
/?utm_source=njcc&utm_medium=event&utm_campaign=njcc_live_audit_sale_2026&utm_content=live_audit
```

## Local Verification Commands

Use this redirect verification command from the project root:

```bash
node -e "Promise.resolve(require('./next.config.js').redirects()).then((redirects)=>{for (const source of ['/go/card-phil','/go/card-sami','/go/flyer','/go/nnjcc','/go/njcc','/go/njcc-live-audit']) { const match = redirects.find((redirect) => redirect.source === source); console.log(source + ' -> ' + (match ? match.destination : 'MISSING')); if (!match) process.exitCode = 1; }}).catch((error)=>{ console.error(error); process.exit(1); })"
```

Run standard project verification before publishing tracking changes:

```bash
npm run type-check
npm run lint
npm run build
```

Known existing warning: `app/dashboard/domani/campaigns/components/campaign-detail-modal.tsx` has a pre-existing React hook dependency warning for `campaign`.

## Publish Checklist

1. Confirm production env vars are present.
2. Confirm GTM Preview receives the expected dataLayer events.
3. Confirm GA4 DebugView receives the expected GA4 events.
4. Mark GA4 key events.
5. Publish the GTM container.
6. Submit one safe test conversion per public conversion path.
7. Confirm backend attribution metadata lands with lead/review/Calendly records.
8. Record the first reporting comparison date for SiteBehaviour, GA4, and first-party lead attribution.

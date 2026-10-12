# GA4 + GTM Setup And QA

This document is the frontend setup and validation checklist for the PixelVerse Studios GA4/GTM implementation.

## Live Configuration Check (2026-10-12)

The public homepage contains GTM container `GTM-MQ2ZHGGN`. Before the 2026-10-12 update, its published JavaScript contained only the base Google tag for GA4 stream `G-87XLH0YW51`, firing on `gtm.init`. The user reports publishing the shared `GA4 – Marketing Events` tag and `Marketing Events` trigger after the Preview and DebugView checks below. The published version and live production event receipt have not yet been independently checked.

User-supplied screenshots on 2026-10-12 show the GTM workspace also contains only that Google tag, with zero workspace changes, and the PixelVerse GA4 Home screen shows users and page views. Its selected seven-day summary shows zero key events. This confirms the property receives some traffic; it does not establish which page-view mechanism fired or whether lead events are configured in GA4.

A subsequent user-supplied web-stream screenshot confirms stream ID `14837917074`, measurement ID `G-87XLH0YW51`, active data collection in the prior 48 hours, and Enhanced measurement enabled for page views, scrolls, and outbound clicks. The advanced page-view browser-history setting was not visible. Email redaction was active, while URL query-parameter-key redaction was inactive; inspect URL parameters for PII before changing that setting or relying on page-location reports.

The user then shared the Enhanced measurement panel. Page views remain enabled; the screenshot shows the browser-history option is available under the still-collapsed Page views advanced settings. No extra GTM `page_view` tag should be published based on this evidence. Keep the base Google tag as the page-view source and verify one view per navigation in DebugView before considering a page-view change.

The first GTM Preview test on `http://localhost:3000` showed the base Google tag firing and a homepage `cta_click` event in the event timeline. The user then saved a draft `GA4 – CTA Click` tag for stream `G-87XLH0YW51` with a `CTA Click` custom-event trigger. An older Preview session did not include the new tag, but a fresh event-specific Tag Assistant screenshot showed it under **Tags Fired** with status **Succeeded** on `cta_click`; the user confirmed receipt in GA4 DebugView. The draft was then expanded to a shared `GA4 – Marketing Events` tag. An event-specific Tag Assistant screenshot showed it firing with status **Succeeded** for `lead_form_start`, and the user confirmed that event in GA4 DebugView too. The user renamed the trigger `Marketing Events` and reports publishing the container. Successful form submissions, other event names, and production event receipt have not yet been tested.

## Production Inputs

- GTM container ID: `NEXT_PUBLIC_GTM_ID`
- GA4 measurement ID: `G-87XLH0YW51` in the GTM Google tag and GA4 Event tag
- Public site URL: `https://www.pixelversestudios.io`
- Excluded route prefix: `/dashboard`

GTM loads only when `NEXT_PUBLIC_GTM_ID` is present and `NODE_ENV` is `production`. A local production build can therefore be tested with GTM Preview at `http://localhost:3000`. `NEXT_PUBLIC_GA4_MEASUREMENT_ID` remains in the environment example for reference; the GTM tags select the GA4 destination.

## Local Preview Performance Follow-up

On 2026-10-12, while preparing a GTM test, the browser was reported to take several seconds after navigating to `http://localhost:3001`: the page stayed white and the browser tab's normal navigation loading bar remained active before content appeared. Later, the user tested the current local server in a fresh private window and reported that it opens quickly and reliably. The delay is not currently reproducible and has not been diagnosed. If it recurs, compare first and repeat requests, record browser Network timing (especially waiting/TTFB versus asset loading), and check the Next.js terminal output. Keep this separate from whether GA4 events reach DebugView.

## Microsoft Clarity

Clarity project `ywozoexc2s` is installed directly in `components/microsoft-clarity.tsx` for `pixelversestudios.io` and `www.pixelversestudios.io` in production builds. It is separate from GTM and does not emit GA4 events. The loader skips an initial `/dashboard` page and stops an active recording before client navigation into `/dashboard`. Once stopped, it remains off until the next full public-page load. Localhost and preview domains do not load Clarity. The public CSP permits Clarity's script and collection domains.

The site has no visitor consent interface. The Clarity loader queues `consentv2` with both analytics and ad storage denied. A user-supplied 2026-10-12 screenshot showed Clarity Settings > Setup > Cookies **On**; the user then reported switching it **Off**. The changed setting has not been independently observed. After deployment, verify that `_clck` and `_clsk` are absent while denied. Keep input masking enabled; review a safe test recording to check that no contact details or private dashboard content appear. Microsoft documents that denied storage allows limited, cookieless data and fragmented sessions. If a visitor consent interface is added later, update both Clarity and GTM from the visitor's actual choice; do not treat the existing GTM route guard as a consent banner.

After deployment, check a public page's Network panel for a `www.clarity.ms/tag/ywozoexc2s` script and successful Clarity collection request, then confirm the visit appears in the PixelVerse Clarity project. Check the same for a client navigation between public routes. Confirm no Clarity request or recording on a direct `/dashboard` load or after navigating there from a public page. If Clarity is already installed through GTM or another integration at that point, remove one installation before publishing to avoid duplicate recordings.

## GA4 Event Dispatch

GTM retains its base Google tag. `lib/analytics.ts` pushes these event names into `dataLayer`: `campaign_landing`, `contact_path_select`, `lead_form_start`, `review_form_start`, `generate_lead`, `website_review_request`, `strategy_call_click`, `strategy_call_scheduled`, `phone_click`, `email_click`, and `cta_click`. The user reports publishing a shared GA4 Event tag to forward these approved names to stream `G-87XLH0YW51`.

The local direct `gtag` dispatch was removed after the GTM Preview test, so only GTM should forward these events. SiteBehaviour remains separate. Keep one GA4 Event tag per action to avoid duplicates.

### Shared GTM Event Configuration

The original CTA-only tag fired on `cta_click` in GTM Preview and the user confirmed receipt in GA4 DebugView. It was then edited into a shared tag and `lead_form_start` was confirmed in both tools. The shared tag configuration is:

1. Tag `GA4 – Marketing Events` uses GTM's built-in `{{Event}}` variable as its Event Name.
2. Trigger `Marketing Events` is a Custom Event trigger with **regex matching**. The intended Event Name is `^(campaign_landing|contact_path_select|lead_form_start|review_form_start|generate_lead|website_review_request|strategy_call_click|strategy_call_scheduled|phone_click|email_click|cta_click)$`. The screenshot cut off the end of the expression, so verify the complete value against the published version.
3. Leave custom event parameters empty. The exact-name regex excludes `page_view`, GTM lifecycle events, consent updates, and unrelated data-layer messages.
4. Both `cta_click` and `lead_form_start` were confirmed in GA4 DebugView before publication. Verify live event receipt after the website release.

### Page View Rule

The frontend writes `page_view` to `dataLayer` for debugging, but no GTM event tag forwards it. GA4 Enhanced measurement is the intended page-view source. Its advanced browser-history setting was not visible in the user screenshots, so verify one `page_view` on initial load and one on each public route transition in DebugView. If navigation views are missing, enable browser-history measurement in the web stream before adding any manual page-view tag. Do not create a GTM History Change or custom `page_view` event tag alongside Enhanced measurement.

Expected behavior: one `page_view` event per public route transition.

## GA4 Key Events

Mark these as key events in GA4 after they first appear in Reports or Admin events:

| Event | Key event |
| --- | --- |
| `generate_lead` | Yes |
| `website_review_request` | Yes |
| `strategy_call_scheduled` | Yes |
| `phone_click` | No; intent signal, not a confirmed call |

Optional key events for a separately defined contact-intent goal:

- `strategy_call_click`
- `email_click`

Do not mark `page_view`, `lead_form_start`, `review_form_start`, `contact_path_select`, `campaign_landing`, or `cta_click` as key events by default. They are useful funnel/supporting events, not final outcomes.
Treat `phone_click` and `email_click` as contact intent unless a call or reply is independently confirmed. If these are later marked as key events for a separate reporting goal, do not label them as completed leads.

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

The frontend analytics helper intentionally allowlists event parameters before pushing to `dataLayer`. The shared GA4 tag sends the event name without custom parameters. Keep future GA4 Event tags limited to approved event names and explicitly reviewed parameters; do not forward every `dataLayer` key. The Google tag's automatic page-location fields and the web stream's URL redaction settings still need review for query-string PII.

## Frontend QA Checklist

Run this checklist in GTM Preview and confirm event receipt in GA4 DebugView. GTM Preview shows the `dataLayer` events and which GA4 Event tag fired; DebugView confirms GA4 received them. Repeat the key checks on production after deployment.

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
4. Confirm `campaign_landing` appears once in both `dataLayer` and GA4. Campaign details remain in the first-party attribution record and the landing URL, not in custom GA4 event parameters.
5. Open a `src` campaign URL, such as `/?src=QR`.
6. Confirm `campaign_landing` fires once for the `src` campaign code.
7. Open a `promo` campaign URL, such as `/?promo=NJCC2026`.
8. Confirm `campaign_landing` fires once for the promo code.

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
2. Confirm `phone_click` fires in GA4 and the `dataLayer` entry has `contact_path=phone`.
3. Click the public footer email link.
4. Confirm `email_click` fires in GA4 and the `dataLayer` entry has `contact_path=email`.
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

Run standard project verification before deploying site changes:

```bash
npm run type-check
npm run lint
npm run build
```

Known existing warning: `app/dashboard/domani/campaigns/components/campaign-detail-modal.tsx` has a pre-existing React hook dependency warning for `campaign`.

## Publish Checklist

1. Confirm `NEXT_PUBLIC_GTM_ID` is present in the production build and review the published GTM event tag and trigger against the allowlisted names above.
2. In GTM Preview, confirm exactly one GA4 Event tag fires for each tested interaction and no event tag forwards `page_view`.
3. Confirm GA4 DebugView receives one event per tested action and one page view per navigation.
4. The user reports publishing the GTM container after local Preview and DebugView checks. Deploy the site changes separately after code review.
5. Mark the approved GA4 key events in the property.
6. Submit one safe test conversion per public conversion path.
7. Confirm backend attribution metadata lands with lead/review/Calendly records.
8. Record the first reporting comparison date for SiteBehaviour, GA4, and first-party lead attribution.

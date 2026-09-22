# Domani Users UI QA

Evidence date: 2026-09-21. Ticket: DEV-1411; companion server ticket: DEV-1408.

## Result

The expanded Users workspace is ready for coordinated preview QA. Automated checks cover global request behavior, every default and optional column, per-staff preferences, honest unknown states, UTC rendering, filters, sorting, pagination, detail navigation, safe failures, expired sessions, and stable user-ID feedback links. No production accounts were changed and no customer email was sent.

## Automated evidence

- The list sends search, filter, sort, limit, and offset changes to the server and ignores aborted or obsolete responses. Counts come from the server response rather than the loaded page.
- Default columns cover joined, app activity, sign-in, linked providers, last reported device, and account status. Every optional column is rendered in the table test, and saved column IDs are scoped to the authenticated staff account.
- Dates with timezone offsets render as exact UTC `<time>` values. Missing timestamps and telemetry say “Not recorded,” never “Never.” Sign-in and app activity remain separate.
- Multiple providers remain distinct from original signup method. Account states, email verification, stale historical device snapshots, their source/date, and unsupported general device inventory are labeled explicitly.
- The table has scoped row/column headers, an accessible caption and keyboard-scrollable region. Detail triggers are real buttons with descriptive labels; the drawer traps focus, preserves exit animation, and returns focus after close.
- Detail and related-feedback requests use the stable user UUID. Invalid IDs never fall back to an unfiltered feedback list. 401, 403, 404, and 503 states are distinct and do not render stale user data.
- Mobile layouts use wrapping controls, a contained scrolling table, one-column detail fields below `sm`, and bounded drawer content. Theme colors use the shared CSS variables for light/dark compatibility.

## Commands

```sh
npm test -- --run lib/api/domani-users.test.ts app/dashboard/domani/users/components/users-page-client.test.tsx app/dashboard/domani/users/components/users-table.test.tsx app/dashboard/domani/users/components/user-detail-drawer.test.tsx app/dashboard/domani/users/components/users-toolbar.test.tsx app/dashboard/domani/feedback/user-scope.test.tsx app/dashboard/domani/components/detail-overlay-lifecycle.test.tsx
npm test
npm run type-check
npm run build
```

## Rollout and rollback

1. Keep the deployed Domani user-insights and feedback-user-filter migrations in place.
2. Deploy the server story branch first or deploy both story branches together.
3. Open the UI preview as an allowed PVS staff user and run the checklist below against the deployed API.
4. Confirm the browser receives `no-store` responses and no credential, token, session, IP, or raw identity fields.
5. Merge/deploy the UI story branch only after the server checklist and the responsive/theme checks pass.

If preview QA fails, roll the UI and API back together. Leave the restricted database views, function grants, and additive migrations in place. An older UI remains compatible with the server envelope; a newer UI against an older API fails visibly through its runtime contract guard.

## Controlled preview checklist

- [ ] Desktop light and dark: default columns, horizontal/vertical table scroll, sticky headers, filters, sorting, page size, page 2, empty state, and retry.
- [ ] Mobile light and dark: search/provider/filter controls wrap without clipping; table and drawer remain independently usable at 320–390 px.
- [ ] Keyboard: reach search, filters, sort, columns, row detail, pagination, drawer close, copy ID, and feedback link; closing returns focus to the originating row.
- [ ] Screen reader: table caption/headers, counts, loading/error status, drawer title, copy confirmation, and “opens a new tab” link are announced meaningfully.
- [ ] Staff session: allowed staff sees data; expired session shows Sign in; nonstaff sees Staff access required; retry does not retain stale rows.
- [ ] Data semantics: UTC boundary, missing auth, unverified email, linked Apple+Google, deletion pending/deleted/banned, no activity, and stale device snapshot match the server response.
- [ ] Identity safety: related feedback opens in a new tab with only `user_id=<uuid>` and all subsequent feedback filters/pages stay scoped.
- [ ] Regression: overview counts and campaign recipient search/paging still load normally.

The unchecked items require the authenticated deployed preview. They intentionally remain explicit instead of recording unperformed visual evidence.

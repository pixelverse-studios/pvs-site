# DEV-889 Dashboard Navigation Notes

## Ticket

DEV-889: Debug slow dashboard navigation route changes

## Reproduction Scope

Dashboard navigation route changes were reviewed across the shared dashboard segment:

- `/dashboard`
- `/dashboard/clients`
- `/dashboard/websites`
- `/dashboard/deployments`
- `/dashboard/seo`
- `/dashboard/agenda`
- `/dashboard/prospects`
- `/dashboard/domani`

## Bottleneck Evidence

The primary bottleneck was repeated server-side auth work during every dashboard route render.

Before the fix, dashboard navigation paid for both:

- dashboard middleware auth via `supabase.auth.getUser()`
- page-level auth via another `supabase.auth.getUser()` in most dashboard pages

That meant each route click performed duplicate Supabase auth validation before page content could render. The dashboard layout also used the server-side user to render header identity, so layout rendering waited on auth data that was already enforced by middleware.

The clients route had an additional data-loading bottleneck. Board data used `getAllClientsWithWebsites()`, which performed:

- one list request for up to 100 clients
- one detail request per returned client

For 100 clients, that path could issue 101 client API requests for the board before the route settled. The replacement uses two list requests: one paginated table request and one capped board request.

## Route-Change Measurements

Measured by request-path inspection of the affected dashboard route code:

- Before: each protected dashboard route performed middleware auth plus a page-level `supabase.auth.getUser()` before rendering.
- After: dashboard pages rely on middleware auth only; `rg "auth\\.getUser\\(\\)|redirect\\('/login'\\)" app/dashboard -n` reports only `/dashboard/domani/campaigns/new`, which intentionally keeps server auth because it needs the sender email.
- Before: `/dashboard/clients` board loading used one client list request plus one detail request per listed client. At the API cap of 100 clients, that is up to 101 client API requests before board data settles.
- After: `/dashboard/clients` uses two client list requests: one paginated table request and one capped board request.

Measured API timing samples from the local shell against the production dashboard API on 2026-05-19:

| Request | Observed total time |
| --- | ---: |
| `GET /api/clients?limit=20` | 229 ms |
| `GET /api/clients?limit=100` | 532 ms |
| `GET /api/clients/:id` sample 1 | 362 ms |
| `GET /api/clients/:id` sample 2 | 141 ms |
| `GET /api/clients/:id` sample 3 | 173 ms |
| `GET /api/clients/:id` sample 4 | 157 ms |
| `GET /api/clients/:id` sample 5 | 143 ms |

For the current seven-client production dataset, the old clients board path required one list call plus seven detail calls. The sampled detail calls ranged from 141-362 ms each, with a 195 ms average across the five sampled records. The new path is two list calls in parallel, with the slower observed list call at 532 ms, and no per-client detail fan-out. At the API cap of 100 clients, the request count reduction is from up to 101 client API requests to 2 client API requests.

Authenticated browser route-click timings were captured manually from DevTools after signing into the dashboard:

| Route click | Requests | Transferred | Waiting | Receiving |
| --- | ---: | ---: | ---: | ---: |
| `/dashboard` to `/dashboard/clients` | 6 | 73.55 kB | 2.99 s | 269 ms |
| `/dashboard/clients` to `/dashboard/websites` | 6 | 73.55 kB | 1.36 s | 228 ms |
| `/dashboard/websites` to `/dashboard/deployments` | 7 | 94.43 kB | 298 ms | 236 ms |

## Fix Implemented

- Dashboard route protection now relies on middleware for dashboard pages.
- Header identity is hydrated in `DashboardShell` on the client after route content can render.
- The dashboard segment remains `force-dynamic` so protected pages are request-rendered.
- `/dashboard/clients` now derives board clients and website projects from list responses instead of fetching every client detail page.
- Website cards keep deterministic detail and SEO links from stable IDs even when the optimized list payload does not include legacy `seo_focus` metadata.
- Missing `updated_at` values from list-derived projects no longer render as `Updated Never`.
- A dashboard loading state provides immediate route-transition feedback while data resolves.
- Dashboard sidebar links now warm routes on hover/focus and show optimistic active/pending feedback immediately on click while the server route resolves.

## Verification

- `npm run type-check`
- `npm run build`

## Manual QA

Authenticated dashboard route-click timing was captured for:

- `/dashboard` to `/dashboard/clients`
- `/dashboard/clients` to `/dashboard/websites`
- `/dashboard/websites` to `/dashboard/deployments`

The expected retest result is that route clicks no longer show duplicate server auth checks, and `/dashboard/clients` no longer fans out into per-client detail requests before rendering board data.

Follow-up client-side routing polish was added after manual QA showed visible pause on slower server routes. Re-test should confirm that sidebar clicks now provide immediate active-route feedback even when the destination route is still waiting on server data. The sidebar intentionally avoids prefetching every dashboard route on mount to prevent a burst of background work on dynamic dashboard pages.

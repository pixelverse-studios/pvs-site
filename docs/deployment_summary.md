# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary

- Reduced Sentry monitoring overhead to fix Netlify bandwidth and compute usage spikes
- Optimized authentication middleware to only run on admin dashboard routes
- Fixed runtime errors from null/undefined values in search and service pages

## Notes for internal team

- PVS-244: Reduced Sentry sampling rates (transaction tracing 100% → 10%, session replay 10% → 1%, error replay 100% → 50%)
- PVS-245: Scoped middleware to /dashboard routes only (eliminates 99% of unnecessary edge function invocations on public pages)
- PVS-246: Added type guards to 5 toLowerCase() calls causing 28 Sentry errors (structured data, service pages, dashboard search)
- Expected combined impact: Bandwidth drops from ~65 GB/month to ~15 GB/month, serverless compute from ~75 GB-Hrs to ~15 GB-Hrs, edge functions reduced by ~99% for public traffic, TypeError errors eliminated
- Files modified: sentry.client.config.ts, sentry.server.config.ts, sentry.edge.config.ts, middleware.ts, lib/structured-data.ts, components/services/local/*.tsx, app/dashboard/clients/components/*.tsx

## Changed URLs

- https://www.pixelversestudios.io
- https://www.pixelversestudios.io/services/englewood
- https://www.pixelversestudios.io/services/fort-lee
- https://www.pixelversestudios.io/services/hackensack
- https://www.pixelversestudios.io/services/paramus
- https://www.pixelversestudios.io/services/ridgewood

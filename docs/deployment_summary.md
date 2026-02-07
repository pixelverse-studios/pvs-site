# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary

- Reduced Sentry monitoring overhead to fix Netlify bandwidth and compute usage spikes
- Optimized authentication middleware to only run on admin dashboard routes

## Notes for internal team

- PVS-244: Reduced Sentry sampling rates (transaction tracing 100% → 10%, session replay 10% → 1%, error replay 100% → 50%)
- PVS-245: Scoped middleware to /dashboard routes only (eliminates 99% of unnecessary edge function invocations on public pages)
- Expected combined impact: Bandwidth drops from ~65 GB/month to ~15 GB/month, serverless compute from ~75 GB-Hrs to ~15 GB-Hrs, edge functions reduced by ~99% for public traffic
- Files modified: sentry.client.config.ts, sentry.server.config.ts, sentry.edge.config.ts, middleware.ts

## Changed URLs

- https://www.pixelversestudios.io

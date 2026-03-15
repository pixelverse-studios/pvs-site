import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Error-only client — no performance tracing or session replays.
  // Server-side tracing (sentry.server.config.ts) handles performance monitoring.
  // Disabling these reduces runtime CPU/network overhead even though bundle size
  // is mostly fixed (React + Next.js framework = ~180kB baseline).
  tracesSampleRate: 0,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,

  // Set environment
  environment: process.env.NODE_ENV,

  // Only send errors in production
  enabled: process.env.NODE_ENV === 'production',
});

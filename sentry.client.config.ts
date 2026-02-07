import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance Monitoring - reduced from 100% to 10%
  tracesSampleRate: 0.1,

  // Session Replay - reduced from 10% to 1%
  replaysSessionSampleRate: 0.01,

  // Error session replay - reduced from 100% to 50%
  replaysOnErrorSampleRate: 0.5,

  // Set environment
  environment: process.env.NODE_ENV,

  // Only send errors in production
  enabled: process.env.NODE_ENV === 'production',

  // Filter out noisy errors
  ignoreErrors: [
    // Browser extensions
    /extensions\//i,
    /^chrome:\/\//i,
    // Network errors that aren't actionable
    'Network request failed',
    'Failed to fetch',
    'Load failed',
    // User-cancelled requests
    'AbortError',
  ],
});

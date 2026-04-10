const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.infrastructureLogging = {
      level: 'error',
    };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/pixelverse-studios/image/upload/**',
      },
    ],
  },
  async headers() {
    // Public-route CSP. Set statically here (instead of per-request in middleware)
    // so public pages can be statically generated and CDN-cached. The dashboard
    // middleware (middleware.ts, which now only runs on /dashboard/*) overrides
    // this header on its responses with a stricter nonce-based CSP. See DEV-674.
    //
    // Trade-off: this CSP uses 'unsafe-inline' for script-src, which is weaker
    // than the previous nonce mechanism. For a marketing site that renders no
    // user-supplied content into HTML, this is an acceptable trade — the cost
    // of the previous nonce mechanism was forced dynamic rendering on every
    // page (Cache-Control: no-store), which made every navigation pay a cold-
    // start tax on the Netlify Function. Static pages can't have a per-request
    // nonce because the HTML is built once at build time.
    // Both PVS backend hosts the contact forms POST to:
    //   - Production builds hit the DigitalOcean host.
    //   - Local dev hits localhost:5001.
    // CSP is built once at build time and served on every page regardless of
    // origin, so we union both hosts. The localhost entry is harmless in
    // production (no prod page resolves there) and required for the contact
    // form to work in `npm run dev`. Previously this was read from
    // NEXT_PUBLIC_API_BASE_URL, but that env var is not set in the Netlify
    // build env, which caused the contact form POST to /api/leads to be
    // blocked by CSP on staging/production after public pages went static
    // (DEV-674). Keep these two values in sync with lib/api-config.ts.
    const pvsApiHosts = 'https://pvs-server-62hx7.ondigitalocean.app http://localhost:5001';
    const publicCsp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://www.googletagmanager.com https://js.sentry-cdn.com https://assets.calendly.com https://sitebehaviour-cdn.fra1.cdn.digitaloceanspaces.com",
      "style-src 'self' 'unsafe-inline' https://assets.calendly.com",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data:",
      `connect-src 'self' ${pvsApiHosts} https://www.google-analytics.com https://*.sentry.io https://*.supabase.co https://*.calendly.com https://maps.googleapis.com https://maps.gstatic.com https://*.sitebehaviour.com https://sitebehaviour-cdn.fra1.cdn.digitaloceanspaces.com`,
      "frame-src 'self' https://calendly.com https://*.calendly.com https://www.google.com/maps",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      'upgrade-insecure-requests',
    ].join('; ');

    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: publicCsp },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
  async redirects() {
    const legacyContactSlugs = [
      'bergen-county',
      'fort-lee',
      'cliffside-park',
      'river-vale',
      'hackensack',
      'paramus',
      'teaneck',
      'fair-lawn',
      'englewood',
      'bergenfield',
      'ridgewood',
    ];

    const contactSlugRedirects = legacyContactSlugs.map((slug) => ({
      source: `/contact/${slug}`,
      destination: '/contact/details',
      permanent: true,
    }));
    // Priority cities redirect to new /areas/ structure
    const priorityCityRedirects = [
      'fort-lee',
      'englewood',
      'hackensack',
      'paramus',
      'ridgewood',
    ].map((slug) => ({
      source: `/services/${slug}`,
      destination: `/areas/bergen-county/${slug}`,
      permanent: true,
    }));

    // Phase 2 cities still redirect to /services until their area pages are built
    const phase2CityRedirects = [
      'teaneck',
      'fair-lawn',
      'bergenfield',
      'cliffside-park',
      'river-vale',
    ].map((slug) => ({
      source: `/services/${slug}`,
      destination: '/services',
      permanent: false, // temporary until Phase 2 area pages exist
    }));

    return [
      {
        source: '/works',
        destination: '/portfolio',
        permanent: true,
      },
      {
        source: '/pricing',
        destination: '/contact/details',
        permanent: true,
      },
      {
        source: '/packages',
        destination: '/contact/details',
        permanent: true,
      },
      {
        source: '/services/ux-ui-design',
        destination: '/services',
        permanent: true,
      },
      {
        source: '/services/ux-ui-design/:city',
        destination: '/services',
        permanent: true,
      },
      {
        source: '/services/bergen-county',
        destination: '/areas/bergen-county',
        permanent: true,
      },
      ...priorityCityRedirects,
      ...phase2CityRedirects,
      {
        source: '/services/web-development/:city',
        destination: '/services/web-development',
        permanent: true,
      },
      {
        source: '/services/seo/:city',
        destination: '/services/seo',
        permanent: true,
      },
      {
        source: '/audit',
        destination: '/contact/review',
        permanent: true,
      },
      ...contactSlugRedirects,
      // Legacy /contact?path= redirects moved to middleware.ts (DEV-468)
      // so the stale query string is stripped from the destination URL.
      {
        source: '/contact',
        destination: '/contact/details',
        permanent: true,
      },
    ];
  },
};

module.exports = withSentryConfig(nextConfig, {
  // Sentry webpack plugin options
  org: 'pixelverse-studios',
  project: 'pixelverse-studios',

  // Suppresses source map uploading logs during build
  silent: true,

  // Upload source maps for better stack traces
  widenClientFileUpload: true,

  // Automatically tree-shake Sentry debug logging statements
  webpack: {
    treeshake: {
      removeDebugLogging: true,
    },
  },

  // Hide source maps from browsers in production
  hideSourceMaps: true,
});

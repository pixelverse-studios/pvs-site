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
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; " +
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net https://www.googletagmanager.com https://js.sentry-cdn.com https://assets.calendly.com; " +
              "style-src 'self' 'unsafe-inline' https://assets.calendly.com; " +
              "img-src 'self' data: https: blob:; " +
              "font-src 'self' data:; " +
              "connect-src 'self' https://www.google-analytics.com https://*.sentry.io https://*.supabase.co https://calendly.com https://*.calendly.com; " +
              "frame-src 'self' https://calendly.com; " +
              "object-src 'none'; " +
              "base-uri 'self'; " +
              "form-action 'self'; " +
              "frame-ancestors 'self'; " +
              "upgrade-insecure-requests;",
          },
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
      destination: '/contact',
      permanent: true,
    }));

    return [
      {
        source: '/works',
        destination: '/portfolio',
        permanent: true,
      },
      {
        source: '/pricing',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/packages',
        destination: '/contact',
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
        source: '/audit',
        destination: '/contact',
        permanent: true,
      },
      ...contactSlugRedirects,
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

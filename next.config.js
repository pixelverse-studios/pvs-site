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
          // CSP is set dynamically in middleware.ts with per-request nonces
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
      destination: '/contact',
      permanent: true,
    }));
    const legacyServiceCitySlugs = [
      'fort-lee',
      'englewood',
      'hackensack',
      'paramus',
      'ridgewood',
      'teaneck',
      'fair-lawn',
      'bergenfield',
      'cliffside-park',
      'river-vale',
    ];

    const serviceCitySlugRedirects = legacyServiceCitySlugs.map((slug) => ({
      source: `/services/${slug}`,
      destination: '/services',
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
        source: '/services/bergen-county',
        destination: '/services',
        permanent: true,
      },
      ...serviceCitySlugRedirects,
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

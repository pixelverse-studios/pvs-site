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
  async redirects() {
    const contactContextSlugs = [
      'bergen-county',
      'fort-lee',
      'cliffside-park',
      'river-vale',
      'hackensack',
      'paramus',
    ];

    const contactContextRedirects = contactContextSlugs.map((slug) => ({
      source: '/contact',
      has: [
        {
          type: 'query',
          key: 'context',
          value: slug,
        },
      ],
      destination: `/contact/${slug}`,
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
        destination: '/services',
        permanent: true,
      },
      ...contactContextRedirects,
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

  // Automatically tree-shake Sentry logger statements
  disableLogger: true,

  // Hide source maps from browsers in production
  hideSourceMaps: true,
});

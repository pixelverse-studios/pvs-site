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
    const isDev = process.env.NODE_ENV === 'development';
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!isDev && !apiUrl) {
      console.warn(
        '[CSP] WARNING: NEXT_PUBLIC_API_BASE_URL is not set — backend API calls will be blocked by CSP in production',
      );
    }

    const csp = {
      'default-src': ["'self'"],
      'script-src': [
        "'self'",
        "'unsafe-eval'",
        "'unsafe-inline'",
        'https://cdn.jsdelivr.net',
        'https://www.googletagmanager.com',
        'https://js.sentry-cdn.com',
        'https://assets.calendly.com',
        'https://sitebehaviour-cdn.fra1.cdn.digitaloceanspaces.com',
      ],
      'style-src': ["'self'", "'unsafe-inline'", 'https://assets.calendly.com'],
      'img-src': ["'self'", 'data:', 'https:', 'blob:'],
      'font-src': ["'self'", 'data:'],
      'connect-src': [
        "'self'",
        'https://www.google-analytics.com',
        'https://*.sentry.io',
        'https://*.supabase.co',
        'https://*.calendly.com',
        'https://maps.googleapis.com',
        'https://maps.gstatic.com',
        apiUrl,
        isDev && 'http://localhost:5001',
      ].filter(Boolean),
      // Note: *.calendly.com does NOT cover the apex domain per CSP spec — both are required
      'frame-src': ["'self'", 'https://calendly.com', 'https://*.calendly.com', 'https://www.google.com/maps'],
      'object-src': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"],
      'frame-ancestors': ["'self'"],
      'upgrade-insecure-requests': [], // empty array → bare directive, no sources
    };

    const cspHeader = Object.entries(csp)
      .map(([directive, sources]) =>
        sources.length ? `${directive} ${sources.join(' ')}` : directive,
      )
      .join('; ');

    return [
      {
        source: '/:path*',
        headers: [
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
          { key: 'Content-Security-Policy', value: cspHeader },
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

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/pixelverse-studios/image/upload/**'
      }
    ]
  },
  async redirects() {
    const contactContextSlugs = [
      'bergen-county',
      'fort-lee',
      'cliffside-park',
      'river-vale',
      'hackensack',
      'paramus'
    ];

    return contactContextSlugs.map((slug) => ({
      source: '/contact',
      has: [
        {
          type: 'query',
          key: 'context',
          value: slug
        }
      ],
      destination: `/contact/${slug}`,
      permanent: true
    }));
  }
};

module.exports = nextConfig;

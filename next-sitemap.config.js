const siteUrl = 'https://pixelversestudios.io';

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: [
    '/contact/bergen-county',
    '/contact/fort-lee',
    '/contact/englewood',
    '/contact/hackensack',
    '/contact/paramus',
    '/contact/ridgewood',
    '/contact/teaneck',
    '/contact/fair-lawn',
    '/contact/bergenfield',
    '/contact/cliffside-park',
    '/contact/river-vale',
    '/audit',
    '/dashboard',
    '/dashboard/*',
  ],
  transform: async (config, path) => {
    const isHome = path === '/';
    const loc = `${siteUrl}${isHome ? '' : path}`;

    return {
      loc,
      changefreq: isHome ? 'daily' : (config.changefreq ?? 'weekly'),
      priority: isHome ? 1.0 : (config.priority ?? 0.7),
      lastmod: new Date().toISOString(),
    };
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/_next/', '/api/', '/dashboard/'],
      },
    ],
  },
};

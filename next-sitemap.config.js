// Keep in sync with cityServicePageSlugs in data/services-city-pages.ts.
const cityServicePageSlugs = [
  'fort-lee',
  'cliffside-park',
  'river-vale',
  'hackensack',
  'paramus',
];

const siteUrl = 'https://pixelversestudios.io';

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: 'weekly',
  priority: 0.7,
  transform: async (config, path) => ({
    loc: `${siteUrl}${path === '/' ? '' : path}`,
    changefreq: path === '/' ? 'daily' : config.changefreq ?? 'weekly',
    priority: path === '/' ? 1.0 : config.priority ?? 0.7,
    lastmod: new Date().toISOString(),
    ...config,
  }),
  additionalPaths: async () => {
    return cityServicePageSlugs.map((slug) => ({
      loc: `${siteUrl}/services/${slug}`,
      changefreq: 'weekly',
      priority: 0.7,
    }));
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
};

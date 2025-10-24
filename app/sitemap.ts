import type { MetadataRoute } from 'next';

import { cityServicePageSlugs } from '@/data/services-city-pages';
import { sharedMetadata } from '@/lib/metadata';

const staticRoutes = [
  '/',
  '/about',
  '/services',
  '/services/bergen-county',
  '/packages',
  '/portfolio',
  '/contact',
  '/faq',
  '/styleguide',
];

function buildUrl(path: string, baseUrl: string) {
  if (path === '/') {
    return baseUrl;
  }

  return `${baseUrl}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = sharedMetadata.siteUrl;
  const dynamicRoutes = cityServicePageSlugs.map((slug) => `/services/${slug}`);

  const routes = new Set([...staticRoutes, ...dynamicRoutes]);

  const lastModified = new Date();

  return Array.from(routes).map((path) => ({
    url: buildUrl(path, baseUrl),
    lastModified,
  }));
}

import { MetadataRoute } from 'next';
import { getValidCountySlugs, getValidCitySlugs } from '@/data/area-pages-content';
import { getBlogPosts } from '@/data/blog-posts';
import { caseStudies } from '@/data/case-studies';

const BASE_URL = 'https://pixelversestudios.io';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/services`,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/services/web-development`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/services/seo`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/portfolio`,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/about`,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact/details`,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact/call`,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact/review`,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/faq`,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/blog`,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  const blogPages: MetadataRoute.Sitemap = getBlogPosts().map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const portfolioPages: MetadataRoute.Sitemap = caseStudies.map((study) => ({
    url: `${BASE_URL}/portfolio/${study.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const countyPages: MetadataRoute.Sitemap = getValidCountySlugs().map((county) => ({
    url: `${BASE_URL}/areas/${county}`,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  const cityPages: MetadataRoute.Sitemap = getValidCitySlugs().map(({ county, city }) => ({
    url: `${BASE_URL}/areas/${county}/${city}`,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...staticPages, ...countyPages, ...cityPages, ...blogPages, ...portfolioPages];
}

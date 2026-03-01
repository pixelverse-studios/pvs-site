import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/_next/', '/api/', '/dashboard/'],
    },
    sitemap: 'https://www.pixelversestudios.io/sitemap.xml',
  }
}

import { sharedMetadata } from '@/lib/metadata';

const {
  siteUrl,
  logo: { light: lightModeLogo }
} = sharedMetadata;

// BreadcrumbList schema generator for improved SERP display
export function createBreadcrumbSchema(
  items: Array<{ name: string; path: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}

export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${siteUrl}/#organization`,
  name: 'PixelVerse Studios',
  url: siteUrl,
  logo: lightModeLogo,
  image: lightModeLogo,
  description:
    'PixelVerse Studios crafts custom-coded marketing websites with UX-first design, performance, and local SEO for Bergen County service brands.',
  email: 'info@pixelversestudios.io',
  areaServed: {
    '@type': 'AdministrativeArea',
    name: 'Bergen County, NJ'
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Bergen County',
    addressRegion: 'NJ',
    addressCountry: 'US'
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    email: 'info@pixelversestudios.io',
    availableLanguage: ['English']
  }
};

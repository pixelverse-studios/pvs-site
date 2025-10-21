import { sharedMetadata } from '@/lib/metadata';

const { siteUrl } = sharedMetadata;

export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${siteUrl}/#organization`,
  name: 'PixelVerse Studios',
  url: siteUrl,
  logo: `${siteUrl}/logo-light.png`,
  image: `${siteUrl}/logo-light.png`,
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

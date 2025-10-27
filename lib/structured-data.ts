import { sharedMetadata } from '@/lib/metadata';

const {
  siteUrl,
  logo: { light: lightModeLogo }
} = sharedMetadata;

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

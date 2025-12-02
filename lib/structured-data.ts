import { sharedMetadata } from '@/lib/metadata';

const {
  siteUrl,
  logo: { light: lightModeLogo }
} = sharedMetadata;

// Priority city coordinates for LocalBusiness schema
const cityCoordinates: Record<string, { latitude: number; longitude: number }> = {
  'fort-lee': { latitude: 40.8509, longitude: -73.9701 },
  'englewood': { latitude: 40.8929, longitude: -73.9726 },
  'hackensack': { latitude: 40.8859, longitude: -74.0435 },
  'paramus': { latitude: 40.9445, longitude: -74.0754 },
  'ridgewood': { latitude: 40.9793, longitude: -74.1166 },
  // Phase 2 cities
  'teaneck': { latitude: 40.8976, longitude: -74.0159 },
  'fair-lawn': { latitude: 40.9404, longitude: -74.1318 },
  'bergenfield': { latitude: 40.9276, longitude: -73.9982 },
  'cliffside-park': { latitude: 40.8215, longitude: -73.9876 },
  'river-vale': { latitude: 41.0159, longitude: -74.0107 },
};

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

// Per-city LocalBusiness schema for priority cities
export interface CitySchemaParams {
  slug: string;
  city: string;
  state: string;
  description?: string;
}

export function createCityLocalBusinessSchema({
  slug,
  city,
  state,
  description
}: CitySchemaParams) {
  const coords = cityCoordinates[slug];
  const defaultDescription = `Custom web design and local SEO services for ${city}, ${state} businesses. PixelVerse Studios delivers conversion-focused websites and marketing for Bergen County service brands.`;

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${siteUrl}/services/${slug}/#local-business`,
    name: `PixelVerse Studios - ${city} Web Design & SEO`,
    description: description || defaultDescription,
    url: `${siteUrl}/services/${slug}`,
    email: 'info@pixelversestudios.io',
    image: lightModeLogo,
    logo: lightModeLogo,
    priceRange: '$$',
    areaServed: {
      '@type': 'City',
      name: city,
      containedInPlace: {
        '@type': 'AdministrativeArea',
        name: 'Bergen County, NJ'
      }
    },
    ...(coords && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: coords.latitude,
        longitude: coords.longitude
      }
    }),
    address: {
      '@type': 'PostalAddress',
      addressLocality: city,
      addressRegion: state,
      addressCountry: 'US'
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '17:00'
    },
    sameAs: [
      'https://www.instagram.com/pixel.verse.studios/',
      'https://www.facebook.com/profile.php?id=61582670432316',
      'https://www.linkedin.com/company/pixelverse-studios/',
      'https://www.youtube.com/@PixelVerse_Studios_nj',
      'https://x.com/pvs_nj'
    ],
    parentOrganization: {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: 'PixelVerse Studios'
    }
  };
}

// Service schema for city pages
export interface ServiceSchemaParams {
  serviceName: string;
  serviceType: string;
  city: string;
  state: string;
  slug: string;
  description: string;
}

export function createCityServiceSchema({
  serviceName,
  serviceType,
  city,
  state,
  slug,
  description
}: ServiceSchemaParams) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${siteUrl}/services/${slug}/#service-${serviceType.toLowerCase().replace(/\s+/g, '-')}`,
    name: serviceName,
    serviceType: serviceType,
    description: description,
    provider: {
      '@type': 'ProfessionalService',
      '@id': `${siteUrl}/services/${slug}/#local-business`,
      name: `PixelVerse Studios - ${city}`,
      url: `${siteUrl}/services/${slug}`
    },
    areaServed: {
      '@type': 'City',
      name: city,
      containedInPlace: {
        '@type': 'State',
        name: state
      }
    },
    url: `${siteUrl}/services/${slug}`
  };
}

// Bundled services schema for city pages (combines multiple services)
export function createCityServicesSchema(slug: string, city: string, state: string) {
  const services = [
    {
      name: `Web Design in ${city}, ${state}`,
      type: 'Web Design',
      description: `Custom-coded, conversion-focused website design for ${city} businesses. Mobile-first, fast-loading sites built for performance and SEO.`
    },
    {
      name: `Local SEO Services in ${city}, ${state}`,
      type: 'Local SEO',
      description: `Local SEO optimization for ${city} businesses. Google Business Profile setup, local citations, schema markup, and content strategy.`
    },
    {
      name: `UX/UI Design in ${city}, ${state}`,
      type: 'UX UI Design',
      description: `User experience and interface design for ${city} service brands. Conversion-optimized layouts and intuitive navigation.`
    }
  ];

  return services.map((service) =>
    createCityServiceSchema({
      serviceName: service.name,
      serviceType: service.type,
      city,
      state,
      slug,
      description: service.description
    })
  );
}

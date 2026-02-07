import { sharedMetadata } from '@/lib/metadata';

const {
  siteUrl,
  logo: { light: lightModeLogo },
} = sharedMetadata;

// Priority city coordinates for LocalBusiness schema
const cityCoordinates: Record<string, { latitude: number; longitude: number }> = {
  'fort-lee': { latitude: 40.8509, longitude: -73.9701 },
  englewood: { latitude: 40.8929, longitude: -73.9726 },
  hackensack: { latitude: 40.8859, longitude: -74.0435 },
  paramus: { latitude: 40.9445, longitude: -74.0754 },
  ridgewood: { latitude: 40.9793, longitude: -74.1166 },
  // Phase 2 cities
  teaneck: { latitude: 40.8976, longitude: -74.0159 },
  'fair-lawn': { latitude: 40.9404, longitude: -74.1318 },
  bergenfield: { latitude: 40.9276, longitude: -73.9982 },
  'cliffside-park': { latitude: 40.8215, longitude: -73.9876 },
  'river-vale': { latitude: 41.0159, longitude: -74.0107 },
};

// BreadcrumbList schema generator for improved SERP display
export function createBreadcrumbSchema(items: Array<{ name: string; path: string }>) {
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
  telephone: '+1-201-638-1769',
  areaServed: {
    '@type': 'AdministrativeArea',
    name: 'Bergen County, NJ',
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: '79 Edgewater Road',
    addressLocality: 'Cliffside Park',
    addressRegion: 'NJ',
    postalCode: '07010',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 40.8215,
    longitude: -73.9876,
  },
  priceRange: '$$',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    telephone: '+1-201-638-1769',
    email: 'info@pixelversestudios.io',
    availableLanguage: ['English'],
  },
  sameAs: [
    'https://www.instagram.com/pixel.verse.studios/',
    'https://www.facebook.com/profile.php?id=61582670432316',
    'https://www.linkedin.com/company/pixelverse-studios/',
    'https://www.youtube.com/@PixelVerse_Studios_nj',
    'https://x.com/pvs_nj',
  ],
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
  description,
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
    telephone: '+1-201-638-1769',
    image: lightModeLogo,
    logo: lightModeLogo,
    priceRange: '$$',
    areaServed: {
      '@type': 'City',
      name: city,
      containedInPlace: {
        '@type': 'AdministrativeArea',
        name: 'Bergen County, NJ',
      },
    },
    ...(coords && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: coords.latitude,
        longitude: coords.longitude,
      },
    }),
    address: {
      '@type': 'PostalAddress',
      streetAddress: '79 Edgewater Road',
      addressLocality: 'Cliffside Park',
      addressRegion: 'NJ',
      postalCode: '07010',
      addressCountry: 'US',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '17:00',
    },
    sameAs: [
      'https://www.instagram.com/pixel.verse.studios/',
      'https://www.facebook.com/profile.php?id=61582670432316',
      'https://www.linkedin.com/company/pixelverse-studios/',
      'https://www.youtube.com/@PixelVerse_Studios_nj',
      'https://x.com/pvs_nj',
    ],
    parentOrganization: {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: 'PixelVerse Studios',
    },
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
  description,
}: ServiceSchemaParams) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${siteUrl}/services/${slug}/#service-${(serviceType || 'service').toLowerCase().replace(/\s+/g, '-')}`,
    name: serviceName,
    serviceType: serviceType,
    description: description,
    provider: {
      '@type': 'ProfessionalService',
      '@id': `${siteUrl}/services/${slug}/#local-business`,
      name: `PixelVerse Studios - ${city}`,
      url: `${siteUrl}/services/${slug}`,
    },
    areaServed: {
      '@type': 'City',
      name: city,
      containedInPlace: {
        '@type': 'State',
        name: state,
      },
    },
    url: `${siteUrl}/services/${slug}`,
  };
}

// Service schema for individual service pages (not city-specific)
export interface IndividualServiceSchemaParams {
  name: string;
  serviceType: string;
  description: string;
  path: string;
}

export function createServiceSchema({
  name,
  serviceType,
  description,
  path,
}: IndividualServiceSchemaParams) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${siteUrl}${path}/#service`,
    name,
    serviceType,
    description,
    url: `${siteUrl}${path}`,
    provider: {
      '@type': 'ProfessionalService',
      '@id': `${siteUrl}/#organization`,
      name: 'PixelVerse Studios',
      url: siteUrl,
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Bergen County, NJ',
    },
  };
}

// Bundled services schema for city pages (combines multiple services)
export function createCityServicesSchema(slug: string, city: string, state: string) {
  const services = [
    {
      name: `Web Design in ${city}, ${state}`,
      type: 'Web Design',
      description: `Custom-coded, conversion-focused website design for ${city} businesses. Mobile-first, fast-loading sites built for performance and SEO.`,
    },
    {
      name: `Local SEO Services in ${city}, ${state}`,
      type: 'Local SEO',
      description: `Local SEO optimization for ${city} businesses. Google Business Profile setup, local citations, schema markup, and content strategy.`,
    },
    {
      name: `UX/UI Design in ${city}, ${state}`,
      type: 'UX UI Design',
      description: `User experience and interface design for ${city} service brands. Conversion-optimized layouts and intuitive navigation.`,
    },
  ];

  return services.map((service) =>
    createCityServiceSchema({
      serviceName: service.name,
      serviceType: service.type,
      city,
      state,
      slug,
      description: service.description,
    }),
  );
}

// =============================================================================
// Local Service Page Schema (for /services/[service]/[city] routes)
// =============================================================================

export interface LocalServiceSchemaParams {
  serviceSlug: string;
  serviceName: string;
  serviceType: string;
  citySlug: string;
  city: string;
  state: string;
  description: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

/**
 * Creates a comprehensive schema for local service pages
 * combining Service schema with LocalBusiness and areaServed
 */
export function createLocalServiceSchema({
  serviceSlug,
  serviceName,
  serviceType,
  citySlug,
  city,
  state,
  description,
  coordinates,
}: LocalServiceSchemaParams) {
  const pagePath = `/services/${serviceSlug}/${citySlug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${siteUrl}${pagePath}/#service`,
    name: serviceName,
    serviceType: serviceType,
    description: description,
    url: `${siteUrl}${pagePath}`,
    provider: {
      '@type': 'ProfessionalService',
      '@id': `${siteUrl}${pagePath}/#provider`,
      name: `PixelVerse Studios - ${city} ${serviceType}`,
      description: `${serviceType} services for ${city}, ${state} businesses by PixelVerse Studios.`,
      url: `${siteUrl}${pagePath}`,
      email: 'info@pixelversestudios.io',
      telephone: '+1-201-638-1769',
      image: lightModeLogo,
      logo: lightModeLogo,
      priceRange: '$$',
      ...(coordinates && {
        geo: {
          '@type': 'GeoCoordinates',
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
        },
      }),
      address: {
        '@type': 'PostalAddress',
        addressLocality: city,
        addressRegion: state,
        addressCountry: 'US',
      },
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '17:00',
      },
      sameAs: [
        'https://www.instagram.com/pixel.verse.studios/',
        'https://www.facebook.com/profile.php?id=61582670432316',
        'https://www.linkedin.com/company/pixelverse-studios/',
        'https://www.youtube.com/@PixelVerse_Studios_nj',
        'https://x.com/pvs_nj',
      ],
      parentOrganization: {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'PixelVerse Studios',
      },
    },
    areaServed: {
      '@type': 'City',
      name: city,
      containedInPlace: {
        '@type': 'State',
        name: state,
      },
    },
  };
}

/**
 * Creates breadcrumb schema for local service pages
 * Home > Services > [Service Name] > [City Name]
 */
export function createLocalServiceBreadcrumbSchema(
  serviceName: string,
  serviceSlug: string,
  city: string,
  citySlug: string
) {
  return createBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: serviceName, path: `/services/${serviceSlug}` },
    { name: city, path: `/services/${serviceSlug}/${citySlug}` },
  ]);
}

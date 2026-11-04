import { sharedMetadata } from '@/lib/metadata';

const {
  siteUrl,
  logo: { light: lightModeLogo },
} = sharedMetadata;

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
    'https://www.linkedin.com/company/pixelverse-studios-llc/',
    'https://www.youtube.com/@PixelVerse_Studios_nj',
    'https://x.com/pvs_nj',
  ],
};

// Service coverage for area landing pages; towns are not office locations.
export interface CitySchemaParams {
  slug: string;
  city: string;
  state: string;
  description?: string;
  basePath?: string; // e.g. '/areas/bergen-county/fort-lee' — defaults to '/services/${slug}'
  isCounty?: boolean; // true for county-level pages — uses AdministrativeArea instead of City
}

// Existing callers retain this name; the payload describes coverage, not a branch.
export function createCityLocalBusinessSchema({
  slug,
  city,
  state,
  description,
  basePath,
  isCounty = false,
}: CitySchemaParams) {
  const pagePath = basePath || `/services/${slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${siteUrl}${pagePath}/#area-services`,
    name: `Web Design & SEO Services for ${city}, ${state}`,
    description:
      description || `Custom web design and local SEO services for ${city}, ${state} businesses.`,
    url: `${siteUrl}${pagePath}`,
    provider: { '@id': localBusinessSchema['@id'] },
    areaServed: {
      '@type': isCounty ? 'AdministrativeArea' : 'City',
      name: `${city}, ${state}`,
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
  basePath?: string;
}

export function createCityServiceSchema({
  serviceName,
  serviceType,
  city,
  state,
  slug,
  description,
  basePath,
}: ServiceSchemaParams) {
  const pagePath = basePath || `/services/${slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${siteUrl}${pagePath}/#service-${(serviceType || 'service').toLowerCase().replace(/\s+/g, '-')}`,
    name: serviceName,
    serviceType: serviceType,
    description: description,
    provider: {
      '@type': 'ProfessionalService',
      '@id': localBusinessSchema['@id'],
      name: 'PixelVerse Studios',
      url: siteUrl,
    },
    areaServed: {
      '@type': 'City',
      name: city,
      containedInPlace: {
        '@type': 'State',
        name: state,
      },
    },
    url: `${siteUrl}${pagePath}`,
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
export function createCityServicesSchema(
  slug: string,
  city: string,
  state: string,
  basePath?: string,
) {
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
  ];

  return services.map((service) =>
    createCityServiceSchema({
      serviceName: service.name,
      serviceType: service.type,
      city,
      state,
      slug,
      description: service.description,
      basePath,
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
        'https://www.linkedin.com/company/pixelverse-studios-llc/',
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
  citySlug: string,
) {
  return createBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: serviceName, path: `/services/${serviceSlug}` },
    { name: city, path: `/services/${serviceSlug}/${citySlug}` },
  ]);
}

/**
 * Creates Article schema for individual case study pages
 * Home > Portfolio > [Case Study Name]
 */
export function createCaseStudySchema({
  slug,
  title,
  description,
  clientName,
}: {
  slug: string;
  title: string;
  description: string;
  clientName: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: title,
    description,
    creator: {
      '@type': 'Organization',
      name: 'PixelVerse Studios',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'PixelVerse Studios',
      url: siteUrl,
      logo: { '@type': 'ImageObject', url: lightModeLogo },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/portfolio/${slug}`,
    },
    about: {
      '@type': 'Organization',
      name: clientName,
    },
  };
}

/**
 * Creates BreadcrumbList schema for case study detail pages
 * Home > Portfolio > [Case Study Name]
 */
export function createCaseStudyBreadcrumbSchema(clientName: string, slug: string) {
  return createBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: clientName, path: `/portfolio/${slug}` },
  ]);
}

// WebSite schema for global SERP presence
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteUrl}/#website`,
  url: siteUrl,
  name: 'PixelVerse Studios',
  description:
    'Custom web design & SEO focused on real business outcomes. We build high-performing websites for New Jersey businesses that rank, convert, and scale.',
  publisher: {
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: 'PixelVerse Studios',
  },
};

// Service schemas for homepage — describes the two core offerings
export function createHomepageServiceSchemas() {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': `${siteUrl}/#service-web-design`,
      name: 'Web Design & Development',
      serviceType: 'Web Design',
      description:
        'Custom websites that are user-focused, conversion-optimized, and built to support your business goals. From initial design to development and launch.',
      url: `${siteUrl}/services/web-development`,
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
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': `${siteUrl}/#service-seo`,
      name: 'Website Optimization & SEO',
      serviceType: 'SEO',
      description:
        'Improving search rankings and visibility through site structure, content optimization, performance improvements, and local SEO strategies that help the right customers find your business.',
      url: `${siteUrl}/services/seo`,
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
    },
  ];
}

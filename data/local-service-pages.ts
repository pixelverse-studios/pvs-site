/**
 * Local Service Pages Data Structure
 *
 * This file contains the data definitions for city-specific service pages
 * (e.g., /services/web-development/fort-lee).
 *
 * Each page combines a specific service type with a city location,
 * enabling hyper-local SEO targeting.
 *
 * Content should be unique per city+service combination - not templated.
 */

// Service type definitions
export type ServiceType = 'web-development' | 'ux-ui-design' | 'seo';

export interface ServiceDefinition {
  slug: ServiceType;
  name: string;
  shortName: string;
  description: string;
}

export const serviceDefinitions: Record<ServiceType, ServiceDefinition> = {
  'web-development': {
    slug: 'web-development',
    name: 'Web Development',
    shortName: 'Web Dev',
    description:
      'Custom-coded, performance-focused websites built to convert visitors into customers.',
  },
  'ux-ui-design': {
    slug: 'ux-ui-design',
    name: 'UX/UI Design',
    shortName: 'UX/UI',
    description:
      'Strategic design that balances aesthetics with usability to drive conversions.',
  },
  seo: {
    slug: 'seo',
    name: 'SEO Services',
    shortName: 'SEO',
    description:
      'Search optimization that drives organic traffic and builds long-term visibility.',
  },
};

// Supported cities for local service pages
export interface CityDefinition {
  slug: string;
  city: string;
  state: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

// Priority cities (Phase 1)
export const priorityCities: CityDefinition[] = [
  {
    slug: 'fort-lee',
    city: 'Fort Lee',
    state: 'NJ',
    coordinates: { latitude: 40.8509, longitude: -73.9701 },
  },
  {
    slug: 'englewood',
    city: 'Englewood',
    state: 'NJ',
    coordinates: { latitude: 40.8929, longitude: -73.9726 },
  },
  {
    slug: 'hackensack',
    city: 'Hackensack',
    state: 'NJ',
    coordinates: { latitude: 40.8859, longitude: -74.0435 },
  },
  {
    slug: 'paramus',
    city: 'Paramus',
    state: 'NJ',
    coordinates: { latitude: 40.9445, longitude: -74.0754 },
  },
  {
    slug: 'ridgewood',
    city: 'Ridgewood',
    state: 'NJ',
    coordinates: { latitude: 40.9793, longitude: -74.1166 },
  },
];

// Phase 2 cities (to be added later)
export const phase2Cities: CityDefinition[] = [
  {
    slug: 'teaneck',
    city: 'Teaneck',
    state: 'NJ',
    coordinates: { latitude: 40.8976, longitude: -74.0159 },
  },
  {
    slug: 'fair-lawn',
    city: 'Fair Lawn',
    state: 'NJ',
    coordinates: { latitude: 40.9404, longitude: -74.1318 },
  },
  {
    slug: 'bergenfield',
    city: 'Bergenfield',
    state: 'NJ',
    coordinates: { latitude: 40.9276, longitude: -73.9982 },
  },
  {
    slug: 'cliffside-park',
    city: 'Cliffside Park',
    state: 'NJ',
    coordinates: { latitude: 40.8215, longitude: -73.9876 },
  },
  {
    slug: 'river-vale',
    city: 'River Vale',
    state: 'NJ',
    coordinates: { latitude: 41.0159, longitude: -74.0107 },
  },
];

// All supported cities (used for route generation)
export const supportedCities: CityDefinition[] = [...priorityCities, ...phase2Cities];

export const supportedCitySlugs = supportedCities.map((c) => c.slug);

// Full page content definition
export interface LocalServicePageDefinition {
  // Identifiers
  serviceSlug: ServiceType;
  citySlug: string;

  // Metadata (SEO)
  metadata: {
    title: string;
    description: string;
    keywords: string[];
  };

  // Hero section
  hero: {
    eyebrow: string;
    heading: string;
    description: string;
    bullets: string[];
    stat?: {
      value: string;
      label: string;
    };
  };

  // Main content sections
  content: {
    intro: {
      heading: string;
      body: string;
    };
    features: Array<{
      title: string;
      description: string;
      localAngle: string;
    }>;
    process?: Array<{
      step: number;
      title: string;
      description: string;
    }>;
  };

  // Social proof
  proof: {
    headline: string;
    body: string;
    stat?: {
      value: string;
      label: string;
    };
    testimonial?: {
      quote: string;
      name: string;
      role: string;
      company?: string;
    };
  };

  // FAQ (minimum 3 questions)
  faq: Array<{
    question: string;
    answer: string;
  }>;

  // CTA section
  cta: {
    headline: string;
    body: string;
    primaryLabel: string;
    secondaryLabel?: string;
    secondaryHref?: string;
  };

  // Related pages
  relatedCities?: Array<{
    slug: string;
    city: string;
  }>;
  relatedServices?: ServiceType[];
}

/**
 * Local Service Pages Registry
 *
 * Content is added here as individual pages are created.
 * Start with Fort Lee (all 3 services), then expand to other cities.
 */
export const localServicePages: LocalServicePageDefinition[] = [
  // Content will be added per-ticket as pages are created
  // Example structure preserved for reference:
  // {
  //   serviceSlug: 'web-development',
  //   citySlug: 'fort-lee',
  //   metadata: { ... },
  //   hero: { ... },
  //   content: { ... },
  //   proof: { ... },
  //   faq: [ ... ],
  //   cta: { ... },
  // }
];

// Helper functions
export function getLocalServicePage(
  serviceSlug: ServiceType,
  citySlug: string
): LocalServicePageDefinition | undefined {
  return localServicePages.find(
    (page) => page.serviceSlug === serviceSlug && page.citySlug === citySlug
  );
}

export function getServiceDefinition(slug: ServiceType): ServiceDefinition {
  return serviceDefinitions[slug];
}

export function getCityDefinition(slug: string): CityDefinition | undefined {
  return supportedCities.find((city) => city.slug === slug);
}

export function getLocalServicePageSlugs(): Array<{ service: ServiceType; city: string }> {
  return localServicePages.map((page) => ({
    service: page.serviceSlug,
    city: page.citySlug,
  }));
}

// Validation helper - checks if a city is supported
export function isSupportedCity(slug: string): boolean {
  return supportedCitySlugs.includes(slug);
}

// Get all pages for a specific service
export function getPagesByService(serviceSlug: ServiceType): LocalServicePageDefinition[] {
  return localServicePages.filter((page) => page.serviceSlug === serviceSlug);
}

// Get all pages for a specific city
export function getPagesByCity(citySlug: string): LocalServicePageDefinition[] {
  return localServicePages.filter((page) => page.citySlug === citySlug);
}

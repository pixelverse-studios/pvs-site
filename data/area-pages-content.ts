import type { FaqItem } from '@/data/faq-types';

// =============================================================================
// Type Definitions
// =============================================================================

export interface CountyContent {
  slug: string;
  name: string;
  state: string;
  metaTitle: string;
  metaDescription: string;
  hero: {
    title: string;
    description: string;
  };
  cities: string[]; // city slugs in this county
}

export interface CityPageContent {
  slug: string;
  city: string;
  state: string;
  county: string;
  countySlug: string;
  metaTitle: string;
  metaDescription: string;
  hero: {
    title: string;
    description: string;
  };
  intro: string;
  services: {
    heading: string;
    body: string;
  }[];
  localSignals: {
    heading: string;
    body: string;
  };
  faq: FaqItem[];
  primaryKeywords: string[];
}

// =============================================================================
// County Data
// =============================================================================

const counties: Record<string, CountyContent> = {
  'bergen-county': {
    slug: 'bergen-county',
    name: 'Bergen County',
    state: 'NJ',
    metaTitle: 'Web Design & SEO Services in Bergen County, NJ | Pixelverse Studios',
    metaDescription:
      'Bergen County web design and local SEO agency. Pixelverse Studios builds custom websites and drives local search results for businesses across Fort Lee, Englewood, Hackensack, Paramus, and Ridgewood.',
    hero: {
      title: 'Web Design & SEO for Bergen County Businesses',
      description:
        'Custom web design and local SEO services for businesses across Bergen County, NJ. We help local businesses show up, stand out, and convert.',
    },
    cities: ['fort-lee', 'englewood', 'hackensack', 'paramus', 'ridgewood'],
  },
};

// =============================================================================
// City Data (placeholder structure — full content added per-city in DEV-348–352)
// =============================================================================

const cities: Record<string, CityPageContent> = {
  'fort-lee': {
    slug: 'fort-lee',
    city: 'Fort Lee',
    state: 'NJ',
    county: 'Bergen County',
    countySlug: 'bergen-county',
    metaTitle: 'Web Design & SEO for Fort Lee, NJ Businesses | Pixelverse Studios',
    metaDescription:
      'Fort Lee web design and local SEO services from Pixelverse Studios. We build custom websites that help Fort Lee businesses show up, stand out, and convert.',
    hero: {
      title: 'Web Design & Local SEO for Fort Lee, NJ',
      description:
        'Custom websites and local search optimization for Fort Lee businesses. Based in neighboring Cliffside Park, we understand the Fort Lee market.',
    },
    intro: '',
    services: [],
    localSignals: { heading: '', body: '' },
    faq: [],
    primaryKeywords: ['web design Fort Lee NJ', 'Fort Lee website designer', 'SEO agency Fort Lee NJ'],
  },
  englewood: {
    slug: 'englewood',
    city: 'Englewood',
    state: 'NJ',
    county: 'Bergen County',
    countySlug: 'bergen-county',
    metaTitle: 'Web Design & SEO Services in Englewood, NJ | Pixelverse Studios',
    metaDescription:
      'Pixelverse Studios helps Englewood, NJ businesses grow online with custom web design, development, and local SEO. Serving Palisade Ave and beyond.',
    hero: {
      title: 'Web Design & SEO for Englewood, NJ Businesses',
      description:
        'Custom websites and local search optimization for Englewood businesses along Palisade Avenue and throughout Bergen County.',
    },
    intro: '',
    services: [],
    localSignals: { heading: '', body: '' },
    faq: [],
    primaryKeywords: ['web design Englewood NJ', 'local SEO agency Englewood NJ', 'Englewood website designer'],
  },
  hackensack: {
    slug: 'hackensack',
    city: 'Hackensack',
    state: 'NJ',
    county: 'Bergen County',
    countySlug: 'bergen-county',
    metaTitle: 'Web Design & SEO in Hackensack, NJ | Pixelverse Studios',
    metaDescription:
      'Pixelverse Studios builds custom websites and local SEO strategies for Hackensack, NJ businesses. From Main Street to Route 17 — we help you rank.',
    hero: {
      title: 'Web Design & Local SEO for Hackensack, NJ',
      description:
        'Custom websites and local search optimization for Hackensack businesses. Serving the county seat and Bergen County\'s largest commercial hub.',
    },
    intro: '',
    services: [],
    localSignals: { heading: '', body: '' },
    faq: [],
    primaryKeywords: ['web design Hackensack NJ', 'Hackensack digital agency', 'Hackensack SEO services'],
  },
  paramus: {
    slug: 'paramus',
    city: 'Paramus',
    state: 'NJ',
    county: 'Bergen County',
    countySlug: 'bergen-county',
    metaTitle: 'Web Design & SEO Services in Paramus, NJ | Pixelverse Studios',
    metaDescription:
      'Pixelverse Studios creates custom websites and local SEO for Paramus, NJ businesses. Stand out on Route 4, Route 17, and in local search results.',
    hero: {
      title: 'Web Design & Local SEO for Paramus, NJ',
      description:
        'Custom websites and local search optimization for Paramus businesses along Route 4, Route 17, and throughout Bergen County.',
    },
    intro: '',
    services: [],
    localSignals: { heading: '', body: '' },
    faq: [],
    primaryKeywords: ['web design Paramus NJ', 'Paramus SEO services', 'Paramus NJ digital marketing'],
  },
  ridgewood: {
    slug: 'ridgewood',
    city: 'Ridgewood',
    state: 'NJ',
    county: 'Bergen County',
    countySlug: 'bergen-county',
    metaTitle: 'Web Design & SEO in Ridgewood, NJ | Pixelverse Studios',
    metaDescription:
      'Pixelverse Studios builds custom websites and local SEO for Ridgewood, NJ businesses. Serving the Village downtown and surrounding Bergen County.',
    hero: {
      title: 'Web Design & Local SEO for Ridgewood, NJ',
      description:
        'Custom websites and local search optimization for Ridgewood businesses in the Village downtown and surrounding Bergen County.',
    },
    intro: '',
    services: [],
    localSignals: { heading: '', body: '' },
    faq: [],
    primaryKeywords: ['web design Ridgewood NJ', 'Ridgewood digital agency', 'Ridgewood NJ SEO services'],
  },
};

// =============================================================================
// Lookup Helpers
// =============================================================================

export function getCountyContent(countySlug: string): CountyContent | undefined {
  return counties[countySlug];
}

export function getCityContent(countySlug: string, citySlug: string): CityPageContent | undefined {
  const county = counties[countySlug];
  if (!county || !county.cities.includes(citySlug)) return undefined;
  return cities[citySlug];
}

export function getValidCountySlugs(): string[] {
  return Object.keys(counties);
}

export function getValidCitySlugs(): { county: string; city: string }[] {
  const slugs: { county: string; city: string }[] = [];
  for (const [countySlug, county] of Object.entries(counties)) {
    for (const citySlug of county.cities) {
      slugs.push({ county: countySlug, city: citySlug });
    }
  }
  return slugs;
}

export function getCitiesForCounty(countySlug: string): CityPageContent[] {
  const county = counties[countySlug];
  if (!county) return [];
  return county.cities.map((slug) => cities[slug]).filter(Boolean);
}

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
  intro: {
    heading: string;
    paragraphs: string[];
  };
  services: {
    heading: string;
    sections: {
      title: string;
      body: string;
    }[];
  };
  localSignals: {
    heading: string;
    paragraphs: string[];
  };
  faq: FaqItem[];
  cta: {
    heading: string;
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
        'Custom web design and local SEO services for businesses across Bergen County, NJ. Based in Cliffside Park, we help Bergen County businesses show up in local search, communicate their value clearly, and turn visitors into real customers.',
    },
    intro: {
      heading: 'Why Bergen County Businesses Need a Local Digital Partner',
      paragraphs: [
        'Bergen County is one of the most commercially active regions in New Jersey. From the George Washington Bridge corridor in Fort Lee to the retail density of Paramus, from the county seat in Hackensack to the boutique downtown of Ridgewood, businesses here operate in competitive local markets where showing up online is no longer optional.',
        'But showing up is only part of the equation. Bergen County businesses compete not just with each other, but with Manhattan agencies charging Manhattan rates, template-site factories that churn out generic pages, and national brands with unlimited marketing budgets. What local businesses need is a website that reflects the quality of their work and a search presence that puts them in front of the right people at the right time.',
        'That is exactly what we do. PixelVerse Studios is a web design and local SEO agency based in Cliffside Park, NJ, in the heart of Bergen County. We build custom websites and improve local search visibility for businesses across the county. We understand the Bergen County market because we live and work here. We know the commercial corridors, the search patterns, and the competitive landscape that shapes how local customers find and choose businesses.',
        'Whether you run a medical practice near Hackensack University Medical Center, a law firm in Fort Lee, a boutique on Palisade Avenue in Englewood, or a service business along Route 17 in Paramus, we build websites and SEO strategies specific to your market and your customers. We do not work from templates or apply generic strategies. Every project is scoped around the specific business, its competitive landscape, and the search behavior of its local audience.',
      ],
    },
    services: {
      heading: 'What We Do for Bergen County Businesses',
      sections: [
        {
          title: 'Custom Web Design & Development for Bergen County',
          body: 'We design and build custom websites for Bergen County businesses that need more than a template. Every project starts with understanding the business, its customers, and the local market it serves. We plan the site structure, design for clarity and conversion, and develop with performance and SEO built in from day one. The result is a website that reflects the quality of your work, communicates your services clearly, and makes it easy for Bergen County customers to take the next step. Whether you need a new site built from scratch or a rebuild of something that no longer fits how your business operates, we handle the full process from strategy through launch.',
        },
        {
          title: 'Local SEO & Search Optimization for Bergen County',
          body: 'For Bergen County businesses with an existing website that is not generating the visibility or inquiries it should, we focus on local search optimization. That means evaluating how the site is structured for local discovery, improving how services and locations are communicated, addressing technical issues that affect search performance, and strengthening Google Business Profile presence. Local SEO is not a one-time fix. It is an ongoing effort to ensure your business shows up when Bergen County customers search for the services you offer. We focus on sustainable improvement, not short-term tactics that do not hold.',
        },
      ],
    },
    localSignals: {
      heading: 'Rooted in Bergen County, Built for Local Business',
      paragraphs: [
        'Bergen County is home to over 950,000 residents and thousands of businesses across 70 municipalities. It is the most populous county in New Jersey and one of the wealthiest in the country, with a diverse economic base that spans healthcare, professional services, retail, hospitality, and technology. The George Washington Bridge connects the county directly to Manhattan, making Bergen County a hub for businesses that serve both local and cross-Hudson markets.',
        'The commercial landscape is varied and competitive. Hackensack anchors the county as its seat of government and largest city, with Hackensack University Medical Center driving a significant healthcare economy. Paramus draws millions of shoppers annually to Garden State Plaza, Bergen Town Center, and the Route 4 and Route 17 retail corridors. Fort Lee sits at the foot of the GW Bridge, serving a dense mix of professional services, hospitality, and a growing Korean business community. Englewood combines a vibrant Palisade Avenue commercial district with a major hospital system. Ridgewood offers one of the most distinctive independent downtown business districts in Northern New Jersey.',
        'We work with businesses across all of these markets. Because we are based in Cliffside Park, we understand the nuances that shape how Bergen County customers search, evaluate, and choose local businesses. That local knowledge informs every website we build and every SEO strategy we develop. When a Bergen County resident searches for a service, they expect to find businesses that understand their community. Our job is to make sure your business is one of the first they find and that your website gives them the confidence to reach out.',
      ],
    },
    faq: [
      {
        question: 'Do you work with businesses across all of Bergen County?',
        answer:
          'Yes. We are based in Cliffside Park, NJ, and serve businesses throughout Bergen County. Our priority focus areas include Fort Lee, Englewood, Hackensack, Paramus, and Ridgewood, but we work with businesses across the county and Northern New Jersey.',
      },
      {
        question: 'How much does a website cost for a Bergen County business?',
        answer:
          'Most custom website projects for Bergen County small-to-mid-size businesses fall in the $3,000 to $10,000 range, depending on scope, number of pages, and content work involved. Local SEO engagements typically range from $1,500 to $5,000 for an initial optimization project. We scope every project individually based on what the business actually needs.',
        link: { label: 'Share your project details', href: '/contact/details' },
      },
      {
        question: 'How long does it take to rank in Bergen County search results?',
        answer:
          'For local SEO, meaningful movement in search visibility typically takes 3 to 6 months. Some improvements, like technical fixes and Google Business Profile optimization, can show impact faster. Sustained ranking gains take time as search engines re-evaluate the site. We set realistic timelines upfront so expectations align with what the work can deliver.',
      },
      {
        question: 'What makes you different from agencies in Manhattan or larger NJ firms?',
        answer:
          'We are a Bergen County business ourselves. We understand the local market, the commercial corridors, and the search patterns that Bergen County customers use. We also build custom, not from templates, and we focus exclusively on web design and local SEO. You get focused expertise and local knowledge without the overhead of a large agency.',
      },
      {
        question: 'Do you handle Google Business Profile optimization?',
        answer:
          'Yes. Google Business Profile is a significant factor in local search visibility, and we address it as part of our local SEO work. That includes profile setup, optimization, category and service configuration, photo management, and review response strategy.',
      },
    ],
    cta: {
      heading: 'Ready to Grow Your Bergen County Business Online?',
      description:
        'Based in Cliffside Park, NJ, we work with businesses across Bergen County to build websites that perform and search strategies that deliver. The next step is a conversation about your situation and what makes sense for your business.',
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

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
  // ==========================================================================
  // FORT LEE
  // ==========================================================================

  // Fort Lee - Web Development
  {
    serviceSlug: 'web-development',
    citySlug: 'fort-lee',
    metadata: {
      title: 'Web Development Fort Lee NJ | Custom Websites',
      description:
        'Custom web development for Fort Lee businesses. Hand-coded websites built for performance, SEO, and conversions. Serving law firms, medical practices, and hospitality brands near the GWB.',
      keywords: [
        'web development Fort Lee NJ',
        'Fort Lee web developer',
        'custom websites Fort Lee',
        'Fort Lee website design',
        'web design Fort Lee New Jersey',
      ],
    },
    hero: {
      eyebrow: 'Web Development in Fort Lee, NJ',
      heading: 'Custom websites built for Fort Lee businesses competing with Manhattan.',
      description:
        'Fort Lee sits at the foot of the George Washington Bridge, where Bergen County professionals compete directly with NYC agencies for the same clients. Your website needs to match Manhattan polish while speaking to the local market. We build custom-coded, performance-first websites that help Fort Lee law firms, medical practices, and hospitality brands convert visitors into clients—without the Manhattan price tag.',
      bullets: [
        'Hand-coded websites optimized for Fort Lee searches and NYC spillover traffic',
        'Sub-2-second load times that outperform template-based competitors',
        'Conversion architecture designed for professional services and hospitality bookings',
      ],
      stat: {
        value: '38%',
        label: 'average increase in qualified leads for Fort Lee service businesses',
      },
    },
    content: {
      intro: {
        heading: 'Why Fort Lee businesses need custom web development',
        body: 'Template websites signal "small-time" to the professionals and executives living in Hudson Lights, The Modern, and Fort Lee\'s luxury towers. These residents expect digital experiences that match the quality they see from Manhattan firms. Custom development delivers the performance, design sophistication, and conversion optimization that template builders simply cannot match—positioning your Fort Lee business as the premium local choice.',
      },
      features: [
        {
          title: 'Performance-First Architecture',
          description:
            'Every millisecond matters. We build sites that load in under 2 seconds, improving both user experience and Google rankings.',
          localAngle:
            'Fort Lee commuters research services on mobile between GWB traffic. Fast sites capture attention before they scroll past.',
        },
        {
          title: 'Conversion-Optimized Design',
          description:
            'Strategic layouts guide visitors toward consultations, appointments, and bookings with clear calls-to-action.',
          localAngle:
            'Designed for professional services near Main Street and hospitality brands along the Hudson waterfront.',
        },
        {
          title: 'SEO-Ready Foundation',
          description:
            'Clean semantic markup, structured data, and optimized metadata built into every page from the start.',
          localAngle:
            'Target Fort Lee, Palisades Park, and Upper Manhattan searches simultaneously with localized content architecture.',
        },
        {
          title: 'Mobile-First Development',
          description:
            'Responsive designs that work flawlessly across phones, tablets, and desktops without compromising functionality.',
          localAngle:
            'Over 60% of Fort Lee service searches happen on mobile—your site needs to convert on every device.',
        },
        {
          title: 'Secure & Scalable Code',
          description:
            'No plugin vulnerabilities or platform limitations. Custom code means complete control over security and growth.',
          localAngle:
            'HIPAA-aware builds for Fort Lee medical practices. Compliance-ready architecture for law firms.',
        },
        {
          title: 'Ongoing Support & Updates',
          description:
            'Monthly maintenance, security updates, and content changes without waiting on third-party developers.',
          localAngle:
            'Launch seasonal promotions and service updates quickly to stay competitive in the Bergen County market.',
        },
      ],
    },
    proof: {
      headline: 'Fort Lee businesses trust us to compete at the highest level.',
      body: 'We\'ve helped Fort Lee professional services and hospitality brands launch websites that match the expectations of their discerning clientele. From law firms near the courthouse to medical practices along Lemoine Avenue, our custom builds deliver the performance and polish that turn visitors into clients. The result: faster load times, better search visibility, and measurable increases in qualified leads.',
      stat: {
        value: '2.1s',
        label: 'average page load time for Fort Lee client sites',
      },
    },
    faq: [
      {
        question: 'How long does a custom Fort Lee website take to build?',
        answer:
          'Most Fort Lee projects launch in 8-10 weeks, from strategy through go-live. We prioritize key landing pages early so you can start ranking for Fort Lee searches while the full build completes. Rush timelines are available for businesses with urgent competitive needs.',
      },
      {
        question: 'What makes custom development better than WordPress or Squarespace?',
        answer:
          'Template platforms add bloat that slows your site, creates security vulnerabilities, and limits design options. Custom development means every line of code serves your business goals—resulting in faster performance, better SEO, and complete design freedom. Fort Lee professionals notice the difference.',
      },
      {
        question: 'Do you build websites for specific Fort Lee industries?',
        answer:
          'We specialize in Fort Lee law firms, medical and dental practices, wellness studios, hospitality brands, and professional services. Each industry has unique requirements—HIPAA compliance for healthcare, trust signals for legal, booking systems for hospitality—and we build accordingly.',
      },
      {
        question: 'Can you redesign my existing Fort Lee business website?',
        answer:
          'Absolutely. We audit your current site, preserve SEO value during migration, and dramatically improve performance and user experience. Many Fort Lee businesses come to us after outgrowing their template-based sites.',
      },
      {
        question: 'How do you handle hosting and maintenance?',
        answer:
          'We deploy to modern hosting platforms with built-in CDN, automatic scaling, and excellent uptime. Our support retainers include security updates, performance monitoring, and content changes so your site stays fast and secure.',
      },
    ],
    cta: {
      headline: 'Ready to upgrade your Fort Lee web presence?',
      body: 'Let\'s discuss your project. We\'ll audit your current site, analyze your Fort Lee competition, and create a roadmap to build something that converts.',
      primaryLabel: 'Start Your Fort Lee Project',
      secondaryLabel: 'View Our Work',
      secondaryHref: '/portfolio',
    },
    relatedCities: [
      { slug: 'englewood', city: 'Englewood' },
      { slug: 'hackensack', city: 'Hackensack' },
    ],
    relatedServices: ['ux-ui-design', 'seo'],
  },

  // Fort Lee - UX/UI Design
  {
    serviceSlug: 'ux-ui-design',
    citySlug: 'fort-lee',
    metadata: {
      title: 'UX/UI Design Fort Lee NJ | User Experience Agency',
      description:
        'UX/UI design services for Fort Lee businesses. Conversion-focused interfaces that turn visitors into clients. Serving professional services and hospitality brands near the George Washington Bridge.',
      keywords: [
        'UX design Fort Lee NJ',
        'UI design Fort Lee',
        'user experience Fort Lee',
        'Fort Lee web design agency',
        'conversion design Fort Lee NJ',
      ],
    },
    hero: {
      eyebrow: 'UX/UI Design in Fort Lee, NJ',
      heading: 'User experiences designed for Fort Lee\'s discerning clientele.',
      description:
        'Fort Lee residents living in Hudson Lights and The Modern expect digital experiences that match the premium services they seek. Template designs signal "budget option" to these sophisticated users. We craft strategic UX/UI that guides visitors toward action—booking consultations, scheduling appointments, making reservations—with interfaces as polished as the services you provide.',
      bullets: [
        'Conversion-focused design that turns Fort Lee visitors into paying clients',
        'Premium aesthetics that match the expectations of GWB corridor professionals',
        'Mobile-first interfaces optimized for on-the-go research and booking',
      ],
      stat: {
        value: '47%',
        label: 'average improvement in conversion rates after UX redesign',
      },
    },
    content: {
      intro: {
        heading: 'Design that converts Fort Lee\'s demanding audience',
        body: 'The professionals and families living in Fort Lee\'s luxury developments research thoroughly before committing to a service provider. They compare your digital presence against Manhattan competitors and local alternatives. Strategic UX/UI design creates the trust, clarity, and ease-of-action that transforms these careful researchers into loyal clients—without the confusion and friction that sends them elsewhere.',
      },
      features: [
        {
          title: 'Conversion Architecture',
          description:
            'Every element strategically placed to guide users toward your primary business goals—consultations, bookings, and inquiries.',
          localAngle:
            'Designed for Fort Lee service businesses where a single conversion can mean thousands in revenue.',
        },
        {
          title: 'Trust-Building Design',
          description:
            'Visual hierarchy, social proof placement, and credibility signals that establish authority at first glance.',
          localAngle:
            'Essential for Fort Lee law firms and medical practices competing against established Manhattan competitors.',
        },
        {
          title: 'Intuitive Navigation',
          description:
            'Clear information architecture that helps visitors find what they need without frustration or confusion.',
          localAngle:
            'Fort Lee commuters have limited time—your site needs to answer their questions instantly.',
        },
        {
          title: 'Mobile Experience Design',
          description:
            'Touch-optimized interfaces with appropriate tap targets, readable typography, and streamlined mobile flows.',
          localAngle:
            'Most Fort Lee service research happens on phones during commutes and lunch breaks.',
        },
        {
          title: 'Accessibility Standards',
          description:
            'WCAG-compliant designs that ensure your site works for all users, regardless of ability.',
          localAngle:
            'Required for Fort Lee medical practices and recommended for all professional services.',
        },
        {
          title: 'Brand-Aligned Aesthetics',
          description:
            'Visual design that reinforces your positioning—premium, approachable, authoritative, or innovative.',
          localAngle:
            'Match the sophistication Fort Lee residents expect from their professional service providers.',
        },
      ],
    },
    proof: {
      headline: 'Fort Lee businesses convert more with strategic design.',
      body: 'We\'ve redesigned interfaces for Fort Lee professional services that were losing potential clients to confusing navigation, weak calls-to-action, and dated aesthetics. The impact is measurable: more consultation requests, more appointment bookings, and higher-quality leads from visitors who trust what they see. Good design isn\'t just pretty—it\'s profitable.',
      stat: {
        value: '3.2x',
        label: 'increase in consultation requests after UX optimization',
      },
    },
    faq: [
      {
        question: 'What\'s the difference between UX and UI design?',
        answer:
          'UX (user experience) design focuses on how your site works—the flow, structure, and ease of completing tasks. UI (user interface) design focuses on how it looks—colors, typography, and visual elements. Both are essential for converting Fort Lee visitors into clients, and we handle both as an integrated process.',
      },
      {
        question: 'How do you approach UX design for Fort Lee service businesses?',
        answer:
          'We start with your business goals and your ideal Fort Lee client. We map the journey from first visit to conversion, identify friction points, and design interfaces that make taking action easy and natural. Every element earns its place by contributing to conversions.',
      },
      {
        question: 'Can you redesign my existing site without rebuilding everything?',
        answer:
          'Sometimes. If your current platform supports the improvements needed, we can redesign the interface while preserving your existing infrastructure. Often, though, template platform limitations make a fresh build more effective and cost-efficient for Fort Lee businesses.',
      },
      {
        question: 'How do you measure UX/UI success?',
        answer:
          'We track conversion rates, bounce rates, time-on-page, and user flow completion. For Fort Lee service businesses, the ultimate metric is qualified leads and booked appointments. We set up analytics to measure what matters to your business.',
      },
      {
        question: 'Do you provide UX/UI design for mobile apps?',
        answer:
          'Our primary focus is web-based interfaces, but we design responsive experiences that work beautifully across all devices. If you need a dedicated mobile app, we can recommend trusted partners or discuss whether a progressive web app might serve your Fort Lee business better.',
      },
    ],
    cta: {
      headline: 'Ready to convert more Fort Lee visitors?',
      body: 'Let\'s review your current user experience and identify the changes that will drive more consultations, bookings, and revenue.',
      primaryLabel: 'Get UX/UI Consultation',
      secondaryLabel: 'See Our Portfolio',
      secondaryHref: '/portfolio',
    },
    relatedCities: [
      { slug: 'englewood', city: 'Englewood' },
      { slug: 'hackensack', city: 'Hackensack' },
    ],
    relatedServices: ['web-development', 'seo'],
  },

  // Fort Lee - SEO Services
  {
    serviceSlug: 'seo',
    citySlug: 'fort-lee',
    metadata: {
      title: 'SEO Services Fort Lee NJ | Local Search Optimization',
      description:
        'Local SEO services for Fort Lee businesses. Rank higher in Google for Fort Lee searches. Serving law firms, medical practices, and service businesses near the George Washington Bridge.',
      keywords: [
        'SEO Fort Lee NJ',
        'Fort Lee SEO agency',
        'local SEO Fort Lee',
        'Fort Lee search optimization',
        'SEO services Fort Lee New Jersey',
      ],
    },
    hero: {
      eyebrow: 'SEO Services in Fort Lee, NJ',
      heading: 'Dominate Fort Lee search results and capture local demand.',
      description:
        'When Fort Lee residents search for "lawyer near me" or "best dentist Fort Lee," your business needs to appear. Local SEO puts you in front of high-intent searchers at the exact moment they\'re ready to choose a provider. We build SEO strategies that help Fort Lee professional services, medical practices, and hospitality brands rank above competitors—both local and Manhattan-based.',
      bullets: [
        'Rank for "Fort Lee" + service keywords that drive qualified leads',
        'Google Business Profile optimization for Maps visibility',
        'Technical SEO and content strategy tailored to Bergen County markets',
      ],
      stat: {
        value: '156%',
        label: 'average increase in organic traffic for Fort Lee SEO clients',
      },
    },
    content: {
      intro: {
        heading: 'Why local SEO matters for Fort Lee businesses',
        body: 'Fort Lee\'s unique position at the George Washington Bridge means you\'re competing for searches from both Bergen County residents and Manhattan commuters. Local SEO ensures your business appears when these high-intent searchers look for services in your area. Without proper optimization, you\'re invisible to the thousands of people searching for exactly what you offer—and they\'re finding your competitors instead.',
      },
      features: [
        {
          title: 'Google Business Profile Optimization',
          description:
            'Complete GBP setup and optimization to appear in Maps results and local pack for Fort Lee searches.',
          localAngle:
            'Rank in the "3-pack" when Fort Lee residents search for services near the GWB corridor.',
        },
        {
          title: 'Local Keyword Strategy',
          description:
            'Research and targeting of high-intent local search terms that drive qualified traffic.',
          localAngle:
            'Target "Fort Lee" + service terms plus nearby areas like Palisades Park and Edgewater.',
        },
        {
          title: 'On-Page SEO',
          description:
            'Optimized title tags, meta descriptions, headers, and content structure for search visibility.',
          localAngle:
            'Fort Lee-specific content that signals relevance to both Google and local searchers.',
        },
        {
          title: 'Technical SEO',
          description:
            'Site speed optimization, mobile-friendliness, structured data, and crawlability improvements.',
          localAngle:
            'Fast-loading pages that outperform template-based Fort Lee competitors in Core Web Vitals.',
        },
        {
          title: 'Local Citations & Directories',
          description:
            'Consistent NAP (name, address, phone) across directories and local business listings.',
          localAngle:
            'Bergen County directories, legal/medical listings, and Fort Lee business associations.',
        },
        {
          title: 'Content Strategy',
          description:
            'Blog posts, service pages, and location content that builds topical authority.',
          localAngle:
            'Content addressing Fort Lee-specific questions and establishing local expertise.',
        },
      ],
    },
    proof: {
      headline: 'Fort Lee businesses rank higher with our SEO strategies.',
      body: 'We\'ve helped Fort Lee law firms appear on page one for competitive legal keywords, medical practices rank in the local pack, and hospitality brands capture tourists searching before crossing the GWB. Local SEO isn\'t magic—it\'s methodical optimization that compounds over time. Our Fort Lee clients see sustainable traffic growth that translates directly into consultations and revenue.',
      stat: {
        value: 'Page 1',
        label: 'rankings achieved for primary Fort Lee service keywords',
      },
    },
    faq: [
      {
        question: 'How long does SEO take to show results in Fort Lee?',
        answer:
          'Local SEO typically shows meaningful improvements within 3-6 months, with continued growth over time. Fort Lee\'s competitive landscape means some keywords move faster than others. We prioritize quick wins while building toward more competitive terms.',
      },
      {
        question: 'Do you guarantee first page rankings for Fort Lee searches?',
        answer:
          'No legitimate SEO provider can guarantee specific rankings—Google\'s algorithm is complex and constantly evolving. What we guarantee is proven methodology, transparent reporting, and measurable progress toward your Fort Lee visibility goals.',
      },
      {
        question: 'How do you handle SEO for Fort Lee businesses serving multiple areas?',
        answer:
          'We build location-specific content and schema for each service area while maintaining Fort Lee as your primary location. This helps you rank in Fort Lee, Edgewater, Cliffside Park, and other Bergen County towns without diluting your local relevance.',
      },
      {
        question: 'What\'s included in your Fort Lee SEO services?',
        answer:
          'Our SEO packages include GBP optimization, on-page SEO, technical audits, local citation building, monthly reporting, and ongoing strategy adjustments. We customize the scope based on your Fort Lee business goals and competitive landscape.',
      },
      {
        question: 'Can you help with Google Ads alongside SEO for Fort Lee?',
        answer:
          'While our primary focus is organic SEO, we can coordinate with paid search strategies or recommend trusted partners for Google Ads management. Many Fort Lee businesses see the best results combining SEO for long-term growth with PPC for immediate visibility.',
      },
    ],
    cta: {
      headline: 'Ready to rank higher in Fort Lee?',
      body: 'Let\'s audit your current search visibility, identify opportunities, and build an SEO strategy that drives qualified Fort Lee leads to your business.',
      primaryLabel: 'Get SEO Analysis',
      secondaryLabel: 'View SEO Case Studies',
      secondaryHref: '/portfolio',
    },
    relatedCities: [
      { slug: 'englewood', city: 'Englewood' },
      { slug: 'hackensack', city: 'Hackensack' },
    ],
    relatedServices: ['web-development', 'ux-ui-design'],
  },
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

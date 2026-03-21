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
        'Custom websites and local search optimization for Fort Lee businesses. Based in neighboring Cliffside Park, we understand the Fort Lee market and build websites that help local businesses compete.',
    },
    intro:
      'Fort Lee sits at the New Jersey end of the George Washington Bridge, making it one of Bergen County\'s most visible and commercially active municipalities. The borough is home to a dense concentration of restaurants, medical practices, law firms, real estate agencies, and professional service businesses, many clustered along Main Street, Lemoine Avenue, and the Center Avenue corridor.\n\nFor Fort Lee businesses, the competitive landscape is shaped by proximity to Manhattan. Customers here have high expectations. They research online before making decisions, compare options across the Hudson, and expect websites that reflect the quality of the businesses they represent. A generic template site or an invisible search presence means lost opportunities to competitors who have invested in their online presence.\n\nPixelVerse Studios is based in Cliffside Park, directly adjacent to Fort Lee. We are not a remote agency guessing at your market. We know the Fort Lee business landscape because we are part of it. We shop on Main Street, we drive Lemoine Avenue, and we understand what Fort Lee customers look for when they search for local services. That proximity and familiarity informs every website we build and every SEO strategy we develop for Fort Lee businesses.',
    services: [
      {
        heading: 'Custom Web Design for Fort Lee Businesses',
        body:
          'We design and build custom websites for Fort Lee businesses that need a site reflecting the quality of their work. For a Fort Lee law firm, that means a professional, trust-building site with clear practice area pages and intake forms. For a Fort Lee restaurant, it means a fast, mobile-first site with menus, reservations, and location details that rank in local search. For a medical practice near Holy Name Medical Center or along Lemoine Avenue, it means HIPAA-aware design with appointment scheduling and provider profiles.\n\nEvery Fort Lee website project starts with understanding the business, its customers, and how those customers find and evaluate local options. We plan site structure around how Fort Lee residents actually search, design for clarity and conversion, and develop with performance built in. The result is a website that works as hard as the business behind it.',
      },
      {
        heading: 'Local SEO Services for Fort Lee, NJ',
        body:
          'If your Fort Lee business has a website but is not showing up when customers search for your services, local SEO is likely the issue. We help Fort Lee businesses improve their local search visibility by restructuring how services and locations are presented on the site, optimizing Google Business Profile presence, addressing technical performance issues, and ensuring the site sends the right signals to search engines.\n\nFor Fort Lee specifically, that means targeting queries like "web design Fort Lee NJ," "Fort Lee restaurants near me," "law firm Fort Lee NJ," and other geo-specific searches that your potential customers are using. We also optimize for the cross-Hudson dynamic that is unique to Fort Lee. Many Fort Lee residents work in Manhattan and search for local services from their phones during commutes. Capturing that mobile search traffic requires fast-loading pages, clear calls to action, and strong map pack presence.',
      },
    ],
    localSignals: {
      heading: 'Why Fort Lee Is Our Top Priority Market',
      body:
        'Fort Lee is the number one priority city in our Bergen County SEO strategy, and for good reason. The borough has a population of approximately 40,000, with a business district that punches well above its weight. The George Washington Bridge brings over 100 million vehicle crossings annually, making Fort Lee one of the most trafficked entry points in the entire New York metropolitan area.\n\nThe commercial corridors along Main Street and Lemoine Avenue host hundreds of businesses, from Korean barbecue restaurants and sushi bars to immigration law firms, dental practices, real estate offices, and tutoring centers. Fort Lee\'s Korean business community is one of the largest in New Jersey, creating a bilingual market with unique search behavior and distinct content needs.\n\nFort Lee also benefits from its proximity to the Palisades Interstate Park, the Hudson River waterfront, and the mixed-use development along the river that has brought new residents and businesses to the area. The combination of density, diversity, and commercial activity makes Fort Lee the highest-ROI market for local SEO in Bergen County.\n\nAs a Cliffside Park-based agency, we are literally next door. We understand the Fort Lee market at a level that remote agencies cannot match. That local depth translates into more relevant content, better keyword targeting, and websites that genuinely resonate with Fort Lee customers.',
    },
    faq: [
      {
        question: 'Do you work with Fort Lee restaurants and food businesses?',
        answer:
          'Yes. Fort Lee has one of the densest restaurant scenes in Bergen County, particularly along Main Street. We build fast, mobile-first websites for Fort Lee restaurants with online menus, reservation integration, and local SEO that targets "restaurants near Fort Lee" and cuisine-specific searches. We also optimize Google Business Profile listings for maximum visibility in the map pack.',
      },
      {
        question: 'How do I rank for "web design Fort Lee NJ" and similar searches?',
        answer:
          'Ranking for Fort Lee-specific searches requires a combination of on-page optimization, proper schema markup, a well-structured Google Business Profile, and content that clearly communicates your services in relation to Fort Lee. We build all of these elements into every project. Local SEO improvements typically show measurable results within 3 to 6 months.',
      },
      {
        question: 'Can you build a bilingual website for Fort Lee\'s Korean business community?',
        answer:
          'Yes. Fort Lee has a significant Korean-speaking population, and many local businesses serve bilingual customers. We can structure websites to support both English and Korean content, ensuring that both audiences can navigate the site easily and that search engines index content in both languages appropriately.',
      },
      {
        question: 'What does a website cost for a small business in Fort Lee?',
        answer:
          'Most custom website projects for Fort Lee small businesses fall in the $3,000 to $10,000 range, depending on the number of pages, design complexity, and content work involved. Local SEO projects typically range from $1,500 to $5,000 for initial optimization. We scope every project based on what the business actually needs.',
        link: { label: 'Share your project details', href: '/contact/details' },
      },
      {
        question: 'How is PixelVerse Studios connected to Fort Lee?',
        answer:
          'We are based in Cliffside Park, NJ, which directly borders Fort Lee. We are not a remote agency learning about your market from a spreadsheet. We live and work in the same community, understand the local business landscape, and bring that familiarity into every project we take on for Fort Lee businesses.',
      },
    ],
    primaryKeywords: [
      'web design Fort Lee NJ',
      'Fort Lee website designer',
      'SEO agency Fort Lee NJ',
      'small business website Fort Lee',
      'local SEO Fort Lee NJ',
    ],
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
        'Custom websites and local search optimization for Englewood businesses. From Palisade Avenue boutiques to medical practices near Englewood Hospital, we build sites that help Englewood businesses compete online.',
    },
    intro:
      'Englewood is one of Bergen County\'s most culturally diverse and commercially vibrant municipalities. The city\'s commercial heart runs along Palisade Avenue, where restaurants, law firms, medical offices, boutique retail, and professional service businesses serve a community of over 28,000 residents. The Van Brunt Street arts district adds a creative dimension that sets Englewood apart from surrounding towns.\n\nEnglewood Hospital & Medical Center is a major economic anchor, drawing patients, visitors, and healthcare professionals from across Northern New Jersey. The hospital\'s presence creates demand for a wide range of supporting businesses, from specialty medical practices and physical therapy clinics to pharmacies and home health services. For these businesses, showing up in local search results is not optional. It is how patients find providers.\n\nBeyond healthcare, Englewood\'s downtown corridor attracts a mix of dining establishments, legal practices, real estate offices, salons, and wellness studios. The city\'s proximity to the George Washington Bridge and its diverse, educated population make it a market where businesses need to present themselves professionally online. Customers in Englewood research before they buy, compare options, and expect websites that match the quality of the businesses they represent.\n\nPixelVerse Studios works with Englewood businesses to build websites and search strategies that reflect the quality of their work and put them in front of the right local audience. We are based in Cliffside Park, just minutes from Englewood, and we bring the local market knowledge that remote agencies lack.',
    services: [
      {
        heading: 'Custom Web Design for Englewood Businesses',
        body:
          'We build custom websites for Englewood businesses that go beyond templates. For a Palisade Avenue restaurant, that means a fast, mobile-optimized site with menus, online ordering, and local SEO that captures "restaurants near Englewood" searches. For a medical practice near Englewood Hospital, it means a professional site with provider profiles, appointment scheduling, and content that builds trust with patients researching their options. For a law firm or professional services company, it means a site that establishes authority, communicates specializations clearly, and converts visitors into consultations.\n\nEvery Englewood web design project starts with understanding the specific business, its customer base, and how those customers search for and evaluate local options. We structure the site around real search behavior, design for clarity and conversion, and develop with performance and SEO integrated from the beginning.',
      },
      {
        heading: 'Local SEO Services for Englewood, NJ',
        body:
          'If your Englewood business has a website but is not appearing in local search results, the issue is usually how the site is structured and positioned for local discovery. We help Englewood businesses improve their search visibility by optimizing site structure, refining how services and locations are communicated, resolving technical issues that limit indexing, and strengthening Google Business Profile presence.\n\nFor Englewood specifically, we target queries like "web design Englewood NJ," "dentist near Englewood," "Englewood restaurants Palisade Ave," and other geo-specific searches that local customers use. We also address the competitive dynamic where Englewood businesses compete for visibility against neighboring cities like Hackensack, Fort Lee, and Teaneck. Strong local SEO ensures your business shows up when Englewood customers search, not just when broader Bergen County queries surface.',
      },
    ],
    localSignals: {
      heading: 'Why Englewood Is a Priority Market for Local SEO',
      body:
        'Englewood occupies a unique position in Bergen County. It is one of the most culturally diverse municipalities in New Jersey, with a population that includes long-established families, NYC commuters, young professionals, and a significant international community. This diversity creates a rich and varied local economy where businesses serve a wide range of customers with different expectations and search behaviors.\n\nThe Palisade Avenue commercial corridor is the city\'s main business artery, stretching from the Englewood Cliffs border through downtown and connecting to the broader Bergen County commercial network. Van Brunt Street and its surrounding blocks form an arts and culture district that attracts visitors from across the region. Englewood Hospital & Medical Center, one of the largest employers in the city, drives significant foot traffic and creates a healthcare ecosystem that extends into surrounding blocks.\n\nEnglewood also benefits from its position between Fort Lee and Hackensack, two of Bergen County\'s other major commercial centers. Businesses in Englewood can capture search traffic from customers who live in neighboring towns and search for services without specifying a city. A well-optimized Englewood business website can rank for both Englewood-specific queries and broader "near me" searches from the surrounding area.\n\nWe understand these dynamics because we operate in the same market. Our Cliffside Park office puts us within minutes of Englewood, and we bring that proximity into every project we take on for Englewood businesses.',
    },
    faq: [
      {
        question: 'Do you work with Englewood restaurants and retail businesses?',
        answer:
          'Yes. Englewood\'s Palisade Avenue corridor has a strong restaurant and retail scene, and we build websites tailored to those businesses. That includes mobile-first design, online menus and ordering integration, local SEO for "restaurants near Englewood" searches, and Google Business Profile optimization to maximize visibility in the map pack.',
      },
      {
        question: 'Can you help my Englewood medical practice appear in Google Maps?',
        answer:
          'Yes. Google Business Profile optimization is a core part of our local SEO work. For Englewood medical practices, we optimize your profile with accurate categories, service descriptions, photos, and review management. Combined with on-site SEO and proper schema markup, this helps your practice appear in the local map pack when patients search for providers near Englewood Hospital and throughout the area.',
      },
      {
        question: 'How long does it take to rank in Englewood search results?',
        answer:
          'For local SEO, meaningful movement in search visibility typically takes 3 to 6 months. Technical fixes and Google Business Profile improvements can show impact faster. We set realistic timelines based on the competitive landscape for your specific services in the Englewood market.',
      },
      {
        question: 'What does web design cost for a small business in Englewood, NJ?',
        answer:
          'Most custom website projects for Englewood small businesses fall in the $3,000 to $10,000 range depending on scope. Local SEO projects typically start at $1,500 to $5,000. We scope every project based on what the business needs, not a one-size-fits-all package.',
        link: { label: 'Share your project details', href: '/contact/details' },
      },
      {
        question: 'Do you optimize for "near me" searches in Englewood?',
        answer:
          'Yes. "Near me" searches are a major source of local traffic, especially for restaurants, medical practices, and service businesses. We optimize your site structure, Google Business Profile, and local signals so your Englewood business appears when customers search for services in the area, even if they do not type "Englewood" explicitly.',
      },
    ],
    primaryKeywords: [
      'web design Englewood NJ',
      'local SEO agency Englewood NJ',
      'Englewood website designer',
      'Englewood NJ digital marketing agency',
    ],
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

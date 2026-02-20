// ============================================================================
// Case Studies — Single Source of Truth
// ============================================================================
// All case study data lives here. Components consume this file directly.
// To add a new case study: add a new entry to the `caseStudies` array.
// The homepage filters by `featured: true`.

export interface CaseStudyIssue {
  icon: string;
  issue: string;
  resolution: string;
}

export interface CaseStudyOutcome {
  metric: string;
  description: string;
}

export interface CaseStudy {
  slug: string;
  featured: boolean;
  name: string;
  industry: string;
  location: string;
  title: string;
  summary: string;
  problem: string;
  solution: string;
  issues: CaseStudyIssue[];
  outcome: CaseStudyOutcome;
  img: string;
  url: string;
  services: string[];
  testimonial?: {
    quote: string;
    name: string;
    role: string;
  };
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'jones-pressure-washing',
    featured: true,
    name: 'Jones Pressure Washing',
    industry: 'Home Services',
    location: 'Bergen & Essex County, NJ',
    title: 'How we helped a pressure washing company build search visibility across two counties',
    summary:
      "Rebuilt a local brand's online experience to increase trust, clarity, and ease of booking — from competitor research to launch.",
    problem:
      'Jones Pressure Washing had a strong local reputation built on word-of-mouth, but no structured online presence. Their previous site was a basic template with no service-specific pages, no city targeting, and no SEO architecture. Homeowners searching for pressure washing, soft washing, or holiday lighting in Bergen and Essex County had no way to find them online.',
    solution:
      'We built a custom site with dedicated service pages for each offering — pressure washing, soft washing, and holiday lighting — paired with city-level landing pages targeting key towns across Bergen and Essex County.',
    issues: [
      {
        icon: 'fileText',
        issue: 'Single-page site with no search visibility',
        resolution:
          'Built dedicated service pages and city-level landing pages across Bergen and Essex County, giving Google 14 indexable entry points instead of one',
      },
      {
        icon: 'zap',
        issue: 'No presence in seasonal service searches',
        resolution:
          "Created targeted holiday lighting pages for Essex and Bergen County — now pulling 950+ impressions for seasonal keywords and driving the site's highest-converting traffic",
      },
      {
        icon: 'alertCircle',
        issue: 'No local search footprint beyond direct name searches',
        resolution:
          'Structured service and city pages are now surfacing for 299 unique search queries, expanding visibility well beyond branded searches',
      },
    ],
    outcome: {
      metric: '5,200+ search impressions and 299 indexed queries within 6 months',
      description:
        "From a standing start, service-specific pages are pulling targeted impressions across two counties. Holiday lighting pages alone account for nearly 1,000 impressions, and the site architecture is building compounding visibility with each passing month.",
    },
    img: '/projects/JPW.png',
    url: 'https://www.jonespressurewashingnj.com',
    services: ['web-development', 'seo'],
    testimonial: {
      quote:
        "Our old site looked modern but converted terribly. PixelVerse rebuilt it from scratch with actual strategy behind every section. Now we're ranking for local searches and booking 2-3 jobs a week from the website alone.",
      name: 'David Jones',
      role: 'Founder',
    },
  },
  {
    slug: '360-degree-care',
    featured: true,
    name: '360 Degree Care',
    industry: 'Home Healthcare',
    location: 'Ridgewood, NJ',
    title: 'How we helped a home care agency build a digital presence that matched their reputation',
    summary:
      'Built a new independent web presence for a home care agency going out on their own — structured for trust, clarity, and local search from day one.',
    problem:
      '360 Degree Care spent years operating under a franchise brand. When they went independent, they had a strong local reputation — 4.8 stars on Google, 80% caregiver retention, CHAP certification — but no online presence of their own. Families searching for home care in Bergen County had no way to find them.',
    solution:
      'We built a custom site on a new domain with dedicated service pages, city-level landing pages, and SEO architecture designed to build organic visibility from a standing start.',
    issues: [
      {
        icon: 'fileText',
        issue: 'No independent online presence',
        resolution:
          'Built a custom site on a new domain with structured data, schema markup, and SEO architecture designed to index quickly and rank for local care searches',
      },
      {
        icon: 'zap',
        issue: 'Six services with no dedicated search visibility',
        resolution:
          'Created individual service pages with city-level landing pages — each structured to rank independently for queries like "personal care Bergen County" and "companion care Englewood"',
      },
      {
        icon: 'alertCircle',
        issue: 'Strong reputation invisible to searchers',
        resolution:
          'Surfaced trust signals throughout — Google reviews, CHAP certification, team credentials — so credibility shows up before the first phone call',
      },
    ],
    outcome: {
      metric: '8,500+ search impressions and 270 indexed queries within 6 months',
      description:
        "From a standing start on a new domain, individual service pages are now pulling hundreds of impressions for high-intent local searches. The site architecture is building organic visibility exactly as designed — and it's still climbing.",
    },
    img: '/projects/360.png',
    url: 'https://www.360degreecare.net',
    services: ['web-development', 'seo'],
    testimonial: {
      quote:
        "PixelVerse didn't just build us a website—they built us a system. We can update content ourselves, add new service pages, and track what's actually driving calls. Best investment we've made in our marketing.",
      name: 'Michael Chen',
      role: 'Owner',
    },
  },
  {
    slug: 'domani',
    featured: false,
    name: 'Domani',
    industry: 'Productivity SaaS',
    location: 'Remote',
    title: 'How we designed a distraction-free planning app built around a single daily habit',
    summary:
      'Created an easy-to-use productivity app that helps users plan tomorrow, tonight — focused on intuitive flow, minimal design, and daily consistency.',
    problem:
      "Most productivity tools overwhelm users with features that get in the way of actually planning. Domani needed a focused app experience that reduced decision fatigue and encouraged one simple nightly ritual: setting tomorrow's priorities before bed.",
    solution:
      'We designed a minimal interface around a single workflow — plan tonight, execute tomorrow. Every design decision was tested against whether it aided or interrupted the planning habit.',
    issues: [
      {
        icon: 'layoutGrid',
        issue: 'Too much friction in the planning flow',
        resolution:
          'Stripped the interface to its essential elements, reducing the nightly planning routine to under two minutes with zero visual noise',
      },
      {
        icon: 'zap',
        issue: 'Decision fatigue from too many options',
        resolution:
          'Applied behavioral science principles to limit daily inputs, guiding users toward consistent prioritization rather than open-ended task lists',
      },
      {
        icon: 'eye',
        issue: 'Visual design creating distraction rather than focus',
        resolution:
          'Designed a calm, low-contrast palette that signals "wind down" — reinforcing the intended nightly ritual through environmental cues',
      },
    ],
    outcome: {
      metric: 'Distraction-free UX with measurable habit-forming design',
      description:
        "The app's minimal interface and behavioral design patterns encourage consistent nightly use. Users report the planning process feels effortless rather than like another task to complete.",
    },
    img: '/projects/Domani1.png',
    url: 'https://www.domani-app.com',
    services: ['web-development'],
  },
];

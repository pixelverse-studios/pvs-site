// ============================================================================
// Case Studies — Single Source of Truth
// ============================================================================
// All case study data lives here. Components consume this file directly.
// To add a new case study: add a new entry to the `caseStudies` array.
// The homepage filters by `featured: true`.

export type CaseStudyService = 'web-development' | 'seo' | 'mobile-app';

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
  issues: [CaseStudyIssue, CaseStudyIssue, CaseStudyIssue];
  outcome: CaseStudyOutcome;
  img: string;
  url?: string;
  demoUrl?: string;
  services: CaseStudyService[];
  testimonial?: {
    quote: string;
    name: string;
    role?: string;
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
      "Rebuilt a local brand's online experience to increase trust, clarity, and ease of booking, from competitor research to launch.",
    problem:
      'Jones Pressure Washing had a strong local reputation built on word-of-mouth, but no structured online presence. Their previous site was a basic template with no service-specific pages, no city targeting, and no SEO architecture. Homeowners searching for pressure washing, soft washing, or holiday lighting in Bergen and Essex County had no way to find them online. The business was generating leads almost entirely through referrals and yard signs, leaving an entire channel of high-intent local search traffic untapped.',
    solution:
      'We built a custom site with dedicated service pages for each offering (pressure washing, soft washing, and holiday lighting) paired with city-level landing pages targeting key towns across Bergen and Essex County. The architecture was designed from the start to give Google clear signals about what services were offered and where, creating multiple indexable entry points instead of a single generic homepage. We also structured the booking flow to reduce friction, placing clear calls to action on every service page so visitors could request a quote without hunting for contact information.',
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
          "Created targeted holiday lighting pages for Essex and Bergen County, now pulling 950+ impressions for seasonal keywords and driving the site's highest-converting traffic",
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
        "From a standing start, service-specific pages are pulling targeted impressions across two counties. Holiday lighting pages alone account for nearly 1,000 impressions, and the site architecture is building compounding visibility with each passing month. The site now generates 2\u20133 qualified bookings per week directly from organic search, a channel that didn\u2019t exist before the rebuild.",
    },
    img: '/projects/JPW.png',
    url: 'https://www.jonespressurewashingnj.com',
    services: ['web-development', 'seo'],
    testimonial: {
      quote:
        "Our old site looked modern but converted terribly. PixelVerse rebuilt it from scratch with actual strategy behind every section. Now we're ranking for local searches and booking 2-3 jobs a week from the website alone.",
      name: 'Kyle Jones',
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
      'Built a new independent web presence for a home care agency going out on their own, structured for trust, clarity, and local search from day one.',
    problem:
      '360 Degree Care spent years operating under a franchise brand. When they went independent, they had a strong local reputation (4.8 stars on Google, 80% caregiver retention, CHAP certification) but no online presence of their own. Families searching for home care in Bergen County had no way to find them. Every day without an independent website meant potential clients were finding competitors instead, despite 360 Degree Care having stronger credentials and deeper community roots.',
    solution:
      'We built a custom site on a new domain with dedicated service pages, city-level landing pages, and SEO architecture designed to build organic visibility from a standing start. The site was structured around six core services (personal care, companion care, homemaker services, respite care, live-in care, and specialized care) each with its own page optimized for local search intent. Trust signals like their Google rating, CHAP accreditation, and caregiver retention rate were woven throughout the experience so families could evaluate credibility before making a call.',
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
          'Created individual service pages with city-level landing pages, each structured to rank independently for queries like "personal care Bergen County" and "companion care Englewood"',
      },
      {
        icon: 'alertCircle',
        issue: 'Strong reputation invisible to searchers',
        resolution:
          'Surfaced trust signals throughout (Google reviews, CHAP certification, team credentials) so credibility showed up before the first phone call',
      },
    ],
    outcome: {
      metric: '8,500+ search impressions and 270 indexed queries within 6 months',
      description:
        'From a standing start on a new domain, individual service pages pulled hundreds of impressions for high-intent local searches. The site architecture built compounding organic visibility as designed. Service-specific pages for personal care and companion care ranked for targeted Bergen County queries, and Google Business Profile integration drove consistent engagement from families researching local home care options.',
    },
    img: '/projects/360.png',
    demoUrl: 'https://haven-home-healthcare.netlify.app/',
    services: ['web-development', 'seo'],
  },
  {
    slug: 'domani',
    featured: true,
    name: 'Domani',
    industry: 'Productivity SaaS',
    location: 'Remote',
    title: 'How we designed a distraction-free planning app built around a single daily habit',
    summary:
      'Created an easy-to-use productivity app that helps users plan tomorrow, tonight. Focused on intuitive flow, minimal design, and daily consistency.',
    problem:
      "Most productivity tools overwhelm users with features that get in the way of actually planning. Domani needed a focused app experience that reduced decision fatigue and encouraged one simple nightly ritual: setting tomorrow\u2019s priorities before bed. The challenge wasn\u2019t building another task manager, it was designing an experience intentionally constrained enough that the planning habit itself became effortless. Every existing solution on the market offered too many features, too many options, and too many reasons to stop planning and start organizing instead.",
    solution:
      'We designed a minimal interface around a single workflow: plan tonight, execute tomorrow. Every design decision was tested against whether it aided or interrupted the planning habit. The app was built for iOS and Android simultaneously using React Native, with a shared component library that ensured visual consistency across platforms. We focused on reducing the nightly interaction to under two minutes, using behavioral design principles like streaks, plan locking, and progressive disclosure to keep the experience focused without feeling restrictive.',
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
          'Designed a calm, low-contrast palette that signals "wind down," reinforcing the intended nightly ritual through environmental cues',
      },
    ],
    outcome: {
      metric: '76 early-access users across iOS and Android',
      description:
        'The nightly planning flow was designed to stay under two minutes, light enough to become a real habit. Early users consistently highlight the plan lock feature and streak tracker as the elements that keep them coming back. Retention patterns show that users who complete the onboarding flow and plan for three consecutive nights are significantly more likely to maintain the habit long-term, validating the behavioral design approach we built the entire experience around.',
    },
    img: '/projects/Domani1.png',
    url: 'https://www.domani-app.com',
    services: ['mobile-app'],
  },
];

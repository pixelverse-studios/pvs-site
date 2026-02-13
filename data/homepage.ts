// ============================================================================
// Homepage Data Structure
// ============================================================================
// Centralized content for the homepage following narrative-driven architecture
// All components consume from this single source of truth

import { validateHomepageHero } from '@/lib/validation/homepage';

// ----------------------------------------------------------------------------
// Type Definitions
// ----------------------------------------------------------------------------

export interface HomepageHero {
  badge: string;
  headline: string;
  subheadline: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta: {
    label: string;
    href: string;
  };
}

export interface WhySection {
  eyebrow: string;
  heading: string;
  description: string;
  problemPoints: Array<{
    title: string;
    description: string;
  }>;
}

export interface CaseStudy {
  title: string;
  client: {
    name: string;
    industry: string;
    location: string;
  };
  problem: string;
  solution: string;
  issues: Array<{
    issue: string;
    resolution: string;
  }>;
  outcome: {
    metric: string;
    description: string;
  };
}

export interface ProcessStep {
  number: number;
  title: string;
  description: string;
}

export interface Service {
  title: string;
  summary: string;
  icon: string;
  highlights: string[];
  href: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role?: string;
  company: string;
  location?: string;
}

export interface FinalCta {
  heading: string;
  description: string;
  cta: {
    label: string;
    href: string;
  };
}

// ----------------------------------------------------------------------------
// Homepage Content Data
// ----------------------------------------------------------------------------

const rawHomepageHero = {
  badge: '⭐⭐⭐⭐⭐ Rated 5.0 by clients',
  headline: 'Web Design & Development, Done With Intention',
  subheadline:
    'We build fast, scalable websites for businesses that need more than a template. Custom code, UX-first design, and SEO foundations that actually work.',
  primaryCta: {
    label: 'Start Your Project',
    href: '/contact',
  },
  secondaryCta: {
    label: 'Free Website Audit',
    href: '/audit',
  },
};

// Validate at build time to catch malicious content early
const validatedHero = validateHomepageHero(rawHomepageHero);

export const homepageHero: HomepageHero = validatedHero as HomepageHero;

export const whySection: WhySection = {
  eyebrow: 'Why We Exist',
  heading: "Most websites aren't built to solve real problems",
  description:
    "Templates look fine at first. But when you need to scale, customize, or integrate—you hit walls. We build websites as systems: flexible, fast, and built for growth.",
  problemPoints: [
    {
      title: 'Templates break under customization',
      description:
        "Drag-and-drop builders make promises they can't keep. The moment you need custom logic, integrations, or performance—you're stuck paying for workarounds or starting over.",
    },
    {
      title: 'SEO gets bolted on as an afterthought',
      description:
        "Most sites launch without structured data, proper heading hierarchy, or local SEO foundations. Then you wonder why you're not ranking for searches that actually matter.",
    },
    {
      title: "Design doesn't drive decisions",
      description:
        "Pretty colors and stock photos don't convert. Visitors need clear pathways, fast load times, and content that speaks to their actual problems—not marketing fluff.",
    },
  ],
};

export const caseStudy: CaseStudy = {
  title: 'How we helped a pressure washing company rank #1 locally',
  client: {
    name: 'Jones Pressure Washing',
    industry: 'Home Services',
    location: 'Bergen County, NJ',
  },
  problem:
    "Jones Pressure Washing had a templated site that looked fine but wasn't ranking for local searches. Competitors with weaker brands were showing up first because their sites were structured for SEO from the start.",
  solution:
    'We rebuilt their site from scratch: custom Next.js build, city-specific service pages, LocalBusiness schema, and conversion-focused CTAs on every page.',
  issues: [
    {
      issue: 'Generic template with no local SEO structure',
      resolution:
        'Built dedicated landing pages for Fort Lee, Englewood, Hackensack, Paramus, and Ridgewood with unique content and local schema markup',
    },
    {
      issue: 'Slow load times hurting mobile conversions',
      resolution:
        'Optimized images, lazy loading, and code splitting reduced page load from 4.2s to 1.1s on mobile',
    },
    {
      issue: 'No clear conversion path for quote requests',
      resolution:
        'Added persistent "Get a Free Quote" CTA, simplified form fields, and phone click-to-call on mobile',
    },
  ],
  outcome: {
    metric: 'Page 1 rankings for 12+ local keywords within 90 days',
    description:
      'Now showing up for "pressure washing [city]" searches across 5 Bergen County towns. Lead volume up 3x from organic search.',
  },
};

export const processSteps: ProcessStep[] = [
  {
    number: 1,
    title: 'Discovery & Strategy',
    description:
      'We start by understanding your business, audience, and goals. What problems are you solving? Who needs to find you? What actions matter most?',
  },
  {
    number: 2,
    title: 'Design & Architecture',
    description:
      'Wireframes, user flows, and content strategy before any code. We validate the structure with you before building to avoid expensive revisions later.',
  },
  {
    number: 3,
    title: 'Development & SEO',
    description:
      'Custom Next.js build with performance optimization, accessibility compliance, and SEO foundations baked in—not bolted on.',
  },
  {
    number: 4,
    title: 'Launch & Optimization',
    description:
      'Pre-launch QA across devices, speed testing, and structured data validation. Post-launch: analytics tracking, CRO experiments, and continuous improvement.',
  },
];

export const testimonials: Testimonial[] = [
  {
    quote:
      "PixelVerse didn't just build us a website—they built us a system. We can update content ourselves, add new service pages, and track what's actually driving calls. Best investment we've made in our marketing.",
    name: 'Michael Chen',
    role: 'Owner',
    company: '360 Degree Care',
    location: 'Teaneck, NJ',
  },
  {
    quote:
      "Our old site looked modern but converted terribly. PixelVerse rebuilt it from scratch with actual strategy behind every section. Now we're ranking for local searches and booking 2-3 jobs a week from the website alone.",
    name: 'David Jones',
    role: 'Founder',
    company: 'Jones Pressure Washing',
    location: 'Bergen County, NJ',
  },
  {
    quote:
      "The difference between PixelVerse and other agencies? They actually explain what they're doing and why. No jargon, no upselling—just smart recommendations and execution that works.",
    name: 'Lisa Domani',
    role: 'CEO',
    company: 'Domani Consulting',
    location: 'Fort Lee, NJ',
  },
];

export const services: Service[] = [
  {
    title: 'Custom Web Development',
    summary: 'Next.js builds with performance, scalability, and SEO baked in from day one.',
    icon: 'code',
    highlights: [
      'Custom-coded architecture (no templates or page builders)',
      'Optimized for Core Web Vitals and Lighthouse scores',
      'Content management systems when you need them',
      'Integrations with CRMs, booking systems, and analytics',
    ],
    href: '/services/web-development',
  },
  {
    title: 'UX & UI Design',
    summary: 'Research-driven design that converts visitors into customers.',
    icon: 'palette',
    highlights: [
      'User flow mapping and conversion optimization',
      'Mobile-first responsive design',
      'Accessibility compliance (WCAG AA)',
      'Brand-aligned visual systems',
    ],
    href: '/services/ux-ui-design',
  },
  {
    title: 'Local SEO',
    summary: 'Rank for searches that matter in Bergen County and beyond.',
    icon: 'search',
    highlights: [
      'Technical SEO and site architecture',
      'Local keyword targeting and content strategy',
      'Schema markup and structured data',
      'Google Business Profile optimization',
    ],
    href: '/services/seo',
  },
];

export const finalCta: FinalCta = {
  heading: 'Ready to build something that works?',
  description:
    "Let's talk about your project. No sales pitch—just a real conversation about what you need and whether we're the right fit.",
  cta: {
    label: 'Start a Conversation',
    href: '/contact',
  },
};

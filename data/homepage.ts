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
  subheadline: string[];
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
  heading: string;
  paragraphs: string[];
  cta: {
    label: string;
    href: string;
  };
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
    icon?: string;
    issue: string;
    resolution: string;
  }>;
  outcome: {
    metric: string;
    description: string;
  };
}

export interface InsightBeat {
  label: string;
  text: string;
}

export interface InsightSection {
  heading: string;
  beats: InsightBeat[];
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
  badge: '⭐ 5.0 on Google • XX Reviews',
  headline: 'Web Design & Development, Done With Intention',
  subheadline: [
    'We help businesses understand what their website actually needs, then design and build the right solution.',
    "The goal isn't just to have a website. It's to support how the business actually operates and grows.",
  ],
  primaryCta: {
    label: 'Get Started',
    href: '/contact',
  },
  secondaryCta: {
    label: 'Request a Free Website Audit',
    href: '/audit',
  },
};

// Validate at build time to catch malicious content early
const validatedHero = validateHomepageHero(rawHomepageHero);

export const homepageHero: HomepageHero = validatedHero as HomepageHero;

export const whySection: WhySection = {
  heading: 'Why Businesses Come to Us',
  paragraphs: [
    "Businesses usually reach out after noticing a pattern they can't quite explain. Calls aren't as consistent as they should be, customers arrive needing more clarification than expected, or growth feels less steady even though the effort hasn't changed. Nothing appears obviously broken, but it becomes harder to tell whether the website is truly supporting the business or quietly getting in the way. At that point, making another change without understanding the root cause feels risky.",
    "The longer this goes unresolved, the more opportunities are missed. If this resonates, it's time to take a closer look.",
  ],
  cta: {
    label: 'Discuss Your Situation',
    href: '/contact',
  },
};

export const caseStudies: CaseStudy[] = [
  {
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
        icon: 'fileText',
        issue: 'Generic template with no local SEO structure',
        resolution:
          'Built dedicated landing pages for Fort Lee, Englewood, Hackensack, Paramus, and Ridgewood with unique content and local schema markup',
      },
      {
        icon: 'zap',
        issue: 'Slow load times hurting mobile conversions',
        resolution:
          'Optimized images, lazy loading, and code splitting reduced page load from 4.2s to 1.1s on mobile',
      },
      {
        icon: 'alertCircle',
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
  },
  {
    title: 'How we turned a care agency site into a lead generation system',
    client: {
      name: '360 Degree Care',
      industry: 'Home Healthcare',
      location: 'Teaneck, NJ',
    },
    problem:
      // TODO: Replace with real problem statement
      "360 Degree Care had a static brochure site that couldn't be updated without a developer. Service pages were generic, there was no way to track leads, and the site wasn't generating any inbound inquiries despite strong word-of-mouth reputation.",
    solution:
      // TODO: Replace with real solution details
      'We built a custom content-managed site with editable service pages, lead tracking, and a structured intake flow that converts visitors into qualified consultations.',
    issues: [
      {
        icon: 'fileText',
        // TODO: Replace with real issue/resolution
        issue: 'Static site with no content management',
        resolution:
          'Built a flexible page system so the team can add services, update copy, and publish content without touching code',
      },
      {
        icon: 'zap',
        // TODO: Replace with real issue/resolution
        issue: 'No lead tracking or attribution',
        resolution:
          'Integrated form submissions with analytics tracking so every inquiry is attributed to its source — organic, referral, or direct',
      },
      {
        icon: 'alertCircle',
        // TODO: Replace with real issue/resolution
        issue: "Generic service pages that didn't convert",
        resolution:
          'Created dedicated pages for each care service with clear intake CTAs, trust signals, and structured data for local search',
      },
    ],
    outcome: {
      // TODO: Replace with real metrics
      metric: 'Inbound leads from the website within the first 60 days',
      description:
        'The team can now update their own site, track where leads come from, and add new service pages as the business grows.',
    },
  },
];

export const insightSection: InsightSection = {
  heading: "Most Website Problems Aren't Isolated",
  beats: [
    {
      label: 'Scenario',
      text: 'A physical therapy clinic sees consistent website traffic. Visitors land on treatment pages, scroll, and click between conditions. But very few schedule an appointment.',
    },
    {
      label: 'Surface',
      text: 'Nothing is technically broken. The site looks polished and functions as expected.',
    },
    {
      label: 'Problem',
      text: "Clarity breaks down at key moments. Conditions are grouped broadly. Outcomes aren't defined. The next step appears before visitors understand what makes this clinic the right choice.",
    },
    {
      label: 'Impact',
      text: 'Individually, those gaps seem small. Together, they reduce momentum and limit results.',
    },
    {
      label: 'Pattern',
      text: "We see this pattern across industries. When messaging, structure, and next steps aren't working in sync, growth slows, even if traffic remains steady.",
    },
    {
      label: 'Our Approach',
      text: "That's why we evaluate the full system before deciding what to address.",
    },
  ],
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
  {
    quote:
      'Placeholder testimonial — real client feedback coming soon. This will highlight how PixelVerse helped transform their online presence and drive measurable business results.',
    name: 'Client Name',
    role: 'Role',
    company: 'Company Name',
    location: 'Location, NJ',
  },
  {
    quote:
      'Placeholder testimonial — real client feedback coming soon. This will showcase the strategic approach and attention to detail that sets PixelVerse apart from template-based agencies.',
    name: 'Client Name',
    role: 'Role',
    company: 'Company Name',
    location: 'Location, NJ',
  },
  {
    quote:
      'Placeholder testimonial — real client feedback coming soon. This will demonstrate the long-term partnership value and ongoing support that clients receive after launch.',
    name: 'Client Name',
    role: 'Role',
    company: 'Company Name',
    location: 'Location, NJ',
  },
  {
    quote:
      'Placeholder testimonial — real client feedback coming soon. This will feature how PixelVerse identified and solved specific business challenges through smart web design.',
    name: 'Client Name',
    role: 'Role',
    company: 'Company Name',
    location: 'Location, NJ',
  },
  {
    quote:
      'Placeholder testimonial — real client feedback coming soon. This will highlight the collaborative process and how the team made the entire experience seamless and stress-free.',
    name: 'Client Name',
    role: 'Role',
    company: 'Company Name',
    location: 'Location, NJ',
  },
  {
    quote:
      'Placeholder testimonial — real client feedback coming soon. This will focus on the ROI and tangible business growth that resulted from the website redesign.',
    name: 'Client Name',
    role: 'Role',
    company: 'Company Name',
    location: 'Location, NJ',
  },
];

export const services: Service[] = [
  {
    title: 'Web Design & Development',
    summary:
      'Planning, designing, and building websites that are clear, usable, and built to support real business goals.',
    icon: 'palette',
    href: '/services/web-development',
  },
  {
    title: 'Website Optimization & SEO',
    summary:
      'Improving existing sites through structure, content, performance, and local search visibility to help the right people find and choose the business.',
    icon: 'search',
    href: '/services/seo',
  },
  {
    title: 'Ongoing Support & Iteration',
    summary:
      'Supporting websites over time as goals evolve, content changes, or new opportunities emerge.',
    icon: 'lifebuoy',
    href: '/contact',
  },
];

export const finalCta: FinalCta = {
  heading: "Let's Talk It Through",
  description:
    "If you're unsure what your website needs, or whether you need one at all, the next step is a conversation.\nWe'll look at what's getting in the way and determine what kind of work actually makes sense.",
  cta: {
    label: 'Start the Conversation',
    href: '/contact',
  },
};

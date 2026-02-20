// ============================================================================
// Homepage Data Structure
// ============================================================================
// Centralized content for the homepage following narrative-driven architecture
// All components consume from this single source of truth

import { validateHomepageHero } from '@/lib/validation/homepage';
import { caseStudies as allCaseStudies } from '@/data/case-studies';
export type { CaseStudy } from '@/data/case-studies';

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


export interface InsightBeat {
  label: string;
  text: string;
}

export interface InsightSection {
  heading: string;
  beats: InsightBeat[];
}

export interface ProcessSection {
  eyebrow: string;
  heading: string;
  subtitle: string;
  steps: ProcessStep[];
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
  headline: 'Web Design & Development for Growing Businesses',
  subheadline: [
    'We help businesses understand what their website actually needs, then design and build the right solution, thoughtfully, strategically, and with intention.',
    "The goal isn't just to have a website. It's to support how the business actually operates and grows.",
  ],
  primaryCta: {
    label: 'Get Started',
    href: '/contact',
  },
  secondaryCta: {
    label: 'Request a Website Review',
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

export const caseStudies = allCaseStudies.filter((cs) => cs.featured);

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

export const processSection: ProcessSection = {
  eyebrow: 'Our Process',
  heading: 'How we figure out what to build',
  subtitle:
    "We don't start with a proposal. We start with an evaluation.",
  steps: [
    {
      number: 1,
      title: 'Evaluate',
      description:
        "We look at what you already have — your current site, your traffic patterns, how visitors behave, and where they drop off. We're not starting from scratch unless we need to.",
    },
    {
      number: 2,
      title: 'Diagnose',
      description:
        "We identify what's working, what's underperforming, and why. Is it a messaging problem? A structure problem? A visibility problem? The answer determines the direction.",
    },
    {
      number: 3,
      title: 'Recommend',
      description:
        "We present a clear, prioritized plan tied to your actual business goals — not a templated scope. You'll know exactly what we're proposing, why it matters, and what it's expected to do.",
    },
    {
      number: 4,
      title: 'Build & Refine',
      description:
        "Then we design and develop the right solution — whether that's a full rebuild, targeted improvements, or something in between. After launch, we measure what's working and adjust.",
    },
  ],
};

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

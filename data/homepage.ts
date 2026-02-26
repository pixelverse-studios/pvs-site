// ============================================================================
// Homepage Data Structure
// ============================================================================
// Centralized content for the homepage following narrative-driven architecture
// All components consume from this single source of truth

import { validateHomepageHero } from '@/lib/validation/homepage';
import { caseStudies as allCaseStudies } from '@/data/case-studies';

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
    'We help New Jersey businesses understand what their website actually needs, then design and build the right solution, thoughtfully, strategically, and with intention.',
    "The goal isn't just to have a website. It's to support how the business actually operates and grows.",
  ],
  primaryCta: {
    label: 'Get Started',
    href: '/contact',
  },
  secondaryCta: {
    label: 'Request a Website Review',
    href: '/contact?path=review',
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
      "I had zero website experience going in and expected to feel lost the whole time. They walked me through every decision without making me feel like I was asking dumb questions. I actually love what we ended up with.",
    name: 'Jennifer',
    role: 'Owner & Photographer',
    company: 'Iffers Pictures',
    location: 'Cliffside Park, NJ',
  },
  {
    quote:
      "I really just wanted a simple landing page to start. They showed me what a full site with service pages and SEO could do and I had no idea how much I was missing. We went bigger and it was worth it. The phone actually rings now.",
    name: 'Kyle',
    role: 'Owner',
    company: 'Jones Pressure Washing NJ',
    location: 'Bloomfield, NJ',
  },
  {
    quote:
      "We had people coming to the site but almost nobody was booking. They figured out what was turning people away and fixed it. Within a few months our bookings more than doubled.",
    name: 'Alli',
    role: 'Owner',
    company: 'Going Gold Choreography',
    location: 'Ridgewood, NJ',
  },
  {
    quote:
      "Honestly more organized than anything I've worked with before. Clear timelines, quick responses, and they'd flag things before I even had to ask. At some point it just stopped feeling like a typical vendor thing.",
    name: 'Chris',
    role: 'Owner & Asset Manager',
    company: 'Gladstone Wealth Partners',
    location: 'Cape May, NJ',
  },
  {
    quote:
      "We were brand new and needed people to take us seriously from day one. They got that right away and built something professional and welcoming from the start. For a new non-profit that kind of credibility matters more than people realize.",
    name: 'Sara',
    role: 'Owner',
    company: 'Rising Tide Aquatics',
    location: 'Tampa, FL',
  },
];

export const services: Service[] = [
  {
    title: 'Web Design & Development',
    summary:
      'Creating custom websites that are user-focused, conversion-optimized, and built to support your business goals. From initial design to development and launch.',
    icon: 'palette',
    href: '/services/web-development',
  },
  {
    title: 'Website Optimization & SEO',
    summary:
      'Improving search rankings and visibility through site structure, content optimization, performance improvements, and local SEO strategies that help the right customers find your business.',
    icon: 'search',
    href: '/services/seo',
  },
  {
    title: 'Ongoing Support & Iteration',
    summary:
      'Providing ongoing website maintenance, security updates, and support as your business evolves, ensuring your site continues performing at its best.',
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

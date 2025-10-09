export type PackageCategory = 'website' | 'seo';

export interface PackageDetail {
  id: string;
  name: string;
  summary: string;
  price: string;
  ideal: string;
  includes: string[];
  value: string;
  support: {
    response: string;
    cadence: string;
  };
  category: PackageCategory;
  icon: PackageIconKey;
}

export type PackageIconKey =
  | 'monitorSmartphone'
  | 'layers'
  | 'rocket'
  | 'sparkles'
  | 'search'
  | 'lineChart'
  | 'barChart3';

export const packages: PackageDetail[] = [
  {
    id: 'core-lite',
    name: 'Core Lite – Entry Essential',
    summary: 'Get online quickly and affordably.',
    price: '$500 setup + $59/mo',
    ideal: 'Side hustlers, freelancers, and early-stage startups',
    includes: [
      '1-page sleek, custom-coded website (no templates)',
      'Mobile-first responsive development',
      'Up to 2 rounds of design revisions',
      'Basic SEO (titles, meta, H1 structure)',
      'Hosting & maintenance (within monthly cap)',
      'Post-launch revision per contract',
      'Basic quarterly performance report'
    ],
    value: 'A fast, budget-friendly, professional digital presence to get you online and growing.',
    support: {
      response: '72-hour response time',
      cadence: 'Quarterly check-ins'
    },
    category: 'website',
    icon: 'monitorSmartphone'
  },
  {
    id: 'core-starter',
    name: 'Core Starter – Growth Ready',
    summary: 'Build a professional presence that lasts.',
    price: '$1,850 setup + $149/mo',
    ideal: 'Service businesses ready to elevate their credibility',
    includes: [
      'Multi-page custom website (up to 5 pages)',
      'Conversion-forward UX and copy guidance',
      'CMS-driven content blocks for easy updates',
      'Performance-first build with lighthouse validation',
      'Analytics implementation (GA4 + Pixel)',
      'Launch checklist with device/browser testing',
      'Bi-monthly maintenance & content swap support'
    ],
    value:
      'A custom-coded foundation that pairs strategic UX with performance, so your site keeps working as you grow.',
    support: {
      response: '48-hour response time',
      cadence: 'Bi-monthly insights and maintenance'
    },
    category: 'website',
    icon: 'layers'
  },
  {
    id: 'core-growth',
    name: 'Core Growth – Scale Focused',
    summary: 'Scale with advanced features and flexibility.',
    price: '$3,400 setup + $289/mo',
    ideal: 'Established teams ready for deeper integrations and funnels',
    includes: [
      'Custom architecture for 8–12 pages & landing page system',
      'Personalized component library for future campaigns',
      'CRM, booking, or membership integrations',
      'Advanced analytics dashboards & event tracking',
      'Accessibility QA & performance tuning',
      'Launch strategy workshop + growth roadmap',
      'Monthly optimization and consult sessions'
    ],
    value:
      'A scalable, conversion-centric platform engineered for experiments, integrations, and evergreen performance.',
    support: {
      response: 'Next-business-day response',
      cadence: 'Monthly growth strategy session'
    },
    category: 'website',
    icon: 'rocket'
  },
  {
    id: 'core-premium',
    name: 'Core Premium – Enterprise Custom',
    summary: 'Unlock custom solutions for maximum growth.',
    price: 'Custom proposal starting at $6,800 + retainer',
    ideal: 'High-growth brands needing bespoke workflows and SLA support',
    includes: [
      'Full UX research & stakeholder discovery',
      'Custom systems architecture and scalable design ops',
      'Headless CMS or bespoke admin tooling',
      'Performance budget planning & ongoing audits',
      'Personalized component tokens and documentation',
      'Dedicated release management & QA suite',
      'Growth experimentation backlog & implementation'
    ],
    value:
      'Your digital flagship — engineered in partnership with your team, optimized for longevity, and backed by enterprise-level support.',
    support: {
      response: 'Same-day response via priority channel',
      cadence: 'Dedicated product manager + quarterly roadmap'
    },
    category: 'website',
    icon: 'sparkles'
  },
  {
    id: 'seo-starter',
    name: 'SEO Starter – Visibility Boost',
    summary: 'Build your search presence.',
    price: '$950 setup + $225/mo',
    ideal: 'Businesses new to SEO wanting foundational visibility',
    includes: [
      'Technical health audit & remediation',
      'Keyword research focused on local + service intent',
      'On-page optimization for top 5 pages',
      'Schema + structured data for key content',
      'Monthly performance snapshots with action items'
    ],
    value:
      'Establish a healthy search footprint with crawlable structure, fast speeds, and the right keywords in place.',
    support: {
      response: '72-hour response time',
      cadence: 'Monthly performance report'
    },
    category: 'seo',
    icon: 'search'
  },
  {
    id: 'seo-growth',
    name: 'SEO Growth – Ranking Momentum',
    summary: 'Expand rankings and visibility.',
    price: '$1,650 setup + $375/mo',
    ideal: 'Teams ready to capture more demand and expand reach',
    includes: [
      'Deep content gap & competitor analysis',
      'Editorial calendar with optimized briefs',
      'Conversion copy refreshes for high-intent pages',
      'Backlink strategy and outreach coordination',
      'Bi-weekly reporting with experiment recommendations'
    ],
    value:
      'Accelerate qualified traffic with strategic content and continual on-page improvements that line up with your sales goals.',
    support: {
      response: '48-hour response time',
      cadence: 'Bi-weekly performance & recommendations'
    },
    category: 'seo',
    icon: 'lineChart'
  },
  {
    id: 'seo-premium',
    name: 'SEO Premium – Market Leader',
    summary: 'Dominate your market.',
    price: '$2,450 setup + $575/mo',
    ideal: 'Brands competing in crowded markets needing proactive search leadership',
    includes: [
      'Full-funnel SEO strategy with CRO alignment',
      'Content hub & pillar page development',
      'Digital PR initiatives and authority partnerships',
      'Weekly monitoring of rankings, backlinks, and SERP shifts',
      'Quarterly strategic workshops with exec-ready reporting'
    ],
    value:
      'Own your category with relentless experimentation, proactive optimization, and executive-level insights.',
    support: {
      response: 'Same-day response via priority channel',
      cadence: 'Weekly KPI dashboards + quarterly workshops'
    },
    category: 'seo',
    icon: 'barChart3'
  }
];

export const websitePackages = packages.filter((pkg) => pkg.category === 'website');
export const seoPackages = packages.filter((pkg) => pkg.category === 'seo');

import type { CTA } from './service-paths';
import type { FaqItem } from '@/data/faq-types';
import {
  formatMonthlyStartingPrice,
  formatStartingPrice,
  seoPackageMonthlyPrices,
  seoStrategySetupPrice,
  type PricingPackage,
} from '@/data/package-pricing';

export interface SeoContentData {
  hero: {
    title: string;
    description: string;
    cta: CTA;
  };
  whyBusinessesLook: {
    title: string;
    body: string;
  };
  whyNotJustRankings: {
    title: string;
    intro: string;
    bulletPoints: string[];
    closing: string;
  };
  howWeEvaluate: {
    title: string;
    intro: string;
    bulletPoints: string[];
    closing: string;
  };
  whenOptimizationIsRight: {
    title: string;
    body: string;
    crossLink: CTA;
  };
  whatToExpect: {
    title: string;
    intro: string;
    bulletPoints: string[];
    closing: string;
  };
  pricing: {
    eyebrow: string;
    title: string;
    intro: string;
    packages: SeoPricingPackage[];
    footnote: string;
  };
  faq: FaqItem[];
  finalCta: {
    title: string;
    description: string;
    cta: CTA;
  };
}

// SEO cards are recurring-only; a setup price would switch the card to the website layout.
export type SeoPricingPackage = Omit<PricingPackage, 'setupPrice' | 'carePlan'>;

export function getLowestSeoMonthlyPrice() {
  return Math.min(
    ...seoContent.pricing.packages
      .map((pkg) => pkg.monthlyPrice)
      .filter((price): price is number => typeof price === 'number'),
  );
}

export const seoContent: SeoContentData = {
  hero: {
    title: 'Local SEO for New Jersey Businesses',
    description:
      'For New Jersey businesses with an existing website that need to be found by the right people in the right places.\n\nWe focus on improving local visibility, clarity, and performance by identifying what\u2019s holding a site back and addressing the issues that actually affect search presence and customer decisions.',
    cta: {
      label: 'Discuss Your Situation',
      href: '/contact/details',
    },
  },
  whyBusinessesLook: {
    title: 'Why Businesses Look at Local SEO & Optimization',
    body: 'Most businesses don\u2019t start by thinking about \u201clocal SEO.\u201d\n\nThey start by noticing that competitors show up more consistently, traffic doesn\u2019t turn into calls or bookings, their Google listing gets views but little engagement, or it\u2019s unclear whether their website is helping people choose them.\n\nFor Bergen County businesses especially, local search competition is high. A business in Fort Lee or Hackensack may have a solid website, but if it isn\u2019t structured to compete in their specific market, it won\u2019t show up where it matters.\n\nIn many cases, the website exists and content is live. The issue isn\u2019t effort. It\u2019s whether the site is structured and positioned to support local discovery and decision-making.',
  },
  whyNotJustRankings: {
    title: 'Why Local SEO Isn\u2019t Just About Rankings',
    intro:
      'Showing up locally isn\u2019t just about keywords or visibility.\n\nLocal performance depends on how well several elements work together:',
    bulletPoints: [
      'How services and locations are structured on the site',
      'How clearly pages communicate who the business is for',
      'How well the site supports local search signals',
      'How fast, usable, and reliable the experience is',
      'How easily visitors can take the next step',
    ],
    closing:
      'A site can rank and still underperform if these pieces aren\u2019t working together. Likewise, strong content alone won\u2019t help if local visibility is limited.\n\nLocal SEO works best when it\u2019s treated as part of the website system, not a separate effort.',
  },
  howWeEvaluate: {
    title: 'Our Local SEO Audit & Optimization Process for New Jersey Businesses',
    intro:
      'Optimization starts with understanding how the site is currently supporting local visibility and conversions.\n\nWe look at:',
    bulletPoints: [
      'Site structure, service pages, and location relevance',
      'Content clarity and alignment with local search intent',
      'Technical performance and crawlability',
      'Local search visibility and indexing health',
      'How visitors move through the site and where friction appears',
    ],
    closing:
      'For New Jersey businesses, this also means evaluating how well the site supports local search in specific markets, whether that\u2019s Bergen County, Northern NJ, or individual cities like Englewood or Paramus.\n\nThe goal isn\u2019t to apply tactics blindly. It\u2019s to identify which factors are limiting performance and where focused changes will have the greatest impact.\n\nThat evaluation determines what happens next.',
  },
  whenOptimizationIsRight: {
    title: 'When Local Optimization Is the Right Move (and When It\u2019s Not)',
    body: 'In many cases, a website has a solid foundation but isn\u2019t structured to compete locally. That\u2019s where optimization makes sense.\n\nIn other cases, structural gaps, unclear service positioning, or technical limitations prevent meaningful improvement. When those issues are significant, addressing them first may be necessary before optimization can deliver results.\n\nPart of our role is being honest about that distinction and focusing effort where it will have the greatest impact.\n\nIf deeper structural changes are required, we may recommend exploring our Web Design & Development service instead.',
    crossLink: {
      label: 'Web Design & Development',
      href: '/services/web-development',
    },
  },
  whatToExpect: {
    title: "What's Included in Our Local SEO Services for Bergen County",
    intro:
      'When optimization is the right path forward, the work is focused and practical.\n\nThat typically includes:',
    bulletPoints: [
      'Reorganizing service and location pages to better match how people search locally',
      'Refining messaging so visitors quickly understand what\u2019s offered and whether it fits',
      'Addressing technical limitations that affect visibility and performance',
      'Strengthening local search signals across the site and Google Business Profile',
      'Clarifying next steps so visibility translates into real inquiries',
    ],
    closing:
      'The goal isn\u2019t short-term spikes. It\u2019s a site that consistently supports steady local visibility and informed decision-making over time, whether you\u2019re serving Bergen County, Northern New Jersey, or beyond.',
  },
  pricing: {
    eyebrow: 'Recurring SEO Packages',
    title: 'Start with the level of support your market actually needs.',
    intro:
      'These packages are focused on recurring SEO support: keywords, locations, visibility checks, practical recommendations, and reporting. We keep the scope clear so the first conversation can focus on fit.',
    packages: [
      {
        name: 'Local SEO \u2013 1 Location',
        shortName: '1 Location',
        monthlyPrice: seoPackageMonthlyPrices.oneLocation,
        description: 'For a business focused on one town.',
        highlights: [
          '1 focus location, up to 10 tracked keywords',
          '1 page optimized per month',
          '2 Google Business Profile posts per month',
          'Monthly visibility report',
        ],
      },
      {
        name: 'Local SEO \u2013 Up to 3 Locations',
        shortName: 'Up to 3 Locations',
        featured: true,
        monthlyPrice: seoPackageMonthlyPrices.threeLocations,
        description: 'For businesses competing across a local service area.',
        highlights: [
          'Up to 3 focus locations, up to 25 tracked keywords',
          '2 pages optimized per month',
          '4 Google Business Profile posts per month and review guidance',
          'Quarterly citation cleanup, monthly report and quarterly strategy call',
        ],
      },
      {
        name: 'Local SEO \u2013 Up to 5 Locations',
        shortName: 'Up to 5 Locations',
        monthlyPrice: seoPackageMonthlyPrices.fiveLocations,
        description: 'For active growth across a wider area.',
        highlights: [
          'Up to 5 focus locations, up to 50 tracked keywords',
          '4 pages optimized per month and 1 blog article per month',
          'Weekly Google Business Profile posts and competitor tracking',
          'Quarterly technical SEO check, monthly report and monthly strategy call',
        ],
      },
      {
        name: 'Custom',
        shortName: 'Custom',
        monthlyPrice: null,
        description: 'For multi-location, competitive, or content-heavy SEO needs.',
        highlights: [
          'Custom keyword and location scope',
          'Technical and content planning',
          'Reporting matched to goals',
          'Support cadence by agreement',
        ],
        note: 'Scoped after review',
      },
    ],
    footnote: `All SEO plans start with a one-time SEO Strategy Setup (keyword research and content mapping), ${formatStartingPrice(seoStrategySetupPrice)}. New location or service pages are quoted separately.`,
  },
  faq: [
    {
      question: 'How much does local SEO cost?',
      answer: `Our recurring local SEO packages start at ${formatMonthlyStartingPrice(seoPackageMonthlyPrices.oneLocation)} for one focus location, ${formatMonthlyStartingPrice(seoPackageMonthlyPrices.threeLocations)} for up to 3 locations, and ${formatMonthlyStartingPrice(seoPackageMonthlyPrices.fiveLocations)} for up to 5 locations. Every plan starts with a one-time ${formatStartingPrice(seoStrategySetupPrice)} SEO Strategy Setup for keyword research and content mapping. We evaluate the site first so we can recommend the level of recurring support that actually fits the business.`,
      link: { label: 'Share your situation', href: '/contact/details' },
    },
    {
      question: 'How long does SEO take to show results?',
      answer:
        'For local SEO, meaningful movement in search visibility typically takes 3\u20136 months. Some improvements (like technical fixes and GBP updates) can show impact faster, but sustained ranking gains take time as search engines re-index and re-evaluate the site. We set realistic timelines upfront so expectations align with what the work can actually deliver.',
    },
    {
      question: "What's actually included in your optimization work?",
      answer:
        'Typically: reorganizing service and location pages to match local search intent, refining how clearly the site communicates what\u2019s offered, addressing technical performance issues, and strengthening your Google Business Profile presence. Scope is determined by what\u2019s actually limiting performance.',
    },
    {
      question: 'Do you work on Google Business Profile as part of this?',
      answer:
        'Yes. GBP is a significant factor in local search visibility, and we address it as part of the optimization work, not as a separate add-on.',
    },
    {
      question: "Can you do SEO on a site you didn't build?",
      answer:
        'Yes. Most of our optimization work is on existing sites built elsewhere. As long as the site has a solid enough foundation, we can improve how it performs locally without needing to rebuild.',
    },
    {
      question: 'Is this a one-time project or ongoing work?',
      answer:
        'Local SEO is most effective as an ongoing effort. Search visibility builds over time and needs maintenance as competitors and algorithms shift. We\u2019re upfront about what\u2019s realistic from a one-time engagement vs. what benefits from continued attention.',
    },
    {
      question: 'Do you guarantee search rankings?',
      answer:
        'No, and any SEO provider that does is overpromising. Google controls rankings, and no one can guarantee specific positions. What we can control is the quality and direction of the work: how well the site is structured for local search, how clearly it communicates relevance, and how consistently those signals are maintained. We focus on sustainable improvement, not short-term results that don\u2019t hold.',
    },
    {
      question: 'How do I know if I need SEO or a new website?',
      answer:
        'If your site has a solid structure but isn\u2019t showing up locally or converting visitors into inquiries, optimization is usually the right move. If structural gaps, unclear messaging, or technical limitations are the root issue, SEO alone won\u2019t fix that, and a rebuild may deliver better long-term results. We\u2019re honest about that distinction and won\u2019t recommend optimization if it\u2019s not the right path.',
    },
  ],
  finalCta: {
    title: 'Let\u2019s Talk It Through',
    description:
      'If your website exists but isn\u2019t delivering the local visibility or inquiries you expect, the next step is clarity.\n\nWe\u2019ll review your current situation, identify what\u2019s actually limiting performance, and determine whether focused optimization is the right move.',
    cta: {
      label: 'Talk to Our NJ Team',
      href: '/contact/details',
    },
  },
};

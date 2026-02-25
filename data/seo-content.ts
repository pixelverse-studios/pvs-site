import type { CTA } from './service-paths';
import type { FaqItem } from '@/data/faq-content';

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
  faq: FaqItem[];
  finalCta: {
    title: string;
    description: string;
    cta: CTA;
  };
}

export const seoContent: SeoContentData = {
  hero: {
    title: 'Local Website Optimization & SEO',
    description:
      'For businesses with an existing website that need to be found by the right people in the right places.\n\nWe focus on improving local visibility, clarity, and performance by identifying what\u2019s holding a site back and addressing the issues that actually affect search presence and customer decisions.',
    cta: {
      label: 'Discuss Your Situation',
      href: '/contact',
    },
  },
  whyBusinessesLook: {
    title: 'Why Businesses Look at Local SEO & Optimization',
    body: 'Most businesses don\u2019t start by thinking about \u201clocal SEO.\u201d\n\nThey start by noticing that competitors show up more consistently, traffic doesn\u2019t turn into calls or bookings, their Google listing gets views but little engagement, or it\u2019s unclear whether their website is helping people choose them.\n\nIn many cases, the website exists and content is live. The issue isn\u2019t effort. It\u2019s whether the site is structured and positioned to support local discovery and decision-making.',
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
    title: 'How We Evaluate What\u2019s Holding a Site Back',
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
      'The goal isn\u2019t to apply tactics blindly. It\u2019s to identify which factors are limiting performance and where focused changes will have the greatest impact.\n\nThat evaluation determines what happens next.',
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
    title: 'What You Can Expect From Local Optimization Work',
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
      'The goal isn\u2019t short-term spikes. It\u2019s a site that consistently supports steady local visibility and informed decision-making over time.',
  },
  faq: [
    {
      question: 'How much does local SEO cost?',
      answer:
        'Local SEO engagements vary based on what the site actually needs. Most projects for small-to-mid-size businesses fall in the $1,500\u2013$5,000+ range for an initial optimization engagement, with ongoing work structured separately depending on scope. We evaluate first and scope based on what will move the needle \u2014 not a fixed package.',
      link: { label: 'Share your situation', href: '/contact' },
    },
    {
      question: 'How long does SEO take to show results?',
      answer:
        'For local SEO, meaningful movement in search visibility typically takes 3\u20136 months. Some improvements \u2014 like technical fixes and GBP updates \u2014 can show impact faster, but sustained ranking gains take time as search engines re-index and re-evaluate the site. We set realistic timelines upfront so expectations align with what the work can actually deliver.',
    },
    {
      question: "What's actually included in your optimization work?",
      answer:
        'Typically: reorganizing service and location pages to match local search intent, refining how clearly the site communicates what\u2019s offered, addressing technical performance issues, and strengthening your Google Business Profile presence. Scope is determined by what\u2019s actually limiting performance.',
    },
    {
      question: 'Do you work on Google Business Profile as part of this?',
      answer:
        'Yes. GBP is a significant factor in local search visibility, and we address it as part of the optimization work \u2014 not as a separate add-on.',
    },
    {
      question: "Can you do SEO on a site you didn't build?",
      answer:
        'Yes. Most of our optimization work is on existing sites built elsewhere. As long as the site has a solid enough foundation, we can improve how it performs locally without needing to rebuild.',
    },
    {
      question: 'Is this a one-time project or ongoing work?',
      answer:
        'Local SEO is most effective as an ongoing effort \u2014 search visibility builds over time and needs maintenance as competitors and algorithms shift. We\u2019re upfront about what\u2019s realistic from a one-time engagement vs. what benefits from continued attention.',
    },
    {
      question: 'Do you guarantee search rankings?',
      answer:
        'No \u2014 and any SEO provider that does is overpromising. Google controls rankings, and no one can guarantee specific positions. What we can control is the quality and direction of the work: how well the site is structured for local search, how clearly it communicates relevance, and how consistently those signals are maintained. We focus on sustainable improvement, not short-term results that don\u2019t hold.',
    },
    {
      question: 'How do I know if I need SEO or a new website?',
      answer:
        'If your site has a solid structure but isn\u2019t showing up locally or converting visitors into inquiries, optimization is usually the right move. If structural gaps, unclear messaging, or technical limitations are the root issue, SEO alone won\u2019t fix that \u2014 and a rebuild may deliver better long-term results. We\u2019re honest about that distinction and won\u2019t recommend optimization if it\u2019s not the right path.',
    },
  ],
  finalCta: {
    title: 'Let\u2019s Talk It Through',
    description:
      'If your website exists but isn\u2019t delivering the local visibility or inquiries you expect, the next step is clarity.\n\nWe\u2019ll review your current situation, identify what\u2019s actually limiting performance, and determine whether focused optimization is the right move.',
    cta: {
      label: 'Discuss Your Situation',
      href: '/contact',
    },
  },
};

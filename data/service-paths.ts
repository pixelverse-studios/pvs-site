export interface CTA {
  label: string;
  href: string;
  isReviewCta?: boolean;
}

export type ServicePathIconKey = 'code' | 'search';

export interface ServicesPageData {
  hero: {
    title: string;
    description: string;
  };
  clarificationCta: {
    title: string;
    description: string;
    primaryCta: CTA;
    secondaryCta?: CTA;
  };
}

export interface ServicePath {
  id: string;
  icon: ServicePathIconKey;
  title: string;
  description: string;
  body: string;
  cta: CTA;
}

export const servicesPageData: ServicesPageData = {
  hero: {
    title: 'Choosing the Right Path for Your Website',
    description:
      "Most website decisions aren't simple. It's not always obvious which direction makes sense next.\n\nSome are building their first real website. Others are trying to get more out of what they already have. Some need better local visibility. Others need a site that actually converts the traffic they're already getting.\n\nWe work with New Jersey businesses to figure out which direction makes sense before any work begins. That means evaluating the current situation honestly (looking at how the site performs, how visitors behave, and where the real gaps are) so the recommendation is based on evidence, not assumptions.\n\nOur role is to help determine the right path first, then execute it with clarity and intention.",
  },
  clarificationCta: {
    title: 'Not Sure Which Direction Fits Your Business?',
    description:
      "That's exactly what the initial conversation is for.\n\nWe work with businesses across Bergen County and New Jersey to clarify what's actually limiting progress and recommend the right next step before anything moves forward.",
    primaryCta: {
      label: 'Start the Conversation',
      href: '/contact/details',
    },
    secondaryCta: {
      label: 'Request a Website Review',
      href: '/contact/review',
      isReviewCta: true,
    },
  },
};

export const servicePaths: ServicePath[] = [
  {
    id: 'web-development',
    icon: 'code',
    title: 'Web Design & Development',
    description:
      'For businesses that need a website built from the ground up, or a rebuild when the current site no longer reflects how the business operates. This includes startups launching their first online presence, established companies outgrowing template sites, and businesses whose current website no longer reflects the quality of their work.',
    body: 'This work focuses on planning, structure, design, and development working together to create a site that is clear, usable, and built to support real business goals. Every project starts with understanding who the site is for, what action visitors should take, and what information they need before they feel confident enough to take it. The result is a website built with intention: from information architecture and content strategy to responsive design and performance optimization.',
    cta: {
      label: 'Learn more about Web Design & Development',
      href: '/services/web-development',
    },
  },
  {
    id: 'seo',
    icon: 'search',
    title: 'Local Website Optimization & SEO',
    description:
      'For businesses with an existing website that want stronger local visibility, clearer positioning, and better performance over time. This is for companies that already have a site but aren\u2019t showing up where their customers are searching, or aren\u2019t converting the traffic they do get into real inquiries.',
    body: 'This work focuses on improving how a site shows up in local search, how clearly it communicates services and locations, and how effectively it turns visitors into action. That includes restructuring service and location pages to match how people actually search, strengthening Google Business Profile integration, improving site performance and technical health, and refining messaging so visitors understand what\u2019s offered and whether it fits. Optimization and SEO are treated as ongoing efforts, not one-time fixes.',
    cta: {
      label: 'Learn more about Local Website Optimization & SEO',
      href: '/services/seo',
    },
  },
];

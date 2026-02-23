export interface CTA {
  label: string;
  href: string;
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
      "Most website decisions aren't simple. It's not always obvious which direction makes sense next.\n\nSome are building their first real website. Others are trying to get more out of what they already have.\n\nOur role is to help determine the right path first, then execute it with clarity and intention.",
  },
  clarificationCta: {
    title: 'Not Sure Which Direction Fits?',
    description:
      "That's exactly what the initial conversation is for.\n\nWe'll look at your current situation, clarify what's actually limiting progress, and recommend the right next step before anything moves forward.",
    primaryCta: {
      label: 'Start the Conversation',
      href: '/contact',
    },
    secondaryCta: {
      label: 'Request a Website Review',
      href: '/contact?path=review',
    },
  },
};

export const servicePaths: ServicePath[] = [
  {
    id: 'web-development',
    icon: 'code',
    title: 'Web Design & Development',
    description:
      'For businesses that need a website built from the ground up, or a rebuild when the current site no longer reflects how the business operates.',
    body: 'This work focuses on planning, structure, design, and development working together to create a site that is clear, usable, and built to support real business goals.',
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
      'For businesses with an existing website that want stronger local visibility, clearer positioning, and better performance over time.',
    body: 'This work focuses on improving how a site shows up in local search, how clearly it communicates services and locations, and how effectively it turns visitors into action. Optimization and SEO are treated as ongoing efforts, not one-time fixes.',
    cta: {
      label: 'Learn more about Local Website Optimization & SEO',
      href: '/services/seo',
    },
  },
];

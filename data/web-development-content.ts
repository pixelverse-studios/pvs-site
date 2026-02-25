import type { CTA } from './service-paths';
import type { FaqItem } from '@/data/faq-types';

export interface WebDevContentData {
  hero: {
    title: string;
    description: string;
    cta: CTA;
  };
  whenNewWebsite: {
    title: string;
    intro: string;
    bulletPoints: string[];
    closing: string;
    crossLink: CTA;
  };
  whyBuildsGoWrong: {
    title: string;
    body: string;
  };
  howWePlan: {
    title: string;
    intro: string;
    bulletPoints: string[];
    closing: string;
  };
  designAndDevelopment: {
    title: string;
    intro: string;
    bulletPoints: string[];
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

export const webDevelopmentContent: WebDevContentData = {
  hero: {
    title: 'Web Design & Development',
    description:
      'For businesses that need a website built from the ground up, or a rebuild when the current site no longer supports how the business operates.\n\nWe plan, design, and develop websites with clear structure and purpose, so the site doesn\u2019t just look polished, but actively supports how the business attracts, explains, and converts.',
    cta: {
      label: 'Start the Conversation',
      href: '/contact',
    },
  },
  whenNewWebsite: {
    title: 'When a New Website Is the Right Move',
    intro:
      'Not every website issue calls for a rebuild. But in some situations, starting fresh is the more practical and cost-effective path.\n\nThat\u2019s often the case when:',
    bulletPoints: [
      'There isn\u2019t a website yet, or the current one no longer reflects how the business operates',
      'The structure has grown inconsistent as services expanded',
      'The site is difficult to update or maintain',
      'Messaging no longer aligns with what the business actually offers',
      'Previous fixes have added layers without resolving the core issue',
    ],
    closing:
      'In these cases, continuing to layer fixes onto the existing site can increase complexity without addressing the root problem.\n\nIf your site has a solid foundation and only needs stronger visibility or clearer positioning, optimization is often the better path.',
    crossLink: {
      label: 'Learn more about Local Website Optimization & SEO',
      href: '/services/seo',
    },
  },
  whyBuildsGoWrong: {
    title: 'Why Website Builds Go Wrong',
    body: 'Most website builds don\u2019t fall short because of poor design. They fall short because the wrong decisions were made early.\n\nStructure gets chosen before services are clearly defined. Visual direction is set before messaging is clarified. Technology is selected without considering how the site will need to evolve.\n\nThe site launches and looks polished, but over time it becomes harder to update, harder to expand, and less effective at guiding visitors toward action.\n\nThat isn\u2019t a design problem. It\u2019s a direction problem.\n\nAnd it starts before a single page is built.',
  },
  howWePlan: {
    title: 'How We Plan Before We Build',
    intro:
      'We don\u2019t start with layouts or code.\n\nWe start by clarifying:',
    bulletPoints: [
      'What the website needs to support for the business',
      'How services should be structured and explained',
      'How visitors should move through the site',
      'What constraints exist around timeline, budget, and technology',
    ],
    closing:
      'From there, we define a clear site structure, content direction, and technical approach before any design begins.\n\nThat planning becomes the roadmap for everything that follows. It allows design and development decisions to be made with intention instead of guesswork.',
  },
  designAndDevelopment: {
    title: 'Design and Development Working Together',
    intro: 'Design and development aren\u2019t separate steps. They shape the same outcome.',
    bulletPoints: [
      'Design defines structure, hierarchy, and how visitors move through the site.',
      'Development builds that structure in a way that\u2019s stable, performant, and maintainable.',
      'When both are aligned from the start, the result isn\u2019t just a polished interface. It\u2019s a site that works.',
      'We use both custom development and website builders depending on the situation. The goal is choosing the right approach for the business, not forcing one method.',
    ],
  },
  whatToExpect: {
    title: 'What You Can Expect From a Build',
    intro:
      'When a build moves forward, the process is structured and transparent.\n\nYou can expect:',
    bulletPoints: [
      'A defined site structure before design begins',
      'Clear design direction aligned with business goals',
      'A development phase with review milestones',
      'Thorough testing before launch',
    ],
    closing:
      'The result is a site that reflects the business accurately and supports its next stage of growth.',
  },
  faq: [
    {
      question: 'How much does a custom website cost?',
      answer:
        'Most custom website projects for small-to-mid-size businesses fall in the $3,000\u2013$10,000+ range, depending on scope, number of pages, integrations, and content work involved. We scope every project individually \u2014 you\u2019re not paying for a package built around someone else\u2019s needs.',
      link: { label: 'Share your project details', href: '/contact?path=details' },
    },
    {
      question: 'How long does it take to build a website?',
      answer:
        'Most builds run 8\u201312 weeks from kickoff to launch. Discovery and planning take 1\u20132 weeks, design takes 2\u20133 weeks, development runs 4\u20136 weeks, and the final week covers QA and launch. Timeline depends on project complexity and how quickly feedback comes back \u2014 we\u2019ll give you a realistic schedule before anything starts.',
    },
    {
      question: "What's actually included in a website build?",
      answer:
        "Planning and site structure, design direction, full development, review milestones, and thorough testing before launch. The scope varies by project, but the process is always structured and transparent \u2014 you\u2019ll know what\u2019s included before anything moves forward.",
    },
    {
      question: 'Do you handle copy and content writing?',
      answer:
        'Content direction is part of our planning phase \u2014 we help structure what needs to be communicated and where. Full copywriting can be scoped in depending on the project, or we can work with content you provide.',
    },
    {
      question: 'Can you rebuild just part of a site instead of the whole thing?',
      answer:
        'Yes, when the foundation is sound. If specific sections are outdated, unclear, or underperforming, targeted improvements are often more practical than a full rebuild. We assess this during the initial evaluation.',
    },
    {
      question: 'Will the site be easy to update ourselves after launch?',
      answer:
        "That\u2019s part of how we plan the build. We design for maintainability from the start, and provide documentation and training at handoff so you\u2019re not dependent on us for routine updates.",
    },
  ],
  finalCta: {
    title: 'Let\u2019s Talk It Through',
    description:
      'If you\u2019re considering a new website, or unsure whether your current one still fits, the next step is a conversation.\n\nWe\u2019ll review your situation and determine what actually makes sense before anything moves forward.',
    cta: {
      label: 'Discuss Your Project',
      href: '/contact',
    },
  },
};

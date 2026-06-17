import type { FaqItem } from '@/data/faq-types';
import {
  formatMonthlyStartingPrice,
  formatStartingPrice,
  packageStartingPrices,
} from '@/data/package-pricing';

export const homepageFaq: FaqItem[] = [
  {
    question: 'How do I know if my website is part of the problem?',
    answer:
      'Common signs: traffic doesn\u2019t translate to calls or inquiries, visitors arrive needing more explanation than expected, the site is hard to update, or the messaging no longer reflects what the business actually offers. If any of those resonate, it\u2019s worth a closer look.',
  },
  {
    question: 'Should I redesign my website or start from scratch?',
    answer:
      'It depends on what\u2019s actually broken. If the structure, messaging, and user flow are fundamentally off, a rebuild usually delivers better results than patching an existing site. If the foundation is solid but the look is dated or certain pages are underperforming, a focused redesign can be enough. We diagnose this in the first conversation, no assumptions going in.',
    link: { label: 'See how we approach web design & development', href: '/services/web-development' },
  },
  {
    question: 'How much does a custom website typically cost in New Jersey?',
    answer: `Website packages can start at ${formatStartingPrice(packageStartingPrices.web)}, with larger custom website projects for small-to-mid-size businesses in New Jersey often scaling based on scope, number of pages, integrations, and content work. We do not force every project into the same package. We scope based on what your business actually needs.`,
    link: { label: 'Share your project details', href: '/contact/details' },
  },
  {
    question: 'How much do SEO packages start at?',
    answer: `Recurring SEO starts at ${formatMonthlyStartingPrice(packageStartingPrices.seoMonthly)}. From there, pricing depends on keyword coverage, location coverage, support cadence, and reporting depth. The goal is to match the level of SEO support to the market you are actually competing in.`,
    link: { label: 'Explore local SEO services', href: '/services/seo' },
  },
  {
    question: 'How long does it take to build a custom website?',
    answer:
      'Most projects run 8\u201312 weeks from kickoff to launch. Discovery and strategy take 1\u20132 weeks, design takes 2\u20133 weeks, development runs 4\u20136 weeks, and we spend the final week on QA and launch prep. Timelines vary based on how quickly feedback comes in and how complex the build is, and we\u2019ll give you a realistic estimate upfront.',
  },
  {
    question: 'What happens after I contact you?',
    answer:
      'We schedule a short intro call to understand your situation, no pitch, no pressure. If there\u2019s a clear fit, we move into a paid discovery session where we dig into your goals, audience, and current gaps. From there we put together a proposal tied to what actually came out of that session. Kickoff follows once you\u2019re ready.',
  },
  {
    question: 'Do I need to have a budget in mind before reaching out?',
    answer:
      'No. The first conversation is about understanding your situation, not scoping a project. Budget comes into play once we know what kind of work actually makes sense.',
  },
  {
    question: 'How is working with PixelVerse different from a typical web agency?',
    answer:
      'We evaluate before we recommend. We don\u2019t arrive with a proposal. We start with questions. That means the work that moves forward is tied to what your business actually needs, not a packaged scope we apply by default.',
  },
  {
    question: 'Do you only work with businesses in New Jersey?',
    answer:
      'Our primary focus is Bergen County and the surrounding area, but we work with businesses outside NJ when the fit is right. Location has no impact on what we can deliver.',
    link: { label: 'See our services', href: '/services' },
  },
];

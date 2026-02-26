import type { Metadata } from 'next';

import { FaqClosingCtaSection } from '@/components/faq/faq-closing-cta';
import { FaqIntroSection } from '@/components/faq/faq-intro-section';
import { FaqListSection } from '@/components/faq/faq-list-section';
import { StructuredData } from '@/components/ui/structured-data';
import { createPageMetadata } from '@/lib/metadata';
import { homepageFaq } from '@/data/homepage-faq';
import { webDevelopmentContent } from '@/data/web-development-content';
import { seoContent } from '@/data/seo-content';

export const metadata: Metadata = createPageMetadata({
  title: 'Frequently Asked Questions | Pixelverse Studios',
  description:
    'Common questions about our web design, development, and SEO services answered. Learn about our process, pricing, timelines, and what to expect working with us.',
  path: '/faq',
  keywords: [
    'PixelVerse Studios FAQ',
    'web design questions',
    'local SEO questions',
    'website build process',
    'working with a web agency',
  ],
});

const faqSections = [
  { heading: 'General', items: homepageFaq },
  { heading: 'Web Design & Development', items: webDevelopmentContent.faq },
  { heading: 'SEO & Local Optimization', items: seoContent.faq },
].filter((section) => section.items.length > 0);

// FAQPage schema for rich snippets in search results
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqSections.flatMap((section) =>
    section.items.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  ),
};

export default function FaqPage() {
  return (
    <main>
      <StructuredData id="pixelverse-faq-schema" data={faqSchema} />
      <FaqIntroSection />
      <FaqListSection sections={faqSections} />
      <FaqClosingCtaSection />
    </main>
  );
}

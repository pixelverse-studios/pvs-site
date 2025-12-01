import type { Metadata } from 'next';

import { FaqClosingCtaSection } from '@/components/faq/faq-closing-cta';
import { FaqIntroSection } from '@/components/faq/faq-intro-section';
import { FaqListSection, faqs } from '@/components/faq/faq-list-section';
import { StructuredData } from '@/components/ui/structured-data';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'PixelVerse FAQ | Web Design & SEO Questions',
  description:
    'Get answers about PixelVerse processes—custom development, UX-first design, SEO retainers, timelines, and collaboration workflows.',
  path: '/faq',
  keywords: [
    'PixelVerse Studios FAQ',
    'web design questions',
    'SEO process answers',
    'custom website process',
    'UX-first development FAQ',
  ],
});

// FAQPage schema for rich snippets in search results
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

export default function FaqPage() {
  return (
    <main>
      <StructuredData id="pixelverse-faq-schema" data={faqSchema} />
      <FaqIntroSection />
      <FaqListSection />
      <FaqClosingCtaSection />
    </main>
  );
}

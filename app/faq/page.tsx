import type { Metadata } from 'next';

import { FaqClosingCtaSection } from '@/components/faq/faq-closing-cta';
import { FaqIntroSection } from '@/components/faq/faq-intro-section';
import { FaqListSection } from '@/components/faq/faq-list-section';
import { faqContent } from '@/data/faq-content';
import { StructuredData } from '@/components/ui/structured-data';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'FAQ | Web Design, SEO & Working With Us',
  description:
    'Answers to common questions about web design, local SEO, our process, and working with PixelVerse Studios — so you can decide if it\'s worth a conversation.',
  path: '/faq',
  keywords: [
    'PixelVerse Studios FAQ',
    'web design questions',
    'local SEO questions',
    'website build process',
    'working with a web agency',
  ],
});

// FAQPage schema for rich snippets in search results
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqContent.flatMap((category) =>
    category.items.map((faq) => ({
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
      <FaqListSection />
      <FaqClosingCtaSection />
    </main>
  );
}

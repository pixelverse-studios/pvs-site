import type { Metadata } from 'next';

import { FaqClosingCtaSection } from '@/components/faq/faq-closing-cta';
import { FaqIntroSection } from '@/components/faq/faq-intro-section';
import { FaqListSection } from '@/components/faq/faq-list-section';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'FAQ | PixelVerse Studios',
  description:
    'Find answers to common questions about PixelVerse Studios, from custom-coded websites to UX-first design and process expectations.',
  path: '/faq',
  keywords: [
    'PixelVerse Studios FAQ',
    'web design questions',
    'SEO process answers',
    'custom website process',
    'UX-first development FAQ',
  ],
});

export default function FaqPage() {
  return (
    <main>
      <FaqIntroSection />
      <FaqListSection />
      <FaqClosingCtaSection />
    </main>
  );
}

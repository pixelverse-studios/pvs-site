import type { Metadata } from 'next';

import { FaqClosingCtaSection } from '@/components/faq/faq-closing-cta';
import { FaqIntroSection } from '@/components/faq/faq-intro-section';
import { FaqListSection } from '@/components/faq/faq-list-section';

export const metadata: Metadata = {
  title: 'FAQ | PixelVerse Studios',
  description:
    'Find answers to common questions about PixelVerse Studios, from custom-coded websites to UX-first design and process expectations.'
};

export default function FaqPage() {
  return (
    <main>
      <FaqIntroSection />
      <FaqListSection />
      <FaqClosingCtaSection />
    </main>
  );
}

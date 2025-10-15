import type { Metadata } from 'next';

import { ServicesClosingCtaSection } from '@/components/services/services-closing-cta';
import { ServicesCoreSection } from '@/components/services/services-core-section';
import { ServicesIntroSection } from '@/components/services/services-intro-section';
import { ServicesProcessSection } from '@/components/services/services-process-section';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'PixelVerse Studios Services',
  description:
    'Explore PixelVerse Studios services spanning custom development, UX/UI design, performance, analytics, and ongoing support tailored for growth.',
  path: '/services',
  keywords: [
    'web design services',
    'custom development services',
    'PixelVerse Studios offerings',
    'UX and UI design agency',
    'conversion-focused websites',
  ],
});

export default function ServicesPage() {
  return (
    <main>
      <ServicesIntroSection />
      <ServicesCoreSection />
      <ServicesProcessSection />
      <ServicesClosingCtaSection />
    </main>
  );
}

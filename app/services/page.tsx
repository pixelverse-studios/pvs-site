import type { Metadata } from 'next';

import { ServicesClosingCtaSection } from '@/components/services/services-closing-cta';
import { ServicesCoreSection } from '@/components/services/services-core-section';
import { ServicesIntroSection } from '@/components/services/services-intro-section';
import { ServicesProcessSection } from '@/components/services/services-process-section';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'PixelVerse Services | Web Design, SEO, CRO',
  description:
    'Explore PixelVerse service pillars—strategy, UX/UI design, development, SEO, analytics, and ongoing optimization—for revenue-focused teams.',
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

import type { Metadata } from 'next';

import { BergenCtaSection } from '@/components/bergen/bergen-cta-section';
import { BergenHeroSection } from '@/components/bergen/bergen-hero-section';
import { BergenProofSection } from '@/components/bergen/bergen-proof-section';
import { BergenServicesSection } from '@/components/bergen/bergen-services-section';
import { BergenTownsSection } from '@/components/bergen/bergen-towns-section';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Bergen County Web Design & SEO | PixelVerse Studios',
  description:
    'Bespoke web design, local SEO, and ongoing optimization for Bergen County businesses. Explore services, town coverage, and success stories tailored to North Jersey.',
  path: '/bergen-county',
  keywords: [
    'Bergen County web design',
    'Bergen County SEO',
    'North Jersey digital agency',
    'local SEO services Bergen',
    'custom websites Bergen County',
  ],
});

export default function BergenCountyPage() {
  return (
    <main>
      <BergenHeroSection />
      <BergenServicesSection />
      <BergenTownsSection />
      <BergenProofSection />
      <BergenCtaSection />
    </main>
  );
}

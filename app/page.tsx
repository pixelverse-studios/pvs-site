import type { Metadata } from 'next';

import { FinalCtaSection } from '@/components/home/final-cta-section';
import { HeroSection } from '@/components/home/hero-section';
import { PackagesSection } from '@/components/home/packages-section';
import { ServicesSection } from '@/components/home/services-section';
import { ValueSection } from '@/components/home/value-section';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Custom Web Design, Development & Local SEO NJ',
  description:
    'Custom web design and local SEO services in New Jersey. UX-driven, custom-coded websites built to grow traffic, trust, and conversions.',
  path: '/',
  keywords: [
    'PixelVerse Studios',
    'custom website agency',
    'Next.js marketing site',
    'SEO-first web design',
    'Bergen County web design',
  ],
});

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ValueSection />
      <ServicesSection />
      <PackagesSection />
      <FinalCtaSection />
    </main>
  );
}

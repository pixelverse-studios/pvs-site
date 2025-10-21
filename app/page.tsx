import type { Metadata } from 'next';

import { ClosingCtaSection } from '@/components/home/closing-cta-section';
import { HeroSection } from '@/components/home/hero-section';
import { PackagesSection } from '@/components/home/packages-section';
import { ServicesSection } from '@/components/home/services-section';
import { ValueSection } from '@/components/home/value-section';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'PixelVerse Studios | Custom Web Design & Local SEO',
  description:
    'Partner with PixelVerse Studios for UX-first, custom-coded marketing websites and SEO programs that turn visitors into revenue.',
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
      <ClosingCtaSection />
    </main>
  );
}

import type { Metadata } from 'next';

import { ServicesClosingCtaSection } from '@/components/services/services-closing-cta';
import { ServicesCoreSection } from '@/components/services/services-core-section';
import { ServicesIntroSection } from '@/components/services/services-intro-section';
import { ServicesProcessSection } from '@/components/services/services-process-section';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Our Services | Web Development, UX/UI Design & SEO',
  description:
    'Explore our core services: custom web development, UX/UI design, and SEO. Strategic digital solutions that drive measurable business results.',
  path: '/services',
  keywords: [
    'web design services',
    'custom web development',
    'UX UI design agency',
    'SEO services',
    'digital agency services',
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

import type { Metadata } from 'next';

import { ServicesClosingCtaSection } from '@/components/services/services-closing-cta';
import { ServicesCoreSection } from '@/components/services/services-core-section';
import { ServicesGlanceSection } from '@/components/services/services-glance-section';
import { ServicesIntroSection } from '@/components/services/services-intro-section';
import { ServicesProcessSection } from '@/components/services/services-process-section';
import { ServicesWhySection } from '@/components/services/services-why-section';

export const metadata: Metadata = {
  title: 'PixelVerse Studios Services',
  description:
    'Explore PixelVerse Studios services spanning custom development, UX/UI design, performance, analytics, and ongoing support tailored for growth.'
};

export default function ServicesPage() {
  return (
    <main>
      <ServicesIntroSection />
      <ServicesCoreSection />
      <ServicesProcessSection />
      <ServicesWhySection />
      <ServicesGlanceSection />
      <ServicesClosingCtaSection />
    </main>
  );
}

import type { Metadata } from 'next';

import { ServicesClarificationCtaSection } from '@/components/services/services-clarification-cta-section';
import { ServicesClosingCtaSection } from '@/components/services/services-closing-cta';
import { ServicesHeroSection } from '@/components/services/services-hero-section';
import { ServicesPathCardsSection } from '@/components/services/services-path-cards-section';
import { servicesPageData } from '@/data/service-paths';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Web Design & SEO Services NJ | PixelVerse Studios',
  description:
    'Custom web design or SEO optimization for existing sites. We help you choose the right path and execute with clarity.',
  path: '/services',
  keywords: [
    'web design services',
    'SEO services',
    'website optimization',
    'custom web development',
    'local SEO NJ',
  ],
});

export default function ServicesPage() {
  const { hero, clarificationCta } = servicesPageData;

  return (
    <main>
      <ServicesHeroSection title={hero.title} description={hero.description} />
      <ServicesPathCardsSection />
      <ServicesClarificationCtaSection
        title={clarificationCta.title}
        description={clarificationCta.description}
        primaryCta={clarificationCta.primaryCta}
        secondaryCta={clarificationCta.secondaryCta}
      />
      <ServicesClosingCtaSection />
    </main>
  );
}

import type { Metadata } from 'next';

import { ServicesClarificationCtaSection } from '@/components/services/services-clarification-cta-section';
import { ServicesHeroSection } from '@/components/services/services-hero-section';
import { ServicesPathCardsSection } from '@/components/services/services-path-cards-section';
import { StructuredData } from '@/components/ui/structured-data';
import { servicesPageData } from '@/data/service-paths';
import { createPageMetadata } from '@/lib/metadata';
import { createBreadcrumbSchema, createHomepageServiceSchemas } from '@/lib/structured-data';

export const metadata: Metadata = createPageMetadata({
  title: 'Web Design & SEO Services | New Jersey',
  description:
    'Web design, development, and local SEO services for New Jersey businesses. Discover our approach and find the right solution for your goals.',
  path: '/services',
  keywords: [
    'web design services',
    'SEO services',
    'website optimization',
    'custom web development',
    'local SEO NJ',
  ],
});

const breadcrumbSchema = createBreadcrumbSchema([
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
]);

const serviceSchemas = createHomepageServiceSchemas();

export default function ServicesPage() {
  const { hero, clarificationCta } = servicesPageData;

  return (
    <main>
      <StructuredData data={breadcrumbSchema} id="services-breadcrumb-schema" />
      {serviceSchemas.map((schema, i) => (
        <StructuredData key={i} data={schema} id={`services-service-schema-${i}`} />
      ))}
      <ServicesHeroSection title={hero.title} description={hero.description} />
      <ServicesPathCardsSection />
      <ServicesClarificationCtaSection
        title={clarificationCta.title}
        description={clarificationCta.description}
        primaryCta={clarificationCta.primaryCta}
        secondaryCta={clarificationCta.secondaryCta}
      />
    </main>
  );
}

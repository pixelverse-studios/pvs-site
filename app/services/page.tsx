import type { Metadata } from 'next';

import { ServicesClarificationCtaSection } from '@/components/services/services-clarification-cta-section';
import { ServicesHeroSection } from '@/components/services/services-hero-section';
import { ServicesPathCardsSection } from '@/components/services/services-path-cards-section';
import { StructuredData } from '@/components/ui/structured-data';
import { servicesPageData } from '@/data/service-paths';
import { createPageMetadata } from '@/lib/metadata';
import { createBreadcrumbSchema, createServiceSchema } from '@/lib/structured-data';

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

const webDesignServiceSchema = createServiceSchema({
  name: 'Web Design & Development',
  serviceType: 'Web Development',
  description:
    'Custom website design and development for New Jersey businesses. We plan, design, and build websites with clear structure and purpose.',
  path: '/services/web-development',
});

const seoServiceSchema = createServiceSchema({
  name: 'Local SEO & Website Optimization',
  serviceType: 'SEO Services',
  description:
    'Local SEO and website optimization for New Jersey businesses. We improve search visibility and rankings to help the right customers find you.',
  path: '/services/seo',
});

export default function ServicesPage() {
  const { hero, clarificationCta } = servicesPageData;

  return (
    <main>
      <StructuredData id="services-breadcrumb" data={breadcrumbSchema} />
      <StructuredData id="services-web-design" data={webDesignServiceSchema} />
      <StructuredData id="services-seo" data={seoServiceSchema} />
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

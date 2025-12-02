import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { CityServicesCtaSection } from '@/components/services/city/city-services-cta-section';
import { CityServicesFaqSection } from '@/components/services/city/city-services-faq-section';
import { CityServicesHero } from '@/components/services/city/city-services-hero';
import { CityServicesHighlights } from '@/components/services/city/city-services-highlights';
import { CityServicesProofSection } from '@/components/services/city/city-services-proof-section';
import { ServicesClosingCtaSection } from '@/components/services/services-closing-cta';
import { ServicesCoreSection } from '@/components/services/services-core-section';
import { ServicesIntroSection } from '@/components/services/services-intro-section';
import { ServicesProcessSection } from '@/components/services/services-process-section';
import { StructuredData } from '@/components/ui/structured-data';
import {
  cityServicePageSlugs,
  getCityServicePage
} from '@/data/services-city-pages';
import { createPageMetadata } from '@/lib/metadata';
import {
  createBreadcrumbSchema,
  createCityLocalBusinessSchema,
  createCityServicesSchema
} from '@/lib/structured-data';

interface CityPageParams {
  city: string;
}

export function generateStaticParams() {
  return cityServicePageSlugs.map((city) => ({ city }));
}

export const dynamicParams = false;

export function generateMetadata({ params }: { params: CityPageParams }): Metadata {
  const page = getCityServicePage(params.city);

  if (!page) {
    return {};
  }

  return createPageMetadata({
    title: page.metadata.title,
    description: page.metadata.description,
    path: `/services/${page.slug}`,
    keywords: page.metadata.keywords
  });
}

export default function CityServicesPage({ params }: { params: CityPageParams }) {
  const page = getCityServicePage(params.city);

  if (!page) {
    notFound();
  }

  // Breadcrumb: Home > Services > [City Name]
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: `${page.city}, ${page.state}`, path: `/services/${page.slug}` },
  ]);

  // Per-city LocalBusiness schema
  const localBusinessSchema = createCityLocalBusinessSchema({
    slug: page.slug,
    city: page.city,
    state: page.state,
    description: page.metadata.description
  });

  // Service schemas for this city
  const serviceSchemas = createCityServicesSchema(page.slug, page.city, page.state);

  return (
    <main>
      <StructuredData id={`breadcrumb-${page.slug}`} data={breadcrumbSchema} />
      <StructuredData id={`local-business-${page.slug}`} data={localBusinessSchema} />
      {serviceSchemas.map((schema, index) => (
        <StructuredData
          key={`service-${page.slug}-${index}`}
          id={`service-${page.slug}-${index}`}
          data={schema}
        />
      ))}
      <CityServicesHero hero={page.hero} />
      <ServicesIntroSection headingLevel="h2" />
      <ServicesCoreSection />
      <CityServicesHighlights city={page.city} highlights={page.serviceHighlights} />
      <ServicesProcessSection />
      <CityServicesProofSection proof={page.proof} city={page.city} />
      <CityServicesFaqSection city={page.city} faq={page.faq} />
      <CityServicesCtaSection cta={page.cta} />
      <ServicesClosingCtaSection contactHref={`/contact/${page.slug}`} />
    </main>
  );
}

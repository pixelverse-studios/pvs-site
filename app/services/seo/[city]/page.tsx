import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Search } from 'lucide-react';

import {
  LocalServiceHero,
  LocalServiceIntro,
  LocalServiceFeatures,
  LocalServiceProof,
  LocalServiceFaq,
  LocalServiceCta,
  LocalServiceRelated,
} from '@/components/services/local';
import { StructuredData } from '@/components/ui/structured-data';
import {
  getLocalServicePage,
  getCityDefinition,
  getServiceDefinition,
  getLocalServicePageSlugs,
  isSupportedCity,
} from '@/data/local-service-pages';
import { createPageMetadata } from '@/lib/metadata';
import {
  createLocalServiceSchema,
  createLocalServiceBreadcrumbSchema,
} from '@/lib/structured-data';

interface PageParams {
  city: string;
}

const SERVICE_SLUG = 'seo' as const;
const serviceDefinition = getServiceDefinition(SERVICE_SLUG);

/**
 * Generate static params for all cities that have seo content
 */
export function generateStaticParams() {
  const pages = getLocalServicePageSlugs().filter((p) => p.service === SERVICE_SLUG);
  return pages.map((p) => ({ city: p.city }));
}

// Only render pages that exist in the data
export const dynamicParams = false;

/**
 * Generate metadata for the page
 */
export function generateMetadata({ params }: { params: PageParams }): Metadata {
  const page = getLocalServicePage(SERVICE_SLUG, params.city);

  if (!page) {
    return {};
  }

  return createPageMetadata({
    title: page.metadata.title,
    description: page.metadata.description,
    path: `/services/${SERVICE_SLUG}/${params.city}`,
    keywords: page.metadata.keywords,
  });
}

export default function SeoCityPage({ params }: { params: PageParams }) {
  const { city: citySlug } = params;

  // Validate city is supported
  if (!isSupportedCity(citySlug)) {
    notFound();
  }

  // Get page content
  const page = getLocalServicePage(SERVICE_SLUG, citySlug);

  if (!page) {
    notFound();
  }

  // Get city definition for coordinates
  const cityDef = getCityDefinition(citySlug);

  if (!cityDef) {
    notFound();
  }

  // Generate structured data
  const breadcrumbSchema = createLocalServiceBreadcrumbSchema(
    serviceDefinition.name,
    SERVICE_SLUG,
    cityDef.city,
    citySlug
  );

  const serviceSchema = createLocalServiceSchema({
    serviceSlug: SERVICE_SLUG,
    serviceName: `${serviceDefinition.name} in ${cityDef.city}, ${cityDef.state}`,
    serviceType: serviceDefinition.name,
    citySlug,
    city: cityDef.city,
    state: cityDef.state,
    description: page.metadata.description,
    coordinates: cityDef.coordinates,
  });

  const contactHref = `/contact/${citySlug}`;

  return (
    <main>
      {/* Structured Data */}
      <StructuredData id={`breadcrumb-${SERVICE_SLUG}-${citySlug}`} data={breadcrumbSchema} />
      <StructuredData id={`service-${SERVICE_SLUG}-${citySlug}`} data={serviceSchema} />

      {/* Page Sections */}
      <LocalServiceHero
        hero={page.hero}
        serviceName={serviceDefinition.name}
        city={cityDef.city}
        contactHref={contactHref}
        icon={Search}
      />
      <LocalServiceIntro intro={page.content.intro} city={cityDef.city} />
      <LocalServiceFeatures
        features={page.content.features}
        serviceName={serviceDefinition.name}
        city={cityDef.city}
      />
      <LocalServiceProof
        proof={page.proof}
        city={cityDef.city}
        serviceName={serviceDefinition.name}
      />
      <LocalServiceFaq
        faq={page.faq}
        city={cityDef.city}
        serviceName={serviceDefinition.name}
      />
      <LocalServiceRelated
        relatedCities={page.relatedCities}
        relatedServices={page.relatedServices}
        currentServiceSlug={SERVICE_SLUG}
        currentCitySlug={citySlug}
        currentCity={cityDef.city}
      />
      <LocalServiceCta cta={page.cta} contactHref={contactHref} />
    </main>
  );
}

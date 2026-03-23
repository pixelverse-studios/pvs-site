import type { Metadata } from 'next';
import { MapPin } from 'lucide-react';
import { notFound } from 'next/navigation';

import { ServiceCta } from '@/components/services/individual/service-cta';
import { ServiceFAQ } from '@/components/services/individual/service-faq';
import { ServiceHero } from '@/components/services/individual/service-hero';
import { ServiceNarrativeSection } from '@/components/services/individual/service-narrative-section';
import { StructuredData } from '@/components/ui/structured-data';
import { getCityContent, getValidCitySlugs } from '@/data/area-pages-content';
import { createPageMetadata } from '@/lib/metadata';
import {
  createBreadcrumbSchema,
  createCityLocalBusinessSchema,
  createCityServicesSchema,
} from '@/lib/structured-data';

type Params = {
  county: string;
  city: string;
};

export function generateStaticParams() {
  return getValidCitySlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { county, city } = await params;
  const content = getCityContent(county, city);
  if (!content) return {};

  return createPageMetadata({
    title: content.metaTitle,
    description: content.metaDescription,
    path: `/areas/${content.countySlug}/${content.slug}`,
    keywords: content.primaryKeywords,
  });
}

export default async function CityPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { county, city } = await params;
  const content = getCityContent(county, city);
  if (!content) notFound();

  const basePath = `/areas/${content.countySlug}/${content.slug}`;

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: content.county, path: `/areas/${content.countySlug}` },
    { name: content.city, path: basePath },
  ]);

  const localBusinessSchema = createCityLocalBusinessSchema({
    slug: content.slug,
    city: content.city,
    state: content.state,
    description: content.metaDescription,
    basePath,
  });

  const serviceSchemas = createCityServicesSchema(
    content.slug,
    content.city,
    content.state,
    basePath,
  );

  return (
    <>
      <StructuredData id="city-breadcrumb" data={breadcrumbSchema} />
      <StructuredData id="city-local-business" data={localBusinessSchema} />
      {serviceSchemas.map((schema) => (
        <StructuredData key={schema['@id']} id={schema['@id']} data={schema} />
      ))}
      <main>
        <ServiceHero
          eyebrow={`Services in ${content.city}, ${content.state}`}
          title={content.hero.title}
          description={content.hero.description}
          primaryCta={{ label: `Start Your ${content.city} Project`, href: '/contact/details' }}
          secondaryCta={{ label: `View all ${content.county} areas`, href: `/areas/${content.countySlug}` }}
          icon={MapPin}
        />

        {content.intro && (
          <ServiceNarrativeSection
            eyebrow="Local Market"
            title={`Why ${content.city} Businesses Choose PixelVerse`}
            intro={content.intro}
            layout="text-only"
            background="bg"
          />
        )}

        {content.services.length > 0 && content.services.map((service, i) => (
          <ServiceNarrativeSection
            key={service.heading}
            eyebrow={i === 0 ? 'Web Design' : 'Local SEO'}
            title={service.heading}
            intro={service.body}
            layout="text-only"
            background={i % 2 === 0 ? 'surface' : 'bg'}
          />
        ))}

        {content.localSignals.heading && (
          <ServiceNarrativeSection
            eyebrow="Why This Market"
            title={content.localSignals.heading}
            intro={content.localSignals.body}
            layout="text-only"
            background={content.services.length % 2 === 0 ? 'surface' : 'bg'}
          />
        )}

        <ServiceFAQ
          faqs={content.faq}
          schemaId={`${content.slug}-faq-schema`}
        />

        <ServiceCta
          heading={`Ready to Grow Your ${content.city} Business?`}
          description={`Based in Cliffside Park, NJ — serving businesses across ${content.county} and beyond. The next step is a conversation about your situation.`}
          primaryCta={{ label: `Start Your ${content.city} Project`, href: '/contact/details' }}
          secondaryCta={{ label: `View all ${content.county} areas`, href: `/areas/${content.countySlug}` }}
          variant="gradient"
        />
      </main>
    </>
  );
}

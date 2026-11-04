import type { Metadata } from 'next';
import { MapPin } from 'lucide-react';
import { notFound } from 'next/navigation';
import Link from 'next/link';

import { ServiceCta } from '@/components/services/individual/service-cta';
import { ServiceFAQ } from '@/components/services/individual/service-faq';
import { ServiceHero } from '@/components/services/individual/service-hero';
import { ServiceNarrativeSection } from '@/components/services/individual/service-narrative-section';
import { StructuredData } from '@/components/ui/structured-data';
import { Container } from '@/components/ui/container';
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

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
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

export default async function CityPage({ params }: { params: Promise<Params> }) {
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
          secondaryCta={{
            label: `View all ${content.county} areas`,
            href: `/areas/${content.countySlug}`,
          }}
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

        {content.services.length > 0 &&
          content.services.map((service, i) => (
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
            eyebrow="Local considerations"
            title={content.localSignals.heading}
            intro={content.localSignals.body}
            layout="text-only"
            background={content.services.length % 2 === 0 ? 'surface' : 'bg'}
          />
        )}

        <section className="bg-[var(--pv-bg)] py-16 md:py-24" aria-labelledby="local-next-step">
          <Container>
            <div className="mx-auto max-w-3xl space-y-5">
              <h2
                id="local-next-step"
                className="font-heading text-3xl font-semibold text-[var(--pv-text)]"
              >
                Choose the next step for your {content.city} business
              </h2>
              <p className="text-[var(--pv-text-muted)]">
                If your existing website needs clearer local visibility and ongoing optimization,
                explore our{' '}
                <Link
                  href="/services/seo"
                  className="font-medium text-[var(--pv-primary)] underline underline-offset-4"
                >
                  recurring SEO services
                </Link>
                . For a new website or a substantial rebuild, see our{' '}
                <Link
                  href="/services/web-development"
                  className="font-medium text-[var(--pv-primary)] underline underline-offset-4"
                >
                  web design and development service
                </Link>
                .
              </p>
              <p className="text-[var(--pv-text-muted)]">
                <Link
                  href="/portfolio"
                  className="font-medium text-[var(--pv-primary)] underline underline-offset-4"
                >
                  Review our project work
                </Link>{' '}
                to understand our approach. These examples cover different markets and project
                scopes; they are not a claim that every project was delivered in {content.city}.
              </p>
            </div>
          </Container>
        </section>

        <ServiceFAQ faqs={content.faq} schemaId={`${content.slug}-faq-schema`} />

        <ServiceCta
          heading={`Ready to Grow Your ${content.city} Business?`}
          description={`Based in Cliffside Park, NJ, serving businesses across ${content.county} and beyond. The next step is a conversation about your situation.`}
          primaryCta={{ label: `Start Your ${content.city} Project`, href: '/contact/details' }}
          secondaryCta={{
            label: `View all ${content.county} areas`,
            href: `/areas/${content.countySlug}`,
          }}
          variant="gradient"
        />
      </main>
    </>
  );
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Container } from '@/components/ui/container';
import { StructuredData } from '@/components/ui/structured-data';
import { getCityContent, getValidCitySlugs } from '@/data/area-pages-content';
import { createPageMetadata } from '@/lib/metadata';
import {
  createBreadcrumbSchema,
  createCityLocalBusinessSchema,
  createCityServicesSchema,
} from '@/lib/structured-data';
import Link from 'next/link';

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
        <section className="pt-hero pb-16 md:pb-24">
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="font-heading text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                {content.hero.title}
              </h1>
              <p className="mt-6 text-lg text-[var(--pv-text-muted)]">
                {content.hero.description}
              </p>
            </div>
          </Container>
        </section>

        {content.intro && (
          <section className="py-16 md:py-24">
            <Container>
              <div className="prose prose-lg mx-auto max-w-3xl dark:prose-invert">
                <p>{content.intro}</p>
              </div>
            </Container>
          </section>
        )}

        {content.services.length > 0 && (
          <section className="bg-[var(--pv-surface)] py-16 md:py-24">
            <Container>
              <div className="mx-auto max-w-3xl space-y-12">
                {content.services.map((service) => (
                  <div key={service.heading}>
                    <h2 className="font-heading text-2xl font-bold">
                      {service.heading}
                    </h2>
                    <p className="mt-4 text-[var(--pv-text-muted)]">
                      {service.body}
                    </p>
                  </div>
                ))}
              </div>
            </Container>
          </section>
        )}

        <section className="py-16 md:py-24">
          <Container>
            <div className="mx-auto max-w-xl text-center">
              <h2 className="font-heading text-2xl font-bold">
                Ready to Grow Your {content.city} Business?
              </h2>
              <p className="mt-4 text-[var(--pv-text-muted)]">
                Based in Cliffside Park, NJ — serving businesses across{' '}
                {content.county} and beyond.
              </p>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link
                  href="/contact/details"
                  className="inline-flex items-center rounded-pv bg-[var(--pv-gradient)] px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Start Your {content.city} Project
                </Link>
                <Link
                  href={`/areas/${content.countySlug}`}
                  className="text-sm font-medium text-[var(--pv-primary)] underline-offset-4 hover:underline"
                >
                  View all {content.county} areas
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}

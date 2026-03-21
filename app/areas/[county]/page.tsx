import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Container } from '@/components/ui/container';
import { StructuredData } from '@/components/ui/structured-data';
import {
  getCountyContent,
  getCitiesForCounty,
  getValidCountySlugs,
} from '@/data/area-pages-content';
import { createPageMetadata } from '@/lib/metadata';
import { createBreadcrumbSchema, createCityLocalBusinessSchema } from '@/lib/structured-data';
import Link from 'next/link';

type Params = {
  county: string;
};

export function generateStaticParams() {
  return getValidCountySlugs().map((county) => ({ county }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { county } = await params;
  const content = getCountyContent(county);
  if (!content) return {};

  return createPageMetadata({
    title: content.metaTitle,
    description: content.metaDescription,
    path: `/areas/${content.slug}`,
    keywords: [
      `web design ${content.name}`,
      `SEO ${content.name} NJ`,
      `${content.name} web designer`,
    ],
  });
}

export default async function CountyPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { county } = await params;
  const content = getCountyContent(county);
  if (!content) notFound();

  const cityPages = getCitiesForCounty(county);

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Areas We Serve', path: `/areas/${content.slug}` },
  ]);

  const localBusinessSchema = createCityLocalBusinessSchema({
    slug: content.slug,
    city: content.name,
    state: content.state,
    basePath: `/areas/${content.slug}`,
  });

  return (
    <>
      <StructuredData id="county-breadcrumb" data={breadcrumbSchema} />
      <StructuredData id="county-local-business" data={localBusinessSchema} />
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

        {cityPages.length > 0 && (
          <section className="bg-[var(--pv-surface)] py-16 md:py-24">
            <Container>
              <h2 className="font-heading text-center text-3xl font-bold">
                Cities We Serve in {content.name}
              </h2>
              <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {cityPages.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/areas/${content.slug}/${city.slug}`}
                    className="group rounded-pv border border-[var(--pv-border)] bg-[var(--pv-bg)] p-6 transition-shadow hover:shadow-lg"
                  >
                    <h3 className="font-heading text-xl font-semibold group-hover:text-[var(--pv-primary)]">
                      {city.city}, {city.state}
                    </h3>
                    <p className="mt-2 text-sm text-[var(--pv-text-muted)]">
                      {city.hero.description}
                    </p>
                  </Link>
                ))}
              </div>
            </Container>
          </section>
        )}
      </main>
    </>
  );
}

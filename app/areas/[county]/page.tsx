import type { Metadata } from 'next';
import Link from 'next/link';
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
      `${content.name} digital agency`,
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
    { name: content.name, path: `/areas/${content.slug}` },
  ]);

  const localBusinessSchema = createCityLocalBusinessSchema({
    slug: content.slug,
    city: content.name,
    state: content.state,
    description: content.metaDescription,
    basePath: `/areas/${content.slug}`,
  });

  const faqSchema =
    content.faq.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: content.faq.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })),
        }
      : null;

  return (
    <>
      <StructuredData id="county-breadcrumb" data={breadcrumbSchema} />
      <StructuredData id="county-local-business" data={localBusinessSchema} />
      {faqSchema && <StructuredData id="county-faq" data={faqSchema} />}
      <main>
        {/* Hero */}
        <section className="pt-hero pb-16 md:pb-24">
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="font-heading text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                {content.hero.title}
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-[var(--pv-text-muted)]">
                {content.hero.description}
              </p>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link
                  href="/contact/details"
                  className="inline-flex items-center rounded-pv bg-[var(--pv-gradient)] px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Start Your Bergen County Project
                </Link>
                <Link
                  href="/contact/review"
                  className="text-sm font-medium text-[var(--pv-primary)] underline-offset-4 hover:underline"
                >
                  Request a Website Review
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* Intro */}
        <section className="py-16 md:py-24">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="font-heading text-3xl font-bold">
                {content.intro.heading}
              </h2>
              <div className="mt-8 space-y-6 text-[var(--pv-text-muted)] leading-relaxed">
                {content.intro.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* Services */}
        <section className="bg-[var(--pv-surface)] py-16 md:py-24">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="font-heading text-3xl font-bold">
                {content.services.heading}
              </h2>
              <div className="mt-12 space-y-12">
                {content.services.sections.map((section) => (
                  <div key={section.title}>
                    <h3 className="font-heading text-xl font-semibold">
                      {section.title}
                    </h3>
                    <p className="mt-4 leading-relaxed text-[var(--pv-text-muted)]">
                      {section.body}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/services/web-development"
                  className="text-sm font-semibold text-[var(--pv-primary)] underline-offset-4 hover:underline"
                >
                  Learn more about Web Design & Development
                </Link>
                <Link
                  href="/services/seo"
                  className="text-sm font-semibold text-[var(--pv-primary)] underline-offset-4 hover:underline"
                >
                  Learn more about Local SEO Services
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* City Grid */}
        {cityPages.length > 0 && (
          <section className="py-16 md:py-24">
            <Container>
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="font-heading text-3xl font-bold">
                  Cities We Serve in {content.name}
                </h2>
                <p className="mt-4 text-[var(--pv-text-muted)]">
                  We work with businesses across {content.name}. These are our
                  priority focus areas where we bring deep local knowledge and
                  proven results.
                </p>
              </div>
              <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {cityPages.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/areas/${content.slug}/${city.slug}`}
                    className="group rounded-pv border border-[var(--pv-border)] bg-[var(--pv-bg)] p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <h3 className="font-heading text-xl font-semibold group-hover:text-[var(--pv-primary)]">
                      {city.city}, {city.state}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--pv-text-muted)]">
                      {city.hero.description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--pv-primary)]">
                      View {city.city} services
                      <span aria-hidden>&rarr;</span>
                    </span>
                  </Link>
                ))}
              </div>
            </Container>
          </section>
        )}

        {/* Local Signals */}
        <section className="bg-[var(--pv-surface)] py-16 md:py-24">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="font-heading text-3xl font-bold">
                {content.localSignals.heading}
              </h2>
              <div className="mt-8 space-y-6 leading-relaxed text-[var(--pv-text-muted)]">
                {content.localSignals.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* FAQ */}
        {content.faq.length > 0 && (
          <section className="py-16 md:py-24">
            <Container>
              <div className="mx-auto max-w-3xl">
                <h2 className="font-heading text-3xl font-bold">
                  Frequently Asked Questions
                </h2>
                <dl className="mt-10 space-y-8">
                  {content.faq.map((item) => (
                    <div key={item.question}>
                      <dt className="font-heading text-lg font-semibold">
                        {item.question}
                      </dt>
                      <dd className="mt-3 leading-relaxed text-[var(--pv-text-muted)]">
                        {item.answer}
                        {item.link && (
                          <>
                            {' '}
                            <Link
                              href={item.link.href}
                              className="font-medium text-[var(--pv-primary)] underline-offset-4 hover:underline"
                            >
                              {item.link.label}
                            </Link>
                          </>
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Container>
          </section>
        )}

        {/* CTA */}
        <section className="bg-[var(--pv-surface)] py-16 md:py-24">
          <Container>
            <div className="mx-auto max-w-xl text-center">
              <h2 className="font-heading text-3xl font-bold">
                {content.cta.heading}
              </h2>
              <p className="mt-4 leading-relaxed text-[var(--pv-text-muted)]">
                {content.cta.description}
              </p>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link
                  href="/contact/details"
                  className="inline-flex items-center rounded-pv bg-[var(--pv-gradient)] px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Start the Conversation
                </Link>
                <Link
                  href="/contact/review"
                  className="text-sm font-medium text-[var(--pv-primary)] underline-offset-4 hover:underline"
                >
                  Request a Website Review
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}

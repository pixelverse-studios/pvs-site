import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { notFound } from 'next/navigation';

import { ServiceCta } from '@/components/services/individual/service-cta';
import { ServiceFAQ } from '@/components/services/individual/service-faq';
import { ServiceHero } from '@/components/services/individual/service-hero';
import { ServiceNarrativeSection } from '@/components/services/individual/service-narrative-section';
import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';
import { SectionHeader } from '@/components/ui/section-header';
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

  return (
    <>
      <StructuredData id="county-breadcrumb" data={breadcrumbSchema} />
      <StructuredData id="county-local-business" data={localBusinessSchema} />
      <main>
        <ServiceHero
          eyebrow={`Services in ${content.name}`}
          title={content.hero.title}
          description={content.hero.description}
          primaryCta={{ label: `Start Your ${content.name} Project`, href: '/contact/details' }}
          secondaryCta={{ label: 'Request a Website Review', href: '/contact/review' }}
          icon={MapPin}
        />

        <ServiceNarrativeSection
          eyebrow="Why Local Matters"
          title={content.intro.heading}
          intro={content.intro.paragraphs}
          layout="text-only"
          background="bg"
        />

        {/* Services — card grid with links to service detail pages */}
        <section className="bg-[var(--pv-surface)] py-16 md:py-24">
          <Container>
            <MotionSection as="div">
              <MotionItem>
                <SectionHeader
                  align="center"
                  eyebrow="Our Services"
                  title={content.services.heading}
                />
              </MotionItem>
              <div className="mt-12 grid gap-8 md:grid-cols-2">
                {content.services.sections.map((section, i) => {
                  const serviceLink = i === 0
                    ? { href: '/services/web-development', label: 'Learn more about Web Design & Development' }
                    : { href: '/services/seo', label: 'Learn more about Local SEO Services' };
                  return (
                    <MotionItem key={section.title} delay={i * 0.1}>
                      <div className="group flex h-full flex-col rounded-pv border border-[var(--pv-border)] bg-[var(--pv-bg)] p-8 transition-all hover:-translate-y-0.5 hover:shadow-lg">
                        <h3 className="font-heading text-xl font-semibold">
                          {section.title}
                        </h3>
                        <p className="mt-4 flex-1 text-sm leading-relaxed text-[var(--pv-text-muted)]">
                          {section.body}
                        </p>
                        <Link
                          href={serviceLink.href}
                          className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-[var(--pv-primary)] underline-offset-4 hover:underline"
                        >
                          {serviceLink.label}
                          <span aria-hidden>&rarr;</span>
                        </Link>
                      </div>
                    </MotionItem>
                  );
                })}
              </div>
            </MotionSection>
          </Container>
        </section>

        {/* City grid */}
        {cityPages.length > 0 && (
          <section className="py-16 md:py-24">
            <Container>
              <MotionSection as="div">
                <MotionItem>
                  <SectionHeader
                    align="center"
                    eyebrow="Areas We Serve"
                    title={`Cities We Serve in ${content.name}`}
                    description={`We work with businesses across ${content.name}. These are our priority focus areas where we bring deep local knowledge and proven results.`}
                  />
                </MotionItem>
                <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {cityPages.map((city, i) => (
                    <MotionItem key={city.slug} delay={i * 0.08}>
                      <Link
                        href={`/areas/${content.slug}/${city.slug}`}
                        className="group flex h-full flex-col rounded-pv border border-[var(--pv-border)] bg-[var(--pv-bg)] p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg"
                      >
                        <h3 className="font-heading text-xl font-semibold group-hover:text-[var(--pv-primary)]">
                          {city.city}, {city.state}
                        </h3>
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--pv-text-muted)]">
                          {city.hero.description}
                        </p>
                        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--pv-primary)]">
                          View {city.city} services
                          <span aria-hidden>&rarr;</span>
                        </span>
                      </Link>
                    </MotionItem>
                  ))}
                </div>
              </MotionSection>
            </Container>
          </section>
        )}

        <ServiceNarrativeSection
          eyebrow="Local Market"
          title={content.localSignals.heading}
          intro={content.localSignals.paragraphs}
          layout="text-only"
          background="surface"
        />

        <ServiceFAQ
          faqs={content.faq}
          schemaId="county-faq-schema"
        />

        <ServiceCta
          heading={content.cta.heading}
          description={content.cta.description}
          primaryCta={{ label: 'Start the Conversation', href: '/contact/details' }}
          secondaryCta={{ label: 'Request a Website Review', href: '/contact/review' }}
          variant="gradient"
        />
      </main>
    </>
  );
}

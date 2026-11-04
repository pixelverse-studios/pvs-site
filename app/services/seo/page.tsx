import type { Metadata } from 'next';
import Link from 'next/link';
import { Search } from 'lucide-react';

import { createPageMetadata } from '@/lib/metadata';
import { createBreadcrumbSchema, createServiceSchema } from '@/lib/structured-data';
import {
  ServiceHero,
  ServiceNarrativeSection,
  ServiceCta,
  ServiceFAQ,
  ServiceAreaLinks,
  SeoPackagePricingSection,
} from '@/components/services/individual';
import { Container } from '@/components/ui/container';
import { StructuredData } from '@/components/ui/structured-data';
import { formatStartingPrice, seoStrategySetupPrice } from '@/data/package-pricing';
import { getLowestSeoMonthlyPrice, seoContent } from '@/data/seo-content';

export const metadata: Metadata = createPageMetadata({
  title: 'Local SEO Services | New Jersey',
  description:
    'Local SEO and website optimization services for New Jersey businesses. We improve search visibility and rankings to help the right customers find you.',
  path: '/services/seo',
  keywords: [
    'local SEO',
    'website optimization',
    'local search visibility',
    'SEO services New Jersey',
    'local business SEO',
    'website performance optimization',
  ],
});

const breadcrumbSchema = createBreadcrumbSchema([
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Local SEO', path: '/services/seo' },
]);

const serviceSchema = createServiceSchema({
  name: 'Local Website Optimization & SEO',
  serviceType: 'SEO',
  description:
    "For businesses with an existing website that need to be found by the right people in the right places. We improve local visibility, clarity, and performance by identifying what's holding a site back.",
  path: '/services/seo',
});

export default function SEOServicesPage() {
  const {
    hero,
    whyBusinessesLook,
    whyNotJustRankings,
    howWeEvaluate,
    whenOptimizationIsRight,
    whatToExpect,
    pricing,
    faq,
    finalCta,
  } = seoContent;

  return (
    <main>
      <StructuredData data={breadcrumbSchema} id="seo-breadcrumb-schema" />
      <StructuredData data={serviceSchema} id="seo-services-service-schema" />

      {/* 1. Hero */}
      <ServiceHero
        eyebrow="Local SEO & Optimization"
        title={hero.title}
        description={hero.description}
        primaryCta={{ ...hero.cta, href: '/contact/details?interest=seo' }}
        secondaryCta={{ label: 'Request a Website Review', href: '/contact/review' }}
        icon={Search}
        startingPrice={{
          label: 'SEO plans from',
          price: `${formatStartingPrice(getLowestSeoMonthlyPrice())}/month`,
          note: `Plus a one-time ${formatStartingPrice(seoStrategySetupPrice)} strategy setup.`,
        }}
      />

      {/* 2. Why Businesses Look at Local SEO & Optimization */}
      <ServiceNarrativeSection
        eyebrow="Common Starting Points"
        title={whyBusinessesLook.title}
        intro={whyBusinessesLook.body}
        layout="text-only"
        background="bg"
      />

      {/* 3. Recurring SEO Package Options */}
      <SeoPackagePricingSection
        eyebrow={pricing.eyebrow}
        title={pricing.title}
        intro={pricing.intro}
        packages={pricing.packages}
        footnote={pricing.footnote}
      />

      <ServiceNarrativeSection
        eyebrow="Choosing ongoing support"
        title="Know what your SEO engagement covers."
        intro="Before your retainer starts, you receive a written proposal defining the services and markets covered, specific monthly deliverables, implementation responsibilities, exclusions, and planning cadence. The work is selected around your website's needs and the customers you can serve."
        bullets={[
          'Research supports every plan. Higher tiers provide more implementation capacity and broader service or market coverage.',
          'Essentials includes executed improvements to existing content, metadata, and internal links. Ongoing Local SEO coordinates service-page, routine technical, Business Profile, and important listing work within the agreed scope.',
          'Expanded SEO adds planned content development, inquiry-path improvements, and research into relevant local partnerships and editorial or link opportunities. Earned mentions and links depend on third-party decisions.',
          'New pages, original articles, substantial development, and additional Business Profiles need an explicit scope and approval. Your proposal states what is included and what is quoted separately.',
        ]}
        closing="The one-time SEO Strategy Setup includes an initial crawl, indexing and on-page assessment, review of available search and inquiry data, service and competitor research, a content map, and initial priorities. Setup establishes the plan; repairs and analytics installation require an agreed implementation scope."
        layout="text-with-bullets"
        background="surface"
      />

      <ServiceNarrativeSection
        eyebrow="Understanding progress"
        title="A report should connect the work to the next decision."
        intro="Here is an illustrative reporting outline, not a client result or a promise of growth. It separates search exposure from inquiries so an increase in impressions does not get mistaken for new business."
        bullets={[
          'Work completed: the page or profile change, why it was selected, and anything awaiting approval.',
          'Search visibility: relevant searches and pages gaining or losing impressions and clicks, compared over equivalent periods.',
          'Inquiries: completed requests and their quality where reliable tracking and business records are available. Phone-link clicks and form starts remain contact-intent signals.',
          'Next decision: keep measuring, refine an existing page, investigate a technical issue, or recommend additional work with a clear reason.',
        ]}
        closing="What can be measured depends on the access and records available. Missing attribution stays unknown. Search results and inquiry volume vary; no package guarantees a ranking or a fixed number of leads."
        layout="text-with-bullets-alt"
        background="bg"
      />
      <Container className="pb-12 md:pb-16">
        <p className="mx-auto max-w-3xl text-[var(--pv-text-muted)]">
          Want to understand how we approach delivery?{' '}
          <Link
            href="/portfolio"
            className="font-medium text-[var(--pv-primary)] underline underline-offset-4"
          >
            Explore our project work
          </Link>{' '}
          or{' '}
          <Link
            href="/contact/details?interest=seo"
            className="font-medium text-[var(--pv-primary)] underline underline-offset-4"
          >
            discuss recurring SEO support
          </Link>
          .
        </p>
      </Container>

      {/* 4. Why Local SEO Isn't Just About Rankings */}
      <ServiceNarrativeSection
        eyebrow="The Full Picture"
        title={whyNotJustRankings.title}
        intro={whyNotJustRankings.intro}
        bullets={whyNotJustRankings.bulletPoints}
        closing={whyNotJustRankings.closing}
        layout="text-with-bullets"
        background="bg"
      />

      {/* 5. How We Evaluate What's Holding a Site Back */}
      <ServiceNarrativeSection
        eyebrow="Our Approach"
        title={howWeEvaluate.title}
        intro={howWeEvaluate.intro}
        bullets={howWeEvaluate.bulletPoints}
        closing={howWeEvaluate.closing}
        layout="text-with-bullets-alt"
        background="surface"
      />

      {/* 6. When Local Optimization Is the Right Move */}
      <div className="bg-[var(--pv-bg)]">
        <ServiceNarrativeSection
          eyebrow="Finding the Right Path"
          title={whenOptimizationIsRight.title}
          intro={whenOptimizationIsRight.body}
          layout="text-only"
          background="bg"
        />
        <Container className="pb-12 md:pb-16">
          <div className="mx-auto max-w-3xl">
            <Link
              href={whenOptimizationIsRight.crossLink.href}
              className="text-sm font-medium text-[var(--pv-primary)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-primary)] focus-visible:ring-offset-2"
            >
              {whenOptimizationIsRight.crossLink.label}
              <span aria-hidden="true"> →</span>
            </Link>
          </div>
        </Container>
      </div>

      {/* 7. What You Can Expect From Local Optimization Work */}
      <ServiceNarrativeSection
        eyebrow="Practical Outcomes"
        title={whatToExpect.title}
        intro={whatToExpect.intro}
        bullets={whatToExpect.bulletPoints}
        closing={whatToExpect.closing}
        layout="text-with-bullets"
        background="surface"
      />

      {/* 8. FAQ */}
      <ServiceFAQ faqs={faq} schemaId="seo-faq-schema" />

      {/* 9. Service Area Links */}
      <ServiceAreaLinks />

      {/* 10. Final CTA */}
      <ServiceCta
        heading={finalCta.title}
        description={finalCta.description}
        primaryCta={{ ...finalCta.cta, href: '/contact/details?interest=seo' }}
        variant="gradient"
      />
    </main>
  );
}

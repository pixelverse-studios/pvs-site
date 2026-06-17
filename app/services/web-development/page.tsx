import type { Metadata } from 'next';
import Link from 'next/link';
import { Code2 } from 'lucide-react';

import { createPageMetadata } from '@/lib/metadata';
import { createBreadcrumbSchema, createServiceSchema } from '@/lib/structured-data';
import {
  ServiceHero,
  ServiceNarrativeSection,
  ServiceCta,
  ServiceFAQ,
  ServiceAreaLinks,
  ServicePackagePricingSection,
} from '@/components/services/individual';
import { Container } from '@/components/ui/container';
import { StructuredData } from '@/components/ui/structured-data';
import { formatStartingPrice, packageStartingPrices } from '@/data/package-pricing';
import { webDevelopmentContent } from '@/data/web-development-content';

export const metadata: Metadata = createPageMetadata({
  title: 'Web Design & Development | New Jersey',
  description:
    'Professional web design and development in New Jersey. From planning to launch, we build custom websites that are clear, usable, and support business goals.',
  path: '/services/web-development',
  keywords: [
    'web design and development',
    'custom website design',
    'website development NJ',
    'custom web development',
    'website rebuild',
    'business website design',
  ],
});

const breadcrumbSchema = createBreadcrumbSchema([
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Web Design & Development', path: '/services/web-development' },
]);

const serviceSchema = createServiceSchema({
  name: 'Web Design & Development Services',
  serviceType: 'Web Development',
  description:
    'Custom website design and development for businesses that need a new site or a rebuild. We plan, design, and develop websites with clear structure and purpose.',
  path: '/services/web-development',
});

export default function WebDevelopmentPage() {
  const {
    hero,
    whenNewWebsite,
    whyBuildsGoWrong,
    howWePlan,
    designAndDevelopment,
    whatToExpect,
    pricing,
    faq,
    finalCta,
  } = webDevelopmentContent;

  return (
    <main>
      <StructuredData data={breadcrumbSchema} id="web-development-breadcrumb-schema" />
      <StructuredData data={serviceSchema} id="web-development-service-schema" />

      {/* 1. Hero */}
      <ServiceHero
        eyebrow="Web Design & Development"
        title={hero.title}
        description={hero.description}
        primaryCta={hero.cta}
        secondaryCta={{ label: 'Request a Website Review', href: '/contact/review' }}
        icon={Code2}
        startingPrice={{
          label: 'Website packages start as low as',
          price: formatStartingPrice(packageStartingPrices.web),
        }}
      />

      {/* 2. When a New Website Is the Right Move */}
      <div className="bg-[var(--pv-bg)]">
        <ServiceNarrativeSection
          eyebrow="When to Build"
          title={whenNewWebsite.title}
          intro={whenNewWebsite.intro}
          bullets={whenNewWebsite.bulletPoints}
          closing={whenNewWebsite.closing}
          layout="text-with-bullets"
          background="bg"
        />
        <Container className="pb-12 md:pb-16">
          <div className="mx-auto max-w-3xl">
            <Link
              href={whenNewWebsite.crossLink.href}
              className="text-sm font-medium text-[var(--pv-primary)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-primary)] focus-visible:ring-offset-2"
            >
              {whenNewWebsite.crossLink.label}<span aria-hidden="true"> →</span>
            </Link>
          </div>
        </Container>
      </div>

      {/* 3. Website Package Options */}
      <ServicePackagePricingSection
        id="web-development-pricing-heading"
        eyebrow={pricing.eyebrow}
        title={pricing.title}
        intro={pricing.intro}
        packages={pricing.packages}
        serviceLabel="Website"
        interest="web-design"
        detailsLabel="website"
        setupLabel="Project starts at"
        recurringLabel="Ongoing support"
      />

      {/* 4. Why Builds Go Wrong */}
      <ServiceNarrativeSection
        eyebrow="The Reality"
        title={whyBuildsGoWrong.title}
        intro={whyBuildsGoWrong.body}
        layout="text-only"
        background="surface"
      />

      {/* 5. How We Plan Before We Build */}
      <ServiceNarrativeSection
        eyebrow="Our Approach"
        title={howWePlan.title}
        intro={howWePlan.intro}
        bullets={howWePlan.bulletPoints}
        closing={howWePlan.closing}
        layout="text-with-bullets"
        background="bg"
      />

      {/* 6. Design and Development Working Together */}
      <ServiceNarrativeSection
        eyebrow="How We Build"
        title={designAndDevelopment.title}
        intro={designAndDevelopment.intro}
        bullets={designAndDevelopment.bulletPoints}
        layout="text-with-bullets-alt"
        background="surface"
      />

      {/* 7. What to Expect From a Build */}
      <ServiceNarrativeSection
        eyebrow="The Process"
        title={whatToExpect.title}
        intro={whatToExpect.intro}
        bullets={whatToExpect.bulletPoints}
        closing={whatToExpect.closing}
        layout="text-with-bullets"
        background="bg"
      />

      {/* 8. FAQ */}
      <ServiceFAQ
        faqs={faq}
        schemaId="web-development-faq-schema"
      />

      {/* 9. Service Area Links */}
      <ServiceAreaLinks />

      {/* 10. Final CTA */}
      <ServiceCta
        heading={finalCta.title}
        description={finalCta.description}
        primaryCta={finalCta.cta}
        variant="gradient"
      />
    </main>
  );
}

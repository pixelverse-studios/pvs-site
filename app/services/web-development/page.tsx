import type { Metadata } from 'next';
import Link from 'next/link';
import { Code2 } from 'lucide-react';

import { createPageMetadata } from '@/lib/metadata';
import { createServiceSchema } from '@/lib/structured-data';
import {
  ServiceHero,
  ServiceNarrativeSection,
  ServiceCta,
} from '@/components/services/individual';
import { ServiceFAQ } from '@/components/services/individual/service-faq';
import { Container } from '@/components/ui/container';
import { StructuredData } from '@/components/ui/structured-data';
import { webDevelopmentContent } from '@/data/web-development-content';

export const metadata: Metadata = createPageMetadata({
  title: 'Web Design & Development Services NJ | Custom Websites',
  description:
    'Custom web design and development for NJ businesses. We plan, design, and build websites that support how your business actually operates.',
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
    faq,
    finalCta,
  } = webDevelopmentContent;

  return (
    <main>
      <StructuredData data={serviceSchema} id="web-development-service-schema" />

      {/* 1. Hero */}
      <ServiceHero
        eyebrow={hero.title}
        title={hero.title}
        description={hero.description}
        primaryCta={hero.cta}
        icon={Code2}
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

      {/* 3. Why Builds Go Wrong */}
      <ServiceNarrativeSection
        eyebrow="The Reality"
        title={whyBuildsGoWrong.title}
        intro={whyBuildsGoWrong.body}
        layout="text-only"
        background="surface"
      />

      {/* 4. How We Plan Before We Build */}
      <ServiceNarrativeSection
        eyebrow="Our Approach"
        title={howWePlan.title}
        intro={howWePlan.intro}
        bullets={howWePlan.bulletPoints}
        closing={howWePlan.closing}
        layout="text-with-bullets"
        background="bg"
      />

      {/* 5. Design and Development Working Together */}
      <ServiceNarrativeSection
        eyebrow="How We Build"
        title={designAndDevelopment.title}
        intro={designAndDevelopment.intro}
        bullets={designAndDevelopment.bulletPoints}
        layout="text-with-bullets-alt"
        background="surface"
      />

      {/* 6. What to Expect From a Build */}
      <ServiceNarrativeSection
        eyebrow="The Process"
        title={whatToExpect.title}
        intro={whatToExpect.intro}
        bullets={whatToExpect.bulletPoints}
        closing={whatToExpect.closing}
        layout="text-with-bullets"
        background="bg"
      />

      {/* 7. FAQ */}
      <ServiceFAQ
        faqs={faq}
        schemaId="web-development-faq-schema"
      />

      {/* 8. Final CTA */}
      <ServiceCta
        heading={finalCta.title}
        description={finalCta.description}
        primaryCta={finalCta.cta}
        variant="gradient"
      />
    </main>
  );
}

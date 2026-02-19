import type { Metadata } from 'next';
import Link from 'next/link';
import { Search } from 'lucide-react';

import { createPageMetadata } from '@/lib/metadata';
import { createServiceSchema } from '@/lib/structured-data';
import {
  ServiceHero,
  ServiceNarrativeSection,
  ServiceCta,
} from '@/components/services/individual';
import { Container } from '@/components/ui/container';
import { StructuredData } from '@/components/ui/structured-data';
import { seoContent } from '@/data/seo-content';

export const metadata: Metadata = createPageMetadata({
  title: 'Local Website Optimization & SEO | PixelVerse Studios',
  description:
    "Improve local visibility, clarity, and performance by identifying what's holding your site back and addressing issues affecting search presence.",
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

const serviceSchema = createServiceSchema({
  name: 'Local Website Optimization & SEO',
  serviceType: 'SEO',
  description:
    'For businesses with an existing website that need to be found by the right people in the right places. We improve local visibility, clarity, and performance by identifying what\'s holding a site back.',
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
    finalCta,
  } = seoContent;

  return (
    <main>
      <StructuredData data={serviceSchema} id="seo-services-service-schema" />

      {/* 1. Hero */}
      <ServiceHero
        eyebrow={hero.title}
        title={hero.title}
        description={hero.description.split('\n\n')[0]}
        primaryCta={hero.cta}
        icon={Search}
      />

      {/* 2. Why Businesses Look at Local SEO & Optimization */}
      <ServiceNarrativeSection
        eyebrow="Common Starting Points"
        title={whyBusinessesLook.title}
        intro={whyBusinessesLook.body}
        layout="text-only"
        background="surface"
      />

      {/* 3. Why Local SEO Isn't Just About Rankings */}
      <ServiceNarrativeSection
        eyebrow="The Full Picture"
        title={whyNotJustRankings.title}
        intro={whyNotJustRankings.intro}
        bullets={whyNotJustRankings.bulletPoints}
        closing={whyNotJustRankings.closing}
        layout="text-with-bullets"
        background="bg"
      />

      {/* 4. How We Evaluate What's Holding a Site Back */}
      <ServiceNarrativeSection
        eyebrow="Our Approach"
        title={howWeEvaluate.title}
        intro={howWeEvaluate.intro}
        bullets={howWeEvaluate.bulletPoints}
        closing={howWeEvaluate.closing}
        layout="text-with-bullets"
        background="surface"
      />

      {/* 5. When Local Optimization Is the Right Move */}
      <div className="bg-[var(--pv-bg)]">
        <ServiceNarrativeSection
          eyebrow="Finding the Right Path"
          title={whenOptimizationIsRight.title}
          intro={whenOptimizationIsRight.body}
          layout="text-only"
          background="bg"
        />
        <Container className="pb-12 md:pb-16">
          <Link
            href={whenOptimizationIsRight.crossLink.href}
            className="text-sm font-medium text-[var(--pv-primary)] underline-offset-4 hover:underline"
          >
            {whenOptimizationIsRight.crossLink.label} →
          </Link>
        </Container>
      </div>

      {/* 6. What You Can Expect From Local Optimization Work */}
      <ServiceNarrativeSection
        eyebrow="Practical Outcomes"
        title={whatToExpect.title}
        intro={whatToExpect.intro}
        bullets={whatToExpect.bulletPoints}
        closing={whatToExpect.closing}
        layout="text-with-bullets"
        background="surface"
      />

      {/* 7. Final CTA */}
      <ServiceCta
        heading={finalCta.title}
        description={finalCta.description}
        primaryCta={finalCta.cta}
        variant="gradient"
      />
    </main>
  );
}

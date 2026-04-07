import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

import { AreasWeServeSection } from '@/components/home/areas-we-serve-section';
import { HeroSection } from '@/components/home/hero-section';
import { FinalCtaSection } from '@/components/home/final-cta-section';
import { HomeFaqSection } from '@/components/home/home-faq-section';
import { ProcessSection } from '@/components/home/process-section';
import { ServicesSection } from '@/components/home/services-section';
import { WhySection } from '@/components/home/why-section';
import { StructuredData } from '@/components/ui/structured-data';
import { homepageFaq } from '@/data/homepage-faq';
import { getGoogleRatingBadge, getGoogleRatingData } from '@/lib/api/google-places';
import { createPageMetadata } from '@/lib/metadata';
import {
  createHomepageServiceSchemas,
  createLocalBusinessSchemaWithRating,
} from '@/lib/structured-data';

// Client components — dynamic imports for code-splitting
const CaseStudySection = dynamic(
  () => import('@/components/home/case-study-section').then((m) => m.CaseStudySection),
);
const InsightSection = dynamic(
  () => import('@/components/home/insight-section').then((m) => m.InsightSection),
);
const TestimonialCarousel = dynamic(
  () => import('@/components/home/testimonial-carousel').then((m) => m.TestimonialCarousel),
);

const HOMEPAGE_TITLE = 'Custom Web Design & SEO in New Jersey';

export const metadata: Metadata = {
  ...createPageMetadata({
    title: HOMEPAGE_TITLE,
    description:
      'Custom web design & SEO focused on real business outcomes. We build high-performing websites for New Jersey businesses that rank, convert, and scale.',
    path: '/',
    keywords: [
      'web design New Jersey',
      'custom website development NJ',
      'SEO services New Jersey',
      'conversion-focused web design',
      'performance-first websites',
    ],
  }),
  // Force the full branded title on the homepage. Next.js does not apply the
  // root layout's `title.template` to a page in the same segment (app/page.tsx),
  // so without this override the homepage <title> drops the brand suffix that
  // every other page gets via the template.
  title: {
    absolute: `${HOMEPAGE_TITLE} | PixelVerse Studios`,
  },
};

const homeFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: homepageFaq.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

export default async function Home() {
  const [badge, ratingData] = await Promise.all([
    getGoogleRatingBadge(),
    getGoogleRatingData(),
  ]);

  const localBusinessWithRating = createLocalBusinessSchemaWithRating(ratingData);
  const homepageServiceSchemas = createHomepageServiceSchemas();

  return (
    <>
      <StructuredData id="home-faq-schema" data={homeFaqSchema} />
      {localBusinessWithRating && (
        <StructuredData id="home-local-business-rating" data={localBusinessWithRating} />
      )}
      {homepageServiceSchemas.map((schema) => (
        <StructuredData key={schema['@id']} id={schema['@id']} data={schema} />
      ))}
      <main>
        <HeroSection badge={badge} />
        <WhySection />
        <CaseStudySection />
        <InsightSection />
        <ProcessSection />
        <TestimonialCarousel />
        <AreasWeServeSection />
        <HomeFaqSection />
        <ServicesSection />
        <FinalCtaSection />
      </main>
    </>
  );
}

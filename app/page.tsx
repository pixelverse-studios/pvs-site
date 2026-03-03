import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

import { HeroSection } from '@/components/home/hero-section';
import { WhySection } from '@/components/home/why-section';
import { StructuredData } from '@/components/ui/structured-data';
import { homepageFaq } from '@/data/homepage-faq';
import { getGoogleRatingBadge, getGoogleRatingData } from '@/lib/api/google-places';
import { createPageMetadata } from '@/lib/metadata';
import {
  createHomepageServiceSchemas,
  createLocalBusinessSchemaWithRating,
} from '@/lib/structured-data';

const CaseStudySection = dynamic(
  () => import('@/components/home/case-study-section').then((m) => m.CaseStudySection),
);
const InsightSection = dynamic(
  () => import('@/components/home/insight-section').then((m) => m.InsightSection),
);
const ProcessSection = dynamic(
  () => import('@/components/home/process-section').then((m) => m.ProcessSection),
);
const TestimonialCarousel = dynamic(
  () => import('@/components/home/testimonial-carousel').then((m) => m.TestimonialCarousel),
);
const HomeFaqSection = dynamic(
  () => import('@/components/home/home-faq-section').then((m) => m.HomeFaqSection),
);
const ServicesSection = dynamic(
  () => import('@/components/home/services-section').then((m) => m.ServicesSection),
);
const FinalCtaSection = dynamic(
  () => import('@/components/home/final-cta-section').then((m) => m.FinalCtaSection),
);

export const metadata: Metadata = createPageMetadata({
  title: 'Web Design, Development & SEO Services in New Jersey',
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
});

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
        <HomeFaqSection />
        <ServicesSection />
        <FinalCtaSection />
      </main>
    </>
  );
}

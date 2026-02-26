import type { Metadata } from 'next';

import { HomepageClient } from '@/components/home/homepage-client';
import { StructuredData } from '@/components/ui/structured-data';
import { homepageFaq } from '@/data/homepage-faq';
import { getGoogleRatingBadge, getGoogleRatingData } from '@/lib/api/google-places';
import { createPageMetadata } from '@/lib/metadata';
import {
  createHomepageServiceSchemas,
  createLocalBusinessSchemaWithRating,
} from '@/lib/structured-data';

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
      <HomepageClient badge={badge} />
    </>
  );
}

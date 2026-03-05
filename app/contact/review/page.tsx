import type { Metadata } from 'next';

import { ContactHero } from '@/components/contact/contact-hero';
import { ContactPageClient } from '@/components/contact/contact-page-client';
import { createBreadcrumbSchema } from '@/lib/structured-data';
import { StructuredData } from '@/components/ui/structured-data';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Request a Free Website Review',
  description:
    'Get a free, honest review of your current website. We\'ll evaluate performance, SEO, and user experience — then share what we find.',
  path: '/contact/review',
  keywords: [
    'free website review',
    'website audit',
    'site performance review',
    'seo review',
    'web design consultation nj',
  ],
});

const breadcrumbSchema = createBreadcrumbSchema([
  { name: 'Home', path: '/' },
  { name: 'Contact', path: '/contact/details' },
  { name: 'Website Review', path: '/contact/review' },
]);

export default function ContactReviewPage() {
  return (
    <main>
      <StructuredData id="contact-review-breadcrumb-schema" data={breadcrumbSchema} />
      <ContactHero />
      <ContactPageClient />
    </main>
  );
}

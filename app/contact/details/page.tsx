import type { Metadata } from 'next';

import { ContactHero } from '@/components/contact/contact-hero';
import { ContactPageClient } from '@/components/contact/contact-page-client';
import { createBreadcrumbSchema } from '@/lib/structured-data';
import { StructuredData } from '@/components/ui/structured-data';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Share Your Project Details | Pixelverse Studios',
  description:
    'Tell us about your business and what you\'re working toward. We\'ll review your situation and respond with a clear recommendation.',
  path: '/contact/details',
  keywords: [
    'contact pixelverse studios',
    'web design consultation nj',
    'project inquiry',
    'web design quote',
    'get started',
  ],
});

const breadcrumbSchema = createBreadcrumbSchema([
  { name: 'Home', path: '/' },
  { name: 'Contact', path: '/contact' },
  { name: 'Project Details', path: '/contact/details' },
]);

export default function ContactDetailsPage() {
  return (
    <main>
      <StructuredData id="contact-details-breadcrumb-schema" data={breadcrumbSchema} />
      <ContactHero />
      <ContactPageClient defaultPath="details" />
    </main>
  );
}

import type { Metadata } from 'next';

import { ContactHero } from '@/components/contact/contact-hero';
import { ContactPageClient } from '@/components/contact/contact-page-client';
import { createBreadcrumbSchema } from '@/lib/structured-data';
import { StructuredData } from '@/components/ui/structured-data';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Contact a NJ Web Design Agency | Pixelverse Studios',
  description:
    'Ready to start your project? Get in touch with Pixelverse Studios. We\'ll discuss your goals and help you determine the right path forward.',
  path: '/contact',
  keywords: [
    'contact pixelverse studios',
    'web design consultation nj',
    'schedule strategy call',
    'free website review',
    'web design quote',
  ],
});

const breadcrumbSchema = createBreadcrumbSchema([
  { name: 'Home', path: '/' },
  { name: 'Contact', path: '/contact' },
]);

const contactPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact Pixelverse Studios',
  description:
    'Get in touch with Pixelverse Studios — a New Jersey web design and local SEO agency serving Bergen County businesses.',
  url: 'https://www.pixelversestudios.io/contact',
};

export default function ContactPage() {
  return (
    <main>
      <StructuredData id="contact-breadcrumb-schema" data={breadcrumbSchema} />
      <StructuredData id="contact-page-schema" data={contactPageSchema} />
      <ContactHero />
      <ContactPageClient defaultPath="details" />
    </main>
  );
}

import type { Metadata } from 'next';

import { ContactHero } from '@/components/contact/contact-hero';
import { ContactPageClient } from '@/components/contact/contact-page-client';
import { createBreadcrumbSchema } from '@/lib/structured-data';
import { StructuredData } from '@/components/ui/structured-data';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Schedule a Strategy Call | Pixelverse Studios',
  description:
    'Book a 30-minute strategy call with Pixelverse Studios. We\'ll discuss your goals, your current situation, and what the right next step looks like.',
  path: '/contact/call',
  keywords: [
    'schedule strategy call',
    'web design consultation',
    'free consultation nj',
    'pixelverse strategy call',
    'book a call',
  ],
});

const breadcrumbSchema = createBreadcrumbSchema([
  { name: 'Home', path: '/' },
  { name: 'Contact', path: '/contact' },
  { name: 'Strategy Call', path: '/contact/call' },
]);

export default function ContactCallPage() {
  return (
    <main>
      <StructuredData id="contact-call-breadcrumb-schema" data={breadcrumbSchema} />
      <ContactHero />
      <ContactPageClient defaultPath="call" />
    </main>
  );
}

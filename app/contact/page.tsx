import type { Metadata } from 'next';

import { ContactHero } from '@/components/contact/contact-hero';
import { ContactPageClient } from '@/components/contact/contact-page-client';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Contact Us | PixelVerse Studios',
  description:
    'Reach out to PixelVerse Studios. Share project details, schedule a strategy call, or request a free website review — choose the path that fits your situation.',
  path: '/contact',
  keywords: [
    'contact pixelverse studios',
    'web design consultation nj',
    'schedule strategy call',
    'free website review',
    'web design quote',
  ],
});

export default function ContactPage() {
  return (
    <main>
      <ContactHero />
      <ContactPageClient />
    </main>
  );
}

import type { Metadata } from 'next';

import { ContactHero } from '@/components/contact/contact-hero';
import { ContactPageClient } from '@/components/contact/contact-page-client';
import type { ContactPath } from '@/components/contact/contact-path-selector';
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

const VALID_PATHS = ['details', 'call', 'review'] as const satisfies readonly ContactPath[];

type PageProps = {
  searchParams: Promise<{ path?: string }>;
};

export default async function ContactPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const defaultPath: ContactPath = VALID_PATHS.includes(params.path as ContactPath)
    ? (params.path as ContactPath)
    : 'details';

  return (
    <main>
      <ContactHero />
      <ContactPageClient defaultPath={defaultPath} />
    </main>
  );
}

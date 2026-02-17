import type { Metadata } from 'next';

import { HomepageClient } from '@/components/home/homepage-client';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Intentional Web Design & Development | PixelVerse Studios',
  description:
    'We build custom websites with purpose. No templates. Every project starts with your goals and ends with a site that actually works for your business.',
  path: '/',
  keywords: [
    'intentional web design',
    'custom website development',
    'conversion-focused web design',
    'user journey mapping',
    'performance-first websites',
  ],
});

export default function Home() {
  return <HomepageClient />;
}

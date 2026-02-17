import type { Metadata } from 'next';

import { AboutCtaSection } from '@/components/about/about-cta-section';
import { AboutHeroSection } from '@/components/about/about-hero-section';
import { TeamSection } from '@/components/about/team-section';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'About Pixelverse Studios | Custom Web Design & Development',
  description:
    'Learn more about Pixelverse Studios, a custom web design, development, and SEO studio building thoughtful, reliable websites for New Jersey and national brands.',
  path: '/about',
  keywords: [
    'PixelVerse Studios team',
    'custom-coded websites',
    'UX-first agency',
    'Next.js experts',
    'Bergen County web design',
  ],
});

export default function AboutPage() {
  return (
    <main>
      <AboutHeroSection />
      <TeamSection />
      <AboutCtaSection />
    </main>
  );
}

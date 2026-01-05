import type { Metadata } from 'next';

import { ClosingSection } from '@/components/about/closing-section';
import { IntroSection } from '@/components/about/intro-section';
import { PhilosophySection } from '@/components/about/philosophy-section';
import { TeamSection } from '@/components/about/team-section';
import { WhyCustomSection } from '@/components/about/why-custom-section';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'About Us | UX-First Web Design Team',
  description:
    'Learn how PixelVerse blends UX, development, and analytics to ship custom websites with measurable outcomes for Bergen County and national brands.',
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
      <IntroSection />
      <WhyCustomSection />
      <PhilosophySection />
      <TeamSection />
      <ClosingSection />
    </main>
  );
}

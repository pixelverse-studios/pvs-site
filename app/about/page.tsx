import type { Metadata } from 'next';

import { ClosingSection } from '@/components/about/closing-section';
import { IntroSection } from '@/components/about/intro-section';
import { PhilosophySection } from '@/components/about/philosophy-section';
import { TeamSection } from '@/components/about/team-section';
import { WhyCustomSection } from '@/components/about/why-custom-section';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'About PixelVerse Studios',
  description:
    'Discover the philosophy behind PixelVerse Studios: custom-coded builds, UX-first collaboration, and a team committed to measurable results.',
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

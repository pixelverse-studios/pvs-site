import type { Metadata } from 'next';

import { PortfolioClosingCtaSection } from '@/components/portfolio/portfolio-closing-cta';
import { PortfolioIntroSection } from '@/components/portfolio/portfolio-intro-section';
import { PortfolioTrustSection } from '@/components/portfolio/trust-section';
import { ProjectShowcaseSection } from '@/components/portfolio/project-showcase-section';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'PixelVerse Portfolio | Custom Web Design Results',
  description:
    'Browse PixelVerse client launches featuring custom-coded web design, UX strategy, and SEO outcomes across key service industries.',
  path: '/portfolio',
  keywords: [
    'PixelVerse portfolio',
    'web design case studies',
    'custom development results',
    'UX strategy work',
    'Bergen County portfolio',
  ],
});

export default function PortfolioPage() {
  return (
    <main>
      <PortfolioIntroSection />
      <ProjectShowcaseSection />
      <PortfolioClosingCtaSection />
    </main>
  );
}

import type { Metadata } from 'next';

import { PortfolioClosingCtaSection } from '@/components/portfolio/portfolio-closing-cta';
import { PortfolioIntroSection } from '@/components/portfolio/portfolio-intro-section';
import { ProjectShowcaseSection } from '@/components/portfolio/project-showcase-section';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Portfolio & Case Studies | Pixelverse Studios',
  description:
    "Explore our web design, development, and SEO case studies. See how we've helped New Jersey businesses improve search visibility, conversions, and growth.",
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

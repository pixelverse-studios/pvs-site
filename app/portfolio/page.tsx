import type { Metadata } from 'next';

import { PortfolioClosingCtaSection } from '@/components/portfolio/portfolio-closing-cta';
import { PortfolioIntroSection } from '@/components/portfolio/portfolio-intro-section';
import { PortfolioTrustSection } from '@/components/portfolio/trust-section';
import { ProjectShowcaseSection } from '@/components/portfolio/project-showcase-section';

export const metadata: Metadata = {
  title: 'Portfolio | PixelVerse Studios',
  description:
    'Explore PixelVerse Studios client work across industries, highlighting growth-focused web design, UX strategy, and custom development results.',
};

export default function PortfolioPage() {
  return (
    <main>
      <PortfolioIntroSection />
      <ProjectShowcaseSection />
      <PortfolioClosingCtaSection />
    </main>
  );
}

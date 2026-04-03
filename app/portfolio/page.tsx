import type { Metadata } from 'next';

import { PortfolioClosingCtaSection } from '@/components/portfolio/portfolio-closing-cta';
import { PortfolioIntroSection } from '@/components/portfolio/portfolio-intro-section';
import { ProjectShowcaseSection } from '@/components/portfolio/project-showcase-section';
import { StructuredData } from '@/components/ui/structured-data';
import { createPageMetadata } from '@/lib/metadata';
import { createBreadcrumbSchema } from '@/lib/structured-data';

export const metadata: Metadata = createPageMetadata({
  title: 'NJ Web Design Portfolio & Case Studies',
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

const breadcrumbSchema = createBreadcrumbSchema([
  { name: 'Home', path: '/' },
  { name: 'Portfolio', path: '/portfolio' },
]);

export default function PortfolioPage() {
  return (
    <main>
      <StructuredData data={breadcrumbSchema} id="portfolio-breadcrumb-schema" />
      <PortfolioIntroSection />
      <ProjectShowcaseSection />
      <PortfolioClosingCtaSection />
    </main>
  );
}

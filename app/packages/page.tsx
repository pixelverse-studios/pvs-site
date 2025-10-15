import type { Metadata } from 'next';

import { AddonsSection } from '@/components/packages/addons-section';
import { PackagesClosingCtaSection } from '@/components/packages/packages-closing-cta';
import { PackagesIntroSection } from '@/components/packages/packages-intro-section';
import { RetentionIncentivesSection } from '@/components/packages/retention-incentives-section';
import { SeoPackagesSection } from '@/components/packages/seo-packages-section';
import { TrustTransparencySection } from '@/components/packages/trust-transparency-section';
import { WebsitePackagesSection } from '@/components/packages/website-packages-section';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Packages & Pricing | PixelVerse Studios',
  description:
    'Discover PixelVerse Studios website and SEO packages, add-ons, and retention incentives designed to scale with your business.',
  path: '/packages',
  keywords: [
    'web design pricing',
    'SEO packages',
    'PixelVerse Studios pricing',
    'website add-ons',
    'digital retention incentives',
  ],
});

export default function PackagesPage() {
  return (
    <main>
      <PackagesIntroSection />
      <WebsitePackagesSection />
      <SeoPackagesSection />
      <AddonsSection />
      <RetentionIncentivesSection />
      <TrustTransparencySection />
      <PackagesClosingCtaSection />
    </main>
  );
}

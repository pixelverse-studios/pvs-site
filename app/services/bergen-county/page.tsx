import type { Metadata } from 'next';

import { CityServicesCtaSection } from '@/components/services/city/city-services-cta-section';
import { CityServicesFaqSection } from '@/components/services/city/city-services-faq-section';
import { CityServicesHero } from '@/components/services/city/city-services-hero';
import { CityServicesHighlights } from '@/components/services/city/city-services-highlights';
import { CityServicesProofSection } from '@/components/services/city/city-services-proof-section';
import { ServicesClosingCtaSection } from '@/components/services/services-closing-cta';
import { ServicesCoreSection } from '@/components/services/services-core-section';
import { ServicesIntroSection } from '@/components/services/services-intro-section';
import { ServicesProcessSection } from '@/components/services/services-process-section';
import { BergenTownsSection } from '@/components/bergen/bergen-towns-section';
import { bergenCountyPage } from '@/data/bergen-county-page';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: bergenCountyPage.metadata.title,
  description: bergenCountyPage.metadata.description,
  path: '/services/bergen-county',
  keywords: bergenCountyPage.metadata.keywords,
});

export default function BergenCountyPage() {
  const page = bergenCountyPage;

  return (
    <main>
      <CityServicesHero hero={page.hero} />
      <CityServicesCtaSection cta={page.cta} />
      <ServicesIntroSection headingLevel="h2" />
      <ServicesCoreSection />
      <CityServicesHighlights city={page.city} highlights={page.serviceHighlights} />
      <ServicesProcessSection />
      <BergenTownsSection />
      <CityServicesProofSection proof={page.proof} city={page.city} />
      <CityServicesFaqSection city={page.city} faq={page.faq} />
      <ServicesClosingCtaSection contactHref="/contact/bergen-county" />
    </main>
  );
}

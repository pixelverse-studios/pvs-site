import { Container } from '@/components/ui/container';
import { getSeoOverview } from '@/lib/api/seo';
import { SeoOverviewPageClient } from './components/seo-overview-page-client';
import type { SeoOverviewResponse } from '@/lib/api/seo';

export const metadata = {
  title: 'SEO Health | Dashboard | PixelVerse Studios',
  description: 'SEO health overview across all websites',
  robots: { index: false, follow: false },
};

export default async function SeoOverviewPage() {
  let seoData: SeoOverviewResponse = { total: 0, websites: [] };

  try {
    seoData = await getSeoOverview();
  } catch (error) {
    console.error('Error fetching SEO overview:', error);
  }

  return (
    <main className="pb-16 pt-6 lg:pt-8">
      <Container className="max-w-7xl">
        <SeoOverviewPageClient data={seoData} />
      </Container>
    </main>
  );
}

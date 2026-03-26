import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Container } from '@/components/ui/container';
import { getWebsiteSeo, getWebsiteSeoAudits } from '@/lib/api/seo';
import { SeoDetailClient } from './components/seo-detail-client';
import type { WebsiteSeoResponse, AuditHistoryResponse } from '@/lib/api/seo';

export const metadata = {
  title: 'SEO Detail | Dashboard | PixelVerse Studios',
  description: 'Detailed SEO health data for a website.',
  robots: { index: false, follow: false },
};

export default async function SeoDetailPage({
  params,
}: {
  params: Promise<{ websiteId: string }>;
}) {
  const { websiteId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const [seoData, auditHistory] = await Promise.all([
    getWebsiteSeo(websiteId).catch(() => null as WebsiteSeoResponse | null),
    getWebsiteSeoAudits(websiteId, { limit: 12 }).catch(
      () => null as AuditHistoryResponse | null,
    ),
  ]);

  return (
    <main className="pb-16 pt-8 md:pb-24">
      <Container className="max-w-6xl">
        <SeoDetailClient seoData={seoData} auditHistory={auditHistory} />
      </Container>
    </main>
  );
}

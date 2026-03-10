import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCampaigns } from '@/lib/api/email-campaigns';
import type { Campaign } from '@/lib/types/email-campaign';
import { CampaignsPageClient } from './components/campaigns-page-client';

export const metadata = {
  title: 'Campaigns | Domani | Dashboard | PixelVerse Studios',
  description: 'Email campaign history for Domani app users',
  robots: { index: false, follow: false },
};

export default async function CampaignsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  let campaigns: Campaign[] = [];
  let total = 0;
  let loadError = false;

  try {
    const response = await getCampaigns({ limit: 20, offset: 0 });
    campaigns = response.campaigns;
    total = response.total;
  } catch {
    loadError = true;
  }

  return <CampaignsPageClient initialCampaigns={campaigns} initialTotal={total} initialLoadError={loadError} />;
}

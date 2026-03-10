import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCampaigns } from '@/lib/api/email-campaigns';
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

  const { campaigns, total } = await getCampaigns({ limit: 20, offset: 0 }).catch(() => ({
    campaigns: [],
    total: 0,
  }));

  return <CampaignsPageClient initialCampaigns={campaigns} initialTotal={total} />;
}

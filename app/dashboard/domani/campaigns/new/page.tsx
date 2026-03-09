import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getDomaniUsers } from '@/lib/api/domani-users';
import { ComposePageClient } from './components/compose-page-client';

export const metadata = {
  title: 'New Campaign | Domani | Dashboard | PixelVerse Studios',
  description: 'Compose and send an email campaign to Domani users',
  robots: { index: false, follow: false },
};

export default async function NewCampaignPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  let items: Awaited<ReturnType<typeof getDomaniUsers>>['items'] = [];
  let total = 0;
  let loadError = false;

  try {
    const response = await getDomaniUsers({
      limit: 50,
      offset: 0,
      include_deleted: false,
    });
    items = response.items;
    total = response.total;
  } catch {
    loadError = true;
  }

  return (
    <ComposePageClient
      initialUsers={items}
      initialTotal={total}
      senderEmail={user.email ?? ''}
      initialLoadError={loadError}
    />
  );
}

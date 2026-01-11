import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getWaitlistEntries } from '@/lib/api/waitlist';
import { WaitlistPageClient } from './components/waitlist-page-client';

export const metadata = {
  title: 'Waitlist | Domani | Dashboard | PixelVerse Studios',
  description: 'View pre-launch waitlist signups for Domani',
};

export default async function WaitlistPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Fetch initial waitlist entries with pagination
  const { items, total } = await getWaitlistEntries({ limit: 50, offset: 0 }).catch(() => ({
    items: [],
    total: 0,
  }));

  return <WaitlistPageClient initialItems={items} initialTotal={total} />;
}

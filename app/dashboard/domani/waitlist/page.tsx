import { getWaitlistEntries } from '@/lib/api/waitlist';
import { WaitlistPageClient } from './components/waitlist-page-client';

export const metadata = {
  title: 'Waitlist | Domani | Dashboard',
  description: 'View pre-launch waitlist signups for Domani',
  robots: { index: false, follow: false },
};

export default async function WaitlistPage() {
  // Fetch initial waitlist entries with pagination
  const { items, total } = await getWaitlistEntries({ limit: 50, offset: 0 }).catch(() => ({
    items: [],
    total: 0,
  }));

  return <WaitlistPageClient initialItems={items} initialTotal={total} />;
}

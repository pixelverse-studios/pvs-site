import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getFeedbackItems } from '@/lib/api/feedback';
import { getWaitlistEntries } from '@/lib/api/waitlist';
import { getDomaniUsers } from '@/lib/api/domani-users';
import { OverviewPageClient } from './components/overview-page-client';

export const metadata = {
  title: 'Domani | Dashboard | PixelVerse Studios',
  description: 'Overview of Domani app analytics and user data',
  robots: { index: false, follow: false },
};

export default async function DomaniOverviewPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Fetch all data in parallel
  const [feedbackResult, waitlistResult, usersResult] = await Promise.all([
    getFeedbackItems({ limit: 100 }).catch(() => ({ items: [] })),
    getWaitlistEntries({ limit: 100 }).catch(() => ({ items: [], total: 0 })),
    getDomaniUsers({ limit: 100, include_deleted: true }).catch(() => ({ items: [], total: 0 })),
  ]);

  // Calculate stats
  const stats = {
    feedback: {
      total: feedbackResult.items.length,
      new: feedbackResult.items.filter((item) => item.status === 'new').length,
    },
    waitlist: {
      total: waitlistResult.items.length,
    },
    users: {
      total: usersResult.items.length,
      active: usersResult.items.filter((item) => !item.deleted_at).length,
    },
  };

  return <OverviewPageClient stats={stats} />;
}

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getFeedbackItems } from '@/lib/api/feedback';
import { FeedbackPageClient } from './components/feedback-page-client';

export const metadata = {
  title: 'Feedback | Domani | Dashboard | PixelVerse Studios',
  description: 'Manage feedback and support requests from Domani app users',
  robots: { index: false, follow: false },
};

export default async function FeedbackPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Fetch initial feedback items with pagination
  const { items, total } = await getFeedbackItems({ limit: 50, offset: 0 }).catch(() => ({
    items: [],
    total: 0,
  }));

  return <FeedbackPageClient initialItems={items} initialTotal={total} />;
}

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getFeedbackItems } from '@/lib/api/feedback';
import { FeedbackPageClient } from './components/feedback-page-client';

export const metadata = {
  title: 'Feedback | Domani | Dashboard | PixelVerse Studios',
  description: 'Manage feedback and support requests from Domani app users',
};

export default async function FeedbackPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Fetch all feedback items
  const { items } = await getFeedbackItems({ limit: 100 }).catch(() => ({
    items: [],
  }));

  return <FeedbackPageClient initialItems={items} />;
}

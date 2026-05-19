import { getFeedbackItems } from '@/lib/api/feedback';
import { FeedbackPageClient } from './components/feedback-page-client';

export const metadata = {
  title: 'Feedback | Domani | Dashboard',
  description: 'Manage feedback and support requests from Domani app users',
  robots: { index: false, follow: false },
};

export default async function FeedbackPage() {
  // Fetch initial feedback items with pagination
  const { items, total } = await getFeedbackItems({ limit: 50, offset: 0 }).catch(() => ({
    items: [],
    total: 0,
  }));

  return <FeedbackPageClient initialItems={items} initialTotal={total} />;
}

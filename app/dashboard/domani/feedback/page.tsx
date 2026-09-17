import { getServerFeedbackItems } from '@/lib/api/feedback-server';
import { FeedbackPageClient } from './components/feedback-page-client';

export const metadata = {
  title: 'Feedback | Domani | Dashboard',
  description: 'Manage feedback and support requests from Domani app users',
  robots: { index: false, follow: false },
};

export default async function FeedbackPage() {
  try {
    const response = await getServerFeedbackItems({ limit: 50, offset: 0 });
    return <FeedbackPageClient initialData={response} />;
  } catch (error) {
    return (
      <FeedbackPageClient
        initialError={error instanceof Error ? error.message : 'Feedback service unavailable.'}
      />
    );
  }
}

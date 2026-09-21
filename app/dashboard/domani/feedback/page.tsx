import React from 'react';
import { getServerFeedbackItems } from '@/lib/api/feedback-server';
import { FeedbackPageClient } from './components/feedback-page-client';
import { z } from 'zod';

export const metadata = {
  title: 'Feedback | Domani | Dashboard',
  description: 'Manage feedback and support requests from Domani app users',
  robots: { index: false, follow: false },
};

export default async function FeedbackPage({
  searchParams,
}: {
  searchParams: Promise<{ user_id?: string | string[] }>;
}) {
  const params = await searchParams;
  const parsed = z.string().uuid().optional().safeParse(params.user_id);
  if (!parsed.success)
    return (
      <div role="alert">
        Invalid user link.{' '}
        <a href="/dashboard/domani/feedback" className="underline">
          Open all feedback
        </a>
      </div>
    );
  const userId = parsed.data?.toLowerCase();
  try {
    const response = await getServerFeedbackItems({ limit: 50, offset: 0, user_id: userId });
    return <FeedbackPageClient key={userId || 'all'} initialData={response} userId={userId} />;
  } catch (error) {
    return (
      <FeedbackPageClient
        key={userId || 'all'}
        userId={userId}
        initialError={error instanceof Error ? error.message : 'Feedback service unavailable.'}
      />
    );
  }
}

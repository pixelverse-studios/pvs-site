import { Suspense } from 'react';
import { DomaniPageLoading } from './components/domani-page-loading';
import { getServerFeedbackStats } from '@/lib/api/feedback-server';
import { getWaitlistEntries } from '@/lib/api/waitlist';
import { getServerDomaniUserStats } from '@/lib/api/domani-users-server';
import { OverviewPageClient } from './components/overview-page-client';

export const metadata = {
  title: 'Domani | Dashboard',
  description: 'Overview of Domani app analytics and user data',
  robots: { index: false, follow: false },
};

export default function DomaniOverviewPage() {
  return (
    <Suspense fallback={<DomaniPageLoading title="Overview" />}>
      <OverviewContent />
    </Suspense>
  );
}

async function OverviewContent() {
  // Fetch all data in parallel
  const [feedbackResult, waitlistResult, usersResult] = await Promise.all([
    getServerFeedbackStats().catch(() => null),
    getWaitlistEntries({ limit: 100 }).catch(() => ({ items: [], total: 0 })),
    getServerDomaniUserStats().catch(() => null),
  ]);

  // Calculate stats
  const stats = {
    feedback: {
      total: feedbackResult?.total ?? 0,
      new: feedbackResult?.by_status.new ?? 0,
    },
    waitlist: {
      total: waitlistResult.items.length,
    },
    users: {
      total: usersResult?.total ?? 0,
      active: usersResult?.active_30d ?? 0,
      activityUnknown: usersResult?.activity_unknown ?? 0,
    },
  };

  return (
    <OverviewPageClient
      stats={stats}
      feedbackUnavailable={!feedbackResult}
      usersUnavailable={!usersResult}
    />
  );
}

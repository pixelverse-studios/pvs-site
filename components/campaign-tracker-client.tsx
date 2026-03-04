'use client';

import dynamic from 'next/dynamic';

const CampaignTrackerDynamic = dynamic(
  () =>
    import('@/components/campaign-tracker').then((module) => ({
      default: module.CampaignTracker,
    })),
  {
    ssr: false,
    loading: () => null,
  },
);

export function CampaignTrackerClient() {
  return <CampaignTrackerDynamic />;
}

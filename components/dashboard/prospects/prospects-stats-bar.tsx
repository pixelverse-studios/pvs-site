'use client';

import { Users, FileText, Search, Calendar, Loader2 } from 'lucide-react';
import { StatCard } from '@/components/dashboard/stat-card';
import type { ProspectStats } from './types';

interface ProspectsStatsBarProps {
  stats: ProspectStats | null;
  loading: boolean;
  error?: boolean;
}

export function ProspectsStatsBar({ stats, loading, error }: ProspectsStatsBarProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-[140px] animate-pulse rounded-2xl border border-[var(--pv-border)] bg-[var(--pv-surface)]"
          />
        ))}
      </div>
    );
  }

  const total = stats?.total ?? 0;
  const detailsForm = stats?.by_source?.details_form ?? 0;
  const reviewRequest = stats?.by_source?.review_request ?? 0;
  const calendlyCall = stats?.by_source?.calendly_call ?? 0;

  return (
    <div>
      {error && (
        <p className="mb-4 text-sm text-red-500">Could not load stats — showing cached data.</p>
      )}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard
        title="Total Prospects"
        value={total}
        subtitle="All inbound leads"
        iconName="users"
        accentColor="var(--pv-primary)"
      />
      <StatCard
        title="Details Form"
        value={detailsForm}
        subtitle="Project inquiries"
        iconName="fileText"
        accentColor="#3b82f6"
      />
      <StatCard
        title="Review Requests"
        value={reviewRequest}
        subtitle="Website audits"
        iconName="trendingUp"
        accentColor="#a855f7"
      />
      <StatCard
        title="Calendly Calls"
        value={calendlyCall}
        subtitle="Strategy calls booked"
        iconName="activity"
        accentColor="#10b981"
      />
      </div>
    </div>
  );
}

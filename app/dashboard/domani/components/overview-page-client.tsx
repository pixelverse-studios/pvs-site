'use client';

import { MessageSquare, Users, UserCircle } from 'lucide-react';
import { StatCard } from './stat-card';

interface OverviewStats {
  feedback: {
    total: number;
    new: number;
  };
  waitlist: {
    total: number;
  };
  users: {
    total: number;
    active: number;
  };
}

interface OverviewPageClientProps {
  stats: OverviewStats;
}

export function OverviewPageClient({ stats }: OverviewPageClientProps) {
  return (
    <>
      {/* Stat Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Feedback & Support"
          count={stats.feedback.total}
          subCount={stats.feedback.new}
          subLabel="new"
          href="/dashboard/domani/feedback"
          icon={MessageSquare}
          gradient="linear-gradient(135deg, #f59e0b, #d97706)"
        />
        <StatCard
          title="Waitlist Signups"
          count={stats.waitlist.total}
          href="/dashboard/domani/waitlist"
          icon={Users}
          gradient="linear-gradient(135deg, #10b981, #059669)"
        />
        <StatCard
          title="Active Users"
          count={stats.users.active}
          subCount={stats.users.total - stats.users.active}
          subLabel="deleted"
          href="/dashboard/domani/users"
          icon={UserCircle}
          gradient="linear-gradient(135deg, #8b5cf6, #7c3aed)"
        />
      </div>

      {/* Quick Links Section */}
      <div className="mt-12">
        <h2
          className="mb-4 text-lg font-semibold"
          style={{ color: 'var(--pv-text)' }}
        >
          Quick Links
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <QuickLink
            href="/dashboard/domani/feedback"
            title="View All Feedback"
            description="See bug reports, feature requests, and support tickets"
          />
          <QuickLink
            href="/dashboard/domani/waitlist"
            title="Manage Waitlist"
            description="View and manage pre-launch signups"
          />
          <QuickLink
            href="/dashboard/domani/users"
            title="User Directory"
            description="Browse all registered users by tier and cohort"
          />
        </div>
      </div>
    </>
  );
}

function QuickLink({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <a
      href={href}
      className="group rounded-lg border p-4 transition-all duration-200 hover:border-[var(--pv-primary)] hover:shadow-md"
      style={{
        borderColor: 'var(--pv-border)',
        background: 'var(--pv-bg)',
      }}
    >
      <p
        className="font-medium transition-colors group-hover:text-[var(--pv-primary)]"
        style={{ color: 'var(--pv-text)' }}
      >
        {title}
      </p>
      <p className="mt-1 text-sm text-[var(--pv-text-muted)]">{description}</p>
    </a>
  );
}

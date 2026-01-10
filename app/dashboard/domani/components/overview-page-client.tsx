'use client';

import { Smartphone, MessageSquare, Users, UserCircle } from 'lucide-react';
import { Container } from '@/components/ui/container';
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
    <main className="pb-16 pt-6 lg:pt-8">
      <Container className="max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              }}
            >
              <Smartphone className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1
                className="font-heading text-2xl font-bold md:text-3xl"
                style={{ color: 'var(--pv-text)' }}
              >
                Domani
              </h1>
              <p className="text-sm text-[var(--pv-text-muted)]">
                Overview of your app analytics and user data
              </p>
            </div>
          </div>
        </div>

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
      </Container>
    </main>
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

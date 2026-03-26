import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Container } from '@/components/ui/container';
import { StatCard } from '@/components/dashboard/stat-card';
import { DashboardCard } from '@/components/dashboard/dashboard-card';
import { AgendaWidgetWrapper } from '@/components/dashboard/agenda-widget-wrapper';
import { getActiveAgendaItems, getPendingAgendaCount } from '@/lib/api/agenda';
import { getClients } from '@/lib/api/clients';
import { getSeoOverview } from '@/lib/api/seo';
import type { ClientListItem as ClientData } from '@/lib/types/client';
import type { SeoOverviewResponse } from '@/lib/api/seo';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const metadata = {
  title: 'Dashboard | PixelVerse Studios',
  description: 'Your PixelVerse Studios dashboard',
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const [clientsResponse, agendaData, pendingCount, seoOverview] = await Promise.all([
    getClients().catch(() => ({ clients: [] as ClientData[], total: 0, limit: 50, offset: 0 })),
    getActiveAgendaItems(8).catch(() => ({ items: [], total: 0 })),
    getPendingAgendaCount().catch(() => 0),
    getSeoOverview().catch(() => ({ total: 0, websites: [] }) as SeoOverviewResponse),
  ]);

  const clients = clientsResponse.clients;

  const totalClients = clientsResponse.total;
  const activeClients = clients.filter((c) => c.client_active === true).length;
  const totalWebsites = clients.reduce((acc, c) => acc + (c.website_count || 0), 0);
  const totalDeployments = clients.reduce((acc, c) => acc + (c.deployment_count_30d || 0), 0);

  // SEO stats for the stat card
  const auditedSites = seoOverview.websites.filter((w) => w.seo_score !== null).length;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = user.user_metadata?.full_name?.split(' ')[0] || 'there';

  return (
    <main className="pb-16 pt-6 lg:pt-8">
      <Container className="max-w-7xl">
        <div className="space-y-8">
          {/* Welcome Header */}
          <div className="space-y-1">
            <h1
              className="font-heading text-2xl font-bold md:text-3xl"
              style={{ color: 'var(--pv-text)' }}
            >
              {getGreeting()}, {firstName}
            </h1>
            <p className="text-sm" style={{ color: 'var(--pv-text-muted)' }}>
              Here&apos;s what&apos;s happening with your studio today.
            </p>
          </div>

          {/* Stats Grid — Clickable widgets */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Clients"
              value={totalClients}
              subtitle={`${activeClients} active`}
              iconName="users"
              accentColor="#3b82f6"
              href="/dashboard/clients"
            />
            <StatCard
              title="Websites"
              value={totalWebsites}
              subtitle="Managed sites"
              iconName="globe"
              accentColor="var(--pv-primary)"
              href="/dashboard/websites"
            />
            <StatCard
              title="Recent Deploys"
              value={totalDeployments}
              subtitle="Last 30 days"
              iconName="rocket"
              accentColor="#10b981"
              href="/dashboard/deployments"
            />
            <StatCard
              title="SEO Health"
              value={auditedSites}
              subtitle={`of ${seoOverview.total} sites audited`}
              iconName="trendingUp"
              accentColor="#8b5cf6"
              href="/dashboard/seo"
            />
          </div>

          {/* SEO Overview Table + Agenda Widget */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* SEO Overview Table - Takes 2 columns */}
            <div className="lg:col-span-2">
              <DashboardCard
                title="SEO Health"
                subtitle="All websites at a glance"
                iconName="trendingUp"
                headerAction={{
                  label: 'View all',
                  href: '/dashboard/seo',
                }}
                noPadding
              >
                {seoOverview.websites.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <p className="text-sm text-[var(--pv-text-muted)]">
                      No websites found. SEO data will appear here after running an audit.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[var(--pv-border)] bg-[var(--pv-surface)]">
                          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--pv-text-muted)]">
                            Website
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--pv-text-muted)]">
                            Score
                          </th>
                          <th className="hidden px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--pv-text-muted)] sm:table-cell">
                            Checklist
                          </th>
                          <th className="hidden px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--pv-text-muted)] md:table-cell">
                            Keywords
                          </th>
                          <th className="hidden px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--pv-text-muted)] lg:table-cell">
                            Last Audit
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--pv-border)]">
                        {seoOverview.websites.map((website) => (
                          <tr
                            key={website.website_id}
                            className="transition-colors hover:bg-[var(--pv-surface)]"
                          >
                            <td className="px-4 py-3">
                              <div>
                                <p className="text-sm font-medium text-[var(--pv-text)]">
                                  {website.website_title}
                                </p>
                                <p className="text-xs text-[var(--pv-text-muted)]">
                                  {website.client_name}
                                </p>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              {website.seo_score !== null ? (
                                <div className="inline-flex items-center gap-1.5">
                                  <ScoreBadge
                                    score={website.seo_score}
                                    grade={website.seo_grade}
                                  />
                                  <TrendIndicator
                                    trend={website.score_trend}
                                    delta={website.score_delta}
                                  />
                                </div>
                              ) : (
                                <span className="text-xs text-[var(--pv-text-muted)]">—</span>
                              )}
                            </td>
                            <td className="hidden px-4 py-3 text-center sm:table-cell">
                              {website.checklist_pct !== null ? (
                                <span className="text-sm text-[var(--pv-text)]">
                                  {website.checklist_pct}%
                                </span>
                              ) : (
                                <span className="text-xs text-[var(--pv-text-muted)]">—</span>
                              )}
                            </td>
                            <td className="hidden px-4 py-3 text-center md:table-cell">
                              {website.keywords_tracked > 0 ? (
                                <span className="text-sm text-[var(--pv-text)]">
                                  {website.keywords_ranking}/{website.keywords_tracked}
                                </span>
                              ) : (
                                <span className="text-xs text-[var(--pv-text-muted)]">—</span>
                              )}
                            </td>
                            <td className="hidden px-4 py-3 text-right lg:table-cell">
                              {website.last_audit_date ? (
                                <span className="text-xs text-[var(--pv-text-muted)]">
                                  {new Date(website.last_audit_date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                </span>
                              ) : (
                                <span className="text-xs text-[var(--pv-text-muted)]">Never</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </DashboardCard>
            </div>

            {/* Focus/Agenda Widget - Takes 1 column */}
            <div className="space-y-6">
              <DashboardCard
                title="Focus"
                subtitle="Priority items"
                iconName="zap"
                headerAction={{
                  label: 'View all',
                  href: '/dashboard/agenda',
                }}
                noPadding
                contentClassName="px-2 py-2"
              >
                <AgendaWidgetWrapper initialItems={agendaData.items} />
              </DashboardCard>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}

function ScoreBadge({
  score,
  grade,
}: {
  score: number;
  grade: string | null;
}) {
  const color =
    score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold"
      style={{
        background: `${color}15`,
        color: color,
        border: `1px solid ${color}30`,
      }}
    >
      {score}
      {grade && <span className="opacity-60">{grade}</span>}
    </span>
  );
}

function TrendIndicator({
  trend,
  delta,
}: {
  trend: 'up' | 'down' | 'stable' | null;
  delta: number | null;
}) {
  if (!trend || delta === null) return null;

  if (trend === 'up') {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs text-emerald-500">
        <TrendingUp className="h-3 w-3" />+{delta}
      </span>
    );
  }

  if (trend === 'down') {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs text-red-500">
        <TrendingDown className="h-3 w-3" />{delta}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-0.5 text-xs text-[var(--pv-text-muted)]">
      <Minus className="h-3 w-3" />
    </span>
  );
}

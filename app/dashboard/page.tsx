import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Container } from '@/components/ui/container';
import { DashboardCard } from '@/components/dashboard/dashboard-card';
import { AgendaWidgetWrapper } from '@/components/dashboard/agenda-widget-wrapper';
import { getActiveAgendaItems } from '@/lib/api/agenda';
import { getClients } from '@/lib/api/clients';
import { getSeoOverview } from '@/lib/api/seo';
import { getApiBaseUrl } from '@/lib/api-config';
import type { ClientListItem as ClientData } from '@/lib/types/client';
import { getClientDisplayName } from '@/lib/types/client';
import type { SeoOverviewResponse, SeoOverviewWebsite } from '@/lib/api/seo';
import { STATUS_LABELS as PROJECT_STATUS_LABELS, STATUS_COLORS as PROJECT_STATUS_COLORS } from '@/lib/types/project';
import type { ProjectStatus } from '@/lib/types/project';
import type { Prospect, ProspectSource } from '@/components/dashboard/prospects/types';
import { SOURCE_LABELS, STATUS_COLORS } from '@/components/dashboard/prospects/types';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  Globe,
  Rocket,
  AlertTriangle,
  ArrowRight,
  UserSearch,
} from 'lucide-react';

export const metadata = {
  title: 'Dashboard',
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

  const [clientsResponse, agendaData, seoOverview, prospectsData] = await Promise.all([
    getClients().catch(() => ({ clients: [] as ClientData[], total: 0, limit: 50, offset: 0 })),
    getActiveAgendaItems(8).catch(() => ({ items: [], total: 0 })),
    getSeoOverview().catch(() => ({ total: 0, websites: [] }) as SeoOverviewResponse),
    fetch(`${getApiBaseUrl()}/api/prospects?limit=5&sort=first_seen&order=desc`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : { prospects: [], total: 0 }))
      .catch(() => ({ prospects: [] as Prospect[], total: 0 })),
  ]);

  const clients = clientsResponse.clients;

  const totalClients = clientsResponse.total;
  const activeClients = clients.filter((c) => c.client_active === true).length;
  const totalWebsites = clients.reduce((acc, c) => acc + (c.website_count || 0), 0);
  const totalDeployments = clients.reduce((acc, c) => acc + (c.deployment_count_30d || 0), 0);

  // Filter SEO overview to active websites only (deployed/maintenance)
  const activeSeoWebsites = seoOverview.websites.filter((w) =>
    ['deployed', 'maintenance'].includes((w.project_status || '').toLowerCase()),
  );
  const auditedSites = activeSeoWebsites.filter((w) => w.seo_score !== null).length;

  // Compute alerts
  const alerts = buildAlerts(activeSeoWebsites);

  // Flatten recent deployments across all clients, sorted newest first
  const recentDeploys = clients
    .flatMap((client) =>
      client.recent_deployments.map((d) => ({
        ...d,
        client_id: client.client_id,
        client_name:
          client.company_name ||
          [client.firstname, client.lastname].filter(Boolean).join(' ') ||
          'Unknown',
      })),
    )
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const prospects: Prospect[] = prospectsData.prospects || [];
  const newProspects = prospects.filter((p) => (p.status || '') === 'new');

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
        <div className="space-y-6">
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

          {/* Status Bar */}
          <div
            className="overflow-hidden rounded-xl border"
            style={{ borderColor: 'var(--pv-border)', background: 'var(--pv-surface)' }}
          >
            {/* Metrics Strip */}
            <div className="flex flex-wrap items-center gap-x-0 divide-x divide-[var(--pv-border)]">
              <StatusMetric
                href="/dashboard/clients"
                icon={<Users className="h-3.5 w-3.5" />}
                value={activeClients}
                label="active clients"
                total={totalClients}
              />
              <StatusMetric
                href="/dashboard/websites"
                icon={<Globe className="h-3.5 w-3.5" />}
                value={totalWebsites}
                label="websites"
              />
              <StatusMetric
                href="/dashboard/deployments"
                icon={<Rocket className="h-3.5 w-3.5" />}
                value={totalDeployments}
                label="deploys"
                suffix="30d"
              />
              <StatusMetric
                href="/dashboard/seo"
                icon={<TrendingUp className="h-3.5 w-3.5" />}
                value={auditedSites}
                label="audited"
                total={activeSeoWebsites.length}
              />
            </div>

            {/* Alerts Strip */}
            {alerts.length > 0 && (
              <div
                className="flex flex-wrap items-center gap-3 border-t px-4 py-2.5"
                style={{ borderColor: 'var(--pv-border)' }}
              >
                {alerts.map((alert, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 text-xs"
                    style={{ color: alert.color }}
                  >
                    {alert.icon}
                    {alert.text}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Row 1: SEO Health + Agenda */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <DashboardCard
                title="SEO Health"
                subtitle="Active websites"
                iconName="trendingUp"
                headerAction={{
                  label: 'View all',
                  href: '/dashboard/seo',
                }}
                noPadding
              >
                {activeSeoWebsites.length === 0 ? (
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
                        {activeSeoWebsites.map((website) => (
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

            {/* Right Column — Agenda only */}
            <DashboardCard
              title="Focus"
              subtitle="Priority items"
              iconName="zap"
              headerAction={{
                label: 'View all',
                href: '/dashboard/agenda',
              }}
              noPadding
              contentClassName="px-2 py-2 max-h-[320px] overflow-y-auto"
            >
              <AgendaWidgetWrapper initialItems={agendaData.items} />
            </DashboardCard>
          </div>

          {/* Row 2: Clients + Prospects + Deploys */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Clients */}
            <DashboardCard
              title="Clients"
              subtitle={`${activeClients} active`}
              iconName="users"
              headerAction={{
                label: 'View all',
                href: '/dashboard/clients',
              }}
              noPadding
            >
              {clients.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <p className="text-xs text-[var(--pv-text-muted)]">No clients yet</p>
                </div>
              ) : (
                <div className="max-h-[240px] divide-y divide-[var(--pv-border)] overflow-y-auto">
                  {clients
                    .filter((c) => c.client_active === true)
                    .map((client) => {
                      const name = getClientDisplayName(client);
                      const topWebsite = client.websites[0];
                      const statusColor = topWebsite
                        ? PROJECT_STATUS_COLORS[topWebsite.status as ProjectStatus] || '#6b7280'
                        : '#6b7280';
                      const statusLabel = topWebsite
                        ? PROJECT_STATUS_LABELS[topWebsite.status as ProjectStatus] || topWebsite.status
                        : 'No website';

                      return (
                        <Link
                          key={client.client_id}
                          href={`/dashboard/clients/${client.client_id}`}
                          className="group flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-[var(--pv-surface)]"
                        >
                          <div
                            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-[10px] font-semibold"
                            style={{
                              background: `${statusColor}15`,
                              color: statusColor,
                              border: `1px solid ${statusColor}25`,
                            }}
                          >
                            {name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-[var(--pv-text)]">
                              {name}
                            </p>
                            <p className="text-[10px] text-[var(--pv-text-muted)]">
                              {client.website_count} site{client.website_count !== 1 ? 's' : ''}
                              {topWebsite && <span className="ml-1 opacity-60">{statusLabel}</span>}
                            </p>
                          </div>
                          {client.deployment_count_30d > 0 && (
                            <span className="flex-shrink-0 text-[10px] tabular-nums text-[var(--pv-text-muted)]">
                              {client.deployment_count_30d} deploys
                            </span>
                          )}
                        </Link>
                      );
                    })}
                </div>
              )}
            </DashboardCard>

            {/* Recent Deploys */}
            <DashboardCard
              title="Recent Deploys"
              subtitle="Last 30 days"
              iconName="rocket"
              headerAction={{
                label: 'View all',
                href: '/dashboard/deployments',
              }}
              noPadding
            >
              {recentDeploys.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <p className="text-xs text-[var(--pv-text-muted)]">No recent deployments</p>
                </div>
              ) : (
                <div className="max-h-[240px] divide-y divide-[var(--pv-border)] overflow-y-auto">
                  {recentDeploys.map((deploy) => {
                    const statusColor =
                      deploy.indexing_status === 'indexed'
                        ? '#22c55e'
                        : deploy.indexing_status === 'requested'
                          ? '#3b82f6'
                          : '#f59e0b';
                    const timeAgo = getRelativeTime(deploy.created_at);

                    return (
                      <Link
                        key={deploy.deployment_id}
                        href={`/dashboard/deployments/${deploy.deployment_id}`}
                        className="group flex items-start gap-3 px-4 py-2.5 transition-colors hover:bg-[var(--pv-surface)]"
                      >
                        <div
                          className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full"
                          style={{ background: statusColor }}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-[var(--pv-text)] line-clamp-1">
                            {deploy.website_title}
                          </p>
                          <p className="mt-0.5 text-[11px] text-[var(--pv-text-muted)] line-clamp-1">
                            {deploy.deploy_summary || 'No summary'}
                          </p>
                        </div>
                        <span className="flex-shrink-0 text-[10px] tabular-nums text-[var(--pv-text-muted)]">
                          {timeAgo}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </DashboardCard>

            {/* Prospects */}
            <DashboardCard
              title="Prospects"
              subtitle={newProspects.length > 0 ? `${newProspects.length} new` : 'Recent leads'}
              iconName="users"
              headerAction={{
                label: 'View all',
                href: '/dashboard/prospects',
              }}
              noPadding
            >
              {prospects.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <p className="text-xs text-[var(--pv-text-muted)]">No prospects yet</p>
                </div>
              ) : (
                <div className="max-h-[240px] divide-y divide-[var(--pv-border)] overflow-y-auto">
                  {prospects.map((prospect) => {
                    const statusStyle = STATUS_COLORS[(prospect.status || 'new') as keyof typeof STATUS_COLORS] || STATUS_COLORS.new;
                    const timeAgo = getRelativeTime(prospect.first_seen);

                    return (
                      <Link
                        key={prospect.id}
                        href="/dashboard/prospects"
                        className="group flex items-center gap-2.5 px-4 py-2.5 transition-colors hover:bg-[var(--pv-surface)]"
                      >
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} border`}>
                          {(prospect.status || 'new').charAt(0).toUpperCase() + (prospect.status || 'new').slice(1)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-[var(--pv-text)]">
                            {prospect.name}
                          </p>
                          <p className="text-[10px] text-[var(--pv-text-muted)]">
                            {SOURCE_LABELS[(prospect.source || 'details_form') as ProspectSource] || prospect.source}
                          </p>
                        </div>
                        <span className="flex-shrink-0 text-[10px] tabular-nums text-[var(--pv-text-muted)]">
                          {timeAgo}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </DashboardCard>
          </div>
        </div>
      </Container>
    </main>
  );
}

// ============================================================================
// Status Bar Components
// ============================================================================

function StatusMetric({
  href,
  icon,
  value,
  label,
  total,
  suffix,
}: {
  href: string;
  icon: React.ReactNode;
  value: number;
  label: string;
  total?: number;
  suffix?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-1 items-center gap-3 px-4 py-3 transition-colors hover:bg-[var(--pv-bg)]"
      style={{ minWidth: '140px' }}
    >
      <span className="text-[var(--pv-text-muted)] transition-colors group-hover:text-[var(--pv-primary)]">
        {icon}
      </span>
      <div className="flex items-baseline gap-1.5">
        <span className="font-heading text-xl font-bold tabular-nums" style={{ color: 'var(--pv-text)' }}>
          {value}
        </span>
        {total !== undefined && (
          <span className="text-xs tabular-nums text-[var(--pv-text-muted)]">/{total}</span>
        )}
        <span className="text-[11px] text-[var(--pv-text-muted)]">
          {label}
          {suffix && <span className="ml-0.5 opacity-60">({suffix})</span>}
        </span>
      </div>
      <ArrowRight className="ml-auto h-3 w-3 text-[var(--pv-text-muted)] opacity-0 transition-opacity group-hover:opacity-100" />
    </Link>
  );
}

interface Alert {
  text: string;
  color: string;
  icon: React.ReactNode;
}

function getRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays === 1) return '1d';
  if (diffDays < 7) return `${diffDays}d`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function buildAlerts(websites: SeoOverviewWebsite[]): Alert[] {
  const alerts: Alert[] = [];

  // Overdue audits
  const overdue = websites.filter(
    (w) => w.next_audit_due && new Date(w.next_audit_due) < new Date(),
  );
  if (overdue.length > 0) {
    alerts.push({
      text: `${overdue.length} site${overdue.length > 1 ? 's' : ''} overdue for audit`,
      color: '#ef4444',
      icon: <AlertTriangle className="h-3 w-3" />,
    });
  }

  // Sites with score drops
  const declining = websites.filter(
    (w) => w.score_trend === 'down' && w.score_delta !== null,
  );
  for (const site of declining) {
    alerts.push({
      text: `${(site.website_title || '').split(' ')[0]}: ${site.score_delta}`,
      color: '#ef4444',
      icon: <TrendingDown className="h-3 w-3" />,
    });
  }

  // Sites with score gains
  const improving = websites.filter(
    (w) => w.score_trend === 'up' && w.score_delta !== null,
  );
  for (const site of improving) {
    alerts.push({
      text: `${(site.website_title || '').split(' ')[0]}: +${site.score_delta}`,
      color: '#22c55e',
      icon: <TrendingUp className="h-3 w-3" />,
    });
  }

  // Sites never audited
  const neverAudited = websites.filter((w) => w.seo_score === null);
  if (neverAudited.length > 0) {
    alerts.push({
      text: `${neverAudited.length} site${neverAudited.length > 1 ? 's' : ''} never audited`,
      color: 'var(--pv-text-muted)',
      icon: <Minus className="h-3 w-3" />,
    });
  }

  return alerts;
}

// ============================================================================
// SEO Table Components
// ============================================================================

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

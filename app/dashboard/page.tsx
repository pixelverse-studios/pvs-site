import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getApiBaseUrl } from '@/lib/api-config';
import { Container } from '@/components/ui/container';
import { StatCard } from '@/components/dashboard/stat-card';
import { DashboardCard } from '@/components/dashboard/dashboard-card';
import { ActivityFeed, ActivityItem } from '@/components/dashboard/activity-feed';
import { AgendaWidget } from '@/components/dashboard/agenda-widget';
import { ClientListItem } from '@/components/dashboard/client-list-item';
import { getActiveAgendaItems, getPendingAgendaCount } from '@/lib/api/agenda';

export const metadata = {
  title: 'Dashboard | PixelVerse Studios',
  description: 'Your PixelVerse Studios dashboard',
};

interface Website {
  website_id: string;
  website_title: string;
  domain: string;
}

interface Deployment {
  deployment_id: string;
  website_id: string;
  website_title: string;
  deploy_summary: string;
  indexing_status: 'pending' | 'requested' | 'indexed';
  created_at: string;
}

interface Client {
  client_id: string;
  firstname: string;
  lastname: string;
  client_email: string | null;
  client_active: boolean | null;
  website_count: number;
  websites: Website[];
  recent_deployments: Deployment[];
  deployment_count_30d: number;
}

async function getClients(): Promise<Client[]> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/clients`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    if (!response.ok) return [];
    return await response.json();
  } catch {
    return [];
  }
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch clients and agenda data in parallel
  const [clients, agendaData, pendingCount] = await Promise.all([
    getClients(),
    getActiveAgendaItems(8).catch(() => ({ items: [], total: 0 })),
    getPendingAgendaCount().catch(() => 0),
  ]);

  // Calculate stats
  const totalClients = clients.length;
  const activeClients = clients.filter((c) => c.client_active === true).length;
  const totalWebsites = clients.reduce((acc, c) => acc + (c.website_count || 0), 0);
  const totalDeployments = clients.reduce((acc, c) => acc + (c.deployment_count_30d || 0), 0);

  // Gather all recent deployments from all clients, sort by date
  const allDeployments = clients
    .flatMap((c) => c.recent_deployments || [])
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // Build activity feed
  const activities: ActivityItem[] = allDeployments.slice(0, 5).map((d) => ({
    id: d.deployment_id,
    type: 'deployment' as const,
    title: 'New Deployment',
    description: d.deploy_summary?.split('\n')[0]?.replace(/^-\s*/, '') || 'Deployment pushed',
    timestamp: d.created_at,
    href: `/dashboard/deployments/${d.deployment_id}`,
    meta: {
      websiteName: d.website_title || 'Website',
    },
  }));

  // Get greeting based on time
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

          {/* Stats Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Clients"
              value={totalClients}
              subtitle={`${activeClients} active`}
              iconName="users"
              accentColor="#3b82f6"
            />
            <StatCard
              title="Websites"
              value={totalWebsites}
              subtitle="Managed sites"
              iconName="folderKanban"
              accentColor="var(--pv-primary)"
            />
            <StatCard
              title="Recent Deploys"
              value={totalDeployments}
              subtitle="Last 30 days"
              iconName="rocket"
              accentColor="#10b981"
            />
            <StatCard
              title="Pending Items"
              value={pendingCount}
              subtitle={pendingCount === 0 ? 'All caught up!' : `${pendingCount} to do`}
              iconName="zap"
              accentColor="#f59e0b"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Activity Feed - Takes 2 columns */}
            <div className="lg:col-span-2">
              <DashboardCard
                title="Recent Activity"
                subtitle="Latest deployments and updates"
                iconName="activity"
                headerAction={{
                  label: 'View all',
                  href: '/dashboard/clients',
                }}
                noPadding
                contentClassName="px-2 py-2"
              >
                <ActivityFeed
                  activities={activities}
                  maxItems={5}
                  emptyMessage="No recent activity"
                />
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
                <AgendaWidget items={agendaData.items} />
              </DashboardCard>
            </div>
          </div>

          {/* Recent Clients */}
          {clients.length > 0 && (
            <DashboardCard
              title="Recent Clients"
              subtitle={`${totalClients} total clients`}
              iconName="users"
              headerAction={{
                label: 'View all',
                href: '/dashboard/clients',
              }}
              noPadding
              contentClassName="divide-y divide-[var(--pv-border)]"
            >
              <div className="px-3 py-2">
                {clients.slice(0, 5).map((client) => {
                  const fullName =
                    [client.firstname, client.lastname].filter(Boolean).join(' ') || 'Unknown';
                  return (
                    <ClientListItem
                      key={client.client_id}
                      id={client.client_id}
                      name={fullName}
                      email={client.client_email || ''}
                      status={client.client_active ? 'active' : 'inactive'}
                      websiteCount={client.website_count}
                    />
                  );
                })}
              </div>
            </DashboardCard>
          )}
        </div>
      </Container>
    </main>
  );
}

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Container } from '@/components/ui/container';
import { getClients } from '@/lib/api/clients';
import { getClientDisplayName } from '@/lib/types/client';
import { DeploymentsPageClient } from './components/deployments-page-client';
import type { ClientListItem } from '@/lib/types/client';
import type { IndexingStatus } from '@/lib/types/deployment';

export const metadata = {
  title: 'Deployments | Dashboard | PixelVerse Studios',
  description: 'Recent deployments across all websites',
  robots: { index: false, follow: false },
};

export interface FlattenedDeployment {
  deployment_id: string;
  website_id: string;
  website_title: string;
  client_id: string;
  client_name: string;
  deploy_summary: string;
  indexing_status: IndexingStatus;
  created_at: string;
}

function flattenDeployments(clients: ClientListItem[]): FlattenedDeployment[] {
  const deployments: FlattenedDeployment[] = [];

  for (const client of clients) {
    const clientName = getClientDisplayName(client);

    for (const deployment of client.recent_deployments) {
      deployments.push({
        deployment_id: deployment.deployment_id,
        website_id: deployment.website_id,
        website_title: deployment.website_title,
        client_id: client.client_id,
        client_name: clientName,
        deploy_summary: deployment.deploy_summary,
        indexing_status: deployment.indexing_status as IndexingStatus,
        created_at: deployment.created_at,
      });
    }
  }

  // Sort newest first
  deployments.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  return deployments;
}

export default async function DeploymentsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  let deployments: FlattenedDeployment[] = [];

  try {
    const { clients } = await getClients({ limit: 100 });
    deployments = flattenDeployments(clients);
  } catch (error) {
    console.error('Error fetching deployments:', error);
  }

  return (
    <main className="pb-16 pt-6 lg:pt-8">
      <Container className="max-w-7xl">
        <DeploymentsPageClient deployments={deployments} />
      </Container>
    </main>
  );
}

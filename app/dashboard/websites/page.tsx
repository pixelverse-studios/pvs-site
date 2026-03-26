import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Container } from '@/components/ui/container';
import { getClients } from '@/lib/api/clients';
import { WebsitesPageClient } from './components/websites-page-client';
import type { ClientListItem } from '@/lib/types/client';

export const metadata = {
  title: 'Websites | Dashboard | PixelVerse Studios',
  description: 'All managed websites across clients',
  robots: { index: false, follow: false },
};

export interface FlattenedWebsite {
  website_id: string;
  website_title: string;
  domain: string;
  status: string;
  priority: number;
  client_id: string;
  client_name: string;
  client_active: boolean | null;
  recent_deploy_count: number;
  last_deploy_date: string | null;
}

function flattenWebsites(clients: ClientListItem[]): FlattenedWebsite[] {
  const websites: FlattenedWebsite[] = [];

  for (const client of clients) {
    const clientName =
      client.company_name ||
      [client.firstname, client.lastname].filter(Boolean).join(' ') ||
      'Unknown';

    for (const website of client.websites) {
      // Find deployments for this specific website
      const websiteDeployments = client.recent_deployments.filter(
        (d) => d.website_id === website.website_id,
      );

      websites.push({
        website_id: website.website_id,
        website_title: website.website_title,
        domain: website.domain,
        status: website.status,
        priority: website.priority,
        client_id: client.client_id,
        client_name: clientName,
        client_active: client.client_active,
        recent_deploy_count: websiteDeployments.length,
        last_deploy_date:
          websiteDeployments.length > 0
            ? websiteDeployments.sort(
                (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
              )[0].created_at
            : null,
      });
    }
  }

  return websites;
}

export default async function WebsitesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  let websites: FlattenedWebsite[] = [];

  try {
    const { clients } = await getClients({ limit: 100 });
    websites = flattenWebsites(clients);
  } catch (error) {
    console.error('Error fetching websites:', error);
  }

  return (
    <main className="pb-16 pt-6 lg:pt-8">
      <Container className="max-w-7xl">
        <WebsitesPageClient websites={websites} />
      </Container>
    </main>
  );
}

import { redirect } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { ClientsPageClient } from './components/clients-page-client';
import { getClients } from '@/lib/api/clients';
import type { ClientListItem, Client } from '@/lib/types/client';
import type { Project, WebsiteProject } from '@/lib/types/project';

export const metadata = {
  title: 'Clients | Dashboard',
  description: 'Manage your clients',
  robots: { index: false, follow: false },
};

const DEFAULT_LIMIT = 20;

interface PageProps {
  searchParams: Promise<{ page?: string; limit?: string }>;
}

function mapClientListItemsToClients(clientListItems: ClientListItem[]): Client[] {
  return clientListItems.map((client) => ({
    id: client.client_id,
    client: client.company_name ?? undefined,
    client_slug: '',
    company_name: client.company_name,
    firstname: client.firstname,
    lastname: client.lastname,
    email: client.client_email,
    phone: null,
    active: client.client_active === true,
    cms: null,
    created_at: '',
    updated_at: null,
    websites: client.websites.map((website) => ({
      id: website.website_id,
      title: website.website_title,
      website_slug: '',
      domain: website.domain,
      type: '',
      status: website.status,
      priority: website.priority,
    })),
  }));
}

function mapClientListItemsToProjects(clientListItems: ClientListItem[]): Project[] {
  return clientListItems.flatMap((client) =>
    client.websites.map(
      (website): WebsiteProject => ({
        id: website.website_id,
        title: website.website_title,
        status: website.status,
        priority: website.priority,
        created_at: '',
        updated_at: null,
        type: 'website',
        domain: website.domain,
        website_slug: '',
        websiteType: '',
        client_id: client.client_id,
      }),
    ),
  );
}

export default async function ClientsPage({ searchParams }: PageProps) {
  // Parse pagination params
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || '1', 10) || 1);
  const limit = Math.min(
    100,
    Math.max(1, parseInt(params.limit || String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT),
  );
  const offset = (page - 1) * limit;

  // Fetch data in parallel
  let clientListItems: Awaited<ReturnType<typeof getClients>>['clients'] = [];
  let total = 0;
  let clients: Client[] = [];
  let projects: Project[] = [];

  try {
    const [listResponse, boardResponse] = await Promise.all([
      getClients({ limit, offset }),
      getClients({ limit: 100 }),
    ]);

    clientListItems = listResponse.clients;
    total = listResponse.total;
    clients = mapClientListItemsToClients(boardResponse.clients);
    projects = mapClientListItemsToProjects(boardResponse.clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
  }

  const totalPages = Math.ceil(total / limit);

  // Redirect to last valid page if current page is too high
  if (page > totalPages && totalPages > 0) {
    redirect(
      `/dashboard/clients?page=${totalPages}${limit !== DEFAULT_LIMIT ? `&limit=${limit}` : ''}`,
    );
  }

  return (
    <main className="pb-16 pt-6 lg:pt-8">
      <Container className="max-w-7xl">
        <ClientsPageClient
          clientListItems={clientListItems}
          currentPage={page}
          totalPages={totalPages}
          total={total}
          limit={limit}
          clients={clients}
          projects={projects}
        />
      </Container>
    </main>
  );
}

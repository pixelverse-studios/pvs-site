import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Container } from '@/components/ui/container';
import { ClientsPageClient } from './components/clients-page-client';
import { getClients, getAllClientsWithWebsites } from '@/lib/api/clients';
import type { Project, WebsiteProject } from '@/lib/types/project';

export const metadata = {
  title: 'Clients | Dashboard | PixelVerse Studios',
  description: 'Manage your clients',
  robots: { index: false, follow: false },
};

const DEFAULT_LIMIT = 20;

interface PageProps {
  searchParams: Promise<{ page?: string; limit?: string }>;
}

export default async function ClientsPage({ searchParams }: PageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

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
  let clients: Awaited<ReturnType<typeof getAllClientsWithWebsites>> = [];
  let projects: Project[] = [];

  try {
    // Fetch paginated client list (for table view) and full clients (for board view) in parallel
    const [listResponse, fullClients] = await Promise.all([
      getClients({ limit, offset }),
      getAllClientsWithWebsites(),
    ]);

    clientListItems = listResponse.clients;
    total = listResponse.total;
    clients = fullClients;

    // Flatten websites into projects
    projects = fullClients.flatMap((client) =>
      (client.websites || []).map(
        (website): WebsiteProject => ({
          id: website.id,
          title: website.title,
          status: website.status,
          priority: website.priority,
          created_at: new Date().toISOString(),
          updated_at: null,
          type: 'website',
          domain: website.domain,
          website_slug: website.website_slug,
          websiteType: website.type,
          seo_focus: website.seo_focus,
          client_id: client.id,
        }),
      ),
    );
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

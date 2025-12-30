import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Container } from '@/components/ui/container';
import { ClientsTable } from './components/clients-table';
import { Pagination } from './components/pagination';
import { getClients } from '@/lib/api/clients';
import { Users } from 'lucide-react';

export const metadata = {
  title: 'Clients | Dashboard | PixelVerse Studios',
  description: 'Manage your clients',
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
  const limit = Math.min(100, Math.max(1, parseInt(params.limit || String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT));
  const offset = (page - 1) * limit;

  // Fetch paginated clients
  let clients: Awaited<ReturnType<typeof getClients>>['clients'] = [];
  let total = 0;
  let activeCount = 0;

  try {
    const response = await getClients({ limit, offset });
    clients = response.clients;
    total = response.total;
    activeCount = clients.filter((c) => c.client_active === true).length;
  } catch (error) {
    console.error('Error fetching clients:', error);
  }

  const totalPages = Math.ceil(total / limit);

  // Redirect to last valid page if current page is too high
  if (page > totalPages && totalPages > 0) {
    redirect(`/dashboard/clients?page=${totalPages}${limit !== DEFAULT_LIMIT ? `&limit=${limit}` : ''}`);
  }

  return (
    <main className="pb-16 pt-6 lg:pt-8">
      <Container className="max-w-7xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.05))',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                }}
              >
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h1
                  className="font-heading text-2xl font-bold md:text-3xl"
                  style={{ color: 'var(--pv-text)' }}
                >
                  Clients
                </h1>
                <p className="text-sm" style={{ color: 'var(--pv-text-muted)' }}>
                  {total} total &middot; {activeCount} active on this page
                </p>
              </div>
            </div>
          </div>

          {/* Clients Table */}
          <ClientsTable clients={clients} />

          {/* Pagination */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            total={total}
            limit={limit}
          />
        </div>
      </Container>
    </main>
  );
}

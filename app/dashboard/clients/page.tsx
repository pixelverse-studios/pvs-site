import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Container } from '@/components/ui/container';
import { ClientsTable } from './components/clients-table';
import { getApiBaseUrl } from '@/lib/api-config';
import { Users } from 'lucide-react';

export const metadata = {
  title: 'Clients | Dashboard | PixelVerse Studios',
  description: 'Manage your clients',
};

const API_BASE_URL = getApiBaseUrl();

export default async function ClientsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  let clients = [];
  try {
    const response = await fetch(`${API_BASE_URL}/api/clients`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch clients: ${response.status} ${response.statusText}`);
    }
    clients = await response.json();
  } catch (error) {
    console.error('Error fetching clients:', error);
  }

  const activeCount = clients.filter((c: { client_active: boolean | null }) => c.client_active === true).length;

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
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.05))',
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
                  {clients.length} total &middot; {activeCount} active
                </p>
              </div>
            </div>
          </div>

          {/* Clients Table */}
          <ClientsTable clients={clients} />
        </div>
      </Container>
    </main>
  );
}

import { redirect, notFound } from 'next/navigation';
import { createClient as createSupabaseClient } from '@/lib/supabase/server';
import { Container } from '@/components/ui/container';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ClientInfoSidebar } from './components/client-info-sidebar';
import { ClientActions } from './components/client-actions';
import { WebsitesList } from './components/websites-list';
import { getClient } from '@/lib/api/clients';

export const metadata = {
  title: 'Client Details | Dashboard | PixelVerse Studios',
  description: 'View and manage client websites',
  robots: { index: false, follow: false },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ClientDetailPage({ params }: PageProps) {
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If not logged in, redirect to login
  if (!user) {
    redirect('/login');
  }

  // Fetch client from API
  const { id } = await params;
  let client;
  try {
    client = await getClient(id);
  } catch (error) {
    console.error('Error fetching client:', error);
    notFound();
  }

  if (!client) {
    notFound();
  }

  // Format dates in server component
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formattedCreatedAt = formatDate(client.created_at);
  const formattedUpdatedAt = client.updated_at ? formatDate(client.updated_at) : 'Never';

  return (
    <main className="pb-16 pt-6 lg:pt-8">
      <Container className="max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/dashboard/clients"
            className="group flex items-center gap-2 text-sm transition-colors"
            style={{ color: 'var(--pv-text-muted)' }}
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="font-medium group-hover:text-[var(--pv-text)]">Back to Clients</span>
          </Link>

          <ClientActions client={client} />
        </div>

        {/* Main Layout: Sidebar + Content */}
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          {/* Sticky Sidebar - Client Info */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <ClientInfoSidebar
              client={client}
              formattedCreatedAt={formattedCreatedAt}
              formattedUpdatedAt={formattedUpdatedAt}
            />
          </div>

          {/* Main Content - Websites */}
          <WebsitesList websites={client.websites} clientId={id} />
        </div>
      </Container>
    </main>
  );
}

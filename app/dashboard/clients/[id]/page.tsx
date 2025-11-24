import { redirect, notFound } from 'next/navigation';
import { createClient as createSupabaseClient } from '@/lib/supabase/server';
import { Container } from '@/components/ui/container';
import Link from 'next/link';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ClientInfoSidebar } from './components/client-info-sidebar';
import { WebsitesList } from './components/websites-list';

export const metadata = {
  title: 'Client Details | Dashboard | PixelVerse Studios',
  description: 'View and manage client websites',
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';

interface Website {
  id: string;
  type: string;
  title: string;
  domain: string;
  website_slug: string;
}

interface Client {
  id: string;
  firstname: string | null;
  lastname: string | null;
  email: string | null;
  phone: string | null;
  active: boolean | null;
  created_at: string;
  updated_at: string | null;
  websites?: Website[];
}

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If not logged in, redirect to login
  if (!user) {
    redirect('/login');
  }

  // Fetch client from API
  let client: Client | null = null;
  try {
    const response = await fetch(`${API_BASE_URL}/api/clients/${params.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (response.ok) {
      client = await response.json();
    } else if (response.status === 404) {
      notFound();
    } else {
      throw new Error(`Failed to fetch client: ${response.status}`);
    }
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
    <main className="pb-16 pt-hero md:pb-24">
      <Container className="max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/dashboard/clients"
            className="flex items-center gap-2 text-[var(--pv-text-muted)] transition-colors hover:text-[var(--pv-text)]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Clients</span>
          </Link>

          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Website
          </Button>
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
          <WebsitesList websites={client.websites} clientId={params.id} />
        </div>
      </Container>
    </main>
  );
}

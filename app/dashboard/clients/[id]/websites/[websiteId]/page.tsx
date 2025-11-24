import { redirect, notFound } from 'next/navigation';
import { createClient as createSupabaseClient } from '@/lib/supabase/server';
import { WebsiteDetailView } from './components/website-detail-view';
import { getApiBaseUrl } from '@/lib/api-config';

export const metadata = {
  title: 'Website Details | Dashboard | PixelVerse Studios',
  description: 'View website analytics and information',
};

const API_BASE_URL = getApiBaseUrl();

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

export default async function WebsiteDetailPage({
  params,
}: {
  params: { id: string; websiteId: string };
}) {
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If not logged in, redirect to login
  if (!user) {
    redirect('/login');
  }

  // Fetch client from API (which includes websites)
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

  // Find the specific website
  const website = client.websites?.find((w) => w.id === params.websiteId);

  if (!website) {
    notFound();
  }

  return <WebsiteDetailView website={website} client={client} />;
}

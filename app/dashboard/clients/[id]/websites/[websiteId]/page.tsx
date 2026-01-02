import { redirect, notFound } from 'next/navigation';
import { createClient as createSupabaseClient } from '@/lib/supabase/server';
import { WebsiteDetailView } from './components/website-detail-view';
import { getClient } from '@/lib/api/clients';
import type { Client } from '@/lib/types/client';

export const metadata = {
  title: 'Website Details | Dashboard | PixelVerse Studios',
  description: 'View website analytics and information',
};

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
  let client: Client;
  try {
    client = await getClient(params.id);
  } catch (error) {
    console.error('Error fetching client:', error);
    notFound();
  }

  // Find the specific website
  const website = client.websites?.find((w) => w.id === params.websiteId);

  if (!website) {
    notFound();
  }

  return <WebsiteDetailView website={website} client={client} />;
}

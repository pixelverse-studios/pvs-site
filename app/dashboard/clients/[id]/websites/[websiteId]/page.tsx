import { notFound } from 'next/navigation';
import { WebsiteDetailView } from './components/website-detail-view';
import { getClient } from '@/lib/api/clients';
import type { Client } from '@/lib/types/client';

export const metadata = {
  title: 'Website Details | Dashboard',
  description: 'View website analytics and information',
  robots: { index: false, follow: false },
};

export default async function WebsiteDetailPage({
  params,
}: {
  params: Promise<{ id: string; websiteId: string }>;
}) {
  const { id, websiteId } = await params;
  // Fetch client from API (which includes websites)
  let client: Client;
  try {
    client = await getClient(id);
  } catch (error) {
    console.error('Error fetching client:', error);
    notFound();
  }

  // Find the specific website
  const website = client.websites?.find((w) => w.id === websiteId);

  if (!website) {
    notFound();
  }

  return <WebsiteDetailView website={website} client={client} />;
}

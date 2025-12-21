import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getApiBaseUrl } from '@/lib/api-config';
import { DeploymentDetailView } from './components/deployment-detail-view';
import { DeploymentDetail } from './types';

export const metadata = {
  title: 'Deployment Details | Dashboard | PixelVerse Studios',
  description: 'View deployment details and indexing status',
};

export default async function DeploymentDetailPage({ params }: { params: { id: string } }) {
  // Check authentication
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch deployment from API
  let deployment: DeploymentDetail | null = null;

  try {
    const response = await fetch(`${getApiBaseUrl()}/api/deployments/${params.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (response.ok) {
      deployment = await response.json();
    } else if (response.status === 404) {
      notFound();
    } else if (response.status === 400) {
      // Invalid UUID format
      notFound();
    } else {
      throw new Error(`Failed to fetch deployment: ${response.status}`);
    }
  } catch (error) {
    console.error('Error fetching deployment:', error);
    notFound();
  }

  if (!deployment) {
    notFound();
  }

  return <DeploymentDetailView deployment={deployment} />;
}

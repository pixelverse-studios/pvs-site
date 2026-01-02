import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getDeployment } from '@/lib/api/deployments';
import { DeploymentDetailView } from './components/deployment-detail-view';
import type { DeploymentDetail } from '@/lib/types/deployment';

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
  let deployment: DeploymentDetail;

  try {
    deployment = await getDeployment(params.id);
  } catch (error) {
    console.error('Error fetching deployment:', error);
    notFound();
  }

  return <DeploymentDetailView deployment={deployment} />;
}

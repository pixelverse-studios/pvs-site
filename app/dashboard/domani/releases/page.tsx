import { ReleasesPageClient } from './components/releases-page-client';
import { getServerReleases } from '@/lib/api/admin-releases-server';

export const metadata = {
  title: 'Domani Releases | Dashboard',
  description: 'Plan and publish Domani releases.',
  robots: { index: false, follow: false },
};

export default async function ReleasesPage() {
  try {
    const response = await getServerReleases();
    return <ReleasesPageClient initialData={response.data} />;
  } catch (error) {
    return (
      <ReleasesPageClient
        initialError={error instanceof Error ? error.message : 'Failed to load releases.'}
      />
    );
  }
}

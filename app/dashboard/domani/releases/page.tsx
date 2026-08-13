import { ReleasesPageClient } from './components/releases-page-client';

export const metadata = {
  title: 'Domani Releases | Dashboard',
  description: 'Plan and publish Domani releases.',
  robots: { index: false, follow: false },
};

export default function ReleasesPage() {
  return <ReleasesPageClient />;
}

import { ReleaseEditor } from '../components/release-editor';

export const metadata = {
  title: 'Domani Release Detail | Dashboard',
  robots: { index: false, follow: false },
};

export default async function ReleaseDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ releaseId: string }>;
  searchParams: Promise<{ archived?: string }>;
}) {
  const { releaseId } = await params;
  const { archived } = await searchParams;
  return <ReleaseEditor releaseId={releaseId} includeArchived={archived === 'true'} />;
}

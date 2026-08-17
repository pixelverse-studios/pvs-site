import { ConversionReviewPage } from '../../../components/conversion-review-page';

export const metadata = {
  title: 'Review Domani Release Source | Dashboard',
  robots: { index: false, follow: false },
};

export default async function ReleaseSourceReviewPage({
  params,
}: {
  params: Promise<{ releaseId: string; sourceId: string }>;
}) {
  const { releaseId, sourceId } = await params;
  return <ConversionReviewPage releaseId={releaseId} sourceId={sourceId} />;
}

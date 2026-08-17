import { ReleaseEditor } from '../components/release-editor';

export const metadata = {
  title: 'New Domani Release | Dashboard',
  robots: { index: false, follow: false },
};

export default function NewReleasePage() {
  return <ReleaseEditor />;
}

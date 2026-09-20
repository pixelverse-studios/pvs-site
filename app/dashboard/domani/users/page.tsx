import { UsersPageClient } from './components/users-page-client';

export const metadata = {
  title: 'Users | Domani | Dashboard',
  description: 'View active Domani app users',
  robots: { index: false, follow: false },
};

export default function UsersPage() {
  return <UsersPageClient />;
}

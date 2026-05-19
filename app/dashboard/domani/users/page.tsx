import { getDomaniUsers } from '@/lib/api/domani-users';
import { UsersPageClient } from './components/users-page-client';

export const metadata = {
  title: 'Users | Domani | Dashboard',
  description: 'View active Domani app users',
  robots: { index: false, follow: false },
};

export default async function UsersPage() {
  // Fetch initial users with pagination (exclude deleted by default)
  const { items, total } = await getDomaniUsers({ limit: 50, offset: 0, include_deleted: false }).catch(() => ({
    items: [],
    total: 0,
  }));

  return <UsersPageClient initialItems={items} initialTotal={total} />;
}

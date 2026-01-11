import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getDomaniUsers } from '@/lib/api/domani-users';
import { UsersPageClient } from './components/users-page-client';

export const metadata = {
  title: 'Users | Domani | Dashboard | PixelVerse Studios',
  description: 'View active Domani app users',
};

export default async function UsersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Fetch initial users with pagination (exclude deleted by default)
  const { items, total } = await getDomaniUsers({ limit: 50, offset: 0, include_deleted: false }).catch(() => ({
    items: [],
    total: 0,
  }));

  return <UsersPageClient initialItems={items} initialTotal={total} />;
}

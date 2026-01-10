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

  // Fetch all users (including deleted for admin view)
  const { items } = await getDomaniUsers({ limit: 100, include_deleted: true }).catch(() => ({
    items: [],
  }));

  return <UsersPageClient initialItems={items} />;
}

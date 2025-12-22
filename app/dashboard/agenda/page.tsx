import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getAgendaItems } from '@/lib/api/agenda';
import { AgendaPageClient } from './components/agenda-page-client';

export const metadata = {
  title: 'Agenda | Dashboard | PixelVerse Studios',
  description: 'Manage your focus items and priorities',
};

export default async function AgendaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Fetch all items including completed
  const { items } = await getAgendaItems({ include_completed: true, limit: 100 }).catch(() => ({
    items: [],
  }));

  return <AgendaPageClient initialItems={items} />;
}

import { getAgendaItems } from '@/lib/api/agenda';
import { AgendaPageClient } from './components/agenda-page-client';

export const metadata = {
  title: 'Agenda | Dashboard',
  description: 'Manage your focus items and priorities',
  robots: { index: false, follow: false },
};

export default async function AgendaPage() {
  // Fetch all items including completed
  const { items } = await getAgendaItems({ include_completed: true, limit: 100 }).catch(() => ({
    items: [],
  }));

  return <AgendaPageClient initialItems={items} />;
}

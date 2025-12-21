import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Container } from '@/components/ui/container';
import { Plus } from 'lucide-react';
import { getAgendaItems } from '@/lib/api/agenda';
import { AgendaBoard } from './components/agenda-board';

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

  return (
    <main className="pb-16 pt-6 lg:pt-8">
      <Container className="max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1
              className="font-heading text-2xl font-bold md:text-3xl"
              style={{ color: 'var(--pv-text)' }}
            >
              Agenda
            </h1>
            <p className="mt-1 text-sm text-[var(--pv-text-muted)]">
              Track your focus items and priorities
            </p>
          </div>
          {/* Add Item button - wired up in CRUD ticket */}
          <button
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white transition-all hover:opacity-90"
            style={{
              background: 'linear-gradient(135deg, var(--pv-primary), var(--pv-primary-2))',
              boxShadow: '0 4px 12px rgba(63, 0, 233, 0.3)',
            }}
          >
            <Plus className="h-4 w-4" />
            Add Item
          </button>
        </div>

        {/* Kanban Board */}
        <AgendaBoard initialItems={items} />
      </Container>
    </main>
  );
}

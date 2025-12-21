'use client';

import { useState, useMemo } from 'react';
import { Circle, Loader2, CheckCircle2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AgendaItem, AgendaStatus } from '@/lib/types/agenda';
import { AgendaCard } from './agenda-card';

interface AgendaBoardProps {
  initialItems: AgendaItem[];
}

const columns: { status: AgendaStatus; title: string; icon: typeof Circle; color: string }[] = [
  { status: 'pending', title: 'Pending', icon: Circle, color: 'text-amber-500' },
  { status: 'in_progress', title: 'In Progress', icon: Loader2, color: 'text-blue-500' },
  { status: 'completed', title: 'Completed', icon: CheckCircle2, color: 'text-emerald-500' },
];

export function AgendaBoard({ initialItems }: AgendaBoardProps) {
  const [items] = useState(initialItems);

  // Group items by status
  const groupedItems = useMemo(() => {
    const groups: Record<AgendaStatus, AgendaItem[]> = {
      pending: [],
      in_progress: [],
      completed: [],
    };

    // Add items to their respective groups
    items.forEach((item) => {
      groups[item.status].push(item);
    });

    // Sort by priority within each group (lower number = higher priority)
    Object.values(groups).forEach((group) => {
      group.sort((a, b) => a.priority - b.priority);
    });

    return groups;
  }, [items]);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {columns.map(({ status, title, icon: Icon, color }) => (
        <div
          key={status}
          className="flex flex-col rounded-xl border"
          style={{
            background: 'var(--pv-surface)',
            borderColor: 'var(--pv-border)',
          }}
        >
          {/* Column Header */}
          <div
            className="flex items-center justify-between border-b px-4 py-3"
            style={{ borderColor: 'var(--pv-border)' }}
          >
            <div className="flex items-center gap-2">
              <Icon className={cn('h-4 w-4', color)} />
              <h3 className="font-semibold" style={{ color: 'var(--pv-text)' }}>
                {title}
              </h3>
              <span
                className="rounded-full px-2 py-0.5 text-xs"
                style={{
                  background: 'var(--pv-bg)',
                  color: 'var(--pv-text-muted)',
                }}
              >
                {groupedItems[status].length}
              </span>
            </div>

            {status === 'pending' && (
              <button
                className="rounded p-1 transition-colors hover:bg-[var(--pv-bg)]"
                title="Add item"
              >
                <Plus className="h-4 w-4 text-[var(--pv-text-muted)]" />
              </button>
            )}
          </div>

          {/* Column Content */}
          <div className="min-h-[200px] flex-1 space-y-2 p-3">
            {groupedItems[status].length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-[var(--pv-text-muted)]">
                {status === 'completed' ? 'Nothing completed yet' : 'No items'}
              </div>
            ) : (
              groupedItems[status].map((item) => <AgendaCard key={item.id} item={item} />)
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

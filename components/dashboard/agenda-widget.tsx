'use client';

import { Plus, Calendar, Circle, Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AgendaItem, AgendaStatus } from '@/lib/types/agenda';

interface AgendaWidgetProps {
  items: AgendaItem[];
  onStatusChange?: (id: string, status: AgendaStatus) => void;
  onAddClick?: () => void;
}

const statusConfig: Record<AgendaStatus, { icon: typeof Circle; color: string; label: string }> = {
  pending: {
    icon: Circle,
    color: 'text-amber-500',
    label: 'Pending',
  },
  in_progress: {
    icon: Loader2,
    color: 'text-blue-500',
    label: 'In Progress',
  },
  completed: {
    icon: CheckCircle2,
    color: 'text-emerald-500',
    label: 'Done',
  },
};

export function AgendaWidget({ items, onStatusChange, onAddClick }: AgendaWidgetProps) {
  return (
    <div className="space-y-1">
      {items.length === 0 ? (
        <EmptyState onAddClick={onAddClick} />
      ) : (
        items.map((item) => (
          <AgendaWidgetItem key={item.id} item={item} onStatusChange={onStatusChange} />
        ))
      )}

      {/* Quick Add Button */}
      <button
        onClick={onAddClick}
        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm
          text-[var(--pv-text-muted)] transition-colors
          hover:bg-[var(--pv-bg)] hover:text-[var(--pv-text)]"
      >
        <Plus className="h-4 w-4" />
        Add focus item
      </button>
    </div>
  );
}

function AgendaWidgetItem({
  item,
  onStatusChange,
}: {
  item: AgendaItem;
  onStatusChange?: (id: string, status: AgendaStatus) => void;
}) {
  const config = statusConfig[item.status];
  const StatusIcon = config.icon;

  const cycleStatus = () => {
    if (!onStatusChange) return;
    const next: Record<AgendaStatus, AgendaStatus> = {
      pending: 'in_progress',
      in_progress: 'completed',
      completed: 'pending',
    };
    onStatusChange(item.id, next[item.status]);
  };

  return (
    <div
      className="group flex items-start gap-3 rounded-lg px-3 py-2.5
        transition-colors hover:bg-[var(--pv-bg)]"
    >
      {/* Status Icon - Clickable to cycle */}
      <button
        onClick={cycleStatus}
        className={cn('mt-0.5 flex-shrink-0 transition-transform hover:scale-110', config.color)}
        title={`Status: ${config.label}`}
      >
        <StatusIcon className={cn('h-4 w-4', item.status === 'in_progress' && 'animate-spin')} />
      </button>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            'truncate text-sm font-medium',
            item.status === 'completed' && 'line-through opacity-60',
          )}
          style={{ color: 'var(--pv-text)' }}
        >
          {item.name}
        </p>

        {/* Due date if set */}
        {item.due_date && (
          <div className="mt-0.5 flex items-center gap-1 text-xs text-[var(--pv-text-muted)]">
            <Calendar className="h-3 w-3" />
            {formatDueDate(item.due_date)}
          </div>
        )}
      </div>

      {/* Category badge if set */}
      {item.category && (
        <span
          className="rounded-full bg-[var(--pv-border)] px-2 py-0.5 text-[10px]
          uppercase tracking-wider text-[var(--pv-text-muted)]"
        >
          {item.category}
        </span>
      )}
    </div>
  );
}

function EmptyState({ onAddClick }: { onAddClick?: () => void }) {
  return (
    <div className="py-6 text-center">
      <p className="mb-2 text-sm text-[var(--pv-text-muted)]">No focus items yet</p>
      <button onClick={onAddClick} className="text-sm text-[var(--pv-primary)] hover:underline">
        Add your first item
      </button>
    </div>
  );
}

function formatDueDate(isoDate: string): string {
  const date = new Date(isoDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);

  const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diff < 0) return 'Overdue';
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff <= 7) return `In ${diff} days`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

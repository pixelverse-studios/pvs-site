'use client';

import { Calendar, MoreHorizontal, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AgendaItem } from '@/lib/types/agenda';

interface AgendaCardProps {
  item: AgendaItem;
  isDragging?: boolean;
}

export function AgendaCard({ item, isDragging }: AgendaCardProps) {
  const isOverdue =
    item.due_date && item.status !== 'completed' && new Date(item.due_date) < new Date();

  return (
    <div
      className={cn(
        'group relative rounded-lg border p-3 transition-all',
        'hover:border-[var(--pv-primary)]/30 hover:shadow-sm',
        isDragging && 'rotate-2 opacity-50 shadow-lg',
        item.status === 'completed' && 'opacity-60'
      )}
      style={{
        background: 'var(--pv-bg)',
        borderColor: 'var(--pv-border)',
      }}
    >
      {/* Drag Handle - visible on hover */}
      <div className="absolute left-1 top-1/2 -translate-y-1/2 cursor-grab opacity-0 transition-opacity group-hover:opacity-100">
        <GripVertical className="h-4 w-4 text-[var(--pv-text-muted)]" />
      </div>

      {/* Content */}
      <div className="pl-4">
        <div className="flex items-start justify-between gap-2">
          <h4
            className={cn('text-sm font-medium', item.status === 'completed' && 'line-through')}
            style={{ color: 'var(--pv-text)' }}
          >
            {item.name}
          </h4>

          {/* Actions Menu - visible on hover */}
          <button className="rounded p-1 opacity-0 transition-all hover:bg-[var(--pv-surface)] group-hover:opacity-100">
            <MoreHorizontal className="h-4 w-4 text-[var(--pv-text-muted)]" />
          </button>
        </div>

        {/* Description preview */}
        {item.description && (
          <p className="mt-1 line-clamp-2 text-xs text-[var(--pv-text-muted)]">
            {item.description}
          </p>
        )}

        {/* Meta row */}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {item.due_date && (
            <span
              className={cn(
                'flex items-center gap-1 text-xs',
                isOverdue ? 'text-red-500' : 'text-[var(--pv-text-muted)]'
              )}
            >
              <Calendar className="h-3 w-3" />
              {formatDate(item.due_date)}
            </span>
          )}

          {item.category && (
            <span
              className="rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider"
              style={{
                background: 'var(--pv-surface)',
                color: 'var(--pv-text-muted)',
              }}
            >
              {item.category}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

'use client';

import {
  Calendar,
  GripVertical,
  Pencil,
  Trash2,
  Circle,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AgendaItem, AgendaStatus } from '@/lib/types/agenda';

interface AgendaCardProps {
  item: AgendaItem;
  isDragging?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onStatusChange?: (id: string, status: AgendaStatus) => void;
}

const statusOptions: { status: AgendaStatus; label: string; icon: typeof Circle; color: string }[] =
  [
    { status: 'pending', label: 'Pending', icon: Circle, color: 'text-amber-500' },
    { status: 'in_progress', label: 'In Progress', icon: Loader2, color: 'text-blue-500' },
    { status: 'completed', label: 'Completed', icon: CheckCircle2, color: 'text-emerald-500' },
  ];

export function AgendaCard({
  item,
  isDragging,
  onEdit,
  onDelete,
  onStatusChange,
}: AgendaCardProps) {
  const isOverdue =
    item.due_date && item.status !== 'completed' && new Date(item.due_date) < new Date();

  return (
    <div
      className={cn(
        'group relative rounded-lg border p-3 transition-all',
        'hover:border-[var(--pv-primary)]/30 hover:shadow-sm',
        isDragging && 'rotate-2 opacity-50 shadow-lg',
        item.status === 'completed' && 'opacity-60',
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

          {/* Inline Action Buttons - appear on hover/focus */}
          <div
            className="flex items-center gap-0.5 opacity-0 transition-opacity duration-150 group-focus-within:opacity-100 group-hover:opacity-100"
            role="group"
            aria-label="Card actions"
          >
            {/* Status Buttons */}
            {statusOptions.map(({ status, label, icon: Icon, color }) => (
              <button
                key={status}
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusChange?.(item.id, status);
                }}
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded transition-colors',
                  'focus:ring-[var(--pv-primary)]/50 hover:bg-[var(--pv-surface)] focus:outline-none focus:ring-2',
                  item.status === status && 'bg-[var(--pv-surface)]',
                )}
                aria-label={`Mark as ${label}`}
                title={label}
              >
                <Icon className={cn('h-3.5 w-3.5', color)} />
              </button>
            ))}

            {/* Divider */}
            <div
              className="mx-1 h-4 w-px"
              style={{ background: 'var(--pv-border)' }}
              aria-hidden="true"
            />

            {/* Edit Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded transition-colors',
                'focus:ring-[var(--pv-primary)]/50 hover:bg-[var(--pv-surface)] focus:outline-none focus:ring-2',
              )}
              aria-label="Edit item"
              title="Edit"
            >
              <Pencil className="h-3.5 w-3.5 text-[var(--pv-text-muted)]" />
            </button>

            {/* Delete Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded transition-colors',
                'text-[var(--pv-text-muted)] hover:bg-red-500/10 hover:text-red-500',
                'focus:outline-none focus:ring-2 focus:ring-red-500/50',
              )}
              aria-label="Delete item"
              title="Delete"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
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
                isOverdue ? 'text-red-500' : 'text-[var(--pv-text-muted)]',
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

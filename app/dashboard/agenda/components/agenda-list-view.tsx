'use client';

import { useState } from 'react';
import {
  Circle,
  Loader2,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Calendar,
  Pencil,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AgendaItem, AgendaStatus } from '@/lib/types/agenda';

interface AgendaListViewProps {
  groupedItems: Record<AgendaStatus, AgendaItem[]>;
  onEdit: (item: AgendaItem) => void;
  onDelete: (item: AgendaItem) => void;
  onStatusChange: (id: string, status: AgendaStatus) => void;
}

const statusConfig: {
  status: AgendaStatus;
  title: string;
  icon: typeof Circle;
  color: string;
  bgColor: string;
}[] = [
  {
    status: 'pending',
    title: 'Pending',
    icon: Circle,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },
  {
    status: 'in_progress',
    title: 'In Progress',
    icon: Loader2,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    status: 'completed',
    title: 'Completed',
    icon: CheckCircle2,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
  },
];

export function AgendaListView({
  groupedItems,
  onEdit,
  onDelete,
  onStatusChange,
}: AgendaListViewProps) {
  const [expandedSections, setExpandedSections] = useState<Record<AgendaStatus, boolean>>({
    pending: true,
    in_progress: true,
    completed: false,
  });

  const toggleSection = (status: AgendaStatus) => {
    setExpandedSections((prev) => ({ ...prev, [status]: !prev[status] }));
  };

  return (
    <div className="space-y-4">
      {statusConfig.map(({ status, title, icon: Icon, color, bgColor }) => {
        const items = groupedItems[status];
        const isExpanded = expandedSections[status];

        return (
          <div
            key={status}
            className="overflow-hidden rounded-xl border"
            style={{ borderColor: 'var(--pv-border)', background: 'var(--pv-surface)' }}
          >
            {/* Section Header */}
            <button
              onClick={() => toggleSection(status)}
              className="flex w-full items-center justify-between px-4 py-3 transition-colors hover:bg-[var(--pv-bg)]"
            >
              <div className="flex items-center gap-3">
                <div className={cn('rounded-lg p-1.5', bgColor)}>
                  <Icon className={cn('h-4 w-4', color)} />
                </div>
                <span className="font-semibold" style={{ color: 'var(--pv-text)' }}>
                  {title}
                </span>
                <span
                  className="rounded-full px-2 py-0.5 text-xs font-medium"
                  style={{ background: 'var(--pv-bg)', color: 'var(--pv-text-muted)' }}
                >
                  {items.length}
                </span>
              </div>
              {isExpanded ? (
                <ChevronDown className="h-5 w-5 text-[var(--pv-text-muted)]" />
              ) : (
                <ChevronRight className="h-5 w-5 text-[var(--pv-text-muted)]" />
              )}
            </button>

            {/* Section Content */}
            {isExpanded && (
              <div className="border-t" style={{ borderColor: 'var(--pv-border)' }}>
                {items.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-[var(--pv-text-muted)]">
                    {status === 'completed' ? 'Nothing completed yet' : 'No items'}
                  </div>
                ) : (
                  <div className="divide-y" style={{ borderColor: 'var(--pv-border)' }}>
                    {items.map((item) => (
                      <AgendaListItem
                        key={item.id}
                        item={item}
                        onEdit={() => onEdit(item)}
                        onDelete={() => onDelete(item)}
                        onStatusChange={onStatusChange}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function AgendaListItem({
  item,
  onEdit,
  onDelete,
  onStatusChange,
}: {
  item: AgendaItem;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (id: string, status: AgendaStatus) => void;
}) {
  const cycleStatus = () => {
    const next: Record<AgendaStatus, AgendaStatus> = {
      pending: 'in_progress',
      in_progress: 'completed',
      completed: 'pending',
    };
    onStatusChange(item.id, next[item.status]);
  };

  const config = statusConfig.find((s) => s.status === item.status)!;
  const StatusIcon = config.icon;

  return (
    <div
      className="group flex items-center gap-4 px-4 py-3 transition-colors hover:bg-[var(--pv-bg)]"
      style={{ borderColor: 'var(--pv-border)' }}
    >
      {/* Status Icon - Clickable */}
      <button
        onClick={cycleStatus}
        className={cn('flex-shrink-0 transition-transform hover:scale-110', config.color)}
        title={`Status: ${config.title} (click to change)`}
      >
        <StatusIcon className={cn('h-5 w-5', item.status === 'in_progress' && 'animate-spin')} />
      </button>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p
          className={cn('font-medium', item.status === 'completed' && 'line-through opacity-60')}
          style={{ color: 'var(--pv-text)' }}
        >
          {item.name}
        </p>
        {item.description && (
          <p className="mt-0.5 truncate text-sm text-[var(--pv-text-muted)]">{item.description}</p>
        )}
      </div>

      {/* Category Badge */}
      {item.category && (
        <span
          className="hidden flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs uppercase tracking-wider sm:inline-block"
          style={{ background: 'var(--pv-border)', color: 'var(--pv-text-muted)' }}
        >
          {item.category}
        </span>
      )}

      {/* Due Date */}
      {item.due_date && (
        <div className="hidden flex-shrink-0 items-center gap-1 text-sm text-[var(--pv-text-muted)] md:flex">
          <Calendar className="h-3.5 w-3.5" />
          {formatDueDate(item.due_date)}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={onEdit}
          className="rounded p-1.5 transition-colors hover:bg-[var(--pv-border)]"
          title="Edit"
        >
          <Pencil className="h-4 w-4 text-[var(--pv-text-muted)]" />
        </button>
        <button
          onClick={onDelete}
          className="rounded p-1.5 transition-colors hover:bg-red-500/10"
          title="Delete"
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </button>
      </div>
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

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
  onSelect: (item: AgendaItem) => void;
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
  onSelect,
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
                        onSelect={() => onSelect(item)}
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

const statusOptions: { status: AgendaStatus; label: string; icon: typeof Circle; color: string }[] =
  [
    { status: 'pending', label: 'Pending', icon: Circle, color: 'text-amber-500' },
    { status: 'in_progress', label: 'In Progress', icon: Loader2, color: 'text-blue-500' },
    { status: 'completed', label: 'Completed', icon: CheckCircle2, color: 'text-emerald-500' },
  ];

function AgendaListItem({
  item,
  onEdit,
  onDelete,
  onStatusChange,
  onSelect,
}: {
  item: AgendaItem;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (id: string, status: AgendaStatus) => void;
  onSelect: () => void;
}) {
  const config = statusConfig.find((s) => s.status === item.status)!;
  const StatusIcon = config.icon;

  const handleRowClick = (e: React.MouseEvent) => {
    // Prevent triggering when clicking action buttons or status toggle
    const target = e.target as HTMLElement;
    if (target.closest('button')) {
      return;
    }
    onSelect();
  };

  return (
    <div
      onClick={handleRowClick}
      className="group flex cursor-pointer items-center gap-4 px-4 py-3 transition-colors hover:bg-[var(--pv-bg)]"
      style={{ borderColor: 'var(--pv-border)' }}
    >
      {/* Current Status Icon */}
      <div className={cn('flex-shrink-0', config.color)}>
        <StatusIcon className={cn('h-5 w-5', item.status === 'in_progress' && 'animate-spin')} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p
          className={cn('font-medium', item.status === 'completed' && 'line-through opacity-60')}
          style={{ color: 'var(--pv-text)' }}
        >
          {item.name}
        </p>
        {item.description && (
          <div
            className="prose prose-sm mt-0.5 line-clamp-1 max-w-none text-sm text-[var(--pv-text-muted)] dark:prose-invert prose-p:m-0 prose-ol:m-0 prose-ul:m-0 prose-li:m-0"
            dangerouslySetInnerHTML={{ __html: item.description }}
          />
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

      {/* Actions - Status buttons + Edit/Delete */}
      <div
        className="flex flex-shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100"
        role="group"
        aria-label="Item actions"
      >
        {/* Status Buttons */}
        {statusOptions.map(({ status, label, icon: Icon, color }) => (
          <button
            key={status}
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(item.id, status);
            }}
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded transition-colors',
              'hover:bg-[var(--pv-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--pv-primary)]/50',
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
            onEdit();
          }}
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded transition-colors',
            'hover:bg-[var(--pv-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--pv-primary)]/50',
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
            onDelete();
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

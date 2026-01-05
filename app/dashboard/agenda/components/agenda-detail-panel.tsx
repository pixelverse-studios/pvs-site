'use client';

import { Circle, Loader2, CheckCircle2, Calendar, Pencil, Trash2, Tag, Clock } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { AgendaItem, AgendaStatus } from '@/lib/types/agenda';

interface AgendaDetailPanelProps {
  item: AgendaItem | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (id: string, status: AgendaStatus) => void;
}

const statusConfig: {
  status: AgendaStatus;
  label: string;
  icon: typeof Circle;
  color: string;
  bgColor: string;
}[] = [
  {
    status: 'pending',
    label: 'Pending',
    icon: Circle,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },
  {
    status: 'in_progress',
    label: 'In Progress',
    icon: Loader2,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    status: 'completed',
    label: 'Completed',
    icon: CheckCircle2,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
  },
];

export function AgendaDetailPanel({
  item,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
}: AgendaDetailPanelProps) {
  if (!item) return null;

  const currentStatus = statusConfig.find((s) => s.status === item.status)!;
  const StatusIcon = currentStatus.icon;

  const isOverdue =
    item.due_date && item.status !== 'completed' && new Date(item.due_date) < new Date();

  const handleStatusClick = (newStatus: AgendaStatus) => {
    if (newStatus !== item.status) {
      onStatusChange(item.id, newStatus);
    }
  };

  const handleEdit = () => {
    onClose();
    onEdit();
  };

  const handleDelete = () => {
    onClose();
    onDelete();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className={cn(item.status === 'completed' && 'line-through opacity-60')}>
            {item.name}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 space-y-6 overflow-y-auto">
          {/* Status Section */}
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-[var(--pv-text-muted)]">
              Status
            </label>
            <div className="flex gap-2">
              {statusConfig.map(({ status, label, icon: Icon, color, bgColor }) => (
                <button
                  key={status}
                  onClick={() => handleStatusClick(status)}
                  className={cn(
                    'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                    'hover:border-[var(--pv-primary)]/30 border',
                    item.status === status
                      ? cn(bgColor, 'border-transparent')
                      : 'border-[var(--pv-border)] bg-transparent',
                  )}
                >
                  <Icon
                    className={cn('h-4 w-4', color, status === 'in_progress' && 'animate-spin')}
                  />
                  <span style={{ color: 'var(--pv-text)' }}>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Description Section */}
          {item.description && (
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-[var(--pv-text-muted)]">
                Description
              </label>
              <div
                className="rounded-lg border p-4 text-sm leading-relaxed"
                style={{
                  background: 'var(--pv-bg)',
                  borderColor: 'var(--pv-border)',
                  color: 'var(--pv-text)',
                }}
              >
                {item.description}
              </div>
            </div>
          )}

          {/* Metadata Section */}
          <div className="space-y-4">
            {/* Category */}
            {item.category && (
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ background: 'var(--pv-surface)' }}
                >
                  <Tag className="h-4 w-4 text-[var(--pv-text-muted)]" />
                </div>
                <div>
                  <p className="text-xs text-[var(--pv-text-muted)]">Category</p>
                  <p className="text-sm font-medium capitalize" style={{ color: 'var(--pv-text)' }}>
                    {item.category}
                  </p>
                </div>
              </div>
            )}

            {/* Due Date */}
            {item.due_date && (
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg',
                    isOverdue ? 'bg-red-500/10' : '',
                  )}
                  style={{ background: isOverdue ? undefined : 'var(--pv-surface)' }}
                >
                  <Calendar
                    className={cn(
                      'h-4 w-4',
                      isOverdue ? 'text-red-500' : 'text-[var(--pv-text-muted)]',
                    )}
                  />
                </div>
                <div>
                  <p className="text-xs text-[var(--pv-text-muted)]">Due Date</p>
                  <p
                    className={cn('text-sm font-medium', isOverdue && 'text-red-500')}
                    style={{ color: isOverdue ? undefined : 'var(--pv-text)' }}
                  >
                    {formatFullDate(item.due_date)}
                    {isOverdue && ' (Overdue)'}
                  </p>
                </div>
              </div>
            )}

            {/* Created */}
            <div className="flex items-center gap-3">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg"
                style={{ background: 'var(--pv-surface)' }}
              >
                <Clock className="h-4 w-4 text-[var(--pv-text-muted)]" />
              </div>
              <div>
                <p className="text-xs text-[var(--pv-text-muted)]">Created</p>
                <p className="text-sm font-medium" style={{ color: 'var(--pv-text)' }}>
                  {formatFullDate(item.created_at)}
                </p>
              </div>
            </div>

            {/* Updated */}
            {item.updated_at !== item.created_at && (
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ background: 'var(--pv-surface)' }}
                >
                  <Clock className="h-4 w-4 text-[var(--pv-text-muted)]" />
                </div>
                <div>
                  <p className="text-xs text-[var(--pv-text-muted)]">Last Updated</p>
                  <p className="text-sm font-medium" style={{ color: 'var(--pv-text)' }}>
                    {formatFullDate(item.updated_at)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <SheetFooter className="mt-6 border-t pt-4" style={{ borderColor: 'var(--pv-border)' }}>
          <Button variant="outline" onClick={handleEdit} className="flex-1 gap-2">
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete} className="flex-1 gap-2">
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function formatFullDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

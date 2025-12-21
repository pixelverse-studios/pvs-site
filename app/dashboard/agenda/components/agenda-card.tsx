'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Calendar,
  MoreHorizontal,
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
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isOverdue =
    item.due_date && item.status !== 'completed' && new Date(item.due_date) < new Date();

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [menuOpen]);

  const handleStatusChange = (status: AgendaStatus) => {
    onStatusChange?.(item.id, status);
    setMenuOpen(false);
  };

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

          {/* Actions Menu Trigger */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="rounded p-1 opacity-0 transition-all hover:bg-[var(--pv-surface)] group-hover:opacity-100"
            >
              <MoreHorizontal className="h-4 w-4 text-[var(--pv-text-muted)]" />
            </button>

            {/* Dropdown Menu */}
            {menuOpen && (
              <div
                className="absolute right-0 top-full z-50 mt-1 min-w-[160px] rounded-lg border py-1 shadow-lg"
                style={{
                  background: 'var(--pv-surface)',
                  borderColor: 'var(--pv-border)',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Edit */}
                <button
                  onClick={() => {
                    onEdit?.();
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-[var(--pv-bg)]"
                  style={{ color: 'var(--pv-text)' }}
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>

                {/* Status submenu */}
                <div
                  className="my-1 border-b border-t py-1"
                  style={{ borderColor: 'var(--pv-border)' }}
                >
                  <p
                    className="px-3 py-1 text-[10px] font-medium uppercase tracking-wider"
                    style={{ color: 'var(--pv-text-muted)' }}
                  >
                    Status
                  </p>
                  {statusOptions.map(({ status, label, icon: Icon, color }) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      className={cn(
                        'flex w-full items-center gap-2 px-3 py-1.5 text-sm transition-colors hover:bg-[var(--pv-bg)]',
                        item.status === status && 'bg-[var(--pv-bg)]',
                      )}
                      style={{ color: 'var(--pv-text)' }}
                    >
                      <Icon className={cn('h-3.5 w-3.5', color)} />
                      {label}
                      {item.status === status && (
                        <CheckCircle2 className="ml-auto h-3.5 w-3.5 text-[var(--pv-primary)]" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Delete */}
                <button
                  onClick={() => {
                    onDelete?.();
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-500 transition-colors hover:bg-red-500/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            )}
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

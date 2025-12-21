'use client';

import { useState } from 'react';
import { AlertTriangle, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AgendaItem } from '@/lib/types/agenda';

interface DeleteAgendaDialogProps {
  item: AgendaItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function DeleteAgendaDialog({ item, isOpen, onClose, onConfirm }: DeleteAgendaDialogProps) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setDeleting(true);
    setError(null);

    try {
      await onConfirm();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !deleting) {
      onClose();
    }
  };

  if (!isOpen || !item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        className="w-full max-w-sm rounded-xl border shadow-xl"
        style={{
          background: 'var(--pv-surface)',
          borderColor: 'var(--pv-border)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between border-b px-6 py-4"
          style={{ borderColor: 'var(--pv-border)' }}
        >
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10">
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </div>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--pv-text)' }}>
              Delete Item
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={deleting}
            className="rounded-lg p-1.5 transition-colors hover:bg-[var(--pv-bg)] disabled:opacity-50"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-[var(--pv-text-muted)]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm" style={{ color: 'var(--pv-text-muted)' }}>
            Are you sure you want to delete{' '}
            <span className="font-medium" style={{ color: 'var(--pv-text)' }}>
              &quot;{item.name}&quot;
            </span>
            ? This action cannot be undone.
          </p>

          {error && (
            <p className="mt-4 text-sm text-red-500" role="alert">
              {error}
            </p>
          )}
        </div>

        {/* Actions */}
        <div
          className="flex justify-end gap-3 border-t px-6 py-4"
          style={{ borderColor: 'var(--pv-border)' }}
        >
          <Button variant="ghost" onClick={onClose} disabled={deleting}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={deleting}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {deleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

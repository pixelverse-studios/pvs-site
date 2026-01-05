'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import type { AgendaItem, AgendaStatus } from '@/lib/types/agenda';
import { createAgendaItem, updateAgendaStatus } from '@/lib/api/agenda';
import { AgendaWidget } from './agenda-widget';
import { AgendaItemModal, type AgendaFormData } from './agenda/agenda-item-modal';

interface AgendaWidgetWrapperProps {
  initialItems: AgendaItem[];
}

interface Toast {
  type: 'success' | 'error';
  message: string;
}

export function AgendaWidgetWrapper({ initialItems }: AgendaWidgetWrapperProps) {
  const [items, setItems] = useState(initialItems);
  const [toast, setToast] = useState<Toast | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const showToast = useCallback((type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleCreate = async (data: AgendaFormData) => {
    const newItem = await createAgendaItem(data);
    setItems((prev) => [newItem, ...prev]);
    showToast('success', 'Item created');
  };

  const handleStatusChange = async (id: string, newStatus: AgendaStatus) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    const originalStatus = item.status;

    // Optimistic update
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i)));

    try {
      await updateAgendaStatus(id, { status: newStatus });
      showToast('success', `Moved to ${newStatus.replace('_', ' ')}`);
    } catch {
      // Revert on error
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: originalStatus } : i)));
      showToast('error', 'Failed to update status');
    }
  };

  return (
    <>
      {/* Toast */}
      {toast && (
        <div
          className={cn(
            'fixed bottom-6 right-6 z-50 rounded-lg px-4 py-3 text-sm font-medium shadow-lg',
            toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white',
          )}
        >
          {toast.message}
        </div>
      )}

      <AgendaWidget
        items={items}
        onAddClick={() => setCreateModalOpen(true)}
        onStatusChange={handleStatusChange}
      />

      {/* Create Modal */}
      <AgendaItemModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleCreate}
      />
    </>
  );
}

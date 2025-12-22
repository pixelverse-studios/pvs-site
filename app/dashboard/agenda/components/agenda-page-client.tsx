'use client';

import { useState, useMemo, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Circle, Loader2, CheckCircle2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Container } from '@/components/ui/container';
import type { AgendaItem, AgendaStatus } from '@/lib/types/agenda';
import {
  createAgendaItem,
  updateAgendaItem,
  updateAgendaStatus,
  deleteAgendaItem,
  reorderAgendaItems,
} from '@/lib/api/agenda';
import { AgendaCard } from './agenda-card';
import {
  AgendaItemModal,
  type AgendaFormData,
} from '@/components/dashboard/agenda/agenda-item-modal';
import { DeleteAgendaDialog } from '@/components/dashboard/agenda/delete-agenda-dialog';

interface AgendaPageClientProps {
  initialItems: AgendaItem[];
}

interface Toast {
  type: 'success' | 'error';
  message: string;
}

const columns: { status: AgendaStatus; title: string; icon: typeof Circle; color: string }[] = [
  { status: 'pending', title: 'Pending', icon: Circle, color: 'text-amber-500' },
  { status: 'in_progress', title: 'In Progress', icon: Loader2, color: 'text-blue-500' },
  { status: 'completed', title: 'Completed', icon: CheckCircle2, color: 'text-emerald-500' },
];

export function AgendaPageClient({ initialItems }: AgendaPageClientProps) {
  const [items, setItems] = useState(initialItems);
  const [toast, setToast] = useState<Toast | null>(null);

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AgendaItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<AgendaItem | null>(null);

  // Auto-hide toast
  const showToast = useCallback((type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Group items by status
  const groupedItems = useMemo(() => {
    const groups: Record<AgendaStatus, AgendaItem[]> = {
      pending: [],
      in_progress: [],
      completed: [],
    };

    items.forEach((item) => {
      groups[item.status].push(item);
    });

    // Sort by priority within each group
    Object.values(groups).forEach((group) => {
      group.sort((a, b) => a.priority - b.priority);
    });

    return groups;
  }, [items]);

  // Create item
  const handleCreate = async (data: AgendaFormData) => {
    const newItem = await createAgendaItem(data);
    setItems((prev) => [newItem, ...prev]);
    showToast('success', 'Item created');
  };

  // Edit item
  const handleEdit = async (data: AgendaFormData) => {
    if (!editingItem) return;
    const updated = await updateAgendaItem(editingItem.id, data);
    setItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    showToast('success', 'Item updated');
    setEditingItem(null);
  };

  // Delete item
  const handleDelete = async () => {
    if (!deletingItem) return;
    await deleteAgendaItem(deletingItem.id);
    setItems((prev) => prev.filter((item) => item.id !== deletingItem.id));
    showToast('success', 'Item deleted');
    setDeletingItem(null);
  };

  // Status change from card
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

  // Drag and drop
  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    // Same position - no change
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const sourceStatus = source.droppableId as AgendaStatus;
    const destStatus = destination.droppableId as AgendaStatus;

    // Create new items array
    const newItems = [...items];
    const draggedItem = newItems.find((i) => i.id === draggableId);
    if (!draggedItem) return;

    // Update status if moving between columns
    if (sourceStatus !== destStatus) {
      draggedItem.status = destStatus;
    }

    // Reorder: remove from source, insert at destination
    const destGroup = newItems
      .filter((i) => i.id !== draggableId && i.status === destStatus)
      .sort((a, b) => a.priority - b.priority);

    destGroup.splice(destination.index, 0, draggedItem);

    // Reassign priorities
    destGroup.forEach((item, idx) => {
      item.priority = idx;
    });

    setItems(newItems);

    try {
      // Update status if changed
      if (sourceStatus !== destStatus) {
        await updateAgendaStatus(draggableId, { status: destStatus });
      }

      // Send reorder request
      const reorderedIds = destGroup.map((i) => i.id);
      await reorderAgendaItems({ item_ids: reorderedIds });
    } catch {
      // Revert on error
      setItems(initialItems);
      showToast('error', 'Failed to reorder items');
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

      <main className="pb-16 pt-6 lg:pt-8">
        <Container className="max-w-7xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1
                className="font-heading text-2xl font-bold md:text-3xl"
                style={{ color: 'var(--pv-text)' }}
              >
                Agenda
              </h1>
              <p className="mt-1 text-sm text-[var(--pv-text-muted)]">
                Track your focus items and priorities
              </p>
            </div>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white transition-all hover:opacity-90"
              style={{
                background: 'linear-gradient(135deg, var(--pv-primary), var(--pv-primary-2))',
                boxShadow: '0 4px 12px rgba(63, 0, 233, 0.3)',
              }}
            >
              <Plus className="h-4 w-4" />
              Add Item
            </button>
          </div>

          {/* Kanban Board */}
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {columns.map(({ status, title, icon: Icon, color }) => (
                <Droppable droppableId={status} key={status}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={cn(
                        'flex flex-col rounded-xl border transition-all',
                        snapshot.isDraggingOver && 'ring-[var(--pv-primary)]/50 ring-2',
                      )}
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
                            onClick={() => setCreateModalOpen(true)}
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
                          groupedItems[status].map((item, index) => (
                            <Draggable key={item.id} draggableId={item.id} index={index}>
                              {(dragProvided, dragSnapshot) => (
                                <div
                                  ref={dragProvided.innerRef}
                                  {...dragProvided.draggableProps}
                                  {...dragProvided.dragHandleProps}
                                >
                                  <AgendaCard
                                    item={item}
                                    isDragging={dragSnapshot.isDragging}
                                    onEdit={() => setEditingItem(item)}
                                    onDelete={() => setDeletingItem(item)}
                                    onStatusChange={handleStatusChange}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))
                        )}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>
        </Container>
      </main>

      {/* Create Modal */}
      <AgendaItemModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleCreate}
      />

      {/* Edit Modal */}
      <AgendaItemModal
        item={editingItem || undefined}
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        onSave={handleEdit}
      />

      {/* Delete Dialog */}
      <DeleteAgendaDialog
        item={deletingItem}
        isOpen={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}

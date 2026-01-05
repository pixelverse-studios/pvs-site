'use client';

import { useState, useEffect } from 'react';
import { X, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RichTextEditor } from '@/components/dashboard/agenda/rich-text-editor';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { AgendaItem } from '@/lib/types/agenda';

// The form always outputs all fields - use undefined for empty optional fields
export interface AgendaFormData {
  name: string;
  description?: string;
  category?: string;
  due_date?: string;
}

interface AgendaItemModalProps {
  item?: AgendaItem;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AgendaFormData) => Promise<void>;
}

const categoryOptions = [
  { value: 'development', label: 'Development' },
  { value: 'design', label: 'Design' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'admin', label: 'Admin' },
  { value: 'client', label: 'Client' },
];

export function AgendaItemModal({ item, isOpen, onClose, onSave }: AgendaItemModalProps) {
  const [name, setName] = useState(item?.name || '');
  const [description, setDescription] = useState(item?.description || '');
  const [category, setCategory] = useState(item?.category || '');
  const [dueDate, setDueDate] = useState(item?.due_date?.split('T')[0] || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!item;

  // Reset form when modal opens/closes or item changes
  useEffect(() => {
    if (isOpen) {
      setName(item?.name || '');
      setDescription(item?.description || '');
      setCategory(item?.category || '');
      setDueDate(item?.due_date?.split('T')[0] || '');
      setError(null);
    }
  }, [isOpen, item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await onSave({
        name: name.trim(),
        description: description.trim() || undefined,
        category: category || undefined,
        due_date: dueDate || undefined,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        className="w-full max-w-md rounded-xl border shadow-xl"
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
          <h2 className="text-lg font-semibold" style={{ color: 'var(--pv-text)' }}>
            {isEditMode ? 'Edit Item' : 'Add Focus Item'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 transition-colors hover:bg-[var(--pv-bg)]"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-[var(--pv-text-muted)]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {/* Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="agenda-name"
              className="text-sm font-medium"
              style={{ color: 'var(--pv-text)' }}
            >
              Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="agenda-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="What needs to be done?"
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label
              htmlFor="agenda-description"
              className="text-sm font-medium"
              style={{ color: 'var(--pv-text)' }}
            >
              Description
            </label>
            <RichTextEditor
              content={description}
              onChange={setDescription}
              placeholder="Add details..."
              minHeight="100px"
            />
          </div>

          {/* Category + Due Date Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="agenda-category"
                className="text-sm font-medium"
                style={{ color: 'var(--pv-text)' }}
              >
                Category
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="agenda-category">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="agenda-due-date"
                className="flex items-center gap-1.5 text-sm font-medium"
                style={{ color: 'var(--pv-text)' }}
              >
                <Calendar className="h-3.5 w-3.5" />
                Due Date
              </label>
              <Input
                id="agenda-due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-500" role="alert">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : isEditMode ? (
                'Save Changes'
              ) : (
                'Add Item'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

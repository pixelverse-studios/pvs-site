'use client';

import { useState, useEffect } from 'react';
import {
  Circle,
  Loader2,
  CheckCircle2,
  Calendar,
  Pencil,
  Trash2,
  Tag,
  Clock,
  X,
  Save,
} from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
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
import { cn } from '@/lib/utils';
import type { AgendaItem, AgendaStatus } from '@/lib/types/agenda';

export interface AgendaFormData {
  name: string;
  description?: string;
  category?: string;
  due_date?: string;
}

interface AgendaDetailPanelProps {
  item: AgendaItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AgendaFormData) => Promise<void>;
  onDelete: () => void;
  onStatusChange: (id: string, status: AgendaStatus) => void;
  initialEditMode?: boolean;
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

const categoryOptions = [
  { value: 'development', label: 'Development' },
  { value: 'design', label: 'Design' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'admin', label: 'Admin' },
  { value: 'client', label: 'Client' },
];

export function AgendaDetailPanel({
  item,
  isOpen,
  onClose,
  onSave,
  onDelete,
  onStatusChange,
  initialEditMode = false,
}: AgendaDetailPanelProps) {
  const [isEditing, setIsEditing] = useState(initialEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate] = useState('');

  // Reset form when item changes or panel opens
  useEffect(() => {
    if (isOpen && item) {
      setName(item.name || '');
      setDescription(item.description || '');
      setCategory(item.category || '');
      setDueDate(item.due_date?.split('T')[0] || '');
      setError(null);
      setIsEditing(initialEditMode);
    }
  }, [isOpen, item, initialEditMode]);

  // Reset editing state when panel closes
  useEffect(() => {
    if (!isOpen) {
      setIsEditing(false);
      setError(null);
    }
  }, [isOpen]);

  if (!item) return null;

  const isOverdue =
    item.due_date && item.status !== 'completed' && new Date(item.due_date) < new Date();

  const handleStatusClick = (newStatus: AgendaStatus) => {
    if (newStatus !== item.status) {
      onStatusChange(item.id, newStatus);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    // Reset form to original values
    setName(item.name || '');
    setDescription(item.description || '');
    setCategory(item.category || '');
    setDueDate(item.due_date?.split('T')[0] || '');
    setError(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
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
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    onClose();
    onDelete();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="flex flex-col overflow-hidden p-0">
        {/* Header */}
        <SheetHeader className="flex-shrink-0 border-b p-6" style={{ borderColor: 'var(--pv-border)' }}>
          {isEditing ? (
            <div className="space-y-2 pr-8">
              <label
                htmlFor="panel-name"
                className="text-sm font-medium"
                style={{ color: 'var(--pv-text)' }}
              >
                Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="panel-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="What needs to be done?"
                autoFocus
                className="text-base"
              />
            </div>
          ) : (
            <SheetTitle className={cn(item.status === 'completed' && 'line-through opacity-60')}>
              {item.name}
            </SheetTitle>
          )}
        </SheetHeader>

        {/* Scrollable Content */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {/* Status Section */}
          <div>
            <label
              className="mb-3 block text-sm font-medium"
              style={{ color: 'var(--pv-text)' }}
            >
              Status
            </label>
            <div className="flex flex-wrap gap-2">
              {statusConfig.map(({ status, label, icon: Icon, color, bgColor }) => (
                <button
                  key={status}
                  onClick={() => handleStatusClick(status)}
                  className={cn(
                    'flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all',
                    'border',
                    item.status === status
                      ? cn(bgColor, 'border-transparent')
                      : 'border-[var(--pv-border)] bg-transparent hover:border-[var(--pv-primary)]/30',
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
          <div>
            <label
              htmlFor="panel-description"
              className="mb-3 block text-sm font-medium"
              style={{ color: 'var(--pv-text)' }}
            >
              Description
            </label>
            {isEditing ? (
              <RichTextEditor
                content={description}
                onChange={setDescription}
                placeholder="Add details..."
                minHeight="140px"
              />
            ) : item.description ? (
              <div
                className="prose prose-sm max-w-none rounded-lg border p-4 dark:prose-invert prose-p:my-2 prose-a:text-[var(--pv-primary)] prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-[var(--pv-primary)] prose-blockquote:text-[var(--pv-text-muted)] prose-code:rounded prose-code:bg-[var(--pv-surface)] prose-code:px-1.5 prose-code:py-0.5 prose-code:before:content-none prose-code:after:content-none prose-ol:my-2 prose-ul:my-2 prose-li:my-0.5"
                style={{
                  background: 'var(--pv-bg)',
                  borderColor: 'var(--pv-border)',
                  color: 'var(--pv-text)',
                }}
                dangerouslySetInnerHTML={{ __html: item.description }}
              />
            ) : (
              <p className="text-sm italic text-[var(--pv-text-muted)]">No description</p>
            )}
          </div>

          {/* Category + Due Date - Edit Mode */}
          {isEditing ? (
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="panel-category"
                  className="block text-sm font-medium"
                  style={{ color: 'var(--pv-text)' }}
                >
                  Category
                </label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="panel-category">
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

              <div className="space-y-2">
                <label
                  htmlFor="panel-due-date"
                  className="block text-sm font-medium"
                  style={{ color: 'var(--pv-text)' }}
                >
                  Due Date
                </label>
                <Input
                  id="panel-due-date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>
          ) : (
            /* Metadata Section - View Mode */
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
                    <p
                      className="text-sm font-medium capitalize"
                      style={{ color: 'var(--pv-text)' }}
                    >
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
          )}

          {/* Error Message */}
          {error && (
            <p className="text-sm text-red-500" role="alert">
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <SheetFooter
          className="flex-shrink-0 border-t p-6"
          style={{ borderColor: 'var(--pv-border)' }}
        >
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                disabled={saving}
                className="flex-1 gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving} className="flex-1 gap-2">
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleEditClick} className="flex-1 gap-2">
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
              <Button variant="destructive" onClick={handleDelete} className="flex-1 gap-2">
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </>
          )}
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

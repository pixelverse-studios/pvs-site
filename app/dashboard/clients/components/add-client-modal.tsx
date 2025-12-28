'use client';

import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/api/clients';
import type { ClientCreatePayload } from '@/lib/types/client';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function AddClientModal({ isOpen, onClose, onSuccess }: AddClientModalProps) {
  // Form state
  const [clientName, setClientName] = useState('');
  const [clientSlug, setClientSlug] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [active, setActive] = useState(true);
  const [cms, setCms] = useState(false);
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setClientName('');
      setClientSlug('');
      setSlugManuallyEdited(false);
      setActive(true);
      setCms(false);
      setFirstname('');
      setLastname('');
      setEmail('');
      setPhone('');
      setError(null);
    }
  }, [isOpen]);

  // Auto-generate slug from client name
  useEffect(() => {
    if (!slugManuallyEdited && clientName) {
      setClientSlug(slugify(clientName));
    }
  }, [clientName, slugManuallyEdited]);

  const handleSlugChange = (value: string) => {
    setSlugManuallyEdited(true);
    setClientSlug(slugify(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!clientName.trim()) {
      setError('Client name is required');
      return;
    }
    if (!clientSlug.trim()) {
      setError('Client slug is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const payload: ClientCreatePayload = {
      client: clientName.trim(),
      client_slug: clientSlug.trim(),
      active,
      cms: cms || undefined,
      firstname: firstname.trim() || undefined,
      lastname: lastname.trim() || undefined,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
    };

    try {
      await createClient(payload);
      onClose();
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create client');
    } finally {
      setIsSubmitting(false);
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
        className="w-full max-w-lg rounded-xl border shadow-xl"
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
            Add New Client
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
          {/* Client Name + Slug */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="client-name"
                className="text-sm font-medium"
                style={{ color: 'var(--pv-text)' }}
              >
                Client Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="client-name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Acme Corp"
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="client-slug"
                className="text-sm font-medium"
                style={{ color: 'var(--pv-text)' }}
              >
                Slug <span className="text-red-500">*</span>
              </label>
              <Input
                id="client-slug"
                value={clientSlug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="acme-corp"
              />
            </div>
          </div>

          {/* Toggles Row */}
          <div className="flex items-center gap-6">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="h-4 w-4 rounded border-[var(--pv-border)] text-[var(--pv-primary)] focus:ring-[var(--pv-primary)]"
              />
              <span className="text-sm" style={{ color: 'var(--pv-text)' }}>
                Active
              </span>
            </label>

            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={cms}
                onChange={(e) => setCms(e.target.checked)}
                className="h-4 w-4 rounded border-[var(--pv-border)] text-[var(--pv-primary)] focus:ring-[var(--pv-primary)]"
              />
              <span className="text-sm" style={{ color: 'var(--pv-text)' }}>
                CMS
              </span>
            </label>
          </div>

          {/* Contact Info Section */}
          <div
            className="border-t pt-4"
            style={{ borderColor: 'var(--pv-border)' }}
          >
            <p
              className="mb-3 text-xs font-medium uppercase tracking-wide"
              style={{ color: 'var(--pv-text-muted)' }}
            >
              Contact Information (Optional)
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="client-firstname"
                  className="text-sm font-medium"
                  style={{ color: 'var(--pv-text)' }}
                >
                  First Name
                </label>
                <Input
                  id="client-firstname"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  placeholder="John"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="client-lastname"
                  className="text-sm font-medium"
                  style={{ color: 'var(--pv-text)' }}
                >
                  Last Name
                </label>
                <Input
                  id="client-lastname"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="client-email"
                  className="text-sm font-medium"
                  style={{ color: 'var(--pv-text)' }}
                >
                  Email
                </label>
                <Input
                  id="client-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@acme.com"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="client-phone"
                  className="text-sm font-medium"
                  style={{ color: 'var(--pv-text)' }}
                >
                  Phone
                </label>
                <Input
                  id="client-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>
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
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Add Client'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

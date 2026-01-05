'use client';

import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { updateClient } from '@/lib/api/clients';
import type { Client, ClientUpdatePayload } from '@/lib/types/client';

interface EditClientModalProps {
  client: Client;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (updated: Client) => void;
}

export function EditClientModal({ client, isOpen, onClose, onSuccess }: EditClientModalProps) {
  // Form state - initialized from client prop
  const [companyName, setCompanyName] = useState(client.company_name ?? '');
  const [firstname, setFirstname] = useState(client.firstname ?? '');
  const [lastname, setLastname] = useState(client.lastname ?? '');
  const [email, setEmail] = useState(client.email ?? '');
  const [phone, setPhone] = useState(client.phone ?? '');
  const [active, setActive] = useState(client.active);

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when modal opens or client changes
  useEffect(() => {
    if (isOpen) {
      setCompanyName(client.company_name ?? '');
      setFirstname(client.firstname ?? '');
      setLastname(client.lastname ?? '');
      setEmail(client.email ?? '');
      setPhone(client.phone ?? '');
      setActive(client.active);
      setError(null);
    }
  }, [isOpen, client]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation - firstname and lastname are required
    if (!firstname.trim()) {
      setError('First name is required');
      return;
    }
    if (!lastname.trim()) {
      setError('Last name is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Build payload with only changed fields
    const payload: ClientUpdatePayload = {};

    if (companyName.trim() !== (client.company_name ?? '')) {
      payload.company_name = companyName.trim() || undefined;
    }
    if (firstname.trim() !== (client.firstname ?? '')) {
      payload.firstname = firstname.trim();
    }
    if (lastname.trim() !== (client.lastname ?? '')) {
      payload.lastname = lastname.trim();
    }
    if (email.trim() !== (client.email ?? '')) {
      payload.email = email.trim() || undefined;
    }
    if (phone.trim() !== (client.phone ?? '')) {
      payload.phone = phone.trim() || undefined;
    }
    if (active !== client.active) {
      payload.active = active;
    }

    // If nothing changed, just close
    if (Object.keys(payload).length === 0) {
      onClose();
      return;
    }

    try {
      const updated = await updateClient(client.id, payload);
      onClose();
      onSuccess?.(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update client');
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
            Edit Client
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
          {/* Contact Name (Required) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="edit-client-firstname"
                className="text-sm font-medium"
                style={{ color: 'var(--pv-text)' }}
              >
                First Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="edit-client-firstname"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="edit-client-lastname"
                className="text-sm font-medium"
                style={{ color: 'var(--pv-text)' }}
              >
                Last Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="edit-client-lastname"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
              />
            </div>
          </div>

          {/* Company Name (Optional) */}
          <div className="space-y-1.5">
            <label
              htmlFor="edit-company-name"
              className="text-sm font-medium"
              style={{ color: 'var(--pv-text)' }}
            >
              Company Name{' '}
              <span className="font-normal text-[var(--pv-text-muted)]">(optional)</span>
            </label>
            <Input
              id="edit-company-name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. 360 Degree Care, Tampa Aquatic"
            />
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="edit-client-email"
                className="text-sm font-medium"
                style={{ color: 'var(--pv-text)' }}
              >
                Email
              </label>
              <Input
                id="edit-client-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="edit-client-phone"
                className="text-sm font-medium"
                style={{ color: 'var(--pv-text)' }}
              >
                Phone
              </label>
              <Input
                id="edit-client-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          {/* Active Toggle */}
          <div
            className="flex items-center gap-6 border-t pt-4"
            style={{ borderColor: 'var(--pv-border)' }}
          >
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="h-4 w-4 rounded border-[var(--pv-border)] text-[var(--pv-primary)] focus:ring-[var(--pv-primary)]"
              />
              <span className="text-sm" style={{ color: 'var(--pv-text)' }}>
                Active Client
              </span>
            </label>
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
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

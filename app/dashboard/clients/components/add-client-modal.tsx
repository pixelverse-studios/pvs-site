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

export function AddClientModal({ isOpen, onClose, onSuccess }: AddClientModalProps) {
  // Form state
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [active, setActive] = useState(true);

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFirstname('');
      setLastname('');
      setCompanyName('');
      setEmail('');
      setPhone('');
      setActive(true);
      setError(null);
    }
  }, [isOpen]);

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

    const payload: ClientCreatePayload = {
      firstname: firstname.trim(),
      lastname: lastname.trim(),
      company_name: companyName.trim() || undefined,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      active,
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
          {/* Contact Name (Required) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="client-firstname"
                className="text-sm font-medium"
                style={{ color: 'var(--pv-text)' }}
              >
                First Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="client-firstname"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                placeholder="John"
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="client-lastname"
                className="text-sm font-medium"
                style={{ color: 'var(--pv-text)' }}
              >
                Last Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="client-lastname"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                placeholder="Doe"
              />
            </div>
          </div>

          {/* Company Name (Optional) */}
          <div className="space-y-1.5">
            <label
              htmlFor="company-name"
              className="text-sm font-medium"
              style={{ color: 'var(--pv-text)' }}
            >
              Company Name{' '}
              <span className="font-normal text-[var(--pv-text-muted)]">(optional)</span>
            </label>
            <Input
              id="company-name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Acme Corp, 360 Degree Care"
            />
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-4">
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

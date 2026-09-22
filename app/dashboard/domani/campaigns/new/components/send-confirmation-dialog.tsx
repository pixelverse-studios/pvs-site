'use client';

import { useState, useMemo } from 'react';
import { Loader2, Send, AlertTriangle } from 'lucide-react';
import DOMPurify from 'dompurify';
import { Modal } from '@mantine/core';
import { Button } from '@/components/ui/button';

interface SendConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subject: string;
  htmlContent: string;
  recipientCount: number;
  onConfirm: () => Promise<void>;
}

export function SendConfirmationDialog({
  open,
  onOpenChange,
  subject,
  htmlContent,
  recipientCount,
  onConfirm,
}: SendConfirmationDialogProps) {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sanitizedHtml = useMemo(() => DOMPurify.sanitize(htmlContent), [htmlContent]);

  const handleConfirm = async () => {
    setIsSending(true);
    setError(null);
    try {
      await onConfirm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send campaign');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Modal
      closeButtonProps={{ 'aria-label': 'Close', disabled: isSending }}
      opened={open}
      onClose={() => {
        if (!isSending) onOpenChange(false);
      }}
      title="Confirm Campaign Send"
      size="lg"
      closeOnEscape={!isSending}
      closeOnClickOutside={!isSending}
    >
      <div className="space-y-4">
        <p className="text-sm">
          Review your email before sending to <strong>{recipientCount}</strong> recipient
          {recipientCount !== 1 ? 's' : ''}.
        </p>
        {/* Subject preview */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium" style={{ color: 'var(--pv-text-muted)' }}>
            Subject
          </label>
          <div
            className="rounded-lg border px-4 py-3 text-base font-semibold"
            style={{
              borderColor: 'var(--pv-border)',
              background: 'var(--pv-bg)',
              color: 'var(--pv-text)',
            }}
          >
            {subject}
          </div>
        </div>

        {/* Body preview */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium" style={{ color: 'var(--pv-text-muted)' }}>
            Email Body
          </label>
          <div
            className="prose prose-sm max-h-[300px] max-w-none overflow-y-auto rounded-lg border px-4 py-3 dark:prose-invert"
            style={{
              borderColor: 'var(--pv-border)',
              background: 'var(--pv-bg)',
            }}
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
          />
        </div>

        {/* Error */}
        {error && (
          <div
            className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400"
            role="alert"
          >
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={isSending}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isSending}>
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send to {recipientCount} recipient{recipientCount !== 1 ? 's' : ''}
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

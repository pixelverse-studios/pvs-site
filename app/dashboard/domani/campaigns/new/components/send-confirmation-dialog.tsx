'use client';

import { useState } from 'react';
import { Loader2, Send, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
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

  const handleConfirm = async () => {
    setIsSending(true);
    setError(null);
    try {
      await onConfirm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send campaign');
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={isSending ? undefined : onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle>Confirm Campaign Send</DialogTitle>
          <DialogDescription>
            Review your email before sending to{' '}
            <strong className="text-[var(--pv-text)]">{recipientCount}</strong> recipient
            {recipientCount !== 1 ? 's' : ''}.
          </DialogDescription>
        </DialogHeader>

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
            className="prose prose-sm dark:prose-invert max-h-[300px] max-w-none overflow-y-auto rounded-lg border px-4 py-3"
            style={{
              borderColor: 'var(--pv-border)',
              background: 'var(--pv-bg)',
            }}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
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

        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
            disabled={isSending}
          >
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

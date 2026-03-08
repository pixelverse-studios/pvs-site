'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Eye, Send, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RichTextEditor } from '@/components/dashboard/agenda/rich-text-editor';
import { previewCampaign, sendCampaign } from '@/lib/api/email-campaigns';
import type { UserProfile } from '@/lib/types/domani-users';
import { RecipientSelector } from './recipient-selector';
import { SendConfirmationDialog } from './send-confirmation-dialog';

interface ComposePageClientProps {
  initialUsers: UserProfile[];
  initialTotal: number;
  senderEmail: string;
}

interface StatusMessage {
  type: 'success' | 'error';
  text: string;
}

export function ComposePageClient({
  initialUsers,
  initialTotal,
  senderEmail,
}: ComposePageClientProps) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [subject, setSubject] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [status, setStatus] = useState<StatusMessage | null>(null);

  const isFormValid = subject.trim() !== '' && htmlContent.trim() !== '' && htmlContent !== '<p></p>';
  const canSend = isFormValid && selectedIds.size > 0;

  const dismissStatus = useCallback(() => setStatus(null), []);

  const handlePreview = async () => {
    setIsPreviewing(true);
    setStatus(null);
    try {
      await previewCampaign({ subject, htmlContent });
      setStatus({ type: 'success', text: 'Preview sent to Phil & Sami — check your inbox.' });
    } catch (err) {
      setStatus({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to send preview',
      });
    } finally {
      setIsPreviewing(false);
    }
  };

  const handleConfirmSend = async () => {
    const result = await sendCampaign({
      subject,
      htmlContent,
      recipientIds: Array.from(selectedIds),
      sentBy: senderEmail,
    });

    setStatus({
      type: 'success',
      text: `Campaign sent: ${result.successful} successful, ${result.failed} failed out of ${result.total} recipients.`,
    });

    setShowConfirmDialog(false);

    // Redirect to campaign history after short delay
    setTimeout(() => {
      router.push('/dashboard/domani/campaigns');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/domani/campaigns">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--pv-text)' }}>
            New Campaign
          </h1>
          <p className="text-sm" style={{ color: 'var(--pv-text-muted)' }}>
            Compose and send an email to Domani users
          </p>
        </div>
      </div>

      {/* Status banner */}
      {status && (
        <div
          className={`flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${
            status.type === 'success'
              ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-900/50 dark:bg-green-900/20 dark:text-green-400'
              : 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400'
          }`}
          role="alert"
        >
          <div className="flex items-center gap-2">
            {status.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            ) : (
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            )}
            {status.text}
          </div>
          <button
            onClick={dismissStatus}
            className="flex-shrink-0 rounded p-0.5 transition-colors hover:bg-black/10 dark:hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Recipients section */}
      <section
        className="rounded-2xl border p-6"
        style={{
          background: 'var(--pv-surface)',
          borderColor: 'var(--pv-border)',
        }}
      >
        <h2 className="mb-4 text-base font-semibold" style={{ color: 'var(--pv-text)' }}>
          Recipients
        </h2>
        <RecipientSelector
          initialUsers={initialUsers}
          initialTotal={initialTotal}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
        />
      </section>

      {/* Compose section */}
      <section
        className="rounded-2xl border p-6"
        style={{
          background: 'var(--pv-surface)',
          borderColor: 'var(--pv-border)',
        }}
      >
        <h2 className="mb-4 text-base font-semibold" style={{ color: 'var(--pv-text)' }}>
          Email Content
        </h2>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="subject"
              className="text-sm font-medium"
              style={{ color: 'var(--pv-text)' }}
            >
              Subject Line
            </label>
            <Input
              id="subject"
              placeholder="e.g. Domani v2.0 is here!"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium" style={{ color: 'var(--pv-text)' }}>
              Body
            </label>
            <RichTextEditor
              content={htmlContent}
              onChange={setHtmlContent}
              placeholder="Write your email content..."
              minHeight="200px"
            />
          </div>
        </div>
      </section>

      {/* Action bar */}
      <div
        className="sticky bottom-0 flex items-center justify-end gap-3 rounded-2xl border px-6 py-4"
        style={{
          background: 'var(--pv-surface)',
          borderColor: 'var(--pv-border)',
        }}
      >
        <Button
          variant="secondary"
          onClick={handlePreview}
          disabled={!isFormValid || isPreviewing}
        >
          {isPreviewing ? (
            <>
              <Eye className="mr-2 h-4 w-4 animate-pulse" />
              Sending preview...
            </>
          ) : (
            <>
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </>
          )}
        </Button>
        <Button
          onClick={() => setShowConfirmDialog(true)}
          disabled={!canSend}
        >
          <Send className="mr-2 h-4 w-4" />
          Send to {selectedIds.size} recipient{selectedIds.size !== 1 ? 's' : ''}
        </Button>
      </div>

      {/* Confirmation dialog */}
      <SendConfirmationDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        subject={subject}
        htmlContent={htmlContent}
        recipientCount={selectedIds.size}
        onConfirm={handleConfirmSend}
      />
    </div>
  );
}

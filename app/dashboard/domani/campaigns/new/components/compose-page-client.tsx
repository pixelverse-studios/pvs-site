'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Eye,
  Send,
  CheckCircle2,
  AlertTriangle,
  X,
  Users,
  ChevronDown,
  Mail,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RichTextEditor } from '@/components/dashboard/agenda/rich-text-editor';
import { previewCampaign, sendCampaign } from '@/lib/api/email-campaigns';
import type { UserProfile } from '@/lib/types/domani-users';
import { cn } from '@/lib/utils';
import { RecipientSelector } from './recipient-selector';
import { SendConfirmationDialog } from './send-confirmation-dialog';

interface ComposePageClientProps {
  initialUsers: UserProfile[];
  initialTotal: number;
  senderEmail: string;
  initialLoadError?: boolean;
}

interface StatusMessage {
  type: 'success' | 'error';
  text: string;
}

export function ComposePageClient({
  initialUsers,
  initialTotal,
  senderEmail,
  initialLoadError = false,
}: ComposePageClientProps) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [subject, setSubject] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [status, setStatus] = useState<StatusMessage | null>(
    initialLoadError
      ? { type: 'error', text: 'Failed to load recipients. Please refresh the page.' }
      : null,
  );
  const [recipientsOpen, setRecipientsOpen] = useState(true);
  const [contentOpen, setContentOpen] = useState(true);

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
    try {
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

      setTimeout(() => {
        router.push('/dashboard/domani/campaigns');
      }, 2000);
    } catch (err) {
      throw err;
    }
  };

  const statusBanner = status && (
    <div
      className={cn(
        'flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm',
        status.type === 'success'
          ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
          : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400',
      )}
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
  );

  return (
    <div className="space-y-5">
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

      {statusBanner}

      {/* Recipients section */}
      <section
        className="rounded-2xl"
        style={{
          background: 'var(--pv-surface)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
        }}
      >
        <button
          onClick={() => setRecipientsOpen(!recipientsOpen)}
          className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:opacity-80"
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{
                background: 'linear-gradient(135deg, rgba(63,0,233,0.1), rgba(201,71,255,0.06))',
              }}
            >
              <Users className="h-4 w-4" style={{ color: 'var(--pv-primary)' }} />
            </div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-sm font-semibold" style={{ color: 'var(--pv-text)' }}>
                Recipients
              </h2>
              {selectedIds.size > 0 && (
                <span
                  className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-xs font-semibold text-white"
                  style={{ background: 'var(--pv-primary)' }}
                >
                  {selectedIds.size}
                </span>
              )}
              {!recipientsOpen && selectedIds.size > 0 && (
                <span className="text-xs" style={{ color: 'var(--pv-text-muted)' }}>
                  {selectedIds.size} recipient{selectedIds.size !== 1 ? 's' : ''} selected
                </span>
              )}
              {!recipientsOpen && selectedIds.size === 0 && (
                <span className="text-xs" style={{ color: 'var(--pv-text-muted)' }}>
                  No recipients selected
                </span>
              )}
            </div>
          </div>
          <ChevronDown
            className={cn(
              'h-4 w-4 transition-transform duration-200',
              recipientsOpen && 'rotate-180',
            )}
            style={{ color: 'var(--pv-text-muted)' }}
          />
        </button>
        <div
          className="grid transition-all duration-300 ease-in-out"
          style={{
            gridTemplateRows: recipientsOpen ? '1fr' : '0fr',
          }}
        >
          <div className="overflow-hidden">
            <div
              className="px-6 pb-5"
              style={{ borderTop: '1px solid var(--pv-border)' }}
            >
              <div className="pt-5">
                <RecipientSelector
                  initialUsers={initialUsers}
                  initialTotal={initialTotal}
                  selectedIds={selectedIds}
                  onSelectionChange={setSelectedIds}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Email content section */}
      <section
        className="rounded-2xl"
        style={{
          background: 'var(--pv-surface)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
        }}
      >
        <button
          onClick={() => setContentOpen(!contentOpen)}
          className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:opacity-80"
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{
                background: 'linear-gradient(135deg, rgba(63,0,233,0.1), rgba(201,71,255,0.06))',
              }}
            >
              <Mail className="h-4 w-4" style={{ color: 'var(--pv-primary)' }} />
            </div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-sm font-semibold" style={{ color: 'var(--pv-text)' }}>
                Email Content
              </h2>
              {!contentOpen && subject.trim() && (
                <span
                  className="max-w-[400px] truncate text-xs"
                  style={{ color: 'var(--pv-text-muted)' }}
                >
                  {subject}
                </span>
              )}
            </div>
          </div>
          <ChevronDown
            className={cn(
              'h-4 w-4 transition-transform duration-200',
              contentOpen && 'rotate-180',
            )}
            style={{ color: 'var(--pv-text-muted)' }}
          />
        </button>
        <div
          className="grid transition-all duration-300 ease-in-out"
          style={{
            gridTemplateRows: contentOpen ? '1fr' : '0fr',
          }}
        >
          <div className="overflow-hidden">
            <div
              className="space-y-5 px-6 pb-6"
              style={{ borderTop: '1px solid var(--pv-border)' }}
            >
              <div className="pt-5">
                {/* Subject */}
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
                    maxLength={200}
                    className="h-11 rounded-xl border-none text-base"
                    style={{
                      background: 'var(--pv-bg)',
                    }}
                  />
                </div>
              </div>

              {/* Body */}
              <div className="space-y-1.5">
                <label
                  className="text-sm font-medium"
                  style={{ color: 'var(--pv-text)' }}
                >
                  Body
                </label>
                <div
                  className="overflow-hidden rounded-xl"
                  style={{ background: 'var(--pv-bg)' }}
                >
                  <RichTextEditor
                    content={htmlContent}
                    onChange={setHtmlContent}
                    placeholder="Write your email content..."
                    minHeight="280px"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Action bar */}
      <div
        className="sticky bottom-4 flex items-center justify-between gap-3 rounded-2xl px-6 py-4"
        style={{
          background: 'var(--pv-surface)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)',
        }}
      >
        <div className="text-sm" style={{ color: 'var(--pv-text-muted)' }}>
          {selectedIds.size > 0 ? (
            <span>
              <strong style={{ color: 'var(--pv-text)' }}>{selectedIds.size}</strong> recipient
              {selectedIds.size !== 1 ? 's' : ''} selected
            </span>
          ) : (
            <span>No recipients selected</span>
          )}
        </div>
        <div className="flex items-center gap-3">
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
          <Button onClick={() => setShowConfirmDialog(true)} disabled={!canSend}>
            <Send className="mr-2 h-4 w-4" />
            Send Campaign
          </Button>
        </div>
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

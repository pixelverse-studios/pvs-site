'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  X,
  Calendar,
  Send,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Mail,
} from 'lucide-react';
import DOMPurify from 'dompurify';
import { cn } from '@/lib/utils';
import type { Campaign } from '@/lib/types/email-campaign';
import {
  DELIVERY_STATUS_COLORS,
  TEMPLATE_TYPE_COLORS,
} from '@/lib/types/email-campaign';

interface CampaignDetailModalProps {
  campaign: Campaign | null;
  isOpen: boolean;
  onClose: () => void;
}

function formatDate(dateString: string) {
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return 'Unknown date';
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function CampaignDetailModal({
  campaign,
  isOpen,
  onClose,
}: CampaignDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'email' | 'recipients'>('email');

  const sanitizedHtml = useMemo(
    () => (campaign ? DOMPurify.sanitize(campaign.html_content || '') : ''),
    [campaign?.html_content],
  );

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Reset to email tab when opening a new campaign
  useEffect(() => {
    if (isOpen) setActiveTab('email');
  }, [isOpen, campaign?.id]);

  if (!isOpen || !campaign) return null;

  const templateConfig = TEMPLATE_TYPE_COLORS[campaign.template_type] ?? {
    label: (campaign.template_type || 'custom')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase()),
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-100 dark:bg-gray-800/50',
  };

  const successRate =
    campaign.recipient_count > 0
      ? Math.round((campaign.successful / campaign.recipient_count) * 100)
      : 0;

  const recipients = campaign.recipients ?? [];
  const hasRecipients = recipients.length > 0;
  const hasEmailContent = sanitizedHtml.trim().length > 0;

  // Sort failed to top
  const sortedRecipients = [...recipients].sort(
    (a, b) => Number(a.success) - Number(b.success),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label={`Campaign details: ${campaign.subject}`}
        style={{
          background: 'var(--pv-bg)',
          borderColor: 'var(--pv-border)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-start justify-between border-b px-6 py-4"
          style={{ borderColor: 'var(--pv-border)' }}
        >
          <div className="mr-4 min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <h2
                className="truncate text-lg font-semibold"
                style={{ color: 'var(--pv-text)' }}
              >
                {campaign.subject}
              </h2>
              <span
                className={cn(
                  'inline-flex flex-shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                  templateConfig.color,
                  templateConfig.bgColor,
                )}
              >
                {templateConfig.label}
              </span>
            </div>
            <div className="mt-1.5 flex items-center gap-4 text-xs" style={{ color: 'var(--pv-text-muted)' }}>
              <span className="flex items-center gap-1">
                <Send className="h-3 w-3" />
                {campaign.sent_by}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(campaign.created_at)}
              </span>
              <span className="h-3 w-px" style={{ background: 'var(--pv-border)' }} />
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" style={{ color: 'var(--pv-primary)' }} />
                <span style={{ color: 'var(--pv-text)' }} className="font-medium">{campaign.recipient_count}</span>
                sent
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-green-500" />
                <span style={{ color: 'var(--pv-text)' }} className="font-medium">{campaign.successful}</span>
                delivered ({successRate}%)
              </span>
              {campaign.failed > 0 && (
                <span className="flex items-center gap-1 text-red-500">
                  <XCircle className="h-3 w-3" />
                  <span className="font-medium">{campaign.failed}</span>
                  failed
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 rounded-lg p-2 transition-colors hover:bg-[var(--pv-surface)]"
          >
            <X className="h-5 w-5 text-[var(--pv-text-muted)]" />
          </button>
        </div>

        {/* Tab bar */}
        <div
          className="flex gap-0 border-b px-6"
          style={{ borderColor: 'var(--pv-border)' }}
        >
          <button
            onClick={() => setActiveTab('email')}
            className={cn(
              'relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors',
              activeTab === 'email'
                ? 'text-[var(--pv-primary)]'
                : 'text-[var(--pv-text-muted)] hover:text-[var(--pv-text)]',
            )}
          >
            <Mail className="h-4 w-4" />
            Email Content
            {activeTab === 'email' && (
              <span
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                style={{ background: 'var(--pv-primary)' }}
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('recipients')}
            className={cn(
              'relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors',
              activeTab === 'recipients'
                ? 'text-[var(--pv-primary)]'
                : 'text-[var(--pv-text-muted)] hover:text-[var(--pv-text)]',
            )}
          >
            <Users className="h-4 w-4" />
            Recipients ({recipients.length})
            {activeTab === 'recipients' && (
              <span
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                style={{ background: 'var(--pv-primary)' }}
              />
            )}
          </button>
        </div>

        {/* Tab content */}
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          {activeTab === 'email' && (
            hasEmailContent ? (
              <div
                className="prose prose-sm dark:prose-invert max-w-none rounded-xl border p-5"
                style={{
                  borderColor: 'var(--pv-border)',
                  background: 'var(--pv-surface)',
                }}
                dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
              />
            ) : (
              <div
                className="flex items-center gap-2 rounded-xl border px-5 py-8 text-sm"
                style={{
                  borderColor: 'var(--pv-border)',
                  background: 'var(--pv-surface)',
                  color: 'var(--pv-text-muted)',
                }}
              >
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                Email content not available for this campaign.
              </div>
            )
          )}

          {activeTab === 'recipients' && (
            hasRecipients ? (
              <div
                className="overflow-hidden rounded-xl border"
                style={{
                  borderColor: 'var(--pv-border)',
                  background: 'var(--pv-surface)',
                }}
              >
                <table className="w-full">
                  <thead>
                    <tr
                      className="sticky top-0 text-left text-xs font-medium"
                      style={{
                        background: 'var(--pv-surface)',
                        color: 'var(--pv-text-muted)',
                        borderBottom: '1px solid var(--pv-border)',
                      }}
                    >
                      <th className="px-4 py-2.5">Name</th>
                      <th className="px-4 py-2.5">Email</th>
                      <th className="px-4 py-2.5 text-center">Status</th>
                      <th className="px-4 py-2.5">Error</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedRecipients.map((recipient, idx) => {
                      const statusKey = recipient.success ? 'success' : 'failed';
                      const statusConfig = DELIVERY_STATUS_COLORS[statusKey];

                      return (
                        <tr
                          key={`${recipient.email}-${idx}`}
                          className="text-sm"
                          style={{ borderBottom: '1px solid var(--pv-border)' }}
                        >
                          <td
                            className="px-4 py-2.5 font-medium"
                            style={{ color: 'var(--pv-text)' }}
                          >
                            {recipient.name || 'No name'}
                          </td>
                          <td
                            className="px-4 py-2.5"
                            style={{ color: 'var(--pv-text-muted)' }}
                          >
                            {recipient.email}
                          </td>
                          <td className="px-4 py-2.5 text-center">
                            <span
                              className={cn(
                                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                                statusConfig.color,
                                statusConfig.bgColor,
                              )}
                            >
                              {recipient.success ? (
                                <CheckCircle2 className="h-3 w-3" />
                              ) : (
                                <XCircle className="h-3 w-3" />
                              )}
                              {statusConfig.label}
                            </span>
                          </td>
                          <td className="px-4 py-2.5">
                            {recipient.error ? (
                              <span className="flex items-center gap-1 text-xs text-red-500 dark:text-red-400">
                                <AlertTriangle className="h-3 w-3 flex-shrink-0" />
                                {recipient.error}
                              </span>
                            ) : (
                              <span className="text-xs" style={{ color: 'var(--pv-text-muted)' }}>
                                —
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex items-center gap-2 py-8 text-sm" style={{ color: 'var(--pv-text-muted)' }}>
                <Users className="h-4 w-4 opacity-40" />
                Recipient data not available for this campaign.
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

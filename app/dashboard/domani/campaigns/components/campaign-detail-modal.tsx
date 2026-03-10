'use client';

import { useEffect, useMemo } from 'react';
import {
  X,
  Calendar,
  Send,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
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
    weekday: 'long',
    month: 'long',
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
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border shadow-2xl"
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
          className="sticky top-0 z-10 flex items-start justify-between border-b px-6 py-5"
          style={{
            background: 'var(--pv-bg)',
            borderColor: 'var(--pv-border)',
          }}
        >
          <div className="mr-4 min-w-0 flex-1">
            <h2
              className="truncate text-lg font-semibold"
              style={{ color: 'var(--pv-text)' }}
            >
              {campaign.subject}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
              <span
                className={cn(
                  'inline-flex items-center rounded-full px-2 py-0.5 font-medium',
                  templateConfig.color,
                  templateConfig.bgColor,
                )}
              >
                {templateConfig.label}
              </span>
              <span
                className="flex items-center gap-1"
                style={{ color: 'var(--pv-text-muted)' }}
              >
                <Send className="h-3 w-3" />
                {campaign.sent_by}
              </span>
              <span
                className="flex items-center gap-1"
                style={{ color: 'var(--pv-text-muted)' }}
              >
                <Calendar className="h-3 w-3" />
                {formatDate(campaign.created_at)}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 transition-colors hover:bg-[var(--pv-surface)]"
          >
            <X className="h-5 w-5 text-[var(--pv-text-muted)]" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 p-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <StatCard
              icon={<Users className="h-4 w-4" />}
              label="Total Recipients"
              value={campaign.recipient_count}
              color="var(--pv-primary)"
            />
            <StatCard
              icon={<CheckCircle2 className="h-4 w-4" />}
              label="Successful"
              value={`${campaign.successful} (${successRate}%)`}
              color="#22c55e"
            />
            <StatCard
              icon={<XCircle className="h-4 w-4" />}
              label="Failed"
              value={campaign.failed}
              color={campaign.failed > 0 ? '#ef4444' : 'var(--pv-text-muted)'}
            />
          </div>

          {/* Email Body Preview */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[var(--pv-text-muted)]">
              Email Content
            </label>
            <div
              className="prose prose-sm dark:prose-invert max-h-[300px] max-w-none overflow-y-auto rounded-xl border p-5"
              style={{
                borderColor: 'var(--pv-border)',
                background: 'var(--pv-surface)',
              }}
              dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
            />
          </div>

          {/* Recipient Table */}
          {campaign.recipients && campaign.recipients.length > 0 && (
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[var(--pv-text-muted)]">
                Recipients ({campaign.recipients.length})
              </label>
              <div
                className="max-h-[320px] overflow-y-auto rounded-xl border"
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
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3 text-center">Status</th>
                      <th className="px-4 py-3">Error</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaign.recipients.map((recipient, idx) => {
                      const statusKey = recipient.success
                        ? 'success'
                        : 'failed';
                      const statusConfig = DELIVERY_STATUS_COLORS[statusKey];

                      return (
                        <tr
                          key={`${recipient.email}-${idx}`}
                          className="text-sm"
                          style={{
                            borderBottom: '1px solid var(--pv-border)',
                          }}
                        >
                          <td
                            className="px-4 py-3 font-medium"
                            style={{ color: 'var(--pv-text)' }}
                          >
                            {recipient.name || 'No name'}
                          </td>
                          <td
                            className="px-4 py-3"
                            style={{ color: 'var(--pv-text-muted)' }}
                          >
                            {recipient.email}
                          </td>
                          <td className="px-4 py-3 text-center">
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
                          <td className="px-4 py-3">
                            {recipient.error ? (
                              <span className="flex items-center gap-1 text-xs text-red-500 dark:text-red-400">
                                <AlertTriangle className="h-3 w-3 flex-shrink-0" />
                                {recipient.error}
                              </span>
                            ) : (
                              <span
                                className="text-xs"
                                style={{ color: 'var(--pv-text-muted)' }}
                              >
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
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="sticky bottom-0 flex justify-end border-t px-6 py-4"
          style={{
            background: 'var(--pv-bg)',
            borderColor: 'var(--pv-border)',
          }}
        >
          <button
            onClick={onClose}
            className="rounded-xl px-5 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--pv-surface)]"
            style={{ color: 'var(--pv-text)' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div
      className="rounded-xl border px-4 py-3"
      style={{
        borderColor: 'var(--pv-border)',
        background: 'var(--pv-surface)',
      }}
    >
      <div className="flex items-center gap-2 text-xs" style={{ color }}>
        {icon}
        <span className="font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p
        className="mt-1 text-lg font-semibold"
        style={{ color: 'var(--pv-text)' }}
      >
        {value}
      </p>
    </div>
  );
}

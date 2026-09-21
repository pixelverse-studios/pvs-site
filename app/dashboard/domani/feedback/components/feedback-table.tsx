'use client';

import React, { Fragment, useEffect, useState } from 'react';
import { ChevronRight, Smartphone, X } from 'lucide-react';
import { getFeedbackItem } from '@/lib/api/feedback';
import { feedbackDelivery } from '@/lib/feedback-delivery';
import { cn } from '@/lib/utils';
import type {
  UnifiedFeedbackItem,
  WritableFeedbackStatus,
  FeedbackStatus,
  CategoryConfig,
} from '@/lib/types/feedback';
import { CATEGORY_COLORS, STATUS_COLORS, feedbackKey } from '@/lib/types/feedback';

import { FeedbackReplyComposer, emptyReplyDraft } from './feedback-reply-composer';
import { useFeedbackDrafts } from '@/components/feedback-drafts-provider';
import { FeedbackDetailDrawer } from './feedback-detail-drawer';

// Fallback config for unknown categories
const UNKNOWN_CATEGORY_CONFIG: CategoryConfig = {
  label: 'Unknown',
  color: 'text-gray-600 dark:text-gray-400',
  bgColor: 'bg-gray-100 dark:bg-gray-800/50',
};

interface FeedbackTableProps {
  statusError?: string;
  refreshError?: string;
  refreshing?: boolean;
  onRetry?: () => void;
  items: UnifiedFeedbackItem[];
  disabled?: boolean;
  onStatusChange: (
    id: string,
    source: 'beta_feedback' | 'support_request',
    status: WritableFeedbackStatus,
  ) => Promise<void>;
}

export function FeedbackTable({
  items: baseItems,
  onStatusChange,
  disabled,
  statusError,
  refreshError,
  refreshing,
  onRetry,
}: FeedbackTableProps) {
  const { drafts, setDrafts } = useFeedbackDrafts();
  const [summaries, setSummaries] = useState<Record<string, UnifiedFeedbackItem['conversation']>>(
    {},
  );
  useEffect(() => setSummaries({}), [baseItems]);
  const items = baseItems.map((item) => ({
    ...item,
    conversation: summaries[feedbackKey(item)] || item.conversation,
  }));
  const refreshSummary = async (item: UnifiedFeedbackItem) => {
    try {
      const fresh = await getFeedbackItem(item.id, item.source);
      setSummaries((previous) => ({ ...previous, [feedbackKey(item)]: fresh.conversation }));
    } catch {
      /* The next list refresh can recover; never turn an accepted send into a failure. */
    }
  };

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drawerItem, setDrawerItem] = useState<UnifiedFeedbackItem | null>(null);

  const toggleRow = (id: string) => {
    setSelectedId((currentId) => (currentId === id ? null : id));
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString || Number.isNaN(Date.parse(dateString))) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const truncateMessage = (message: string, maxLength = 80) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  return (
    <>
      {items.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center rounded-xl border py-16"
          style={{ borderColor: 'var(--pv-border)', background: 'var(--pv-surface)' }}
        >
          <Smartphone className="mb-4 h-12 w-12 text-[var(--pv-text-muted)]" />
          <p className="text-lg font-medium" style={{ color: 'var(--pv-text)' }}>
            No feedback found
          </p>
          <p className="mt-1 text-sm text-[var(--pv-text-muted)]">
            Feedback and support requests will appear here
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div
            className="hidden max-h-[calc(100vh-580px)] overflow-auto rounded-xl border md:block"
            style={{ borderColor: 'var(--pv-border)' }}
          >
            <table className="w-full min-w-[1120px] table-fixed">
              <colgroup>
                <col className="w-12" />
                <col className="w-44" />
                <col className="w-28" />
                <col className="w-60" />
                <col />
                <col className="w-28" />
                <col className="w-28" />
              </colgroup>
              <thead className="sticky top-0 z-10">
                <tr style={{ background: 'var(--pv-surface)' }}>
                  <th scope="col" className="px-2 py-3">
                    <span className="sr-only">Expand feedback</span>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--pv-text-muted)]"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--pv-text-muted)]"
                  >
                    Category
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--pv-text-muted)]"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-[var(--pv-text)]"
                  >
                    Message
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--pv-text-muted)]"
                  >
                    Platform
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--pv-text-muted)]"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const isSelected = selectedId === feedbackKey(item);
                  const categoryConfig = CATEGORY_COLORS[item.category] || UNKNOWN_CATEGORY_CONFIG;
                  const statusConfig = STATUS_COLORS[item.status] || STATUS_COLORS.unknown;

                  return (
                    <Fragment key={feedbackKey(item)}>
                      <tr
                        className={cn(
                          'border-t transition-colors',
                          isSelected ? 'bg-[var(--pv-primary)]/5' : 'hover:bg-[var(--pv-surface)]',
                        )}
                        style={{ borderColor: 'var(--pv-border)' }}
                      >
                        <td className="px-2 py-3 text-center align-top">
                          <button
                            type="button"
                            className="hover:bg-[var(--pv-primary)]/10 inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--pv-text-muted)] transition-colors hover:text-[var(--pv-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-primary)] focus-visible:ring-offset-2"
                            aria-label={`${isSelected ? 'Collapse' : 'Expand'} feedback from ${item.email || 'unknown email'}`}
                            aria-expanded={isSelected}
                            aria-controls={`feedback-details-${feedbackKey(item)}`}
                            onClick={() => toggleRow(feedbackKey(item))}
                          >
                            <ChevronRight
                              aria-hidden="true"
                              className={cn(
                                'h-4 w-4 transition-transform',
                                isSelected && 'rotate-90 text-[var(--pv-primary)]',
                              )}
                            />
                          </button>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 align-top text-[13px] text-[var(--pv-text-muted)]">
                          {formatDate(item.created_at)}
                        </td>
                        <td className="px-3 py-4 align-top">
                          <span
                            className={cn(
                              'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
                              categoryConfig.bgColor,
                              categoryConfig.color,
                            )}
                          >
                            {categoryConfig.label}
                          </span>
                        </td>
                        <td
                          className="px-3 py-4 align-top text-sm"
                          style={{ color: 'var(--pv-text)' }}
                        >
                          <span className="block truncate" title={item.email || 'Unknown email'}>
                            {item.email || 'Unknown email'}
                          </span>
                        </td>
                        <td className="px-5 py-4 align-top">
                          <p
                            className="line-clamp-3 break-words text-[15px] leading-6 text-[var(--pv-text)]"
                            title={item.message}
                          >
                            {truncateMessage(item.message, 180)}
                          </p>
                          <ReplySummary item={item} />
                        </td>
                        <td className="px-3 py-4 align-top">
                          <PlatformBadge platform={item.platform} />
                        </td>
                        <td className="px-3 py-4 align-top">
                          <span
                            className={cn(
                              'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
                              statusConfig.bgColor,
                              statusConfig.color,
                            )}
                          >
                            {statusConfig.label}
                          </span>
                        </td>
                      </tr>
                      {/* Inline expanded detail row */}
                      {isSelected && (
                        <tr
                          id={`feedback-details-${feedbackKey(item)}`}
                          className="border-t bg-[var(--pv-surface)]"
                          style={{ borderColor: 'var(--pv-border)' }}
                        >
                          <td colSpan={7} className="p-0">
                            <InlineDetailPanel
                              item={item}
                              onClose={() => setSelectedId(null)}
                              onStatusChange={onStatusChange}
                              disabled={disabled}
                              onViewDetails={() => setDrawerItem(item)}
                            />
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="max-h-[calc(100vh-540px)] space-y-3 overflow-auto md:hidden">
            {items.map((item) => {
              const categoryConfig = CATEGORY_COLORS[item.category] || UNKNOWN_CATEGORY_CONFIG;
              const statusConfig = STATUS_COLORS[item.status] || STATUS_COLORS.unknown;

              return (
                <div
                  key={feedbackKey(item)}
                  className="rounded-xl border p-4"
                  style={{ borderColor: 'var(--pv-border)', background: 'var(--pv-surface)' }}
                  onClick={() => setDrawerItem(item)}
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
                          categoryConfig.bgColor,
                          categoryConfig.color,
                        )}
                      >
                        {categoryConfig.label}
                      </span>
                      <PlatformBadge platform={item.platform} />
                    </div>
                    <span
                      className={cn(
                        'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
                        statusConfig.bgColor,
                        statusConfig.color,
                      )}
                    >
                      {statusConfig.label}
                    </span>
                  </div>
                  <p className="mb-2 text-sm font-medium" style={{ color: 'var(--pv-text)' }}>
                    {item.email || 'Unknown email'}
                  </p>
                  <p className="mb-2 text-sm text-[var(--pv-text-muted)]">
                    {truncateMessage(item.message, 100)}
                  </p>
                  <ReplySummary item={item} />
                  <p className="text-xs text-[var(--pv-text-muted)]">
                    {formatDate(item.created_at)}
                  </p>
                </div>
              );
            })}
          </div>
        </>
      )}
      {/* Keep the active drawer mounted independently of filtered results. */}
      <FeedbackDetailDrawer
        composer={
          drawerItem ? (
            <FeedbackReplyComposer
              key={feedbackKey(drawerItem)}
              item={drawerItem}
              onHistoryChanged={() => void refreshSummary(drawerItem)}
              draft={drafts[feedbackKey(drawerItem)] || emptyReplyDraft()}
              onChange={(draft) =>
                setDrafts((previous) => ({ ...previous, [feedbackKey(drawerItem)]: draft }))
              }
            />
          ) : undefined
        }
        item={
          items.find((item) => drawerItem && feedbackKey(item) === feedbackKey(drawerItem)) ||
          drawerItem
        }
        isOpen={!!drawerItem}
        statusError={statusError}
        refreshError={refreshError}
        refreshing={refreshing}
        onRetry={onRetry}
        onClose={() => setDrawerItem(null)}
        onStatusChange={onStatusChange}
        disabled={disabled}
      />
    </>
  );
}

function InlineDetailPanel({
  item,
  onClose,
  onStatusChange,
  onViewDetails,
  disabled,
}: {
  item: UnifiedFeedbackItem;
  onClose: () => void;
  onStatusChange: (
    id: string,
    source: 'beta_feedback' | 'support_request',
    status: WritableFeedbackStatus,
  ) => Promise<void>;
  onViewDetails: () => void;
  disabled?: boolean;
}) {
  const categoryConfig = CATEGORY_COLORS[item.category] || UNKNOWN_CATEGORY_CONFIG;

  return (
    <div style={{ background: 'var(--pv-surface)' }}>
      {/* Header */}
      <div
        className="flex items-center justify-between border-b px-6 py-3"
        style={{ borderColor: 'var(--pv-border)' }}
      >
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
              categoryConfig.bgColor,
              categoryConfig.color,
            )}
          >
            {categoryConfig.label}
          </span>
          <span className="text-sm font-medium" style={{ color: 'var(--pv-text)' }}>
            {item.email || 'Unknown email'}
          </span>
          <PlatformBadge platform={item.platform} />
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="rounded-lg p-2 text-[var(--pv-text-muted)] transition-colors hover:bg-[var(--pv-bg)] hover:text-[var(--pv-text)]"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4 px-6 py-4">
        {/* Full Message */}
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--pv-text-muted)]">
            Full Message
          </h4>
          <p className="whitespace-pre-wrap text-sm" style={{ color: 'var(--pv-text)' }}>
            {item.message}
          </p>
        </div>

        {/* Device Info */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <InfoField
            label="Device"
            value={`${item.device_brand || ''} ${item.device_model || ''}`.trim() || 'Unknown'}
          />
          <InfoField label="OS Version" value={item.os_version || 'Unknown'} />
          <InfoField label="App Version" value={item.app_version || 'Unknown'} />
          <InfoField label="Build" value={item.app_build || 'N/A'} />
        </div>

        {/* Actions */}
        <div
          className="flex flex-wrap items-center gap-3 border-t pt-4"
          style={{ borderColor: 'var(--pv-border)' }}
        >
          <StatusButtons
            currentStatus={item.status}
            disabled={disabled}
            onStatusChange={(status) => onStatusChange(item.id, item.source, status)}
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails();
            }}
            className="text-sm font-medium text-[var(--pv-primary)] hover:underline"
          >
            View Full Details
          </button>
          <button
            onClick={(event) => {
              event.stopPropagation();
              onViewDetails();
            }}
            className="rounded-lg bg-[var(--pv-primary)] px-4 py-2 text-sm font-medium text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Reply
          </button>
        </div>
      </div>
    </div>
  );
}

function PlatformBadge({ platform }: { platform: string | null }) {
  if (platform !== 'ios' && platform !== 'android')
    return <span className="text-xs text-[var(--pv-text-muted)]">Unknown</span>;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium',
        platform === 'ios'
          ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
          : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      )}
    >
      {platform === 'ios' ? (
        <>
          <AppleIcon className="h-3 w-3" />
          iOS
        </>
      ) : (
        <>
          <AndroidIcon className="h-3 w-3" />
          Android
        </>
      )}
    </span>
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function AndroidIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.523 15.341c-.5 0-.908.406-.908.908s.408.908.908.908.909-.406.909-.908-.409-.908-.909-.908zm-11.046 0c-.5 0-.908.406-.908.908s.408.908.908.908.908-.406.908-.908-.408-.908-.908-.908zm11.4-5.772l1.997-3.46a.416.416 0 00-.152-.567.416.416 0 00-.568.152L17.12 9.2c-1.527-.694-3.238-1.083-5.12-1.083-1.883 0-3.593.389-5.12 1.083l-2.034-3.506a.416.416 0 00-.568-.152.416.416 0 00-.152.567l1.997 3.46C3.017 11.154 1 14.174 1 17.648h22c0-3.474-2.017-6.494-5.123-8.079z" />
    </svg>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-[var(--pv-text-muted)]">{label}</p>
      <p className="text-sm font-medium" style={{ color: 'var(--pv-text)' }}>
        {value}
      </p>
    </div>
  );
}

function StatusButtons({
  currentStatus,
  onStatusChange,
  disabled,
}: {
  currentStatus: FeedbackStatus;
  disabled?: boolean;
  onStatusChange: (status: WritableFeedbackStatus) => Promise<void>;
}) {
  const statuses: WritableFeedbackStatus[] = ['new', 'reviewed', 'resolved'];

  return (
    <div className="flex items-center gap-1">
      {statuses.map((status) => {
        const config = STATUS_COLORS[status];
        const isActive = currentStatus === status;

        return (
          <button
            key={status}
            disabled={disabled}
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(status);
            }}
            className={cn(
              'rounded-md px-3 py-1.5 text-xs font-medium transition-all',
              isActive
                ? cn(config.bgColor, config.color)
                : 'bg-transparent text-[var(--pv-text-muted)] hover:bg-[var(--pv-bg)]',
            )}
          >
            {config.label}
          </button>
        );
      })}
    </div>
  );
}

function ReplySummary({ item }: { item: UnifiedFeedbackItem }) {
  const summary = item.conversation;
  if (!summary || (!summary.reply_count && !summary.last_incoming_at)) return null;
  return (
    <span className="mt-2 block space-y-1 text-xs text-[var(--pv-text-muted)]">
      {!!summary.unread_count && (
        <span className="block font-semibold text-[var(--pv-primary)]">
          {summary.unread_count} unread {summary.unread_count === 1 ? 'reply' : 'replies'}
        </span>
      )}
      <span className="block font-medium">
        {summary.reply_count} outgoing {summary.reply_count === 1 ? 'reply' : 'replies'} ·{' '}
        {feedbackDelivery(summary.last_delivery_status).label}
        {summary.last_message_at && Number.isFinite(Date.parse(summary.last_message_at)) && (
          <> · {new Date(summary.last_message_at).toLocaleString()}</>
        )}
      </span>
      {summary.last_message_preview && (
        <span className="block truncate">{summary.last_message_preview}</span>
      )}
      {summary.last_incoming_at && Number.isFinite(Date.parse(summary.last_incoming_at)) && (
        <span className="block">
          Last incoming: {new Date(summary.last_incoming_at).toLocaleString()}
          <span className="block truncate">{summary.last_incoming_preview}</span>
        </span>
      )}
    </span>
  );
}

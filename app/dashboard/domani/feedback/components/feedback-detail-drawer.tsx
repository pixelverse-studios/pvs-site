'use client';

import React from 'react';
import { Button } from '@mantine/core';
import { DomaniDrawer } from '../../components/domani-controls';
import { X, Mail, Smartphone, Calendar, Tag, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UnifiedFeedbackItem, WritableFeedbackStatus } from '@/lib/types/feedback';
import { CATEGORY_COLORS, STATUS_COLORS } from '@/lib/types/feedback';
import { RequestError } from '@/components/ui/request-error';

interface FeedbackDetailDrawerProps {
  composer?: React.ReactNode;
  statusError?: string;
  refreshError?: string;
  refreshing?: boolean;
  onRetry?: () => void;
  item: UnifiedFeedbackItem | null;
  isOpen: boolean;
  onClose: () => void;
  disabled?: boolean;
  onStatusChange: (
    id: string,
    source: 'beta_feedback' | 'support_request',
    status: WritableFeedbackStatus,
  ) => Promise<void>;
}

export function FeedbackDetailDrawer(props: FeedbackDetailDrawerProps) {
  return <FeedbackDrawerContent {...props} />;
}

function FeedbackDrawerContent({
  composer,
  item,
  isOpen,
  onClose,
  onStatusChange,
  disabled,
  statusError,
  refreshError,
  refreshing,
  onRetry,
}: FeedbackDetailDrawerProps) {
  if (!item) return null;
  const categoryConfig = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.unknown;

  const formatDate = (dateString: string | null) => {
    if (!dateString || Number.isNaN(Date.parse(dateString))) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const handleStatusChange = (status: WritableFeedbackStatus) => {
    onStatusChange(item.id, item.source, status);
  };

  return (
    <DomaniDrawer
      contained
      opened={isOpen}
      onClose={onClose}
      title="Feedback details"
      closeButtonProps={{ 'aria-label': 'Close feedback details' }}
    >
      <div className="flex min-h-0 flex-1 flex-col">
        {/* Header */}
        <div
          className="flex shrink-0 items-start justify-between gap-4 border-b px-4 py-4 sm:px-6"
          style={{ background: 'var(--pv-bg)', borderColor: 'var(--pv-border)' }}
        >
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={cn(
                  'inline-flex rounded-full px-3 py-1 text-sm font-medium',
                  categoryConfig.bgColor,
                  categoryConfig.color,
                )}
              >
                {categoryConfig.label}
              </span>
              <PlatformBadge platform={item.platform} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div
          data-feedback-scroll
          className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain break-words p-4 sm:p-6"
        >
          {statusError && <RequestError title="Status update failed" message={statusError} />}
          {refreshError && (
            <RequestError
              title="Feedback refresh failed"
              message={refreshError}
              detail="Previously loaded details are shown. Refresh before changing the status."
              action={
                onRetry
                  ? { label: 'Retry refresh', onClick: onRetry, disabled: refreshing }
                  : undefined
              }
            />
          )}
          {refreshing && (
            <p role="status" className="text-sm text-[var(--pv-text-muted)]">
              Refreshing feedback…
            </p>
          )}
          {/* Status Section */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--pv-text-muted)]">
              <Activity className="h-3.5 w-3.5" />
              Status
            </label>
            <div className="flex items-center gap-2">
              {(['new', 'reviewed', 'resolved'] as WritableFeedbackStatus[]).map((status) => {
                const config = STATUS_COLORS[status];
                const isActive = item.status === status;

                return (
                  <Button
                    variant="subtle"
                    key={status}
                    disabled={disabled}
                    onClick={() => handleStatusChange(status)}
                    className={cn(
                      'rounded-lg px-4 py-2 text-sm font-medium transition-all',
                      isActive
                        ? cn(config.bgColor, config.color, 'ring-2 ring-offset-2')
                        : 'bg-[var(--pv-surface)] text-[var(--pv-text-muted)] hover:bg-[var(--pv-border)]',
                    )}
                    style={
                      isActive
                        ? {
                            ['--tw-ring-color' as string]:
                              status === 'new'
                                ? '#3b82f6'
                                : status === 'reviewed'
                                  ? '#f59e0b'
                                  : '#22c55e',
                          }
                        : undefined
                    }
                  >
                    {config.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* User Info */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--pv-text-muted)]">
              <Mail className="h-3.5 w-3.5" />
              User
            </label>
            <p className="text-lg font-medium" style={{ color: 'var(--pv-text)' }}>
              {item.email || 'Unknown email'}
            </p>
            {item.user_id && (
              <p className="mt-1 text-xs text-[var(--pv-text-muted)]">User ID: {item.user_id}</p>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--pv-text-muted)]">
              <Tag className="h-3.5 w-3.5" />
              {item.source === 'support_request' ? 'Support Request' : 'Feedback Message'}
            </label>
            <div
              className="rounded-xl border p-4"
              style={{ borderColor: 'var(--pv-border)', background: 'var(--pv-surface)' }}
            >
              <p
                className="whitespace-pre-wrap text-sm leading-relaxed"
                style={{ color: 'var(--pv-text)' }}
              >
                {item.message}
              </p>
            </div>
          </div>

          {/* Device Information */}
          <div>
            <label className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--pv-text-muted)]">
              <Smartphone className="h-3.5 w-3.5" />
              Device Information
            </label>
            <div
              className="grid grid-cols-2 gap-4 rounded-xl border p-4"
              style={{ borderColor: 'var(--pv-border)', background: 'var(--pv-surface)' }}
            >
              <DeviceInfoRow label="Platform" value={item.platform?.toUpperCase() || 'Unknown'} />
              <DeviceInfoRow
                label="Device"
                value={`${item.device_brand || ''} ${item.device_model || ''}`.trim() || 'Unknown'}
              />
              <DeviceInfoRow label="OS Version" value={item.os_version || 'Unknown'} />
              <DeviceInfoRow label="App Version" value={item.app_version || 'Unknown'} />
              <DeviceInfoRow label="Build Number" value={item.app_build || 'N/A'} />
              <DeviceInfoRow
                label="Source"
                value={item.source === 'beta_feedback' ? 'In-App Feedback' : 'Support Request'}
              />
            </div>
          </div>

          {composer}

          {/* Timestamp */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--pv-text-muted)]">
              <Calendar className="h-3.5 w-3.5" />
              Submitted
            </label>
            <p className="text-sm" style={{ color: 'var(--pv-text)' }}>
              {formatDate(item.created_at)}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex shrink-0 justify-end gap-3 border-t px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6"
          style={{ background: 'var(--pv-bg)', borderColor: 'var(--pv-border)' }}
        >
          <Button
            variant="subtle"
            aria-label="Close feedback details"
            onClick={onClose}
            className="rounded-xl px-5 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--pv-surface)]"
            style={{ color: 'var(--pv-text)' }}
          >
            Close
          </Button>
        </div>
      </div>
    </DomaniDrawer>
  );
}

function DeviceInfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-[var(--pv-text-muted)]">{label}</p>
      <p className="text-sm font-medium" style={{ color: 'var(--pv-text)' }}>
        {value}
      </p>
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

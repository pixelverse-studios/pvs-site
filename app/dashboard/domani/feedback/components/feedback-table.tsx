'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UnifiedFeedbackItem, FeedbackStatus, CategoryConfig } from '@/lib/types/feedback';
import { CATEGORY_COLORS, STATUS_COLORS } from '@/lib/types/feedback';

import { FeedbackDetailModal } from './feedback-detail-modal';

// Fallback config for unknown categories
const UNKNOWN_CATEGORY_CONFIG: CategoryConfig = {
  label: 'Unknown',
  color: 'text-gray-600 dark:text-gray-400',
  bgColor: 'bg-gray-100 dark:bg-gray-800/50',
};

interface FeedbackTableProps {
  items: UnifiedFeedbackItem[];
  onStatusChange: (id: string, source: 'beta_feedback' | 'support_request', status: FeedbackStatus) => void;
}

export function FeedbackTable({ items, onStatusChange }: FeedbackTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<UnifiedFeedbackItem | null>(null);

  const toggleExpanded = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDate = (dateString: string) => {
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

  if (items.length === 0) {
    return (
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
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div
        className="hidden overflow-hidden rounded-xl border md:block"
        style={{ borderColor: 'var(--pv-border)' }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ background: 'var(--pv-surface)' }}>
              <th className="w-8 px-4 py-3"></th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--pv-text-muted)]">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--pv-text-muted)]">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--pv-text-muted)]">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--pv-text-muted)]">
                Message
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--pv-text-muted)]">
                Platform
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--pv-text-muted)]">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const isExpanded = expandedId === item.id;
              const categoryConfig = CATEGORY_COLORS[item.category] || UNKNOWN_CATEGORY_CONFIG;
              const statusConfig = STATUS_COLORS[item.status];

              return (
                <>
                  <tr
                    key={item.id}
                    className="cursor-pointer border-t transition-colors hover:bg-[var(--pv-surface)]"
                    style={{ borderColor: 'var(--pv-border)' }}
                    onClick={() => toggleExpanded(item.id)}
                  >
                    <td className="px-4 py-3">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-[var(--pv-text-muted)]" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-[var(--pv-text-muted)]" />
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-[var(--pv-text-muted)]">
                      {formatDate(item.created_at)}
                    </td>
                    <td className="px-4 py-3">
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
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--pv-text)' }}>
                      {item.email}
                    </td>
                    <td className="max-w-xs px-4 py-3 text-sm text-[var(--pv-text-muted)]">
                      {truncateMessage(item.message)}
                    </td>
                    <td className="px-4 py-3">
                      <PlatformBadge platform={item.platform} />
                    </td>
                    <td className="px-4 py-3">
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
                  {isExpanded && (
                    <tr key={`${item.id}-expanded`} style={{ background: 'var(--pv-surface)' }}>
                      <td colSpan={7} className="px-4 py-4">
                        <ExpandedContent
                          item={item}
                          onStatusChange={onStatusChange}
                          onViewDetails={() => setSelectedItem(item)}
                        />
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-3 md:hidden">
        {items.map((item) => {
          const categoryConfig = CATEGORY_COLORS[item.category] || UNKNOWN_CATEGORY_CONFIG;
          const statusConfig = STATUS_COLORS[item.status];

          return (
            <div
              key={item.id}
              className="rounded-xl border p-4"
              style={{ borderColor: 'var(--pv-border)', background: 'var(--pv-surface)' }}
              onClick={() => setSelectedItem(item)}
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
                {item.email}
              </p>
              <p className="mb-2 text-sm text-[var(--pv-text-muted)]">
                {truncateMessage(item.message, 100)}
              </p>
              <p className="text-xs text-[var(--pv-text-muted)]">{formatDate(item.created_at)}</p>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      <FeedbackDetailModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        onStatusChange={onStatusChange}
      />
    </>
  );
}

function PlatformBadge({ platform }: { platform: 'ios' | 'android' }) {
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

function ExpandedContent({
  item,
  onStatusChange,
  onViewDetails,
}: {
  item: UnifiedFeedbackItem;
  onStatusChange: (id: string, source: 'beta_feedback' | 'support_request', status: FeedbackStatus) => void;
  onViewDetails: () => void;
}) {
  return (
    <div className="space-y-4">
      {/* Full Message */}
      <div>
        <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--pv-text-muted)]">
          Full Message
        </h4>
        <p className="whitespace-pre-wrap text-sm" style={{ color: 'var(--pv-text)' }}>
          {item.message}
        </p>
      </div>

      {/* Device Info */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <InfoField label="Device" value={`${item.device_brand || ''} ${item.device_model || ''}`.trim() || 'Unknown'} />
        <InfoField label="OS Version" value={item.os_version || 'Unknown'} />
        <InfoField label="App Version" value={item.app_version} />
        <InfoField label="Build" value={item.app_build || 'N/A'} />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <StatusButtons
          currentStatus={item.status}
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
      </div>
    </div>
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
}: {
  currentStatus: FeedbackStatus;
  onStatusChange: (status: FeedbackStatus) => void;
}) {
  const statuses: FeedbackStatus[] = ['new', 'reviewed', 'resolved'];

  return (
    <div className="flex items-center gap-1">
      {statuses.map((status) => {
        const config = STATUS_COLORS[status];
        const isActive = currentStatus === status;

        return (
          <button
            key={status}
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

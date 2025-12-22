'use client';

import { cn } from '@/lib/utils';
import {
  Rocket,
  Users,
  Globe,
  CheckCircle,
  Clock,
  Send,
  FileText,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

export type ActivityType =
  | 'deployment'
  | 'client_added'
  | 'website_added'
  | 'indexed'
  | 'submitted'
  | 'pending';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  href?: string;
  meta?: {
    clientName?: string;
    websiteName?: string;
    urlCount?: number;
  };
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  maxItems?: number;
  className?: string;
  emptyMessage?: string;
}

const activityConfig: Record<
  ActivityType,
  { icon: typeof Rocket; color: string; bgColor: string }
> = {
  deployment: {
    icon: Rocket,
    color: 'var(--pv-primary)',
    bgColor: 'rgba(63, 0, 233, 0.1)',
  },
  client_added: {
    icon: Users,
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.1)',
  },
  website_added: {
    icon: Globe,
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.1)',
  },
  indexed: {
    icon: CheckCircle,
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.1)',
  },
  submitted: {
    icon: Send,
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.1)',
  },
  pending: {
    icon: Clock,
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.1)',
  },
};

function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 7) {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHours > 0) return `${diffHours}h ago`;
  if (diffMins > 0) return `${diffMins}m ago`;
  return 'Just now';
}

export function ActivityFeed({
  activities,
  maxItems = 5,
  className,
  emptyMessage = 'No recent activity',
}: ActivityFeedProps) {
  const displayedActivities = activities.slice(0, maxItems);

  if (displayedActivities.length === 0) {
    return (
      <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
        <div
          className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{ background: 'var(--pv-surface)' }}
        >
          <FileText className="h-6 w-6" style={{ color: 'var(--pv-text-muted)' }} />
        </div>
        <p className="text-sm font-medium" style={{ color: 'var(--pv-text-muted)' }}>
          {emptyMessage}
        </p>
        <p className="mt-1 text-xs" style={{ color: 'var(--pv-text-muted)', opacity: 0.7 }}>
          Activity will appear here as you work
        </p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-1', className)}>
      {displayedActivities.map((activity, index) => {
        const config = activityConfig[activity.type];
        const Icon = config.icon;

        const content = (
          <div
            className={cn(
              'group relative flex items-start gap-4 rounded-xl p-4 transition-all duration-200',
              activity.href && 'cursor-pointer hover:bg-[var(--pv-surface)]',
            )}
          >
            {/* Timeline connector */}
            {index < displayedActivities.length - 1 && (
              <div
                className="absolute left-[1.875rem] top-14 h-[calc(100%-1rem)] w-px"
                style={{ background: 'var(--pv-border)' }}
              />
            )}

            {/* Icon */}
            <div
              className="relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
              style={{ background: config.bgColor }}
            >
              <Icon className="h-4 w-4" style={{ color: config.color }} />
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p
                    className="truncate text-sm font-medium transition-colors duration-200 group-hover:text-[var(--pv-primary)]"
                    style={{ color: 'var(--pv-text)' }}
                  >
                    {activity.title}
                  </p>
                  <p className="mt-0.5 truncate text-xs" style={{ color: 'var(--pv-text-muted)' }}>
                    {activity.description}
                  </p>
                </div>
                <span
                  className="flex-shrink-0 text-xs tabular-nums"
                  style={{ color: 'var(--pv-text-muted)', opacity: 0.7 }}
                >
                  {formatRelativeTime(activity.timestamp)}
                </span>
              </div>

              {/* Meta info */}
              {activity.meta && (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {activity.meta.clientName && (
                    <span
                      className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs"
                      style={{
                        background: 'var(--pv-surface)',
                        color: 'var(--pv-text-muted)',
                      }}
                    >
                      <Users className="h-3 w-3" />
                      {activity.meta.clientName}
                    </span>
                  )}
                  {activity.meta.websiteName && (
                    <span
                      className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs"
                      style={{
                        background: 'var(--pv-surface)',
                        color: 'var(--pv-text-muted)',
                      }}
                    >
                      <Globe className="h-3 w-3" />
                      {activity.meta.websiteName}
                    </span>
                  )}
                  {activity.meta.urlCount && (
                    <span
                      className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs"
                      style={{
                        background: config.bgColor,
                        color: config.color,
                      }}
                    >
                      {activity.meta.urlCount} URL{activity.meta.urlCount !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        );

        if (activity.href) {
          return (
            <Link key={activity.id} href={activity.href}>
              {content}
            </Link>
          );
        }

        return <div key={activity.id}>{content}</div>;
      })}
    </div>
  );
}

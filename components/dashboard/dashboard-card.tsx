'use client';

import { cn } from '@/lib/utils';
import {
  ChevronRight,
  Users,
  FolderKanban,
  Rocket,
  Zap,
  Globe,
  FileText,
  Activity,
  BookOpen,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';

const iconMap = {
  users: Users,
  folderKanban: FolderKanban,
  rocket: Rocket,
  zap: Zap,
  globe: Globe,
  fileText: FileText,
  activity: Activity,
  bookOpen: BookOpen,
  trendingUp: TrendingUp,
} as const;

type IconName = keyof typeof iconMap;

interface DashboardCardProps {
  title: string;
  subtitle?: string;
  iconName?: IconName;
  headerAction?: {
    label: string;
    href: string;
  };
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  noPadding?: boolean;
}

export function DashboardCard({
  title,
  subtitle,
  iconName,
  headerAction,
  children,
  className,
  contentClassName,
  noPadding = false,
}: DashboardCardProps) {
  const Icon = iconName ? iconMap[iconName] : null;
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border transition-all duration-300',
        'hover:border-[var(--pv-primary)]/20',
        className,
      )}
      style={{
        background: 'var(--pv-surface)',
        borderColor: 'var(--pv-border)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between gap-4 px-6 py-4"
        style={{ borderBottom: '1px solid var(--pv-border)' }}
      >
        <div className="flex min-w-0 items-center gap-3">
          {Icon && (
            <div
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg"
              style={{
                background:
                  'linear-gradient(135deg, rgba(63, 0, 233, 0.1), rgba(201, 71, 255, 0.05))',
                border: '1px solid rgba(63, 0, 233, 0.15)',
              }}
            >
              <Icon className="h-4 w-4" style={{ color: 'var(--pv-primary)' }} />
            </div>
          )}
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold" style={{ color: 'var(--pv-text)' }}>
              {title}
            </h3>
            {subtitle && (
              <p className="truncate text-xs" style={{ color: 'var(--pv-text-muted)' }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {headerAction && (
          <Link
            href={headerAction.href}
            className="group flex flex-shrink-0 items-center gap-1 text-xs font-medium transition-colors duration-200 hover:text-[var(--pv-primary)]"
            style={{ color: 'var(--pv-text-muted)' }}
          >
            {headerAction.label}
            <ChevronRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>

      {/* Content */}
      <div className={cn(noPadding ? '' : 'p-6', contentClassName)}>{children}</div>
    </div>
  );
}

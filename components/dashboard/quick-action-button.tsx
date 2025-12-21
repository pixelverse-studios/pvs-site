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
  Mail,
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
  mail: Mail,
} as const;

type IconName = keyof typeof iconMap;

interface QuickActionButtonProps {
  title: string;
  description?: string;
  iconName: IconName;
  href: string;
  disabled?: boolean;
  badge?: string;
  accentColor?: string;
}

export function QuickActionButton({
  title,
  description,
  iconName,
  href,
  disabled = false,
  badge,
  accentColor = 'var(--pv-primary)',
}: QuickActionButtonProps) {
  const Icon = iconMap[iconName];
  const content = (
    <div
      className={cn(
        'group relative flex items-center gap-4 rounded-xl border p-4 transition-all duration-300',
        disabled
          ? 'cursor-not-allowed opacity-50'
          : 'hover:border-[var(--pv-primary)]/30 cursor-pointer hover:-translate-y-0.5 hover:shadow-md',
      )}
      style={{
        background: 'var(--pv-surface)',
        borderColor: 'var(--pv-border)',
      }}
    >
      {/* Icon */}
      <div
        className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-105"
        style={{
          background: disabled
            ? 'var(--pv-surface)'
            : `linear-gradient(135deg, ${accentColor}15, ${accentColor}05)`,
          border: `1px solid ${disabled ? 'var(--pv-border)' : accentColor + '20'}`,
        }}
      >
        <Icon
          className="h-5 w-5 transition-colors duration-300"
          style={{ color: disabled ? 'var(--pv-text-muted)' : accentColor }}
        />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p
            className="truncate text-sm font-semibold transition-colors duration-200"
            style={{
              color: disabled ? 'var(--pv-text-muted)' : 'var(--pv-text)',
            }}
          >
            {title}
          </p>
          {badge && (
            <span
              className="flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider"
              style={{
                background: 'var(--pv-border)',
                color: 'var(--pv-text-muted)',
              }}
            >
              {badge}
            </span>
          )}
        </div>
        {description && (
          <p className="mt-0.5 truncate text-xs" style={{ color: 'var(--pv-text-muted)' }}>
            {description}
          </p>
        )}
      </div>

      {/* Arrow */}
      {!disabled && (
        <ChevronRight
          className="h-4 w-4 flex-shrink-0 transition-all duration-300 group-hover:translate-x-1"
          style={{ color: 'var(--pv-text-muted)' }}
        />
      )}
    </div>
  );

  if (disabled) {
    return content;
  }

  return <Link href={href}>{content}</Link>;
}

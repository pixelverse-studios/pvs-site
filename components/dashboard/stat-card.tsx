'use client';

import { cn } from '@/lib/utils';
import {
  TrendingUp,
  TrendingDown,
  Users,
  FolderKanban,
  Rocket,
  Zap,
  Globe,
  FileText,
  Activity,
  BookOpen,
  TrendingUp as TrendingUpIcon,
} from 'lucide-react';

const iconMap = {
  users: Users,
  folderKanban: FolderKanban,
  rocket: Rocket,
  zap: Zap,
  globe: Globe,
  fileText: FileText,
  activity: Activity,
  bookOpen: BookOpen,
  trendingUp: TrendingUpIcon,
} as const;

type IconName = keyof typeof iconMap;

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  iconName: IconName;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  accentColor?: string;
  className?: string;
  onClick?: () => void;
}

export function StatCard({
  title,
  value,
  subtitle,
  iconName,
  trend,
  accentColor = 'var(--pv-primary)',
  className,
  onClick,
}: StatCardProps) {
  const Icon = iconMap[iconName];
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-[var(--pv-border)] bg-[var(--pv-surface)] p-6 transition-all duration-300',
        'hover:border-[var(--pv-primary)]/30 hover:-translate-y-0.5 hover:shadow-lg',
        onClick && 'cursor-pointer',
        className,
      )}
      onClick={onClick}
      style={{
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {/* Subtle glow effect on hover */}
      <div
        className="absolute -inset-1 -z-10 rounded-2xl opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-20"
        style={{ background: accentColor }}
      />

      {/* Icon with accent background */}
      <div className="mb-4 flex items-center justify-between">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
          style={{
            background: `linear-gradient(135deg, ${accentColor}15, ${accentColor}08)`,
            border: `1px solid ${accentColor}20`,
          }}
        >
          <Icon className="h-5 w-5 transition-colors duration-300" style={{ color: accentColor }} />
        </div>

        {/* Trend indicator */}
        {trend && (
          <div
            className={cn(
              'flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
              trend.isPositive
                ? 'bg-emerald-500/10 text-emerald-500'
                : 'bg-red-500/10 text-red-500',
            )}
          >
            {trend.isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            <span>{trend.value}%</span>
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mb-1">
        <span
          className="font-heading text-3xl font-bold tracking-tight"
          style={{ color: 'var(--pv-text)' }}
        >
          {value}
        </span>
      </div>

      {/* Title */}
      <p className="text-sm font-medium" style={{ color: 'var(--pv-text-muted)' }}>
        {title}
      </p>

      {/* Subtitle */}
      {subtitle && (
        <p className="mt-1 text-xs" style={{ color: 'var(--pv-text-muted)', opacity: 0.7 }}>
          {subtitle}
        </p>
      )}

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-500 group-hover:w-full"
        style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }}
      />
    </div>
  );
}

'use client';

import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  count: number;
  subCount?: number;
  subLabel?: string;
  href: string;
  icon: LucideIcon;
  gradient: string;
}

export function StatCard({
  title,
  count,
  subCount,
  subLabel,
  href,
  icon: Icon,
  gradient,
}: StatCardProps) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-xl border p-6 transition-all duration-200 hover:shadow-lg"
      style={{
        borderColor: 'var(--pv-border)',
        background: 'var(--pv-surface)',
      }}
    >
      {/* Background gradient accent */}
      <div
        className="absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-10 transition-opacity duration-200 group-hover:opacity-20"
        style={{ background: gradient }}
      />

      <div className="relative">
        {/* Icon */}
        <div
          className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110"
          style={{ background: gradient }}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>

        {/* Title */}
        <p className="mb-1 text-sm font-medium text-[var(--pv-text-muted)]">{title}</p>

        {/* Count */}
        <p
          className="text-3xl font-bold tracking-tight"
          style={{ color: 'var(--pv-text)' }}
        >
          {count.toLocaleString()}
        </p>

        {/* Sub count */}
        {subCount !== undefined && subLabel && (
          <p className="mt-1 text-sm text-[var(--pv-text-muted)]">
            <span className="font-medium" style={{ color: 'var(--pv-text)' }}>
              {subCount}
            </span>{' '}
            {subLabel}
          </p>
        )}
      </div>

      {/* Hover arrow */}
      <div className="absolute bottom-4 right-4 text-[var(--pv-text-muted)] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </Link>
  );
}

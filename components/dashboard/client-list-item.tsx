'use client';

import { cn } from '@/lib/utils';
import { Users, Globe, ChevronRight, Circle } from 'lucide-react';
import Link from 'next/link';

interface ClientListItemProps {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  websiteCount?: number;
}

export function ClientListItem({ id, name, email, status, websiteCount = 0 }: ClientListItemProps) {
  const displayName = name || 'Unknown';
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <Link href={`/dashboard/clients/${id}`}>
      <div className="group flex items-center gap-4 rounded-xl p-3 transition-all duration-200 hover:bg-[var(--pv-bg)]">
        {/* Avatar */}
        <div
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold uppercase transition-transform duration-300 group-hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, var(--pv-primary), var(--pv-primary-2))',
            color: 'white',
          }}
        >
          {initials}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p
              className="truncate text-sm font-medium transition-colors duration-200 group-hover:text-[var(--pv-primary)]"
              style={{ color: 'var(--pv-text)' }}
            >
              {displayName}
            </p>
            {/* Status dot */}
            <Circle
              className={cn(
                'h-2 w-2 flex-shrink-0 fill-current',
                status === 'active' ? 'text-emerald-500' : 'text-gray-400',
              )}
            />
          </div>
          <div
            className="mt-0.5 flex items-center gap-3 text-xs"
            style={{ color: 'var(--pv-text-muted)' }}
          >
            <span className="truncate">{email}</span>
            {websiteCount > 0 && (
              <span className="flex flex-shrink-0 items-center gap-1">
                <Globe className="h-3 w-3" />
                {websiteCount}
              </span>
            )}
          </div>
        </div>

        {/* Arrow */}
        <ChevronRight
          className="h-4 w-4 flex-shrink-0 transition-all duration-300 group-hover:translate-x-1"
          style={{ color: 'var(--pv-text-muted)' }}
        />
      </div>
    </Link>
  );
}

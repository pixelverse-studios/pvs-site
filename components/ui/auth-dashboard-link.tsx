'use client';

import * as React from 'react';
import Link from 'next/link';
import { LayoutDashboard } from 'lucide-react';
import { usePathname } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

interface AuthDashboardLinkProps {
  variant?: 'desktop' | 'mobile';
  onNavigate?: () => void;
  isDarkMode?: boolean;
}

export function AuthDashboardLink({
  variant = 'desktop',
  onNavigate,
  isDarkMode = false,
}: AuthDashboardLinkProps) {
  const pathname = usePathname();
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const supabase = createClient();

    // Get initial auth state
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setIsLoading(false);
    });

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Don't render anything if not authenticated or still loading
  if (isLoading || !user) {
    return null;
  }

  const isActive = pathname.startsWith('/dashboard');

  if (variant === 'mobile') {
    // Mobile navigation item style (matching existing mobile nav items)
    const navItemBaseClass =
      'group flex items-center gap-4 rounded-2xl px-4 py-3 text-base transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pv-bg)]';
    const navItemThemeClass = isDarkMode
      ? 'text-white/80 hover:text-white'
      : 'text-[var(--pv-text-muted)] hover:text-[var(--pv-text)]';
    const navItemHoverBgClass = isDarkMode ? 'hover:bg-white/10' : 'hover:bg-[rgba(63,0,233,0.08)]';
    const navItemActiveClass = isDarkMode
      ? 'bg-white/12 text-white shadow-[0_24px_48px_-32px_rgba(120,65,255,0.75)]'
      : 'bg-[rgba(63,0,233,0.12)] text-[var(--pv-primary)] shadow-[0_24px_48px_-34px_rgba(63,0,233,0.35)]';
    const iconBaseClass =
      'flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 group-focus-visible:border-[var(--pv-primary)]';
    const iconThemeClass = isDarkMode
      ? 'border-white/12 bg-white/10 text-white/80 group-hover:border-white/40 group-hover:bg-white/20 group-hover:text-white'
      : 'border-[rgba(63,0,233,0.2)] bg-white text-[rgba(63,0,233,0.75)] shadow-[0_18px_36px_-32px_rgba(63,0,233,0.4)] group-hover:border-[rgba(63,0,233,0.45)] group-hover:bg-[rgba(63,0,233,0.08)] group-hover:text-[var(--pv-primary)]';
    const iconActiveClass = isDarkMode
      ? 'border-white/40 bg-white/20 text-white'
      : 'border-[rgba(63,0,233,0.55)] bg-[rgba(63,0,233,0.12)] text-[var(--pv-primary)]';

    return (
      <Link
        href="/dashboard"
        aria-current={isActive ? 'page' : undefined}
        onClick={onNavigate}
        className={cn(
          navItemBaseClass,
          navItemThemeClass,
          navItemHoverBgClass,
          isActive && navItemActiveClass,
          'duration-300 animate-in fade-in',
        )}
      >
        <span className={cn(iconBaseClass, iconThemeClass, isActive && iconActiveClass)}>
          <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="flex-1">Dashboard</span>
      </Link>
    );
  }

  // Desktop variant - icon button style
  return (
    <Link
      href="/dashboard"
      aria-label="Dashboard"
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'group relative inline-flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300',
        'text-[var(--pv-text-muted)] hover:text-[var(--pv-text)]',
        'hover:bg-white/85 hover:shadow-[0_12px_28px_-16px_rgba(63,0,233,0.35)] dark:hover:bg-white/10',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pv-bg)]',
        'duration-300 animate-in fade-in',
        isActive && [
          'bg-[linear-gradient(90deg,var(--pv-primary),var(--pv-primary-2))]',
          'text-white shadow-[0_16px_32px_-20px_rgba(63,0,233,0.65)]',
          'hover:text-white hover:shadow-[0_20px_40px_-24px_rgba(63,0,233,0.75)]',
        ],
      )}
    >
      <LayoutDashboard
        className={cn(
          'h-4.5 w-4.5 transition-transform duration-200',
          'group-hover:scale-110',
          isActive && 'scale-100 group-hover:scale-105',
        )}
        aria-hidden="true"
      />
      {/* Tooltip */}
      <span
        className={cn(
          'pointer-events-none absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium',
          'border border-[var(--pv-border)] bg-[var(--pv-surface)] text-[var(--pv-text)] shadow-lg',
          'opacity-0 transition-opacity duration-200 group-hover:opacity-100',
          'dark:border-[var(--pv-border)] dark:bg-[var(--pv-surface)]',
        )}
        role="tooltip"
      >
        Dashboard
      </span>
    </Link>
  );
}

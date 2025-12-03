'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, LogOut, User } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface DashboardHeaderProps {
  userName?: string;
  userEmail?: string;
  onLogout?: () => void;
}

export function DashboardHeader({ userName, userEmail, onLogout }: DashboardHeaderProps) {
  const pathname = usePathname();

  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    let currentPath = '';
    for (const segment of segments) {
      currentPath += `/${segment}`;

      // Format segment label
      let label = segment.charAt(0).toUpperCase() + segment.slice(1);

      // Handle special cases
      if (segment === 'dashboard') label = 'Dashboard';
      if (segment === 'clients') label = 'Clients';
      if (segment === 'docs') label = 'Docs';
      if (segment === 'websites') label = 'Websites';
      if (segment === 'seo-checklist') label = 'SEO Checklist';
      if (segment === 'blog-guidelines') label = 'Blog Guidelines';

      // Skip UUIDs in labels but keep them in the path
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment);
      if (isUUID) {
        label = 'Details';
      }

      breadcrumbs.push({ label, href: currentPath });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();
  const pageTitle = breadcrumbs[breadcrumbs.length - 1]?.label || 'Dashboard';

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header
      className="sticky top-0 z-30 w-full border-b transition-colors duration-300"
      style={{
        background: 'var(--pv-bg)',
        borderColor: 'var(--pv-border)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div className="flex h-16 items-center justify-between px-6 lg:px-8">
        {/* Left: Breadcrumbs */}
        <nav className="flex items-center gap-2" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.href} className="flex items-center gap-2">
              {index > 0 && (
                <ChevronRight
                  className="h-4 w-4 flex-shrink-0"
                  style={{ color: 'var(--pv-text-muted)', opacity: 0.5 }}
                />
              )}
              {index === breadcrumbs.length - 1 ? (
                <span
                  className="text-sm font-medium"
                  style={{ color: 'var(--pv-text)' }}
                >
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className={cn(
                    'text-sm transition-colors duration-200',
                    'hover:text-[var(--pv-primary)]'
                  )}
                  style={{ color: 'var(--pv-text-muted)' }}
                >
                  {crumb.label}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Right: User actions */}
        <div className="flex items-center gap-3">
          {/* Greeting (hidden on mobile) */}
          {userName && (
            <div className="hidden text-right md:block">
              <p
                className="text-xs"
                style={{ color: 'var(--pv-text-muted)' }}
              >
                {getGreeting()}
              </p>
              <p
                className="text-sm font-medium"
                style={{ color: 'var(--pv-text)' }}
              >
                {userName}
              </p>
            </div>
          )}

          {/* User avatar */}
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full border"
            style={{
              background: 'linear-gradient(135deg, var(--pv-primary), var(--pv-primary-2))',
              borderColor: 'var(--pv-border)',
            }}
          >
            <User className="h-4 w-4 text-white" />
          </div>

          {/* Theme toggle */}
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          {/* Logout button */}
          {onLogout && (
            <button
              onClick={onLogout}
              className="flex h-9 w-9 items-center justify-center rounded-lg border transition-all duration-200 hover:border-[var(--pv-danger)] hover:bg-[var(--pv-danger)]/10 hover:text-[var(--pv-danger)]"
              style={{
                borderColor: 'var(--pv-border)',
                color: 'var(--pv-text-muted)',
              }}
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

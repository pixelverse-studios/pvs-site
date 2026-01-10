'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const tabs = [
  { label: 'Overview', href: '/dashboard/domani' },
  { label: 'Feedback', href: '/dashboard/domani/feedback' },
  { label: 'Waitlist', href: '/dashboard/domani/waitlist' },
  { label: 'Users', href: '/dashboard/domani/users' },
];

export function DomaniNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard/domani') {
      return pathname === '/dashboard/domani';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="mb-8 border-b" style={{ borderColor: 'var(--pv-border)' }}>
      <div className="-mb-px flex gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              'whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors',
              isActive(tab.href)
                ? 'border-[var(--pv-primary)] text-[var(--pv-primary)]'
                : 'border-transparent text-[var(--pv-text-muted)] hover:border-[var(--pv-border)] hover:text-[var(--pv-text)]'
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

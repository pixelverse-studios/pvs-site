'use client';

import { usePathname } from 'next/navigation';

import { TrackedLink } from '@/components/analytics/tracked-link';
import { cn } from '@/lib/utils';

export type ContactPath = 'details' | 'call' | 'review';

interface PathOption {
  id: ContactPath;
  title: string;
  description: string;
  href: string;
}

const paths: PathOption[] = [
  {
    id: 'details',
    title: 'Start with the Details',
    description:
      'Share details about your business and what you\u2019re trying to accomplish. We\u2019ll review your situation and respond with clarity on what makes sense next.',
    href: '/contact/details',
  },
  {
    id: 'call',
    title: 'Schedule a Strategy Call',
    description:
      'If you\u2019d rather talk it through live, schedule a call and we\u2019ll discuss your goals, your current situation, and what would make the biggest difference.',
    href: '/contact/call',
  },
  {
    id: 'review',
    title: 'Request a Website Review',
    description:
      'We\u2019ll review your site\u2019s structure, performance, and visibility, then share practical insights on where improvements could make the biggest impact.',
    href: '/contact/review',
  },
];

/** Derive active path from the current URL pathname. */
export function useContactPath(): ContactPath {
  const pathname = usePathname();
  if (pathname.startsWith('/contact/call')) return 'call';
  if (pathname.startsWith('/contact/review')) return 'review';
  return 'details';
}

export function ContactPathSelector() {
  const activePath = useContactPath();

  return (
    <nav aria-label="Choose a contact option" className="grid grid-cols-3 gap-2">
      {paths.map((path) => (
        <TrackedLink
          key={path.id}
          href={path.href}
          scroll={false}
          trackingKind="contact_path"
          contactPath={path.id}
          trackingLabel={path.title}
          aria-current={activePath === path.id ? 'page' : undefined}
          className={cn(
            'flex min-h-12 items-center justify-center rounded-lg border px-3 py-3 text-center text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-primary)] focus-visible:ring-offset-2',
            activePath === path.id
              ? 'border-[var(--pv-primary)] bg-[var(--pv-primary)] text-white'
              : 'border-[var(--pv-border)] bg-[var(--pv-surface)] text-[var(--pv-text)] hover:border-[var(--pv-primary)]',
          )}
        >
          {path.id === 'details'
            ? 'Project details'
            : path.id === 'call'
              ? 'Strategy call'
              : 'Website review'}
        </TrackedLink>
      ))}
    </nav>
  );
}

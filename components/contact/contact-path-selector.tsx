import { Calendar, FileText, Search } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

export type ContactPath = 'details' | 'call' | 'review';

interface PathOption {
  id: ContactPath;
  icon: LucideIcon;
  title: string;
  description: string;
}

const paths: PathOption[] = [
  {
    id: 'details',
    icon: FileText,
    title: 'Start with the Details',
    description:
      'Share details about your business and what you\u2019re trying to accomplish. We\u2019ll review your situation and respond with clarity on what makes sense next.',
  },
  {
    id: 'call',
    icon: Calendar,
    title: 'Schedule a Strategy Call',
    description:
      'If you\u2019d rather talk it through live, schedule a call and we\u2019ll discuss your goals, your current situation, and what would make the biggest difference.',
  },
  {
    id: 'review',
    icon: Search,
    title: 'Request a Website Review',
    description:
      'We\u2019ll review your site\u2019s structure, performance, and visibility, then share practical insights on where improvements could make the biggest impact.',
  },
];

interface ContactPathSelectorProps {
  activePath: ContactPath;
  onSelect: (path: ContactPath) => void;
}

export function ContactPathSelector({ activePath, onSelect }: ContactPathSelectorProps) {
  return (
    <div>
      <div className="mb-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[var(--pv-text-muted)]">
          Choose How You&rsquo;d Like to Start
        </p>
        <p className="mt-2 text-sm text-[var(--pv-text-muted)]">
          Each path helps us understand your situation so we can respond clearly and thoughtfully.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {paths.map((path) => {
          const Icon = path.icon;
          const isActive = activePath === path.id;

          return (
            <button
              key={path.id}
              type="button"
              onClick={() => onSelect(path.id)}
              aria-pressed={isActive}
              className={cn(
                'group flex flex-col items-start gap-4 rounded-2xl border p-6 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pv-bg)]',
                isActive
                  ? 'border-[var(--pv-primary)] bg-[var(--pv-surface)] shadow-[0_0_0_3px_color-mix(in_srgb,var(--pv-primary)_12%,transparent),0_8px_24px_-8px_color-mix(in_srgb,var(--pv-primary)_30%,transparent)]'
                  : 'border-[var(--pv-border)] bg-[var(--pv-surface)] hover:border-[var(--pv-primary)] hover:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.12)]',
              )}
            >
              {/* Icon badge */}
              <span
                className={cn(
                  'inline-flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200',
                  isActive
                    ? 'border-[var(--pv-primary)] bg-[linear-gradient(135deg,var(--pv-primary),var(--pv-primary-2))] text-white'
                    : 'border-[var(--pv-border)] bg-[var(--pv-bg)] text-[var(--pv-primary)] group-hover:border-[var(--pv-primary)]',
                )}
                aria-hidden="true"
              >
                <Icon className="h-5 w-5" />
              </span>

              {/* Title */}
              <span
                className={cn(
                  'font-heading text-base font-semibold transition-colors duration-200',
                  isActive ? 'text-[var(--pv-text)]' : 'text-[var(--pv-text)]',
                )}
              >
                {path.title}
              </span>

              {/* Description */}
              <span className="text-[0.875rem] leading-relaxed text-[var(--pv-text-muted)]">
                {path.description}
              </span>

              {/* Active indicator line */}
              <span
                className={cn(
                  'mt-auto h-0.5 w-8 rounded-full transition-all duration-300',
                  isActive
                    ? 'bg-[var(--pv-primary)]'
                    : 'bg-transparent group-hover:bg-[var(--pv-border)]',
                )}
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

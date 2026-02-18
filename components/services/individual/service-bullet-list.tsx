import { CheckCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';

export interface BulletPoint {
  icon?: LucideIcon;
  title: string;
  description: string;
}

export interface ServiceBulletListProps {
  items: BulletPoint[];
  layout?: 'grid' | 'vertical';
}

export function ServiceBulletList({ items, layout = 'grid' }: ServiceBulletListProps) {
  const containerClass =
    layout === 'grid'
      ? 'grid grid-cols-1 gap-6 md:grid-cols-2'
      : 'flex flex-col gap-4';

  return (
    <MotionSection as="div" className={containerClass}>
      {items.map(({ icon: Icon = CheckCircle, title, description }, index) => (
        <MotionItem
          key={title}
          delay={index * 0.08}
          triggerOnViewport={false}
          className="h-full"
        >
          <Card className="group flex h-full flex-col border border-[var(--pv-border)] bg-[var(--pv-bg)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--pv-primary)] hover:shadow-[0_24px_50px_-36px_rgba(63,0,233,0.75)]">
            <CardHeader className="flex flex-row items-center gap-4 pb-4">
              <span
                className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--pv-primary),var(--pv-primary-2))] text-white shadow-[0_18px_38px_-28px_rgba(63,0,233,0.9)] transition-transform duration-300 group-hover:-translate-y-0.5"
                aria-hidden="true"
              >
                <Icon className="h-6 w-6" />
              </span>
              <CardTitle className="text-lg font-semibold text-[var(--pv-text)]">
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-sm leading-6 text-[var(--pv-text-muted)]">
                {description}
              </CardDescription>
            </CardContent>
          </Card>
        </MotionItem>
      ))}
    </MotionSection>
  );
}

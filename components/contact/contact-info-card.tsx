import * as React from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ContactInfoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode;
  title: string;
  description: string;
  children?: React.ReactNode;
}

export function ContactInfoCard({
  icon,
  title,
  description,
  children,
  className,
  ...props
}: ContactInfoCardProps) {
  return (
    <Card
      className={cn(
        'bg-[var(--pv-surface)]/90 dark:bg-[var(--pv-bg)]/85 border border-[var(--pv-border)] p-6 shadow-pv transition hover:-translate-y-1 hover:border-[var(--pv-primary)]',
        className
      )}
      {...props}
    >
      <CardHeader className="space-y-2 p-0">
        <CardTitle className="flex items-center gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--pv-primary),var(--pv-primary-2))] text-white shadow-[0_20px_40px_-30px_rgba(63,0,233,0.75)]">
            {icon}
          </span>
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {children && <CardContent className="mt-4 p-0">{children}</CardContent>}
    </Card>
  );
}

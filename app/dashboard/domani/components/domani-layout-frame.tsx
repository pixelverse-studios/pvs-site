'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function domaniLayoutClassName(pathname: string): string {
  return cn('pt-6 lg:pt-8', !pathname.startsWith('/dashboard/domani/users') && 'pb-16');
}

export function DomaniLayoutFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return <div className={domaniLayoutClassName(pathname)}>{children}</div>;
}

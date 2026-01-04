'use client';

import { ReactNode } from 'react';
import { useSidebar } from './sidebar-context';
import { cn } from '@/lib/utils';

interface DashboardContentProps {
  children: ReactNode;
}

export function DashboardContent({ children }: DashboardContentProps) {
  const { isCollapsed } = useSidebar();

  return (
    <div
      className={cn(
        'w-full transition-all duration-500',
        isCollapsed ? 'lg:pl-[72px]' : 'lg:pl-64',
      )}
    >
      {children}
    </div>
  );
}

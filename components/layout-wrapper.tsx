'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

import { Footer } from '@/components/ui/footer';
import { Navbar } from '@/components/ui/navbar';
import { SaleBanner } from '@/components/sale';

interface LayoutWrapperProps {
  children: ReactNode;
  navItems: Array<{ label: string; href: string }>;
  localContactLinks: Array<{ label: string; href: string }>;
}

export function LayoutWrapper({ children, navItems, localContactLinks }: LayoutWrapperProps) {
  const pathname = usePathname();

  // Pages that should not have navbar/footer (auth pages and dashboard)
  const isAuthPage = pathname === '/login' || pathname.startsWith('/login/');
  const isDashboardPage = pathname.startsWith('/dashboard');
  const hideNavbar = isAuthPage || isDashboardPage;

  if (hideNavbar) {
    // Auth pages and dashboard: no public navbar/footer
    return <>{children}</>;
  }

  // Regular pages: with navbar and footer
  return (
    <div className="flex min-h-screen flex-col">
      <SaleBanner />
      <Navbar items={navItems} cta={{ label: 'Get Started', href: '/contact' }} />
      <div className="flex-1">{children}</div>
      <Footer
        links={navItems}
        localContactLinks={localContactLinks}
        cta={{ label: 'Get in touch with us', href: '/contact' }}
      />
    </div>
  );
}

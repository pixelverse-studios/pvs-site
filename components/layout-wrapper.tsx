'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

import { FooterLayoutPicker } from '@/components/ui/footer-layout-picker';
import { Navbar, type NavItem } from '@/components/ui/navbar';

interface LayoutWrapperProps {
  children: ReactNode;
  navItems: NavItem[];
}

export function LayoutWrapper({ children, navItems }: LayoutWrapperProps) {
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
      <Navbar items={navItems} cta={{ label: 'Get Started', href: '/contact' }} />
      <div className="flex-1">{children}</div>
      <FooterLayoutPicker
        links={navItems}
        cta={{ label: 'Get in touch with us', href: '/contact' }}
      />
    </div>
  );
}

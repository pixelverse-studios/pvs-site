'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  TrendingUp,
  FileText,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  available: boolean;
}

const navItems: NavItem[] = [
  {
    label: 'Overview',
    href: '/dashboard',
    icon: LayoutDashboard,
    available: true,
  },
  {
    label: 'Clients',
    href: '/dashboard/clients',
    icon: Users,
    available: true,
  },
  {
    label: 'Projects',
    href: '/dashboard/projects',
    icon: FolderKanban,
    available: false,
  },
  {
    label: 'Leads',
    href: '/dashboard/leads',
    icon: TrendingUp,
    available: false,
  },
  {
    label: 'Audits',
    href: '/dashboard/audits',
    icon: FileText,
    available: false,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Auto-collapse/expand based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
        setIsMobileOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile menu toggle button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed left-4 top-6 z-[60] rounded-xl p-3 shadow-lg transition-all duration-300 lg:hidden"
        style={{
          background: 'var(--pv-surface)',
          border: '1px solid var(--pv-border)',
          color: 'var(--pv-text)',
        }}
        aria-label="Toggle menu"
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Backdrop overlay for mobile */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isMobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setIsMobileOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-fit pb-8 pt-6 transition-all duration-500 ease-in-out
          ${
            // Mobile: full width when open, desktop: collapsible width
            isMobileOpen
              ? 'w-[280px]'
              : isCollapsed
                ? 'w-20 -translate-x-full lg:translate-x-0'
                : 'w-64 -translate-x-full lg:translate-x-0'
          }
        `}
        style={{
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Glass container */}
        <div className="relative mx-4 h-full">
          <div
            className="h-full overflow-hidden rounded-2xl border shadow-2xl"
            style={{
              background: 'var(--pv-surface)',
              borderColor: 'var(--pv-border)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            {/* Gradient accent - top edge */}
            <div
              className="absolute left-0 right-0 top-0 h-1"
              style={{
                background: 'var(--pv-gradient)',
                opacity: 0.6,
              }}
            />

            {/* Navigation items */}
            <nav className="flex h-full flex-col gap-1 p-4">
              {/* Logo/Brand area - Clickable link to homepage */}
              <Link
                href="/"
                className="group/logo mb-6 block overflow-hidden rounded-lg px-3 py-2 transition-all duration-300 hover:bg-[var(--pv-border)]/50"
              >
                <div
                  className={`font-heading font-bold transition-all duration-500 group-hover/logo:scale-105 ${
                    isCollapsed && !isMobileOpen ? 'text-xl' : 'text-2xl'
                  }`}
                  style={{
                    background: 'var(--pv-gradient)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {isCollapsed && !isMobileOpen ? 'PV' : 'PVS'}
                </div>
                {(!isCollapsed || isMobileOpen) && (
                  <span className="mt-0.5 block text-[10px] font-medium uppercase tracking-wider text-[var(--pv-text-muted)] transition-colors group-hover/logo:text-[var(--pv-primary)]">
                    Go to site →
                  </span>
                )}
              </Link>

              {/* Nav items */}
              <div className="flex-1 space-y-1">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <div key={item.href} className="group relative">
                      {/* Active indicator - gradient bar */}
                      {active && (
                        <div
                          className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full transition-all duration-300"
                          style={{
                            background: 'var(--pv-gradient)',
                            boxShadow: '0 0 12px rgba(63, 0, 233, 0.4)',
                          }}
                        />
                      )}

                      <Link
                        href={item.available ? item.href : '#'}
                        className={`
                          relative flex items-center gap-3 overflow-hidden rounded-xl px-3
                          py-3 transition-all duration-300
                          ${item.available ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}
                          ${active ? 'pl-5' : 'pl-3'}
                        `}
                        style={{
                          color: active ? 'var(--pv-primary)' : 'var(--pv-text)',
                          background: active ? 'rgba(63, 0, 233, 0.08)' : 'transparent',
                        }}
                        onClick={(e) => {
                          if (!item.available) {
                            e.preventDefault();
                          }
                        }}
                      >
                        {/* Hover gradient background */}
                        {item.available && (
                          <div
                            className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                            style={{
                              background:
                                'linear-gradient(90deg, rgba(63, 0, 233, 0.05), rgba(201, 71, 255, 0.05))',
                            }}
                          />
                        )}

                        {/* Icon */}
                        <div className="relative z-10 flex-shrink-0">
                          <Icon
                            className={`h-5 w-5 transition-all duration-300 ${
                              active ? 'scale-110' : 'group-hover:rotate-3 group-hover:scale-110'
                            }`}
                          />
                        </div>

                        {/* Label */}
                        <span
                          className={`relative z-10 whitespace-nowrap font-medium transition-all duration-500 ${
                            isCollapsed && !isMobileOpen
                              ? 'w-0 opacity-0'
                              : 'w-auto opacity-100 delay-100'
                          }`}
                        >
                          {item.label}
                        </span>

                        {/* Coming soon badge */}
                        {!item.available && (!isCollapsed || isMobileOpen) && (
                          <span
                            className="relative z-10 ml-auto rounded-full px-2 py-0.5 text-xs font-medium"
                            style={{
                              background: 'var(--pv-border)',
                              color: 'var(--pv-text-muted)',
                            }}
                          >
                            Soon
                          </span>
                        )}
                      </Link>

                      {/* Tooltip for collapsed state - desktop only */}
                      {isCollapsed && !isMobileOpen && item.available && (
                        <div
                          className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 hidden -translate-y-1/2 whitespace-nowrap rounded-lg
                          px-3 py-2 opacity-0 shadow-lg transition-opacity
                          duration-200 group-hover:opacity-100 lg:block"
                          style={{
                            background: 'var(--pv-surface)',
                            border: '1px solid var(--pv-border)',
                            color: 'var(--pv-text)',
                          }}
                        >
                          <span className="text-sm font-medium">{item.label}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Collapse toggle button - desktop only */}
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="group relative mx-3 mt-auto hidden overflow-hidden rounded-xl p-3 transition-all duration-300 lg:block"
                style={{
                  background: 'var(--pv-border)',
                  color: 'var(--pv-text-muted)',
                }}
                aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {/* Hover gradient */}
                <div
                  className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background: 'var(--pv-gradient)',
                  }}
                />

                <div className="relative z-10 flex items-center justify-center">
                  {isCollapsed ? (
                    <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                  ) : (
                    <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
                  )}
                </div>
              </button>
            </nav>
          </div>

          {/* Glow effect - subtle */}
          <div
            className="absolute -inset-0.5 -z-10 rounded-2xl opacity-20 blur-xl"
            style={{
              background: 'var(--pv-gradient)',
            }}
          />
        </div>
      </aside>
    </>
  );
}

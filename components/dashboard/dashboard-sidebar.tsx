'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  TrendingUp,
  FileText,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  ListTodo,
  Smartphone,
} from 'lucide-react';
import { useSidebar } from './sidebar-context';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  available: boolean;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

// Navigation organized into sections
const navSections: NavSection[] = [
  {
    // Main navigation - no title needed
    items: [
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
        label: 'Agenda',
        href: '/dashboard/agenda',
        icon: ListTodo,
        available: true,
      },
    ],
  },
  {
    title: 'Internal Projects',
    items: [
      {
        label: 'Domani',
        href: '/dashboard/domani',
        icon: Smartphone,
        available: true,
      },
    ],
  },
  {
    title: 'Coming Soon',
    items: [
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
    ],
  },
  {
    // Resources section - no title
    items: [
      {
        label: 'Docs',
        href: '/dashboard/docs',
        icon: BookOpen,
        available: true,
      },
    ],
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen } = useSidebar();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname, setIsMobileOpen]);

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const showLabels = !isCollapsed || isMobileOpen;

  return (
    <>
      {/* Mobile menu toggle button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed left-4 top-4 z-[60] rounded-xl p-2.5 shadow-lg transition-all duration-300 lg:hidden"
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
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isMobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setIsMobileOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen transition-all duration-500 ease-out
          ${
            isMobileOpen
              ? 'w-72 translate-x-0'
              : isCollapsed
                ? 'w-[72px] -translate-x-full lg:translate-x-0'
                : 'w-64 -translate-x-full lg:translate-x-0'
          }
        `}
      >
        {/* Main container */}
        <div
          className="flex h-full flex-col border-r"
          style={{
            background: 'var(--pv-surface)',
            borderColor: 'var(--pv-border)',
          }}
        >
          {/* Logo area */}
          <div
            className="flex h-16 items-center border-b px-4"
            style={{ borderColor: 'var(--pv-border)' }}
          >
            <Link
              href="/"
              className="group flex items-center gap-3 rounded-lg px-2 py-1.5 transition-all duration-300 hover:bg-[var(--pv-bg)]"
            >
              {/* Logo icon */}
              <div
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, var(--pv-primary), var(--pv-primary-2))',
                }}
              >
                <Sparkles className="h-4 w-4 text-white" />
              </div>

              {/* Brand text */}
              <div
                className={`flex flex-col transition-all duration-300 ${
                  !showLabels ? 'w-0 opacity-0' : 'w-auto opacity-100'
                }`}
              >
                <span
                  className="font-heading text-lg font-bold leading-tight"
                  style={{ color: 'var(--pv-text)' }}
                >
                  PVS
                </span>
                <span
                  className="text-[10px] font-medium uppercase tracking-wider"
                  style={{ color: 'var(--pv-text-muted)' }}
                >
                  Studio
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <div className="space-y-6">
              {navSections.map((section, sectionIndex) => (
                <div key={sectionIndex}>
                  {/* Section header with divider */}
                  {section.title && (
                    <div className="mb-2">
                      {/* Divider line */}
                      {sectionIndex > 0 && (
                        <div
                          className="mb-3 h-px"
                          style={{ background: 'var(--pv-border)' }}
                        />
                      )}
                      {/* Section title - hidden when collapsed */}
                      {showLabels && (
                        <span
                          className="px-3 text-[10px] font-semibold uppercase tracking-wider"
                          style={{ color: 'var(--pv-text-muted)' }}
                        >
                          {section.title}
                        </span>
                      )}
                      {/* Show subtle dot indicator when collapsed */}
                      {!showLabels && (
                        <div className="flex justify-center">
                          <div
                            className="h-1 w-1 rounded-full"
                            style={{ background: 'var(--pv-text-muted)' }}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Section items */}
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.href);

                      return (
                        <div key={item.href} className="group relative">
                          <Link
                            href={item.available ? item.href : '#'}
                            className={`
                              relative flex items-center gap-3 rounded-xl px-3 py-2.5
                              transition-all duration-200
                              ${item.available ? 'cursor-pointer' : 'cursor-not-allowed opacity-40'}
                              ${active ? '' : 'hover:bg-[var(--pv-bg)]'}
                            `}
                            style={{
                              color: active ? 'white' : 'var(--pv-text)',
                              background: active
                                ? 'linear-gradient(135deg, var(--pv-primary), var(--pv-primary-2))'
                                : 'transparent',
                              boxShadow: active ? '0 4px 12px rgba(63, 0, 233, 0.3)' : 'none',
                            }}
                            onClick={(e) => {
                              if (!item.available) {
                                e.preventDefault();
                              }
                            }}
                          >
                            {/* Icon */}
                            <div className="flex-shrink-0">
                              <Icon
                                className={`h-[18px] w-[18px] transition-all duration-200 ${
                                  active ? '' : 'group-hover:scale-110'
                                }`}
                              />
                            </div>

                            {/* Label */}
                            <span
                              className={`whitespace-nowrap text-sm font-medium transition-all duration-300 ${
                                !showLabels ? 'w-0 overflow-hidden opacity-0' : 'w-auto opacity-100'
                              }`}
                            >
                              {item.label}
                            </span>

                            {/* Coming soon badge */}
                            {!item.available && showLabels && (
                              <span
                                className="ml-auto rounded-md px-1.5 py-0.5 text-[10px] font-medium"
                                style={{
                                  background: 'var(--pv-border)',
                                  color: 'var(--pv-text-muted)',
                                }}
                              >
                                Soon
                              </span>
                            )}
                          </Link>

                          {/* Tooltip for collapsed state */}
                          {!showLabels && item.available && (
                            <div
                              className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 hidden -translate-y-1/2 whitespace-nowrap rounded-lg px-3 py-2 opacity-0 shadow-xl transition-opacity duration-150 group-hover:opacity-100 lg:block"
                              style={{
                                background: 'var(--pv-bg)',
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
                </div>
              ))}
            </div>
          </nav>

          {/* Bottom section */}
          <div className="border-t px-3 py-4" style={{ borderColor: 'var(--pv-border)' }}>
            {/* Collapse toggle - desktop only */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="group hidden w-full items-center justify-center gap-2 rounded-xl p-2.5 transition-all duration-200 hover:bg-[var(--pv-bg)] lg:flex"
              style={{ color: 'var(--pv-text-muted)' }}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              ) : (
                <>
                  <ChevronLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
                  <span className="text-xs font-medium">Collapse</span>
                </>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

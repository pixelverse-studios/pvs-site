'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import {
  ChevronDown,
  Code2,
  Folder,
  HelpCircle,
  Info,
  LayoutDashboard,
  Menu,
  Palette,
  PenSquare,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { createPortal } from 'react-dom';

import { sharedMetadata } from '@/lib/metadata';
import { cn } from '@/lib/utils';

import { AuthDashboardLink } from './auth-dashboard-link';
import { Button } from './button';
import { ThemeToggle } from './theme-toggle';

export interface NavItemChild {
  label: string;
  href: string;
  description?: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItemChild[];
}

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  items?: NavItem[];
  cta?: {
    label: string;
    href: string;
  };
}

const LIGHT_LOGO_URL = sharedMetadata.logo.light;
const DARK_LOGO_URL = sharedMetadata.logo.dark;

const mobileNavIcons: Record<string, LucideIcon> = {
  About: Info,
  Services: Sparkles,
  Portfolio: Folder,
  Blog: PenSquare,
  FAQ: HelpCircle,
  Dashboard: LayoutDashboard,
  'Web Development': Code2,
  'UX/UI Design': Palette,
  SEO: Search,
};

export function Navbar({ className, items = [], cta, ...props }: NavbarProps) {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = React.useState(false);
  const [expandedMobileItem, setExpandedMobileItem] = React.useState<string | null>(null);
  const mobileCloseButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const [portalElement, setPortalElement] = React.useState<HTMLElement | null>(null);

  React.useEffect(() => {
    setMounted(true);
    if (typeof document !== 'undefined') {
      setPortalElement(document.body);
    }
  }, []);

  React.useEffect(() => {
    if (!isMobileNavOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMobileNavOpen]);

  React.useEffect(() => {
    if (!isMobileNavOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileNavOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    mobileCloseButtonRef.current?.focus();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileNavOpen]);

  const theme = (mounted ? resolvedTheme : undefined) ?? 'light';
  const isDarkMode = theme === 'dark';
  const logoSrc = isDarkMode ? DARK_LOGO_URL : LIGHT_LOGO_URL;

  const overlayBgClass = isDarkMode ? 'bg-black/65' : 'bg-[rgba(20,16,48,0.18)]';
  const primaryGradientClass = isDarkMode
    ? 'bg-[radial-gradient(140%_140%_at_30%_0%,rgba(118,70,255,0.95),rgba(10,8,32,0.98))]'
    : 'bg-[radial-gradient(140%_140%_at_30%_0%,rgba(118,70,255,0.38),rgba(255,255,255,0.98))]';
  const secondaryGradientClass = isDarkMode
    ? 'bg-[linear-gradient(170deg,rgba(12,10,38,0.82)_0%,rgba(6,5,24,0.92)_45%,rgba(4,3,20,0.98)_100%)]'
    : 'bg-[linear-gradient(176deg,rgba(255,255,255,0.85)_0%,rgba(247,243,255,0.92)_45%,rgba(240,236,255,0.97)_100%)]';
  const drawerTextClass = isDarkMode ? 'text-white' : 'text-[var(--pv-text)]';
  const closeButtonThemeClass = isDarkMode
    ? 'border-white/10 bg-white/5 text-white hover:border-white/30 hover:bg-white/10'
    : 'border-[rgba(63,0,233,0.2)] bg-white text-[var(--pv-primary)] shadow-[0_20px_44px_-32px_rgba(63,0,233,0.35)] hover:border-[rgba(63,0,233,0.35)] hover:bg-[rgba(255,255,255,0.92)]';
  const navItemBaseClass =
    'group flex items-center gap-4 rounded-2xl px-4 py-3 text-base transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pv-bg)]';
  const navItemThemeClass = isDarkMode
    ? 'text-white/80 hover:text-white'
    : 'text-[var(--pv-text-muted)] hover:text-[var(--pv-text)]';
  const navItemHoverBgClass = isDarkMode ? 'hover:bg-white/10' : 'hover:bg-[rgba(63,0,233,0.08)]';
  const navItemActiveClass = isDarkMode
    ? 'bg-white/12 text-white shadow-[0_24px_48px_-32px_rgba(120,65,255,0.75)]'
    : 'bg-[rgba(63,0,233,0.12)] text-[var(--pv-primary)] shadow-[0_24px_48px_-34px_rgba(63,0,233,0.35)]';
  const iconBaseClass =
    'flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 group-focus-visible:border-[var(--pv-primary)]';
  const iconThemeClass = isDarkMode
    ? 'border-white/12 bg-white/10 text-white/80 group-hover:border-white/40 group-hover:bg-white/20 group-hover:text-white'
    : 'border-[rgba(63,0,233,0.2)] bg-white text-[rgba(63,0,233,0.75)] shadow-[0_18px_36px_-32px_rgba(63,0,233,0.4)] group-hover:border-[rgba(63,0,233,0.45)] group-hover:bg-[rgba(63,0,233,0.08)] group-hover:text-[var(--pv-primary)]';
  const iconActiveClass = isDarkMode
    ? 'border-white/40 bg-white/20 text-white'
    : 'border-[rgba(63,0,233,0.55)] bg-[rgba(63,0,233,0.12)] text-[var(--pv-primary)]';

  const toggleMobileExpand = (label: string) => {
    setExpandedMobileItem((prev) => (prev === label ? null : label));
  };

  const mobileNavPortal =
    isMobileNavOpen && portalElement
      ? createPortal(
          <div className="fixed inset-0 z-[70] lg:hidden">
            <button
              type="button"
              className={cn(
                'absolute inset-0 backdrop-blur-sm transition-opacity duration-300',
                overlayBgClass,
              )}
              aria-hidden="true"
              tabIndex={-1}
              onClick={() => setIsMobileNavOpen(false)}
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="mobile-nav-title"
              className="relative flex h-full w-full flex-col overflow-hidden shadow-[0_32px_70px_-28px_rgba(18,0,64,0.65)]"
            >
              <div className={cn('pointer-events-none absolute inset-0', primaryGradientClass)} />
              <div className={cn('pointer-events-none absolute inset-0', secondaryGradientClass)} />
              <div
                className={cn(
                  'relative z-10 flex min-h-[100svh] flex-col overflow-y-auto px-7 py-9',
                  drawerTextClass,
                )}
              >
                <div className="flex items-center justify-between">
                  <Link
                    href="/"
                    className="flex items-center gap-3 text-base font-medium"
                    id="mobile-nav-title"
                    aria-label="PixelVerse Studios"
                    onClick={() => setIsMobileNavOpen(false)}
                  >
                    <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-[18px] border border-[var(--pv-border)] bg-[var(--pv-bg)] shadow-[0_16px_34px_-20px_rgba(63,0,233,0.48)] transition-transform duration-200 hover:-translate-y-0.5 dark:border-white/10 dark:bg-[var(--pv-surface)] dark:shadow-[0_22px_46px_-28px_rgba(12,14,52,0.78)]">
                      <Image
                        key={`mobile-${logoSrc}`}
                        src={logoSrc}
                        alt="PixelVerse Studios logo"
                        width={40}
                        height={40}
                        className="object-contain"
                        priority={false}
                      />
                    </span>
                    <span
                      className={cn(
                        'text-lg font-semibold tracking-wide',
                        isDarkMode ? 'text-white' : 'text-[var(--pv-text)]',
                      )}
                    >
                      PixelVerse Studios
                    </span>
                  </Link>
                  <button
                    type="button"
                    className={cn(
                      'inline-flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pv-bg)]',
                      closeButtonThemeClass,
                    )}
                    aria-label="Close navigation"
                    ref={mobileCloseButtonRef}
                    onClick={() => setIsMobileNavOpen(false)}
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
                <nav className="mt-10 flex flex-1 flex-col gap-1 text-sm font-medium">
                  {items.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      (item.href !== '/' && pathname.startsWith(`${item.href}/`));
                    const Icon = mobileNavIcons[item.label] ?? Sparkles;
                    const hasChildren = item.children && item.children.length > 0;
                    const isExpanded = expandedMobileItem === item.label;

                    return (
                      <div key={item.href}>
                        <div className="flex items-center">
                          <Link
                            href={item.href}
                            aria-current={isActive ? 'page' : undefined}
                            onClick={() => setIsMobileNavOpen(false)}
                            className={cn(
                              navItemBaseClass,
                              navItemThemeClass,
                              navItemHoverBgClass,
                              isActive && navItemActiveClass,
                              'flex-1',
                            )}
                          >
                            <span
                              className={cn(
                                iconBaseClass,
                                iconThemeClass,
                                isActive && iconActiveClass,
                              )}
                            >
                              <Icon className="h-4 w-4" aria-hidden="true" />
                            </span>
                            <span className="flex-1">{item.label}</span>
                          </Link>
                          {hasChildren && (
                            <button
                              type="button"
                              onClick={() => toggleMobileExpand(item.label)}
                              className={cn(
                                'mr-2 inline-flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200',
                                isDarkMode
                                  ? 'text-white/60 hover:bg-white/10 hover:text-white'
                                  : 'text-[var(--pv-text-muted)] hover:bg-[rgba(63,0,233,0.08)] hover:text-[var(--pv-primary)]',
                              )}
                              aria-label={isExpanded ? 'Collapse submenu' : 'Expand submenu'}
                              aria-expanded={isExpanded}
                            >
                              <ChevronDown
                                className={cn(
                                  'h-4 w-4 transition-transform duration-200',
                                  isExpanded && 'rotate-180',
                                )}
                                aria-hidden="true"
                              />
                            </button>
                          )}
                        </div>
                        {/* Mobile submenu */}
                        {hasChildren && isExpanded && (
                          <div className="ml-14 mt-1 flex flex-col gap-1 border-l-2 border-[var(--pv-border)] pl-4 dark:border-white/10">
                            {item.children!.map((child) => {
                              const childIsActive = pathname === child.href;
                              const ChildIcon = mobileNavIcons[child.label] ?? Sparkles;

                              return (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  onClick={() => setIsMobileNavOpen(false)}
                                  className={cn(
                                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200',
                                    isDarkMode
                                      ? 'text-white/70 hover:bg-white/10 hover:text-white'
                                      : 'text-[var(--pv-text-muted)] hover:bg-[rgba(63,0,233,0.08)] hover:text-[var(--pv-text)]',
                                    childIsActive &&
                                      (isDarkMode
                                        ? 'bg-white/10 text-white'
                                        : 'bg-[rgba(63,0,233,0.1)] text-[var(--pv-primary)]'),
                                  )}
                                >
                                  <ChildIcon className="h-4 w-4" aria-hidden="true" />
                                  <span>{child.label}</span>
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {/* Dashboard link - only visible to authenticated users */}
                  <AuthDashboardLink
                    variant="mobile"
                    isDarkMode={isDarkMode}
                    onNavigate={() => setIsMobileNavOpen(false)}
                  />
                </nav>
                {cta && (
                  <div className="mt-10 pt-6">
                    <Button
                      asChild
                      variant="cta"
                      className="h-12 w-full rounded-full text-base font-semibold tracking-wide shadow-[0_24px_48px_-30px_rgba(122,64,255,0.9)]"
                      onClick={() => setIsMobileNavOpen(false)}
                    >
                      <Link href={cta.href}>{cta.label}</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>,
          portalElement,
        )
      : null;

  return (
    <>
      <header
        className={cn(
          'pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4 transition-all duration-300 sm:top-6 md:top-8',
          className,
        )}
        {...props}
      >
        <div className="bg-[var(--pv-surface)]/85 dark:bg-[var(--pv-surface)]/92 pointer-events-auto flex w-full max-w-5xl items-center gap-4 rounded-pv-lg border border-[var(--pv-border)] px-4 py-3 shadow-[0_28px_60px_-30px_rgba(32,32,72,0.55)] backdrop-blur-xl transition-colors duration-300 dark:shadow-[0_48px_96px_-52px_rgba(12,14,52,0.72)] lg:gap-6 lg:px-6">
          <Link href="/" className="flex items-center">
            <span className="relative inline-flex h-16 w-16 items-center justify-center rounded-pv border border-[var(--pv-border)] bg-[var(--pv-bg)] shadow-[0_18px_34px_-22px_rgba(63,0,233,0.55)] transition-transform duration-200 hover:-translate-y-0.5 dark:bg-[var(--pv-surface)] dark:shadow-[0_22px_48px_-30px_rgba(12,14,52,0.7)]">
              <Image
                key={logoSrc}
                src={logoSrc}
                alt="PixelVerse Studios logo"
                width={64}
                height={64}
                className="object-contain"
                priority
              />
            </span>
          </Link>
          {items.length > 0 && (
            <nav
              aria-label="Primary navigation"
              className="hidden flex-1 items-center justify-center gap-4 text-sm font-medium lg:flex"
            >
              {items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/' && pathname.startsWith(`${item.href}/`));
                const hasChildren = item.children && item.children.length > 0;

                if (hasChildren) {
                  return (
                    <div key={item.href} className="group relative">
                      <Link
                        href={item.href}
                        aria-current={isActive ? 'page' : undefined}
                        className={cn(
                          'relative inline-flex items-center gap-1 rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 ease-out',
                          'text-[var(--pv-text-muted)] hover:text-[var(--pv-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pv-bg)]',
                          'hover:bg-white/85 hover:shadow-[0_18px_40px_-28px_rgba(63,0,233,0.25)] dark:hover:bg-white/10',
                          'after:absolute after:inset-0 after:-z-10 after:rounded-full after:border after:border-transparent after:transition-[border,transform] after:duration-200 group-hover:after:scale-105 group-hover:after:border-[rgba(63,0,233,0.35)] dark:group-hover:after:border-[rgba(159,166,221,0.35)]',
                          isActive &&
                            'bg-[linear-gradient(90deg,var(--pv-primary),var(--pv-primary-2))] text-white shadow-[0_22px_44px_-28px_rgba(63,0,233,0.75)] after:scale-100 after:border-transparent hover:text-white',
                        )}
                      >
                        {item.label}
                        <ChevronDown
                          className={cn(
                            'h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180',
                            isActive ? 'text-white/80' : 'text-[var(--pv-text-muted)]',
                          )}
                          aria-hidden="true"
                        />
                      </Link>
                      {/* Desktop dropdown */}
                      <div
                        className="invisible absolute left-1/2 top-full z-50 pt-2 opacity-0 transition-all duration-200 ease-out group-hover:visible group-hover:opacity-100"
                        style={{ transform: 'translateX(-50%)' }}
                      >
                        <div className="min-w-[240px] overflow-hidden rounded-pv border border-[var(--pv-border)] bg-[var(--pv-bg)] p-2 shadow-[0_24px_48px_-20px_rgba(63,0,233,0.35)] dark:bg-[var(--pv-surface)] dark:shadow-[0_32px_64px_-28px_rgba(12,14,52,0.8)]">
                          {item.children!.map((child) => {
                            const ChildIcon = mobileNavIcons[child.label] ?? Sparkles;
                            const childIsActive = pathname === child.href;

                            return (
                              <Link
                                key={child.href}
                                href={child.href}
                                className={cn(
                                  'flex items-center gap-3 rounded-pv-sm px-3 py-2.5 text-sm transition-all duration-150',
                                  'text-[var(--pv-text-muted)] hover:bg-[var(--pv-surface)] hover:text-[var(--pv-text)]',
                                  'dark:hover:bg-white/10',
                                  childIsActive &&
                                    'bg-[rgba(63,0,233,0.08)] text-[var(--pv-primary)] dark:bg-white/10 dark:text-white',
                                )}
                              >
                                <span
                                  className={cn(
                                    'flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
                                    childIsActive
                                      ? 'bg-[linear-gradient(135deg,var(--pv-primary),var(--pv-primary-2))] text-white shadow-[0_8px_16px_-8px_rgba(63,0,233,0.6)]'
                                      : 'bg-[var(--pv-surface)] text-[var(--pv-text-muted)] dark:bg-white/10',
                                  )}
                                >
                                  <ChildIcon className="h-4 w-4" aria-hidden="true" />
                                </span>
                                <div className="flex flex-col">
                                  <span className="font-medium">{child.label}</span>
                                  {child.description && (
                                    <span className="text-xs text-[var(--pv-text-muted)]">
                                      {child.description}
                                    </span>
                                  )}
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'group relative inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 ease-out',
                      'text-[var(--pv-text-muted)] hover:text-[var(--pv-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pv-bg)]',
                      'hover:bg-white/85 hover:shadow-[0_18px_40px_-28px_rgba(63,0,233,0.25)] dark:hover:bg-white/10',
                      'after:absolute after:inset-0 after:-z-10 after:rounded-full after:border after:border-transparent after:transition-[border,transform] after:duration-200 group-hover:after:scale-105 group-hover:after:border-[rgba(63,0,233,0.35)] dark:group-hover:after:border-[rgba(159,166,221,0.35)]',
                      isActive &&
                        'bg-[linear-gradient(90deg,var(--pv-primary),var(--pv-primary-2))] text-white shadow-[0_22px_44px_-28px_rgba(63,0,233,0.75)] after:scale-100 after:border-transparent hover:text-white',
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          )}
          <div className="ml-auto flex items-center gap-2 lg:gap-3">
            {/* Dashboard link - only visible to authenticated users */}
            <div className="hidden lg:flex">
              <AuthDashboardLink variant="desktop" />
            </div>
            {cta && (
              <Button asChild variant="cta" className="hidden lg:inline-flex">
                <Link href={cta.href} className="whitespace-nowrap">
                  {cta.label}
                </Link>
              </Button>
            )}
            {items.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="inline-flex lg:hidden"
                aria-label="Open navigation"
                aria-expanded={isMobileNavOpen}
                onClick={() => setIsMobileNavOpen(true)}
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </Button>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>
      {mobileNavPortal}
    </>
  );
}

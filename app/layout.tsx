import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import type { ReactNode } from 'react';

import './globals.css';
import { Footer } from '@/components/ui/footer';
import { Navbar } from '@/components/ui/navbar';
import { ThemeProvider } from '@/components/theme-provider';

const headingFont = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-heading',
});

const bodyFont = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'PixelVerse Studios Design System',
  description: 'PixelVerse Studios design system with light and dark theming.',
};

const navItems = [
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Packages', href: '/packages' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Contact', href: '/contact' }
];

const footerLinks = [
  { label: 'Design tokens', href: '/styleguide#foundations' },
  { label: 'Components', href: '/styleguide#components' },
  { label: 'Accessibility', href: '/styleguide#accessibility' },
];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${headingFont.variable} ${bodyFont.variable} min-h-screen bg-[var(--pv-bg)] font-body text-[var(--pv-text)] antialiased transition-colors duration-300`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Navbar items={navItems} cta={{ label: 'Launch console', href: '#' }} />
            <div className="flex-1">{children}</div>
            <Footer links={footerLinks} cta={{ label: 'Join the beta', href: '#' }} />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

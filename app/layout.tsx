import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import type { ReactNode } from 'react';

import './globals.css';
import { Footer } from '@/components/ui/footer';
import { Navbar } from '@/components/ui/navbar';
import { ThemeProvider } from '@/components/theme-provider';
import { sharedMetadata } from '@/lib/metadata';

const headingFont = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-heading',
});

const bodyFont = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

const { siteUrl, siteName, defaultOgImage } = sharedMetadata;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} | Custom Web Design & SEO`,
    template: `%s | ${siteName}`,
  },
  description:
    'PixelVerse Studios crafts custom-coded marketing websites with UX-first design, blazing performance, and SEO foundations that drive conversions.',
  keywords: [
    'PixelVerse Studios',
    'custom web design',
    'Next.js development agency',
    'Bergen County SEO',
    'UX-first websites',
  ],
  authors: [{ name: 'PixelVerse Studios' }],
  creator: 'PixelVerse Studios',
  publisher: 'PixelVerse Studios',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: `${siteName} | Custom Web Design & SEO`,
    description:
      'PixelVerse Studios crafts custom-coded marketing websites with UX-first design, blazing performance, and SEO foundations that drive conversions.',
    url: siteUrl,
    siteName,
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: 'PixelVerse Studios brand mark',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} | Custom Web Design & SEO`,
    description:
      'PixelVerse Studios crafts custom-coded marketing websites with UX-first design, blazing performance, and SEO foundations that drive conversions.',
    images: [defaultOgImage],
  },
  icons: {
    icon: '/logo-light.png',
    shortcut: '/logo-light.png',
    apple: '/logo-light.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const navItems = [
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Packages', href: '/packages' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'FAQ', href: '/faq' },
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
            <Navbar items={navItems} cta={{ label: 'Get Started', href: '/contact' }} />
            <div className="flex-1">{children}</div>
            <Footer cta={{ label: 'Get in touch with us', href: '/contact' }} />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

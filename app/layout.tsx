import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import { headers } from 'next/headers';
import { Suspense } from 'react';
import type { ReactNode } from 'react';

import './globals.css';
import { CampaignTrackerClient } from '@/components/campaign-tracker-client';
import { LayoutWrapper } from '@/components/layout-wrapper';
import { NonceProvider } from '@/components/nonce-provider';
import { SiteBehaviourScript } from '@/components/sitebehaviour-script';
import { ThemeProvider } from '@/components/theme-provider';
import { DarkThemePicker } from '@/components/ui/dark-theme-picker';
import { StructuredData } from '@/components/ui/structured-data';
import { sharedMetadata } from '@/lib/metadata';
import { localBusinessSchema, websiteSchema } from '@/lib/structured-data';

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

const siteBehaviourSecret = process.env.NEXT_PUBLIC_SITEBEHAVIOUR_SECRET?.trim();
const enableSiteBehaviourTracking = Boolean(
  siteBehaviourSecret && process.env.NODE_ENV === 'production',
);

// Bootstraps SiteBehaviour analytics loader after hydration.
const siteBehaviourBootstrap = enableSiteBehaviourTracking
  ? `(function(){try{if(window.location&&window.location.search&&window.location.search.indexOf('capture-sitebehaviour-heatmap')!==-1){sessionStorage.setItem('capture-sitebehaviour-heatmap','_');}var sbSiteSecret='${siteBehaviourSecret}';window.sitebehaviourTrackingSecret=sbSiteSecret;var scriptElement=document.createElement('script');scriptElement.defer=true;scriptElement.id='site-behaviour-script-v2';scriptElement.src='https://sitebehaviour-cdn.fra1.cdn.digitaloceanspaces.com/index.min.js?sitebehaviour-secret='+sbSiteSecret;document.head.appendChild(scriptElement);}catch(e){console.error(e);}})();`
  : null;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} | Custom Web Design & SEO`,
    template: `%s | ${siteName}`,
  },
  description:
    'PixelVerse Studios builds custom websites and SEO strategies for New Jersey businesses. Focused on real outcomes — sites that rank, convert, and scale.',
  keywords: [
    'PixelVerse Studios',
    'custom web design New Jersey',
    'web design Bergen County',
    'SEO services NJ',
    'conversion-focused websites',
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
      'PixelVerse Studios builds custom websites and SEO strategies for New Jersey businesses. Focused on real outcomes — sites that rank, convert, and scale.',
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
      'PixelVerse Studios builds custom websites and SEO strategies for New Jersey businesses. Focused on real outcomes — sites that rank, convert, and scale.',
    images: [defaultOgImage],
  },
  icons: {
    icon: sharedMetadata.logo.light,
    shortcut: sharedMetadata.logo.light,
    apple: sharedMetadata.logo.light,
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
  {
    label: 'Services',
    href: '/services',
    children: [
      {
        label: 'Web Design & Development',
        href: '/services/web-development',
        description: 'Custom-coded websites built from the ground up',
      },
      {
        label: 'Optimization & SEO',
        href: '/services/seo',
        description: 'Local visibility and search performance',
      },
    ],
  },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Blog', href: '/blog' },
  { label: 'FAQ', href: '/faq' },
];

export default async function RootLayout({ children }: { children: ReactNode }) {
  const nonce = (await headers()).get('x-nonce') ?? undefined;

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${headingFont.variable} ${bodyFont.variable} min-h-screen bg-[var(--pv-bg)] font-body text-[var(--pv-text)] antialiased transition-colors duration-300`}
      >
        <NonceProvider nonce={nonce}>
          {enableSiteBehaviourTracking && siteBehaviourBootstrap ? (
            <SiteBehaviourScript bootstrapScript={siteBehaviourBootstrap} />
          ) : null}
          <StructuredData id="pixelverse-local-business" data={localBusinessSchema} />
          <StructuredData id="pixelverse-website" data={websiteSchema} />
          <ThemeProvider disableTransitionOnChange>
            <Suspense fallback={null}>
              <CampaignTrackerClient />
            </Suspense>
            <LayoutWrapper navItems={navItems}>
              {children}
            </LayoutWrapper>
            <DarkThemePicker />
          </ThemeProvider>
        </NonceProvider>
      </body>
    </html>
  );
}

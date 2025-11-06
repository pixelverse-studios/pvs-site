import Script from 'next/script';
import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import type { ReactNode } from 'react';

import './globals.css';
import { Footer } from '@/components/ui/footer';
import { Navbar } from '@/components/ui/navbar';
import { ThemeProvider } from '@/components/theme-provider';
import { StructuredData } from '@/components/ui/structured-data';
import { sharedMetadata } from '@/lib/metadata';
import { getContactContexts } from '@/data/contact-contexts';
import { localBusinessSchema } from '@/lib/structured-data';

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

const siteBehaviourSecret = '6120790c-39c8-4c54-8e1c-558bddff11d3';

// Bootstraps SiteBehaviour analytics loader after hydration.
const siteBehaviourBootstrap = `(function(){try{if(window.location&&window.location.search&&window.location.search.indexOf('capture-sitebehaviour-heatmap')!==-1){sessionStorage.setItem('capture-sitebehaviour-heatmap','_');}var sbSiteSecret='${siteBehaviourSecret}';window.sitebehaviourTrackingSecret=sbSiteSecret;var scriptElement=document.createElement('script');scriptElement.defer=true;scriptElement.id='site-behaviour-script-v2';scriptElement.src='https://sitebehaviour-cdn.fra1.cdn.digitaloceanspaces.com/index.min.js?sitebehaviour-secret='+sbSiteSecret;document.head.appendChild(scriptElement);}catch(e){console.error(e);}})();`;

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
  { label: 'Services', href: '/services' },
  { label: 'Packages', href: '/packages' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Blog', href: '/blog' },
  { label: 'FAQ', href: '/faq' },
];

const localContactLinks = getContactContexts().map((context) => ({
  label: context.locationLabel,
  href: `/contact/${context.slug}`,
}));

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${headingFont.variable} ${bodyFont.variable} min-h-screen bg-[var(--pv-bg)] font-body text-[var(--pv-text)] antialiased transition-colors duration-300`}
      >
        <Script id="sitebehaviour-tracking" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: siteBehaviourBootstrap }} />
        <StructuredData id="pixelverse-local-business" data={localBusinessSchema} />
        <ThemeProvider disableTransitionOnChange>
          <div className="flex min-h-screen flex-col">
            <Navbar items={navItems} cta={{ label: 'Get Started', href: '/contact' }} />
            <div className="flex-1">{children}</div>
            <Footer
              links={navItems}
              localContactLinks={localContactLinks}
              cta={{ label: 'Get in touch with us', href: '/contact' }}
            />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

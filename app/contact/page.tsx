import type { Metadata } from 'next';

import { ContactClosingCtaSection } from '@/components/contact/contact-closing-cta';
import { ContactHeroSection } from '@/components/contact/contact-hero-section';
// import { ContactIntroSection } from '@/components/contact/contact-intro-section';
import { ContactMethodsSection } from '@/components/contact/contact-methods-section';
import { ContactTrustSection } from '@/components/contact/contact-trust-section';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Contact PixelVerse Studios | Book a Strategy Call',
  description:
    'Reach PixelVerse to discuss custom web design and local SEO. Book a strategy session or send project details to kick off your build.',
  path: '/contact',
  keywords: [
    'contact PixelVerse Studios',
    'web design consultation',
    'schedule SEO call',
    'custom website inquiry',
    'Bergen County digital agency',
  ],
});

export default function ContactPage() {
  return (
    <main>
      <ContactHeroSection />
      <ContactMethodsSection />
      <ContactTrustSection />
      <ContactClosingCtaSection />
    </main>
  );
}

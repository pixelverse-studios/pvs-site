import type { Metadata } from 'next';

import { ContactClosingCtaSection } from '@/components/contact/contact-closing-cta';
import { ContactHeroSection } from '@/components/contact/contact-hero-section';
import { ContactIntroSection } from '@/components/contact/contact-intro-section';
import { ContactMethodsSection } from '@/components/contact/contact-methods-section';
import { ContactTrustSection } from '@/components/contact/contact-trust-section';

export const metadata: Metadata = {
  title: 'Contact PixelVerse Studios',
  description:
    'Start your project with PixelVerse Studios. Reach out via form, email, or schedule a call to create a high-impact, custom-coded website.'
};

export default function ContactPage() {
  return (
    <main>
      <ContactHeroSection />
      <ContactIntroSection />
      <ContactMethodsSection />
      <ContactTrustSection />
      <ContactClosingCtaSection />
    </main>
  );
}

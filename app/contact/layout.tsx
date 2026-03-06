import type { ReactNode } from 'react';

import { ContactHero } from '@/components/contact/contact-hero';
import { ContactPageClient } from '@/components/contact/contact-page-client';

export default function ContactLayout({ children }: { children: ReactNode }) {
  return (
    <main>
      {children}
      <ContactHero />
      <ContactPageClient />
    </main>
  );
}

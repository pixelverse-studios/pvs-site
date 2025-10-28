import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ContactClosingCtaSection } from '@/components/contact/contact-closing-cta';
import { ContactHeroSection } from '@/components/contact/contact-hero-section';
import { ContactIntroSection } from '@/components/contact/contact-intro-section';
import { ContactMethodsSection } from '@/components/contact/contact-methods-section';
import { ContactTrustSection } from '@/components/contact/contact-trust-section';
import { getContactContext, getContactContexts } from '@/data/contact-contexts';
import { createPageMetadata } from '@/lib/metadata';

type Params = {
  context: string;
};

export function generateStaticParams() {
  return getContactContexts().map((context) => ({
    context: context.slug,
  }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const context = getContactContext(params.context);

  if (!context) {
    return {};
  }

  return createPageMetadata({
    title: context.metaTitle,
    description: context.metaDescription,
    path: `/contact/${context.slug}`,
    keywords: context.keywords,
  });
}

export default function ContactContextPage({ params }: { params: Params }) {
  const context = getContactContext(params.context);

  if (!context) {
    notFound();
  }

  return (
    <main>
      <ContactHeroSection heading={context.heroHeading} subtitle={context.heroSubtitle} />
      <ContactIntroSection message={context.introMessage} />
      <ContactMethodsSection />
      <ContactTrustSection />
      <ContactClosingCtaSection />
    </main>
  );
}

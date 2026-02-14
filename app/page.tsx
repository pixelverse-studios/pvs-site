import type { Metadata } from 'next';

import { CaseStudySection } from '@/components/home/case-study-section';
import { FinalCtaSection } from '@/components/home/final-cta-section';
import { HeroSection } from '@/components/home/hero-section';
import { ProcessSection } from '@/components/home/process-section';
import { ServicesSection } from '@/components/home/services-section';
import { TestimonialCarousel } from '@/components/home/testimonial-carousel';
import { WhySection } from '@/components/home/why-section';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Intentional Web Design & Development | PixelVerse Studios',
  description:
    'We build custom websites with purpose. No templates. Every project starts with your goals and ends with a site that actually works for your business.',
  path: '/',
  keywords: [
    'intentional web design',
    'custom website development',
    'conversion-focused web design',
    'user journey mapping',
    'performance-first websites',
  ],
});

export default function Home() {
  return (
    <main>
      <HeroSection />
      <WhySection />
      <CaseStudySection />
      <ProcessSection />
      <TestimonialCarousel />
      <ServicesSection />
      <FinalCtaSection />
    </main>
  );
}

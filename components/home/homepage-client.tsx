'use client';

import { CaseStudySection } from '@/components/home/case-study-section';
import { FinalCtaSection } from '@/components/home/final-cta-section';
import { HeroSwitcher } from '@/components/home/hero-switcher';
import { InsightSwitcher } from '@/components/home/insight-switcher';
import { ProcessSection } from '@/components/home/process-section';
import { ServicesSection } from '@/components/home/services-section';
import { TestimonialCarousel } from '@/components/home/testimonial-carousel';
import { VariantPanelProvider } from '@/components/home/variant-panel';
import { WhySection } from '@/components/home/why-section';

export function HomepageClient() {
  return (
    <VariantPanelProvider>
      <main>
        <HeroSwitcher />
        <WhySection />
        <CaseStudySection />
        <InsightSwitcher />
        <ProcessSection />
        <TestimonialCarousel />
        <ServicesSection />
        <FinalCtaSection />
      </main>
    </VariantPanelProvider>
  );
}

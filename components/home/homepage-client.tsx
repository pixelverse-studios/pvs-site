'use client';

import { CaseStudySection } from '@/components/home/case-study-section';
import { FinalCtaSection } from '@/components/home/final-cta-section';
import { HeroSection } from '@/components/home/hero-section';
import { InsightSection } from '@/components/home/insight-section';
import { ProcessSection } from '@/components/home/process-section';
import { ServicesSection } from '@/components/home/services-section';
import { TestimonialCarousel } from '@/components/home/testimonial-carousel';
import { WhySection } from '@/components/home/why-section';

export function HomepageClient() {
  return (
    <main>
      <HeroSection />
      <WhySection />
      <CaseStudySection />
      <InsightSection />
      <ProcessSection />
      <TestimonialCarousel />
      <ServicesSection />
      <FinalCtaSection />
    </main>
  );
}

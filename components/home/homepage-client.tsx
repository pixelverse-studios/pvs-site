'use client';

import { CaseStudySection } from '@/components/home/case-study-section';
import { FinalCtaSection } from '@/components/home/final-cta-section';
import { HeroSection } from '@/components/home/hero-section';
import { HomeFaqSection } from '@/components/home/home-faq-section';
import { InsightSection } from '@/components/home/insight-section';
import { ProcessSection } from '@/components/home/process-section';
import { ServicesSection } from '@/components/home/services-section';
import { TestimonialCarousel } from '@/components/home/testimonial-carousel';
import { WhySection } from '@/components/home/why-section';

export function HomepageClient({ badge }: { badge?: string }) {
  return (
    <main>
      <HeroSection badge={badge} />
      <WhySection />
      <CaseStudySection />
      <InsightSection />
      <ProcessSection />
      <TestimonialCarousel />
      <HomeFaqSection />
      <ServicesSection />
      <FinalCtaSection />
    </main>
  );
}

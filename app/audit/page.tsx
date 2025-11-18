import type { Metadata } from 'next';

import { AuditHeroSection } from '@/components/audit/audit-hero-section';
import { AuditFormSection } from '@/components/audit/audit-form-section';
import { AuditProcessSection } from '@/components/audit/audit-process-section';
import { AuditReviewSection } from '@/components/audit/audit-review-section';
import { AuditWhySection } from '@/components/audit/audit-why-section';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Free Website Audit | PixelVerse Studios',
  description:
    'Request a no-cost, 360° website audit from PixelVerse Studios. Get a prioritized plan for UX, SEO, speed, and conversion improvements in 2-3 business days.',
  path: '/audit',
  keywords: [
    'free website audit',
    'pixelverse audit',
    'web performance assessment',
    'SEO audit bergen county',
    'conversion rate review',
  ],
});

export default function AuditPage() {
  return (
    <main>
      <AuditHeroSection />
      <AuditReviewSection />
      <AuditWhySection />
      <AuditProcessSection />
      <AuditFormSection />
    </main>
  );
}

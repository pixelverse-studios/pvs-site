import type { Metadata } from 'next';

import { AboutCtaSection } from '@/components/about/about-cta-section';
import { AboutGoogleReviewsSection } from '@/components/about/about-google-reviews-section';
import { AboutHeroSection } from '@/components/about/about-hero-section';
import { AboutNarrativeSection } from '@/components/about/about-narrative-section';
import { AboutTestimonialsSection } from '@/components/about/about-testimonials-section';
import { TeamSection } from '@/components/about/team-section';
import { aboutContent } from '@/data/about';
import { getGoogleRatingData } from '@/lib/api/google-places';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'About Us — Partnership-Driven Web Design & Development | PixelVerse Studios',
  description:
    'PixelVerse Studios partners with businesses using a system-thinking, clarity-first approach to web design, development, and optimization.',
  path: '/about',
  keywords: [
    'partnership approach web development',
    'system thinking web design',
    'long-term web development',
    'consultative web agency',
    'clarity-first approach',
    'web development Bergen County NJ',
  ],
});

export const revalidate = 86400;

export default async function AboutPage() {
  const googleRating = await getGoogleRatingData();

  return (
    <main>
      {/* 1. Hero */}
      <AboutHeroSection />

      {/* 2. Our Approach — cards break out wide for visual impact */}
      <AboutNarrativeSection
        title={aboutContent.ourApproach.title}
        intro={aboutContent.ourApproach.intro}
        bulletPoints={aboutContent.ourApproach.bulletPoints}
        closing={aboutContent.ourApproach.closing}
        background="surface"
        bulletLayout="cards"
      />

      {/* 3. Built for Clarity — short fragments flow as inline chips */}
      <AboutNarrativeSection
        title={aboutContent.builtForClarity.title}
        intro={aboutContent.builtForClarity.intro}
        bulletPoints={aboutContent.builtForClarity.bulletPoints}
        closing={aboutContent.builtForClarity.closing}
        bulletLayout="inline"
      />

      {/* 4. Design, Development, and Optimization — connected disciplines */}
      <AboutNarrativeSection
        title={aboutContent.designDevOptimization.title}
        intro={aboutContent.designDevOptimization.intro}
        bulletPoints={aboutContent.designDevOptimization.bulletPoints}
        closing={aboutContent.designDevOptimization.closing}
        background="surface"
        bulletLayout="connected"
      />

      {/* 5. A Long-Term Perspective */}
      <AboutNarrativeSection
        title={aboutContent.longTermPerspective.title}
        body={aboutContent.longTermPerspective.body}
      />

      {/* 6. Team */}
      <TeamSection />

      {/* 7. Client Testimonials */}
      <AboutTestimonialsSection
        title="What Our Clients Say"
        testimonials={aboutContent.testimonials}
      />

      {/* 8. Google Reviews (auto-hides when reviewCount is 0) */}
      <AboutGoogleReviewsSection
        title="Rated on Google"
        reviews={{
          ...aboutContent.googleReviews,
          rating: googleRating.rating,
          reviewCount: googleRating.reviewCount,
        }}
        background="surface"
      />

      {/* 9. CTA */}
      <AboutCtaSection />
    </main>
  );
}

import { ClosingCtaSection } from '@/components/home/closing-cta-section';
import { HeroSection } from '@/components/home/hero-section';
import { PackagesSection } from '@/components/home/packages-section';
import { ServicesSection } from '@/components/home/services-section';
import { ValueSection } from '@/components/home/value-section';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ValueSection />
      <ServicesSection />
      <PackagesSection />
      <ClosingCtaSection />
    </main>
  );
}

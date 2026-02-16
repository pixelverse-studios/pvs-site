'use client';

import { HeroSection } from './hero-section';
import { HeroVariantB } from './hero-variant-b';
import { HeroVariantC } from './hero-variant-c';
import { useVariant } from './variant-panel';

const heroComponents: Record<string, React.ComponentType> = {
  A: HeroSection,
  B: HeroVariantB,
  C: HeroVariantC,
};

export function HeroSwitcher() {
  const active = useVariant('hero');
  const ActiveHero = heroComponents[active] || HeroSection;

  return <ActiveHero />;
}

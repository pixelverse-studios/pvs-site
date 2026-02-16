'use client';

import { InsightSection } from './insight-section';
import { InsightSectionVariantB } from './insight-section-variant-b';
import { InsightSectionVariantC } from './insight-section-variant-c';
import { useVariant } from './variant-panel';

const insightComponents: Record<string, React.ComponentType> = {
  A: InsightSection,
  B: InsightSectionVariantB,
  C: InsightSectionVariantC,
};

export function InsightSwitcher() {
  const active = useVariant('insight');
  const ActiveComponent = insightComponents[active] || InsightSection;

  return <ActiveComponent />;
}

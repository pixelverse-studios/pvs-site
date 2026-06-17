import {
  ServicePackagePricingSection,
  type ServicePricingPackage,
} from './service-package-pricing-section';

export interface SeoPackagePricingSectionProps {
  eyebrow: string;
  title: string;
  intro: string;
  packages: ServicePricingPackage[];
}

export function SeoPackagePricingSection({
  eyebrow,
  title,
  intro,
  packages,
}: SeoPackagePricingSectionProps) {
  return (
    <ServicePackagePricingSection
      id="seo-pricing-heading"
      eyebrow={eyebrow}
      title={title}
      intro={intro}
      packages={packages}
      serviceLabel="SEO"
      interest="seo"
      detailsLabel="SEO"
    />
  );
}

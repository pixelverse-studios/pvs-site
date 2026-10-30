import {
  ServicePackagePricingSection,
  type ServicePricingPackage,
} from './service-package-pricing-section';

export interface SeoPackagePricingSectionProps {
  eyebrow: string;
  title: string;
  intro: string;
  packages: ServicePricingPackage[];
  footnote?: string;
}

export function SeoPackagePricingSection({
  eyebrow,
  title,
  intro,
  packages,
  footnote,
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
      footnote={footnote}
    />
  );
}

/**
 * Combined package and add-on options for the contact form multi-select.
 * Groups all services by category for the "Interested In" field.
 */

import type { MultiSelectGroup } from '@/components/ui/multi-select';
import { websitePackages, seoPackages } from './packages';
import { developmentAddons, seoAddons, uxuiAddons } from './addons';

// All valid service IDs for validation
export const serviceOptionIds = [
  // Website Packages
  ...websitePackages.map((p) => p.id),
  // SEO Packages
  ...seoPackages.map((p) => p.id),
  // Development Add-ons
  ...developmentAddons.map((a) => a.id),
  // SEO Add-ons
  ...seoAddons.map((a) => a.id),
  // UX/UI Add-ons
  ...uxuiAddons.map((a) => a.id),
] as const;

export type ServiceOptionId = (typeof serviceOptionIds)[number];

// Grouped options for MultiSelect component
export const serviceOptionGroups: MultiSelectGroup[] = [
  {
    label: 'Website Packages',
    options: websitePackages.map((p) => ({
      value: p.id,
      label: p.name,
    })),
  },
  {
    label: 'SEO Packages',
    options: seoPackages.map((p) => ({
      value: p.id,
      label: p.name,
    })),
  },
  {
    label: 'Development Add-ons',
    options: developmentAddons.map((a) => ({
      value: a.id,
      label: a.title,
    })),
  },
  {
    label: 'SEO Add-ons',
    options: seoAddons.map((a) => ({
      value: a.id,
      label: a.title,
    })),
  },
  {
    label: 'UX/UI Add-ons',
    options: uxuiAddons.map((a) => ({
      value: a.id,
      label: a.title,
    })),
  },
];

// Helper to get display name by ID
export function getServiceDisplayName(id: string): string | undefined {
  for (const group of serviceOptionGroups) {
    const option = group.options.find((o) => o.value === id);
    if (option) return option.label;
  }
  return undefined;
}

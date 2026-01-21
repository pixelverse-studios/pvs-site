export type AddonCategory = 'development' | 'seo' | 'uxui';

export interface Addon {
  id: string;
  title: string;
  price: string;
  description: string;
  category: AddonCategory;
}

export interface AddonCategoryGroup {
  id: AddonCategory;
  label: string;
  addons: Addon[];
}

export const addons: Addon[] = [
  // Development Add-ons
  {
    id: 'additional-page-basic',
    title: 'Additional Page – Basic',
    price: '$150',
    description: 'Standard informational page',
    category: 'development',
  },
  {
    id: 'additional-page-service',
    title: 'Additional Page – Service',
    price: '$200',
    description: 'Dedicated service description page with CTAs',
    category: 'development',
  },
  {
    id: 'feature-integration',
    title: 'Feature Integration',
    price: '$500',
    description:
      'Custom functionality such as booking systems, dashboards, or CRM connections',
    category: 'development',
  },

  // SEO Add-ons
  {
    id: 'blog-post',
    title: 'Blog Post',
    price: '$75',
    description: 'SEO-focused article targeting relevant keywords and topics',
    category: 'seo',
  },
  {
    id: 'citation-submission',
    title: 'Citation Submission',
    price: '$150',
    description: 'Local directory listings to boost local search presence',
    category: 'seo',
  },
  {
    id: 'city-page',
    title: 'City Page',
    price: '$200',
    description: 'Location-specific landing page optimized for local search',
    category: 'seo',
  },
  {
    id: 'competitor-analysis',
    title: 'Competitor Analysis',
    price: '$750',
    description:
      'Review of competitor rankings, keywords, and backlink profiles',
    category: 'seo',
  },
  {
    id: 'content-mapping',
    title: 'Content Mapping',
    price: '$350',
    description:
      'URL and content planning based on search intent and site structure',
    category: 'seo',
  },
  {
    id: 'county-page',
    title: 'County Page',
    price: '$350',
    description: 'Regional landing page targeting county-level search visibility',
    category: 'seo',
  },
  {
    id: 'gbp-management',
    title: 'Google Business Profile Management',
    price: '$300',
    description: 'Ongoing optimization and updates to GBP listing',
    category: 'seo',
  },
  {
    id: 'hub-page',
    title: 'Hub Page',
    price: '$350',
    description:
      'Category landing page linking to related service or location pages',
    category: 'seo',
  },
  {
    id: 'keyword-research',
    title: 'Keyword Research & Strategy',
    price: '$250',
    description:
      'Identification of core, local, long-tail, and seasonal keyword targets',
    category: 'seo',
  },
  {
    id: 'monthly-seo-report',
    title: 'Monthly SEO Report',
    price: '$249',
    description:
      'Keyword rankings, local pack visibility, and lead conversion tracking',
    category: 'seo',
  },
  {
    id: 'seo-page-audit',
    title: 'SEO Page Audit',
    price: '$75',
    description:
      'SEO focused single page audit, identifying key weaknesses for search indexing',
    category: 'seo',
  },
  {
    id: 'service-page',
    title: 'Service Page',
    price: '$250',
    description:
      'Dedicated page targeting a specific service with keyword optimization',
    category: 'seo',
  },

  // UX/UI Add-ons
  {
    id: 'page-audit',
    title: 'Page Audit',
    price: '$75',
    description: 'Detailed audit of a single page, focused on UX/UI',
    category: 'uxui',
  },
];

// Category labels for display
const categoryLabels: Record<AddonCategory, string> = {
  development: 'Development',
  seo: 'SEO',
  uxui: 'UX/UI',
};

// Grouped exports for easy access
export const developmentAddons = addons.filter((a) => a.category === 'development');
export const seoAddons = addons.filter((a) => a.category === 'seo');
export const uxuiAddons = addons.filter((a) => a.category === 'uxui');

// Grouped by category with labels (for rendering category sections)
export const addonCategories: AddonCategoryGroup[] = [
  { id: 'development', label: categoryLabels.development, addons: developmentAddons },
  { id: 'seo', label: categoryLabels.seo, addons: seoAddons },
  { id: 'uxui', label: categoryLabels.uxui, addons: uxuiAddons },
];

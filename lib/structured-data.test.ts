import { describe, expect, it } from 'vitest';
import {
  createCityLocalBusinessSchema,
  createCityServiceSchema,
  createBreadcrumbSchema,
  createServiceSchema,
  createHomepageServiceSchemas,
  localBusinessSchema,
} from './structured-data';

describe('service-area entity identity', () => {
  it('keeps a public organization identity without a residential location', () => {
    expect(localBusinessSchema['@type']).toBe('Organization');
    expect(localBusinessSchema['@id']).toBe('https://pixelversestudios.io/#organization');
    for (const field of ['address', 'geo', 'priceRange', 'openingHoursSpecification']) {
      expect(localBusinessSchema).not.toHaveProperty(field);
    }
    const service = createServiceSchema({
      name: 'Local SEO',
      serviceType: 'SEO',
      description: 'SEO support',
      path: '/services/seo',
    });
    for (const item of [service, ...createHomepageServiceSchemas()]) {
      expect(item.provider['@type']).toBe('Organization');
      expect(item.provider['@id']).toBe(localBusinessSchema['@id']);
      expect(item.provider).not.toHaveProperty('address');
      expect(item.provider).not.toHaveProperty('geo');
    }
  });

  it.each(['Fort Lee', 'Englewood', 'Hackensack', 'Paramus', 'Ridgewood'])(
    'describes %s as coverage, not an office',
    (city) => {
      const slug = city.toLowerCase().replaceAll(' ', '-');
      const coverage = createCityLocalBusinessSchema({
        city,
        slug,
        state: 'NJ',
        basePath: `/areas/bergen-county/${slug}`,
      });
      const service = createCityServiceSchema({
        city,
        slug,
        state: 'NJ',
        serviceName: 'Local SEO',
        serviceType: 'SEO',
        description: 'SEO support',
      });
      expect(coverage['@type']).toBe('Service');
      expect(coverage.areaServed).toEqual({ '@type': 'City', name: `${city}, NJ` });
      expect(coverage.provider['@id']).toBe(localBusinessSchema['@id']);
      expect(service.provider['@id']).toBe(localBusinessSchema['@id']);
      expect(service.provider['@type']).toBe('Organization');
      for (const field of ['address', 'geo', 'openingHoursSpecification', 'aggregateRating']) {
        expect(coverage).not.toHaveProperty(field);
        expect(service.provider).not.toHaveProperty(field);
      }
    },
  );

  it('describes a county as an administrative service area', () => {
    const coverage = createCityLocalBusinessSchema({
      city: 'Bergen County',
      slug: 'bergen-county',
      state: 'NJ',
      isCounty: true,
    });
    expect(coverage.areaServed['@type']).toBe('AdministrativeArea');
    expect(coverage.provider['@id']).toBe(localBusinessSchema['@id']);
  });

  it('retains canonical breadcrumb destinations', () => {
    const schema = createBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Local SEO', path: '/services/seo' },
    ]);
    expect(schema.itemListElement.map((item) => item.item)).toEqual([
      'https://pixelversestudios.io/',
      'https://pixelversestudios.io/services/seo',
    ]);
  });
});

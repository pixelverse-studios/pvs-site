import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { publicContact } from '@/data/public-contact';
import { createLocalServiceSchema, localBusinessSchema } from '@/lib/structured-data';
import { Footer } from './footer';

vi.mock('next/navigation', () => ({ usePathname: () => '/' }));
vi.mock('@/components/analytics/tracked-link', async () => {
  const { createElement } = await import('react');
  return {
    TrackedLink: ({ href, children, className }: React.AnchorHTMLAttributes<HTMLAnchorElement>) =>
      createElement('a', { href, className }, children),
  };
});

describe('public inquiry contact', () => {
  it('renders the approved phone and mobile call destination with meeting expectations', () => {
    const html = renderToStaticMarkup(<Footer />);
    expect(html).toContain('href="tel:+19142978215"');
    expect(html).toContain('(914) 297-8215');
    expect(html).toContain(publicContact.meetingDescription);
    expect(html).toContain('Contact Us');
    expect(html).not.toContain('Find Us');
    expect(html).toContain(`Based in ${publicContact.base}`);
    expect(html).not.toContain('<iframe');
    // A public base town must not become a street address or a precise map.
    const address = html.match(/<address\b[^>]*>(.*?)<\/address>/)?.[1];
    expect(address).toBeDefined();
    expect(address?.replace(/<[^>]*>/g, '')).not.toMatch(/\d/);
    expect(html).not.toContain('google.com/maps');
  });

  it('uses the same public inquiry line in provider and sales contact markup', () => {
    expect(localBusinessSchema.telephone).toBe(publicContact.phone.international);
    expect(localBusinessSchema.contactPoint.telephone).toBe(publicContact.phone.international);
    expect(publicContact.phone.href).toBe(
      `tel:${localBusinessSchema.telephone.replaceAll('-', '')}`,
    );
  });

  it('keeps older local-service callers on the same provider without creating town offices', () => {
    const service = createLocalServiceSchema({
      serviceSlug: 'seo',
      serviceName: 'Local SEO',
      serviceType: 'SEO',
      citySlug: 'fort-lee',
      city: 'Fort Lee',
      state: 'NJ',
      description: 'Local SEO support',
      coordinates: { latitude: 40.85, longitude: -73.97 },
    });
    expect(service.provider).toEqual({ '@id': localBusinessSchema['@id'] });
    expect(service.areaServed.name).toBe('Fort Lee');
    expect(service.url).toBe('https://pixelversestudios.io/services/seo/fort-lee');
    expect(service.provider).not.toHaveProperty('address');
    expect(service.provider).not.toHaveProperty('geo');
    expect(service.provider).not.toHaveProperty('telephone');
  });
});

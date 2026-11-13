import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { getRelatedCaseStudies } from '@/data/case-studies';
import { RelatedCaseStudies } from './related-case-studies';

describe('related case studies', () => {
  it('excludes remote-only work and lists a same-city project first', () => {
    const slugs = getRelatedCaseStudies({ city: 'Ridgewood' }).map((study) => study.slug);
    expect(slugs[0]).toBe('360-degree-care');
    expect(slugs).toEqual(
      expect.arrayContaining(['jones-pressure-washing', 'iffers-pictures', '360-degree-care']),
    );
    expect(slugs).not.toContain('domani');
  });

  it('filters by service and tolerates a missing city', () => {
    const studies = getRelatedCaseStudies({ service: 'seo', city: undefined });
    expect(studies.length).toBeGreaterThan(0);
    expect(studies.every((study) => study.services.includes('seo'))).toBe(true);
  });

  it('renders crawlable links to each case study in server HTML', () => {
    const studies = getRelatedCaseStudies();
    const html = renderToStaticMarkup(
      <RelatedCaseStudies caseStudies={studies} title="Client work across Bergen County" />,
    );
    for (const study of studies) {
      expect(html).toContain(`href="/portfolio/${study.slug}"`);
    }
    expect(html).toContain('Client work across Bergen County');
  });

  it('renders nothing when there are no studies', () => {
    expect(renderToStaticMarkup(<RelatedCaseStudies caseStudies={[]} title="x" />)).toBe('');
  });
});

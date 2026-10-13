import { describe, expect, it } from 'vitest';
import { domaniLayoutClassName } from './domani-layout-frame';

describe('Domani layout spacing', () => {
  it('keeps the viewport-fitted Users route free of outer bottom padding', () => {
    expect(domaniLayoutClassName('/dashboard/domani/users')).not.toContain('pb-16');
  });

  it.each([
    '/dashboard/domani',
    '/dashboard/domani/feedback',
    '/dashboard/domani/waitlist',
    '/dashboard/domani/campaigns',
    '/dashboard/domani/releases',
  ])('retains the standard content gutter for %s', (pathname) => {
    expect(domaniLayoutClassName(pathname)).toContain('pb-16');
  });
});

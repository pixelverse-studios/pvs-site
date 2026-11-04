import * as React from 'react';
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MotionItem, MotionSection } from './motion-section';

describe('progressively enhanced principal content', () => {
  it('delivers visible server markup without executing viewport animations', () => {
    const html = renderToStaticMarkup(
      <MotionSection>
        <MotionItem>
          <h1>Local SEO for New Jersey Businesses</h1>
          <a href="/contact/details">Discuss your situation</a>
        </MotionItem>
      </MotionSection>,
    );
    expect(html).toContain('<h1>Local SEO for New Jersey Businesses</h1>');
    expect(html).toContain('href="/contact/details"');
    expect(html).not.toMatch(/opacity:\s*0(?:;|\")|visibility:\s*hidden|display:\s*none/);
  });

  it('does not allow initial animation overrides to hide essential markup', () => {
    const html = renderToStaticMarkup(
      <MotionItem motionProps={{ initial: { opacity: 0, y: 32 } }}>
        <p>Service details</p>
      </MotionItem>,
    );
    expect(html).not.toMatch(/opacity:\s*0(?:;|\")/);
  });
});

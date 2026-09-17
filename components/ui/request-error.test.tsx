import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MantineProvider } from '@mantine/core';
import { describe, expect, it } from 'vitest';
import { RequestError } from './request-error';

describe('request error recovery', () => {
  it('renders a navigation link for unavailable overview data', () => {
    const html = renderToStaticMarkup(
      <MantineProvider>
        <RequestError
          message="Unavailable"
          action={{ label: 'Open feedback', href: '/dashboard/domani/feedback' }}
        />
      </MantineProvider>,
    );
    expect(html).toContain('role="alert"');
    expect(html).toContain('href="/dashboard/domani/feedback"');
    expect(html).toContain('Open feedback');
  });
  it('renders a disabled recovery button while a retry is running', () => {
    const html = renderToStaticMarkup(
      <MantineProvider>
        <RequestError
          message="Unavailable"
          action={{ label: 'Retry', onClick: () => {}, disabled: true }}
        />
      </MantineProvider>,
    );
    expect(html).toContain('<button');
    expect(html).toContain('disabled');
    expect(html).toContain('Retry');
  });
});

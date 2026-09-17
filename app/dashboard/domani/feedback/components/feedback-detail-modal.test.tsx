import React from 'react';
import { MantineProvider } from '@mantine/core';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import type { UnifiedFeedbackItem } from '../../../../../lib/types/feedback';
vi.mock('@/lib/utils', () => ({ cn: (...values: unknown[]) => values.filter(Boolean).join(' ') }));
vi.mock('@/lib/types/feedback', () => import('../../../../../lib/types/feedback'));
vi.mock(
  '@/components/ui/request-error',
  () => import('../../../../../components/ui/request-error'),
);
import { FeedbackDetailModal } from './feedback-detail-modal';

describe('feedback detail rendering', () => {
  it('renders unknown legacy categories and nullable fields without mislabelling devices', () => {
    const item = {
      id: 'same-id',
      source: 'beta_feedback',
      user_id: null,
      email: null,
      category: 'legacy',
      original_category: 'legacy',
      original_status: null,
      status: 'unknown',
      message: '<script>unsafe</script>',
      platform: null,
      app_version: null,
      app_build: null,
      device_brand: null,
      device_model: null,
      os_version: null,
      created_at: null,
    } as unknown as UnifiedFeedbackItem;
    const html = renderToStaticMarkup(
      <FeedbackDetailModal item={item} isOpen onClose={() => {}} onStatusChange={async () => {}} />,
    );
    expect(html).toContain('role="dialog"');
    expect(html).toContain('aria-modal="true"');
    expect(html).toContain('Feedback details');
    expect(html).toContain('Unknown email');
    expect(html).not.toContain('Android');
    expect(html).not.toContain('Invalid Date');
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });
  it('places failure messages and refresh recovery inside the open dialog', () => {
    const item = {
      id: 'test',
      source: 'beta_feedback',
      category: 'general',
      status: 'new',
      message: 'Test feedback',
      email: null,
      platform: null,
      created_at: null,
    } as UnifiedFeedbackItem;
    const html = renderToStaticMarkup(
      <MantineProvider>
        <FeedbackDetailModal
          item={item}
          isOpen
          onClose={() => {}}
          onStatusChange={async () => {}}
          disabled
          statusError="The status could not be saved."
          refreshError="Could not reload feedback."
          onRetry={() => {}}
        />
      </MantineProvider>,
    );
    const dialogStart = html.indexOf('role="dialog"');
    expect(dialogStart).toBeGreaterThan(-1);
    expect(html.indexOf('The status could not be saved.')).toBeGreaterThan(dialogStart);
    expect(html.indexOf('Could not reload feedback.')).toBeGreaterThan(dialogStart);
    expect(html).toContain('Retry refresh');
    expect(html).toContain('role="alert"');
    expect(html).toContain('Refresh before changing the status.');
  });
});

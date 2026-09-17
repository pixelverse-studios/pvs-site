import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import type { UnifiedFeedbackItem } from '../../../../../lib/types/feedback';
vi.mock('@/lib/utils', () => ({ cn: (...values: unknown[]) => values.filter(Boolean).join(' ') }));
vi.mock('@/lib/types/feedback', () => import('../../../../../lib/types/feedback'));
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
});

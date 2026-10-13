import React from 'react';
import { describe, it, expect, vi } from 'vitest';
const list = vi.hoisted(() => vi.fn());
vi.mock('@/lib/api/feedback-server', () => ({ getServerFeedbackItems: list }));
vi.mock('./components/feedback-page-client', () => ({ FeedbackPageClient: () => null }));
import FeedbackPage from './page';
describe('user-scoped feedback entry', () => {
  it('passes the validated user ID to server loading and subsequent client requests', async () => {
    const id = '10000000-0000-4000-8000-000000000001';
    list.mockResolvedValueOnce({ items: [], total: 0 });
    const page = await FeedbackPage({ searchParams: Promise.resolve({ user_id: id }) });
    expect(list).toHaveBeenLastCalledWith({ user_id: id, limit: 50, offset: 0 });
    expect(page.props.userId).toBe(id);
    list.mockRejectedValueOnce(new Error('Unavailable'));
    const retry = await FeedbackPage({ searchParams: Promise.resolve({ user_id: id }) });
    expect(retry.props.userId).toBe(id);
    expect(retry.props.initialError).toBe('Unavailable');
  });
  it('does not turn an invalid identity link into an unfiltered request', async () => {
    list.mockClear();
    const page = await FeedbackPage({
      searchParams: Promise.resolve({ user_id: 'someone@example.test' }),
    });
    expect(page.props.role).toBe('alert');
    expect(list).not.toHaveBeenCalled();
  });
});

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cachedReleaseList, invalidateReleaseLists } from './release-list-cache';
import type { ReleaseListResponse } from '@/lib/types/admin-release';

const result: ReleaseListResponse = {
  data: { releases: [], capabilities: { canCreateRelease: false, canViewArchivedReleases: false } },
  meta: { nextCursor: null, requestId: 'test' },
};
afterEach(() => { invalidateReleaseLists(); vi.useRealTimers(); });

describe('session-scoped release lists', () => {
  it('deduplicates in-flight requests and expires results after 30 seconds', async () => {
    vi.useFakeTimers();
    const load = vi.fn(async () => result);
    const first = cachedReleaseList('session-a', 'active', load);
    expect(cachedReleaseList('session-a', 'active', load)).toBe(first);
    await first;
    await cachedReleaseList('session-a', 'active', load);
    expect(load).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(30_001);
    await cachedReleaseList('session-a', 'active', load);
    expect(load).toHaveBeenCalledTimes(2);
  });

  it('never reuses data across sessions or filters', async () => {
    const load = vi.fn(async () => result);
    await cachedReleaseList('session-a', 'active', load);
    await cachedReleaseList('session-a', 'archived', load);
    await cachedReleaseList('session-b', 'active', load);
    await cachedReleaseList('session-a', 'active', load);
    expect(load).toHaveBeenCalledTimes(4);
  });

  it('retries failures instead of caching errors', async () => {
    const load = vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValue(result);
    await expect(cachedReleaseList('a', 'active', load)).rejects.toThrow('offline');
    await expect(cachedReleaseList('a', 'active', load)).resolves.toBe(result);
  });

  it('does not restore an invalidated result when an older read completes', async () => {
    let finish!: (value: ReleaseListResponse) => void;
    const pending = cachedReleaseList('a', 'active', () => new Promise(resolve => { finish = resolve; }));
    invalidateReleaseLists();
    finish(result);
    await pending;
    const load = vi.fn(async () => result);
    await cachedReleaseList('a', 'active', load);
    expect(load).toHaveBeenCalledOnce();
  });
});

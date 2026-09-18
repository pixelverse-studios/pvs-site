import type {
  ReleaseListResponse,
  AdminReleaseCapabilities,
  ReleaseLifecycle,
  ReleaseVisibility,
  ReleaseType,
  ReleasePlatform,
} from '@/lib/types/admin-release';

export type ReleaseFilters = {
  lifecycle?: ReleaseLifecycle;
  visibility?: ReleaseVisibility;
  releaseType?: ReleaseType;
  platform?: ReleasePlatform;
  version?: string;
  archived?: boolean;
};

export async function collectReleases(
  readPage: (path: string) => Promise<ReleaseListResponse>,
  filters?: ReleaseFilters,
) {
  const releases: ReleaseListResponse['data']['releases'] = [];
  let capabilities: AdminReleaseCapabilities = {
    canCreateRelease: false,
    canViewArchivedReleases: false,
  };
  const seenCursors = new Set<string>();
  let cursor: string | null = null;
  let lastResponse: ReleaseListResponse | null = null;

  do {
    const params = new URLSearchParams({ limit: '100' });
    Object.entries(filters || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') params.set(key, String(value));
    });
    if (cursor) params.set('cursor', cursor);

    lastResponse = await readPage(`?${params}`);
    releases.push(...lastResponse.data.releases);
    capabilities = lastResponse.data.capabilities || capabilities;

    const nextCursor = lastResponse.meta.nextCursor;
    if (nextCursor && seenCursors.has(nextCursor)) {
      throw new Error('Release pagination returned a repeated cursor');
    }
    if (nextCursor) seenCursors.add(nextCursor);
    cursor = nextCursor;
  } while (cursor);

  return {
    data: { releases, capabilities },
    meta: {
      requestId: lastResponse?.meta.requestId || '',
      nextCursor: null,
    },
  } satisfies ReleaseListResponse;
}

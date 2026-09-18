import type { ReleaseListResponse } from '@/lib/types/admin-release';

// Browser-memory only. Token rotation/account changes discard all previous results.
// Never use this cache for server rendering or persist it to browser storage.
let owner: string | undefined;
let generation = 0;
const entries = new Map<string, { expires: number; value: Promise<ReleaseListResponse> }>();

export function invalidateReleaseLists() {
  generation += 1;
  owner = undefined;
  entries.clear();
}

export function cachedReleaseList(
  token: string,
  key: string,
  load: () => Promise<ReleaseListResponse>,
) {
  if (owner !== token) {
    invalidateReleaseLists();
    owner = token;
  }
  const cached = entries.get(key);
  if (cached && cached.expires > Date.now()) return cached.value;
  const revision = generation;
  const value = load().catch((error) => {
    if (generation === revision && entries.get(key)?.value === value) entries.delete(key);
    throw error;
  });
  // Bound memory even when callers vary filters continuously.
  if (entries.size >= 10) entries.delete(entries.keys().next().value!);
  entries.set(key, { expires: Date.now() + 30_000, value });
  return value;
}

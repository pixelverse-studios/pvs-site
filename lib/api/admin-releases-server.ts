import 'server-only';
import { createClient } from '@/lib/supabase/server';
import { getApiBaseUrl } from '@/lib/api-config';
import { collectReleases } from './release-list';
import type { ReleaseListResponse } from '@/lib/types/admin-release';

export async function getServerReleases() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session?.access_token) {
    throw new Error('Your session has expired. Please sign in again.');
  }
  // Forward the token only. The API performs authoritative user/permission checks.
  return collectReleases(async (path) => {
    const response = await fetch(new URL(`/api/admin/releases${path}`, getApiBaseUrl()), {
      headers: { Authorization: `Bearer ${data.session!.access_token}` },
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error(
        response.status === 401
          ? 'Your session has expired. Please sign in again.'
          : response.status === 403
            ? 'You do not have access to releases.'
            : 'Release service unavailable. Please try again.',
      );
    }
    return response.json() as Promise<ReleaseListResponse>;
  });
}

import { NextRequest, NextResponse } from 'next/server';
import { getApiBaseUrl } from '@/lib/api-config';
import { createClient } from '@/lib/supabase/server';

type RouteContext = { params: Promise<{ path?: string[] }> };

async function proxy(request: NextRequest, context: RouteContext) {
  const supabase = await createClient();
  const [{ data: userData }, { data: sessionData }] = await Promise.all([
    supabase.auth.getUser(),
    supabase.auth.getSession(),
  ]);

  if (!userData.user || !sessionData.session?.access_token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { path = [] } = await context.params;
  const upstreamUrl = new URL(
    `/api/admin/releases${path.length ? `/${path.join('/')}` : ''}`,
    getApiBaseUrl(),
  );
  upstreamUrl.search = request.nextUrl.search;

  const headers: Record<string, string> = {
    Authorization: `Bearer ${sessionData.session.access_token}`,
    'X-Request-Id': crypto.randomUUID(),
  };
  const ifMatch = request.headers.get('if-match');
  if (ifMatch) headers['If-Match'] = ifMatch;
  if (request.method !== 'GET') headers['Content-Type'] = 'application/json';

  try {
    const upstream = await fetch(upstreamUrl, {
      method: request.method,
      headers,
      cache: 'no-store',
      body: request.method === 'GET' ? undefined : await request.text(),
    });
    const body = await upstream.text();
    const response = new NextResponse(body, {
      status: upstream.status,
      headers: { 'Content-Type': upstream.headers.get('content-type') || 'application/json' },
    });
    for (const name of ['etag', 'x-release-etag', 'x-request-id']) {
      const value = upstream.headers.get(name);
      if (value) response.headers.set(name, value);
    }
    return response;
  } catch {
    return NextResponse.json({ message: 'Release service unavailable' }, { status: 502 });
  }
}

export const GET = proxy;
export const POST = proxy;
export const PATCH = proxy;

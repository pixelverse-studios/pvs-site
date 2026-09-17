import { NextRequest, NextResponse } from 'next/server';
import { getApiBaseUrl } from '@/lib/api-config';
import { feedbackAccessToken } from '@/lib/api/feedback-server';

type RouteContext = { params: Promise<{ path?: string[] }> };
const MAX_BODY_BYTES = 8 * 1024;
const headers = { 'Cache-Control': 'no-store' };
const error = (message: string, status: number) =>
  NextResponse.json({ message }, { status, headers });

async function proxy(request: NextRequest, context: RouteContext) {
  const { path = [] } = await context.params;
  const isItem =
    ['beta_feedback', 'support_request'].includes(path[0]) &&
    /^[a-zA-Z0-9_-]+$/.test(path[1] || '');
  const allowed =
    request.method === 'GET'
      ? path.length === 0 ||
        (path.length === 1 && path[0] === 'stats') ||
        (path.length === 2 && isItem)
      : path.length === 3 && isItem && path[2] === 'status';
  if (!allowed) return error('Not found', 404);
  if (request.method !== 'GET') {
    if (Number(request.headers.get('content-length')) > MAX_BODY_BYTES)
      return error('Request body too large', 413);
    if (request.headers.get('origin') !== request.nextUrl.origin)
      return error('Invalid request origin', 403);
    if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json')
      return error('JSON required', 415);
  }
  try {
    const token = await feedbackAccessToken();
    if (!token) return error('Unauthorized', 401);
    let body: string | undefined;
    if (request.method !== 'GET') {
      const reader = request.body?.getReader();
      const chunks: Uint8Array[] = [];
      let bytes = 0;
      if (reader) {
        try {
          while (true) {
            const chunk = await reader.read();
            if (chunk.done) break;
            bytes += chunk.value.byteLength;
            if (bytes > MAX_BODY_BYTES) {
              await reader.cancel();
              return error('Request body too large', 413);
            }
            chunks.push(chunk.value);
          }
        } finally {
          reader.releaseLock();
        }
      }
      const buffer = new Uint8Array(bytes);
      let offset = 0;
      for (const chunk of chunks) {
        buffer.set(chunk, offset);
        offset += chunk.byteLength;
      }
      try {
        body = new TextDecoder('utf-8', { fatal: true }).decode(buffer);
        const payload = JSON.parse(body);
        if (
          !payload ||
          Array.isArray(payload) ||
          typeof payload !== 'object' ||
          Object.keys(payload).length !== 1 ||
          !['new', 'reviewed', 'resolved'].includes(payload.status)
        ) {
          return error('Invalid feedback status', 400);
        }
      } catch {
        return error('Invalid JSON body', 400);
      }
    }
    const url = new URL(
      `/api/domani/feedback${path.length ? '/' + path.join('/') : ''}`,
      getApiBaseUrl(),
    );
    url.search = request.nextUrl.search;
    const upstream = await fetch(url, {
      method: request.method,
      cache: 'no-store',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body,
    });
    if (!upstream.ok)
      return error(
        upstream.status === 403 ? 'Staff access required' : 'Feedback request failed',
        upstream.status,
      );
    return new NextResponse(await upstream.text(), {
      status: upstream.status,
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  } catch {
    return error('Feedback service unavailable', 502);
  }
}
export const GET = proxy;
export const PATCH = proxy;

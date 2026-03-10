import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getApiBaseUrl } from '@/lib/api-config';

const BLAST_SECRET = process.env.BLAST_SECRET ?? '';

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '20', 10) || 20, 1), 100);
  const offset = Math.max(parseInt(searchParams.get('offset') || '0', 10) || 0, 0);

  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });

  try {
    const res = await fetch(
      `${getApiBaseUrl()}/api/domani/email-campaigns?${params}`,
      {
        cache: 'no-store',
        headers: { 'X-Blast-Secret': BLAST_SECRET },
      },
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to fetch campaigns' },
        { status: res.status },
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { message: 'Campaign service unavailable' },
      { status: 502 },
    );
  }
}

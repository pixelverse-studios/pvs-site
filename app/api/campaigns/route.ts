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
  const limit = searchParams.get('limit') || '20';
  const offset = searchParams.get('offset') || '0';

  const params = new URLSearchParams({ limit, offset });

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
}

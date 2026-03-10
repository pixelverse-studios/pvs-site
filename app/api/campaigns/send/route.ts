import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getApiBaseUrl } from '@/lib/api-config';

const BLAST_SECRET = process.env.BLAST_SECRET ?? '';

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  const res = await fetch(`${getApiBaseUrl()}/api/domani/email-campaigns/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Blast-Secret': BLAST_SECRET,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    return NextResponse.json(
      { message: data.message || 'Failed to send campaign' },
      { status: res.status },
    );
  }

  return NextResponse.json(data);
}

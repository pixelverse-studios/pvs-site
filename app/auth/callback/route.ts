import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Successfully authenticated - redirect to dashboard or intended page
      return NextResponse.redirect(`${origin}${next}`)
    }

    // If there was an error exchanging the code
    console.error('Error exchanging code for session:', error.message)
  }

  // If no code or error occurred, redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}

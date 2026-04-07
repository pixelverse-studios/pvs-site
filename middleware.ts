import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// DEV-468: Redirect legacy /contact?path= URLs to clean routes.
// Next.js redirects() preserves query params even with `has` conditions,
// so we handle these here where we control the exact destination URL.
// If a new contact route is added, update this map AND the catch-all
// redirect in next.config.js (/contact → /contact/details).
const CONTACT_PATH_MAP: Record<string, string> = {
  review: '/contact/review',
  details: '/contact/details',
  call: '/contact/call',
};

// DEV-674: Middleware now only runs on /dashboard/* (auth) and /contact
// (legacy ?path= redirect). Public routes are statically generated and need
// no per-request work — CSP for them is set statically in next.config.js.
// This eliminates per-request middleware overhead on the marketing site.
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Strip stale ?path= from legacy contact URLs.
  if (pathname === '/contact') {
    const pathParam = request.nextUrl.searchParams.get('path');
    if (pathParam) {
      const destination = CONTACT_PATH_MAP[pathParam] ?? '/contact/details';
      return NextResponse.redirect(new URL(destination, request.url), 301);
    }
    return NextResponse.next();
  }

  // From here on we're handling /dashboard/* — auth check via Supabase.
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}

export const config = {
  // Only run on dashboard auth-protected pages and the legacy /contact redirect.
  // Public marketing pages skip middleware entirely so they can be statically
  // generated and CDN-served (DEV-674).
  //
  // Note: `/dashboard/:path*` does NOT match the bare `/dashboard` URL — Next.js
  // path-to-regexp `:path*` requires at least one segment after `/dashboard/`.
  // So we add `/dashboard` explicitly. Without this, an unauthenticated user
  // visiting `/dashboard` would briefly see the dashboard layout shell before
  // the page-level redirect in app/dashboard/page.tsx kicked in.
  matcher: ['/dashboard', '/dashboard/:path*', '/contact'],
};

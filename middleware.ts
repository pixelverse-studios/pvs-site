import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

function buildCsp(nonce: string, isDev: boolean, apiUrl: string | undefined): string {
  const csp: Record<string, string[]> = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-eval'",
      `'nonce-${nonce}'`,
      'https://cdn.jsdelivr.net',
      'https://www.googletagmanager.com',
      'https://js.sentry-cdn.com',
      'https://assets.calendly.com',
      'https://sitebehaviour-cdn.fra1.cdn.digitaloceanspaces.com',
    ],
    // 'unsafe-inline' is required for style-src: nonces only work for <style> elements,
    // not inline style="" attributes, which next-themes and other libraries use programmatically.
    'style-src': ["'self'", "'unsafe-inline'", 'https://assets.calendly.com'],
    'img-src': ["'self'", 'data:', 'https:', 'blob:'],
    'font-src': ["'self'", 'data:'],
    'connect-src': [
      "'self'",
      'https://www.google-analytics.com',
      'https://*.sentry.io',
      'https://*.supabase.co',
      'https://*.calendly.com',
      'https://maps.googleapis.com',
      'https://maps.gstatic.com',
      ...(apiUrl ? [apiUrl] : []),
      ...(isDev && apiUrl !== 'http://localhost:5001' ? ['http://localhost:5001'] : []),
    ],
    // Note: *.calendly.com does NOT cover the apex domain per CSP spec — both are required
    'frame-src': ["'self'", 'https://calendly.com', 'https://*.calendly.com', 'https://www.google.com/maps'],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'self'"],
    'upgrade-insecure-requests': [],
  };

  return Object.entries(csp)
    .map(([directive, sources]) =>
      sources.length ? `${directive} ${sources.join(' ')}` : directive,
    )
    .join('; ');
}

export async function middleware(request: NextRequest) {
  const isDev = process.env.NODE_ENV === 'development';
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!isDev && !apiUrl) {
    console.warn(
      '[CSP] WARNING: NEXT_PUBLIC_API_BASE_URL is not set — backend API calls will be blocked by CSP in production',
    );
  }

  // Generate a per-request nonce
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const cspHeader = buildCsp(nonce, isDev, apiUrl);

  // Clone request headers and inject nonce so server components can read it
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', cspHeader);

  let supabaseResponse = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // Set CSP on the response (for the browser)
  supabaseResponse.headers.set('Content-Security-Policy', cspHeader);

  // Supabase auth check only on protected routes — avoid unnecessary latency on public pages
  const protectedPaths = ['/dashboard'];
  const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path));

  if (isProtectedPath) {
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
            supabaseResponse = NextResponse.next({
              request: { headers: requestHeaders },
            });
            supabaseResponse.headers.set('Content-Security-Policy', cspHeader);
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
      redirectUrl.searchParams.set('next', request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    // Run on all routes except Next.js internals and static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

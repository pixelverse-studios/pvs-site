import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Container } from '@/components/ui/container'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GoogleLoginButton } from '@/components/auth/google-login-button'

export const metadata = {
  title: 'Login | PixelVerse Studios',
  description: 'Sign in to access your PixelVerse Studios dashboard',
}

export default async function LoginPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If already logged in, redirect to dashboard
  if (user) {
    redirect('/dashboard')
  }

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-16">
      <Container className="max-w-md">
        <div className="space-y-6">
          {/* Logo/Branding */}
          <div className="text-center">
            <h1 className="bg-[var(--pv-gradient)] bg-clip-text text-4xl font-bold text-transparent">
              PixelVerse
            </h1>
            <p className="mt-2 text-sm text-[var(--pv-text-muted)]">
              Access your dashboard
            </p>
          </div>

          {/* Login Card */}
          <Card>
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
              <CardDescription>
                Sign in with your Google account to continue
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <GoogleLoginButton />
            </CardContent>
          </Card>

          {/* Footer Text */}
          <p className="text-center text-xs text-[var(--pv-text-muted)]">
            This page is only accessible to PixelVerse Studios team members.
          </p>
        </div>
      </Container>
    </main>
  )
}

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Container } from '@/components/ui/container'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LogoutButton } from '@/components/auth/logout-button'
import { Users, FolderKanban, Mail, FileText } from 'lucide-react'

export const metadata = {
  title: 'Dashboard | PixelVerse Studios',
  description: 'Your PixelVerse Studios dashboard',
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If not logged in, redirect to login
  if (!user) {
    redirect('/login')
  }

  return (
    <main className="pt-hero pb-16 md:pb-24">
      <Container className="max-w-5xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold md:text-5xl">Dashboard</h1>
              <p className="mt-2 text-lg text-[var(--pv-text-muted)]">
                Welcome back, {user.user_metadata?.full_name || user.email}
              </p>
            </div>
            <LogoutButton />
          </div>

          {/* User Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your PixelVerse Studios account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-[var(--pv-text-muted)]">Email</p>
                  <p className="mt-1 text-base">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--pv-text-muted)]">Name</p>
                  <p className="mt-1 text-base">
                    {user.user_metadata?.full_name || 'Not provided'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--pv-text-muted)]">Provider</p>
                  <p className="mt-1 text-base capitalize">
                    {user.app_metadata?.provider || 'Google'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--pv-text-muted)]">User ID</p>
                  <p className="mt-1 font-mono text-sm">{user.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Placeholder Sections */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  <Button variant="outline" className="justify-start" asChild>
                    <Link href="/dashboard/clients">
                      <Users className="mr-2 h-4 w-4" />
                      Manage Clients
                    </Link>
                  </Button>
                  <Button variant="outline" className="justify-start" disabled>
                    <FolderKanban className="mr-2 h-4 w-4" />
                    Manage Projects
                    <span className="ml-auto text-xs text-[var(--pv-text-muted)]">Coming soon</span>
                  </Button>
                  <Button variant="outline" className="justify-start" disabled>
                    <Mail className="mr-2 h-4 w-4" />
                    View Leads
                    <span className="ml-auto text-xs text-[var(--pv-text-muted)]">Coming soon</span>
                  </Button>
                  <Button variant="outline" className="justify-start" disabled>
                    <FileText className="mr-2 h-4 w-4" />
                    Audit Requests
                    <span className="ml-auto text-xs text-[var(--pv-text-muted)]">Coming soon</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest updates</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[var(--pv-text-muted)]">
                  Activity feed coming soon...
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </main>
  )
}

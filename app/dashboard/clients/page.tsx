import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Container } from '@/components/ui/container'
import { ClientsTable } from './components/clients-table'
import { getApiBaseUrl } from '@/lib/api-config'

export const metadata = {
  title: 'Clients | Dashboard | PixelVerse Studios',
  description: 'Manage your clients',
}

const API_BASE_URL = getApiBaseUrl()

export default async function ClientsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If not logged in, redirect to login
  if (!user) {
    redirect('/login')
  }

  // Fetch all clients from the API
  let clients = []
  try {
    const response = await fetch(`${API_BASE_URL}/api/clients`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Don't cache to always get fresh data
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch clients: ${response.status} ${response.statusText}`)
    }

    clients = await response.json()
  } catch (error) {
    console.error('Error fetching clients:', error)
    // Clients will remain empty array, which will show empty state
  }

  return (
    <main className="pt-8 pb-16 md:pb-24">
      <Container className="max-w-7xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold md:text-5xl">Clients</h1>
              <p className="mt-2 text-lg text-[var(--pv-text-muted)]">
                Manage and track all your client relationships
              </p>
            </div>
          </div>

          {/* Clients Table */}
          <ClientsTable clients={clients} />
        </div>
      </Container>
    </main>
  )
}

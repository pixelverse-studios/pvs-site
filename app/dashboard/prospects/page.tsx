import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Container } from '@/components/ui/container';
import { ProspectsPageClient } from '@/components/dashboard/prospects/prospects-page-client';

export const metadata = {
  title: 'Prospects | Dashboard | PixelVerse Studios',
  description: 'Track inbound leads from contact forms and Calendly bookings',
  robots: { index: false, follow: false },
};

export default async function ProspectsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <main className="pb-16 pt-6 lg:pt-8">
      <Container className="max-w-7xl">
        <ProspectsPageClient />
      </Container>
    </main>
  );
}

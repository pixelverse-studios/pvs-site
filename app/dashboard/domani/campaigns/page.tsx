import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export const metadata = {
  title: 'Campaigns | Domani | Dashboard | PixelVerse Studios',
  description: 'Email campaign history for Domani app users',
  robots: { index: false, follow: false },
};

export default async function CampaignsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div
        className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(63, 0, 233, 0.1), rgba(201, 71, 255, 0.05))',
          border: '1px solid rgba(63, 0, 233, 0.15)',
        }}
      >
        <svg
          className="h-6 w-6"
          style={{ color: 'var(--pv-primary)' }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
          />
        </svg>
      </div>
      <h2 className="mb-1 text-lg font-semibold" style={{ color: 'var(--pv-text)' }}>
        No campaigns yet
      </h2>
      <p className="mb-6 text-sm" style={{ color: 'var(--pv-text-muted)' }}>
        Send your first email campaign to Domani users.
      </p>
      <Link
        href="/dashboard/domani/campaigns/new"
        className="inline-flex h-11 items-center justify-center rounded-pv bg-[linear-gradient(90deg,var(--pv-primary),var(--pv-primary-2))] px-5 text-base font-medium text-white shadow-pv transition-all hover:-translate-y-0.5 hover:opacity-90 hover:shadow-lg"
      >
        New Campaign
      </Link>
    </div>
  );
}

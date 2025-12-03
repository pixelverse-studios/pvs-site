import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import { createClient } from '@/lib/supabase/server';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || '';

  return (
    <div className="relative min-h-screen" style={{ background: 'var(--pv-bg)' }}>
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main content area */}
      <div className="w-full transition-all duration-500 lg:pl-64">
        <DashboardShell userName={userName} userEmail={userEmail}>
          {children}
        </DashboardShell>
      </div>
    </div>
  );
}

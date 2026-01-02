import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import { createClient } from '@/lib/supabase/server';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { SidebarProvider } from '@/components/dashboard/sidebar-context';
import { DashboardContent } from '@/components/dashboard/dashboard-content';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || '';

  return (
    <SidebarProvider>
      <div className="relative min-h-screen" style={{ background: 'var(--pv-bg)' }}>
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Main content area */}
        <DashboardContent>
          <DashboardShell userName={userName} userEmail={userEmail}>
            {children}
          </DashboardShell>
        </DashboardContent>
      </div>
    </SidebarProvider>
  );
}

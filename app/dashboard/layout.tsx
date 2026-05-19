import type { Metadata } from 'next';

import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { SidebarProvider } from '@/components/dashboard/sidebar-context';
import { DashboardContent } from '@/components/dashboard/dashboard-content';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="relative min-h-screen" style={{ background: 'var(--pv-bg)' }}>
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Main content area */}
        <DashboardContent>
          <DashboardShell>{children}</DashboardShell>
        </DashboardContent>
      </div>
    </SidebarProvider>
  );
}

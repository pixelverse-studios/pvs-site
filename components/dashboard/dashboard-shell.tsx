'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { DashboardHeader } from './dashboard-header';

interface DashboardShellProps {
  children: React.ReactNode;
  userName?: string;
  userEmail?: string;
}

export function DashboardShell({ children, userName, userEmail }: DashboardShellProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader
        userName={userName}
        userEmail={userEmail}
        onLogout={handleLogout}
      />
      <main className="flex-1">{children}</main>
    </div>
  );
}

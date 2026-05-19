'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardHeader } from './dashboard-header';

interface DashboardShellProps {
  children: React.ReactNode;
  userName?: string;
  userEmail?: string;
}

export function DashboardShell({ children, userName, userEmail }: DashboardShellProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [displayName, setDisplayName] = useState(userName);
  const [displayEmail, setDisplayEmail] = useState(userEmail);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!isMounted || !user) return;

      setDisplayName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'User');
      setDisplayEmail(user.email || '');
    });

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader userName={displayName} userEmail={displayEmail} onLogout={handleLogout} />
      <main className="flex-1">{children}</main>
    </div>
  );
}

'use client';

import { MoonStar, SunDim } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { Button } from './button';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === 'dark';

  return (
    <Button
      variant="ghost"
      size="sm"
      type="button"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="h-10 w-10 rounded-full border border-[var(--pv-border)] bg-[var(--pv-surface)] p-0"
    >
      {mounted ? (
        isDark ? (
          <SunDim size={18} />
        ) : (
          <MoonStar size={18} />
        )
      ) : (
        <span className="h-4 w-4" />
      )}
    </Button>
  );
}

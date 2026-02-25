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
      size="icon"
      type="button"
      aria-label={mounted ? `Switch to ${isDark ? 'light' : 'dark'} theme` : 'Toggle theme'}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="dark:bg-[var(--pv-surface)]/90 border border-[var(--pv-border)] bg-[var(--pv-surface)] text-[var(--pv-text)] transition-transform duration-300 hover:-translate-y-0.5 hover:border-[var(--pv-primary)] hover:text-[var(--pv-primary)]"
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

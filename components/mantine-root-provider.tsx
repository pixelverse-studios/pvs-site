'use client';

import { createTheme, MantineProvider } from '@mantine/core';
import { useTheme } from 'next-themes';
import type { ReactNode } from 'react';

const theme = createTheme({
  primaryColor: 'violet',
  defaultRadius: 'md',
  fontFamily: 'var(--font-body)',
  headings: { fontFamily: 'var(--font-heading)' },
});

export function MantineRootProvider({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme();

  return (
    <MantineProvider theme={theme} forceColorScheme={resolvedTheme === 'dark' ? 'dark' : 'light'}>
      {children}
    </MantineProvider>
  );
}

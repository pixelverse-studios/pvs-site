'use client';

import { MantineProvider } from '@mantine/core';
import type { ReactNode } from 'react';

export function MantineRootProvider({ children }: { children: ReactNode }) {
  return <MantineProvider>{children}</MantineProvider>;
}

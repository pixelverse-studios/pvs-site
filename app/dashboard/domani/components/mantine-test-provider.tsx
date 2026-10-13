import React from 'react';
import { MantineProvider } from '@mantine/core';
// jsdom lacks the browser APIs used by calendar, combobox and focus management.
if (typeof window !== 'undefined') {
  window.matchMedia ||= (() => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent() {
      return true;
    },
    media: '',
    onchange: null,
  })) as typeof window.matchMedia;
  globalThis.ResizeObserver ||= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  HTMLElement.prototype.scrollIntoView ||= function () {};
}
export function TestProvider({ children }: { children: React.ReactNode }) {
  return <MantineProvider env="test">{children}</MantineProvider>;
}

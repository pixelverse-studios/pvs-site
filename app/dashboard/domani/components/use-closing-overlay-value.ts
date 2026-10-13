import { useState } from 'react';

/** Keep selected content until the exit transition completes, even if selection is cleared. */
export function useClosingOverlayValue<T>(value: T, opened: boolean) {
  const [retained, setRetained] = useState<T | null>(opened ? value : null);
  if (opened && retained !== value) setRetained(value);

  return [
    opened ? value : retained,
    () => {
      if (!opened) setRetained(null);
    },
  ] as const;
}

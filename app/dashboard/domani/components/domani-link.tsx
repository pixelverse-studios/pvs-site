'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useRef, type ComponentProps } from 'react';

type Props = Omit<ComponentProps<typeof Link>, 'href' | 'prefetch'> & { href: string };

export function DomaniLink({ href, onMouseEnter, onFocus, ...props }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const warmed = useRef<{ href: string; at: number } | null>(null);
  const warm = () => {
    if (href === pathname) return;
    if (warmed.current?.href === href && Date.now() - warmed.current.at < 30_000) return;
    warmed.current = { href, at: Date.now() };
    router.prefetch(href);
  };
  return (
    <Link
      {...props}
      href={href}
      prefetch={false}
      onMouseEnter={(event) => {
        onMouseEnter?.(event);
        if (!event.defaultPrevented) warm();
      }}
      onFocus={(event) => {
        onFocus?.(event);
        if (!event.defaultPrevented) warm();
      }}
    />
  );
}

'use client';

import { Badge } from '@/components/ui/badge';

interface ClientStatusBadgeProps {
  active: boolean | null;
}

export function ClientStatusBadge({ active }: ClientStatusBadgeProps) {
  if (active === true) {
    return (
      <Badge variant="success" className="gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
        Active
      </Badge>
    );
  }

  if (active === false) {
    return (
      <Badge
        variant="default"
        className="gap-1.5 border-transparent bg-[var(--pv-text-muted)] text-white"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-white opacity-60"></span>
        Inactive
      </Badge>
    );
  }

  return (
    <Badge variant="warning" className="gap-1.5">
      <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
      Unknown
    </Badge>
  );
}

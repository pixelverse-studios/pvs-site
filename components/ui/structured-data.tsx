'use client';

import { useNonce } from '@/components/nonce-provider';

interface StructuredDataProps {
  data: Record<string, unknown>;
  id?: string;
}

export function StructuredData({ data, id }: StructuredDataProps) {
  const nonce = useNonce();
  const scriptId = id ?? 'structured-data';

  return (
    <script
      id={scriptId}
      type="application/ld+json"
      nonce={nonce}
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

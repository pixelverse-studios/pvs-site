'use client';

import { useNonce } from '@/components/nonce-provider';

interface StructuredDataProps {
  data: Record<string, unknown>;
  id?: string;
}

export function StructuredData({ data, id }: StructuredDataProps) {
  const nonce = useNonce();
  const scriptId = id ?? 'structured-data';

  // JSON-LD must land in the SSR HTML so crawlers and validators can read it
  // without executing JS — do not switch this to `next/script`, whose strategies
  // defer the script and bundle the payload into the client-side bootstrap.
  // Escape `<` so any `</script>` or `<!--` substrings in the data can't break
  // out of the inline script tag (defense-in-depth XSS hardening).
  const payload = JSON.stringify(data).replace(/</g, '\\u003c');

  return (
    <script
      id={scriptId}
      type="application/ld+json"
      nonce={nonce}
      dangerouslySetInnerHTML={{ __html: payload }}
    />
  );
}

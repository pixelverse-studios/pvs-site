interface StructuredDataProps {
  data: Record<string, unknown>;
  id?: string;
}

// JSON-LD lives in a `<script type="application/ld+json">` element. Per the CSP
// spec, script-src directives only apply to scripts whose type is a JavaScript
// MIME type — application/ld+json is treated as a data block and is allowed
// regardless of script-src/nonce/hash policies. So no nonce is needed here.
//
// `<` is escaped as \u003c so that any `</script>` or `<!--` substring inside
// schema content (e.g. a blog excerpt that quotes HTML) can't break out of the
// inline script tag. JSON parsers transparently decode \u003c back to <.
//
// This component used to be marked 'use client' to read a per-request CSP nonce
// via the NonceProvider context. The nonce was unnecessary (see above) and the
// 'use client' boundary forced its parent layout to read headers(), which
// opted every page into dynamic rendering. Both have been removed (DEV-674).
export function StructuredData({ data, id }: StructuredDataProps) {
  const scriptId = id ?? 'structured-data';
  const payload = JSON.stringify(data).replace(/</g, '\\u003c');

  return (
    <script
      id={scriptId}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: payload }}
    />
  );
}

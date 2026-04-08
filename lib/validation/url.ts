import { z } from 'zod';

// Accepts a wide range of natural inputs:
//   example.com
//   www.example.com
//   app.example.com
//   https://example.com
//   https://www.example.com/contact?ref=foo
// Protocol and `www.` are both optional. `normalizeWebsiteUrl()` will
// prepend `https://` when needed before the value is sent to the server.
const websiteDomainRegex = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/[\S]*)?$/i;

export const websiteUrlSchema = z
  .string()
  .trim()
  .max(2048, 'Website URL must be 2048 characters or fewer.')
  .regex(
    websiteDomainRegex,
    'Enter a valid website URL (e.g. yourbusiness.com).',
  );

export function normalizeWebsiteUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return '';
  }

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

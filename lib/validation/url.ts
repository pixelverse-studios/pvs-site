import { z } from 'zod';

const websiteDomainRegex = /^(https?:\/\/)?www\.[a-z0-9-]+(\.[a-z0-9-]+)+(?:\/[\S]*)?$/i;

export const websiteUrlSchema = z
  .string()
  .trim()
  .max(2048, 'Website URL must be 2048 characters or fewer.')
  .regex(websiteDomainRegex, 'Enter a valid website URL that starts with www. and includes the domain extension.');

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

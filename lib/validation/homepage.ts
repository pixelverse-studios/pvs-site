import { z } from 'zod';

/**
 * Validation schemas for homepage data structures
 * Prevents XSS, open redirects, and malformed content
 */

// Safe URL validation - only allows relative paths or https:// URLs
const safeUrlSchema = z
  .string()
  .min(1, 'URL is required')
  .max(2048, 'URL too long')
  .refine(
    (url) => {
      // Allow relative paths starting with /
      if (url.startsWith('/')) return true;

      // Allow https:// URLs only
      try {
        const parsed = new URL(url);
        return parsed.protocol === 'https:';
      } catch {
        return false;
      }
    },
    { message: 'URL must be a relative path (/) or secure HTTPS URL' }
  );

// Base text validation - prevents script injection
const createSafeTextSchema = (maxLength: number, fieldName: string) =>
  z
    .string()
    .min(1, `${fieldName} is required`)
    .max(maxLength, `${fieldName} too long`)
    .refine(
      (text) => !/<script|javascript:|data:|vbscript:/i.test(text),
      { message: `${fieldName} contains potentially dangerous content` }
    );

// CTA button validation
const ctaSchema = z.object({
  label: createSafeTextSchema(50, 'CTA label'),
  href: safeUrlSchema,
});

// Homepage hero section validation
export const homepageHeroSchema = z.object({
  badge: createSafeTextSchema(100, 'Badge text'),
  headline: createSafeTextSchema(200, 'Headline'),
  subheadline: z.array(createSafeTextSchema(500, 'Subheadline')).min(1),
  primaryCta: ctaSchema,
  secondaryCta: ctaSchema,
});

// Type inference from schema
export type SafeHomepageHero = z.infer<typeof homepageHeroSchema>;

/**
 * Validates homepage hero data at runtime
 * Use this when rendering content from external sources (CMS, API, etc.)
 */
export function validateHomepageHero(data: unknown): SafeHomepageHero {
  return homepageHeroSchema.parse(data);
}

/**
 * Safe validation that returns validation errors instead of throwing
 */
export function safeValidateHomepageHero(data: unknown) {
  return homepageHeroSchema.safeParse(data);
}

'use client';

import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getApiBaseUrl } from '@/lib/api-config';
import { cn } from '@/lib/utils';
import { websiteUrlSchema } from '@/lib/validation/url';

// ─── Constants ───────────────────────────────────────────────────────────────

const SPECIFICS_OPTIONS = [
  { label: 'Mobile performance', value: 'mobile-performance' },
  { label: 'SEO & search visibility', value: 'seo-visibility' },
  { label: 'Traffic but no calls', value: 'traffic-no-calls' },
  { label: 'Page speed / technical issues', value: 'page-speed' },
  { label: 'Other', value: 'other' },
] as const;

// ─── Schema ──────────────────────────────────────────────────────────────────

const reviewFormSchema = z.object({
  name: z.string().min(1, 'Name is required.').max(100, 'Name is too long.'),
  email: z.string().email('Enter a valid email address.').max(254),
  phone_number: z.string().regex(/^[\d\s+\-().]{7,20}$/, 'Enter a valid phone number.').optional().or(z.literal('')),
  websiteUrl: websiteUrlSchema,
  specifics: z.array(z.string()).optional(),
  website_confirm: z.string().max(0).optional(),
});

type ReviewFormValues = z.infer<typeof reviewFormSchema>;

// ─── Sub-components ───────────────────────────────────────────────────────────

function FieldLabel({
  children,
  required,
  htmlFor,
}: {
  children: React.ReactNode;
  required?: boolean;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-sm font-medium text-[var(--pv-text)]"
    >
      {children}
      {required && (
        <span className="ml-0.5 text-[var(--pv-primary)]" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}

function FieldError({ message, id }: { message?: string; id?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export function ContactReviewForm() {
  const [formState, setFormState] = useState<FormState>('idle');
  const lastSubmitRef = useRef<number>(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      specifics: [],
    },
  });

  const onSubmit = async (data: ReviewFormValues) => {
    // Re-entry guard
    if (formState === 'submitting') return;

    // Honeypot check — bot filled the hidden field
    if (data.website_confirm) {
      reset();
      setFormState('success');
      return;
    }

    // 5-second throttle
    const now = Date.now();
    if (now - lastSubmitRef.current < 5000) return;
    lastSubmitRef.current = now;

    setFormState('submitting');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15_000);

    try {
      const payload = {
        name: data.name,
        email: data.email,
        phone_number: data.phone_number ?? '',
        websiteUrl: data.websiteUrl,
        specifics: data.specifics ?? [],
        honeypot: data.website_confirm ?? '',
      };

      const res = await fetch(`${getApiBaseUrl()}/api/audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      reset();
      setFormState('success');
    } catch {
      lastSubmitRef.current = 0;
      setFormState('error');
    }
  };

  // ── Success state ──────────────────────────────────────────────────────────
  if (formState === 'success') {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--pv-primary)_12%,transparent)]">
          <CheckCircle2 className="h-7 w-7 text-[var(--pv-primary)]" />
        </span>
        <div className="space-y-2">
          <h3 className="font-heading text-xl font-semibold text-[var(--pv-text)]">
            We&rsquo;ve received your request
          </h3>
          <p className="max-w-sm text-sm text-[var(--pv-text-muted)]">
            We&rsquo;ll take a look at your site and follow up within 1–2 business days with honest
            feedback on what we find.
          </p>
        </div>
      </div>
    );
  }

  const isSubmittingState = formState === 'submitting';

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-6">
        {/* Row 1: name / email */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <FieldLabel htmlFor="review-name" required>
              Your Name
            </FieldLabel>
            <Input
              id="review-name"
              autoComplete="name"
              placeholder="Jane Smith"
              disabled={isSubmittingState}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'review-name-error' : undefined}
              {...register('name')}
            />
            <FieldError id="review-name-error" message={errors.name?.message} />
          </div>

          <div>
            <FieldLabel htmlFor="review-email" required>
              Email Address
            </FieldLabel>
            <Input
              id="review-email"
              type="email"
              autoComplete="email"
              placeholder="jane@company.com"
              disabled={isSubmittingState}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'review-email-error' : undefined}
              {...register('email')}
            />
            <FieldError id="review-email-error" message={errors.email?.message} />
          </div>
        </div>

        {/* Phone — optional */}
        <div>
          <FieldLabel htmlFor="review-phone">Phone Number</FieldLabel>
          <Input
            id="review-phone"
            type="tel"
            autoComplete="tel"
            placeholder="(201) 555-0100"
            disabled={isSubmittingState}
            {...register('phone_number')}
          />
          <FieldError id="review-phone-error" message={errors.phone_number?.message} />
        </div>

        {/* Website URL — full width */}
        <div>
          <FieldLabel htmlFor="review-websiteUrl" required>
            Your Website URL
          </FieldLabel>
          <Input
            id="review-websiteUrl"
            type="url"
            placeholder="www.yoursite.com"
            disabled={isSubmittingState}
            aria-invalid={!!errors.websiteUrl}
            aria-describedby={errors.websiteUrl ? 'review-websiteUrl-error' : undefined}
            {...register('websiteUrl')}
          />
          <FieldError id="review-websiteUrl-error" message={errors.websiteUrl?.message} />
        </div>

        {/* Specifics checkboxes */}
        <div>
          <p className="mb-1 text-sm font-medium text-[var(--pv-text)]">
            Anything specific you want us to look at?
          </p>
          <p className="mb-3 text-xs text-[var(--pv-text-muted)]">
            (We&rsquo;ll audit everything — this just helps us prioritize)
          </p>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {SPECIFICS_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={cn(
                  'flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm transition-colors',
                  'border-[var(--pv-border)] hover:border-[var(--pv-primary)] hover:bg-[color-mix(in_srgb,var(--pv-primary)_4%,transparent)]',
                  isSubmittingState && 'pointer-events-none opacity-60',
                )}
              >
                <input
                  type="checkbox"
                  value={opt.value}
                  disabled={isSubmittingState}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--pv-primary)]"
                  {...register('specifics')}
                />
                <span className="text-[var(--pv-text)]">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Honeypot — off-screen, hidden from real users */}
        <div
          style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}
          aria-hidden="true"
        >
          <input tabIndex={-1} autoComplete="off" {...register('website_confirm')} />
        </div>

        {/* Error message */}
        {formState === 'error' && !isSubmitting && (
          <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>
              Something went wrong. Please try again or reach us directly at{' '}
              <a
                href="mailto:hello@pixelversestudios.io"
                className="font-medium underline underline-offset-2"
              >
                hello@pixelversestudios.io
              </a>
              .
            </span>
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmittingState} size="lg">
            {isSubmittingState ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                Sending&hellip;
              </>
            ) : (
              'Start the Conversation'
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}

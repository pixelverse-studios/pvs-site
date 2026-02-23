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
import { formatPhone, stripPhone } from '@/lib/utils/phone';
import { normalizeWebsiteUrl, websiteUrlSchema } from '@/lib/validation/url';

// ─── Constants ───────────────────────────────────────────────────────────────

const CORE_SPECIFICS = [
  { label: 'Mobile performance', value: 'mobile-performance' },
  { label: 'SEO & search visibility', value: 'seo-visibility' },
  { label: 'Traffic but no calls', value: 'traffic-no-calls' },
  { label: 'Page speed / technical issues', value: 'page-speed' },
] as const;

const ALL_CORE_VALUES = CORE_SPECIFICS.map((o) => o.value) as string[];

// ─── Schema ──────────────────────────────────────────────────────────────────

const reviewFormSchema = z.object({
  name: z.string().min(1, 'Name is required.').max(100, 'Name is too long.'),
  email: z.string().email('Enter a valid email address.').max(254),
  phone_number: z.string().regex(/^[\d\s+\-().]{7,20}$/, 'Enter a valid phone number.').optional().or(z.literal('')),
  websiteUrl: websiteUrlSchema,
  specifics: z.array(z.string().max(100)).max(10).optional(),
  other_detail: z.string().max(500).optional(),
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
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      specifics: [],
    },
  });

  const watchedSpecifics = watch('specifics') ?? [];
  const isAllSelected =
    ALL_CORE_VALUES.every((v) => watchedSpecifics.includes(v)) &&
    !watchedSpecifics.includes('other');
  const isOtherSelected = watchedSpecifics.includes('other');

  function handleAllChange(checked: boolean) {
    const current = watchedSpecifics;
    if (checked) {
      setValue('specifics', Array.from(new Set([...ALL_CORE_VALUES, ...current])), { shouldValidate: true });
    } else {
      setValue('specifics', current.filter((v) => !ALL_CORE_VALUES.includes(v)), { shouldValidate: true });
    }
  }

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
        phone_number: stripPhone(data.phone_number),
        websiteUrl: normalizeWebsiteUrl(data.websiteUrl),
        other_detail: (data.specifics ?? []).includes('other') ? (data.other_detail ?? '') : undefined,
        specifics: (data.specifics ?? []).filter((v) => v !== 'other'),
        honeypot: data.website_confirm ?? '',
      };

      const res = await fetch(`${getApiBaseUrl()}/api/audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      reset();
      setFormState('success');
    } catch {
      lastSubmitRef.current = 0;
      setFormState('error');
    } finally {
      clearTimeout(timeoutId);
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

        {/* Row 2: website URL / phone */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

          <div>
            <FieldLabel htmlFor="review-phone">Phone Number</FieldLabel>
            <Input
              id="review-phone"
              type="tel"
              autoComplete="tel"
              placeholder="(201) 555-0100"
              disabled={isSubmittingState}
              {...register('phone_number')}
              onChange={(e) => setValue('phone_number', formatPhone(e.target.value), { shouldValidate: true })}
            />
            <FieldError id="review-phone-error" message={errors.phone_number?.message} />
          </div>
        </div>

        {/* Specifics checkboxes */}
        <div>
          <p className="mb-1 text-sm font-medium text-[var(--pv-text)]">
            Anything specific you want us to look at?
          </p>
          <p className="mb-3 text-xs text-[var(--pv-text-muted)]">
            (We&rsquo;ll audit everything — this just helps us prioritize)
          </p>
          {/* 2-col grid for the 4 core options */}
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {CORE_SPECIFICS.map((opt) => (
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

          {/* All of the above — full width */}
          <label
            className={cn(
              'mt-2.5 flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm transition-colors',
              'border-[var(--pv-border)] hover:border-[var(--pv-primary)] hover:bg-[color-mix(in_srgb,var(--pv-primary)_4%,transparent)]',
              isAllSelected && 'border-[var(--pv-primary)] bg-[color-mix(in_srgb,var(--pv-primary)_4%,transparent)]',
              isSubmittingState && 'pointer-events-none opacity-60',
            )}
          >
            <input
              type="checkbox"
              checked={isAllSelected}
              disabled={isSubmittingState}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--pv-primary)]"
              onChange={(e) => handleAllChange(e.target.checked)}
            />
            <span className="text-[var(--pv-text)]">All of the above</span>
          </label>

          {/* Other — full width with optional detail input */}
          <div
            className={cn(
              'mt-2.5 rounded-lg border transition-colors',
              'border-[var(--pv-border)]',
              isOtherSelected && 'border-[var(--pv-primary)]',
              isSubmittingState && 'pointer-events-none opacity-60',
            )}
          >
            <label className="flex cursor-pointer items-start gap-3 p-3 text-sm">
              <input
                type="checkbox"
                value="other"
                disabled={isSubmittingState}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--pv-primary)]"
                {...register('specifics')}
              />
              <span className="text-[var(--pv-text)]">Other</span>
            </label>

            {isOtherSelected && (
              <div className="border-t border-[var(--pv-border)] px-3 pb-3 pt-2.5">
                <input
                  type="text"
                  placeholder="Tell us what you'd like us to look at…"
                  disabled={isSubmittingState}
                  className="w-full rounded-md border border-[var(--pv-border)] bg-[var(--pv-bg)] px-3 py-2 text-sm text-[var(--pv-text)] placeholder:text-[var(--pv-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--pv-primary)] focus:ring-offset-1 focus:ring-offset-[var(--pv-bg)]"
                  {...register('other_detail')}
                />
              </div>
            )}
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
                href="mailto:info@pixelversestudios.io"
                className="font-medium underline underline-offset-2"
              >
                info@pixelversestudios.io
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

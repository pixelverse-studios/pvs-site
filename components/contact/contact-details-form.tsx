'use client';

import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { getApiBaseUrl } from '@/lib/api-config';
import { cn } from '@/lib/utils';
import { formatPhone, stripPhone } from '@/lib/utils/phone';

// ─── Constants ───────────────────────────────────────────────────────────────

const BUDGET_OPTIONS = [
  { label: 'Under $1,000', value: '<1k' },
  { label: '$1,000–$3,000', value: '1-3k' },
  { label: '$3,000–$6,000', value: '3-6k' },
  { label: '$6,000–$10,000', value: '6-10k' },
  { label: '$10,000+', value: '10k+' },
] as const;

const TIMELINE_OPTIONS = [
  { label: 'As soon as possible', value: 'ASAP' },
  { label: '1–2 months', value: '1-2mo' },
  { label: '3–6 months', value: '3-6mo' },
  { label: '6+ months', value: '6+mo' },
  { label: 'Not sure yet', value: 'unsure' },
] as const;

const IMPROVEMENT_OPTIONS = [
  { label: 'Need a website built from scratch', value: 'built-from-scratch' },
  { label: 'Website feels outdated or unprofessional', value: 'outdated' },
  { label: 'Getting traffic but not enough leads or sales', value: 'low-conversion' },
  { label: 'Need ongoing support or maintenance', value: 'maintenance' },
  { label: 'Not showing up in search results', value: 'seo' },
  { label: 'Site is slow or experiencing technical issues', value: 'performance' },
  { label: 'Not sure yet', value: 'unsure' },
] as const;

const INTERESTED_IN_OPTIONS = [
  { label: 'Web Design & Development', value: 'web-design' },
  { label: 'SEO', value: 'seo' },
  { label: 'Both', value: 'both' },
  { label: 'Not sure yet', value: 'unsure' },
] as const;

// ─── Schema ──────────────────────────────────────────────────────────────────

function toEnumValues<T extends readonly { readonly value: string }[]>(
  opts: T,
): [T[number]['value'], ...T[number]['value'][]] {
  return opts.map((o) => o.value) as [T[number]['value'], ...T[number]['value'][]];
}

const detailsFormSchema = z.object({
  name: z.string().min(2, 'Please enter your name.').max(100, 'Name is too long.'),
  email: z.string().email('Enter a valid email address.').max(254),
  companyName: z.string().min(1, 'Company name is required.').max(150, 'Company name is too long.'),
  phone: z.string().regex(/^[\d\s+\-().]{7,20}$/, 'Enter a valid phone number.').optional().or(z.literal('')),
  budget: z.enum(toEnumValues(BUDGET_OPTIONS), {
    required_error: 'Select a budget range.',
  }),
  timeline: z.enum(toEnumValues(TIMELINE_OPTIONS), {
    required_error: 'Select a timeline.',
  }),
  currentWebsite: z.string().url('Enter a valid URL (e.g. https://yoursite.com)').optional().or(z.literal('')),
  improvements: z.array(z.enum(toEnumValues(IMPROVEMENT_OPTIONS))).min(1, 'Select at least one area.'),
  interestedIn: z.enum(toEnumValues(INTERESTED_IN_OPTIONS)).optional(),
  briefSummary: z.string().max(2000, 'Please keep this under 2,000 characters.').optional(),
  website_confirm: z.string().max(0).optional(),
});

type DetailsFormValues = z.infer<typeof detailsFormSchema>;

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

export function ContactDetailsForm() {
  const [formState, setFormState] = useState<FormState>('idle');
  const lastSubmitRef = useRef<number>(0);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<DetailsFormValues>({
    resolver: zodResolver(detailsFormSchema),
    defaultValues: {
      improvements: [],
      interestedIn: undefined,
    },
  });

  const [watchedName, watchedEmail, watchedCompany, watchedBudget, watchedTimeline, watchedImprovements] =
    watch(['name', 'email', 'companyName', 'budget', 'timeline', 'improvements']);

  const isFormReady =
    !!(watchedName?.trim()) &&
    !!(watchedEmail?.trim()) &&
    !!(watchedCompany?.trim()) &&
    !!watchedBudget &&
    !!watchedTimeline &&
    (watchedImprovements?.length ?? 0) > 0;

  const onSubmit = async (data: DetailsFormValues) => {
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
        company_name: data.companyName,
        phone: stripPhone(data.phone),
        budget: data.budget,
        timeline: data.timeline,
        current_website: data.currentWebsite ?? '',
        improvements: data.improvements,
        interested_in: data.interestedIn ?? '',
        brief_summary: data.briefSummary ?? '',
      };

      const res = await fetch(`${getApiBaseUrl()}/api/leads`, {
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
            We&rsquo;ve received your details
          </h3>
          <p className="max-w-sm text-sm text-[var(--pv-text-muted)]">
            We review every submission personally and will follow up within 1–2 business days with
            honest thoughts on what makes sense for your situation.
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
            <FieldLabel htmlFor="name" required>
              Your Name
            </FieldLabel>
            <Input
              id="name"
              autoComplete="name"
              placeholder="Jane Smith"
              disabled={isSubmittingState}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
              {...register('name')}
            />
            <FieldError id="name-error" message={errors.name?.message} />
          </div>

          <div>
            <FieldLabel htmlFor="email" required>
              Email Address
            </FieldLabel>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="jane@company.com"
              disabled={isSubmittingState}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              {...register('email')}
            />
            <FieldError id="email-error" message={errors.email?.message} />
          </div>
        </div>

        {/* Row 2: companyName / phone / budget */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <FieldLabel htmlFor="companyName" required>
              Business Name
            </FieldLabel>
            <Input
              id="companyName"
              autoComplete="organization"
              placeholder="Acme Inc."
              disabled={isSubmittingState}
              aria-invalid={!!errors.companyName}
              aria-describedby={errors.companyName ? 'company-error' : undefined}
              {...register('companyName')}
            />
            <FieldError id="company-error" message={errors.companyName?.message} />
          </div>

          <div>
            <FieldLabel htmlFor="phone">Phone</FieldLabel>
            <Input
              id="phone"
              type="tel"
              autoComplete="tel"
              placeholder="(201) 555-0100"
              disabled={isSubmittingState}
              {...register('phone')}
              onChange={(e) => setValue('phone', formatPhone(e.target.value), { shouldValidate: true })}
            />
          </div>

          <div>
            <FieldLabel required>Budget Range</FieldLabel>
            <Controller
              control={control}
              name="budget"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isSubmittingState}
                >
                  <SelectTrigger
                    aria-invalid={!!errors.budget}
                    aria-describedby={errors.budget ? 'budget-error' : undefined}
                  >
                    <SelectValue placeholder="Select a range" />
                  </SelectTrigger>
                  <SelectContent>
                    {BUDGET_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError id="budget-error" message={errors.budget?.message} />
          </div>
        </div>

        {/* Row 3: timeline / currentWebsite */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <FieldLabel required>Timeline</FieldLabel>
            <Controller
              control={control}
              name="timeline"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isSubmittingState}
                >
                  <SelectTrigger
                    aria-invalid={!!errors.timeline}
                    aria-describedby={errors.timeline ? 'timeline-error' : undefined}
                  >
                    <SelectValue placeholder="Select a timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMELINE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError id="timeline-error" message={errors.timeline?.message} />
          </div>

          <div>
            <FieldLabel htmlFor="currentWebsite">Current Website</FieldLabel>
            <Input
              id="currentWebsite"
              type="url"
              placeholder="https://yoursite.com"
              disabled={isSubmittingState}
              {...register('currentWebsite')}
            />
          </div>
        </div>

        {/* Interested in — single select radios */}
        <div>
          <p className="mb-3 text-sm font-medium text-[var(--pv-text)]">
            What are you interested in?
          </p>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {INTERESTED_IN_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={cn(
                  'flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm transition-colors',
                  'border-[var(--pv-border)] hover:border-[var(--pv-primary)] hover:bg-[color-mix(in_srgb,var(--pv-primary)_4%,transparent)]',
                  isSubmittingState && 'pointer-events-none opacity-60',
                )}
              >
                <input
                  type="radio"
                  value={opt.value}
                  disabled={isSubmittingState}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--pv-primary)]"
                  {...register('interestedIn')}
                />
                <span className="text-[var(--pv-text)]">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Improvements checkboxes */}
        <div>
          <p className="mb-3 text-sm font-medium text-[var(--pv-text)]">
            What are you hoping to improve?{' '}
            <span className="text-[var(--pv-primary)]" aria-hidden="true">
              *
            </span>
            <span className="ml-1 font-normal text-[var(--pv-text-muted)]">
              (Select all that apply)
            </span>
          </p>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {IMPROVEMENT_OPTIONS.map((opt) => (
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
                  {...register('improvements')}
                />
                <span className="text-[var(--pv-text)]">{opt.label}</span>
              </label>
            ))}
          </div>
          <FieldError id="improvements-error" message={errors.improvements?.root?.message ?? errors.improvements?.message} />
        </div>

        {/* Brief summary textarea */}
        <div>
          <FieldLabel htmlFor="briefSummary">Anything else we should know?</FieldLabel>
          <Textarea
            id="briefSummary"
            placeholder="Tell us about your business, what you're trying to achieve, and what success would look like."
            disabled={isSubmittingState}
            {...register('briefSummary')}
          />
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
          <Button type="submit" disabled={isSubmittingState || !isFormReady} size="lg">
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

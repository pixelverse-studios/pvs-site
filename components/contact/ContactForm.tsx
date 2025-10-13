'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const SUBMIT_THROTTLE_MS = 5000;
const LEADS_ENDPOINT = process.env.NEXT_PUBLIC_LEADS_ENDPOINT ?? '/api/leads';

const budgetOptions = [
  { label: 'Under $1k', value: '<1k' },
  { label: '$1k – $3k', value: '1-3k' },
  { label: '$3k – $6k', value: '3-6k' },
  { label: '$6k – $10k', value: '6-10k' },
  { label: '$10k+', value: '10k+' }
] as const;

const timelineOptions = [
  { label: 'ASAP', value: 'ASAP' },
  { label: '1–2 months', value: '1-2mo' },
  { label: '3–6 months', value: '3-6mo' },
  { label: '6+ months', value: '6+mo' },
  { label: 'Not sure yet', value: 'unsure' }
] as const;

const formSchema = z.object({
  name: z.string().min(2, 'Please enter your name.'),
  email: z.string().email('Enter a valid email address.'),
  budget: z.enum(budgetOptions.map((option) => option.value) as [string, ...string[]], {
    required_error: 'Select a project budget range.'
  }),
  timeline: z.enum(timelineOptions.map((option) => option.value) as [string, ...string[]], {
    required_error: 'Select your project timeline.'
  }),
  briefSummary: z
    .string()
    .min(10, 'Share a short overview of your project (at least 10 characters).'),
  hasSeenPackages: z.enum(['yes', 'no'], {
    required_error: 'Let us know if you have reviewed the Packages page.'
  }),
  honeypot: z
    .string()
    .max(0)
    .optional()
});

type ContactFormValues = z.infer<typeof formSchema>;

type ToastState =
  | {
      type: 'success';
      message: string;
    }
  | {
      type: 'error';
      message: string;
    };

export function ContactForm() {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid }
  } = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      budget: undefined,
      timeline: undefined,
      briefSummary: '',
      hasSeenPackages: undefined,
      honeypot: ''
    }
  });

  const [toast, setToast] = useState<ToastState | null>(null);
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [cooldownMs, setCooldownMs] = useState(0);

  const isCoolingDown = cooldownUntil !== null;

  useEffect(() => {
    if (!cooldownUntil) {
      setCooldownMs(0);
      return;
    }

    const tick = () => {
      const remaining = cooldownUntil - Date.now();
      if (remaining <= 0) {
        setCooldownUntil(null);
        setCooldownMs(0);
        return;
      }
      setCooldownMs(remaining);
    };

    tick();

    const intervalId = window.setInterval(tick, 200);
    return () => window.clearInterval(intervalId);
  }, [cooldownUntil]);

  const throttleSubmission = useCallback(() => {
    setCooldownUntil(Date.now() + SUBMIT_THROTTLE_MS);
  }, []);

  const clearToast = useCallback(() => setToast(null), []);

  type LeadApiPayload = {
    name: ContactFormValues['name'];
    email: ContactFormValues['email'];
    budget: (typeof budgetOptions)[number]['value'];
    timeline: (typeof timelineOptions)[number]['value'];
    briefSummary: ContactFormValues['briefSummary'];
    hasSeenPackages: boolean;
    honeypot: string;
  };

  const submitLead = useCallback(async (payload: LeadApiPayload) => {
    const response = await fetch(LEADS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('Failed to submit lead');
    }
  }, []);

  const onSubmit = useCallback(
    async (values: ContactFormValues) => {
      clearToast();
      const { honeypot, ...rest } = values;

      if (honeypot && honeypot.length > 0) {
        reset();
        setToast({
          type: 'success',
          message: "Thanks! We'll reach out soon."
        });
        throttleSubmission();
        return;
      }

      try {
        const { hasSeenPackages, ...restWithoutPackages } = rest;
        const payload: LeadApiPayload = {
          ...restWithoutPackages,
          hasSeenPackages: hasSeenPackages === 'yes',
          honeypot: honeypot ?? ''
        };

        await submitLead(payload);
        reset();
        setToast({
          type: 'success',
          message: "Thanks for reaching out! We'll contact you within 24–48 hours."
        });
      } catch (error) {
        console.error(error);
        setToast({
          type: 'error',
          message: 'Something went wrong while submitting. Please try again.'
        });
      } finally {
        throttleSubmission();
      }
    },
    [clearToast, reset, submitLead, throttleSubmission]
  );

  const retrySubmit = useCallback(() => {
    setCooldownUntil(null);
    setToast(null);
    void handleSubmit(onSubmit)();
  }, [handleSubmit, onSubmit]);

  const cooldownLabel = useMemo(() => {
    if (!isCoolingDown) return null;
    return `You can submit again in ${Math.ceil(cooldownMs / 1000)}s.`;
  }, [cooldownMs, isCoolingDown]);

  return (
    <div className="space-y-5">
      {toast && (
        <div
          role={toast.type === 'error' ? 'alert' : 'status'}
          className={cn(
            'flex items-center justify-between gap-4 rounded-pv-sm border px-4 py-3 text-sm shadow-sm',
            toast.type === 'success'
              ? 'border-[var(--pv-success)]/50 bg-[var(--pv-success)]/10 text-[var(--pv-success)]'
              : 'border-[var(--pv-danger)]/50 bg-[var(--pv-danger)]/10 text-[var(--pv-danger)]'
          )}
        >
          <div className="flex items-center gap-2">
            {toast.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 flex-shrink-0" aria-hidden />
            ) : (
              <AlertCircle className="h-4 w-4 flex-shrink-0" aria-hidden />
            )}
            <span>{toast.message}</span>
          </div>
          {toast.type === 'error' ? (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={retrySubmit}>
                Retry
              </Button>
              <Button variant="ghost" size="sm" onClick={clearToast}>
                Dismiss
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="sm" onClick={clearToast}>
              Close
            </Button>
          )}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
          {...register('honeypot')}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="contact-name"
              className="text-sm font-medium text-[var(--pv-text)] dark:text-white"
            >
              Name
            </label>
            <Input
              id="contact-name"
              placeholder="Your name"
              autoComplete="name"
              aria-invalid={errors.name ? 'true' : 'false'}
              aria-describedby={errors.name ? 'contact-name-error' : undefined}
              {...register('name')}
              disabled={isSubmitting || isCoolingDown}
            />
            {errors.name && (
              <p id="contact-name-error" className="text-sm text-[var(--pv-danger)]">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="contact-email"
              className="text-sm font-medium text-[var(--pv-text)] dark:text-white"
            >
              Email
            </label>
            <Input
              id="contact-email"
              type="email"
              placeholder="you@company.com"
              autoComplete="email"
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'contact-email-error' : undefined}
              {...register('email')}
              disabled={isSubmitting || isCoolingDown}
            />
            {errors.email && (
              <p id="contact-email-error" className="text-sm text-[var(--pv-danger)]">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--pv-text)] dark:text-white">
              Budget
            </label>
            <Controller
              name="budget"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? undefined}
                  disabled={isSubmitting || isCoolingDown}
                >
                  <SelectTrigger
                    aria-invalid={errors.budget ? 'true' : 'false'}
                    aria-describedby={errors.budget ? 'contact-budget-error' : undefined}
                  >
                    <SelectValue placeholder="Select budget" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {budgetOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.budget && (
              <p id="contact-budget-error" className="text-sm text-[var(--pv-danger)]">
                {errors.budget.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--pv-text)] dark:text-white">
              Timeline
            </label>
            <Controller
              name="timeline"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? undefined}
                  disabled={isSubmitting || isCoolingDown}
                >
                  <SelectTrigger
                    aria-invalid={errors.timeline ? 'true' : 'false'}
                    aria-describedby={errors.timeline ? 'contact-timeline-error' : undefined}
                  >
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {timelineOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.timeline && (
              <p id="contact-timeline-error" className="text-sm text-[var(--pv-danger)]">
                {errors.timeline.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="contact-briefSummary"
            className="text-sm font-medium text-[var(--pv-text)] dark:text-white"
          >
            Brief summary
          </label>
          <Textarea
            id="contact-briefSummary"
            placeholder="Tell us about your project goals, timeline, or challenges."
            rows={5}
            aria-invalid={errors.briefSummary ? 'true' : 'false'}
            aria-describedby={errors.briefSummary ? 'contact-briefSummary-error' : undefined}
            {...register('briefSummary')}
            disabled={isSubmitting || isCoolingDown}
          />
          {errors.briefSummary && (
            <p id="contact-briefSummary-error" className="text-sm text-[var(--pv-danger)]">
              {errors.briefSummary.message}
            </p>
          )}
        </div>

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-[var(--pv-text)] dark:text-white">
            Have you looked at the Packages page?
          </legend>
          <div
            role="radiogroup"
            aria-invalid={errors.hasSeenPackages ? 'true' : 'false'}
            aria-describedby={errors.hasSeenPackages ? 'contact-packages-error' : undefined}
            className="flex flex-wrap gap-3"
          >
            <label className="inline-flex items-center gap-2 rounded-pv-sm border border-[var(--pv-border)] bg-[var(--pv-surface)] px-4 py-2 text-sm text-[var(--pv-text)] transition hover:border-[var(--pv-primary)]">
              <input
                type="radio"
                value="yes"
                className="h-4 w-4 accent-[var(--pv-primary)]"
                {...register('hasSeenPackages')}
                disabled={isSubmitting || isCoolingDown}
              />
              Yes
            </label>
            <label className="inline-flex items-center gap-2 rounded-pv-sm border border-[var(--pv-border)] bg-[var(--pv-surface)] px-4 py-2 text-sm text-[var(--pv-text)] transition hover:border-[var(--pv-primary)]">
              <input
                type="radio"
                value="no"
                className="h-4 w-4 accent-[var(--pv-primary)]"
                {...register('hasSeenPackages')}
                disabled={isSubmitting || isCoolingDown}
              />
              No
            </label>
          </div>
          {errors.hasSeenPackages && (
            <p id="contact-packages-error" className="text-sm text-[var(--pv-danger)]">
              {errors.hasSeenPackages.message}
            </p>
          )}
        </fieldset>

        <div className="space-y-2">
          <Button
            type="submit"
            variant="cta"
            size="lg"
            className="w-full sm:w-auto"
            disabled={isSubmitting || isCoolingDown || !isValid}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                Sending...
              </span>
            ) : isCoolingDown ? (
              'Please wait...'
            ) : (
              'Send Message'
            )}
          </Button>
          {cooldownLabel && (
            <p className="text-sm text-[var(--pv-text-muted)]" aria-live="polite">
              {cooldownLabel}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

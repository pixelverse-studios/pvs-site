'use client';

import type { ReactNode } from 'react';
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
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { formatMessageWithEmailLink } from '@/lib/support-email';
import { cn } from '@/lib/utils';
import { getApiBaseUrl } from '@/lib/api-config';
import { trackFormSubmission } from '@/lib/mixpanel';

const SUBMIT_THROTTLE_MS = 5000;

const createDefaultFormValues = (): Partial<ContactFormValues> => ({
  name: '',
  email: '',
  budget: undefined,
  timeline: undefined,
  briefSummary: '',
  hasSeenPackages: undefined,
  honeypot: '',
});

const budgetValues = ['<1k', '1-3k', '3-6k', '6-10k', '10k+'] as const;
type BudgetValue = (typeof budgetValues)[number];
const budgetOptions = [
  { label: 'Under $1k', value: budgetValues[0] },
  { label: '$1k – $3k', value: budgetValues[1] },
  { label: '$3k – $6k', value: budgetValues[2] },
  { label: '$6k – $10k', value: budgetValues[3] },
  { label: '$10k+', value: budgetValues[4] },
] as const;

const timelineValues = ['ASAP', '1-2mo', '3-6mo', '6+mo', 'unsure'] as const;
type TimelineValue = (typeof timelineValues)[number];
const timelineOptions = [
  { label: 'ASAP', value: timelineValues[0] },
  { label: '1–2 months', value: timelineValues[1] },
  { label: '3–6 months', value: timelineValues[2] },
  { label: '6+ months', value: timelineValues[3] },
  { label: 'Not sure yet', value: timelineValues[4] },
] as const;

const formSchema = z.object({
  name: z.string().min(2, 'Please enter your name.'),
  email: z.string().email('Enter a valid email address.'),
  budget: z.enum(budgetValues, {
    required_error: 'Select a project budget range.',
  }),
  timeline: z.enum(timelineValues, {
    required_error: 'Select your project timeline.',
  }),
  briefSummary: z
    .string()
    .min(10, 'Share a short overview of your project (at least 10 characters).'),
  hasSeenPackages: z.enum(['yes', 'no'], {
    required_error: 'Let us know if you have reviewed the Packages page.',
  }),
  honeypot: z.string().max(0).optional(),
});

type ContactFormValues = z.infer<typeof formSchema>;

type ToastMessage = string | ReactNode;

type ToastState =
  | {
      type: 'success';
      message: ToastMessage;
    }
  | {
      type: 'error';
      message: ToastMessage;
    };

export function ContactForm() {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: createDefaultFormValues(),
  });

  const [toast, setToast] = useState<ToastState | null>(null);
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [cooldownMs, setCooldownMs] = useState(0);
  const [formResetKey, setFormResetKey] = useState(0);

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

  const resetForm = useCallback(() => {
    reset(createDefaultFormValues());
    setFormResetKey((prev) => prev + 1);
  }, [reset]);

  const clearToast = useCallback(() => {
    setToast(null);
  }, []);

  const dismissToast = useCallback(() => {
    setToast(null);
    resetForm();
  }, [resetForm]);

  type LeadApiPayload = {
    name: ContactFormValues['name'];
    email: ContactFormValues['email'];
    budget: BudgetValue;
    timeline: TimelineValue;
    briefSummary: ContactFormValues['briefSummary'];
    hasSeenPackages: boolean;
    honeypot: string;
  };

  type LeadSubmissionError = Error & {
    status?: number;
    supportEmail?: string;
    subjectLine?: string;
  };

  const submitLead = useCallback(async (payload: LeadApiPayload) => {
    const apiBaseUrl = getApiBaseUrl();
    const leadsEndpoint = apiBaseUrl ? `${apiBaseUrl.replace(/\/$/, '')}/api/leads` : '/api/leads';
    const response = await fetch(leadsEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to submit lead.';
      let supportEmail: string | undefined;
      let subjectLine: string | undefined;

      try {
        const rawBody = await response.text();
        if (rawBody) {
          try {
            const parsed = JSON.parse(rawBody);
            if (typeof parsed?.message === 'string' && parsed.message.trim().length > 0) {
              errorMessage = parsed.message.trim();
            } else if (rawBody.trim().length > 0) {
              errorMessage = rawBody.trim();
            }
            if (typeof parsed?.supportEmail === 'string' && parsed.supportEmail.trim().length > 0) {
              supportEmail = parsed.supportEmail.trim();
            }
            if (typeof parsed?.subjectLine === 'string' && parsed.subjectLine.trim().length > 0) {
              subjectLine = parsed.subjectLine.trim();
            }
          } catch {
            if (rawBody.trim().length > 0) {
              errorMessage = rawBody.trim();
            }
          }
        }
      } catch (bodyReadError) {
        console.error('Unable to read lead submission error response', bodyReadError);
      }

      const error = new Error(errorMessage) as LeadSubmissionError;
      error.status = response.status;
      error.supportEmail = supportEmail;
      error.subjectLine = subjectLine;
      throw error;
    }
  }, []);

  const onSubmit = useCallback(
    async (values: ContactFormValues) => {
      clearToast();
      const { honeypot, hasSeenPackages, name, email, budget, timeline, briefSummary } = values;

      if (honeypot && honeypot.length > 0) {
        resetForm();
        setToast({
          type: 'success',
          message: "Thanks! We'll reach out soon.",
        });
        throttleSubmission();
        return;
      }

      try {
        const payload: LeadApiPayload = {
          name,
          email,
          budget,
          timeline,
          briefSummary,
          hasSeenPackages: hasSeenPackages === 'yes',
          honeypot: honeypot ?? '',
        };

        await submitLead(payload);
        trackFormSubmission('Contact Form', true, { budget, timeline });
        resetForm();
        setToast({
          type: 'success',
          message: "Thanks for reaching out! We'll contact you within 2-3 business days.",
        });
      } catch (error) {
        console.error(error);
        trackFormSubmission('Contact Form', false);
        let message = 'Something went wrong while submitting. Please try again.';

        if (
          error instanceof Error &&
          typeof error.message === 'string' &&
          error.message.trim().length > 0
        ) {
          message = error.message.trim();
        }

        const supportEmail =
          typeof error === 'object' && error !== null
            ? (error as LeadSubmissionError).supportEmail
            : undefined;
        const subjectLine =
          typeof error === 'object' && error !== null
            ? (error as LeadSubmissionError).subjectLine
            : undefined;

        setToast({
          type: 'error',
          message: formatMessageWithEmailLink(message, supportEmail, subjectLine),
        });
      } finally {
        throttleSubmission();
      }
    },
    [clearToast, resetForm, submitLead, throttleSubmission],
  );

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
              : 'border-[var(--pv-danger)]/50 bg-[var(--pv-danger)]/10 text-[var(--pv-danger)]',
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
              <Button variant="ghost" size="sm" onClick={dismissToast}>
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
                  key={`budget-${formResetKey}`}
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
                  key={`timeline-${formResetKey}`}
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

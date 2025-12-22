'use client';

import type { ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { formatMessageWithEmailLink } from '@/lib/support-email';
import { websiteUrlSchema } from '@/lib/validation/url';
import { getApiBaseUrl } from '@/lib/api-config';

const SUBMIT_THROTTLE_MS = 5000;

const auditFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name must be 200 characters or fewer'),
  email: z.string().email('A valid email is required'),
  websiteUrl: websiteUrlSchema,
  phoneNumber: z
    .string()
    .optional()
    .refine((value) => {
      if (!value) return true;
      const trimmed = value.trim();
      if (trimmed.length === 0) return true;
      return trimmed.length >= 7 && trimmed.length <= 30;
    }, 'Phone number must be between 7 and 30 characters'),
  specifics: z
    .string()
    .optional()
    .refine((value) => {
      if (!value) return true;
      const trimmed = value.trim();
      if (trimmed.length === 0) return true;
      return trimmed.length <= 2000;
    }, 'Specifics must be 2000 characters or fewer'),
  honeypot: z.string().max(0).optional(),
});

type AuditFormValues = z.infer<typeof auditFormSchema>;

const createDefaultFormValues = (): AuditFormValues => ({
  name: '',
  email: '',
  websiteUrl: '',
  phoneNumber: '',
  specifics: '',
  honeypot: '',
});

type ToastState = { type: 'success'; message: string } | { type: 'error'; message: ReactNode };

type AuditSubmissionError = Error & {
  status?: number;
  supportEmail?: string;
  subjectLine?: string;
};

type AuditApiPayload = {
  name: string;
  email: string;
  websiteUrl: string;
  phoneNumber?: string;
  specifics?: string;
  honeypot?: string;
  source: 'website-audit';
};

export function AuditForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<AuditFormValues>({
    resolver: zodResolver(auditFormSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: createDefaultFormValues(),
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

  const clearToast = useCallback(() => {
    setToast(null);
  }, []);

  const submitAudit = useCallback(async (payload: AuditApiPayload) => {
    const apiBaseUrl = getApiBaseUrl();
    const auditEndpointOverride = process.env.NEXT_PUBLIC_AUDIT_ENDPOINT?.trim();
    const auditEndpoint =
      auditEndpointOverride && auditEndpointOverride.length > 0
        ? auditEndpointOverride
        : apiBaseUrl
          ? `${apiBaseUrl.replace(/\/$/, '')}/api/audit`
          : '/api/audit';
    const response = await fetch(auditEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorMessage = 'Unable to submit audit request.';
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
        console.error('Unable to read audit submission error response', bodyReadError);
      }

      const error = new Error(errorMessage) as AuditSubmissionError;
      error.status = response.status;
      error.supportEmail = supportEmail;
      error.subjectLine = subjectLine;
      throw error;
    }
  }, []);

  const onSubmit = useCallback(
    async (values: AuditFormValues) => {
      clearToast();
      const { honeypot, name, email, websiteUrl, phoneNumber, specifics } = values;

      if (honeypot && honeypot.length > 0) {
        setToast({
          type: 'success',
          message: 'Thanks! We will start your audit shortly.',
        });
        throttleSubmission();
        reset(createDefaultFormValues());
        return;
      }

      try {
        const payload: AuditApiPayload = {
          name,
          email,
          websiteUrl,
          phoneNumber: phoneNumber?.trim() ? phoneNumber.trim() : undefined,
          specifics: specifics?.trim() ? specifics.trim() : undefined,
          honeypot: honeypot ?? '',
          source: 'website-audit',
        };

        await submitAudit(payload);
        reset(createDefaultFormValues());
        setToast({
          type: 'success',
          message: "Thanks! We'll send your audit findings within 2-3 business days.",
        });
      } catch (error) {
        console.error(error);
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
            ? (error as AuditSubmissionError).supportEmail
            : undefined;
        const subjectLine =
          typeof error === 'object' && error !== null
            ? (error as AuditSubmissionError).subjectLine
            : undefined;

        setToast({
          type: 'error',
          message: formatMessageWithEmailLink(message, supportEmail, subjectLine),
        });
      } finally {
        throttleSubmission();
      }
    },
    [clearToast, reset, submitAudit, throttleSubmission],
  );

  const cooldownLabel = useMemo(() => {
    if (!isCoolingDown) return null;
    const seconds = Math.ceil(cooldownMs / 1000);
    return `Please wait ${seconds}s before submitting again.`;
  }, [cooldownMs, isCoolingDown]);

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      {toast && (
        <div
          role="status"
          className="bg-[var(--pv-surface)]/80 flex items-start gap-3 rounded-xl border border-[var(--pv-border)] p-4 text-sm text-[var(--pv-text)] shadow-sm"
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 text-[var(--pv-success)]" aria-hidden />
          ) : (
            <AlertCircle className="h-5 w-5 text-[var(--pv-danger)]" aria-hidden />
          )}
          <div className="space-y-1">
            <p>{toast.message}</p>
            <button
              type="button"
              className="text-xs font-medium text-[var(--pv-primary)] underline underline-offset-4"
              onClick={() => setToast(null)}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="audit-name"
            className="text-sm font-medium text-[var(--pv-text)] dark:text-white"
          >
            Name *
          </label>
          <Input
            id="audit-name"
            placeholder="Your name"
            autoComplete="name"
            aria-invalid={errors.name ? 'true' : 'false'}
            aria-describedby={errors.name ? 'audit-name-error' : undefined}
            {...register('name')}
            disabled={isSubmitting || isCoolingDown}
          />
          {errors.name && (
            <p id="audit-name-error" className="text-sm text-[var(--pv-danger)]">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="audit-email"
            className="text-sm font-medium text-[var(--pv-text)] dark:text-white"
          >
            Email *
          </label>
          <Input
            id="audit-email"
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'audit-email-error' : undefined}
            {...register('email')}
            disabled={isSubmitting || isCoolingDown}
          />
          {errors.email && (
            <p id="audit-email-error" className="text-sm text-[var(--pv-danger)]">
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-[1.2fr_0.8fr]">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="audit-website"
            className="text-sm font-medium text-[var(--pv-text)] dark:text-white"
          >
            Website URL *
          </label>
          <Input
            id="audit-website"
            type="text"
            placeholder="www.example.com"
            autoComplete="url"
            aria-invalid={errors.websiteUrl ? 'true' : 'false'}
            aria-describedby={errors.websiteUrl ? 'audit-website-error' : undefined}
            {...register('websiteUrl')}
            disabled={isSubmitting || isCoolingDown}
          />
          {errors.websiteUrl && (
            <p id="audit-website-error" className="text-sm text-[var(--pv-danger)]">
              {errors.websiteUrl.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="audit-phone"
            className="text-sm font-medium text-[var(--pv-text)] dark:text-white"
          >
            Phone (optional)
          </label>
          <Input
            id="audit-phone"
            type="tel"
            placeholder="+1 (555) 555-5555"
            autoComplete="tel"
            aria-invalid={errors.phoneNumber ? 'true' : 'false'}
            aria-describedby={errors.phoneNumber ? 'audit-phone-error' : undefined}
            {...register('phoneNumber')}
            disabled={isSubmitting || isCoolingDown}
          />
          {errors.phoneNumber && (
            <p id="audit-phone-error" className="text-sm text-[var(--pv-danger)]">
              {errors.phoneNumber.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="audit-specifics"
          className="text-sm font-medium text-[var(--pv-text)] dark:text-white"
        >
          Specifics to Review (optional)
        </label>
        <Textarea
          id="audit-specifics"
          placeholder="Let us know what you want us to focus on — pages, funnels, metrics, etc."
          minLength={0}
          rows={5}
          aria-invalid={errors.specifics ? 'true' : 'false'}
          aria-describedby={errors.specifics ? 'audit-specifics-error' : undefined}
          {...register('specifics')}
          disabled={isSubmitting || isCoolingDown}
        />
        {errors.specifics && (
          <p id="audit-specifics-error" className="text-sm text-[var(--pv-danger)]">
            {errors.specifics.message}
          </p>
        )}
      </div>

      <div className="sr-only" aria-hidden>
        <label htmlFor="audit-company">Company</label>
        <input id="audit-company" tabIndex={-1} autoComplete="off" {...register('honeypot')} />
      </div>

      <div className="space-y-3">
        <Button
          type="submit"
          size="lg"
          variant="cta"
          className="w-full"
          disabled={isSubmitting || isCoolingDown || !isValid}
        >
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Sending...
            </span>
          ) : (
            'Request Free Audit'
          )}
        </Button>
        <p className="text-center text-sm text-[var(--pv-text-muted)]">
          No commitment. Please allow up to 3 business days.
        </p>
        {cooldownLabel && (
          <p className="text-center text-xs text-[var(--pv-text-muted)]">{cooldownLabel}</p>
        )}
      </div>
    </form>
  );
}

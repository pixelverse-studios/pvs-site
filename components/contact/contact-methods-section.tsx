'use client';

import { Mail, Phone, Send } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function ContactMethodsSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      // Placeholder: replace with API integration
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSubmitted(true);
      event.currentTarget.reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 md:py-24">
      <Container className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="relative rounded-[1.5rem] bg-[var(--pv-gradient)] p-[1px] shadow-[0_30px_70px_-45px_rgba(63,0,233,0.75)]">
            <Card className="h-full rounded-[1.45rem] bg-[var(--pv-bg)]/98 p-6 dark:bg-[var(--pv-surface)]/95">
              <CardHeader className="flex flex-row items-start gap-3">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--pv-primary),var(--pv-primary-2))] text-white shadow-[0_20px_40px_-30px_rgba(63,0,233,0.75)]">
                  <Send className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <CardTitle>Fill out the form</CardTitle>
                  <CardDescription>We&apos;ll respond within 24–48 hours.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="flex flex-col gap-2 text-sm font-medium text-[var(--pv-text)] dark:text-white">
                      Name
                      <Input name="name" placeholder="Your name" required disabled={isSubmitting} />
                    </label>
                    <label className="flex flex-col gap-2 text-sm font-medium text-[var(--pv-text)] dark:text-white">
                      Email
                      <Input
                        type="email"
                        name="email"
                        placeholder="you@company.com"
                        required
                        disabled={isSubmitting}
                      />
                    </label>
                  </div>
                  <label className="flex flex-col gap-2 text-sm font-medium text-[var(--pv-text)] dark:text-white">
                    Project details
                    <Textarea
                      name="details"
                      placeholder="Tell us about your project goals, timeline, or challenges."
                      rows={5}
                      required
                      disabled={isSubmitting}
                    />
                  </label>
                  <Button type="submit" variant="cta" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                  {submitted && (
                    <p className="text-sm text-[var(--pv-success)]">
                      Thanks! We received your message and will reach out soon.
                    </p>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="space-y-6">
          <Card className="border border-[var(--pv-border)] bg-[var(--pv-surface)]/90 p-6 shadow-pv transition hover:-translate-y-1 hover:border-[var(--pv-primary)] dark:bg-[var(--pv-bg)]/85">
            <CardHeader className="flex flex-row items-start gap-3 p-0">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--pv-gradient)] text-white shadow-[0_18px_34px_-28px_rgba(63,0,233,0.7)]">
                <Mail className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <CardTitle>Email</CardTitle>
                <CardDescription>Prefer email? Reach us directly.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="mt-4 p-0">
              <a
                href="mailto:hello@pixelversestudios.io"
                className="text-base font-medium text-[var(--pv-primary)] hover:text-[var(--pv-primary-2)]"
              >
                hello@pixelversestudios.io
              </a>
            </CardContent>
          </Card>
          <Card className="border border-[var(--pv-border)] bg-[var(--pv-surface)]/90 p-6 shadow-pv transition hover:-translate-y-1 hover:border-[var(--pv-primary)] dark:bg-[var(--pv-bg)]/85">
            <CardHeader className="flex flex-row items-start gap-3 p-0">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--pv-gradient)] text-white shadow-[0_18px_34px_-28px_rgba(63,0,233,0.7)]">
                <Phone className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <CardTitle>Schedule a quick call</CardTitle>
                <CardDescription>Let’s talk and map next steps.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="mt-4 space-y-3 p-0 text-sm text-[var(--pv-text-muted)]">
              <p>Pick a time that works for you and we’ll jump on a quick discovery call.</p>
              <Button asChild size="sm" variant="secondary">
                <a href="https://cal.com/pixelverse" target="_blank" rel="noopener noreferrer">
                  Book a Call
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Container>
    </section>
  );
}

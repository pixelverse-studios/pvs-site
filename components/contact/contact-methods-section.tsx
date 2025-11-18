'use client';

import Link from 'next/link';
import { Mail, Send, Sparkles } from 'lucide-react';

import { ContactForm } from '@/components/contact/ContactForm';
import { ContactInfoCard } from '@/components/contact/contact-info-card';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';

export function ContactMethodsSection() {
  return (
    <section className="py-16 md:py-24">
      <Container className="grid gap-6 md:grid-cols-3">
        <MotionSection as="div" className="md:col-span-2" delay={0.08}>
          <MotionItem
            className="relative rounded-[1.5rem] bg-[var(--pv-gradient)] p-[1px] shadow-[0_30px_70px_-45px_rgba(63,0,233,0.75)]"
            triggerOnViewport={false}
          >
            <Card className="bg-[var(--pv-bg)]/98 dark:bg-[var(--pv-surface)]/95 h-full rounded-[1.45rem] p-6">
              <CardHeader className="flex flex-row items-start gap-3">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--pv-primary),var(--pv-primary-2))] text-white shadow-[0_20px_40px_-30px_rgba(63,0,233,0.75)]">
                  <Send className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <CardTitle>Fill out the form</CardTitle>
                  <CardDescription>We&apos;ll respond within 2-3 business days.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-0 pt-6">
                <ContactForm />
              </CardContent>
            </Card>
          </MotionItem>
        </MotionSection>
        <MotionSection as="div" className="space-y-6" delay={0.12}>
          <MotionItem triggerOnViewport={false}>
            <ContactInfoCard
              icon={<Mail className="h-5 w-5" aria-hidden />}
              title="Email"
              description="Prefer email? Reach us directly."
            >
              <a
                href="mailto:info@pixelversestudios.io"
                className="inline-flex items-center gap-2 text-base font-medium text-[var(--pv-primary)] hover:text-[var(--pv-primary-2)] dark:text-white"
              >
                <Mail className="h-4 w-4" aria-hidden />
                info@pixelversestudios.io
              </a>
            </ContactInfoCard>
          </MotionItem>
          <MotionItem triggerOnViewport={false}>
            <ContactInfoCard
              icon={<Sparkles className="h-5 w-5" aria-hidden />}
              title="Website Audit"
              description="Have a website but not sure how it's performing or what could be improved? We'll provide a personalized review of your site's design, usability, and growth opportunities."
            >
              <Button asChild variant="ctaGhost" className="w-full">
                <Link href="/audit">Request Free Audit</Link>
              </Button>
            </ContactInfoCard>
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}

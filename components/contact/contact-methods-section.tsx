'use client';

import { Mail, MapPin, Phone, Send, Sparkles } from 'lucide-react';

import { ContactForm } from '@/components/contact/ContactForm';
import { ContactInfoCard } from '@/components/contact/contact-info-card';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RequestReviewCta } from '@/components/ui/request-review-cta';
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
              icon={<Phone className="h-5 w-5" aria-hidden />}
              title="Phone"
              description="Call or text us directly."
            >
              <a
                href="tel:+12016381769"
                className="inline-flex items-center gap-2 text-base font-medium text-[var(--pv-primary)] hover:text-[var(--pv-primary-2)] dark:text-white"
              >
                <Phone className="h-4 w-4" aria-hidden />
                (201) 638-1769
              </a>
            </ContactInfoCard>
          </MotionItem>
          <MotionItem triggerOnViewport={false}>
            <ContactInfoCard
              icon={<Sparkles className="h-5 w-5" aria-hidden />}
              title="Website Audit"
              description="Have a website but not sure how it's performing or what could be improved? We'll provide a personalized review of your site's design, usability, and growth opportunities."
            >
              <RequestReviewCta variant="ctaGhost" className="w-full" />
            </ContactInfoCard>
          </MotionItem>
          <MotionItem triggerOnViewport={false}>
            <ContactInfoCard
              icon={<MapPin className="h-5 w-5" aria-hidden />}
              title="Location"
              description="Based in Bergen County, NJ. Serving businesses across North Jersey."
            >
              <address className="mb-3 text-sm not-italic text-[var(--pv-text-muted)]">
                79 Edgewater Road
                <br />
                Cliffside Park, NJ 07010
              </address>
              <div className="overflow-hidden rounded-lg border border-[var(--pv-border)]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3019.8!2d-73.9876!3d40.8215!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2f7a1d4e5f6a7%3A0x1234567890abcdef!2s79%20Edgewater%20Rd%2C%20Cliffside%20Park%2C%20NJ%2007010!5e0!3m2!1sen!2sus!4v1234567890"
                  width="100%"
                  height="150"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="PixelVerse Studios location"
                  className="grayscale transition-all hover:grayscale-0"
                />
              </div>
            </ContactInfoCard>
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}

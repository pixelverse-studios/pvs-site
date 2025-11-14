import { Container } from '@/components/ui/container';
import { SectionHeader } from '@/components/ui/section-header';

import { AuditForm } from './audit-form';

const reminders = [
  'We only need the details listed below to get started.',
  'Audits are manual—expect thoughtful notes, not AI summaries.',
  'If we spot urgent issues, we’ll flag them immediately.',
] as const;

export function AuditFormSection() {
  return (
    <section id="audit-form" className="scroll-mt-32 py-16 md:py-24">
      <Container className="grid gap-10 lg:grid-cols-[0.9fr,1.1fr] lg:items-start">
        <div className="space-y-6">
          <SectionHeader
            eyebrow="Request Your Free Website Audit"
            title="Tell us where to look and we’ll take it from there."
            description="Fill out the form below and our team will review your website within a few business days. You’ll receive a personalized summary highlighting what’s working and where improvements can make a difference."
          />
          <div className="rounded-2xl border border-dashed border-[var(--pv-border)] bg-[var(--pv-surface)]/60 p-6 text-sm text-[var(--pv-text-muted)] shadow-sm">
            <p className="mb-4 font-medium text-[var(--pv-text)]">What to expect</p>
            <ul className="space-y-3">
              {reminders.map((reminder) => (
                <li key={reminder} className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[var(--pv-primary)]" aria-hidden />
                  <span>{reminder}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="rounded-[1.75rem] border border-[var(--pv-border)] bg-[var(--pv-bg)] p-6 shadow-[var(--pv-shadow)] md:p-8">
          <AuditForm />
        </div>
      </Container>
    </section>
  );
}

import Link from 'next/link';

import type { PackageDetail } from '@/data/packages';
import { Button } from '@/components/ui/button';
import { Modal, ModalContent } from '@/components/ui/modal';

export interface PackageModalProps {
  pkg: PackageDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PackageModal({ pkg, open, onOpenChange }: PackageModalProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      {pkg && (
        <ModalContent
          title={pkg.name}
          description={`${pkg.price} · Ideal for ${pkg.ideal}`}
          contentClassName="space-y-6"
          footer={
            <div className="flex w-full flex-col justify-between gap-3 text-sm text-[var(--pv-text-muted)] md:flex-row md:text-base">
              <div>
                <span className="font-semibold text-[var(--pv-text)] dark:text-white">
                  Support cadence:
                </span>{' '}
                {pkg.support.cadence}
              </div>
              <div>
                <span className="font-semibold text-[var(--pv-text)] dark:text-white">
                  Response time:
                </span>{' '}
                {pkg.support.response}
              </div>
            </div>
          }
        >
          <div className="space-y-7">
            <section className="space-y-4">
              <h3 className="text-lg font-semibold text-[var(--pv-text)] dark:text-white">
                What&apos;s included
              </h3>
              <ul className="grid gap-3 text-sm text-[var(--pv-text-muted)] md:grid-cols-2 md:text-base">
                {pkg.includes.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-pv px-2 py-2 text-left transition-colors duration-300"
                  >
                    <span
                      className="mt-2 inline-flex h-2.5 w-2.5 flex-none rounded-full bg-[var(--pv-gradient)] shadow-[0_0_0_4px_rgba(63,0,233,0.18)]"
                      aria-hidden
                    />
                    <span className="text-[var(--pv-text)] dark:text-white">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
            <section className="space-y-3">
              <h3 className="text-lg font-semibold text-[var(--pv-text)] dark:text-white">
                Why it matters
              </h3>
              <p className="text-sm leading-7 text-[var(--pv-text-muted)] md:text-base">
                {pkg.value}
              </p>
            </section>
            <section className="bg-[var(--pv-bg)]/80 dark:bg-[var(--pv-surface)]/70 space-y-3 rounded-pv border border-[var(--pv-border)] px-5 py-4 text-sm text-[var(--pv-text-muted)] shadow-[0_16px_40px_-32px_rgba(63,0,233,0.45)] md:text-base">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--pv-primary)]">
                Next step
              </p>
              <p>
                Ready to explore{' '}
                <span className="font-semibold text-[var(--pv-text)] dark:text-white">
                  {pkg.name}
                </span>{' '}
                for your team? Let&apos;s schedule a discovery call and walk through timelines,
                deliverables, and onboarding.
              </p>
              <div>
                <Button asChild size="sm" variant="secondary">
                  <Link href="/contact">Talk with PixelVerse Studios</Link>
                </Button>
              </div>
            </section>
          </div>
        </ModalContent>
      )}
    </Modal>
  );
}

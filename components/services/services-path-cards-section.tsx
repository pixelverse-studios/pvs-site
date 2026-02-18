import Link from 'next/link';
import { Code, Search, type LucideIcon } from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';
import { servicePaths, type ServicePathIconKey } from '@/data/service-paths';

const iconMap: Record<ServicePathIconKey, LucideIcon> = {
  code: Code,
  search: Search,
};

export function ServicesPathCardsSection() {
  return (
    <section className="bg-[var(--pv-bg)] py-16 md:py-24">
      <Container>
        <MotionSection as="div">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {servicePaths.map((path, idx) => {
              const Icon = iconMap[path.icon];

              return (
                <MotionItem key={path.id} delay={idx * 0.1}>
                  <Card className="group flex h-full flex-col overflow-hidden border-[var(--pv-border)] bg-[var(--pv-surface)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--pv-primary)] hover:shadow-[0_24px_50px_-36px_rgba(63,0,233,0.6)]">
                    <CardHeader className="space-y-4">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--pv-border)] bg-[var(--pv-bg)] text-[var(--pv-primary)] transition-all duration-300 group-hover:border-[var(--pv-primary)] group-hover:bg-[linear-gradient(135deg,var(--pv-primary),var(--pv-primary-2))] group-hover:text-white">
                        <Icon className="h-5 w-5" />
                      </span>
                      <CardTitle className="font-heading text-xl font-semibold md:text-2xl">
                        {path.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="flex flex-1 flex-col gap-4">
                      <p className="text-[0.9375rem] leading-relaxed text-[var(--pv-text-muted)]">
                        {path.description}
                      </p>
                      <p className="text-[0.9375rem] leading-relaxed text-[var(--pv-text-muted)]">
                        {path.body}
                      </p>
                      <div className="mt-auto pt-4">
                        <Link
                          href={path.cta.href}
                          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--pv-primary)] transition-all duration-200 hover:gap-3"
                        >
                          {path.cta.label}
                          <span aria-hidden="true">&rarr;</span>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </MotionItem>
              );
            })}
          </div>
        </MotionSection>
      </Container>
    </section>
  );
}

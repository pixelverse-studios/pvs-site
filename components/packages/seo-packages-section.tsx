"use client";

import { useState } from 'react';
import { BarChart3, LineChart, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { SectionHeader } from '@/components/ui/section-header';
import { seoPackages as seoPackagesData } from '@/data/packages';
import type { PackageDetail } from '@/data/packages';
import { PackageModal } from '@/components/packages/package-modal';

const iconMap = {
  search: Search,
  lineChart: LineChart,
  barChart3: BarChart3
} as const;

export function SeoPackagesSection() {
  const [selectedPackage, setSelectedPackage] = useState<PackageDetail | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpen = (pkg: PackageDetail) => {
    setSelectedPackage(pkg);
    setModalOpen(true);
  };

  const handleOpenChange = (open: boolean) => {
    setModalOpen(open);
    if (!open) {
      setSelectedPackage(null);
    }
  };

  return (
    <section className="py-16 md:py-24">
      <Container className="space-y-10">
        <SectionHeader
          align="center"
          eyebrow="SEO Expansion"
          title="SEO Expansion Packages"
          description="Pair strategic content and technical optimization to expand your footprint and turn organic traffic into leads."
          className="mx-auto max-w-3xl"
        />
        <div className="grid gap-6 md:grid-cols-3">
          {seoPackagesData.map((pkg) => {
            const Icon = iconMap[pkg.icon as keyof typeof iconMap] ?? Search;

            return (
            <Card
                key={pkg.id}
                className="group flex flex-col border border-[var(--pv-border)] bg-[var(--pv-bg)]/95 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--pv-primary)] hover:shadow-[0_26px_60px_-40px_rgba(63,0,233,0.75)] dark:bg-[var(--pv-surface)]/95"
            >
              <CardHeader className="flex flex-row items-start gap-4">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--pv-primary),var(--pv-primary-2))] text-white shadow-[0_22px_46px_-34px_rgba(63,0,233,0.85)]">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <CardTitle>{pkg.name}</CardTitle>
                  <CardDescription>{pkg.summary}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-1 text-sm text-[var(--pv-text-muted)]">
                {pkg.value}
              </CardContent>
              <CardFooter>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  onClick={() => handleOpen(pkg)}
                >
                  Learn More
                </Button>
              </CardFooter>
            </Card>
            );
          })}
        </div>
      </Container>
      <PackageModal pkg={selectedPackage} open={modalOpen} onOpenChange={handleOpenChange} />
    </section>
  );
}

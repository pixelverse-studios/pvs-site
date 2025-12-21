'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, Users } from 'lucide-react';

export function ClientsEmptyState() {
  return (
    <Card>
      <CardContent className="flex min-h-[500px] flex-col items-center justify-center py-16">
        <div className="relative">
          {/* Decorative background circle */}
          <div className="absolute -inset-8 rounded-full bg-[var(--pv-primary)] opacity-5"></div>

          {/* Icon */}
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-[var(--pv-border)] bg-[var(--pv-surface)]">
            <Users className="h-12 w-12 text-[var(--pv-text-muted)]" />
          </div>
        </div>

        {/* Content */}
        <div className="mt-8 max-w-md text-center">
          <h2 className="text-2xl font-semibold text-[var(--pv-text)]">No clients yet</h2>
          <p className="mt-2 text-base text-[var(--pv-text-muted)]">
            Get started by adding your first client to begin tracking projects and relationships.
          </p>
        </div>

        {/* CTA Button */}
        <Button variant="default" size="lg" className="mt-8">
          <UserPlus className="mr-2 h-5 w-5" />
          Add Your First Client
        </Button>

        {/* Helper text */}
        <p className="mt-6 text-sm text-[var(--pv-text-muted)]">
          Or import clients from a CSV file
        </p>
      </CardContent>
    </Card>
  );
}

import { Smartphone } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { DomaniNav } from './components/domani-nav';

export default function DomaniLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb-16 pt-6 lg:pt-8">
      <Container className="max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              }}
            >
              <Smartphone className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1
                className="font-heading text-2xl font-bold md:text-3xl"
                style={{ color: 'var(--pv-text)' }}
              >
                Domani
              </h1>
              <p className="text-sm text-[var(--pv-text-muted)]">
                App analytics and user data
              </p>
            </div>
          </div>
        </div>

        {/* Sub-navigation */}
        <DomaniNav />

        {/* Page content */}
        {children}
      </Container>
    </div>
  );
}

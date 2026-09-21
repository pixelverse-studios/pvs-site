import { Container } from '@/components/ui/container';
import { DomaniNav } from './components/domani-nav';

export default function DomaniLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pt-6 lg:pt-8">
      <Container className="max-w-none">
        {/* Sub-navigation */}
        <DomaniNav />

        {/* Page content */}
        {children}
      </Container>
    </div>
  );
}

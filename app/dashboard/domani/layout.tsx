import { Container } from '@/components/ui/container';
import { DomaniNav } from './components/domani-nav';
import { DomaniLayoutFrame } from './components/domani-layout-frame';

export default function DomaniLayout({ children }: { children: React.ReactNode }) {
  return (
    <DomaniLayoutFrame>
      <Container className="max-w-none">
        {/* Sub-navigation */}
        <DomaniNav />

        {/* Page content */}
        {children}
      </Container>
    </DomaniLayoutFrame>
  );
}

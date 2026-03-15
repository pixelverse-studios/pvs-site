import { Container } from '@/components/ui/container';

interface ServicesHeroSectionProps {
  title: string;
  description: string;
}

export function ServicesHeroSection({
  title,
  description,
}: ServicesHeroSectionProps) {
  const headingId = 'services-hero-title';
  const paragraphs = (description || '')
    .split('\n\n')
    .filter(Boolean);

  return (
    <section
      className="bg-[var(--pv-surface)] pb-16 pt-hero md:pb-24 md:pt-hero"
      aria-labelledby={headingId}
    >
      <Container className="text-center">
        <div className="stagger-children in-view mx-auto max-w-2xl space-y-6">
          <div className="stagger-item">
            <h1
              id={headingId}
              className="font-heading text-4xl font-semibold leading-[3rem] md:text-5xl md:leading-[3.5rem]"
            >
              {title}
            </h1>
          </div>

          {paragraphs.map((paragraph, idx) => (
            <div key={`paragraph-${idx}`} className="stagger-item">
              <p className="text-pretty text-lg text-[var(--pv-text-muted)] md:text-xl">
                {paragraph}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

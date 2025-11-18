import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { SectionHeader } from '@/components/ui/section-header';

const reviewItems = [
  {
    title: 'User Experience (UX)',
    description:
      'Navigation clarity, layout flow, and how easy it is for visitors to find what they need.',
  },
  {
    title: 'Design & Visual Impact',
    description:
      'Brand consistency, readability, and the first impressions your site makes on every device.',
  },
  {
    title: 'SEO & Content',
    description:
      'Visibility fundamentals like page structure, metadata, and how well copy aligns to search intent.',
  },
  {
    title: 'Performance & Accessibility',
    description:
      'Speed, responsiveness, mobile polish, and accessibility cues that keep users (and Google) happy.',
  },
] as const;

export function AuditReviewSection() {
  return (
    <section className="py-16 md:py-24">
      <Container className="space-y-12">
        <SectionHeader
          align="center"
          eyebrow="What We Review"
          title="A clear look at the moments that impact every visitor."
          description="Your audit breaks down the parts of your site that matter most for the visitor experience. Each card turns into its own section with findings and severity ratings that we’ll bring to your attention, with the option to dive deeper into how we can help improve those areas."
        />
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {reviewItems.map((item) => (
            <Card
              key={item.title}
              className="bg-[var(--pv-surface)]/80 h-full rounded-2xl border border-[var(--pv-border)] p-6 shadow-pv"
            >
              <CardHeader className="space-y-3 p-0">
                <CardTitle>{item.title}</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  {item.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}

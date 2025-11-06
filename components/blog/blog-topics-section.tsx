import { BlogPost } from '@/data/blog-posts';

import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';
import { SectionHeader } from '@/components/ui/section-header';

const categoryDescriptions: Record<string, string> = {
  'SEO Strategy':
    'Deep dives on the frameworks we use to uncover intent, structure internal links, and measure organic growth without guesswork.',
  'Design Systems':
    'Component, layout, and accessibility decisions that keep experiences premium while preserving launch velocity.',
  Analytics:
    'Implementation and reporting workflows that give marketing and leadership a real-time view into funnel performance.',
};

interface BlogTopicsSectionProps {
  posts: BlogPost[];
}

export function BlogTopicsSection({ posts }: BlogTopicsSectionProps) {
  if (!posts.length) {
    return null;
  }

  const categoryMeta = Array.from(
    posts.reduce((map, post) => {
      if (map.has(post.category)) {
        const existing = map.get(post.category)!;
        existing.count += 1;
        return map;
      }

      map.set(post.category, {
        name: post.category,
        accentColor: post.accentColor,
        coverGradient: post.coverGradient,
        count: 1,
        description:
          categoryDescriptions[post.category] ??
          'Tactics, templates, and benchmarks we rely on when shipping growth programs for service businesses.',
      });

      return map;
    }, new Map<string, { name: string; accentColor: string; coverGradient: string; count: number; description: string }>()),
  ).map(([, value]) => value);

  return (
    <section className="border-b border-[var(--pv-border)] bg-[var(--pv-surface)]">
      <Container className="py-16 md:py-24">
        <div className="space-y-12">
          <SectionHeader
            eyebrow="Editorial pillars"
            title="What we write about for service brands"
            description="Every article slots into one of our three performance pillars. Start with the pillar that aligns with your next growth priority, then work through the related playbooks."
            align="center"
          />
          <MotionSection
            as="div"
            className="grid gap-8 md:grid-cols-3"
          >
            {categoryMeta.map((category) => (
              <MotionItem
                key={category.name}
                className="flex flex-col gap-6 rounded-3xl border border-[var(--pv-border)] bg-[var(--pv-bg)] p-8 text-left shadow-[0_28px_60px_-40px_rgba(63,0,233,0.25)] transition duration-300 hover:-translate-y-1 hover:border-[rgba(63,0,233,0.35)]"
              >
                <div className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--pv-text-muted)]">
                    {category.count} {category.count === 1 ? 'article' : 'articles'}
                  </p>
                  <h3 className="font-heading text-2xl text-[var(--pv-text)]">{category.name}</h3>
                  <p className="text-base text-[var(--pv-text-muted)]">{category.description}</p>
                </div>
              </MotionItem>
            ))}
          </MotionSection>
        </div>
      </Container>
    </section>
  );
}

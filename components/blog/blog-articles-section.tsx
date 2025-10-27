import Link from 'next/link';

import type { BlogPost } from '@/data/blog-posts';
import { formatBlogDate } from '@/data/blog-posts';

import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';
import { SectionHeader } from '@/components/ui/section-header';

interface BlogArticlesSectionProps {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  posts: BlogPost[];
}

export function BlogArticlesSection({
  id,
  eyebrow,
  title,
  description,
  posts,
}: BlogArticlesSectionProps) {
  if (!posts.length) {
    return null;
  }

  return (
    <section id={id} className="border-b border-[var(--pv-border)] bg-[var(--pv-bg)]">
      <Container className="py-16 md:py-24">
        <div className="space-y-12">
          <SectionHeader eyebrow={eyebrow} title={title} description={description} align="left" />
          <MotionSection
            as="ul"
            className="grid gap-8 md:grid-cols-2 xl:grid-cols-3"
          >
            {posts.map((post) => {
              const postUrl = `/blog/${post.slug}`;

              return (
                <MotionItem
                  key={post.slug}
                  as="li"
                  className="group h-full list-none"
                >
                  <Link href={postUrl} className="block h-full">
                    <article className="relative flex h-full flex-col gap-6 overflow-hidden rounded-3xl border border-[var(--pv-border)] bg-[var(--pv-surface)] p-7 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[rgba(63,0,233,0.35)] hover:shadow-[0_32px_64px_-40px_rgba(63,0,233,0.45)]">
                      <div
                        aria-hidden
                        className="h-40 w-full rounded-2xl border border-[rgba(63,0,233,0.18)]"
                        style={{ background: post.coverGradient }}
                      />
                      <div className="space-y-4">
                        <span className="inline-flex items-center rounded-full border border-[var(--pv-border)] bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--pv-text-muted)] dark:bg-white/5 dark:text-white/70">
                          {post.category}
                        </span>
                        <h3 className="font-heading text-2xl leading-snug text-[var(--pv-text)]">
                          {post.title}
                        </h3>
                        <p className="text-base text-[var(--pv-text-muted)]">{post.excerpt}</p>
                      </div>
                      <div className="mt-auto flex items-center justify-between text-sm text-[var(--pv-text-muted)]">
                        <span>{formatBlogDate(post.publishedAt)}</span>
                        <span>{post.readingMinutes} min read</span>
                      </div>
                      <div className="pt-4">
                        <span className="group/button inline-flex items-center gap-2 text-sm font-semibold text-[var(--pv-primary)] transition-colors duration-200">
                          Read article
                          <span
                            aria-hidden
                            className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-[var(--pv-border)] transition-transform duration-200 group-hover/button:translate-x-1"
                          >
                            -&gt;
                          </span>
                        </span>
                      </div>
                    </article>
                  </Link>
                </MotionItem>
              );
            })}
          </MotionSection>
        </div>
      </Container>
    </section>
  );
}

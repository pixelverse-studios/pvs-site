import Link from 'next/link';

import { BlogPost, formatBlogDate } from '@/data/blog-posts';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';

interface BlogFeaturedPostSectionProps {
  post?: BlogPost;
}

export function BlogFeaturedPostSection({ post }: BlogFeaturedPostSectionProps) {
  if (!post) {
    return null;
  }

  const postUrl = `/blog/${post.slug}`;

  return (
    <section className="border-b border-[var(--pv-border)] bg-[var(--pv-bg)]">
      <Container className="py-16 md:py-24">
        <MotionSection as="div">
          <MotionItem
            as="article"
            className="relative overflow-hidden rounded-[36px] border border-[rgba(63,0,233,0.16)] bg-white shadow-[0_48px_110px_-60px_rgba(63,0,233,0.55)] dark:bg-[color:var(--pv-overlay-soft)]"
          >
            <div
              aria-hidden
              className="absolute inset-0 opacity-95"
              style={{
                background: post.coverGradient,
              }}
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(160deg,rgba(8,6,32,0.82)_0%,rgba(8,6,32,0.68)_45%,rgba(8,6,32,0.55)_100%)]"
            />
            <div className="relative z-10 flex flex-col gap-10 p-8 text-white sm:gap-12 sm:p-10 md:p-16">
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.26em] text-white/80">
                <span className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-3 py-1">
                  Featured Post
                </span>
                <span>{post.category}</span>
              </div>
              <div className="grid grid-cols-1 gap-10 md:items-start lg:grid-cols-2">
                <div className="text-shadow-md space-y-6 sm:[text-shadow:none]">
                  <h2 className="font-heading text-[2.25rem] font-semibold leading-[2.75rem] text-white sm:text-[2.5rem] sm:leading-[3rem] md:text-[3rem] md:leading-[3.25rem]">
                    {post.title}
                  </h2>
                  <p className="text-base text-white/90 sm:text-lg md:text-xl">{post.excerpt}</p>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-white/80">
                    <span>
                      {formatBlogDate(post.publishedAt)} | {post.readingMinutes} min read
                    </span>
                    <span>{post.author.name}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-6 rounded-[28px] border border-white/45 bg-white p-6 text-left text-[var(--pv-text)] shadow-[0_28px_72px_-40px_rgba(63,0,233,0.55)] dark:border-white/15 dark:bg-[color:var(--pv-surface)] dark:text-white sm:p-7 md:p-8">
                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:rgba(17,17,17,0.72)] dark:text-white/70">
                      Key takeaways
                    </p>
                    {post.highlights && post.highlights.length > 0 ? (
                      <ul className="space-y-3 text-base text-[var(--pv-text)] dark:text-white/85">
                        {post.highlights.map((highlight, index) => (
                          <li key={index} className="relative pl-5">
                            <span
                              aria-hidden
                              className="absolute left-0 top-2 h-2 w-2 rounded-full bg-[var(--pv-primary)]"
                            />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-base text-[var(--pv-text)] dark:text-white/85">
                        A quick read on the systems PixelVerse uses to ship campaigns that convert.
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {post.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="border-[rgba(63,0,233,0.25)] bg-white/70 text-[var(--pv-primary)] dark:bg-white/10 dark:text-white"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-col gap-4 text-sm text-[var(--pv-text-muted)] dark:text-white/70">
                    <p>Updated {formatBlogDate(post.updatedAt ?? post.publishedAt)}</p>
                    <p>
                      {post.author.name}
                      {post.author.role ? ` | ${post.author.role}` : ''}
                    </p>
                  </div>
                  <Button asChild variant="cta" className="w-full sm:w-auto">
                    <Link href={postUrl}>Read the article</Link>
                  </Button>
                </div>
              </div>
            </div>
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}

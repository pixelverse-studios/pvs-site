import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import {
  formatBlogDate,
  getBlogPostBySlug,
  getBlogPosts,
  getBlogPostsExcluding,
  type BlogPost,
} from '@/data/blog-posts';
import { BlogArticlesSection } from '@/components/blog/blog-articles-section';
import { Badge } from '@/components/ui/badge';
import { Container } from '@/components/ui/container';
import { StructuredData } from '@/components/ui/structured-data';
import { createPageMetadata, sharedMetadata } from '@/lib/metadata';
import { createBreadcrumbSchema } from '@/lib/structured-data';

type Params = {
  slug: string;
};

export function generateStaticParams() {
  return getBlogPosts().map((post) => ({
    slug: post.slug,
  }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    return {};
  }

  return createPageMetadata({
    title: `${post.title}`,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    keywords: [...post.tags, post.category, 'PixelVerse Studios blog'],
  });
}

function renderContent(block: BlogPost['content'][number], index: number) {
  switch (block.type) {
    case 'heading':
      return (
        <h2
          key={`heading-${index}`}
          className="font-heading text-3xl font-semibold text-[var(--pv-text)] md:text-[2.15rem]"
        >
          {block.content}
        </h2>
      );
    case 'paragraph':
      return (
        <p key={`paragraph-${index}`} className="text-lg leading-8 text-[var(--pv-text-muted)]">
          {block.content}
        </p>
      );
    case 'list': {
      const Element = block.ordered ? 'ol' : 'ul';
      const listClass = block.ordered ? 'list-decimal' : 'list-disc';
      return (
        <Element
          key={`list-${index}`}
          className={`ml-5 ${listClass} space-y-3 text-lg text-[var(--pv-text-muted)] marker:text-[var(--pv-primary)]`}
        >
          {block.items.map((item, itemIndex) => (
            <li key={itemIndex}>{item}</li>
          ))}
        </Element>
      );
    }
    case 'quote':
      return (
        <figure
          key={`quote-${index}`}
          className="border-l-4 border-[rgba(63,0,233,0.35)] bg-[var(--pv-surface)] p-6 text-lg italic text-[var(--pv-text)]"
        >
          <blockquote>{block.content}</blockquote>
          {block.attribution && (
            <figcaption className="mt-4 text-sm font-medium text-[var(--pv-text-muted)]">
              - {block.attribution}
            </figcaption>
          )}
        </figure>
      );
    default:
      return null;
  }
}

export default function BlogPostPage({ params }: { params: Params }) {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getBlogPostsExcluding(post.slug).slice(0, 3);

  // Breadcrumb: Home > Blog > [Post Title]
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: post.title, path: `/blog/${post.slug}` },
  ]);

  const blogPostSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    inLanguage: 'en-US',
    url: `${sharedMetadata.siteUrl}/blog/${post.slug}`,
    author: {
      '@type': 'Organization',
      name: post.author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: sharedMetadata.siteName,
      url: sharedMetadata.siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: sharedMetadata.logo.light,
      },
    },
    articleSection: post.category,
  };

  // FAQPage schema for posts with FAQ content
  const faqSchema = post.faqs?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: post.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      }
    : null;

  return (
    <main>
      <article>
        <section className="border-b border-[var(--pv-border)] bg-[var(--pv-surface)] pt-hero">
          <Container className="py-16 md:py-24">
            <div className="mx-auto flex max-w-3xl flex-col gap-6">
              <Link
                href="/blog"
                className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-[var(--pv-primary)] transition-transform duration-200 hover:-translate-y-0.5"
              >
                {'<'} Back to all posts
              </Link>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <Badge variant="outline" className="text-xs uppercase tracking-[0.24em]">
                  {post.category}
                </Badge>
                <span className="text-sm text-[var(--pv-text-muted)]">
                  {formatBlogDate(post.publishedAt)} | {post.readingMinutes} min read
                </span>
              </div>
              <h1 className="font-heading text-4xl font-semibold leading-tight text-[var(--pv-text)] md:text-[3.25rem] md:leading-[3.5rem]">
                {post.title}
              </h1>
              <p className="text-lg text-[var(--pv-text-muted)]">{post.excerpt}</p>
            </div>
          </Container>
        </section>
        <section className="border-b border-[var(--pv-border)] bg-[var(--pv-bg)]">
          <Container className="py-16 md:py-24">
            <div className="mx-auto max-w-3xl space-y-10">
              {post.content.map((block, index) => renderContent(block, index))}
            </div>
            <div className="mx-auto mt-16 flex max-w-3xl flex-wrap items-center gap-3">
              {post.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="border-[rgba(63,0,233,0.25)] bg-white/60 text-sm"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          </Container>
        </section>
      </article>
      <BlogArticlesSection
        eyebrow="More to explore"
        title="Related reads from PixelVerse Studios"
        description="Keep the momentum going with more breakdowns from recent launches, audits, and experiments."
        posts={relatedPosts}
      />
      <StructuredData id={`pixelverse-blog-post-${post.slug}`} data={blogPostSchema} />
      <StructuredData id={`breadcrumb-blog-${post.slug}`} data={breadcrumbSchema} />
      {faqSchema && <StructuredData id={`faq-blog-${post.slug}`} data={faqSchema} />}
    </main>
  );
}

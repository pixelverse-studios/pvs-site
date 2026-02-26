import type { Metadata } from 'next';

import { BlogArticlesSection } from '@/components/blog/blog-articles-section';
import { BlogCtaSection } from '@/components/blog/blog-cta-section';
import { BlogFeaturedPostSection } from '@/components/blog/blog-featured-post-section';
import { BlogHeroSection } from '@/components/blog/blog-hero-section';
import { BlogTopicsSection } from '@/components/blog/blog-topics-section';
import { getBlogPosts, getFeaturedBlogPost } from '@/data/blog-posts';
import { StructuredData } from '@/components/ui/structured-data';
import { createPageMetadata, sharedMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Web Design & SEO Insights | Pixelverse Studios Blog',
  description:
    'Expert insights on web design, development, and local SEO for New Jersey businesses. Practical strategies and ideas from the Pixelverse Studios team.',
  path: '/blog',
  keywords: [
    'PixelVerse blog',
    'web design insights',
    'SEO playbooks',
    'analytics best practices',
    'service brand marketing',
  ],
});

export default function BlogPage() {
  const posts = getBlogPosts();
  const featuredPost = getFeaturedBlogPost();
  const remainingPosts = featuredPost
    ? posts.filter((post) => post.slug !== featuredPost.slug)
    : posts;

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'PixelVerse Studios Insights',
    description:
      'Insights, playbooks, and launch checklists from the PixelVerse Studios team on custom web design, SEO, and analytics.',
    url: `${sharedMetadata.siteUrl}/blog`,
    publisher: {
      '@type': 'Organization',
      name: sharedMetadata.siteName,
      url: sharedMetadata.siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: sharedMetadata.logo.light,
      },
    },
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      url: `${sharedMetadata.siteUrl}/blog/${post.slug}`,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt ?? post.publishedAt,
      author: {
        '@type': 'Organization',
        name: sharedMetadata.siteName,
      },
      inLanguage: 'en-US',
    })),
  };

  return (
    <main>
      <BlogHeroSection />
      <BlogFeaturedPostSection post={featuredPost} />
      <BlogArticlesSection
        id="latest"
        eyebrow="Latest Posts"
        title="Fresh perspectives on design, code, and the web itself"
        description="Explore the latest from the PixelVerse team—insights, discussions, and lessons that make sense of how modern websites are built, optimized, and scaled."
        posts={remainingPosts}
      />
      {/* Temporarily hidden at user request */}
      {/* <BlogTopicsSection posts={posts} /> */}
      <BlogCtaSection />
      <StructuredData id="pixelverse-blog-schema" data={blogSchema} />
    </main>
  );
}

import { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { DocHeader } from '../components/doc-header';
import { Callout } from '../components/callout';
import { ChecklistSection } from '../components/checklist-section';
import { ChecklistItemStatic } from '../components/checklist-item';
import { TableOfContents } from '../components/table-of-contents';

export const metadata: Metadata = {
  title: 'Blog Guidelines | Documentation | PixelVerse Studios',
  description:
    'Standards for creating SEO-optimized, engaging blog content that drives organic traffic and conversions.',
  robots: { index: false, follow: false },
};

const tocItems = [
  { id: 'strategy', title: 'Content Strategy', level: 2 },
  { id: 'writing', title: 'Writing Standards', level: 2 },
  { id: 'technical', title: 'Technical Requirements', level: 2 },
  { id: 'seo-checklist', title: 'SEO Checklist Per Post', level: 2 },
  { id: 'measurement', title: 'Performance Measurement', level: 2 },
  { id: 'templates', title: 'Content Templates', level: 2 },
  { id: 'quality', title: 'Quality Standards', level: 2 },
];

export default function BlogGuidelinesPage() {
  return (
    <main className="pb-16 pt-8 md:pb-24">
      <Container className="max-w-6xl">
        <div className="lg:grid lg:grid-cols-[1fr_240px] lg:gap-8">
          {/* Main content */}
          <div>
            <DocHeader
              title="Blog Content Guidelines"
              description="Standards for creating SEO-optimized, engaging blog content that drives organic traffic and conversions."
              lastUpdated="Dec 2024"
              readTime="10 min"
            />

            <div className="space-y-8">
              {/* Content Strategy */}
              <section id="strategy">
                <SectionHeading>Content Strategy Fundamentals</SectionHeading>

                <ChecklistSection title="Keyword Foundation" itemCount={5}>
                  <div className="space-y-1">
                    <ChecklistItemStatic priority="critical">
                      Anchor every post to <strong>one primary keyword cluster</strong>
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="critical">
                      Write a unique title tag (55-60 characters)
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="critical">
                      Write a meta description (&lt;=160 characters)
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="high">
                      Craft an H1 that mirrors user intent
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="high">
                      Include the primary keyword in the first 100 words
                    </ChecklistItemStatic>
                  </div>
                </ChecklistSection>

                <div className="mt-4">
                  <ChecklistSection title="Content Structure" itemCount={5}>
                    <div className="space-y-1">
                      <ChecklistItemStatic priority="high">
                        <strong>Lead with intent</strong>: Open with what the reader came for
                      </ChecklistItemStatic>
                      <ChecklistItemStatic priority="high">
                        Use descriptive H2/H3 subheadings
                      </ChecklistItemStatic>
                      <ChecklistItemStatic>
                        Keep paragraphs short (2-4 sentences max)
                      </ChecklistItemStatic>
                      <ChecklistItemStatic>
                        Use bullet points and numbered lists liberally
                      </ChecklistItemStatic>
                      <ChecklistItemStatic>
                        Add jump links for articles over 1,500 words
                      </ChecklistItemStatic>
                    </div>
                  </ChecklistSection>
                </div>
              </section>

              {/* Writing Standards */}
              <section id="writing">
                <SectionHeading>Writing Standards</SectionHeading>

                <ChecklistSection title="Hook & Engagement" itemCount={4}>
                  <div className="space-y-1">
                    <ChecklistItemStatic priority="critical">
                      Hook readers in the <strong>first 100 words</strong> with a compelling promise
                      or problem statement
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="high">
                      Address the reader directly (&quot;you&quot; language)
                    </ChecklistItemStatic>
                    <ChecklistItemStatic>
                      Use specific numbers and data points where possible
                    </ChecklistItemStatic>
                    <ChecklistItemStatic>
                      Break up text with visuals every 300-400 words
                    </ChecklistItemStatic>
                  </div>
                </ChecklistSection>

                <div className="mt-4">
                  <ChecklistSection title="Depth & Authority" itemCount={4}>
                    <div className="space-y-1">
                      <ChecklistItemStatic priority="high">
                        Deliver <strong>original insights</strong> not found in competitor content
                      </ChecklistItemStatic>
                      <ChecklistItemStatic priority="high">
                        Include trustworthy data with citations
                      </ChecklistItemStatic>
                      <ChecklistItemStatic>
                        Add supporting media (images, charts, embedded videos)
                      </ChecklistItemStatic>
                      <ChecklistItemStatic priority="high">
                        Aim to outclass competing search results in comprehensiveness
                      </ChecklistItemStatic>
                    </div>
                  </ChecklistSection>
                </div>

                <div className="mt-4">
                  <ChecklistSection title="Internal Linking" itemCount={3}>
                    <div className="space-y-1">
                      <ChecklistItemStatic priority="high">
                        Weave internal links every ~250 words
                      </ChecklistItemStatic>
                      <ChecklistItemStatic priority="high">
                        Link to related service pages, other blog posts, and key conversion pages
                      </ChecklistItemStatic>
                      <ChecklistItemStatic priority="critical">
                        Use descriptive anchor text (not &quot;click here&quot;)
                      </ChecklistItemStatic>
                    </div>
                  </ChecklistSection>
                </div>

                <div className="mt-4">
                  <ChecklistSection title="Calls to Action" itemCount={3}>
                    <div className="space-y-1">
                      <ChecklistItemStatic priority="high">
                        Surface in-article CTAs naturally within the content
                      </ChecklistItemStatic>
                      <ChecklistItemStatic priority="critical">
                        Close with a <strong>concrete next step</strong> (contact, download, related
                        read)
                      </ChecklistItemStatic>
                      <ChecklistItemStatic>
                        Don&apos;t be pushy - make CTAs feel like helpful suggestions
                      </ChecklistItemStatic>
                    </div>
                  </ChecklistSection>
                </div>
              </section>

              {/* Technical Requirements */}
              <section id="technical">
                <SectionHeading>Technical Requirements</SectionHeading>

                <ChecklistSection title="Media Optimization" itemCount={4}>
                  <div className="space-y-1">
                    <ChecklistItemStatic priority="critical">
                      <strong>Compress all images</strong> before upload
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="high">
                      Use WebP format when possible
                    </ChecklistItemStatic>
                    <ChecklistItemStatic>
                      Implement lazy-loading for images below the fold
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="high">
                      Add descriptive alt text to all images
                    </ChecklistItemStatic>
                  </div>
                </ChecklistSection>

                <div className="mt-4">
                  <ChecklistSection title="Mobile Experience" itemCount={3}>
                    <div className="space-y-1">
                      <ChecklistItemStatic priority="high">
                        Test readability on mobile devices
                      </ChecklistItemStatic>
                      <ChecklistItemStatic>Ensure tap targets are accessible</ChecklistItemStatic>
                      <ChecklistItemStatic>
                        Check that images don&apos;t break layout on small screens
                      </ChecklistItemStatic>
                    </div>
                  </ChecklistSection>
                </div>

                <div className="mt-4">
                  <ChecklistSection title="Schema Markup" itemCount={3}>
                    <div className="space-y-1">
                      <ChecklistItemStatic priority="critical">
                        Add <strong>Article schema</strong> to all blog posts
                      </ChecklistItemStatic>
                      <ChecklistItemStatic priority="high">
                        Include <strong>FAQ schema</strong> when posts contain Q&A sections
                      </ChecklistItemStatic>
                      <ChecklistItemStatic>
                        Validate schema with Google Rich Results Test
                      </ChecklistItemStatic>
                    </div>
                  </ChecklistSection>
                </div>
              </section>

              {/* SEO Checklist Per Post */}
              <section id="seo-checklist">
                <SectionHeading>SEO Checklist Per Post</SectionHeading>
                <Callout type="info" title="Before Publishing">
                  Verify all items before hitting publish to maximize organic reach.
                </Callout>
                <ChecklistSection title="Pre-Publish Verification" itemCount={11}>
                  <div className="space-y-1">
                    <ChecklistItemStatic priority="critical">
                      Unique title tag (55-60 characters) with primary keyword
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="critical">
                      Meta description (&lt;=160 characters) with primary keyword
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="critical">
                      Single H1 matching the title/intent
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="high">
                      Primary keyword in first 100 words
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="high">
                      Descriptive H2/H3 subheadings with related keywords
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="high">
                      Alt text on all images
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="high">
                      Internal links to 3+ related pages
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="high">
                      At least one CTA in the content
                    </ChecklistItemStatic>
                    <ChecklistItemStatic>Article schema implemented</ChecklistItemStatic>
                    <ChecklistItemStatic>Mobile-friendly formatting</ChecklistItemStatic>
                    <ChecklistItemStatic>Images compressed and lazy-loaded</ChecklistItemStatic>
                  </div>
                </ChecklistSection>
              </section>

              {/* Performance Measurement */}
              <section id="measurement">
                <SectionHeading>Performance Measurement</SectionHeading>

                <ChecklistSection title="Quarterly Review Process" itemCount={4}>
                  <div className="space-y-1">
                    <ChecklistItemStatic priority="high">
                      Review Search Console queries driving traffic to each post
                    </ChecklistItemStatic>
                    <ChecklistItemStatic>Analyze scroll depth and time on page</ChecklistItemStatic>
                    <ChecklistItemStatic priority="high">
                      Track CTA click-through rates
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="high">
                      Identify posts with declining traffic
                    </ChecklistItemStatic>
                  </div>
                </ChecklistSection>

                <div className="mt-4">
                  <ChecklistSection title="Iteration Actions" itemCount={5}>
                    <div className="space-y-1">
                      <ChecklistItemStatic priority="high">
                        Update outdated statistics and references
                      </ChecklistItemStatic>
                      <ChecklistItemStatic priority="high">
                        Refresh meta descriptions based on CTR data
                      </ChecklistItemStatic>
                      <ChecklistItemStatic>
                        Add new internal links to recently published content
                      </ChecklistItemStatic>
                      <ChecklistItemStatic>
                        Expand thin sections that users scroll past quickly
                      </ChecklistItemStatic>
                      <ChecklistItemStatic priority="high">
                        Update publication date when making significant changes
                      </ChecklistItemStatic>
                    </div>
                  </ChecklistSection>
                </div>
              </section>

              {/* Templates */}
              <section id="templates">
                <SectionHeading>Content Templates</SectionHeading>

                <div
                  className="overflow-hidden rounded-xl border"
                  style={{
                    background: 'var(--pv-surface)',
                    borderColor: 'var(--pv-border)',
                  }}
                >
                  <div className="border-b p-4" style={{ borderColor: 'var(--pv-border)' }}>
                    <h3 className="font-semibold" style={{ color: 'var(--pv-text)' }}>
                      Standard Blog Post Structure
                    </h3>
                  </div>
                  <div className="p-4">
                    <pre
                      className="overflow-x-auto rounded-lg p-4 text-sm"
                      style={{
                        background: 'rgba(63, 0, 233, 0.05)',
                        color: 'var(--pv-text)',
                        fontFamily: 'ui-monospace, monospace',
                      }}
                    >
                      {`# [H1: Primary Keyword + Benefit]

[Opening paragraph: Hook + promise + primary keyword]

## [H2: First Major Section]
[Content with internal link]

## [H2: Second Major Section]
[Content with image/visual]

### [H3: Subsection if needed]
[Detailed content]

## [H2: Practical Application/How-To]
[Actionable steps or tips]

## [H2: Conclusion/Key Takeaways]
[Summary + CTA]`}
                    </pre>
                  </div>
                </div>

                <div
                  className="mt-4 overflow-hidden rounded-xl border"
                  style={{
                    background: 'var(--pv-surface)',
                    borderColor: 'var(--pv-border)',
                  }}
                >
                  <div className="border-b p-4" style={{ borderColor: 'var(--pv-border)' }}>
                    <h3 className="font-semibold" style={{ color: 'var(--pv-text)' }}>
                      FAQ Section Template
                    </h3>
                  </div>
                  <div className="p-4">
                    <pre
                      className="overflow-x-auto rounded-lg p-4 text-sm"
                      style={{
                        background: 'rgba(63, 0, 233, 0.05)',
                        color: 'var(--pv-text)',
                        fontFamily: 'ui-monospace, monospace',
                      }}
                    >
                      {`## Frequently Asked Questions

### [Question 1]?
[Concise answer - 2-3 sentences]

### [Question 2]?
[Concise answer - 2-3 sentences]

### [Question 3]?
[Concise answer - 2-3 sentences]`}
                    </pre>
                  </div>
                </div>
              </section>

              {/* Quality Standards */}
              <section id="quality">
                <SectionHeading>Quality Standards</SectionHeading>

                <ChecklistSection title="Minimum Requirements" itemCount={4}>
                  <div className="space-y-1">
                    <ChecklistItemStatic priority="critical">
                      Word count: <strong>800+ words</strong> for standard posts,{' '}
                      <strong>1,500+</strong> for pillar content
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="high">
                      Reading level: 8th grade or below (use Hemingway Editor)
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="critical">
                      Unique content: 0% plagiarism (verify with Copyscape or similar)
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="critical">
                      Factual accuracy: All claims must be verifiable
                    </ChecklistItemStatic>
                  </div>
                </ChecklistSection>

                <div className="mt-4">
                  <ChecklistSection title="Formatting Rules" itemCount={5}>
                    <div className="space-y-1">
                      <ChecklistItemStatic>Use sentence case for headings</ChecklistItemStatic>
                      <ChecklistItemStatic>One space after periods</ChecklistItemStatic>
                      <ChecklistItemStatic>
                        Use em dashes (—) not hyphens for breaks
                      </ChecklistItemStatic>
                      <ChecklistItemStatic>
                        Spell out numbers under 10, use numerals for 10+
                      </ChecklistItemStatic>
                      <ChecklistItemStatic>Use Oxford commas</ChecklistItemStatic>
                    </div>
                  </ChecklistSection>
                </div>
              </section>

              {/* Footer */}
              <div
                className="mt-12 rounded-xl border p-6 text-center"
                style={{
                  background: 'var(--pv-surface)',
                  borderColor: 'var(--pv-border)',
                }}
              >
                <p className="text-sm" style={{ color: 'var(--pv-text-muted)' }}>
                  <strong>Version:</strong> 1.0 &nbsp;|&nbsp; <strong>Purpose:</strong> Maintain
                  consistent, high-quality blog content across all projects
                </p>
              </div>
            </div>
          </div>

          {/* Table of Contents - Sticky sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <TableOfContents items={tocItems} />
            </div>
          </aside>
        </div>
      </Container>
    </main>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 text-2xl font-bold" style={{ color: 'var(--pv-text)' }}>
      {children}
    </h2>
  );
}

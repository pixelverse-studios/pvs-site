import type { Metadata } from 'next';
import Link from 'next/link';
import {
  BarChart3,
  CheckCircle,
  Code2,
  FileSearch,
  Gauge,
  Globe,
  LineChart,
  Link2,
  MapPin,
  Palette,
  Search,
  Settings,
  Shield,
  Smartphone,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react';

import { createPageMetadata } from '@/lib/metadata';
import { createServiceSchema } from '@/lib/structured-data';
import {
  ServiceHero,
  ServiceFeatures,
  ServiceProcess,
  ServiceFAQ,
  ServiceRelated,
  ServiceCta,
} from '@/components/services/individual';
import { Container } from '@/components/ui/container';
import { StructuredData } from '@/components/ui/structured-data';
import { SectionHeader } from '@/components/ui/section-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = createPageMetadata({
  title: 'Local & Technical SEO Services NJ',
  description:
    'SEO services focused on technical SEO, local optimization, and content strategy. Built to improve visibility, rankings, and long-term organic growth.',
  path: '/services/seo',
  keywords: [
    'SEO services',
    'SEO agency',
    'local SEO services',
    'technical SEO',
    'search engine optimization',
    'organic search optimization',
  ],
});

// SEO Services We Offer - Feature cards
const services = [
  {
    icon: Settings,
    title: 'Technical SEO',
    description:
      'Site speed optimization, Core Web Vitals, crawlability audits, structured data implementation, and XML sitemap management. The foundation everything else builds on.',
  },
  {
    icon: MapPin,
    title: 'Local SEO',
    description:
      'Google Business Profile optimization, local citation building, review management, and city-specific landing pages that capture searches in your service area.',
  },
  {
    icon: FileSearch,
    title: 'On-Page SEO',
    description:
      'Keyword optimization, meta tag crafting, heading structure, internal linking strategy, and content organization that signals relevance to search engines.',
  },
  {
    icon: Target,
    title: 'Content Strategy',
    description:
      'Keyword research, content gap analysis, editorial planning, and blog optimization. Content that answers questions and captures search intent.',
  },
  {
    icon: Link2,
    title: 'Link Building',
    description:
      'Quality backlink acquisition through digital PR, guest posting, local partnerships, and broken link building. Authority signals that move rankings.',
  },
  {
    icon: BarChart3,
    title: 'SEO Audits',
    description:
      'Comprehensive site analysis covering technical health, content gaps, competitive positioning, and prioritized recommendations with projected impact.',
  },
];

// Technical SEO Capabilities
const technicalCapabilities = [
  {
    icon: Gauge,
    title: 'Core Web Vitals',
    description:
      "LCP, FID, and CLS optimization to meet Google's page experience signals. Fast, stable, responsive experiences that rank better.",
  },
  {
    icon: Code2,
    title: 'Structured Data',
    description:
      'Schema markup implementation—LocalBusiness, FAQ, Article, Product, and more. Rich snippets that increase click-through rates.',
  },
  {
    icon: Globe,
    title: 'Crawlability',
    description:
      'XML sitemaps, robots.txt configuration, canonical tags, and internal linking architecture. Help search engines understand your site.',
  },
  {
    icon: Smartphone,
    title: 'Mobile-First',
    description:
      'Google indexes mobile versions first. We ensure your mobile experience is flawless—fast, usable, and fully optimized.',
  },
  {
    icon: Zap,
    title: 'Page Speed',
    description:
      'Image optimization, code minification, lazy loading, CDN configuration. Sub-second load times that users and Google love.',
  },
  {
    icon: Shield,
    title: 'Security & HTTPS',
    description:
      'SSL implementation, security headers, safe browsing compliance. Trust signals that protect users and rankings.',
  },
];

// Local SEO - Bergen County cities
const bergenCities = [
  { name: 'Fort Lee', slug: 'fort-lee' },
  { name: 'Englewood', slug: 'englewood' },
  { name: 'Hackensack', slug: 'hackensack' },
  { name: 'Paramus', slug: 'paramus' },
  { name: 'Ridgewood', slug: 'ridgewood' },
  { name: 'Teaneck', slug: 'teaneck' },
  { name: 'Fair Lawn', slug: 'fair-lawn' },
  { name: 'Bergenfield', slug: 'bergenfield' },
];

// Why SEO-First Development
const seoFirstReasons = [
  {
    title: 'Built-In vs. Bolted-On',
    description:
      'SEO retrofitted to an existing site means compromise. SEO built into the foundation means every technical decision supports visibility from day one.',
  },
  {
    title: 'Performance as a Ranking Factor',
    description:
      "Google's Core Web Vitals directly impact rankings. When performance is in the architecture, not an afterthought, you start with an advantage.",
  },
  {
    title: 'Content Structure That Ranks',
    description:
      'Proper heading hierarchy, semantic HTML, and logical information architecture help search engines understand and rank your content.',
  },
  {
    title: 'Technical Foundation for Growth',
    description:
      'Clean URL structures, scalable schema patterns, and optimized crawl paths mean your SEO can grow with your business.',
  },
];

// Process steps
const processSteps = [
  {
    number: 1,
    title: 'Audit & Analysis',
    description:
      "Comprehensive technical audit, competitor analysis, and keyword research. We identify what's working, what's broken, and where the opportunities are.",
  },
  {
    number: 2,
    title: 'Strategy Development',
    description:
      'Prioritized roadmap based on impact and effort. Quick wins to build momentum, foundational fixes for long-term growth, content opportunities to capture.',
  },
  {
    number: 3,
    title: 'Implementation',
    description:
      'Technical fixes, content optimization, schema markup, and on-page improvements. We execute the strategy with precision and documentation.',
  },
  {
    number: 4,
    title: 'Monitoring & Reporting',
    description:
      'Rank tracking, traffic analysis, and conversion monitoring. Monthly reports showing progress, insights, and next priorities. Continuous improvement.',
  },
];

// FAQ items - Comprehensive for SEO page
const faqs = [
  {
    question: 'How long does SEO take to show results?',
    answer:
      'Most businesses see initial improvements within 3-6 months, with significant results in 6-12 months. The timeline depends on your starting point, competition, and investment level. Technical fixes can show impact quickly, while content and authority building take longer. We set realistic expectations upfront and track progress monthly so you always know where you stand.',
  },
  {
    question: "What's the difference between technical SEO and content SEO?",
    answer:
      'Technical SEO focuses on how search engines crawl and index your site—site speed, mobile-friendliness, structured data, URL structure, and crawlability. Content SEO focuses on what you publish—keyword targeting, content quality, topical authority, and satisfying search intent. Both are essential: technical SEO ensures search engines can find and understand your content, while content SEO ensures you have content worth finding.',
  },
  {
    question: 'Do you guarantee first page rankings?',
    answer:
      "No ethical SEO agency can guarantee specific rankings because Google's algorithm considers hundreds of factors and changes constantly. What we guarantee is strategic, best-practice work that improves your visibility over time. We've helped businesses rank for competitive terms, but we do it through proven methodology, not promises we can't control.",
  },
  {
    question: 'How do you measure SEO success?',
    answer:
      'We track multiple metrics: organic traffic growth, keyword rankings, click-through rates, conversion rates from organic traffic, and ultimately revenue impact. Rankings matter, but traffic that converts matters more. We set up proper tracking and provide monthly reports showing exactly how SEO is contributing to your business goals.',
  },
  {
    question: 'What is local SEO and do I need it?',
    answer:
      'Local SEO optimizes your visibility for location-based searches like "web design near me" or "SEO agency in Bergen County." If you serve customers in a specific geographic area, local SEO is essential. This includes Google Business Profile optimization, local citations, location-specific pages, and review management. For service businesses, local SEO often delivers the fastest ROI.',
  },
  {
    question: 'How often do you provide SEO reports?',
    answer:
      "We provide monthly reports covering ranking changes, traffic trends, completed work, and next priorities. Reports include both data and interpretation—not just what happened, but what it means and what we're doing about it. You also get access to a live dashboard for real-time metrics between reports.",
  },
  {
    question: 'Can you help with Google penalties?',
    answer:
      "Yes. We diagnose whether you're dealing with a manual action or algorithmic issue, identify the cause (thin content, unnatural links, technical problems), and create a recovery plan. Penalty recovery requires careful analysis and methodical fixes. We've helped sites recover from both manual actions and algorithm updates.",
  },
  {
    question: 'What SEO tools do you use?',
    answer:
      "We use industry-standard tools including Google Search Console, Google Analytics 4, Ahrefs, Screaming Frog, PageSpeed Insights, and Schema validators. The tools matter less than how they're used—we focus on actionable insights rather than vanity metrics. You get access to relevant dashboards and reports.",
  },
];

// Service schema for SEO
const serviceSchema = createServiceSchema({
  name: 'SEO Services & Search Engine Optimization',
  serviceType: 'SEO',
  description:
    'Technical SEO, local SEO, and content optimization that drives organic growth. We engineer websites for visibility from day one.',
  path: '/services/seo',
});

// Related services
const relatedServices = [
  {
    icon: Code2,
    title: 'Web Development',
    description:
      'SEO-ready websites built with performance, accessibility, and search visibility in mind from the first line of code.',
    href: '/services/web-development',
  },
  {
    icon: Palette,
    title: 'UX/UI Design',
    description:
      'User experience directly impacts SEO. Engaged users, low bounce rates, and clear navigation all signal quality to Google.',
    href: '/services/ux-ui-design',
  },
];

export default function SEOServicesPage() {
  return (
    <main>
      <StructuredData data={serviceSchema} id="seo-services-service-schema" />

      {/* Hero */}
      <ServiceHero
        eyebrow="SEO Services"
        title="SEO Services That Drive Organic Growth"
        description="Technical SEO, local optimization, and content strategy—built into every project from the start. We engineer websites for visibility, not just aesthetics."
        primaryCta={{ label: 'Get an SEO Audit', href: '/contact' }}
        secondaryCta={{ label: 'View Our Work', href: '/portfolio' }}
        icon={Search}
      />

      {/* SEO Services We Offer */}
      <ServiceFeatures
        eyebrow="What We Do"
        heading="Comprehensive SEO Services"
        description="From technical foundations to content strategy, we cover every aspect of search engine optimization that impacts your visibility and growth."
        features={services}
        columns={3}
      />

      {/* Technical SEO Capabilities */}
      <section className="bg-[var(--pv-surface)] py-16 md:py-24">
        <Container className="space-y-12">
          <MotionSection as="div" className="space-y-12">
            <MotionItem>
              <SectionHeader
                align="center"
                eyebrow="Technical SEO"
                title="The Foundation of Organic Visibility"
                description="Technical SEO ensures search engines can crawl, understand, and rank your content. Without it, even great content stays invisible."
                className="mx-auto max-w-3xl"
              />
            </MotionItem>
            <MotionSection
              as="div"
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              delay={0.12}
            >
              {technicalCapabilities.map(({ icon: Icon, title, description }, index) => (
                <MotionItem key={title} delay={index * 0.08} triggerOnViewport={false}>
                  <Card className="border-[var(--pv-border)]/80 group h-full bg-[var(--pv-bg)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--pv-primary)] hover:shadow-[0_24px_50px_-36px_rgba(63,0,233,0.6)]">
                    <CardHeader className="flex flex-row items-start gap-4 pb-2">
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--pv-primary),var(--pv-primary-2))] text-white shadow-[0_12px_24px_-12px_rgba(63,0,233,0.8)]">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <CardTitle className="text-lg font-semibold">{title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm leading-6 text-[var(--pv-text-muted)]">{description}</p>
                    </CardContent>
                  </Card>
                </MotionItem>
              ))}
            </MotionSection>
          </MotionSection>
        </Container>
      </section>

      {/* Our SEO Process */}
      <ServiceProcess
        eyebrow="Our Process"
        heading="A systematic approach to sustainable organic growth."
        steps={processSteps}
      />

      {/* Why SEO-First Development */}
      <section className="bg-[var(--pv-surface)] py-16 md:py-24">
        <Container className="space-y-12">
          <MotionSection as="div" className="space-y-12">
            <MotionItem>
              <SectionHeader
                align="center"
                eyebrow="SEO-First Development"
                title="Why SEO Should Be Built In, Not Bolted On"
                description="Most websites need SEO fixes because SEO wasn't part of the build. We do it differently."
                className="mx-auto max-w-3xl"
              />
            </MotionItem>
            <MotionSection as="div" className="grid gap-8 md:grid-cols-2" delay={0.12}>
              {seoFirstReasons.map(({ title, description }, index) => (
                <MotionItem key={title} delay={index * 0.08} triggerOnViewport={false}>
                  <div className="flex gap-4">
                    <CheckCircle
                      className="mt-1 h-6 w-6 shrink-0 text-[var(--pv-primary)]"
                      aria-hidden="true"
                    />
                    <div>
                      <h3 className="font-semibold text-[var(--pv-text)]">{title}</h3>
                      <p className="mt-1 text-sm leading-6 text-[var(--pv-text-muted)]">
                        {description}
                      </p>
                    </div>
                  </div>
                </MotionItem>
              ))}
            </MotionSection>
          </MotionSection>
        </Container>
      </section>

      {/* Local SEO Coverage */}
      <section className="py-16 md:py-24">
        <Container className="space-y-10">
          <MotionSection as="div" className="space-y-10">
            <MotionItem>
              <SectionHeader
                align="center"
                eyebrow="Local SEO"
                title="Bergen County SEO Specialists"
                description="We help businesses dominate local search in Bergen County and surrounding areas. City-specific strategies that capture local intent."
                className="mx-auto max-w-2xl"
              />
            </MotionItem>
            <MotionItem delay={0.08}>
              <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-3">
                {bergenCities.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/services/${city.slug}`}
                    className="rounded-full border border-[var(--pv-border)] bg-[var(--pv-surface)] px-4 py-2 text-sm font-medium text-[var(--pv-text)] transition-colors hover:border-[var(--pv-primary)] hover:text-[var(--pv-primary)]"
                  >
                    {city.name}
                  </Link>
                ))}
              </div>
            </MotionItem>
            <MotionItem delay={0.12}>
              <div className="flex justify-center">
                <Button asChild variant="outline">
                  <Link href="/services/bergen-county">
                    <MapPin className="mr-2 h-4 w-4" />
                    View All Bergen County Services
                  </Link>
                </Button>
              </div>
            </MotionItem>
          </MotionSection>
        </Container>
      </section>

      {/* What to Expect - Results */}
      <section className="bg-[var(--pv-surface)] py-16 md:py-24">
        <Container className="space-y-12">
          <MotionSection as="div" className="space-y-12">
            <MotionItem>
              <SectionHeader
                align="center"
                eyebrow="What to Expect"
                title="SEO Is a Long Game—Here's What Realistic Progress Looks Like"
                description="We believe in transparency. SEO takes time, but the right strategy shows measurable progress along the way."
                className="mx-auto max-w-3xl"
              />
            </MotionItem>
            <MotionSection
              as="div"
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
              delay={0.12}
            >
              {[
                {
                  period: 'Month 1-2',
                  milestone: 'Technical Foundation',
                  description: 'Audit complete, technical fixes implemented, tracking in place',
                },
                {
                  period: 'Month 3-4',
                  milestone: 'Early Signals',
                  description:
                    'Indexing improvements, keyword movement, content strategy executing',
                },
                {
                  period: 'Month 5-6',
                  milestone: 'Visible Progress',
                  description: 'Traffic growth, ranking improvements, conversion tracking refined',
                },
                {
                  period: 'Month 7+',
                  milestone: 'Compounding Growth',
                  description:
                    'Authority building, sustained rankings, expanding keyword footprint',
                },
              ].map(({ period, milestone, description }, index) => (
                <MotionItem key={period} delay={index * 0.08} triggerOnViewport={false}>
                  <Card className="border-[var(--pv-border)]/80 h-full bg-[var(--pv-bg)] text-center">
                    <CardHeader className="pb-2">
                      <span className="text-sm font-medium uppercase tracking-wider text-[var(--pv-primary)]">
                        {period}
                      </span>
                      <CardTitle className="text-lg font-semibold">{milestone}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-6 text-[var(--pv-text-muted)]">{description}</p>
                    </CardContent>
                  </Card>
                </MotionItem>
              ))}
            </MotionSection>
          </MotionSection>
        </Container>
      </section>

      {/* FAQ */}
      <ServiceFAQ
        heading="Frequently Asked Questions About SEO"
        description="Honest answers to common SEO questions. No jargon, no empty promises—just clarity on what SEO can do for your business."
        faqs={faqs}
        schemaId="seo-services-faq-schema"
      />

      {/* Related Services */}
      <ServiceRelated
        heading="Related Services"
        description="SEO works best when integrated with development and design from the start."
        services={relatedServices}
        columns={2}
      />

      {/* CTA */}
      <ServiceCta
        heading="Ready to Rank Higher and Grow Organically?"
        description="Let's talk about your SEO goals. We'll audit your current situation and create a roadmap to better visibility."
        primaryCta={{ label: 'Get an SEO Audit', href: '/contact' }}
        secondaryCta={{ label: 'View Our Work', href: '/portfolio' }}
        variant="gradient"
      />
    </main>
  );
}

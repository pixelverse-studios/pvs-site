import type { Metadata } from 'next';
import {
  Code2,
  Gauge,
  Globe,
  Layers,
  Lock,
  Palette,
  Rocket,
  Search,
  Server,
  Settings,
  ShoppingCart,
  Zap,
} from 'lucide-react';

import { createPageMetadata } from '@/lib/metadata';
import {
  ServiceHero,
  ServiceFeatures,
  ServiceProcess,
  ServiceFAQ,
  ServiceRelated,
  ServiceCta,
} from '@/components/services/individual';
import { Container } from '@/components/ui/container';
import { SectionHeader } from '@/components/ui/section-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';

export const metadata: Metadata = createPageMetadata({
  title: 'Custom Web Development Services | PixelVerse Studios',
  description:
    'Hand-coded, high-performance websites built for conversion. No templates, no page builders—just clean code tailored to your business goals.',
  path: '/services/web-development',
  keywords: [
    'custom web development',
    'web design services',
    'website development agency',
    'professional web development',
    'custom website design',
    'business website development',
  ],
});

// What We Build - Feature cards
const features = [
  {
    icon: Globe,
    title: 'Custom Business Websites',
    description:
      'Fully bespoke websites designed around your brand, goals, and audience. Every element is purposefully crafted to convert visitors into customers.',
  },
  {
    icon: ShoppingCart,
    title: 'E-commerce Solutions',
    description:
      'High-performance online stores with seamless checkout experiences, inventory management, and payment integrations that scale with your business.',
  },
  {
    icon: Layers,
    title: 'Web Applications',
    description:
      'Interactive, data-driven applications built with modern frameworks. From dashboards to SaaS platforms, we build software that works.',
  },
  {
    icon: Rocket,
    title: 'Landing Pages & Microsites',
    description:
      'Conversion-focused landing pages optimized for campaigns, product launches, and lead generation with lightning-fast load times.',
  },
  {
    icon: Server,
    title: 'API Integrations',
    description:
      'Connect your website to CRMs, payment processors, marketing tools, and third-party services with robust, maintainable integrations.',
  },
  {
    icon: Settings,
    title: 'CMS Implementations',
    description:
      'Headless CMS solutions that give your team full control over content without sacrificing performance or developer experience.',
  },
];

// Why Custom Development - Differentiators
const differentiators = [
  {
    icon: Gauge,
    title: 'Performance',
    description:
      'Every millisecond matters. Custom code means no bloat, faster load times, and better Core Web Vitals scores that improve both user experience and search rankings.',
  },
  {
    icon: Search,
    title: 'SEO-First Architecture',
    description:
      'Clean semantic markup, proper heading hierarchy, structured data, and optimized meta tags built into the foundation—not bolted on as an afterthought.',
  },
  {
    icon: Zap,
    title: 'Scalability',
    description:
      'Code architecture designed to grow with your business. Add features, handle traffic spikes, and expand functionality without hitting platform limitations.',
  },
  {
    icon: Lock,
    title: 'Security',
    description:
      'No plugin vulnerabilities, no outdated dependencies to worry about. Custom code means a smaller attack surface and complete control over security practices.',
  },
  {
    icon: Code2,
    title: 'Full Ownership',
    description:
      'You own every line of code. No vendor lock-in, no monthly platform fees, no limitations on what you can build or where you can host.',
  },
];

// Technologies
const technologies = [
  { name: 'Next.js', category: 'Framework' },
  { name: 'React', category: 'Framework' },
  { name: 'TypeScript', category: 'Language' },
  { name: 'Tailwind CSS', category: 'Styling' },
  { name: 'Node.js', category: 'Runtime' },
  { name: 'PostgreSQL', category: 'Database' },
  { name: 'Supabase', category: 'Backend' },
  { name: 'Vercel', category: 'Hosting' },
];

// Process steps
const processSteps = [
  {
    number: 1,
    title: 'Discovery & Strategy',
    description:
      'We dive deep into your business goals, target audience, and competitive landscape to define a clear roadmap for success.',
  },
  {
    number: 2,
    title: 'Design & Prototyping',
    description:
      'Interactive prototypes let you experience your site before development begins. We iterate until the design feels right.',
  },
  {
    number: 3,
    title: 'Development & Testing',
    description:
      'Clean, maintainable code built with modern best practices. Rigorous testing ensures everything works flawlessly across devices.',
  },
  {
    number: 4,
    title: 'Launch & Optimization',
    description:
      'We handle deployment, monitor performance, and continue optimizing based on real user data and analytics.',
  },
];

// FAQ items
const faqs = [
  {
    question: 'How long does a custom website take to build?',
    answer:
      'Most projects range from 6-12 weeks depending on complexity. A focused landing page might take 3-4 weeks, while a full e-commerce platform or web application could take 12-16 weeks. We provide detailed timelines during our discovery phase so you know exactly what to expect.',
  },
  {
    question: "What's the difference between custom development and WordPress?",
    answer:
      "WordPress relies on themes and plugins that add bloat, create security vulnerabilities, and limit your design options. Custom development means every line of code is written specifically for your needs—resulting in faster performance, better SEO, tighter security, and complete design freedom. You're not fighting against a platform's limitations.",
  },
  {
    question: 'Do you provide hosting?',
    answer:
      "We deploy to modern hosting platforms like Vercel or Netlify that offer excellent performance, automatic scaling, and built-in CDN. We handle the initial setup and can manage ongoing hosting, or we can hand off to your team with full documentation. You're never locked into a proprietary hosting arrangement.",
  },
  {
    question: 'Can you redesign my existing website?',
    answer:
      "Absolutely. We often work with businesses ready to move beyond template-based sites. We'll audit your current site, understand what's working and what isn't, and create a migration plan that preserves your SEO value while dramatically improving performance and user experience.",
  },
  {
    question: 'What does ongoing support include?',
    answer:
      'Our support retainers include regular security updates, performance monitoring, content updates, and priority access for new feature development. We also provide training so your team can handle day-to-day content changes independently.',
  },
  {
    question: 'How do you handle SEO during development?',
    answer:
      'SEO is built into our development process from day one. This includes semantic HTML structure, optimized meta tags, structured data markup, fast load times, mobile responsiveness, and proper URL architecture. We also integrate with Google Search Console and analytics to ensure ongoing visibility.',
  },
];

// Related services
const relatedServices = [
  {
    icon: Palette,
    title: 'UX/UI Design',
    description:
      'Strategic design that balances aesthetics with usability. Every interaction is crafted to guide users toward conversion.',
    href: '/services/ux-ui-design',
  },
  {
    icon: Search,
    title: 'SEO Services',
    description:
      'Comprehensive search optimization that drives organic traffic and builds long-term visibility for your business.',
    href: '/services/seo',
  },
];

export default function WebDevelopmentPage() {
  return (
    <main>
      {/* Hero */}
      <ServiceHero
        eyebrow="Web Development"
        title="Custom Web Development That Drives Results"
        description="No templates. No page builders. Just hand-crafted code engineered for performance, SEO, and conversion. We build websites that work as hard as you do."
        primaryCta={{ label: 'Start Your Project', href: '/contact' }}
        secondaryCta={{ label: 'View Our Work', href: '/work' }}
        icon={Code2}
      />

      {/* What We Build */}
      <ServiceFeatures
        eyebrow="What We Build"
        heading="Solutions Tailored to Your Business"
        description="From marketing sites to complex web applications, we build digital products that solve real problems and create measurable value."
        features={features}
        columns={3}
      />

      {/* Why Custom Development */}
      <section className="bg-[var(--pv-surface)] py-16 md:py-24">
        <Container className="space-y-12">
          <MotionSection as="div" className="space-y-12">
            <MotionItem>
              <SectionHeader
                align="center"
                eyebrow="Why Custom"
                title="The Custom Development Advantage"
                description="Template-based solutions come with hidden costs. Here's why businesses serious about growth choose custom development."
                className="mx-auto max-w-3xl"
              />
            </MotionItem>
            <MotionSection
              as="div"
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              delay={0.12}
            >
              {differentiators.map(({ icon: Icon, title, description }, index) => (
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

      {/* Our Process */}
      <ServiceProcess
        eyebrow="Our Process"
        heading="From concept to launch, a process built for clarity and results."
        steps={processSteps}
      />

      {/* Technologies */}
      <section className="py-16 md:py-24">
        <Container className="space-y-10">
          <MotionSection as="div" className="space-y-10">
            <MotionItem>
              <SectionHeader
                align="center"
                eyebrow="Our Stack"
                title="Built With Modern Technologies"
                description="We use battle-tested tools that prioritize performance, developer experience, and long-term maintainability."
                className="mx-auto max-w-2xl"
              />
            </MotionItem>
            <MotionItem delay={0.08}>
              <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-3">
                {technologies.map((tech) => (
                  <span
                    key={tech.name}
                    className="rounded-full border border-[var(--pv-border)] bg-[var(--pv-surface)] px-4 py-2 text-sm font-medium text-[var(--pv-text)] transition-colors hover:border-[var(--pv-primary)] hover:text-[var(--pv-primary)]"
                  >
                    {tech.name}
                  </span>
                ))}
              </div>
            </MotionItem>
          </MotionSection>
        </Container>
      </section>

      {/* FAQ */}
      <ServiceFAQ
        heading="Frequently Asked Questions"
        description="Common questions about our web development process and what to expect."
        faqs={faqs}
        schemaId="web-development-faq-schema"
      />

      {/* Related Services */}
      <ServiceRelated
        heading="Related Services"
        description="Web development works best alongside strategic design and ongoing optimization."
        services={relatedServices}
        columns={2}
      />

      {/* CTA */}
      <ServiceCta
        heading="Ready to Build Something Custom?"
        description="Let's talk about your project. We'll help you understand what's possible and create a roadmap to get there."
        primaryCta={{ label: 'Start Your Project', href: '/contact' }}
        secondaryCta={{ label: 'View Our Work', href: '/work' }}
        variant="gradient"
      />
    </main>
  );
}

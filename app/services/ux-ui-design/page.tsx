import type { Metadata } from 'next';
import {
  Accessibility,
  BarChart3,
  Code2,
  Eye,
  Figma,
  FileSearch,
  Gauge,
  Heart,
  Layers,
  LayoutGrid,
  MousePointerClick,
  Palette,
  PenTool,
  Search,
  Smartphone,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Wand2,
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
  title: 'UX/UI Design Services | PixelVerse Studios',
  description:
    'Strategic UX/UI design that converts visitors into customers. User-centered design backed by research, not guesswork.',
  path: '/services/ux-ui-design',
  keywords: [
    'UX design services',
    'UI design agency',
    'user experience design',
    'UX UI design',
    'conversion-focused design',
    'user interface design',
  ],
});

// What We Design - Feature cards
const features = [
  {
    icon: LayoutGrid,
    title: 'Website UX/UI',
    description:
      'Complete website experiences designed around your users. From navigation structure to micro-interactions, every element guides visitors toward conversion.',
  },
  {
    icon: Layers,
    title: 'Web Application Interfaces',
    description:
      'Complex functionality made simple. We design dashboards, SaaS platforms, and data-heavy interfaces that users actually enjoy using.',
  },
  {
    icon: Smartphone,
    title: 'Mobile-Responsive Experiences',
    description:
      'Designs that adapt flawlessly across devices. Touch-friendly interactions, optimized layouts, and consistent experiences from desktop to mobile.',
  },
  {
    icon: MousePointerClick,
    title: 'Landing Page Design',
    description:
      'Conversion-focused landing pages engineered for action. Clear value propositions, strategic CTAs, and persuasive visual hierarchy.',
  },
  {
    icon: Palette,
    title: 'Design Systems & Style Guides',
    description:
      'Scalable design foundations that ensure consistency. Component libraries, design tokens, and documentation your team can build on.',
  },
  {
    icon: PenTool,
    title: 'Prototypes & Wireframes',
    description:
      'Test ideas before committing to code. Interactive prototypes let you experience and validate designs with real users early.',
  },
];

// Design Principles
const designPrinciples = [
  {
    icon: Users,
    title: 'User-Centered',
    description:
      'Every design decision is backed by user needs, not assumptions. We start with research and let data guide our creative choices.',
  },
  {
    icon: Target,
    title: 'Conversion-Focused',
    description:
      'Beautiful design that drives action. We balance aesthetics with strategic placement that guides users toward your business goals.',
  },
  {
    icon: Accessibility,
    title: 'Accessible',
    description:
      'Inclusive design that works for everyone. WCAG compliance, screen reader support, and consideration for all abilities.',
  },
  {
    icon: Layers,
    title: 'Scalable',
    description:
      'Design systems built to grow with your business. Consistent patterns and components that make future expansion effortless.',
  },
  {
    icon: Sparkles,
    title: 'Brand-Aligned',
    description:
      'Visual consistency across every touchpoint. We translate your brand identity into digital experiences that feel authentically you.',
  },
];

// Why UX Matters - Statistics
const uxStats = [
  {
    value: '400%',
    label: 'Average ROI from UX investment',
    description: 'Every dollar invested in UX returns $100 in business value.',
  },
  {
    value: '88%',
    label: "Users won't return after bad UX",
    description: 'First impressions are everything in the digital world.',
  },
  {
    value: '50%',
    label: 'Dev time saved with proper planning',
    description: 'Wireframes catch problems before they become expensive fixes.',
  },
  {
    value: '200%',
    label: 'Conversion lift from UX optimization',
    description: 'Strategic design changes directly impact your bottom line.',
  },
];

// Tools We Use
const tools = [
  { name: 'Figma', category: 'Design' },
  { name: 'Adobe XD', category: 'Design' },
  { name: 'Photoshop', category: 'Graphics' },
  { name: 'Illustrator', category: 'Graphics' },
  { name: 'Framer', category: 'Prototyping' },
  { name: 'Maze', category: 'User Testing' },
  { name: 'Hotjar', category: 'Analytics' },
  { name: 'Storybook', category: 'Documentation' },
];

// Process steps
const processSteps = [
  {
    number: 1,
    title: 'Research & Discovery',
    description:
      'We dive into user interviews, competitor analysis, and stakeholder alignment to understand the full picture before sketching a single pixel.',
  },
  {
    number: 2,
    title: 'Information Architecture',
    description:
      'Sitemaps, user flows, and content hierarchy create the structural foundation. We map how users will navigate and find what they need.',
  },
  {
    number: 3,
    title: 'Wireframing',
    description:
      'Low-fidelity layouts validate structure and flow without the distraction of visual design. Fast iteration, early problem-solving.',
  },
  {
    number: 4,
    title: 'Visual Design',
    description:
      'High-fidelity mockups bring your brand to life. Typography, color, imagery, and spacing work together to create cohesive experiences.',
  },
  {
    number: 5,
    title: 'Prototyping',
    description:
      'Interactive prototypes let you click through the experience. Test with real users, gather feedback, and refine before development.',
  },
  {
    number: 6,
    title: 'Handoff & QA',
    description:
      'Developer-ready specs, design tokens, and asset exports. We stay involved through implementation to ensure design integrity.',
  },
];

// FAQ items
const faqs = [
  {
    question: "What's the difference between UX and UI design?",
    answer:
      'UX (User Experience) design focuses on the overall feel and functionality of a product—how easy it is to use, how well it solves user problems, and the journey users take. UI (User Interface) design is about the visual elements—colors, typography, buttons, and layouts. Think of UX as the blueprint and UI as the interior design. We handle both because great digital products need both working in harmony.',
  },
  {
    question: 'How long does the design process take?',
    answer:
      'A typical project runs 4-8 weeks depending on scope. A focused landing page might take 2-3 weeks, while a complex web application with multiple user flows could take 10-12 weeks. Our discovery phase helps us provide accurate timelines based on your specific needs. We work in iterative sprints so you see progress regularly.',
  },
  {
    question: 'Do you provide design files?',
    answer:
      'Absolutely. You receive complete Figma files with organized components, layers, and documentation. We also provide design tokens (colors, typography, spacing), asset exports in all necessary formats, and style guide documentation. Everything is structured for easy developer handoff and future design work.',
  },
  {
    question: 'Can you work with our existing brand guidelines?',
    answer:
      "Yes, we regularly work within established brand systems. We'll review your brand guidelines, understand the rules and flexibility, and create digital experiences that feel native to your brand while optimizing for web and mobile contexts. We can also help extend brand systems that were created for print into comprehensive digital design systems.",
  },
  {
    question: 'Do you do user research?',
    answer:
      "User research is central to our process. This can include stakeholder interviews, user surveys, competitor analysis, usability testing, and analytics review. The depth of research depends on your project scope and budget—we'll recommend an approach that gives you actionable insights without unnecessary overhead.",
  },
  {
    question: 'What if we need changes after design is complete?',
    answer:
      'We build revision rounds into every project. Typically, each major milestone includes two rounds of revisions. For ongoing needs, we offer retainer arrangements that give you dedicated design hours for continuous iteration and new feature design as your product evolves.',
  },
];

// Related services
const relatedServices = [
  {
    icon: Code2,
    title: 'Web Development',
    description:
      'Transform your designs into high-performance code. Our development team builds exactly what we design, pixel-perfect.',
    href: '/services/web-development',
  },
  {
    icon: Search,
    title: 'SEO Services',
    description:
      'Great UX and SEO work together. We ensure your beautiful designs are discoverable and rank well in search.',
    href: '/services/seo',
  },
];

export default function UXUIDesignPage() {
  return (
    <main>
      {/* Hero */}
      <ServiceHero
        eyebrow="UX/UI Design"
        title="UX/UI Design That Converts Visitors Into Customers"
        description="User-centered design backed by research, not guesswork. We create intuitive, conversion-focused experiences that keep visitors engaged and drive measurable results."
        primaryCta={{ label: 'Start Your Design Project', href: '/contact' }}
        secondaryCta={{ label: 'See Our Portfolio', href: '/portfolio' }}
        icon={Palette}
      />

      {/* What We Design */}
      <ServiceFeatures
        eyebrow="What We Design"
        heading="Digital Experiences That Work"
        description="From marketing websites to complex applications, we design interfaces that solve real problems and delight users along the way."
        features={features}
        columns={3}
      />

      {/* Why UX Matters - Statistics Section */}
      <section className="bg-[var(--pv-surface)] py-16 md:py-24">
        <Container className="space-y-12">
          <MotionSection as="div" className="space-y-12">
            <MotionItem>
              <SectionHeader
                align="center"
                eyebrow="Why UX Matters"
                title="Design Is a Business Investment"
                description="Good UX isn't just about looking pretty—it directly impacts your bottom line. Here's what the data shows."
                className="mx-auto max-w-3xl"
              />
            </MotionItem>
            <MotionSection
              as="div"
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
              delay={0.12}
            >
              {uxStats.map(({ value, label, description }, index) => (
                <MotionItem key={label} delay={index * 0.08} triggerOnViewport={false}>
                  <Card className="border-[var(--pv-border)]/80 h-full bg-[var(--pv-bg)] text-center transition-all duration-300 hover:-translate-y-1 hover:border-[var(--pv-primary)] hover:shadow-[0_24px_50px_-36px_rgba(63,0,233,0.6)]">
                    <CardHeader className="pb-2">
                      <span className="font-heading text-4xl font-semibold text-[var(--pv-primary)] md:text-5xl">
                        {value}
                      </span>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <CardTitle className="text-base font-semibold">{label}</CardTitle>
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
        heading="From research to handoff, a design process built for results."
        steps={processSteps}
      />

      {/* Design Principles */}
      <section className="bg-[var(--pv-surface)] py-16 md:py-24">
        <Container className="space-y-12">
          <MotionSection as="div" className="space-y-12">
            <MotionItem>
              <SectionHeader
                align="center"
                eyebrow="How We Think"
                title="Design Principles We Live By"
                description="These aren't just buzzwords on a wall. They're the lens through which we evaluate every design decision."
                className="mx-auto max-w-3xl"
              />
            </MotionItem>
            <MotionSection
              as="div"
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              delay={0.12}
            >
              {designPrinciples.map(({ icon: Icon, title, description }, index) => (
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

      {/* Tools We Use */}
      <section className="py-16 md:py-24">
        <Container className="space-y-10">
          <MotionSection as="div" className="space-y-10">
            <MotionItem>
              <SectionHeader
                align="center"
                eyebrow="Our Toolkit"
                title="Industry-Standard Design Tools"
                description="We use the tools modern teams rely on—ensuring seamless collaboration and developer-friendly handoffs."
                className="mx-auto max-w-2xl"
              />
            </MotionItem>
            <MotionItem delay={0.08}>
              <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-3">
                {tools.map((tool) => (
                  <span
                    key={tool.name}
                    className="rounded-full border border-[var(--pv-border)] bg-[var(--pv-surface)] px-4 py-2 text-sm font-medium text-[var(--pv-text)] transition-colors hover:border-[var(--pv-primary)] hover:text-[var(--pv-primary)]"
                  >
                    {tool.name}
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
        description="Common questions about our UX/UI design process and what to expect."
        faqs={faqs}
        schemaId="ux-ui-design-faq-schema"
      />

      {/* Related Services */}
      <ServiceRelated
        heading="Related Services"
        description="Great design needs great development. We offer the full stack."
        services={relatedServices}
        columns={2}
      />

      {/* CTA */}
      <ServiceCta
        heading="Ready to Create an Experience Users Love?"
        description="Let's talk about your project. We'll help you understand the design opportunities and create a roadmap to better user experiences."
        primaryCta={{ label: 'Start Your Design Project', href: '/contact' }}
        secondaryCta={{ label: 'View Our Portfolio', href: '/portfolio' }}
        variant="gradient"
      />
    </main>
  );
}

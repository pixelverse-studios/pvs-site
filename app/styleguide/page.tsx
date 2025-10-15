import type { Metadata } from 'next';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { SectionHeader } from '@/components/ui/section-header';
import { Textarea } from '@/components/ui/textarea';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { OverlaysDemo } from '@/components/styleguide/overlays-demo';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Styleguide | PixelVerse Studios',
  description:
    'Explore PixelVerse Studios design system tokens, UI primitives, and theming guidelines for consistent product experiences.',
  path: '/styleguide',
  keywords: [
    'PixelVerse design system',
    'Tailwind component library',
    'Next.js UI kit',
    'PixelVerse style guide',
    'design tokens',
  ],
});

const brandPalette = [
  { label: 'Primary', token: '--pv-primary', value: '#3f00e9' },
  { label: 'Primary Accent', token: '--pv-primary-2', value: '#c947ff' },
  { label: 'Gradient', token: '--pv-gradient', value: 'Gradient', isGradient: true },
  { label: 'Background', token: '--pv-bg', value: '#ffffff / #04031a' },
  { label: 'Surface', token: '--pv-surface', value: '#f7f7fb / #111539' },
  { label: 'Text', token: '--pv-text', value: '#111111 / #f4f6ff' },
  { label: 'Muted', token: '--pv-text-muted', value: '#666666 / #9fa6dd' },
  { label: 'Border', token: '--pv-border', value: '#e6e6ef / #262d62' },
  { label: 'Overlay Strong', token: '--pv-overlay-strong', value: 'rgba(255,255,255,0.82) / rgba(6,7,30,0.88)' },
  { label: 'Overlay Soft', token: '--pv-overlay-soft', value: 'rgba(255,255,255,0.65) / rgba(24,26,72,0.68)' },
  { label: 'Overlay Glow', token: '--pv-overlay-glow', value: 'rgba(169,173,255,0.45) / rgba(34,36,108,0.5)' },
  { label: 'Ring', token: '--pv-ring', value: 'var(--pv-primary)' },
  { label: 'Success', token: '--pv-success', value: '#10b981' },
  { label: 'Warning', token: '--pv-warning', value: '#f59e0b' },
  { label: 'Danger', token: '--pv-danger', value: '#ef4444' }
];

const buttonVariants = [
  { label: 'Primary', variant: 'default' as const },
  { label: 'Secondary', variant: 'secondary' as const },
  { label: 'Ghost', variant: 'ghost' as const }
];

export default function StyleguidePage() {
  return (
    <main className="bg-[var(--pv-bg)]">
      <section className="border-b border-[var(--pv-border)] bg-[var(--pv-surface)]/60">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-[1.6fr_1fr] md:px-8 md:py-24">
          <div className="space-y-6">
            <Badge>Design System</Badge>
            <h1 className="font-heading text-[3rem] leading-[3.5rem] md:text-[3.5rem] md:leading-[3.75rem]">
              PixelVerse Visual Language
            </h1>
            <p className="text-lg text-[var(--pv-text-muted)]">
              A cohesive collection of tokens, patterns, and components crafted for immersive experiences.
              Explore the primitives below and switch between themes to validate contrast and motion.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button>Primary CTA</Button>
              <Button variant="secondary">Secondary</Button>
              <div className="flex items-center gap-3 rounded-pv border border-[var(--pv-border)] bg-[var(--pv-bg)] px-4 py-2">
                <ThemeToggle />
                <div>
                  <p className="text-sm font-medium">Theme toggle</p>
                  <p className="text-xs text-[var(--pv-text-muted)]">Powered by next-themes</p>
                </div>
              </div>
            </div>
          </div>
          <Card className="md:ml-auto md:max-w-md">
            <CardHeader>
              <CardTitle>Usage</CardTitle>
              <CardDescription>
                Use Tailwind utilities that reference CSS variables to ensure consistent theming.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-[var(--pv-text-muted)]">
              <div>
                <p className="font-semibold text-[var(--pv-text)]">Foundations</p>
                <p>Backgrounds, text, and borders inherit from <code>--pv-*</code> tokens.</p>
              </div>
              <div>
                <p className="font-semibold text-[var(--pv-text)]">Components</p>
                <p>Buttons, cards, inputs, overlays, and layout primitives adapt to light and dark themes.</p>
              </div>
              <div>
                <p className="font-semibold text-[var(--pv-text)]">Accessibility</p>
                <p>Focus visibility, keyboard support, and reduced-motion fallbacks included by default.</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full">
                View implementation guidelines
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      <section id="foundations" className="border-b border-[var(--pv-border)]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-24">
          <SectionHeader
            eyebrow="Foundations"
            title="Color tokens"
            description="CSS variables drive shared theming across surfaces, typography, and interactive states."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {brandPalette.map((color) => (
              <div
                key={color.token}
                className="rounded-pv border border-[var(--pv-border)] bg-[var(--pv-surface)] p-5 shadow-sm"
              >
                <div
                  className="flex h-24 w-full items-center justify-center rounded-pv-sm border border-[var(--pv-border)] text-sm font-medium text-white shadow-inner"
                  style={{
                    background: color.isGradient ? 'var(--pv-gradient)' : `var(${color.token})`,
                    color: color.label === 'Background' || color.label === 'Surface' ? 'var(--pv-text)' : undefined
                  }}
                >
                  {color.label}
                </div>
                <div className="mt-4 space-y-1 text-sm">
                  <p className="font-semibold text-[var(--pv-text)]">{color.value}</p>
                  <p className="text-[var(--pv-text-muted)]">{color.token}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="typography" className="border-b border-[var(--pv-border)] bg-[var(--pv-surface)]/50">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-24">
          <SectionHeader
            eyebrow="Typography"
            title="Typographic scale"
            description="Headings and body copy align to a clear rhythm for immersive storytelling."
          />
          <div className="mt-10 space-y-10">
            <div className="rounded-pv border border-[var(--pv-border)] bg-[var(--pv-bg)] p-8 shadow-sm">
              <h1>Heading One – 48 / 56</h1>
              <p className="mt-3 text-lg text-[var(--pv-text-muted)]">
                Scene-setting hero statements that introduce new worlds and experiences.
              </p>
            </div>
            <div className="rounded-pv border border-[var(--pv-border)] bg-[var(--pv-bg)] p-8 shadow-sm">
              <h2>Heading Two – 36 / 44</h2>
              <p className="mt-3 text-base text-[var(--pv-text-muted)]">
                Section headers guiding players through lore, releases, and creator updates.
              </p>
            </div>
            <div className="rounded-pv border border-[var(--pv-border)] bg-[var(--pv-bg)] p-8 shadow-sm">
              <h3>Heading Three – 28 / 36</h3>
              <p className="mt-3 text-base text-[var(--pv-text-muted)]">
                Supporting copy for feature callouts, metrics, and testimonials.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-pv border border-[var(--pv-border)] bg-[var(--pv-bg)] p-6 shadow-sm">
                <p className="text-base leading-[1.625rem] text-[var(--pv-text)]">
                  Body copy sits at 16 / 26 for comfortable reading across devices. Use muted variants to balance
                  contrast and highlight key actions with the primary gradient.
                </p>
              </div>
              <div className="rounded-pv border border-[var(--pv-border)] bg-[var(--pv-bg)] p-6 shadow-sm">
                <small>Small text defaults to 14 / 22 — ideal for metadata, captions, and supporting labels.</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="components" className="border-b border-[var(--pv-border)]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-24">
          <SectionHeader
            eyebrow="Components"
            title="Buttons"
            description="Primary CTAs use the PixelVerse gradient. Secondary and ghost variants complement content on all surfaces."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {buttonVariants.map((button) => (
              <div
                key={button.label}
                className="rounded-pv border border-[var(--pv-border)] bg-[var(--pv-surface)] p-6 shadow-sm"
              >
                <p className="font-semibold text-[var(--pv-text)]">{button.label}</p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Button variant={button.variant} size="sm">
                    Small
                  </Button>
                  <Button variant={button.variant}>Default</Button>
                  <Button variant={button.variant} size="lg">
                    Large
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="forms" className="border-b border-[var(--pv-border)] bg-[var(--pv-surface)]/50">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-24">
          <SectionHeader
            eyebrow="Forms"
            title="Inputs, selects, and textareas"
            description="Clear focus states, generous radius, and balanced density support complex creator workflows."
          />
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--pv-text)]" htmlFor="email">
                  Email
                </label>
                <Input id="email" type="email" placeholder="artemis@pixelverse.studio" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--pv-text)]" htmlFor="world-trigger">
                  Active world
                </label>
                <Select defaultValue="aurora">
                  <SelectTrigger id="world-trigger" aria-label="Active world">
                    <SelectValue placeholder="Select a world" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aurora">Aurora Syndicate</SelectItem>
                    <SelectItem value="lumen">Lumen Drift</SelectItem>
                    <SelectItem value="solace">Solace Outpost</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--pv-text)]" htmlFor="notes">
                  Mission brief
                </label>
                <Textarea
                  id="notes"
                  placeholder="Outline objectives, collaborators, and desired launch windows."
                />
              </div>
            </div>
            <Card className="self-start border-[var(--pv-border)] bg-[var(--pv-bg)]">
              <CardHeader>
                <CardTitle>Form guidance</CardTitle>
                <CardDescription>
                  Inputs sit on the surface token with clear focus rings in both themes.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-[var(--pv-text-muted)]">
                <p>
                  Leverage <code>rounded-pv-sm</code> for compact fields and <code>rounded-pv</code> for modals
                  and cards.
                </p>
                <p>Use helper text to communicate validation states alongside success, warning, or danger badges.</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="danger">Danger</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="content" className="border-b border-[var(--pv-border)]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-24">
          <SectionHeader
            eyebrow="Content"
            title="Cards & data displays"
            description="Modular cards with generous spacing, clear hierarchy, and gradient-backed actions."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Aurora Syndicate</CardTitle>
                <CardDescription>Open-world raid — live</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-[var(--pv-text-muted)]">
                <p>
                  Assemble up to 6 explorers to defend the Prism Gate. Rewards include plasma cores and limited
                  skins.
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="success">Online</Badge>
                  <Badge>Cross-play</Badge>
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <div>
                  <p className="text-xs uppercase text-[var(--pv-text-muted)]">Players queued</p>
                  <p className="text-lg font-semibold text-[var(--pv-text)]">2,184</p>
                </div>
                <Button size="sm">Join raid</Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Creator spotlight</CardTitle>
                <CardDescription>Wavelength Collective</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-[var(--pv-text-muted)]">
                <p>
                  Weekly builds from the Wavelength community showcasing new biome shaders and interactive lore
                  drops.
                </p>
                <Button variant="secondary">View showcase</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Metrics</CardTitle>
                <CardDescription>Engagement snapshot</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-pv-sm border border-[var(--pv-border)] bg-[var(--pv-bg)] px-4 py-3">
                  <span className="text-sm text-[var(--pv-text-muted)]">Daily active</span>
                  <span className="text-lg font-semibold text-[var(--pv-text)]">58,420</span>
                </div>
                <div className="flex items-center justify-between rounded-pv-sm border border-[var(--pv-border)] bg-[var(--pv-bg)] px-4 py-3">
                  <span className="text-sm text-[var(--pv-text-muted)]">Retention</span>
                  <span className="text-lg font-semibold text-[var(--pv-text)]">82%</span>
                </div>
                <Button variant="ghost">View analytics</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="accessibility" className="bg-[var(--pv-surface)]/60">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-24">
          <SectionHeader
            eyebrow="Overlays"
            title="Modal & drawer"
            description="Overlays respect focus, escape key behavior, and reduced motion for accessible interactions."
          />
          <div className="mt-10 rounded-pv border border-[var(--pv-border)] bg-[var(--pv-bg)] p-6 shadow-sm">
            <OverlaysDemo />
          </div>
        </div>
      </section>
    </main>
  );
}

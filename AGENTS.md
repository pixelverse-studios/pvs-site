# PixelVerse Studios – 2025

## Project Overview

A custom-coded marketing website for PixelVerse Studios, built with **Next.js 14**, **Tailwind CSS**, and a **CSS variable design system** supporting light and dark themes.  
The site emphasizes speed, usability, and scalability, aligning with PixelVerse’s philosophy of custom, UX-first builds.

## 🧱 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + custom CSS variables
- **Theming:** `next-themes` (class-based toggle)
- **Typography:** Poppins (headings), Inter (body)
- **Icons:** Lucide or inline SVGs
- **Animation:** Framer Motion (light use for fade/slide)
- **Deployment:** Netlify / Vercel

## 🎨 Design System

**Goal:** Centralized visual language for all pages and components.

**Structure**

```
/styles/globals.css    # Theme variables
/tailwind.config.js    # Theme extensions + utility mapping
/components/ui/        # Shared UI primitives
```

**CSS Variables (globals.css)**

```css
:root {
  --pv-primary: #3f00e9;
  --pv-primary-2: #c947ff;
  --pv-gradient: linear-gradient(90deg, var(--pv-primary), var(--pv-primary-2));
  --pv-bg: #ffffff;
  --pv-surface: #f7f7fb;
  --pv-text: #111;
  --pv-text-muted: #666;
  --pv-border: #e6e6ef;
  --pv-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}
.dark {
  --pv-bg: #0a0a0f;
  --pv-surface: #12121a;
  --pv-text: #fff;
  --pv-text-muted: #b3b3c2;
  --pv-border: #1f1f2a;
  --pv-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
}
```

**Core Components**

- `Button` (primary gradient, secondary, ghost)
- `Card` (bordered, rounded, surface-aware)
- `SectionHeader`
- `Input`, `Select`, `Textarea`
- `ThemeToggle`, `Modal`, `Drawer`

## 🧩 Page Architecture

Each major page has its own component directory under `/components/` and a Next.js route under `/app/`.

### 1. Homepage

- Hero, Value, Services + Packages, Trust, CTA

### 2. Services

- Strategy intro, Core services grid, Process snapshot, Why choose PixelVerse, Closing CTA

### 3. Packages & Pricing

- Website + SEO packages, Add-ons, Retention incentives, Trust section, CTA

### 4. Portfolio / Work

- Showcase client projects (Jones Pressure Washing, 360 Degree Care, Domani), Testimonials, CTA

### 5. About

- Custom-code + UX-first philosophy, Team bios (Sami & Phil), CTA

### 6. Contact

- Form, Email, Optional call, Trust statement, CTA

### 7. FAQ

- Expandable Q&A accordions, Closing CTA

## ⚙️ Implementation Standards

- Sections: consistent spacing `py-16 md:py-24`
- Containers: `max-w-7xl mx-auto px-6 md:px-8`
- Typography: use `font-heading`, `font-body`
- Gradients: `bg-[var(--pv-gradient)]`
- Dark mode: toggle via `class="dark"`
- Lighthouse ≥ 90, WCAG AA contrast

## ✅ Deliverables

- Complete multi-page site with reusable design tokens
- `/styleguide` documenting base components
- Responsive, theme-aware, SEO-optimized build

## 📁 Project Organization

```
/app/
  home/
  services/
  packages/
  portfolio/
  about/
  contact/
  faq/
/components/
  ui/
  home/
  services/
  packages/
  portfolio/
  about/
  contact/
  faq/
/styles/
  globals.css
  tailwind.config.js
```

## 👥 Team

- **Phil** – Lead Developer (Next.js, Tailwind)
- **Sami** – UX/UI Designer (layout, copy, visuals)

## 🚀 Deployment Targets

- **Environment:** Production build optimized for speed
- **Platform:** Vercel / Netlify
- **Analytics:** SiteBehaviour or Plausible (post-launch)

---

## Documentation Requirements

**IMPORTANT: ALL documentation and audit files MUST be created in the `docs/` directory**

### Directory Structure:

```
docs/
├── audits/
│   └── landing/        # Landing page audit files
├── features/           # Feature documentation
├── technical/          # Technical documentation
└── planning/           # Planning and strategy documents
```

After completing any task or answering any prompt, create an audit file with the following:

### File Naming Convention:

```
docs/audits/landing/YYYY-MM-DD-HH-MM-SS-[brief-description].md
```

Example: `docs/audits/landing/2025-01-15-14-30-45-hero-section.md`

### Audit File Template:

```markdown
# Audit Log - App - [Date Time]

## Prompt Summary

[Summarize what the user asked for]

## Actions Taken

1. [List each action performed]
2. [Include files created/modified]
3. [Note any decisions made]

## Files Changed

- `apps/landing/path/to/file1.tsx` - [Brief description of changes]
- `apps/landing/path/to/file2.ts` - [Brief description of changes]

## Components/Features Affected

- [Component/Feature name]
- [Related dependencies]

## Testing Considerations

- [What should be tested]
- [Potential edge cases]
- [Device/browser testing needs]

## Performance Impact

- [Bundle size changes]
- [Loading time considerations]
- [SEO implications]

## Next Steps

- [Suggested follow-up tasks]
- [A/B testing opportunities]

## Notes

[Any additional context, warnings, or important information]

## Timestamp

Created: YYYY-MM-DD HH:MM:SS
Page Section: [hero/features/pricing/etc]
```

## Core Principles

1. **Conversion First**: Every element should drive toward signup
2. **Story-Driven**: Lead with problem/solution narrative
3. **Social Proof**: Testimonials, numbers, badges throughout
4. **Speed Matters**: Sub-2 second load times
5. **Mobile Optimized**: 60%+ traffic is mobile
6. **SEO Foundation**: Organic traffic is sustainable growth
7. **Test Everything**: Data drives decisions
8. **Accessibility**: WCAG 2.1 AA compliance minimum
9. **Progressive Enhancement**: Core functionality works without JS
10. **Audit Everything**: Document all changes for history
11. **Documentation in /docs**: ALL documentation must be in the docs/ directory

Don't change any immediately provided context in work scope. You can add extra where you see fit, but any direct copy given to you needs to remain untouched.

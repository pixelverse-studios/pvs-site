# PixelVerse Studios – 2025

## ⚠️ CRITICAL: Git Workflow Rules

**NEVER commit or push changes without explicit user approval.**

- Always ask before running `git commit`
- Always ask before running `git push`
- User must explicitly say "commit these changes" or "push to remote"
- After making code changes, STOP and wait for user review
- Only create commits when user explicitly requests it
- Do not batch commits - wait for approval after each set of changes

---

## ⚠️ CRITICAL: Development Server Management

**The user has a local server running at all times. NEVER leave dev servers running in the background.**

- **DO NOT** start `npm run dev` unless absolutely necessary for validation
- **ALWAYS** kill any dev servers you start immediately after validation
- Use `run_in_background: true` when starting servers for testing
- Store the shell ID and kill it with `KillShell` when done
- If you need to verify compilation, use a quick check and immediately close
- Prefer static analysis over running servers when possible

**Example Pattern:**
```bash
# Start server for validation
npm run dev (run_in_background: true, store shell_id)
# Wait for compilation (sleep 5-10s)
# Check BashOutput for success/errors
# IMMEDIATELY kill the shell: KillShell(shell_id)
```

---

## ⚠️ CRITICAL: Deployment Summary Updates (CLIENT COMMUNICATION)

**This is NON-NEGOTIABLE. The deployment summary powers automated client email notifications.**

### THE RULE:
**IMMEDIATELY after completing ANY work, APPEND to `docs/deployment_summary.md` BEFORE doing anything else.**

This is not optional. This is not an afterthought. This is the FIRST action after finishing work.

### Accumulation Workflow:
- **ADD** new bullet points below existing ones (don't replace previous entries)
- The summary accumulates across multiple PRs until `main` is pushed
- Think of it as a changelog for "everything since last deployment"
- The hook **only fires on pushes to `main`** (feature branches don't trigger it)
- After pushing to `main`: hook sends accumulated summary → file auto-resets

### Why This Matters:
- A Git pre-push hook reads this file and sends email notifications to Phil and Sami
- If the summary is empty, the notification is skipped silently
- The user trusts this automation to keep stakeholders informed
- **Skipping this step breaks that trust and leaves clients uninformed**

### Required Actions After EVERY Task:
1. **STOP** - Do not proceed to audit files or wait for commit approval
2. **APPEND** to `docs/deployment_summary.md` (add below existing entries):
   - `## Latest deploy summary` - Plain-language bullet points (what changed, not how)
   - `## Notes for internal team` - Technical details, ticket IDs (optional)
   - `## Changed URLs` - Full URLs affected (for Google re-indexing)
3. **THEN** create the audit file in `docs/audits/landing/`
4. **THEN** wait for user commit approval

### Quick Reference (Accumulated Example):
```markdown
## Latest deploy summary
- Shortened Englewood meta description for better search visibility
- Optimized H1 tags on Fort Lee, Hackensack, Paramus, Ridgewood pages
- Added business phone number to website footer and schema

## Notes for internal team
- PVS-126, PVS-127, PVS-128 completed
- Files: data/services-city-pages.ts, lib/structured-data.ts

## Changed URLs
- https://www.pixelversestudios.io/services/englewood
- https://www.pixelversestudios.io/services/fort-lee
- https://www.pixelversestudios.io/services/hackensack
- https://www.pixelversestudios.io/services/paramus
- https://www.pixelversestudios.io/services/ridgewood
```

**See "Documentation Requirements" section below for full formatting details.**

---

## Project Overview

A custom-coded marketing website for PixelVerse Studios, built with **Next.js 14**, **Tailwind CSS**, and a **CSS variable design system** supporting light and dark themes.
The site emphasizes speed, usability, and scalability, aligning with PixelVerse's philosophy of custom, UX-first builds.

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
- Blog landing hero and article headers must include `pt-hero` so fixed navigation never overlaps content

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

### Deployment Summary Workflow

> ⚠️ **SEE CRITICAL SECTION AT TOP OF FILE** - Appending to the deployment summary is the FIRST action after completing any work. Do not skip this step.

This file is automatically processed by a Git pre-push hook that sends deployment data to the PVS API and triggers an email notification to Phil and Sami. Keep summaries concise and non-technical.

#### Accumulation Model:
- The deployment summary **accumulates changes** across multiple PRs/tasks
- Each completed task **adds** bullet points (don't replace existing entries)
- The file represents "everything changed since the last push to `main`"
- **Feature branch pushes do NOT trigger the hook** - only `main` does
- When `main` is pushed: hook fires → sends full summary → file auto-resets

#### Format:
The file has **three required sections**:

1. **Latest deploy summary** - Client-facing changes (sent in email)
   - Use markdown formatting (bullet points, **bold**, *italic*)
   - Write in plain language (non-technical summaries)
   - Focus on WHAT changed, not HOW it was implemented
   - Each bullet should be one clear, concise sentence
   - **APPEND new bullets below existing ones**

2. **Notes for internal team** - Technical details (NOT sent in email)
   - Use markdown formatting
   - Include environment variables, technical notes, ticket IDs
   - This section is stored but NOT sent to clients
   - **APPEND new notes below existing ones**

3. **Changed URLs** - List all affected page URLs
   - Use bullet points (- https://www.pixelversestudios.io/page)
   - Include full URLs with protocol
   - **URLs must be plain and valid** - no extra text, parentheses, or comments after the URL
   - These URLs are tracked for Google Search Console re-indexing
   - **APPEND new URLs below existing ones** (duplicates are OK, hook dedupes)

#### URL Formatting Examples:
```markdown
## Changed URLs
- https://www.pixelversestudios.io/
- https://www.pixelversestudios.io/dashboard
- https://www.pixelversestudios.io/blog/my-post
```

**Do NOT add notes after URLs:**
```markdown
## Changed URLs
- https://www.pixelversestudios.io/ (all pages)     ❌ WRONG
- https://www.pixelversestudios.io/dashboard        ✅ CORRECT
```

#### Example Good Entries:
- ✅ "Added Google sign-in for team dashboard access"
- ✅ "Fixed contact form validation on mobile devices"
- ✅ "Updated homepage hero section with new messaging"

#### Example Bad Entries:
- ❌ "Implemented Supabase auth with @supabase/ssr package using middleware.ts for JWT validation"
- ❌ "Refactored Button component to use class-variance-authority"

#### Process:
1. Complete your work on a feature/task
2. **IMMEDIATELY APPEND** to `docs/deployment_summary.md` (add below existing entries)
3. Create the detailed audit log in `docs/audits/landing/`
4. Wait for user to review and request commit
5. Commit and push to feature branch (hook skips - file stays populated)
6. When PR is merged and `main` is pushed, the pre-push hook will:
   - Read the accumulated deployment_summary.md
   - Send all changes to PVS API
   - Trigger email notification with full summary
   - Automatically reset the file to template

#### Reset Template (automatically applied after pushing to main):
```markdown
# Deployment Summary

## Latest deploy summary
-

## Notes for internal team
-

## Changed URLs
-
```

**IMPORTANT:**
- The deployment summary **accumulates until `main` is pushed** (true deployment)
- Feature branch pushes do NOT trigger the hook or reset the file
- The pre-push Git hook only fires on `main` branch
- All three sections (deploy summary, internal notes, changed URLs) are required
- Use markdown formatting for the summary and notes sections
- If summary or URLs are empty when pushing `main`, the hook will skip deployment tracking

#### Pre-Push Hook Setup:
Run this once after cloning the repository:
```bash
node scripts/install-hooks.js
```

This installs a Git hook that automatically tracks deployments on `git push` to `main`.

---

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

## 🧠 Hyper-Local SEO Strategy (Active Plan)

**IMPORTANT: Reference `docs/planning/hyper-local-seo-strategy.md` for the full implementation plan.**

### Strategy Overview

We are executing a **hyper-local, city-focused SEO strategy** instead of broad county-level targeting. The goal is to dominate 5 priority cities first, then expand.

### Priority Cities (Phase 1 - Active Focus)

| Priority | City | Target Keywords |
|----------|------|-----------------|
| 1 | **Fort Lee** | "web design Fort Lee NJ", "Fort Lee SEO agency" |
| 2 | **Englewood** | "local SEO agency Englewood NJ", "Englewood web design" |
| 3 | **Hackensack** | "web design Hackensack NJ", "Hackensack digital agency" |
| 4 | **Paramus** | "web design Paramus NJ", "Paramus SEO services" |
| 5 | **Ridgewood** | "web design Ridgewood NJ", "Ridgewood digital agency" |

### Deprioritized Cities (Phase 2 - Later)

- Teaneck, Fair Lawn, Bergenfield, Cliffside Park, River Vale

### Key Implementation Requirements

When working on SEO tasks:

1. **Focus resources on priority 5 cities** - Do not spread effort across all 10 city pages
2. **Per-city LocalBusiness schema required** - Each priority city needs its own schema in `lib/structured-data.ts`
3. **GBP is 32% of local ranking** - Always consider Google Business Profile optimization
4. **Content depth over breadth** - Priority cities need 1,500+ words, local landmarks, city-specific case studies
5. **NAP consistency** - Name, Address, Phone must be identical across all pages and listings

### Technical SEO Status

**Implemented:**
- [x] BreadcrumbList schema on all city pages
- [x] FAQPage schema on /faq
- [x] Unique metadata per city page
- [x] Blog schema (BlogPosting)

**Pending:**
- [ ] Per-city LocalBusiness schema (priority 5 cities)
- [ ] Service schema per city
- [ ] GBP optimization (manual task)
- [ ] Expanded content for Hackensack, Paramus, Ridgewood

### SEO Workflow

- Reference full strategy at `docs/planning/hyper-local-seo-strategy.md`
- Maintain the master SEO checklist at `docs/features/bergen-seo-checklist.md`
- Record detailed research and planning outputs under `docs/planning/`
- After each SEO task, log progress and create an audit entry in `docs/audits/landing/`
- After each SEO change ships, update the SEO log page at `/docs/seo`
- Every SEO change must include patch notes in `docs/audits/landing` (timestamped)

### Expected Timeline

- **Month 1-2:** Fort Lee & Englewood on page 1
- **Month 3-4:** Hackensack & Paramus ranking top 10
- **Month 5-6:** All 5 priority cities ranking, begin Phase 2 expansion

# agents.md — SEO Website Essentials Checklist

This file acts as a universal running checklist for every SEO-focused website project.
Use it to ensure all key optimization elements are consistently implemented across builds.

---

## 🧱 On-Page SEO

- [ ] Each page has a **unique Title Tag** (50–60 characters)
- [ ] Each page has a **Meta Description** (120–160 characters)
- [ ] Only **one H1 tag** per page, descriptive and keyword-focused
- [ ] Headings (H2–H4) include **relevant target keywords**
- [ ] All images include **ALT attributes**
- [ ] Add **canonical tag** to each page
- [ ] Define **`lang="en-US"`** in `<html>` tag
- [ ] Use descriptive **friendly URLs** (no query strings or IDs)
- [ ] Avoid **inline styles** — use CSS classes
- [ ] Ensure **no iFrames** unless absolutely necessary

---

## 🧩 Structured Data

- [ ] Implement **LocalBusiness schema** with NAP (Name, Address, Phone)
- [ ] Include **Organization schema** for company info
- [ ] Validate schema with **Google Rich Results Test**
- [ ] Add **BreadcrumbList schema** on all inner pages
- [ ] Add **Article or Service schema** where relevant

---

## ⚙️ Technical & Performance

- [ ] **Compress images** (prefer WebP, under 300KB each)
- [ ] **Minify** all CSS and JS assets
- [ ] **Lazy-load** offscreen images
- [ ] Use **HTTP/2** and enable **GZIP/Brotli compression**
- [ ] Page load time **<3 seconds**
- [ ] Total page size **<2MB**
- [ ] Core Web Vitals thresholds met:
  - [ ] LCP < 2.5s
  - [ ] CLS < 0.1
  - [ ] TBT < 300ms
- [ ] No console or JS errors
- [ ] Set **viewport meta tag** for responsiveness
- [ ] Test in **Lighthouse** — target 80+ performance score

---

## 🧭 Indexing & Crawlability

- [ ] Robots.txt allows intended pages to be crawled
- [ ] Sitemap.xml includes **only live pages**
- [ ] Remove or redirect all **404/old URLs**
- [ ] Submit sitemap in **Google Search Console**
- [ ] Confirm **no pages blocked by Noindex** unintentionally

---

## 🔗 Backlinks & Off-Page SEO

- [ ] List in **local directories** (Google, Yelp, Care.com, etc.)
- [ ] Build **10+ local backlinks** from reputable sources
- [ ] Vary anchor text between branded and keyword phrases
- [ ] Monitor backlinks via **Search Console** or Ahrefs
- [ ] Disavow spammy or irrelevant backlinks

---

## 📱 Mobile & Usability

- [ ] Mobile PageSpeed score ≥70
- [ ] Buttons/tap targets large and accessible
- [ ] Text legible on small screens
- [ ] Layout stable (no content shifting)
- [ ] Favicon present and visible in SERP

---

## 💬 Social & Marketing Integrations

- [ ] Add **Facebook, LinkedIn, Instagram** links to site footer
- [ ] Install **Facebook Pixel** (if running ads)
- [ ] Implement **Open Graph** and **Twitter Card** meta tags
- [ ] Add **Google Tag Manager** for analytics and conversion tracking
- [ ] Ensure **Google Analytics / GA4** is active and configured

---

## 🌟 Google Business Profile (GBP)

- [ ] Claim and verify the GBP listing
- [ ] Ensure accurate **NAP** and website URL
- [ ] Add **photos, services, and business description**
- [ ] Maintain **4.5★+ rating with 10+ reviews**
- [ ] Reply to all reviews promptly
- [ ] Add **FAQs and service area** coverage

---

## 📧 DNS & Security

- [ ] SSL certificate active (HTTPS)
- [ ] Add **SPF record**
- [ ] Add **DMARC record**
- [ ] Add **DKIM (if supported)**
- [ ] Verify email deliverability in MXToolbox
- [ ] HSTS enabled
- [ ] No mixed content errors

---

## Linear Ticket Creation

When creating Linear tickets for this project:

| Field    | Value               |
| -------- | ------------------- |
| Team     | PixelVerse Studios           |
| Assignee | `me`                |
| Project  | PVS Website |
| Priority | Medium (3)          |

**Labels:** Always apply one from each sub-label group:

- **Environment:** `Front End`, `Fullstack`, `Server`
- **Scope:** `Ticket`, `Epic`
- **Task:** `Feature`, `Bug`, `Improvement`, `Refactor`, `Maintenance`, `Research`

**Description format:**

- `## Summary` - what and why
- `## Current State` / `## Target State` - when applicable
- `## Implementation` - files to modify, code snippets
- `## Acceptance Criteria` - checkbox list

## 🧾 Content & Local Optimization

- [ ] Each service page targets **one main keyword**
- [ ] Add **location modifiers** (e.g. "Home Care in Ridgewood, NJ")
- [ ] Include **service area or county pages** for local SEO
- [ ] Internal linking between related service pages
- [ ] Include **contact info and CTA** on every page
- [ ] Ensure **word count ≥ 800–1,000** on main service pages
- [ ] Add **FAQ sections** with schema markup

---

## 🧪 QA & Reporting

- [ ] Test all forms (contact, quote, etc.)
- [ ] Track events via GA4 (calls, form submissions, CTA clicks)
- [ ] Monitor Search Console for crawl and indexing issues
- [ ] Export initial Lighthouse + PageSpeed benchmark
- [ ] Set monthly SEO tracking for traffic and ranking gains

---

## 📝 Blog Content Guidelines

- Anchor every post to one primary keyword cluster; write a unique title tag (55-60 characters), meta description (<=160 characters), and H1 that mirrors the intent.
- Structure for scanners: lead with an intent-matching intro, use descriptive H2/H3s, short paragraphs, bullets, and jump links for long reads.
- Deliver depth and authority with original insights, trustworthy data, supporting media, and citations that outclass competing results.
- Drive engagement signals: hook readers in the first 100 words, weave internal links every ~250 words, surface in-article CTAs, and close with a concrete next step.
- Keep technical hygiene tight: compress and lazy-load media, use descriptive alt text, ensure mobile responsiveness, and add appropriate schema (FAQ, Article) when relevant.
- Measure and iterate quarterly by reviewing Search Console queries, scroll depth, and CTA performance; update copy, links, and metadata based on what the data shows.

---

**File Owner:** SEO Lead
**Version:** v1.0
**Purpose:** Maintain consistent technical and on-page SEO standards across all client websites.

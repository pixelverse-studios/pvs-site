# [PROJECT_NAME] – [YEAR]

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

**IMMEDIATELY after completing ANY work, update `docs/deployment_summary.md` BEFORE doing anything else.**

This is not optional. This is not an afterthought. This is the FIRST action after finishing work.

### Why This Matters:

- A Git pre-push hook reads this file and sends email notifications to stakeholders
- If the summary is empty, the notification is skipped silently
- The user trusts this automation to keep stakeholders informed
- **Skipping this step breaks that trust and leaves clients uninformed**

### Required Actions After EVERY Task:

1. **STOP** - Do not proceed to audit files or wait for commit approval
2. **UPDATE** `docs/deployment_summary.md` with:
   - `## Latest deploy summary` - Plain-language bullet points (what changed, not how)
   - `## Notes for internal team` - Technical details (optional)
   - `## Changed URLs` - Full URLs affected (for Google re-indexing)
3. **THEN** create the audit file in `docs/audits/`
4. **THEN** wait for user commit approval

### Quick Reference:

```markdown
## Latest deploy summary

- Redesigned the pricing page layout for better clarity
- Fixed mobile navigation menu alignment

## Notes for internal team

- Updated PricingCard component props

## Changed URLs

- https://[DOMAIN]/packages
```

**See "Documentation Requirements" section below for full formatting details.**

---

## Project Overview

<!-- Replace with project description -->

[Brief description of the project, its purpose, and key goals]

---

## Tech Stack

- **Framework:** [e.g., Next.js 14 (App Router)]
- **Styling:** [e.g., Tailwind CSS + custom CSS variables]
- **Theming:** [e.g., next-themes (class-based toggle)]
- **Typography:** [e.g., Poppins (headings), Inter (body)]
- **Icons:** [e.g., Lucide or inline SVGs]
- **Animation:** [e.g., Framer Motion]
- **Deployment:** [e.g., Vercel / Netlify]

---

## Design System

**Goal:** Centralized visual language for all pages and components.

**Structure:**

```
/styles/globals.css    # Theme variables
/tailwind.config.js    # Theme extensions + utility mapping
/components/ui/        # Shared UI primitives
```

**CSS Variables (globals.css):**

```css
:root {
  --primary: #[HEX];
  --primary-2: #[HEX];
  --gradient: linear-gradient(90deg, var(--primary), var(--primary-2));
  --bg: #ffffff;
  --surface: #f7f7fb;
  --text: #111;
  --text-muted: #666;
  --border: #e6e6ef;
  --shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}
.dark {
  --bg: #0a0a0f;
  --surface: #12121a;
  --text: #fff;
  --text-muted: #b3b3c2;
  --border: #1f1f2a;
  --shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
}
```

**Core Components:**

- `Button` (primary, secondary, ghost variants)
- `Card` (bordered, rounded, surface-aware)
- `SectionHeader`
- `Input`, `Select`, `Textarea`
- `ThemeToggle`, `Modal`, `Drawer`

---

## Page Architecture

<!-- List all major pages/routes -->

Each major page has its own component directory under `/components/` and a route under `/app/`.

### Pages:

1. **Homepage** - [Brief description]
2. **[Page Name]** - [Brief description]
3. **[Page Name]** - [Brief description]

---

## Implementation Standards

- Sections: consistent spacing `py-16 md:py-24`
- Containers: `max-w-7xl mx-auto px-6 md:px-8`
- Typography: use `font-heading`, `font-body`
- Dark mode: toggle via `class="dark"`
- Lighthouse ≥ 90, WCAG AA contrast
- Blog/article headers must include `pt-hero` so fixed navigation never overlaps content

---

## Project Organization

```
/app/
  [routes...]
/components/
  ui/
  [page-specific folders...]
/styles/
  globals.css
/lib/
  [utilities...]
```

---

## Team

- **[Name]** – [Role] ([responsibilities])
- **[Name]** – [Role] ([responsibilities])

---

## Deployment Targets

- **Environment:** Production build optimized for speed
- **Platform:** [Vercel / Netlify / etc.]
- **Analytics:** [Analytics tool, if any]

---

## Documentation Requirements

**IMPORTANT: ALL documentation and audit files MUST be created in the `docs/` directory**

### Directory Structure:

```
docs/
├── audits/             # Change audit files
├── features/           # Feature documentation
├── technical/          # Technical documentation
├── reference/          # Reference guides (SEO, blog, etc.)
└── planning/           # Planning and strategy documents
```

### Deployment Summary Workflow

> ⚠️ **SEE CRITICAL SECTION AT TOP OF FILE** - Updating the deployment summary is the FIRST action after completing any work. Do not skip this step.

This file is automatically processed by a Git pre-push hook that sends deployment data to the API and triggers an email notification. Keep summaries concise and non-technical.

#### Format:

The file has **three required sections**:

1. **Latest deploy summary** - Client-facing changes (sent in email)
   - Use markdown formatting (bullet points, **bold**, _italic_)
   - Write in plain language (non-technical summaries)
   - Focus on WHAT changed, not HOW it was implemented
   - Each bullet should be one clear, concise sentence

2. **Notes for internal team** - Technical details (NOT sent in email)
   - Use markdown formatting
   - Include environment variables, technical notes, internal tasks
   - This section is stored but NOT sent to clients

3. **Changed URLs** - List all affected page URLs
   - Use bullet points (- https://[DOMAIN]/page)
   - Include full URLs with protocol
   - **URLs must be plain and valid** - no extra text, parentheses, or comments after the URL
   - These URLs are tracked for Google Search Console re-indexing

#### URL Formatting Examples:

```markdown
## Changed URLs

- https://[DOMAIN]/
- https://[DOMAIN]/dashboard
- https://[DOMAIN]/blog/my-post
```

**Do NOT add notes after URLs:**

```markdown
## Changed URLs

- https://[DOMAIN]/ (all pages) ❌ WRONG
- https://[DOMAIN]/dashboard ✅ CORRECT
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
2. **IMMEDIATELY** update `docs/deployment_summary.md` (see critical section at top)
3. Create the detailed audit log in `docs/audits/`
4. Wait for user to review and request commit
5. When user runs `git push`, the pre-push hook will:
   - Read deployment_summary.md
   - Send data to API
   - Trigger email notification
   - Automatically reset the file to template

#### Reset Template (automatically applied after git push):

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

- The deployment summary is a staging area for the CURRENT deployment only
- The pre-push Git hook automatically processes and resets this file
- All three sections (deploy summary, internal notes, changed URLs) are required
- Use markdown formatting for the summary and notes sections
- If summary or URLs are empty, the hook will skip deployment tracking

#### Pre-Push Hook Setup:

Run this once after cloning the repository:

```bash
node scripts/install-hooks.js
```

---

### Audit File Requirements

After completing any task, create an audit file:

#### File Naming Convention:

```
docs/audits/YYYY-MM-DD-HH-MM-SS-[brief-description].md
```

Example: `docs/audits/2025-01-15-14-30-45-hero-section.md`

#### Audit File Template:

```markdown
# Audit Log - [Feature/Task] - [Date Time]

## Prompt Summary

[Summarize what the user asked for]

## Actions Taken

1. [List each action performed]
2. [Include files created/modified]
3. [Note any decisions made]

## Files Changed

- `path/to/file1.tsx` - [Brief description of changes]
- `path/to/file2.ts` - [Brief description of changes]

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

## Notes

[Any additional context, warnings, or important information]

## Timestamp

Created: YYYY-MM-DD HH:MM:SS
Page Section: [section name]
```

---

## Core Principles

1. **Conversion First**: Every element should drive toward the primary goal
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

**Content Rule:** Don't change any immediately provided context in work scope. You can add extra where you see fit, but any direct copy given to you needs to remain untouched.

---

## Reference Documents

For specialized tasks, read the appropriate reference file:

- **SEO Work:** Read `docs/reference/seo-checklist.md` for comprehensive SEO standards
- **Blog Content:** Read `docs/reference/blog-guidelines.md` for content writing standards

<!-- Add project-specific reference documents as needed -->

## Linear Ticket Creation

When creating Linear tickets for this project:

| Field    | Value              |
| -------- | ------------------ |
| Team     | PixelVerse Studios |
| Assignee | `me`               |
| Project  | PVS Website        |
| Priority | Medium (3)         |

**Labels:** Always apply one from each sub-label group:

- **Environment:** `Front End`, `Fullstack`, `Server`
- **Scope:** `Ticket`, `Epic`
- **Task:** `Feature`, `Bug`, `Improvement`, `Refactor`, `Maintenance`, `Research`

**Description format:**

- `## Summary` - what and why
- `## Current State` / `## Target State` - when applicable
- `## Implementation` - files to modify, code snippets
- `## Acceptance Criteria` - checkbox list

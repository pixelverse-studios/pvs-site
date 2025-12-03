# Audit Log - Reusable Project Templates - 2025-12-02 20:38:02

## Prompt Summary

User requested creation of a generic CLAUDE.md template that can be reused across new client projects. Discussed hybrid approach where core rules stay in CLAUDE.md (always loaded) while SEO and blog guidelines live in separate reference files (read when needed).

## Actions Taken

1. Analyzed current CLAUDE.md to identify what's project-specific vs. universal
2. Created `templates/` directory structure for reusable files
3. Created generic CLAUDE.md template with:
   - All 3 CRITICAL sections (git workflow, dev server, deployment summary)
   - Placeholder sections for project-specific info (overview, tech stack, design system, pages, team)
   - Full documentation requirements (audit files, deployment summary format)
   - Core principles
   - Reference pointers to SEO/blog docs
4. Created SEO checklist reference file with comprehensive checklist
5. Created blog guidelines reference file with content standards
6. Updated deployment_summary.md FIRST (following new critical rule)

## Files Created

- `templates/CLAUDE.md` - Generic template with placeholders for project-specific info (~350 lines)
- `templates/docs/reference/seo-checklist.md` - Comprehensive SEO checklist (~180 lines)
- `templates/docs/reference/blog-guidelines.md` - Blog content guidelines (~150 lines)

## Template Structure

### CLAUDE.md (always loaded):
- CRITICAL: Git Workflow Rules
- CRITICAL: Development Server Management
- CRITICAL: Deployment Summary Updates
- Project Overview (placeholder)
- Tech Stack (placeholder)
- Design System (placeholder with example)
- Page Architecture (placeholder)
- Implementation Standards (generic)
- Project Organization (placeholder)
- Team (placeholder)
- Deployment Targets (placeholder)
- Documentation Requirements (full detail)
- Core Principles
- Reference Documents section (pointers to SEO/blog files)

### Reference files (read when needed):
- `docs/reference/seo-checklist.md` - Full SEO checklist with local SEO strategy template
- `docs/reference/blog-guidelines.md` - Blog writing standards, templates, quality requirements

## Design Decisions

### Hybrid Approach Rationale
- CLAUDE.md is automatically loaded at session start - critical rules must be here
- SEO/blog guidelines are only needed during specific tasks - reference files reduce context noise
- Reference files can be read on-demand without adding to every session's context

### What Stayed in CLAUDE.md
- All CRITICAL sections (must be seen immediately)
- Documentation requirements (applies to every task)
- Core principles (applies to every task)
- Project structure/standards (needed for most tasks)

### What Moved to Reference Files
- SEO checklist (only needed during SEO work)
- Blog guidelines (only needed during content work)
- Local SEO strategy template (only needed for local SEO projects)

## Testing Considerations

- Verify placeholders are clear and easy to fill in
- Test that reference file structure works when copied to new project
- Ensure no PVS-specific content leaked into templates

## Next Steps

- Copy templates to new client projects
- Consider additional reference files (accessibility checklist, performance optimization guide)
- May want to create a setup script that scaffolds docs/ structure

## Notes

Templates are designed to be copied to new projects and customized. The [PLACEHOLDER] format makes it clear what needs to be replaced.

## Timestamp

Created: 2025-12-02 20:38:02
Page Section: internal-tooling

# PixelVerse Studios Site Architecture Guide

> **Purpose:** This document outlines the new website structure aligned with our repositioning from "web agency" to "diagnostic experts who solve visibility problems."
>
> **Related:** See `strategic-repositioning-plan.md` for full positioning strategy.

---

## Quick Context: Why We're Changing

**Old positioning:** "We build custom websites and offer SEO packages"
**New positioning:** "We diagnose why your business is invisible online and engineer the fix"

**Key shifts:**
- Lead with problems, not services
- No more packages/tiers (custom proposals only)
- Discovery-first acquisition (prove expertise before proposing)
- Works for TWO audiences: businesses with broken sites AND businesses without a site

---

## The Two Audiences

Every page must work for both:

| Audience | Their Situation | What They Need to Hear |
|----------|-----------------|------------------------|
| **Has a website** | "My site isn't working—no traffic, no leads" | "We'll find what's broken and fix it" |
| **No website yet** | "I'm invisible, competitors are winning" | "We'll show you the opportunity and build it right" |

This is critical. Language like "get your site audited" excludes the second group.

---

## Site Structure Overview

```
/                           → Homepage
/discovery                  → Primary conversion (free assessment)
/how-we-work                → Process: Diagnose → Prescribe → Deliver → Partner
/problems                   → What we solve (replaces /services)
  /problems/invisible       → "Not showing up in search"
  /problems/not-converting  → "Traffic but no leads"
  /problems/no-website      → "Need to get online right"
/results                    → Case studies & proof
  /results/[case-study]     → Individual case studies
/about                      → Phil & Sami
/contact                    → Simple contact (backup to /discovery)
/insights                   → Blog (diagnostic-focused content)
  /insights/[post]          → Individual posts

/services/[city]            → Local SEO pages (keep for acquisition, reframe content)
```

---

## Page-by-Page Breakdown

### 1. Homepage (`/`)

**Purpose:** Hook visitors with their problem, establish diagnostic authority, drive to discovery.

**Primary audience:** Both (language must work for site owners AND no-site businesses)

**Key sections:**

| Section | Purpose | Content Direction |
|---------|---------|-------------------|
| **Hero** | Hook with pain | Problem-first headline (not "we build websites") |
| **Problem acknowledgment** | "We understand your situation" | Speak to visibility/lead problems |
| **How we're different** | Diagnostic positioning | "We find the problem before proposing solutions" |
| **Proof snapshot** | Build credibility | Key stats, client logos, quick results |
| **How we work** | Process preview | Diagnose → Prescribe → Deliver → Partner |
| **CTA** | Convert | Drive to /discovery |

**Hero headline options:**
- "Your competitors are getting the customers who should be yours"
- "Find out what's costing you customers"
- "We diagnose why businesses are invisible—and fix it"

**What to AVOID:**
- "Custom website design & development" (service-first)
- "Your business deserves more than a template" (assumes they have a template)
- Package mentions or tier language

**Primary CTA:** "Get Your Free Visibility Assessment" → /discovery

---

### 2. Discovery Page (`/discovery` or `/start`)

**Purpose:** Primary conversion point. Replaces packages page as the main action.

**Primary audience:** Both—this is where the intake form qualifies them

**This is the most important new page.** It replaces "view our packages" as the primary action.

**Key sections:**

| Section | Purpose | Content Direction |
|---------|---------|-------------------|
| **Headline** | Outcome-focused hook | "Find out what's costing you customers" |
| **What you'll get** | Set expectations | Specific deliverables from the assessment |
| **How it works** | Reduce friction | Simple 1-2-3 process |
| **Intake form** | Qualify & capture | Asks key questions including "Do you have a website?" |
| **Trust signals** | Reduce risk | "Free, no obligation, takes 15 minutes" |

**What the assessment includes (for existing sites):**
- Site performance analysis
- SEO visibility check
- Competitor comparison
- Conversion gap identification
- Prioritized recommendations

**What the assessment includes (for no-site businesses):**
- Market opportunity analysis
- Competitor landscape review
- Keyword/search demand research
- Recommended approach
- Ballpark scope discussion

**Intake form fields:**
1. Name
2. Email
3. Business name
4. **Do you have an existing website?** (Yes/No—this branches the assessment)
5. Website URL (if yes)
6. What's your biggest challenge right now? (optional, open text)
7. How did you hear about us? (optional)

**After submission:**
- Confirmation message with timeline
- Email with next steps
- Internal notification to Phil/Sami

---

### 3. How We Work (`/how-we-work` or `/process`)

**Purpose:** Explain the diagnostic process, differentiate from "pick a package" agencies.

**Primary audience:** Both

**The four phases:**

#### Phase 1: Diagnose
> "We start by understanding your situation—not selling you a solution."

- For existing sites: Full audit of performance, SEO, UX, conversion
- For new businesses: Market research, competitor analysis, opportunity mapping
- Deliverable: Assessment report with findings

#### Phase 2: Prescribe
> "Based on what we find, we recommend exactly what you need—nothing more."

- Custom proposal tailored to diagnosed problems
- Clear scope, timeline, and investment
- No cookie-cutter packages

#### Phase 3: Deliver
> "We build the solution with you involved at every step."

- Design and development process
- Regular check-ins and feedback loops
- No disappearing acts

#### Phase 4: Partner
> "Launch is the beginning, not the end."

- Ongoing support options
- Performance monitoring
- Continuous improvement

**Key differentiator to emphasize:**
> "Most agencies skip straight to Phase 3. They sell you a website without understanding your actual problem. We don't prescribe without diagnosing first."

**CTA:** "Ready to start? Get your free assessment" → /discovery

---

### 4. Problems We Solve (`/problems`)

**Purpose:** Replace /services. Organize by pain points, not service categories.

**Primary audience:** Both

**Why this framing:**
- Visitors think "I'm not getting leads" not "I need SEO services"
- Problem-first language creates recognition: "That's me!"
- Positions you as problem-solvers, not vendors

**Structure options:**

**Option A: Hub page with sub-pages**
```
/problems                    → Overview of all problems
  /problems/invisible        → "Not showing up in search"
  /problems/not-converting   → "Traffic but no leads"
  /problems/no-website       → "Need to get online right"
  /problems/outgrown         → "Website can't keep up with growth"
```

**Option B: Single long-form page**
All problems on one page with defined sections and defined anchor links.

**For each problem, cover:**

| Element | Content |
|---------|---------|
| **The problem** | What it feels like, symptoms |
| **Why it happens** | Common causes (educates without blaming) |
| **How we diagnose** | What we look for |
| **How we solve** | General approach (not specific deliverables) |
| **Proof** | Mini case study or stat |
| **CTA** | "Let's diagnose your situation" → /discovery |

**Example: "Invisible Online" problem page**

> **The Problem:**
> You have a business. You're good at what you do. But when potential customers search for services you offer, they find your competitors instead.
>
> **Why It Happens:**
> - Your site isn't optimized for search engines
> - Competitors have more content, better structure, stronger signals
> - Technical issues are holding you back (speed, mobile, indexing)
> - You're not showing up in local search or maps
>
> **How We Diagnose:**
> We analyze your current visibility, compare you to competitors ranking above you, and identify exactly what's missing.
>
> **How We Solve:**
> Custom strategy based on findings—could be technical fixes, content development, local SEO, or a full rebuild if the foundation is broken.

---

### 5. Results / Case Studies (`/results`)

**Purpose:** Prove the diagnostic approach works. Show problem → solution → outcome.

**Primary audience:** Both (need cases for existing site fixes AND new builds)

**Critical for credibility.** Claims without proof feel hollow.

**Case study structure:**

Each case study should follow this arc:

| Section | Content |
|---------|---------|
| **The Client** | Who they are, industry, size |
| **The Problem** | What was wrong (in their words if possible) |
| **What We Found** | Diagnostic findings—specific issues identified |
| **What We Built** | The solution—what we actually did |
| **The Results** | Metrics, outcomes, before/after |
| **Client Quote** | Testimonial if available |

**Example case study outline:**

> **Fort Lee Dental Practice**
>
> **The Problem:** "We had a website but it wasn't doing anything. Patients told us they couldn't find us on Google."
>
> **What We Found:**
> - Site loading in 8+ seconds (should be under 2)
> - No local SEO optimization
> - Zero Google Business Profile activity
> - Competitors outranking for "dentist Fort Lee NJ"
>
> **What We Built:**
> - Complete site rebuild with performance focus
> - Local SEO strategy targeting Fort Lee + surrounding areas
> - GBP optimization and review generation system
>
> **The Results:**
> - Page 1 ranking for "dentist Fort Lee NJ" in 3 months
> - 145% increase in website appointment requests
> - 4.8 star rating with 40+ new reviews

**Minimum viable:** 2-3 case studies before launch. Ideally:
- 1 existing site turnaround
- 1 new site build
- 1 ongoing partnership / SEO campaign

---

### 6. About (`/about`)

**Purpose:** Humanize the agency. Show it's two senior experts, not a faceless company.

**Primary audience:** Both

**Key messages:**
- Two specialists, not a big agency
- Senior people do the work (no handoff to juniors)
- Deep expertise in both design (Sami) and engineering (Phil)
- Partnership mentality

**Sections:**

| Section | Content |
|---------|---------|
| **Our philosophy** | Why we diagnose before prescribing |
| **Phil** | Background, expertise, approach |
| **Sami** | Background, expertise, approach |
| **Why two people** | "You get the people who do the work" |
| **How we work together** | Design + engineering in lockstep |

**Tone:** Professional but personal. Include enough personality to feel human.

**What to emphasize:**
- Combined experience
- Complementary skills
- Direct access (no account managers)
- Invested in outcomes, not deliverables

---

### 7. Contact (`/contact`)

**Purpose:** Simple backup conversion path for people who don't want the full discovery process.

**Primary audience:** Both

**Keep it simple.** This is for people who already know they want to talk.

**Content:**
- Brief intro: "Ready to talk? We'd love to hear from you."
- Contact form (name, email, message)
- Email address (direct)
- Optional: Phone or calendar link
- Brief mention of discovery: "Not sure what you need? Start with a free assessment →"

**This is NOT the primary CTA.** /discovery is. But some people want to skip straight to conversation.

---

### 8. Insights / Blog (`/insights`)

**Purpose:** Demonstrate diagnostic expertise through content. SEO value.

**Primary audience:** Both (content topics should cover both situations)

**Content strategy shift:**

| Old Focus | New Focus |
|-----------|-----------|
| "Why custom websites matter" | "5 signs your website is losing you customers" |
| "SEO basics" | "Why [industry] businesses struggle to rank—and how to fix it" |
| Generic advice | Diagnostic, problem-focused content |

**Content categories:**
- Problem diagnosis ("Is your site actually broken?")
- Industry-specific ("Why dentist websites fail")
- Local market ("The state of Fort Lee business websites")
- Competitive analysis ("What your competitors are doing right")

**Each post should:**
- Lead with a problem or question
- Demonstrate diagnostic expertise
- End with CTA to /discovery

---

### 9. Local/City Pages (`/services/[city]`)

**Purpose:** Local SEO acquisition. Rank for "web design [city] NJ" etc.

**Primary audience:** Local business owners in target cities

**Keep these for SEO** but reframe the content.

**Current URL structure stays:**
- `/services/web-development/fort-lee`
- `/services/seo/englewood`
- etc.

**Content reframe:**

| Old Approach | New Approach |
|--------------|--------------|
| "We serve Fort Lee" | "Why Fort Lee businesses are losing customers online" |
| Feature lists | Problem diagnosis for local market |
| Package CTAs | Discovery CTAs |

**Each city page should include:**
- Local problem framing ("Fort Lee business owners face...")
- Local market insights (competitor landscape, search behavior)
- Local proof if available (case studies from that area)
- Local-specific CTA

**See `strategic-repositioning-plan.md` → "Local SEO & City Pages Strategy" for full details.**

---

## Pages to Remove

| Page | Action | Reason |
|------|--------|--------|
| `/packages` | **Remove entirely** | Contradicts custom-only positioning |
| `/services` (current form) | **Replace with /problems** | Reframe around problems, not services |

**Redirect strategy:**
- `/packages` → `/discovery` (primary conversion)
- `/services` → `/problems` (or homepage if /problems not ready)

---

## Page Priority Order

**Phase 1: Foundation (Must have for launch)**
1. Homepage (rewritten)
2. /discovery (new)
3. /about (updated)
4. /contact (simplified)

**Phase 2: Depth (Add within 2-4 weeks)**
5. /how-we-work (new)
6. /problems (new, replaces /services)
7. /results with 2-3 case studies (new)

**Phase 3: Content (Ongoing)**
8. /insights posts (diagnostic-focused)
9. City pages (reframe existing content)
10. Industry pages (if pursuing vertical focus)

---

## User Flows

### Flow 1: Problem-Aware Visitor (Has Site)
```
Google: "why isn't my website getting traffic"
    ↓
Lands on: Blog post about visibility problems
    ↓
Clicks: CTA to /discovery
    ↓
Fills: Intake form (indicates has existing site)
    ↓
Receives: Site audit + competitive analysis
    ↓
Gets: Custom proposal
```

### Flow 2: Local Search Visitor
```
Google: "web design fort lee nj"
    ↓
Lands on: /services/web-development/fort-lee
    ↓
Sees: Problem-first messaging about Fort Lee businesses
    ↓
Clicks: "Get your free assessment" → /discovery
    ↓
Fills: Intake form
    ↓
Receives: Assessment tailored to their situation
```

### Flow 3: No-Site Business Owner
```
Referral or direct visit
    ↓
Lands on: Homepage
    ↓
Sees: "Your competitors are getting customers who should be yours"
    ↓
Thinks: "That's me—I don't even have a website"
    ↓
Clicks: "Find out what's costing you customers" → /discovery
    ↓
Fills: Intake form (indicates NO existing site)
    ↓
Receives: Market opportunity analysis
    ↓
Gets: Custom proposal for new build
```

---

## Content Principles (All Pages)

### Do:
- Lead with problems, not services
- Use "you" language (speak to them, not about yourself)
- Be specific (stats, examples, details)
- End every page with clear CTA to /discovery
- Show proof where possible

### Don't:
- Mention packages or tiers
- Use service-first headlines ("Web Design Services")
- Assume they have a website (unless on a page specifically for that)
- Use jargon without explanation
- Make claims without evidence

### Tone:
- Confident but not arrogant
- Expert but accessible
- Direct but warm
- Professional but human

---

## Technical Notes

### URL Structure
- Keep URLs clean and descriptive
- `/problems/invisible` not `/problems/problem-1`
- `/results/fort-lee-dental` not `/results/case-study-3`

### Redirects Needed
- `/packages` → `/discovery`
- `/services` → `/problems` (once built)
- Any old blog posts → updated equivalents

### Forms
- /discovery intake form needs conditional logic (show different fields based on "has website" answer)
- All forms should notify team immediately
- Consider calendar integration for booking discovery calls

---

## Questions to Resolve

1. **Discovery page URL:** `/discovery` vs `/start` vs `/assessment`?
2. **Problems structure:** Hub with sub-pages or single long-form page?
3. **Case studies:** Do we have 2-3 ready to write up?
4. **City pages:** Update content now or after core pages done?
5. **Blog:** Rebrand to "Insights" or keep "Blog"?

---

## Summary

The new site structure centers around **one primary conversion path**: the /discovery page.

Everything else—homepage, problems, results, about, blog, city pages—exists to:
1. Attract the right visitors (SEO, content)
2. Help them feel understood (problem-first messaging)
3. Build credibility (proof, expertise, team)
4. Drive them to /discovery (clear CTAs)

The discovery page qualifies them, and we take it from there with custom proposals.

---

*Document created: January 2026*
*Owner: Phil & Sami*
*Status: Planning*
